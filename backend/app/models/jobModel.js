const pool = require('../config/database');
const { SatffLogUpdateOperation, generateNextUniqueCode } = require('../../app/utils/helper');

const getAddJobData = async (job) => {

  const { customer_id } = job;

  // customer Client
  try {
    const queryCustomerWithClient = `
    SELECT  
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        customers.account_manager_id  AS customer_account_manager_id,

        clients.id AS client_id,
        clients.trading_name AS client_trading_name,
        clients.client_type AS client_client_type
    FROM 
        customers
   JOIN 
        clients ON customers.id = clients.customer_id
   WHERE customers.id = ?    
   ORDER BY 
    customers.id DESC;
  `;
    const [rows] = await pool.execute(queryCustomerWithClient, [customer_id]);
    let customer = [];
    let client = [];
    if (rows.length > 0) {
      customer = {
        customer_id: rows[0].customer_id,
        customer_trading_name: rows[0].customer_trading_name,
        customer_account_manager_id: rows[0].customer_account_manager_id
      };

      client = rows.map(row => ({
        client_id: row.client_id,
        client_trading_name: row.client_trading_name,
        client_client_type: row.client_client_type
      }));


    }

    // CustomerAccountManager
    const queryCustomerWithCustomerAccountManager = `
    SELECT  
        customer_contact_details.id AS customer_account_manager_officer_id,
        customer_contact_details.first_name AS customer_account_manager_officer_first_name,
        customer_contact_details.last_name AS customer_account_manager_officer_last_name
   FROM 
        customers
   JOIN 
        customer_contact_details ON customers.id = customer_contact_details.customer_id
   WHERE customers.id = ?     
   ORDER BY 
    customers.id DESC;
  `;

    const [rows2] = await pool.execute(queryCustomerWithCustomerAccountManager, [customer_id]);
    let customer_account_manager = []
    if (rows2.length > 0) {
      customer_account_manager = rows2.map(row => ({
        customer_account_manager_officer_id: row.customer_account_manager_officer_id,
        customer_account_manager_officer_name: row.customer_account_manager_officer_first_name + " " + row.customer_account_manager_officer_last_name
      }));
    }


    // job type
    const queryCustomerWithJobType = `
     SELECT  
         job_types.id AS job_type_id,
         job_types.type AS job_type_name
    FROM 
         customers
    JOIN 
         customer_services ON customers.id = customer_services.customer_id
    JOIN 
         job_types ON job_types.service_id = customer_services.service_id
    WHERE customers.id = ?
    ORDER BY 
     customers.id DESC;
   `;

    const [rows3] = await pool.execute(queryCustomerWithJobType, [customer_id]);
    let job_type = []
    if (rows3.length > 0) {
      job_type = rows3.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.job_type_id === value.job_type_id
        ))
      );
    }


    // job Reviewer
    const queryReviewer = `
     SELECT  
         staffs.id AS reviewer_id,
         staffs.first_name AS reviewer_first_name,
         staffs.last_name AS reviewer_last_name
    FROM 
         staffs
    JOIN 
         roles ON staffs.role_id = roles.id
    WHERE  
     staffs.role_id = 6   
    ORDER BY 
     staffs.id DESC;
   `;

    const [rows4] = await pool.execute(queryReviewer, [customer_id]);
    let reviewer = []
    if (rows4.length > 0) {
      reviewer = rows4.map(row => ({
        reviewer_id: row.reviewer_id,
        reviewer_name: row.reviewer_first_name + " " + row.reviewer_last_name
      }));
    }





    // Allocated
    const queryAllocated = `
     SELECT  
         staffs.id AS staff_id,
         staffs.first_name AS staff_first_name,
         staffs.last_name AS staff_last_name
    FROM 
         staffs
    JOIN 
         roles ON staffs.role_id = roles.id
    WHERE  
     staffs.role_id = 3   
    ORDER BY 
     staffs.id DESC;
   `;

    const [rows5] = await pool.execute(queryAllocated, [customer_id]);
    let allocated = []
    if (rows5.length > 0) {
      allocated = rows5.map(row => ({
        allocated_id: row.staff_id,
        allocated_name: row.staff_first_name + " " + row.staff_last_name
      }));
    }



    // engagement_model
    const queryEngagementModel = `
     SELECT  
         customer_engagement_model.fte_dedicated_staffing AS fte_dedicated_staffing,
         customer_engagement_model.percentage_model AS percentage_model,
         customer_engagement_model.adhoc_payg_hourly AS adhoc_payg_hourly,
         customer_engagement_model.customised_pricing AS customised_pricing
    FROM 
         customers
    JOIN 
         customer_engagement_model ON customer_engagement_model.customer_id = customers.id 
    WHERE  
     customers.id = ?
   `;

    const [rows6] = await pool.execute(queryEngagementModel, [customer_id]);
    let engagement_model = []
    if (rows6.length > 0) {
      engagement_model = rows6.map(row => ({
        fte_dedicated_staffing: row.fte_dedicated_staffing,
        percentage_model: row.percentage_model,
        adhoc_payg_hourly: row.adhoc_payg_hourly,
        customised_pricing: row.customised_pricing
      }));
    }



    // Services
    const queryCustomerWithServices = `
     SELECT  
         services.id AS service_id,
         services.name AS service_name
    FROM 
         customers
    JOIN 
         customer_services ON customers.id = customer_services.customer_id
    JOIN 
         services ON services.id = customer_services.service_id
    WHERE  
     customer_services.customer_id = ?     
    ORDER BY 
     services.id DESC;
   `;

    const [rows7] = await pool.execute(queryCustomerWithServices, [customer_id]);
    let services = []
    if (rows7.length > 0) {
      services = rows7.map(row => ({
        service_id: row.service_id,
        service_name: row.service_name
      }));
    }



    // Currency
    const queryCustomerWithCurrency = `
     SELECT  
         countries.id AS country_id,
         countries.currency AS currency_name
    FROM 
         countries     
    ORDER BY 
     countries.id DESC;
   `;

    const [rows8] = await pool.execute(queryCustomerWithCurrency);



    const queryAccountManeger = `
       SELECT  
           staffs.id AS manager_id,
           staffs.first_name AS manager_first_name,
           staffs.last_name AS manager_last_name
      FROM 
           staffs
      WHERE  
       staffs.id = ${rows[0].customer_account_manager_id}`;


    const [rows9] = await pool.execute(queryAccountManeger);
    let AccountManagerArr = []
    if (rows9.length > 0) {
      AccountManagerArr = rows9.map(row => ({
        manager_id: row.manager_id,
        manager_name: row.manager_first_name + " " + row.manager_last_name
      }));
    }




    return { status: true, message: 'success.', data: { customer: customer, client: client, customer_account_manager: customer_account_manager, services: services, job_type: job_type, reviewer: reviewer, allocated: allocated, engagement_model: engagement_model, currency: rows8, Manager: AccountManagerArr } };

  } catch (err) {

    return { status: false, message: 'Err Customer Get' };

  }



}

