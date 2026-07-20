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

                // --- 3. Process Tab 1: All Missing Employees ---
                let tab1Data = [];
                let sno = 1;
                uniqueStaffs.forEach(staff => {
                    tab1Data.push({
                        "S.No.": sno++,
                        "Staff Name": staff.staff_fullname,
                        "Staff Email": staff.staff_email
                    });
                });

                // --- 4. Process Tab 2: Missing Managers ---
                const [allManagers] = await pool.execute('SELECT DISTINCT staff_to FROM line_managers');
                const allManagerIds = new Set(allManagers.map(m => m.staff_to));

                let tab2Data = [];
                let snoTab2 = 1;
                uniqueStaffs.forEach(staff => {
                    if (allManagerIds.has(staff.staff_id)) {
                        tab2Data.push({
                            "S.No.": snoTab2++,
                            "Manager Name": staff.staff_fullname,
                            "Manager Email": staff.staff_email
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
                    tab3Data.push({
                        "S.No.": snoTab3++,
                        "Name": `Manager: ${data.manager_name}`,
                        "Email": data.manager_email,
                        "Role": "Manager"
                    });
                    data.employees.forEach(emp => {
                        tab3Data.push({
                            "S.No.": "",
                            "Name": emp.staff_fullname,
                            "Email": emp.staff_email,
                            "Role": "Employee"
                        });
                    });
                    tab3Data.push({ "S.No.": "", "Name": "", "Email": "", "Role": "" });
                }

                // --- NEW LOGIC: Tabs 4 & 5 (4-Week History) ---

                // A. Determine scope of relevant staffs
                const [[roleRow]] = await pool.execute('SELECT r.role FROM staffs s JOIN roles r ON s.role_id = r.id WHERE s.id = ?', [row.id]);
                const roleName = roleRow ? roleRow.role : '';

                const [allStaffs] = await pool.execute("SELECT id as staff_id, CONCAT(first_name, ' ', last_name) as staff_fullname, email as staff_email FROM staffs WHERE status = '1' AND is_disable = '0'");

                let relevantStaffIds = [];
                if (['SUPERADMIN', 'ADMIN', 'MANAGEMENT'].includes(roleName)) {
                    relevantStaffIds = allStaffs.map(s => s.staff_id);
                } else {
                    relevantStaffIds = await getAllSubordinates(pool, row.id);
                    // Filter to only active staffs
                    const activeStaffIds = new Set(allStaffs.map(s => s.staff_id));
                    relevantStaffIds = relevantStaffIds.filter(id => activeStaffIds.has(id));
                }

                // Dictionary for quick staff details lookup
                const staffDetailsMap = {};
                allStaffs.forEach(s => { staffDetailsMap[s.staff_id] = s; });

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

                        // Tab 4: Missed ALL 4 weeks
                        if (!w1Sub && !w2Sub && !w3Sub && !w4Sub) {
                            tab4Data.push({
                                "S.No.": snoTab4++,
                                "Staff Name": staffInfo.staff_fullname,
                                "Staff Email": staffInfo.staff_email,
                                "Week 1 (Last Week)": "Missed",
                                "Week 2": "Missed",
                                "Week 3": "Missed",
                                "Week 4": "Missed"
                            });
                        }

                        // Tab 5: Improvement (Submitted Last Week, but missed at least 1 in previous 3 weeks)
                        if (w1Sub && (!w2Sub || !w3Sub || !w4Sub)) {
                            tab5Data.push({
                                "S.No.": snoTab5++,
                                "Staff Name": staffInfo.staff_fullname,
                                "Staff Email": staffInfo.staff_email,
                                "Week 1 (Last Week)": "Submitted",
                                "Week 2": w2Sub ? "Submitted" : "Missed",
                                "Week 3": w3Sub ? "Submitted" : "Missed",
                                "Week 4": w4Sub ? "Submitted" : "Missed"
                            });
                        }
                    }
                }

                // --- 6. Generate Excel File ---
                const wb = xlsx.utils.book_new();
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab1Data), "Missing Employees");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab2Data), "Missing Line Managers");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab3Data), "Missing by Line Manager");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab4Data.length ? tab4Data : [{ "Message": "No consecutive misses." }]), "Missed 4 Consecutive Weeks");
                xlsx.utils.book_append_sheet(wb, xlsx.utils.json_to_sheet(tab5Data.length ? tab5Data : [{ "Message": "No improvements found." }]), "Recent Improvements");

                const excelBuffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

                // --- 7. Prepare Email Content ---
                // TODO: REVERT THIS AFTER TESTING
                // Override email for testing purposes
                // let toEmail = user.staff_email;
                let toEmail = "shaktijatpnp09@gmail.com"; // row.staff_email;
                let subjectEmail = "Missing Timesheet Report";
                const filename = "MissingTimesheetReport.xlsx";

                const totalMissing = tab1Data.length;
                const totalMissingManagers = tab2Data.length;
                const totalDefaulters = tab4Data.length;
                const totalImproved = tab5Data.length;

                let htmlEmail = `
            <h3>Please find the attached Missing Timesheet Report.</h3>
            <br/>
            <p><b>Summary:</b></p>
            <ul>
                <li>Total employees who did not submit timesheet (Last Week): <b>${totalMissing}</b></li>
                <li>Total line managers who did not submit timesheet (Last Week): <b>${totalMissingManagers}</b></li>
                <li>Employees consistently missing for 4 weeks: <b>${totalDefaulters}</b></li>
                <li>Employees showing improvement: <b>${totalImproved}</b></li>
            </ul>
        `;

                // --- 8. Send Email and Log ---
                const emailSent = await commonEmail(toEmail, subjectEmail, htmlEmail, "", "", excelBuffer, filename);

                const attachmentJson = {
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