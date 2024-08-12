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





module.exports = {
    getAddJobData
};