const jobAdd = async (job) => {


  const {
    staffCreatedId,
    account_manager_id,
    customer_id,
    client_id,
    client_job_code,
    customer_contact_details_id,
    service_id,
    job_type_id,
    tasks,
    budgeted_hours,
    reviewer,
    allocated_to,
    allocated_on,
    date_received_on,
    year_end,
    total_preparation_time,
    review_time,
    feedback_incorporation_time,
    total_time,
    engagement_model,
    expected_delivery_date,
    due_on,
    submission_deadline,
    customer_deadline_date,
    sla_deadline_date,
    internal_deadline_date,
    filing_Companies_required,
    filing_Companies_date,
    filing_hmrc_required,
    filing_hmrc_date,
    opening_balance_required,
    opening_balance_date,
    number_of_transaction,
    number_of_balance_items,
    turnover,
    number_of_employees,
    vat_reconciliation,
    bookkeeping,
    processing_type,
    invoiced,
    currency,
    invoice_value,
    invoice_date,
    invoice_hours,
    invoice_remark
  } = job;


  // Set Status type
  let status_type = 0

  if (allocated_to > 0) {
    status_type = 3
  }

  if (reviewer > 0) {
    status_type = 5
  }

  if (reviewer == 0 && allocated_to == 0) {
    status_type = 1
  }


  let data = {
    table: 'jobs',
    field: 'job_id'
  }
  //CUS_CLI_00001
  const job_id = await generateNextUniqueCode(data);
  
  try {


    
  console.log("job   ii4",  client_id)

    const query = `
INSERT INTO jobs (staff_created_id,job_id,account_manager_id,customer_id,client_id,client_job_code,customer_contact_details_id, service_id,job_type_id, budgeted_hours,reviewer, allocated_to,allocated_on,date_received_on,year_end,total_preparation_time, review_time, feedback_incorporation_time,total_time, engagement_model, expected_delivery_date,due_on,submission_deadline, customer_deadline_date, sla_deadline_date,internal_deadline_date, filing_Companies_required, filing_Companies_date,filing_hmrc_required, filing_hmrc_date, opening_balance_required,opening_balance_date, number_of_transaction, number_of_balance_items,turnover, number_of_employees, vat_reconciliation, bookkeeping,processing_type, invoiced, currency, invoice_value, invoice_date,invoice_hours, invoice_remark,status_type)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const [result] = await pool.execute(query, [staffCreatedId, job_id, account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id, service_id, job_type_id, budgeted_hours, reviewer, allocated_to, allocated_on, date_received_on, year_end, total_preparation_time, review_time, feedback_incorporation_time, total_time, engagement_model, expected_delivery_date, due_on, submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date, filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date, opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items, turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type, invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark, status_type]);


    if (result.insertId > 0) {
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: job.StaffUserId,
          ip: job.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: "job",
          log_message: `created job code:`,
          permission_type: "created",
          module_id: result.insertId
        }
      );



      if (tasks.task.length > 0) {
        const job_id = result.insertId;
        const checklist_id = tasks.checklist_id;
        for (const tsk of tasks.task) {

          let task_id = tsk.task_id;
          let task_name = tsk.task_name;
          let budgeted_hour = tsk.budgeted_hour;
          if (task_id == "" || task_id == undefined || task_id == null) {


            const checkQuery = `
                    SELECT id FROM task WHERE name = ? AND service_id = ? AND job_type_id = ?
                `;
            const [existing] = await pool.execute(checkQuery, [task_name, service_id, job_type_id]);
            if (existing.length === 0) {
              const query = `INSERT INTO task (name,service_id,job_type_id) VALUES (?, ?, ?) `;
              const [result] = await pool.execute(query, [task_name, service_id, job_type_id]);
              if (result.insertId > 0) {
                let task_id_new = result.insertId;
                const checklistAddTasksQuery = `
               INSERT INTO checklist_tasks (checklist_id,task_id,task_name,budgeted_hour)
               VALUES (?, ?, ?, ?)
               `;
                const [result2] = await pool.execute(checklistAddTasksQuery, [checklist_id, task_id_new, task_name, budgeted_hour]);

                if (result2.insertId > 0) {
                  const query3 = `
               INSERT INTO client_job_task (job_id,client_id,checklist_id,task_id)
               VALUES (?, ?, ?, ?)
               `;
                  const [result3] = await pool.execute(query3, [job_id, client_id, checklist_id, task_id_new]);
                }


              }


            }


          }
          else {

            const query = `
               INSERT INTO client_job_task (job_id,client_id,checklist_id,task_id)
               VALUES (?, ?, ?, ?)
               `;
            const [result] = await pool.execute(query, [job_id, client_id, checklist_id, task_id]);
          }
        }
      }
    }
    return { status: true, message: 'job add successfully.', data: result.insertId };
  } catch (err) {
    console.log("err -", err)
    return { status: false, message: 'Error adding job.' };
  }

}

const getJobByCustomer = async (job) => {
  const { customer_id, StaffUserId } = job;
  try {
    const [ExistStaff] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + StaffUserId + '" LIMIT 1');
    let result = []
    if (ExistStaff.length > 0) {
      // Allocated to
      if (ExistStaff[0].role_id == 3) {

        const query = `
        SELECT 
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        master_status.name AS status,
        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
   
        FROM 
        jobs
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        WHERE 
        jobs.customer_id = customers.id AND 
        jobs.allocated_to = ? AND jobs.customer_id = ?
        ORDER BY 
         jobs.id DESC;
        `;
        const [rows] = await pool.execute(query, [ExistStaff[0].id, customer_id]);
        result = rows
      }
      // Account Manger
      else if (ExistStaff[0].role_id == 4) {

        const query = `
        SELECT 
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,

   
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
   
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
   
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,

        master_status.name AS status,
        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
   
        FROM 
        jobs
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        WHERE 
        jobs.customer_id = customers.id AND 
        jobs.account_manager_id = ? AND jobs.customer_id = ? 
        ORDER BY 
         jobs.id DESC;
        `;
        const [rows] = await pool.execute(query, [ExistStaff[0].id, customer_id]);
        result = rows
        if (rows.length === 0) {
          const query = `
        SELECT 
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,

   
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
   
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
   
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,

        master_status.name AS status,
        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
   
        FROM 
      jobs
        JOIN 
        services ON jobs.service_id = services.id
        JOIN
        customer_services ON customer_services.service_id = jobs.service_id
        JOIN
        customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        WHERE 
        jobs.customer_id = customers.id AND 
        customer_service_account_managers.account_manager_id = ? AND jobs.customer_id = ?
        GROUP BY 
        jobs.id 
        ORDER BY 
         jobs.id DESC;
        `;
          const [rows] = await pool.execute(query, [ExistStaff[0].id, customer_id]);
          result = rows
        }
      }
      // Reviewer
      else if (ExistStaff[0].role_id == 6) {

        const query = `
        SELECT 
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,

   
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
   
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
   
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,

        master_status.name AS status,
        CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
   
        FROM 
        jobs
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        WHERE 
        jobs.customer_id = customers.id AND 
        jobs.reviewer = ? AND jobs.customer_id = ? 
        ORDER BY 
         jobs.id DESC;
        `;
        const [rows] = await pool.execute(query, [ExistStaff[0].id, customer_id]);
        result = rows
      }
      else {
        const query = `
        SELECT 
        jobs.id AS job_id,
        job_types.type AS job_type_name,
        customer_contact_details.id AS account_manager_officer_id,
        customer_contact_details.first_name AS account_manager_officer_first_name,
        customer_contact_details.last_name AS account_manager_officer_last_name,
        clients.trading_name AS client_trading_name,
        jobs.client_job_code AS client_job_code,
        jobs.invoiced AS invoiced,
        jobs.total_hours AS total_hours,
        jobs.total_hours_status AS total_hours_status,
   
        staffs.id AS allocated_id,
        staffs.first_name AS allocated_first_name,
        staffs.last_name AS allocated_last_name,
   
        staffs2.id AS reviewer_id,
        staffs2.first_name AS reviewer_first_name,
        staffs2.last_name AS reviewer_last_name,
   
        staffs3.id AS outbooks_acount_manager_id,
        staffs3.first_name AS outbooks_acount_manager_first_name,
        staffs3.last_name AS outbooks_acount_manager_last_name,
        master_status.name AS status,
          CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id
        FROM 
        jobs
        LEFT JOIN 
        customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
        LEFT JOIN 
        clients ON jobs.client_id = clients.id
        LEFT JOIN 
        customers ON jobs.customer_id = customers.id
        LEFT JOIN 
        job_types ON jobs.job_type_id = job_types.id
        LEFT JOIN 
        services ON jobs.service_id = services.id
        LEFT JOIN 
        staffs ON jobs.allocated_to = staffs.id
        LEFT JOIN 
        staffs AS staffs2 ON jobs.reviewer = staffs2.id
        LEFT JOIN 
        staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
        LEFT JOIN 
        master_status ON master_status.id = jobs.status_type
        WHERE 
        jobs.customer_id = customers.id AND 
        jobs.customer_id = ?
        ORDER BY 
         jobs.id DESC;
        `;
        const [rows] = await pool.execute(query, [customer_id]);
        result = rows
      }
    }
    return { status: true, message: 'Success.', data: result };
  } catch (error) {
    console.log("err -", error)
    return { status: false, message: 'Error getting job.' };
  }


}

const getJobByClient = async (job) => {
  const { client_id, StaffUserId } = job;
  try {
    const [ExistStaff] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + StaffUserId + '" LIMIT 1');
    let result = []
    if (ExistStaff.length > 0) {
      // Allocated to
      if (ExistStaff[0].role_id == 3) {

        const query = `
     SELECT 
     jobs.id AS job_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,
     jobs.total_hours AS total_hours,
     jobs.total_hours_status AS total_hours_status,

     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name,

     master_status.name AS status,
     CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

     FROM 
     jobs
     LEFT JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     LEFT JOIN 
     clients ON jobs.client_id = clients.id
     LEFT JOIN
      customers ON jobs.customer_id = customers.id
     LEFT JOIN 
     job_types ON jobs.job_type_id = job_types.id
     LEFT JOIN 
     services ON jobs.service_id = services.id
     LEFT JOIN 
     staffs ON jobs.allocated_to = staffs.id
     LEFT JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     LEFT JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     LEFT JOIN 
     master_status ON master_status.id = jobs.status_type   
     WHERE 
     jobs.client_id = clients.id AND
     jobs.allocated_to = ? AND jobs.client_id = ? 
      ORDER BY
      jobs.id DESC;
     `;
        const [rowsAllocated] = await pool.execute(query, [ExistStaff[0].id, client_id]);
        result = rowsAllocated

      }
      // Account Manger
      else if (ExistStaff[0].role_id == 4) {

        const query = `
   SELECT 
   jobs.id AS job_id,
   job_types.type AS job_type_name,
   customer_contact_details.id AS account_manager_officer_id,
   customer_contact_details.first_name AS account_manager_officer_first_name,
   customer_contact_details.last_name AS account_manager_officer_last_name,
   clients.trading_name AS client_trading_name,
   jobs.client_job_code AS client_job_code,
   jobs.invoiced AS invoiced,
   jobs.total_hours AS total_hours,
   jobs.total_hours_status AS total_hours_status,

   staffs.id AS allocated_id,
   staffs.first_name AS allocated_first_name,
   staffs.last_name AS allocated_last_name,

   staffs2.id AS reviewer_id,
   staffs2.first_name AS reviewer_first_name,
   staffs2.last_name AS reviewer_last_name,

   staffs3.id AS outbooks_acount_manager_id,
   staffs3.first_name AS outbooks_acount_manager_first_name,
   staffs3.last_name AS outbooks_acount_manager_last_name,

   master_status.name AS status,
   CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

   FROM 
   jobs
   LEFT JOIN 
   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
   LEFT JOIN 
   clients ON jobs.client_id = clients.id
   LEFT JOIN
      customers ON jobs.customer_id = customers.id
   LEFT JOIN 
   job_types ON jobs.job_type_id = job_types.id
   LEFT JOIN 
   services ON jobs.service_id = services.id
   LEFT JOIN 
   staffs ON jobs.allocated_to = staffs.id
   LEFT JOIN 
   staffs AS staffs2 ON jobs.reviewer = staffs2.id
   LEFT JOIN 
   staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
   LEFT JOIN 
   master_status ON master_status.id = jobs.status_type   
   WHERE 
   jobs.client_id = clients.id AND
   jobs.account_manager_id = ? AND jobs.client_id = ? 
    ORDER BY
   jobs.id DESC;
   `;
        const [rowsAllocated] = await pool.execute(query, [ExistStaff[0].id, client_id]);
        result = rowsAllocated
        if (rowsAllocated.length === 0) {
          const query = `
   SELECT 
   jobs.id AS job_id,
   job_types.type AS job_type_name,
   customer_contact_details.id AS account_manager_officer_id,
   customer_contact_details.first_name AS account_manager_officer_first_name,
   customer_contact_details.last_name AS account_manager_officer_last_name,
   clients.trading_name AS client_trading_name,
   jobs.client_job_code AS client_job_code,
   jobs.invoiced AS invoiced,
   jobs.total_hours AS total_hours,
   jobs.total_hours_status AS total_hours_status,

   staffs.id AS allocated_id,
   staffs.first_name AS allocated_first_name,
   staffs.last_name AS allocated_last_name,

   staffs2.id AS reviewer_id,
   staffs2.first_name AS reviewer_first_name,
   staffs2.last_name AS reviewer_last_name,

   staffs3.id AS outbooks_acount_manager_id,
   staffs3.first_name AS outbooks_acount_manager_first_name,
   staffs3.last_name AS outbooks_acount_manager_last_name,

   master_status.name AS status,
   CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

   FROM 
   jobs
   LEFT JOIN 
   clients ON jobs.client_id = clients.id
   LEFT JOIN
      customers ON jobs.customer_id = customers.id
   JOIN 
   services ON jobs.service_id = services.id
   JOIN
   customer_services ON customer_services.service_id = jobs.service_id
   JOIN
   customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
   LEFT JOIN 
   customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
   LEFT JOIN 
   clients ON jobs.client_id = clients.id
   LEFT JOIN 
   job_types ON jobs.job_type_id = job_types.id
   LEFT JOIN 
   staffs ON jobs.allocated_to = staffs.id
   LEFT JOIN 
   staffs AS staffs2 ON jobs.reviewer = staffs2.id
   LEFT JOIN 
   staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
   LEFT JOIN
   master_status ON master_status.id = jobs.status_type   
   WHERE 
   jobs.client_id = clients.id AND
   customer_service_account_managers.account_manager_id = ? AND jobs.client_id = ? 
   GROUP BY 
   jobs.id
    ORDER BY
   jobs.id DESC;
   `;
          const [rowsAllocated] = await pool.execute(query, [ExistStaff[0].id, client_id]);
          result = rowsAllocated

        }

      }
      // Reviewer
      else if (ExistStaff[0].role_id == 6) {

        const query = `
     SELECT 
     jobs.id AS job_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,
     jobs.total_hours AS total_hours,
     jobs.total_hours_status AS total_hours_status,

     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name,

     master_status.name AS status,
     CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

     FROM 
     jobs
     LEFT JOIN 
      clients ON jobs.client_id = clients.id
      LEFT JOIN
      customers ON jobs.customer_id = customers.id
     LEFT JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     LEFT JOIN 
     clients ON jobs.client_id = clients.id
     LEFT JOIN 
     job_types ON jobs.job_type_id = job_types.id
     LEFT JOIN 
     services ON jobs.service_id = services.id
     LEFT JOIN 
     staffs ON jobs.allocated_to = staffs.id
     LEFT JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     LEFT JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     LEFT JOIN 
     master_status ON master_status.id = jobs.status_type   
     WHERE 
     jobs.client_id = clients.id AND
     jobs.reviewer = ? AND jobs.client_id = ? 
      ORDER BY
      jobs.id DESC;
     `;
        const [rowsAllocated] = await pool.execute(query, [ExistStaff[0].id, client_id]);
        result = rowsAllocated

      }
      else {
        const query = `
     SELECT 
     jobs.id AS job_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,
     jobs.total_hours AS total_hours,
     jobs.total_hours_status AS total_hours_status,

     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name,

     master_status.name AS status,
     CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

     FROM 
     jobs
     LEFT JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     LEFT JOIN 
     clients ON jobs.client_id = clients.id
      LEFT JOIN
      customers ON jobs.customer_id = customers.id
     LEFT JOIN 
     job_types ON jobs.job_type_id = job_types.id
     LEFT JOIN 
     services ON jobs.service_id = services.id
     LEFT JOIN 
     staffs ON jobs.allocated_to = staffs.id
     LEFT JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     LEFT JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     LEFT JOIN 
     master_status ON master_status.id = jobs.status_type   
     WHERE 
     jobs.client_id = clients.id AND
     jobs.client_id = ?
      ORDER BY
      jobs.id DESC;
     `;
        const [rows] = await pool.execute(query, [client_id]);
        result = rows
      }


    }

    return { status: true, message: 'Success.', data: result };
  } catch (error) {
    console.log("err -", error)
    return { status: false, message: 'Error getting job.' };
  }




}

const getByJobStaffId = async (job) => {
  const { Staff_id } = job;
  try {
    const query = `
  SELECT 
  jobs.id AS job_id,
  job_types.type AS job_type_name,
  customer_contact_details.id AS account_manager_officer_id,
  customer_contact_details.first_name AS account_manager_officer_first_name,
  customer_contact_details.last_name AS account_manager_officer_last_name,
  clients.trading_name AS client_trading_name,
  jobs.client_job_code AS client_job_code,
  jobs.invoiced AS invoiced,
  jobs.total_hours AS total_hours,
  jobs.total_hours_status AS total_hours_status,

  staffs.id AS allocated_id,
  staffs.first_name AS allocated_first_name,
  staffs.last_name AS allocated_last_name,

  staffs2.id AS reviewer_id,
  staffs2.first_name AS reviewer_first_name,
  staffs2.last_name AS reviewer_last_name,

  staffs3.id AS outbooks_acount_manager_id,
  staffs3.first_name AS outbooks_acount_manager_first_name,
  staffs3.last_name AS outbooks_acount_manager_last_name,

  master_status.name AS status,
  CONCAT(
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(jobs.job_id, 1, 15)
            ) AS job_code_id

  FROM 
  jobs
  LEFT JOIN 
  customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
  LEFT JOIN 
  clients ON jobs.client_id = clients.id
  LEFT JOIN 
  customers ON jobs.customer_id = customers.id
  LEFT JOIN 
  job_types ON jobs.job_type_id = job_types.id
  LEFT JOIN 
  services ON jobs.service_id = services.id
  LEFT JOIN 
  staffs ON jobs.allocated_to = staffs.id
  LEFT JOIN 
  staffs AS staffs2 ON jobs.reviewer = staffs2.id
  LEFT JOIN 
  staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
  LEFT JOIN 
  staffs AS staffs4 ON jobs.staff_created_id = staffs4.id
  LEFT JOIN
  master_status ON master_status.id = jobs.status_type
 WHERE 
  jobs.staff_created_id = ? OR 
  jobs.allocated_to = ? OR 
  jobs.reviewer = ?
  ORDER BY
  jobs.id DESC
  `;
    const [rows] = await pool.execute(query, [Staff_id, Staff_id, Staff_id]);
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("err -", error)
    return { status: false, message: 'Error getting job.' };
  }


}

const getJobById = async (job) => {
  const { job_id } = job;
  try {
    const query = `
    SELECT 
     jobs.id AS job_id,
     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name,
     customers.id AS customer_id,
     customers.trading_name AS customer_trading_name,
     clients.id AS client_id,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     services.id AS service_id,
     services.name AS service_name,
     job_types.id AS job_type_id,
     job_types.type AS job_type_name,
     jobs.budgeted_hours AS budgeted_hours,
     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,
     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,
     DATE_FORMAT(jobs.allocated_on, '%Y-%m-%d') AS allocated_on,
     DATE_FORMAT(jobs.date_received_on, '%Y-%m-%d') AS date_received_on,
     jobs.year_end AS year_end,
     jobs.total_preparation_time AS total_preparation_time,
     jobs.review_time AS review_time,
     jobs.feedback_incorporation_time AS feedback_incorporation_time,
     jobs.total_time AS total_time,
     jobs.engagement_model AS engagement_model,
     DATE_FORMAT(jobs.expected_delivery_date, '%Y-%m-%d') AS expected_delivery_date,
     DATE_FORMAT(jobs.due_on, '%Y-%m-%d') AS due_on,
     DATE_FORMAT(jobs.submission_deadline, '%Y-%m-%d') AS submission_deadline,
     DATE_FORMAT(jobs.customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
     DATE_FORMAT(jobs.sla_deadline_date, '%Y-%m-%d') AS sla_deadline_date,
     DATE_FORMAT(jobs.internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,
     jobs.filing_Companies_required AS filing_Companies_required,
     DATE_FORMAT(jobs.filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
     jobs.filing_hmrc_required AS filing_hmrc_required,
     DATE_FORMAT(jobs.filing_hmrc_date, '%Y-%m-%d') AS filing_hmrc_date,
     jobs.opening_balance_required AS opening_balance_required,
     DATE_FORMAT(jobs.opening_balance_date, '%Y-%m-%d') AS opening_balance_date,
     jobs.number_of_transaction AS number_of_transaction,
     jobs.number_of_balance_items AS number_of_balance_items,
     jobs.turnover AS turnover,
     jobs.number_of_employees AS number_of_employees,
     jobs.vat_reconciliation AS vat_reconciliation,
     jobs.bookkeeping AS bookkeeping,
     jobs.processing_type AS processing_type,
     jobs.invoiced AS invoiced,
     jobs.total_hours AS total_hours,
     jobs.total_hours_status AS total_hours_status,
     countries.id AS currency_id,
     countries.currency AS currency,
     jobs.invoice_value AS invoice_value,
     DATE_FORMAT(jobs.invoice_date, '%Y-%m-%d') AS invoice_date,
     jobs.invoice_hours AS invoice_hours,
     jobs.invoice_remark AS invoice_remark,
     jobs.status_type AS status_type,
     client_job_task.checklist_id AS checklist_id,
     checklist_tasks.budgeted_hour AS task_budgeted_hour,
     task.id AS task_id,
     task.name AS task_name
     FROM 
     jobs
     JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     JOIN 
     clients ON jobs.client_id = clients.id
     JOIN 
     customers ON jobs.customer_id = customers.id
     JOIN 
     job_types ON jobs.job_type_id = job_types.id
     JOIN 
     services ON jobs.service_id = services.id
     LEFT JOIN 
     staffs ON jobs.allocated_to = staffs.id
     LEFT JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     LEFT JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     LEFT JOIN 
     countries ON jobs.currency = countries.id
     LEFT JOIN 
     client_job_task ON client_job_task.job_id = jobs.id
     LEFT JOIN
     task ON client_job_task.task_id = task.id
     LEFT JOIN
     checklist_tasks ON checklist_tasks.checklist_id = client_job_task.checklist_id AND
     checklist_tasks.checklist_id = client_job_task.checklist_id AND checklist_tasks.task_id = client_job_task.task_id
     WHERE
      jobs.id = ? 
     `;


    const [rows] = await pool.execute(query, [job_id]);

    let result = {}
    if (rows.length > 0) {
      let tasks = []
      if (rows[0].task_id !== null) {
        tasks = await rows.map(row => ({
          task_id: row.task_id,
          task_name: row.task_name,
          budgeted_hour: row.task_budgeted_hour,
        }));
      }

      result = {
        job_id: rows[0].job_id,
        job_code_id: rows[0].job_code_id,
        customer_id: rows[0].customer_id,
        customer_trading_name: rows[0].customer_trading_name,
        client_id: rows[0].client_id,
        client_trading_name: rows[0].client_trading_name,
        client_job_code: rows[0].client_job_code,
        outbooks_acount_manager_id: rows[0].outbooks_acount_manager_id,
        outbooks_acount_manager_first_name: rows[0].outbooks_acount_manager_first_name,
        outbooks_acount_manager_last_name: rows[0].outbooks_acount_manager_last_name,
        account_manager_officer_id: rows[0].account_manager_officer_id,
        account_manager_officer_first_name: rows[0].account_manager_officer_first_name,
        account_manager_officer_last_name: rows[0].account_manager_officer_last_name,
        service_id: rows[0].service_id,
        service_name: rows[0].service_name,
        job_type_id: rows[0].job_type_id,
        job_type_name: rows[0].job_type_name,
        budgeted_hours: rows[0].budgeted_hours,
        reviewer_id: rows[0].reviewer_id,
        reviewer_first_name: rows[0].reviewer_first_name,
        reviewer_last_name: rows[0].reviewer_last_name,
        allocated_id: rows[0].allocated_id,
        allocated_first_name: rows[0].allocated_first_name,
        allocated_last_name: rows[0].allocated_last_name,
        allocated_on: rows[0].allocated_on,
        date_received_on: rows[0].date_received_on,
        year_end: rows[0].year_end,
        total_preparation_time: rows[0].total_preparation_time,
        review_time: rows[0].review_time,
        feedback_incorporation_time: rows[0].feedback_incorporation_time,
        total_time: rows[0].total_time,
        engagement_model: rows[0].engagement_model,
        expected_delivery_date: rows[0].expected_delivery_date,
        due_on: rows[0].due_on,
        submission_deadline: rows[0].submission_deadline,
        customer_deadline_date: rows[0].customer_deadline_date,
        sla_deadline_date: rows[0].sla_deadline_date,
        internal_deadline_date: rows[0].internal_deadline_date,
        filing_Companies_required: rows[0].filing_Companies_required,
        filing_Companies_date: rows[0].filing_Companies_date,
        filing_hmrc_required: rows[0].filing_hmrc_required,
        filing_hmrc_date: rows[0].filing_hmrc_date,
        opening_balance_required: rows[0].opening_balance_required,
        opening_balance_date: rows[0].opening_balance_date,
        number_of_transaction: rows[0].number_of_transaction,
        number_of_balance_items: rows[0].number_of_balance_items,
        turnover: rows[0].turnover,
        number_of_employees: rows[0].number_of_employees,
        vat_reconciliation: rows[0].vat_reconciliation,
        bookkeeping: rows[0].bookkeeping,
        processing_type: rows[0].processing_type,
        invoiced: rows[0].invoiced,
        total_hours: rows[0].total_hours,
        total_hours_status: rows[0].total_hours_status,
        currency_id: rows[0].currency_id,
        currency: rows[0].currency,
        invoice_value: rows[0].invoice_value,
        invoice_date: rows[0].invoice_date,
        invoice_hours: rows[0].invoice_hours,
        invoice_remark: rows[0].invoice_remark,
        status_type: rows[0].status_type,
        tasks: {
          checklist_id: rows[0].checklist_id,
          task: tasks
        }
      }



    }

    return { status: true, message: 'Success.', data: result };
  } catch (error) {
    console.log("error ", error)
    return { status: false, message: 'Error getting job.' };
  }


}

const jobUpdate = async (job) => {
  const {
    job_id, // Assuming job_id is provided for the update
    account_manager_id,
    customer_id,
    client_id,
    client_job_code,
    customer_contact_details_id,
    service_id,
    job_type_id,
    tasks,
    budgeted_hours,
    reviewer,
    allocated_to,
    allocated_on,
    date_received_on,
    year_end,
    total_preparation_time,
    review_time,
    feedback_incorporation_time,
    total_time,
    engagement_model,
    expected_delivery_date,
    due_on,
    submission_deadline,
    customer_deadline_date,
    sla_deadline_date,
    internal_deadline_date,
    filing_Companies_required,
    filing_Companies_date,
    filing_hmrc_required,
    filing_hmrc_date,
    opening_balance_required,
    opening_balance_date,
    number_of_transaction,
    number_of_balance_items,
    turnover,
    number_of_employees,
    vat_reconciliation,
    bookkeeping,
    processing_type,
    invoiced,
    currency,
    invoice_value,
    invoice_date,
    invoice_hours,
    invoice_remark,
    status_type
  } = job;


  const ExistJobQuery = `
 SELECT 
 account_manager_id,
 customer_id,
 client_id,
 client_job_code,
 customer_contact_details_id,
 service_id,
 job_type_id,
 budgeted_hours,
 reviewer,
 allocated_to,
 DATE_FORMAT(allocated_on, '%Y-%m-%d') AS allocated_on,
 DATE_FORMAT(date_received_on, '%Y-%m-%d') AS date_received_on,
 year_end,
 total_preparation_time,
 review_time,
 feedback_incorporation_time,
 total_time, engagement_model,
 
 DATE_FORMAT(expected_delivery_date, '%Y-%m-%d') AS expected_delivery_date,
 DATE_FORMAT(due_on, '%Y-%m-%d') AS due_on,
 DATE_FORMAT(submission_deadline, '%Y-%m-%d') AS submission_deadline,
 DATE_FORMAT(customer_deadline_date, '%Y-%m-%d') AS customer_deadline_date,
 DATE_FORMAT(sla_deadline_date, '%Y-%m-%d') AS sla_deadline_date,
 DATE_FORMAT(internal_deadline_date, '%Y-%m-%d') AS internal_deadline_date,

 filing_Companies_required,
 DATE_FORMAT(filing_Companies_date, '%Y-%m-%d') AS filing_Companies_date,
 filing_hmrc_required,
 DATE_FORMAT(filing_hmrc_date, '%Y-%m-%d') AS filing_hmrc_date,
 opening_balance_required,
 DATE_FORMAT(opening_balance_date, '%Y-%m-%d') AS opening_balance_date,
 
 number_of_transaction,
 number_of_balance_items,
 turnover,
 number_of_employees,
 vat_reconciliation,
 bookkeeping,
 processing_type,

 invoiced,
 currency,
 invoice_value,
 DATE_FORMAT(invoice_date, '%Y-%m-%d') AS invoice_date,
 invoice_hours,
 invoice_remark
 FROM jobs WHERE id = ?
 `
  try {
    const [[ExistJob]] = await pool.execute(ExistJobQuery, [job_id]);

    let status_type_update = status_type;
    if (status_type == null || status_type == 0 || status_type == 1) {
      if (allocated_to > 0) {
        status_type_update = 3
      }

      if (reviewer > 0) {
        status_type_update = 5
      }
    } else {
      if (status_type == 3) {
        if (reviewer > 0 && ExistJob.reviewer != 0) {
          status_type_update = 5
        }
      } else if (status_type == 5) {
        if (allocated_to > 0 && ExistJob.allocated_to != 0) {
          status_type_update = 3
        }
      }
    }

   
   
    const query = `
         UPDATE jobs 
         SET account_manager_id = ?, customer_id = ?, client_id = ?, client_job_code = ?, customer_contact_details_id = ?, 
             service_id = ?, job_type_id = ?, budgeted_hours = ?, reviewer = ?, allocated_to = ?, allocated_on = ?, 
             date_received_on = ?, year_end = ?, total_preparation_time = ?, review_time = ?, 
             feedback_incorporation_time = ?, total_time = ?, engagement_model = ?, expected_delivery_date = ?, due_on = ?, 
             submission_deadline = ?, customer_deadline_date = ?, sla_deadline_date = ?, internal_deadline_date = ?, 
             filing_Companies_required = ?, filing_Companies_date = ?, filing_hmrc_required = ?, filing_hmrc_date = ?, 
             opening_balance_required = ?, opening_balance_date = ?, number_of_transaction = ?, number_of_balance_items = ?, 
             turnover = ?, number_of_employees = ?, vat_reconciliation = ?, bookkeeping = ?, processing_type = ?, 
             invoiced = ?, currency = ?, invoice_value = ?, invoice_date = ?, invoice_hours = ?, invoice_remark = ?,status_type = ?
         WHERE id = ?
       `;
    const [result] = await pool.execute(query, [
      account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id,
      service_id, job_type_id, budgeted_hours, reviewer, allocated_to, allocated_on,
      date_received_on, year_end, total_preparation_time, review_time,
      feedback_incorporation_time, total_time, engagement_model, expected_delivery_date, due_on,
      submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date,
      filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date,
      opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items,
      turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type,
      invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark, status_type_update, job_id
    ]);

    if (result.affectedRows > 0) {
      if (tasks.task.length > 0) {
        const checklist_id = tasks.checklist_id;
        const providedTaskIds = tasks.task
          .filter(tsk => tsk.task_id !== null && tsk.task_id !== "")
          .map(tsk => tsk.task_id);


        // Working progresss.................

        // Get existing task IDs for the checklist
        const getExistingTasksQuery = `
            SELECT task_id FROM client_job_task WHERE checklist_id = ?
          `;
        const [existingTasks] = await pool.execute(getExistingTasksQuery, [checklist_id]);
        const existingTaskIds = existingTasks.map(task => task.task_id);




        // Find task IDs that need to be deleted
        const tasksToDelete = existingTaskIds.filter(id => !providedTaskIds.includes(id));



        if (tasksToDelete.length > 0) {
          // const deleteQuery = `
          //     DELETE FROM client_job_task WHERE job_id = ? checklist_id = ? AND task_id IN (?)
          //   `;
          // await pool.execute(deleteQuery, [job_id, checklist_id, tasksToDelete]);

          const deleteQuery = `
    DELETE FROM client_job_task 
    WHERE job_id = ? AND client_id = ? AND task_id IN (${tasksToDelete.map(() => '?').join(',')})
`;
          await pool.execute(deleteQuery, [job_id, client_id, ...tasksToDelete]);
        }

        // Insert or update tasks
        for (const tsk of tasks.task) {
          let task_id = tsk.task_id;
          let task_name = tsk.task_name;
          let budgeted_hour = tsk.budgeted_hour;

          if (task_id == "" || task_id == undefined || task_id == null) {
            const checkQuery = `
                SELECT id FROM task WHERE name = ?
              `;
            const [existing] = await pool.execute(checkQuery, [task_name]);

            if (existing.length === 0) {
              const query = `
                  INSERT INTO task (name, service_id, job_type_id) VALUES (?, ?, ?)
                `;

              const [result] = await pool.execute(query, [task_name, service_id, job_type_id]);

              if (result.insertId > 0) {
                let task_id_new = result.insertId;
                const checklistAddTasksQuery = `
                    INSERT INTO checklist_tasks (checklist_id, task_id, task_name, budgeted_hour)
                    VALUES (?, ?, ?, ?)
                  `;
                await pool.execute(checklistAddTasksQuery, [checklist_id, task_id_new, task_name, budgeted_hour]);

                const query3 = `
                    INSERT INTO client_job_task (job_id, client_id, checklist_id, task_id)
                    VALUES (?, ?, ?, ?)
                  `;
                await pool.execute(query3, [job_id, client_id, checklist_id, task_id_new]);
              }
            }
          } else {
            // Update existing task or add to the job
            const query = `
                INSERT INTO client_job_task (job_id, client_id, checklist_id, task_id)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE task_id = VALUES(task_id), checklist_id = VALUES(checklist_id);
              `;
            await pool.execute(query, [job_id, client_id, checklist_id, task_id]);
          }
        }
      }

      //Add log
      if (result.changedRows > 0) {

        let job_heading_name = []

        if (ExistJob.client_job_code !== client_job_code || ExistJob.customer_contact_details_id !== customer_contact_details_id || ExistJob.service_id !== service_id || ExistJob.job_type_id !== job_type_id || ExistJob.budgeted_hours.split(':').slice(0, 2).join(':') !== budgeted_hours || ExistJob.reviewer !== reviewer || ExistJob.allocated_to !== allocated_to || ExistJob.allocated_on !== allocated_on || ExistJob.date_received_on !== date_received_on || ExistJob.year_end !== year_end || ExistJob.total_preparation_time.split(':').slice(0, 2).join(':') !== total_preparation_time || ExistJob.review_time.split(':').slice(0, 2).join(':') !== review_time || ExistJob.feedback_incorporation_time.split(':').slice(0, 2).join(':') !== feedback_incorporation_time || ExistJob.total_time.split(':').slice(0, 2).join(':') !== total_time || ExistJob.engagement_model !== engagement_model) {
          job_heading_name.push('edited the job information')
        }
        

        if (ExistJob.expected_delivery_date !== expected_delivery_date || ExistJob.due_on !== due_on || ExistJob.submission_deadline !== submission_deadline || ExistJob.customer_deadline_date !== customer_deadline_date || ExistJob.sla_deadline_date !== sla_deadline_date || ExistJob.internal_deadline_date !== internal_deadline_date) {
          job_heading_name.push('edited the job deadline')
        }


        if (ExistJob.filing_Companies_required !== filing_Companies_required || ExistJob.filing_Companies_date !== filing_Companies_date || ExistJob.filing_hmrc_required !== filing_hmrc_required || ExistJob.filing_hmrc_date !== filing_hmrc_date || ExistJob.opening_balance_required !== opening_balance_required || ExistJob.opening_balance_date !== opening_balance_date) {
          job_heading_name.push('edited the job other tasks')
        }

        
        if (Number(ExistJob.number_of_transaction) !== number_of_transaction || ExistJob.number_of_balance_items !== number_of_balance_items || Number(ExistJob.turnover) !== turnover || ExistJob.number_of_employees !== number_of_employees || ExistJob.vat_reconciliation !== vat_reconciliation || ExistJob.bookkeeping !== bookkeeping || ExistJob.processing_type !== processing_type) {
          job_heading_name.push('edited the job other data')
        }


        if (ExistJob.invoiced !== invoiced || ExistJob.currency !== currency || ExistJob.invoice_value !== invoice_value || ExistJob.invoice_date !== invoice_date || ExistJob.invoice_hours.split(':').slice(0, 2).join(':') !== invoice_hours || ExistJob.invoice_remark !== invoice_remark) {
          job_heading_name.push('edited the job invoice data')
        }
          
        // reviewer,
        if(parseInt(ExistJob.reviewer) == 0){
          if(reviewer > 0){
           const [[getStaff]] = await pool.execute('SELECT id , CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ? ', [reviewer]);
            job_heading_name.push('has assigned the job to the reviewer, ' + getStaff.name)
          } 
        }else{
          if(reviewer != ExistJob.reviewer){
            const [[getStaff]] = await pool.execute('SELECT id , CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ? ', [reviewer]);
            job_heading_name.push('changed the job to the reviewer, ' + getStaff.name)
          }
        }

        // allocated_to,
        if(parseInt(ExistJob.allocated_to) == 0){
          if(allocated_to > 0){
            const [[getStaff]] = await pool.execute('SELECT id , CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ? ', [allocated_to]);
            job_heading_name.push('has assigned the job to the processor, ' + getStaff.name)
          }
        }else{
          if(allocated_to != ExistJob.allocated_to){
            const [[getStaff]] = await pool.execute('SELECT id , CONCAT(first_name," ",last_name) AS name FROM staffs WHERE id = ? ', [allocated_to]);
            job_heading_name.push('changed the job to the processor, ' + getStaff.name)
          }
        }

        //console.log("job_heading_name ", job_heading_name)
      
          
        if (job_heading_name.length > 0) {
          const msgLog = job_heading_name.length > 1
            ? job_heading_name.slice(0, -1).join(', ') + ' and ' + job_heading_name.slice(-1)
            : job_heading_name[0];
          const currentDate = new Date();
          await SatffLogUpdateOperation(
            {
              staff_id: job.StaffUserId,
              ip: job.ip,
              date: currentDate.toISOString().split('T')[0],
              module_name: 'job',
              log_message: `${msgLog} job code:`,
              permission_type: 'updated',
              module_id: job_id,
            }
          );

        }
      }

      return { status: true, message: 'Job updated successfully.', data: job_id };
    } else {
      return { status: false, message: 'No job found with the given job_id.' };
    }
  } catch (err) {
    console.log("err -", err);
    return { status: false, message: 'Error updating job.' };
  }
}

