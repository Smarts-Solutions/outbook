const pool = require('../config/database');

const getAddJobData = async (job) => {
  console.log("job -",job)
  const {customer_id} = job;

  
  // customer Client
  try {
    const queryCustomerWithClient = `
    SELECT  
        customers.id AS customer_id,
        customers.trading_name AS customer_trading_name,
        clients.id AS client_id,
        clients.trading_name AS client_trading_name
    FROM 
        customers
   JOIN 
        clients ON customers.id = clients.customer_id
   ORDER BY 
    customers.id DESC;
  `;
      const [rows] = await pool.execute(queryCustomerWithClient, [customer_id]);
    let  customer = [];
    let client = [];
      if (rows.length > 0) { 
     customer = {
        customer_id: rows[0].customer_id,
        customer_trading_name: rows[0].customer_trading_name
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
   ORDER BY 
    customers.id DESC;
  `;

      const [rows2] = await pool.execute(queryCustomerWithCustomerAccountManager, [customer_id]);
      let  customer_account_manager = []
      if (rows2.length > 0) { 
       customer_account_manager = rows2.map(row => ({
        customer_account_manager_officer_id: row.customer_account_manager_officer_id,
        customer_account_manager_officer_name: row.customer_account_manager_officer_first_name+" "+row.customer_account_manager_officer_last_name
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

    ORDER BY 
     customers.id DESC;
   `;
 
       const [rows3] = await pool.execute(queryCustomerWithJobType, [customer_id]);
        let  job_type = []
       if(rows3.length > 0){
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
        let  reviewer = []
        if (rows4.length > 0) { 
          reviewer = rows4.map(row => ({
          reviewer_id: row.reviewer_id,
          reviewer_name: row.reviewer_first_name+" "+row.reviewer_last_name
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
        let  allocated = []
        if (rows5.length > 0) { 
          allocated = rows5.map(row => ({
          allocated_id: row.staff_id,
          allocated_name: row.staff_first_name+" "+row.staff_last_name
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
        let  engagement_model = []
        if (rows6.length > 0) { 
          engagement_model = rows6.map(row => ({
            fte_dedicated_staffing : row.fte_dedicated_staffing,
            percentage_model : row.percentage_model,
            adhoc_payg_hourly : row.adhoc_payg_hourly,
            customised_pricing : row.customised_pricing
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
       let  services = []
       if (rows7.length > 0) { 
         services = rows7.map(row => ({
           service_id : row.service_id,
           service_name : row.service_name
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
   

      return { status: true, message: 'success.', data: {customer:customer,client:client ,customer_account_manager: customer_account_manager , services : services,job_type:job_type ,reviewer:reviewer , allocated : allocated ,engagement_model : engagement_model ,currency :rows8} };
     
  } catch (err) {
      console.log("err",err)
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
         console.log("nextCode", nextCode);
         newCode = "0000" + nextCode
         // newCode = nextCode.toString().padStart(5, '0');
     }
 
     return newCode;
 }

const jobAdd = async (job) => {
 // console.log("job -",job)
  const {
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
  //console.log("UniqueNo ",UniqueNo)
  // Exist Customer name
  const [ExistCustomer] = await pool.execute('SELECT trading_name FROM customers WHERE id =' + customer_id);
  const existCustomerName = ExistCustomer[0].trading_name
  const firstThreeLettersexistCustomerName = existCustomerName.substring(0, 3);

   // Exist Client name
   const [ExistClient] = await pool.execute('SELECT trading_name FROM Clients WHERE id =' + client_id);
   const existClientName = ExistClient[0].trading_name
   const firstThreeLettersexistClientName = existClientName.substring(0, 3);

   const job_id = firstThreeLettersexistCustomerName+"_"+firstThreeLettersexistClientName+"_"+UniqueNo;
  try {

const query = `
INSERT INTO jobs (job_id,account_manager_id,customer_id,client_id,client_job_code,customer_contact_details_id, service_id,job_type_id, budgeted_hours,reviewer, allocated_to,allocated_on,date_received_on,year_end,total_preparation_time, review_time, feedback_incorporation_time,total_time, engagement_model, expected_delivery_date,due_on,submission_deadline, customer_deadline_date, sla_deadline_date,internal_deadline_date, filing_Companies_required, filing_Companies_date,filing_hmrc_required, filing_hmrc_date, opening_balance_required,opening_balance_date, number_of_transaction, number_of_balance_items,turnover, number_of_employees, vat_reconciliation, bookkeeping,processing_type, invoiced, currency, invoice_value, invoice_date,invoice_hours, invoice_remark)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const [result] = await pool.execute(query, [job_id,account_manager_id,customer_id,client_id,client_job_code,customer_contact_details_id, service_id,job_type_id, budgeted_hours,reviewer, allocated_to,allocated_on,date_received_on,year_end,total_preparation_time, review_time, feedback_incorporation_time,total_time, engagement_model, expected_delivery_date,due_on,submission_deadline, customer_deadline_date, sla_deadline_date,internal_deadline_date, filing_Companies_required, filing_Companies_date,filing_hmrc_required, filing_hmrc_date, opening_balance_required,opening_balance_date, number_of_transaction, number_of_balance_items,turnover, number_of_employees, vat_reconciliation, bookkeeping,processing_type, invoiced, currency, invoice_value, invoice_date,invoice_hours, invoice_remark]);
  
    return { status: true, message: 'job add successfully.', data: result.insertId };
  } catch (err) {
    console.log("Error:", err);
    return { status: false, message: 'Error adding job.' };
  }
  
}

const getJobByCustomer = async (job) => {
     const {customer_id} = job;
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
     JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     JOIN 
     clients ON jobs.client_id = clients.id
     JOIN 
     job_types ON jobs.job_type_id = job_types.id
     JOIN 
     services ON jobs.service_id = services.id
     JOIN 
     staffs ON jobs.allocated_to = staffs.id
     JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     WHERE 
     jobs.customer_id = ?
     `;
     const [rows] = await pool.execute(query, [customer_id]);
     return { status: true, message: 'Success.', data: rows };
     } catch (error) {
     console.log("Error:", error);
     return { status: false, message: 'Error getting job.' };
     }
    

}

const getJobByClient = async (job) => {
     const {client_id} = job;
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
     JOIN 
     customer_contact_details ON jobs.customer_contact_details_id = customer_contact_details.id
     JOIN 
     clients ON jobs.client_id = clients.id
     JOIN 
     job_types ON jobs.job_type_id = job_types.id
     JOIN 
     services ON jobs.service_id = services.id
     JOIN 
     staffs ON jobs.allocated_to = staffs.id
     JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     WHERE 
     jobs.client_id = ?
     `;
     const [rows] = await pool.execute(query, [client_id]);
     return { status: true, message: 'Success.', data: rows };
     } catch (error) {
     console.log("Error:", error);
     return { status: false, message: 'Error getting job.' };
     }
    

}

const getJobById = async (job) => {
     const {job_id} = job;
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
     jobs.allocated_on AS allocated_on,
     jobs.date_received_on AS date_received_on,
     jobs.year_end AS year_end,
     jobs.total_preparation_time AS total_preparation_time,
     jobs.review_time AS review_time,
     jobs.feedback_incorporation_time AS feedback_incorporation_time,
     jobs.total_time AS total_time,
     jobs.engagement_model AS engagement_model,
     jobs.expected_delivery_date AS expected_delivery_date,
     jobs.due_on AS due_on,
     jobs.submission_deadline AS submission_deadline,
     jobs.customer_deadline_date AS customer_deadline_date,
     jobs.sla_deadline_date AS sla_deadline_date,
     jobs.internal_deadline_date AS internal_deadline_date,
     jobs.filing_Companies_required AS filing_Companies_required,
     jobs.filing_Companies_date AS filing_Companies_date,
     jobs.filing_hmrc_required AS filing_hmrc_required,
     jobs.filing_hmrc_date AS filing_hmrc_date,
     jobs.opening_balance_required AS opening_balance_required,
     jobs.opening_balance_date AS opening_balance_date,
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
     jobs.invoice_date AS invoice_date,
     jobs.invoice_hours AS invoice_hours,
     jobs.invoice_remark AS invoice_remark
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
     JOIN 
     staffs ON jobs.allocated_to = staffs.id
     JOIN 
     staffs AS staffs2 ON jobs.reviewer = staffs2.id
     JOIN 
     staffs AS staffs3 ON jobs.account_manager_id = staffs3.id
     LEFT JOIN 
     countries ON jobs.currency = countries.id
     WHERE 
     jobs.id = ?
     `;
     const [rows] = await pool.execute(query, [job_id]);
     return { status: true, message: 'Success.', data: rows };
     } catch (error) {
     console.log("Error:", error);
     return { status: false, message: 'Error getting job.' };
     }
    

}

const jobUpdate = async (job) => {
     // console.log("job -",job)
      const {
        job_id,
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
    const exit_job_id = firstThreeLettersexistCustomerName+"_"+firstThreeLettersexistClientName+"_"+lastCode;
    
     console.log("exit_job_id",exit_job_id)

    try {
     const query = `
         UPDATE jobs 
         SET 
             job_id = ?,
             account_manager_id = ?,
             customer_id = ?,
             client_id = ?,
             client_job_code = ?,
             customer_contact_details_id = ?,
             service_id = ?,
             job_type_id = ?,
             budgeted_hours = ?,
             reviewer = ?,
             allocated_to = ?,
             allocated_on = ?,
             date_received_on = ?,
             year_end = ?,
             total_preparation_time = ?,
             review_time = ?,
             feedback_incorporation_time = ?,
             total_time = ?,
             engagement_model = ?,
             expected_delivery_date = ?,
             due_on = ?,
             submission_deadline = ?,
             customer_deadline_date = ?,
             sla_deadline_date = ?,
             internal_deadline_date = ?,
             filing_Companies_required = ?,
             filing_Companies_date = ?,
             filing_hmrc_required = ?,
             filing_hmrc_date = ?,
             opening_balance_required = ?,
             opening_balance_date = ?,
             number_of_transaction = ?,
             number_of_balance_items = ?,
             turnover = ?,
             number_of_employees = ?,
             vat_reconciliation = ?,
             bookkeeping = ?,
             processing_type = ?,
             invoiced = ?,
             currency = ?,
             invoice_value = ?,
             invoice_date = ?,
             invoice_hours = ?,
             invoice_remark = ?
         WHERE id = ?
     `;
     const [result] = await pool.execute(query, [
           exit_job_id,
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
           job_id
     ]);
 
     return { status: true, message: 'job updated successfully', data: result.affectedRows };
 } catch (err) {
     console.log("Error:", err);
     return { status: false, message: 'Error updating job.' };
 }
      
    }






module.exports = {
    getAddJobData,
    jobAdd,
    getJobByCustomer,
    getJobByClient,
    getJobById,
    jobUpdate
};