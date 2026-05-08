const pool = require("../config/database");
const {
  SatffLogUpdateOperation,
  generateNextUniqueCode,
  LineManageStaffIdHelperFunction,
  QueryRoleHelperFunction,
  JobStatusUpdate,
  getStaffAccessFilters,
  grantStaffAccess
} = require("../../app/utils/helper");
const { CustomerLogUpdateOperation } = require("../../app/utils/customerHelper");

const getCustomerAddJobData = async (job) => {
  let { customer_id, StaffUserId, job_id, client_id } = job;

  try {
    // 1. If client_id is provided but customer_id is not, find the customer_id
    if (!customer_id && client_id) {
      const [[clientRow]] = await pool.execute(`SELECT customer_id FROM clients WHERE id = ?`, [client_id]);
      if (clientRow) {
        customer_id = clientRow.customer_id;
      }
    }

    // 2. If customer_id is still missing, find assigned customers for this staff/user
    if (!customer_id) {
      const access = await getStaffAccessFilters(StaffUserId);
      const assignedCustomerIds = access.assignedCustomerIds;

      if (assignedCustomerIds.length === 0) {
        return { status: false, message: "No customers assigned to this user." };
      }

      if (assignedCustomerIds.length === 1) {
        customer_id = assignedCustomerIds[0];
      } else {
        // MULTIPLE customers assigned. Fetch ALL clients for these customers.
        const idsStr = assignedCustomerIds.join(',');
        const queryAllClients = `
          SELECT 
              customers.id AS customer_id,
              customers.trading_name AS customer_trading_name,
              clients.id AS client_id,
              clients.trading_name AS client_trading_name
          FROM customers
          JOIN clients ON customers.id = clients.customer_id
          WHERE customers.id IN (${idsStr})
          ORDER BY clients.trading_name ASC
        `;
        const [clientRows] = await pool.execute(queryAllClients);

        return {
          status: true,
          message: "Multiple customers. Select client first.",
          data: {
            client: clientRows.map(r => ({
              client_id: r.client_id,
              client_trading_name: r.client_trading_name,
              customer_id: r.customer_id,
              customer_name: r.customer_trading_name
            }))
          }
        };
      }
    }

    if (!customer_id) {
      return { status: false, message: "Customer ID could not be determined." };
    }

    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
    const roleData = await QueryRoleHelperFunction(StaffUserId);
    // 1. Customer & Client Details
    const queryCustomerWithClient = `
    SELECT  
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        customers.account_manager_id  AS customer_account_manager_id,
        CONCAT(staffs.first_name, ' ', staffs.last_name) AS customer_officer_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        clients.client_type AS client_client_type,
        clients.company_number AS company_number,
        client_company_information.company_number AS client_company_number
    FROM customers
    JOIN clients ON customers.id = clients.customer_id
    LEFT JOIN staffs ON customers.account_manager_id = staffs.id
    LEFT JOIN client_company_information ON clients.id = client_company_information.client_id     
    WHERE customers.id = ?    
    ORDER BY clients.trading_name ASC;
    `;
    const [rows] = await pool.execute(queryCustomerWithClient, [customer_id]);

    let customer = [];
    let client = [];
    if (rows.length > 0) {
      customer = {
        customer_id: rows[0].customer_id,
        customer_name: rows[0].customer_trading_name,
        customer_trading_name: rows[0].customer_trading_name,
        customer_officer_name: rows[0].customer_officer_name,
        customer_account_manager_id: rows[0].customer_account_manager_id,
      };
      client = rows.map((row) => ({
        client_id: row.client_id,
        client_trading_name: row.client_trading_name,
        client_client_type: row.client_client_type,
        client_company_number: row.client_company_number,
        company_number: row.company_number,
      }));
    }

    // 2. Customer Contact Details (Account Managers)
    const queryCustomerAccountManager = `
    SELECT id AS customer_account_manager_officer_id,
           first_name AS customer_account_manager_officer_first_name,
           last_name AS customer_account_manager_officer_last_name
    FROM customer_contact_details
    WHERE customer_id = ?     
    ORDER BY id DESC;
    `;
    const [rows2] = await pool.execute(queryCustomerAccountManager, [customer_id]);
    let customer_account_manager = rows2.map((row) => ({
      customer_account_manager_officer_id: row.customer_account_manager_officer_id,
      customer_account_manager_officer_name: `${row.customer_account_manager_officer_first_name} ${row.customer_account_manager_officer_last_name}`,
    }));

    // 3. Services for this Customer
    const queryServices = `
    SELECT services.id AS service_id,
           services.name AS service_name
    FROM customer_services
    JOIN services ON services.id = customer_services.service_id
    WHERE customer_services.customer_id = ?     
    ORDER BY services.name ASC;
    `;
    const [rows7] = await pool.execute(queryServices, [customer_id]);
    let services = rows7.map((row) => ({
      service_id: row.service_id,
      service_name: row.service_name,
    }));

    // 4. Job Types (Initially empty or based on customer services)
    const queryJobTypes = `
    SELECT job_types.id AS job_type_id,
           job_types.type AS job_type_name
    FROM customer_services
    JOIN job_types ON job_types.service_id = customer_services.service_id
    WHERE customer_services.customer_id = ?
    ORDER BY job_types.type ASC;
    `;
    const [rows3] = await pool.execute(queryJobTypes, [customer_id]);
    let job_type = rows3.map(row => ({
      job_type_id: row.job_type_id,
      job_type_name: row.job_type_name
    }));

    // 5. Reviewers and Allocated To (Staffs)
    const queryStaff = `
    SELECT id, first_name, last_name, email, role_id
    FROM staffs
    WHERE status = '1' AND role_id IN (3, 4, 6)
    ORDER BY first_name ASC;
    `;
    const [staffRows] = await pool.execute(queryStaff);
    let reviewer = staffRows.filter(s => [4, 6].includes(s.role_id)).map(s => ({
      reviewer_id: s.id,
      reviewer_name: `${s.first_name} ${s.last_name}`,
      reviewer_email: s.email
    }));
    let allocated = staffRows.filter(s => [3, 4].includes(s.role_id)).map(s => ({
      allocated_id: s.id,
      allocated_name: `${s.first_name} ${s.last_name}`,
      allocated_email: s.email
    }));

    // 6. Engagement Model
    const queryEngagementModel = `
    SELECT fte_dedicated_staffing, percentage_model, adhoc_payg_hourly, customised_pricing
    FROM customer_engagement_model
    WHERE customer_id = ?;
    `;
    const [rows6] = await pool.execute(queryEngagementModel, [customer_id]);
    let engagement_model = rows6.map(row => ({
      fte_dedicated_staffing: row.fte_dedicated_staffing,
      percentage_model: row.percentage_model,
      adhoc_payg_hourly: row.adhoc_payg_hourly,
      customised_pricing: row.customised_pricing
    }));

    // 7. Currency
    const [rows8] = await pool.execute("SELECT id AS country_id, currency AS currency_name FROM countries ORDER BY currency ASC");

    // 8. Outbooks Account Manager
    const queryOutbooksManager = `
    SELECT staffs.id AS manager_id,
           CONCAT(staffs.first_name, ' ', staffs.last_name) AS manager_name
    FROM staffs
    JOIN customers ON customers.account_manager_id = staffs.id
    WHERE customers.id = ?;
    `;
    const [rows9] = await pool.execute(queryOutbooksManager, [customer_id]);

    // 9. Checklists
    const queryProcessingChecklists = `SELECT * FROM checklists WHERE (FIND_IN_SET(?, customer_id) OR customer_id IS NULL) AND work_flow_type = "3"`;
    const [processing_checklist_data] = await pool.execute(queryProcessingChecklists, [customer_id]);

    const queryReviewingChecklists = `SELECT * FROM checklists WHERE (FIND_IN_SET(?, customer_id) OR customer_id IS NULL) AND work_flow_type = "6"`;
    const [reviewing_checklist_data] = await pool.execute(queryReviewingChecklists, [customer_id]);

    return {
      status: true,
      message: "success.",
      data: {
        customer: customer,
        client: client,
        customer_account_manager: customer_account_manager,
        services: services,
        job_type: job_type,
        reviewer: reviewer,
        allocated: allocated,
        engagement_model: engagement_model,
        currency: rows8,
        Manager: rows9,
        allStaff: staffRows.map(s => ({ id: s.id, full_name: `${s.first_name} ${s.last_name} (${s.email})` })),
        processing_checklist_data: processing_checklist_data,
        reviewing_checklist_data: reviewing_checklist_data
      },
    };
  } catch (err) {
    console.error("getCustomerAddJobData error", err);
    return { status: false, message: "Error fetching customer job data" };
  }
};