const deleteJobById = async (job) => {
  const { job_id } = job;
  try {
    if(parseInt(job_id) > 0){
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: job.StaffUserId,
          ip: job.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'job',
          log_message: `deletes job code:`,
          permission_type: 'deleted',
          module_id: job_id,
        }
      );
    }
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [job_id]);
    await pool.execute('DELETE FROM client_job_task WHERE job_id = ?', [job_id]);
    await pool.execute('DELETE FROM drafts WHERE job_id = ?', [job_id]);
    await pool.execute('DELETE FROM missing_logs WHERE job_id = ?', [job_id]);
    await pool.execute('DELETE FROM queries WHERE job_id = ?', [job_id]);
    if (result.affectedRows > 0) {
      return { status: true, message: 'Job deleted successfully.', data: job_id };
    } else {
      return { status: false, message: 'No job found with the given job_id.' };
    }
  } catch (err) {
    return { status: false, message: 'Error deleting job.' };
  }
}

const getJobTimeLine = async (job) => {
  const { job_id, staff_id } = job
  const query = `SELECT
    staff_logs.id AS log_id,
    staff_logs.staff_id AS staff_id,
    DATE_FORMAT(staff_logs.date, '%Y-%m-%d') AS date,
    staff_logs.created_at AS created_at,
    CONCAT(
      roles.role_name, ' ', 
      staffs.first_name, ' ', 
      staffs.last_name, ' ', 
      staff_logs.log_message, ' ',
      CASE 
         WHEN staff_logs.module_name = 'job' THEN (
          SELECT CONCAT(SUBSTRING(customers.trading_name, 1, 3),'_', SUBSTRING(clients.trading_name, 1, 3),'_',jobs.job_id)
          FROM jobs
          JOIN clients ON jobs.client_id = clients.id
          JOIN customers ON clients.customer_id = customers.id
          WHERE jobs.id = staff_logs.module_id
        )
        ELSE ''
      END
    ) AS log_message
FROM 
    staff_logs
JOIN 
    staffs ON staffs.id = staff_logs.staff_id
JOIN 
    roles ON roles.id = staffs.role_id
LEFT JOIN 
    jobs  ON staff_logs.module_name = 'job' AND staff_logs.module_id = jobs.id         
WHERE
    staff_logs.staff_id = ${staff_id} AND  staff_logs.module_name = "job" AND staff_logs.module_id = ${job_id}
ORDER BY
    staff_logs.id DESC
`;
  const [result] = await pool.execute(query);

  const groupedResult = result.reduce((acc, log) => {
    const existingDate = acc.find(item => item.date === log.date);
    if (existingDate) {
      existingDate.allContain.push({
        created_at: log.created_at,
        log_message: log.log_message
      });
    } else {
      acc.push({
        date: log.date,
        allContain: [{
          created_at: log.created_at,
          log_message: log.log_message
        }]
      });
    }

    return acc;
  }, []);

  return { status: true, message: "success.", data: groupedResult };

}

