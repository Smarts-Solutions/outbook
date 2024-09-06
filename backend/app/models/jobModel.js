const pool = require('../config/database');

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
        clients.trading_name AS client_trading_name
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
        client_trading_name: row.client_trading_name
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
     staffs.role_id = 20   
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

async function generateNextUniqueCode() {

  const [rows] = await pool.execute('SELECT job_id FROM jobs ORDER BY id DESC LIMIT 1');
  let newCode = '00001'; // Default code if table is empty
  if (rows.length > 0) {
    const inputString = rows[0].job_id;
    const parts = inputString.split('_');
    const lastPart = parts[parts.length - 1];
    const lastCode = lastPart;
    const nextCode = parseInt(lastCode, 10) + 1;

    newCode = "0000" + nextCode
    // newCode = nextCode.toString().padStart(5, '0');
  }

  return newCode;
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


  let UniqueNo = await generateNextUniqueCode()

  const [ExistCustomer] = await pool.execute('SELECT trading_name FROM customers WHERE id =' + customer_id);
  const existCustomerName = ExistCustomer[0].trading_name
  const firstThreeLettersexistCustomerName = existCustomerName.substring(0, 3);

  const [ExistClient] = await pool.execute('SELECT trading_name FROM clients WHERE id =' + client_id);
  const existClientName = ExistClient[0].trading_name
  const firstThreeLettersexistClientName = existClientName.substring(0, 3);

  const job_id = firstThreeLettersexistCustomerName + "_" + firstThreeLettersexistClientName + "_" + UniqueNo;
  try {

    const query = `
INSERT INTO jobs (staff_created_id,job_id,account_manager_id,customer_id,client_id,client_job_code,customer_contact_details_id, service_id,job_type_id, budgeted_hours,reviewer, allocated_to,allocated_on,date_received_on,year_end,total_preparation_time, review_time, feedback_incorporation_time,total_time, engagement_model, expected_delivery_date,due_on,submission_deadline, customer_deadline_date, sla_deadline_date,internal_deadline_date, filing_Companies_required, filing_Companies_date,filing_hmrc_required, filing_hmrc_date, opening_balance_required,opening_balance_date, number_of_transaction, number_of_balance_items,turnover, number_of_employees, vat_reconciliation, bookkeeping,processing_type, invoiced, currency, invoice_value, invoice_date,invoice_hours, invoice_remark)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const [result] = await pool.execute(query, [staffCreatedId, job_id, account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id, service_id, job_type_id, budgeted_hours, reviewer, allocated_to, allocated_on, date_received_on, year_end, total_preparation_time, review_time, feedback_incorporation_time, total_time, engagement_model, expected_delivery_date, due_on, submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date, filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date, opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items, turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type, invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark]);
    if (result.insertId > 0) {
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
  const { customer_id } = job;
  try {
    const query = `
     SELECT 
     jobs.id AS job_id,
     jobs.job_id AS job_code_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,

     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name

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
     WHERE 
     jobs.customer_id = customers.id AND 
     jobs.customer_id = ?
     ORDER BY 
      jobs.id DESC;
     `;
    const [rows] = await pool.execute(query, [customer_id]);
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {
    console.log("err -", error)
    return { status: false, message: 'Error getting job.' };
  }


}

const getJobByClient = async (job) => {
  const { client_id } = job;
  console.log("client_id ", client_id)
  try {
    const query = `
     SELECT 
     jobs.id AS job_id,
     jobs.job_id AS job_code_id,
     job_types.type AS job_type_name,
     customer_contact_details.id AS account_manager_officer_id,
     customer_contact_details.first_name AS account_manager_officer_first_name,
     customer_contact_details.last_name AS account_manager_officer_last_name,
     clients.trading_name AS client_trading_name,
     jobs.client_job_code AS client_job_code,
     jobs.invoiced AS invoiced,
     staffs.id AS allocated_id,
     staffs.first_name AS allocated_first_name,
     staffs.last_name AS allocated_last_name,

     staffs2.id AS reviewer_id,
     staffs2.first_name AS reviewer_first_name,
     staffs2.last_name AS reviewer_last_name,

     staffs3.id AS outbooks_acount_manager_id,
     staffs3.first_name AS outbooks_acount_manager_first_name,
     staffs3.last_name AS outbooks_acount_manager_last_name

     FROM 
     jobs
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
    
     WHERE 
     jobs.client_id = clients.id AND
     jobs.client_id = ?
      ORDER BY
      jobs.id DESC;
     `;
    const [rows] = await pool.execute(query, [client_id]);
    console.log("rows ", rows)
    return { status: true, message: 'Success.', data: rows };
  } catch (error) {

    return { status: false, message: 'Error getting job.' };
  }




}

const getByJobStaffId = async (job) => {
  const { Staff_id } = job;
  try {
    const query = `
  SELECT 
  jobs.id AS job_id,
  jobs.job_id AS job_code_id,
  job_types.type AS job_type_name,
  customer_contact_details.id AS account_manager_officer_id,
  customer_contact_details.first_name AS account_manager_officer_first_name,
  customer_contact_details.last_name AS account_manager_officer_last_name,
  clients.trading_name AS client_trading_name,
  jobs.client_job_code AS client_job_code,
  jobs.invoiced AS invoiced,

  staffs.id AS allocated_id,
  staffs.first_name AS allocated_first_name,
  staffs.last_name AS allocated_last_name,

  staffs2.id AS reviewer_id,
  staffs2.first_name AS reviewer_first_name,
  staffs2.last_name AS reviewer_last_name,

  staffs3.id AS outbooks_acount_manager_id,
  staffs3.first_name AS outbooks_acount_manager_first_name,
  staffs3.last_name AS outbooks_acount_manager_last_name

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
     countries.id AS currency_id,
     countries.currency AS currency,
     jobs.invoice_value AS invoice_value,
     DATE_FORMAT(jobs.invoice_date, '%Y-%m-%d') AS invoice_date,
     jobs.invoice_hours AS invoice_hours,
     jobs.invoice_remark AS invoice_remark,
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
     checklist_tasks ON checklist_tasks.checklist_id = client_job_task.checklist_id
     WHERE
     checklist_tasks.checklist_id = client_job_task.checklist_id AND checklist_tasks.task_id = client_job_task.task_id AND
     jobs.id = ?
     `;
    const [rows] = await pool.execute(query, [job_id]);
    //  console.log("rows ",rows)
    let result = {}
    if (rows.length > 0) {

      const tasks = await rows.map(row => ({
        task_id: row.task_id,
        task_name: row.task_name,
        budgeted_hour: row.task_budgeted_hour,
      }));

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
        currency_id: rows[0].currency_id,
        currency: rows[0].currency,
        invoice_value: rows[0].invoice_value,
        invoice_date: rows[0].invoice_date,
        invoice_hours: rows[0].invoice_hours,
        invoice_remark: rows[0].invoice_remark,
        tasks: {
          checklist_id: rows[0].checklist_id,
          task: tasks
        }
      }



    }
    console.log("result ", result)
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
    invoice_remark
  } = job;


  const [ExistCustomer] = await pool.execute('SELECT trading_name FROM customers WHERE id = ?', [customer_id]);
  const [ExistClient] = await pool.execute('SELECT trading_name FROM clients WHERE id = ?', [client_id]);
  const [ExistJob] = await pool.execute('SELECT job_id FROM jobs WHERE id = ?', [job_id]);

  const lastCode = ExistJob[0].job_id.slice(ExistJob[0].job_id.lastIndexOf('_') + 1);

  const firstThreeLettersexistCustomerName = ExistCustomer[0].trading_name.substring(0, 3);
  const firstThreeLettersexistClientName = ExistClient[0].trading_name.substring(0, 3);
  const exit_job_id = firstThreeLettersexistCustomerName + "_" + firstThreeLettersexistClientName + "_" + lastCode;

  try {
    const query = `
         UPDATE jobs 
         SET job_id = ? ,account_manager_id = ?, customer_id = ?, client_id = ?, client_job_code = ?, customer_contact_details_id = ?, 
             service_id = ?, job_type_id = ?, budgeted_hours = ?, reviewer = ?, allocated_to = ?, allocated_on = ?, 
             date_received_on = ?, year_end = ?, total_preparation_time = ?, review_time = ?, 
             feedback_incorporation_time = ?, total_time = ?, engagement_model = ?, expected_delivery_date = ?, due_on = ?, 
             submission_deadline = ?, customer_deadline_date = ?, sla_deadline_date = ?, internal_deadline_date = ?, 
             filing_Companies_required = ?, filing_Companies_date = ?, filing_hmrc_required = ?, filing_hmrc_date = ?, 
             opening_balance_required = ?, opening_balance_date = ?, number_of_transaction = ?, number_of_balance_items = ?, 
             turnover = ?, number_of_employees = ?, vat_reconciliation = ?, bookkeeping = ?, processing_type = ?, 
             invoiced = ?, currency = ?, invoice_value = ?, invoice_date = ?, invoice_hours = ?, invoice_remark = ?
         WHERE id = ?
       `;
    const [result] = await pool.execute(query, [
      exit_job_id, account_manager_id, customer_id, client_id, client_job_code, customer_contact_details_id,
      service_id, job_type_id, budgeted_hours, reviewer, allocated_to, allocated_on,
      date_received_on, year_end, total_preparation_time, review_time,
      feedback_incorporation_time, total_time, engagement_model, expected_delivery_date, due_on,
      submission_deadline, customer_deadline_date, sla_deadline_date, internal_deadline_date,
      filing_Companies_required, filing_Companies_date, filing_hmrc_required, filing_hmrc_date,
      opening_balance_required, opening_balance_date, number_of_transaction, number_of_balance_items,
      turnover, number_of_employees, vat_reconciliation, bookkeeping, processing_type,
      invoiced, currency, invoice_value, invoice_date, invoice_hours, invoice_remark, job_id
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
       
        console.log("tasksToDelete ",tasksToDelete)
        console.log("job_id ",job_id)
        console.log("checklist_id ",checklist_id)

        if (tasksToDelete.length > 0) {
          const deleteQuery = `
              DELETE FROM client_job_task WHERE job_id = ? checklist_id = ? AND task_id IN (?)
            `;
          await pool.execute(deleteQuery, [job_id, checklist_id, tasksToDelete]);
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
      return { status: true, message: 'Job updated successfully.', data: job_id };
    } else {
      return { status: false, message: 'No job found with the given job_id.' };
    }
  } catch (err) {
    console.log("err -", err);
    return { status: false, message: 'Error updating job.' };
  }
}

const deleteJobById = async(job)=>{
  const { job_id } = job;
  try {
    
    const [result] = await pool.execute('DELETE FROM jobs WHERE id = ?', [job_id]);
    await pool.execute('DELETE FROM client_job_task WHERE job_id = ?', [job_id]);
    if (result.affectedRows > 0) {
      return { status: true, message: 'Job deleted successfully.', data: job_id };
    } else {
      return { status: false, message: 'No job found with the given job_id.' };
    }
  } catch (err) {
    return { status: false, message: 'Error deleting job.' };
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
  deleteJobById

};