const customerJobAdd = async (job) => {
  const {
    staffCreatedId,
    customer_id,
    client_id,
    service_id,
    job_type_id,
    reviewer,
    allocated_to,
    tasks,
    selectedStaffData,
    StaffUserId,
    ip,
    status_type: initial_status_type,
  } = job;

  let status_type = initial_status_type || 1; // Default: To Be Started

  // Status Logic consistency with Admin
  if (allocated_to > 0) {
    if (Number(job?.processing_checklist_status) === 2) {
      return {
        status: false,
        message: "Please complete the processing checklist first.",
        data: "W",
      };
    }
    status_type = 3;
  } else if (reviewer > 0) {
    if (Number(job?.reviewing_checklist_status) === 2) {
      return {
        status: false,
        message: "Please complete the reviewing checklist first.",
        data: "W",
      };
    }
    status_type = 5;
  }

  const job_id_code = await generateNextUniqueCode({ table: "jobs", field: "job_id" });

  try {
    const handleUndefined = (value) => (value === undefined ? null : value);

    const query = `
    INSERT INTO jobs (
        staff_created_id, job_id, account_manager_id, customer_id, client_id, client_job_code,
        customer_contact_details_id, service_id, job_type_id, budgeted_hours, reviewer,
        allocated_to, allocated_on, date_received_on, year_end, total_preparation_time,
        review_time, feedback_incorporation_time, total_time, engagement_model,
        expected_delivery_date, expected_delivery_date_old, due_on, submission_deadline,
        customer_deadline_date, sla_deadline_date, internal_deadline_date,
        filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date,
        opening_balance_required, opening_balance_date, number_of_transaction,
        number_of_balance_items, turnover, number_of_employees, vat_reconciliation,
        bookkeeping, processing_type, invoiced, currency, invoice_value,
        invoice_date, invoice_hours, invoice_remark, status_type, notes,
        Turnover_Period_id_0, Turnover_Currency_id_0, Turnover_id_0, VAT_Registered_id_0,
        VAT_Frequency_id_0, Who_Did_The_Bookkeeping_id_1, PAYE_Registered_id_1,
        Number_of_Trial_Balance_Items_id_1, Bookkeeping_Frequency_id_2,
        Number_of_Total_Transactions_id_2, Number_of_Bank_Transactions_id_2,
        Number_of_Purchase_Invoices_id_2, Number_of_Sales_Invoices_id_2,
        Number_of_Petty_Cash_Transactions_id_2, Number_of_Journal_Entries_id_2,
        Number_of_Other_Transactions_id_2, Transactions_Posting_id_2,
        Quality_of_Paperwork_id_2, Number_of_Integration_Software_Platforms_id_2,
        CIS_id_2, Posting_Payroll_Journals_id_2, Department_Tracking_id_2,
        Sales_Reconciliation_Required_id_2, Factoring_Account_id_2, Payment_Methods_id_2,
        Payroll_Frequency_id_3, Type_of_Payslip_id_3, Percentage_of_Variable_Payslips_id_3,
        Is_CIS_Required_id_3, CIS_Frequency_id_3, Number_of_Sub_contractors_id_3,
        Whose_Tax_Return_is_it_id_4, Number_of_Income_Sources_id_4,
        If_Landlord_Number_of_Properties_id_4, If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
        Management_Accounts_Frequency_id_6, Year_Ending_id_1, Day_Date_id_2,
        Week_Year_id_2, Week_Month_id_2, Week_id_2, Fortnight_Year_id_2,
        Fortnight_Month_id_2, Fortnight_id_2, Month_Year_id_2, Month_id_2,
        Quarter_Year_id_2, Quarter_id_2, Year_id_2, Other_FromDate_id_2,
        Other_ToDate_id_2, Payroll_Week_Year_id_3, Payroll_Week_Month_id_3,
        Payroll_Week_id_3, Payroll_Fortnight_Year_id_3, Payroll_Fortnight_Month_id_3,
        Payroll_Fortnight_id_3, Payroll_Month_Year_id_3, Payroll_Month_id_3,
        Payroll_Quarter_Year_id_3, Payroll_Quarter_id_3, Payroll_Year_id_3,
        Tax_Year_id_4, Management_Accounts_FromDate_id_6, Management_Accounts_ToDate_id_6,
        Year_id_33, Period_id_32, Day_Date_id_32, Week_Year_id_32, Week_Month_id_32,
        Week_id_32, Fortnight_Year_id_32, Fortnight_Month_id_32, Fortnight_id_32,
        Month_Year_id_32, Month_id_32, Quarter_Year_id_32, Quarter_id_32,
        Year_id_32, Other_FromDate_id_32, Other_ToDate_id_32, Payroll_Frequency_id_31,
        Payroll_Week_Year_id_31, Payroll_Week_Month_id_31, Payroll_Week_id_31,
        Payroll_Fortnight_Year_id_31, Payroll_Fortnight_Month_id_31,
        Payroll_Fortnight_id_31, Payroll_Month_Year_id_31, Payroll_Month_id_31,
        Payroll_Quarter_Year_id_31, Payroll_Quarter_id_31, Payroll_Year_id_31,
        Audit_Year_Ending_id_27, Filing_Frequency_id_8, Period_Ending_Date_id_8,
        Filing_Date_id_8, Year_id_28, job_priority, processing_checklist,
        reviewing_checklist, processing_checklist_status, reviewing_checklist_status,
        checklist_modal_data
    ) VALUES `;

    const values = [
      staffCreatedId, job_id_code, job.account_manager_id, customer_id, client_id, job.client_job_code,
      job.customer_contact_details_id, service_id, job_type_id, job.budgeted_hours, reviewer,
      allocated_to, job.allocated_on, job.date_received_on, job.year_end, job.total_preparation_time,
      job.review_time, job.feedback_incorporation_time, job.total_time, job.engagement_model,
      job.expected_delivery_date, job.expected_delivery_date, job.due_on, job.submission_deadline,
      job.customer_deadline_date, job.sla_deadline_date, job.internal_deadline_date,
      job.filing_Companies_required, job.filing_Companies_date, job.filing_hmrc_required, job.filing_hmrc_date,
      job.opening_balance_required, job.opening_balance_date, job.number_of_transaction,
      job.number_of_balance_items, job.turnover, job.number_of_employees, job.vat_reconciliation,
      job.bookkeeping, job.processing_type, job.invoiced, job.currency, job.invoice_value,
      job.invoice_date, job.invoice_hours, job.invoice_remark, status_type, job.notes || "",
      job.Turnover_Period_id_0, job.Turnover_Currency_id_0, job.Turnover_id_0, job.VAT_Registered_id_0,
      job.VAT_Frequency_id_0, job.Who_Did_The_Bookkeeping_id_1, job.PAYE_Registered_id_1,
      job.Number_of_Trial_Balance_Items_id_1, job.Bookkeeping_Frequency_id_2,
      job.Number_of_Total_Transactions_id_2, job.Number_of_Bank_Transactions_id_2,
      job.Number_of_Purchase_Invoices_id_2, job.Number_of_Sales_Invoices_id_2,
      job.Number_of_Petty_Cash_Transactions_id_2, job.Number_of_Journal_Entries_id_2,
      job.Number_of_Other_Transactions_id_2, job.Transactions_Posting_id_2,
      job.Quality_of_Paperwork_id_2, job.Number_of_Integration_Software_Platforms_id_2,
      job.CIS_id_2, job.Posting_Payroll_Journals_id_2, job.Department_Tracking_id_2,
      job.Sales_Reconciliation_Required_id_2, job.Factoring_Account_id_2, job.Payment_Methods_id_2,
      job.Payroll_Frequency_id_3, job.Type_of_Payslip_id_3, job.Percentage_of_Variable_Payslips_id_3,
      job.Is_CIS_Required_id_3, job.CIS_Frequency_id_3, job.Number_of_Sub_contractors_id_3,
      job.Whose_Tax_Return_is_it_id_4, job.Number_of_Income_Sources_id_4,
      job.If_Landlord_Number_of_Properties_id_4, job.If_Sole_Trader_Who_is_doing_Bookkeeping_id_4,
      job.Management_Accounts_Frequency_id_6, job.Year_Ending_id_1, job.Day_Date_id_2,
      job.Week_Year_id_2, job.Week_Month_id_2, job.Week_id_2, job.Fortnight_Year_id_2,
      job.Fortnight_Month_id_2, job.Fortnight_id_2, job.Month_Year_id_2, job.Month_id_2,
      job.Quarter_Year_id_2, job.Quarter_id_2, job.Year_id_2, job.Other_FromDate_id_2,
      job.Other_ToDate_id_2, job.Payroll_Week_Year_id_3, job.Payroll_Week_Month_id_3,
      job.Payroll_Week_id_3, job.Payroll_Fortnight_Year_id_3, job.Payroll_Fortnight_Month_id_3,
      job.Payroll_Fortnight_id_3, job.Payroll_Month_Year_id_3, job.Payroll_Month_id_3,
      job.Payroll_Quarter_Year_id_3, job.Payroll_Quarter_id_3, job.Payroll_Year_id_3,
      job.Tax_Year_id_4, job.Management_Accounts_FromDate_id_6, job.Management_Accounts_ToDate_id_6,
      job.Year_id_33, job.Period_id_32, job.Day_Date_id_32, job.Week_Year_id_32, job.Week_Month_id_32,
      job.Week_id_32, job.Fortnight_Year_id_32, job.Fortnight_Month_id_32, job.Fortnight_id_32,
      job.Month_Year_id_32, job.Month_id_32, job.Quarter_Year_id_32, job.Quarter_id_32,
      job.Year_id_32, job.Other_FromDate_id_32, job.Other_ToDate_id_32, job.Payroll_Frequency_id_31,
      job.Payroll_Week_Year_id_31, job.Payroll_Week_Month_id_31, job.Payroll_Week_id_31,
      job.Payroll_Fortnight_Year_id_31, job.Payroll_Fortnight_Month_id_31,
      job.Payroll_Fortnight_id_31, job.Payroll_Month_Year_id_31, job.Payroll_Month_id_31,
      job.Payroll_Quarter_Year_id_31, job.Payroll_Quarter_id_31, job.Payroll_Year_id_31,
      job.Audit_Year_Ending_id_27, job.Filing_Frequency_id_8, job.Period_Ending_Date_id_8,
      job.Filing_Date_id_8, job.Year_id_28, job.job_priority || 'normal',
      job.processing_checklist, job.reviewing_checklist, job.processing_checklist_status,
      job.reviewing_checklist_status, job.checklist_modal_data
    ].map(handleUndefined);

    const [result] = await pool.execute(query + "(" + Array(values.length).fill("?").join(",") + ")", values);

    if (result.insertId > 0) {
      const status_update_date = new Date().toLocaleString('sv-SE');
      await JobStatusUpdate(result.insertId, status_type, status_update_date);

      await CustomerLogUpdateOperation({
        staff_id: StaffUserId,
        ip: ip,
        date: new Date().toISOString().split("T")[0],
        module_name: "job",
        log_message: `created job code:`,
        permission_type: "created",
        module_id: result.insertId,
      });

      // Task Insertion Logic (from Admin)
      if (tasks && tasks.task && tasks.task.length > 0) {
        for (const tsk of tasks.task) {
          let task_id = tsk.task_id;
          let task_name = tsk.task_name;
          let budgeted_hour = tsk.budgeted_hour;

          if (task_id == "" || task_id == undefined || task_id == null) {
            const checkQuery = `SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?`;
            const [existing] = await pool.execute(checkQuery, [task_name, service_id, job_type_id]);

            if (existing.length === 0) {
              const insertTaskQuery = `INSERT INTO task (name, service_id, job_type_id) VALUES (?, ?, ?)`;
              const [newTask] = await pool.execute(insertTaskQuery, [task_name, service_id, job_type_id]);
              if (newTask.insertId > 0) {
                task_id = newTask.insertId;
              }
            } else {
              task_id = existing[0].id;
            }
          }

          if (task_id) {
            const insertJobTaskQuery = `INSERT INTO client_job_task (job_id, client_id, task_id, time) VALUES (?, ?, ?, ?)`;
            await pool.execute(insertJobTaskQuery, [result.insertId, client_id, task_id, budgeted_hour]);
          }
        }
      }

      // Allowed Staff Logic (from Admin)
      if (selectedStaffData && selectedStaffData.length > 0) {
        for (const staff of selectedStaffData) {
          let { value } = staff;
          const query = `INSERT INTO job_allowed_staffs (job_id, staff_id) VALUES (?, ?)`;
          await pool.execute(query, [result.insertId, value]);
        }
      } else {
        // Fallback for Customer Portal specific defaults if no selectedStaffData
        if (reviewer > 0) {
          await pool.execute("INSERT INTO job_allowed_staffs (job_id, staff_id) VALUES (?, ?)", [result.insertId, reviewer]);
        }
        if (allocated_to > 0 && allocated_to !== reviewer) {
          await pool.execute("INSERT INTO job_allowed_staffs (job_id, staff_id) VALUES (?, ?)", [result.insertId, allocated_to]);
        }
      }
    }

    const roleData = await QueryRoleHelperFunction(StaffUserId);
    if (roleData.length > 0 && roleData[0].role_id === 12) {
      await grantStaffAccess(StaffUserId, customer_id, "job", result.insertId);
    }

    return { status: true, message: "Job created successfully.", data: result.insertId };
  } catch (err) {
    console.error("customerJobAdd error", err);
    return { status: false, message: "Error adding job." };
  }
};