const updateJobStatus = async(job)=>{
  const { job_id, status_type } = job;
  try {

      if(parseInt(status_type)==6){
      const [ExistDraft] = await pool.execute(`SELECT job_id FROM drafts WHERE job_id = ?`, [job_id]);
      if(ExistDraft.length === 0){
        return { status: false, message: 'Please sent first draft.', data: "W" }; 
      }

       const [[rowsDraftProcess]] = await pool.execute(`SELECT 
          CASE
              WHEN NOT EXISTS (
                  SELECT 1 
                  FROM drafts 
                  WHERE job_id = ? 
                    AND was_it_complete <> '1'
              )
              THEN 1
              ELSE 0
          END AS status_check;`, [job_id]);
   

         if(rowsDraftProcess.status_check === 0){
            return { status: false, message: 'Please complete the draft.', data : "W" };
         }
      }

    const query = `
         UPDATE jobs 
         SET status_type = ?
         WHERE id = ?
       `;
    const [result] = await pool.execute(query, [status_type, job_id]);
    if (result.affectedRows > 0) {
      return { status: true, message: 'Job status updated successfully.', data: job_id };
    } else {
      return { status: false, message: 'No job found with the given job_id.' };
    }
  } catch (err) {
    return { status: false, message: 'Error updating job status.' };
  }
}

module.exports = {
  getAddJobData,
  jobAdd,
  getJobByCustomer,
  getJobByClient,
  getByJobStaffId,
  getJobById,
  jobUpdate,
  deleteJobById,
  getJobTimeLine,
  updateJobStatus
};