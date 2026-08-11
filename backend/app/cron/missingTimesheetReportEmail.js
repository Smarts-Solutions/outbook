// missingTimesheetReportEmail.js
const pool = require('../config/database');
const { parentPort } = require("worker_threads");
const { missingTimesheetReport } = require("../models/reportModel");
const { commonEmail } = require("../utils/commonEmail");
const { logEmail } = require("../utils/emailLogger");
const xlsx = require('xlsx');

// Helper to get all subordinates
async function getAllSubordinates(pool, managerId) {
    const [lineManagers] = await pool.execute('SELECT staff_by, staff_to FROM line_managers');
    const managerToEmployees = {};
    lineManagers.forEach(row => {
        if (!managerToEmployees[row.staff_to]) {
            managerToEmployees[row.staff_to] = [];
        }
        managerToEmployees[row.staff_to].push(row.staff_by);
    });

    let subordinates = new Set();
    let queue = [managerId];
    subordinates.add(managerId);

    while (queue.length > 0) {
        let current = queue.shift();
        let directReports = managerToEmployees[current] || [];
        for (let emp of directReports) {
            if (!subordinates.has(emp)) {
                subordinates.add(emp);
                queue.push(emp);
            }
        }
    }
    return Array.from(subordinates);
}

// Missing Timesheet Report Email Worker
parentPort.on("message", async (rows) => {
    for (const row of rows) {
        try {
            const [[getStaffNameMissingReport]] = await pool.execute(`CALL GetLastWeekMissingTimesheetReport(${row.id})`);

            if (getStaffNameMissingReport && getStaffNameMissingReport.length > 0) {

                // --- 1. Get unique staff missing timesheets (For Tabs 1, 2, 3) ---
                let uniqueStaffs = [];
                let processedStaff = new Set();
                getStaffNameMissingReport.forEach(val => {
                    if (!processedStaff.has(val?.staff_id)) {
                        processedStaff.add(val?.staff_id);
                        uniqueStaffs.push({
                            staff_id: val?.staff_id,
                            staff_fullname: val?.staff_fullname,
                            staff_email: val?.staff_email
                        });
                    }
                });

                const staffIds = uniqueStaffs.map(s => s.staff_id);

                // --- 2. Fetch managers for the missing staff ---
                let managersMap = {}; // employee_id -> { manager_id, manager_name, manager_email }
                if (staffIds.length > 0) {
                    const placeholders = staffIds.map(() => '?').join(',');
                    const managerQuery = `
                SELECT 
                    lm.staff_by as employee_id,
                    m.id as manager_id,
                    CONCAT(m.first_name, ' ', m.last_name) as manager_name,
                    m.email as manager_email
                FROM line_managers lm
                JOIN staffs m ON lm.staff_to = m.id
                WHERE lm.staff_by IN (${placeholders})
            `;
                    const [managerRows] = await pool.execute(managerQuery, staffIds);
                    managerRows.forEach(mgrRow => {
                        if (!managersMap[mgrRow.employee_id]) {
                            managersMap[mgrRow.employee_id] = {
                                manager_id: mgrRow.manager_id,
                                manager_name: mgrRow.manager_name,
                                manager_email: mgrRow.manager_email
                            };
                        }
                    });
                }

                // Fetch all staffs (moved up to include created_at)
                const [allStaffsRaw] = await pool.execute("SELECT s.id as staff_id, s.employee_number, CONCAT(s.first_name, ' ', s.last_name) as staff_fullname, s.email as staff_email, DATE_FORMAT(s.created_at, '%d-%m-%y') as created_at_date, s.created_at, s.status, s.is_disable, r.role as role_name FROM staffs s LEFT JOIN roles r ON s.role_id = r.id");

                const staffDetailsMap = {};
                const allStaffs = [];
                allStaffsRaw.forEach(s => {
                    staffDetailsMap[s.staff_id] = s;
                    if (String(s.status) === '1' && String(s.is_disable) === '0') {
                        allStaffs.push(s);
                    }
                });

                let historicalSubmissions = {};
                if (staffIds.length > 0) {
                    const placeholders = staffIds.map(() => '?').join(',');
                    const histQuery = `
                        SELECT 
                            staff_id, 
                            COUNT(DISTINCT CASE WHEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= YEARWEEK(CURDATE() - INTERVAL 4 WEEK, 1) THEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) ELSE NULL END) as submitted_1m,
                            COUNT(DISTINCT CASE WHEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= YEARWEEK(CURDATE() - INTERVAL 13 WEEK, 1) THEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) ELSE NULL END) as submitted_3m,
                            COUNT(DISTINCT CASE WHEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= YEARWEEK(CURDATE() - INTERVAL 26 WEEK, 1) THEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) ELSE NULL END) as submitted_6m,
                            COUNT(DISTINCT CASE WHEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= YEARWEEK(CURDATE() - INTERVAL 52 WEEK, 1) THEN YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) ELSE NULL END) as submitted_1y
                        FROM timesheet
                        WHERE staff_id IN (${placeholders})
                          AND submit_status = '1'
                          AND YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= YEARWEEK(CURDATE() - INTERVAL 52 WEEK, 1)
                          AND YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) <= YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
                        GROUP BY staff_id
                    `;
                    const [histRows] = await pool.execute(histQuery, staffIds);
                    histRows.forEach(row => {
                        historicalSubmissions[row.staff_id] = {
                            submitted_1m: parseInt(row.submitted_1m || 0),
                            submitted_3m: parseInt(row.submitted_3m || 0),
                            submitted_6m: parseInt(row.submitted_6m || 0),
                            submitted_1y: parseInt(row.submitted_1y || 0)
                        };
                    });
                }

                // --- 3. Process Tab 1: All Missing Employees ---
                let tab1Data = [];
                let sno = 1;
                const nowMs = Date.now();
                const msPerWeek = 7 * 24 * 60 * 60 * 1000;

                uniqueStaffs.forEach(staff => {
                    const mgr = managersMap[staff.staff_id];
                    const managerName = mgr ? mgr.manager_name : "-";

                    const staffInfo = staffDetailsMap[staff.staff_id];
                    const createdAtStr = staffInfo ? staffInfo.created_at_date : "-";

                    let tenureWeeks = 9999;
                    if (staffInfo && staffInfo.created_at) {
                        const createdMs = new Date(staffInfo.created_at).getTime();
                        tenureWeeks = Math.floor((nowMs - createdMs) / msPerWeek);
                    }

                    const hist = historicalSubmissions[staff.staff_id] || { submitted_1m: 0, submitted_3m: 0, submitted_6m: 0, submitted_1y: 0 };

                    const missed1m = tenureWeeks >= 4 ? (4 - hist.submitted_1m) : "-";
                    const missed3m = tenureWeeks >= 13 ? (13 - hist.submitted_3m) : "-";
                    const missed6m = tenureWeeks >= 26 ? (26 - hist.submitted_6m) : "-";
                    const missed1y = tenureWeeks >= 52 ? (52 - hist.submitted_1y) : "-";

                    tab1Data.push({
                        "S.No.": sno++,
                        "Staff Name": staff.staff_fullname,
                        "Staff Email": staff.staff_email,
                        "Line Manager": managerName,
                        "Employee ID": staffInfo ? staffInfo.employee_number : "-",
                        "Monthly Missed": missed1m,
                        "Quarterly Missed": missed3m,
                        "Half Yearly Missed": missed6m,
                        "Yearly Missed": missed1y,
                        "Created Date": createdAtStr
                    });
                });

                // --- 4. Process Tab 2: Missing Managers ---
                const [allManagers] = await pool.execute('SELECT DISTINCT staff_to FROM line_managers');
                const allManagerIds = new Set(allManagers.map(m => m.staff_to));

                let tab2Data = [];
                let snoTab2 = 1;
                uniqueStaffs.forEach(staff => {
                    if (allManagerIds.has(staff.staff_id)) {
                        const staffInfo = staffDetailsMap[staff.staff_id];
                        const createdAtStr = staffInfo ? staffInfo.created_at_date : "-";

                        let tenureWeeks = 9999;
                        if (staffInfo && staffInfo.created_at) {
                            const createdMs = new Date(staffInfo.created_at).getTime();
                            tenureWeeks = Math.floor((nowMs - createdMs) / msPerWeek);
                        }

                        const hist = historicalSubmissions[staff.staff_id] || { submitted_1m: 0, submitted_3m: 0, submitted_6m: 0, submitted_1y: 0 };

                        const missed1m = tenureWeeks >= 4 ? (4 - hist.submitted_1m) : "-";
                        const missed3m = tenureWeeks >= 13 ? (13 - hist.submitted_3m) : "-";
                        const missed6m = tenureWeeks >= 26 ? (26 - hist.submitted_6m) : "-";
                        const missed1y = tenureWeeks >= 52 ? (52 - hist.submitted_1y) : "-";

                        tab2Data.push({
                            "S.No.": snoTab2++,
                            "Manager Name": staff.staff_fullname,
                            "Manager Email": staff.staff_email,
                            "Employee ID": staffInfo ? staffInfo.employee_number : "-",
                            "Monthly Missed": missed1m,
                            "Quarterly Missed": missed3m,
                            "Half Yearly Missed": missed6m,
                            "Yearly Missed": missed1y,
                            "Created Date": createdAtStr
                        });
                    }
                });

                // --- 5. Process Tab 3: Grouped by Manager ---
                let groupedByManager = {};
                uniqueStaffs.forEach(staff => {
                    const mgr = managersMap[staff.staff_id];
                    if (mgr) {
                        if (!groupedByManager[mgr.manager_id]) {
                            groupedByManager[mgr.manager_id] = {
                                manager_name: mgr.manager_name,
                                manager_email: mgr.manager_email,
                                employees: []
                            };
                        }
                        groupedByManager[mgr.manager_id].employees.push(staff);
                    } else {
                        if (!groupedByManager['unassigned']) {
                            groupedByManager['unassigned'] = {
                                manager_name: "Unassigned",
                                manager_email: "-",
                                employees: []
                            };
                        }
                        groupedByManager['unassigned'].employees.push(staff);
                    }
                });

                let tab3Data = [];
                let snoTab3 = 1;
                for (const [managerId, data] of Object.entries(groupedByManager)) {
                    const managerStaffInfo = staffDetailsMap[managerId];

                    tab3Data.push({
                        "S.No.": snoTab3++,
                        "Name": `Manager: ${data.manager_name}`,
                        "Email": data.manager_email,
                        "Employee ID": managerStaffInfo?.employee_number || "-",
                        "Role": managerStaffInfo?.role_name || "-"
                    });
                    data.employees.forEach(emp => {
                        const empInfo = staffDetailsMap[emp.staff_id];
                        tab3Data.push({
                            "S.No.": "",
                            "Name": emp.staff_fullname,
                            "Email": emp.staff_email,
                            "Employee ID": empInfo?.employee_number || "-",
                            "Role": empInfo?.role_name || "-"
                        });
                    });
                    tab3Data.push({ "S.No.": "", "Name": "", "Email": "", "Employee ID": "", "Role": "" });
                }

                // --- NEW LOGIC: Tabs 4 & 5 (4-Week History) ---

                // A. Determine scope of relevant staffs
                const [[roleRow]] = await pool.execute('SELECT r.role FROM staffs s JOIN roles r ON s.role_id = r.id WHERE s.id = ?', [row.id]);
                const roleName = roleRow ? roleRow.role : '';

                let relevantStaffIds = [];
                if (['SUPERADMIN', 'ADMIN', 'MANAGEMENT'].includes(roleName)) {
                    relevantStaffIds = allStaffs.map(s => s.staff_id);
                } else {
                    relevantStaffIds = await getAllSubordinates(pool, row.id);
                    // Filter to only active staffs
                    const activeStaffIds = new Set(allStaffs.map(s => s.staff_id));
                    relevantStaffIds = relevantStaffIds.filter(id => activeStaffIds.has(id));
                }

                let tab4Data = [];
                let tab5Data = [];

                if (relevantStaffIds.length > 0) {
                    // B. Get YEARWEEK for last 4 weeks
                    const [weeksRows] = await pool.execute(`
                SELECT 
                    YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1) as w1,
                    YEARWEEK(CURDATE() - INTERVAL 2 WEEK, 1) as w2,
                    YEARWEEK(CURDATE() - INTERVAL 3 WEEK, 1) as w3,
                    YEARWEEK(CURDATE() - INTERVAL 4 WEEK, 1) as w4
            `);
                    const { w1, w2, w3, w4 } = weeksRows[0];

                    // C. Fetch timesheets for relevant staffs in this date range
                    const placeholders4W = relevantStaffIds.map(() => '?').join(',');
                    const tsQuery = `
                SELECT 
                    staff_id,
                    YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) as ts_week,
                    COALESCE(submit_status, '0') as submit_status
                FROM timesheet
                WHERE staff_id IN (${placeholders4W})
                  AND YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) >= ?
                  AND YEARWEEK(COALESCE(monday_date, tuesday_date, wednesday_date, thursday_date, friday_date, saturday_date, sunday_date), 1) <= ?
            `;
                    const tsParams = [...relevantStaffIds, w4, w1];
                    const [tsRows] = await pool.execute(tsQuery, tsParams);

                    // D. Map Submissions (w1 = Last Week ... w4 = 4 Weeks Ago)
                    const submissionMap = {};
                    for (let id of relevantStaffIds) {
                        submissionMap[id] = { [w1]: false, [w2]: false, [w3]: false, [w4]: false };
                    }
                    for (let r of tsRows) {
                        if (r.submit_status === '1' && submissionMap[r.staff_id] && submissionMap[r.staff_id][r.ts_week] !== undefined) {
                            submissionMap[r.staff_id][r.ts_week] = true;
                        }
                    }

                    // E. Process Tab 4 (Consistent Defaulters) & Tab 5 (Improvement)
                    let snoTab4 = 1;
                    let snoTab5 = 1;

                    for (let id of relevantStaffIds) {
                        const sData = submissionMap[id];
                        const w1Sub = sData[w1]; // Last week
                        const w2Sub = sData[w2];
                        const w3Sub = sData[w3];
                        const w4Sub = sData[w4];

                        const staffInfo = staffDetailsMap[id];
                        if (!staffInfo) continue;

                        const getWeekStr = (weeksAgo) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (7 * weeksAgo));
                            const w = Math.ceil(d.getDate() / 7);
                            const m = d.getMonth() + 1;
                            const y = d.getFullYear();
                            return `Week ${w} Month ${m} Year ${y}`;
                        };
                        const w1Header = `${getWeekStr(1)} (Last Week)`;
                        const w2Header = getWeekStr(2);
                        const w3Header = getWeekStr(3);
                        const w4Header = getWeekStr(4);

                        const missedCount = (!w1Sub ? 1 : 0) + (!w2Sub ? 1 : 0) + (!w3Sub ? 1 : 0) + (!w4Sub ? 1 : 0);

                        // Tab 4: Missed at least 3 weeks out of the last 4 weeks
                        if (missedCount >= 3) {
                            tab4Data.push({
                                "S.No.": snoTab4++,
                                "Staff Name": staffInfo.staff_fullname,
                                "Staff Email": staffInfo.staff_email,
                                "Employee ID": staffInfo.employee_number || "-",
                                [w1Header]: w1Sub ? "Submitted" : "Missed",
                                [w2Header]: w2Sub ? "Submitted" : "Missed",
                                [w3Header]: w3Sub ? "Submitted" : "Missed",
                                [w4Header]: w4Sub ? "Submitted" : "Missed"
                            });
                        }

                        // Tab 5: Improvement (Missed >= 2 weeks in total, but submitted at least 1 in the last 2 weeks)
                        if (missedCount >= 2 && (w1Sub || w2Sub)) {
                            tab5Data.push({
                                "S.No.": snoTab5++,
                                "Staff Name": staffInfo.staff_fullname,
                                "Staff Email": staffInfo.staff_email,
                                "Employee ID": staffInfo.employee_number || "-",
                                [w1Header]: w1Sub ? "Submitted" : "Missed",
                                [w2Header]: w2Sub ? "Submitted" : "Missed",
                                [w3Header]: w3Sub ? "Submitted" : "Missed",
                                [w4Header]: w4Sub ? "Submitted" : "Missed"
                            });
                        }
                    }
                }

                // --- 6. Generate Excel File ---
                const totalMissing = tab1Data.length;
                const totalMissingManagers = tab2Data.length;
                const totalDefaulters = tab4Data.length;
                const totalImproved = tab5Data.length;

                const lastWeekDate = new Date();
                lastWeekDate.setDate(lastWeekDate.getDate() - 7);
                const weekNum = Math.ceil(lastWeekDate.getDate() / 7);
                const monthNum = lastWeekDate.getMonth() + 1;
                const yearNum = lastWeekDate.getFullYear();
                const lastWeekStr = `Week ${weekNum}, Month ${monthNum}, Year ${yearNum}`;
                const shortLastWeekStr = `Week ${weekNum} Month ${monthNum} Year ${yearNum}`;

                const summaryData = [
                    { "Summary": `Total employees who did not submit timesheet (${lastWeekStr})`, "Employees Count": totalMissing },
                    { "Summary": `Total line managers who did not submit timesheet (${lastWeekStr})`, "Employees Count": totalMissingManagers },
                    { "Summary": "Employees missing 3 or more weeks (Last 4 Weeks)", "Employees Count": totalDefaulters },
                    { "Summary": "Employees showing improvement (Submitted recently after misses)", "Employees Count": totalImproved }
                ];

                const wb = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(summaryData), `Summary ${shortLastWeekStr}`.substring(0, 31));
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab1Data), "Missing Employees");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab2Data), "Missing Line Managers");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab3Data), "Line Manager – Employee Missing");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab4Data.length ? tab4Data : [{ "Message": "No habitual misses." }]), "Missed 3 or More Weeks");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab5Data.length ? tab5Data : [{ "Message": "No improvements found." }]), "Recent Improvements");

                const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

                // --- 7. Prepare Email Content ---
                // TODO: REVERT THIS AFTER TESTING
                // Override email for testing purposes
                // let toEmail = user.staff_email;
                let toEmail = "shaktijatpnp09@gmail.com"; // row.staff_email;
                let subjectEmail = `Missing Timesheet Report - ${lastWeekStr}`;
                const filename = `MissingTimesheetReport_${shortLastWeekStr}.xlsx`;

                let htmlEmail = `
            <h3>Please find the attached Missing Timesheet Report for ${lastWeekStr}.</h3>
        `;

                // --- 8. Send Email and Log ---
                const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", excelBuffer, filename);

                const attachmentJson = {
                    summary: summaryData,
                    tab1: tab1Data,
                    tab2: tab2Data,
                    tab3: tab3Data,
                    tab4: tab4Data,
                    tab5: tab5Data
                };

                logEmail({
                    toEmail: toEmail,
                    filename: filename,
                    attachment: attachmentJson,
                    logFileName: "missingTimesheetReportEmail.json",
                });

                if (emailSent) {
                    parentPort.postMessage(`✅ Email sent to: ${row.staff_email}`);
                } else {
                    parentPort.postMessage(`❌ Failed to send email to: ${row.staff_email}`);
                }
            } else {
                parentPort.postMessage(`ℹ️ No missing timesheet report for ${row.staff_email}`);
            }
        } catch (err) {
            parentPort.postMessage(`❌ Failed for ${row.id}: ${err.message}`);
        }
    }
});