const getJobType = async (JobType) => {
  const { service_id } = JobType;
  if (service_id == undefined) return [];
  const query = `
    SELECT job_types.id, job_types.type, job_types.status, services.name as service_name,
           task.id as task_id, task.name as task_name, task.budgeted_hour as task_budgeted_hour
    FROM job_types 
    JOIN services ON job_types.service_id = services.id 
    LEFT JOIN task ON task.job_type_id = job_types.id AND task.service_id = job_types.service_id
    WHERE job_types.service_id = ?
    ORDER BY job_types.id DESC 
  `;
  try {
    const [result] = await pool.execute(query, [service_id]);

    // Group tasks by job type
    const jobTypes = [];
    result.forEach(row => {
      let jt = jobTypes.find(item => item.id === row.id);
      if (!jt) {
        jt = {
          id: row.id,
          type: row.type,
          status: row.status,
          service_name: row.service_name,
          task: []
        };
        jobTypes.push(jt);
      }
      if (row.task_id) {
        jt.task.push({
          task_id: row.task_id,
          task_name: row.task_name,
          budgeted_hour: row.task_budgeted_hour
        });
      }
    });

    return jobTypes;
  } catch (err) {
    console.error("getJobType error", err);
    throw err;
  }
};

const getByServiceWithJobType = async (checklist) => {
  const { service_id, job_type_id, clientId, customer_id } = checklist;
  try {
    // 1. Get Client details to get client_type
    const [[clientRow]] = await pool.execute(`SELECT client_type FROM clients WHERE id = ?`, [clientId]);
    const client_type_id = clientRow?.client_type;

    const query = `
      SELECT 
        checklists.id AS checklists_id,
        checklists.check_list_name,
        checklists.work_flow_type,
        checklist_tasks.task_id,
        checklist_tasks.budgeted_hour,
        task.name AS task_name
      FROM checklists
      JOIN checklist_tasks ON checklists.id = checklist_tasks.checklist_id
      JOIN task ON task.id = checklist_tasks.task_id
      WHERE (FIND_IN_SET(?, checklists.customer_id) OR checklists.customer_id IS NULL)
        AND (FIND_IN_SET(?, checklists.service_id))
        AND (FIND_IN_SET(?, checklists.job_type_id))
        AND (FIND_IN_SET(?, checklists.client_type_id) OR checklists.client_type_id IS NULL)
      GROUP BY checklist_tasks.task_id
      ORDER BY checklists.id DESC;
    `;
    const [result] = await pool.execute(query, [customer_id, service_id, job_type_id, client_type_id]);
    return { status: true, message: "checklist get successfully.", data: result };
  } catch (err) {
    console.error("getByServiceWithJobType error", err);
    return { status: false, message: "Error getting checklist." };
  }
};

module.exports = {
  getCustomerAddJobData,
  customerJobAdd,
  getJobType,
  getByServiceWithJobType
};
