const pool = require('../config/database');

const createCustomer = async (customer) => {

   
    
  
    console.log("customer model id",customer.CustomerType)
    if(customer.CustomerType == "1"){
        console.log("customer model",customer)
     const { CustomerType,staff_id,account_manager_id,Trading_Name,Trading_Address,VAT_Registered,VAT_Number,Website,PageStatus,First_Name,Last_Name,Phone,Email,Residential_Address} = customer;

    const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await pool.execute(query, [CustomerType,staff_id,account_manager_id,Trading_Name,Trading_Address,VAT_Registered,VAT_Number,Website,PageStatus]);
        const customer_id = result.insertId;

        const query2 = `
        INSERT INTO customer_contact_details (customer_id,first_name,last_name,phone,email,residential_address)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result2] = await pool.execute(query2, [customer_id, First_Name,Last_Name,Phone,Email,Residential_Address]);
        return customer_id;
    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
  }

//   else if(customer.CustomerType == "2"){
//     console.log("customer model",customer)
//     const { CustomerType,staff_id,account_manager_id,Trading_Name,Trading_Address,VAT_Registered,VAT_Number,Website,PageStatus,company_name,entity_type,company_status,comapny_number,Registered_Office_Addres,Incorporation_Date,Incorporation_in,contactDetails } = customer;

//     const query = `
//     INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,trading_address,vat_registered,vat_number,website,form_process)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     try {
//         const [result] = await pool.execute(query, [CustomerType,staff_id,account_manager_id,Trading_Name,Trading_Address,VAT_Registered,VAT_Number,Website,PageStatus]);
//         const customer_id = result.insertId;


//         const query2 = `
//         INSERT INTO company_details (customer_id,company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const [result2] = await pool.execute(query2, [customer_id, company_name,entity_type,company_status,comapny_number,Registered_Office_Addres,Incorporation_Date,Incorporation_in]);
       
         
//         const query3 = `
//         INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone,email)
//         VALUES (?, ?, ?, ?, ?, ?)
//         `;

//         for (const detail of contactDetails) {
//             // console.log("detail",detail)
//               let role = detail.role;
//               let first_name = detail.firstName;
//               let last_name = detail.lastName;
//               let phone = detail.phoneNumber;
//               let email = detail.email;
//             //   console.log("first_name",first_name)
//             //   console.log("last_name",last_name)
//             //   console.log("role",role)
//             //   console.log("phone_number",phone_number)
//             //   console.log("email",email)
//               const [result3] = await pool.execute(query3, [customer_id,role,first_name,last_name,phone,email]);
              
//           }
        
//         return customer_id;
      
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         throw err;
//     }
//   }

if (customer.CustomerType == "2") {

    //  work in progressss..................
    console.log("customer model", customer);
    const {
        CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address,
        VAT_Registered, VAT_Number, Website, PageStatus, company_name, entity_type,
        comapny_status , company_number, Registered_Office_Address, Incorporation_Date,
        Incorporation_in, contactDetails
    } = customer;

    const query1 = `
    INSERT INTO customers (customer_type, staff_id, account_manager_id, trading_name, trading_address, vat_registered, vat_number, website, form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result1] = await pool.execute(query1, [CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
        const customer_id = result1.insertId;

        const query2 = `
        INSERT INTO customer_company_information (customer_id, company_name, entity_type, company_status, company_number, registered_office_address, incorporation_date, incorporation_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        console.log("customer_id",customer_id)
        console.log("company_name",company_name)
        console.log("entity_type",entity_type)
        console.log("company_status",company_status)
        console.log("company_number",company_number)
        console.log("Registered_Office_Address",Registered_Office_Address)
        console.log("Incorporation_Date",Incorporation_Date)
        console.log("Incorporation_in",Incorporation_in)

        const [result2] = await pool.execute(query2, [customer_id, company_name, entity_type, company_status, company_number, Registered_Office_Address, Incorporation_Date, Incorporation_in]);



        const query3 = `
        INSERT INTO customer_contact_details (customer_id, contact_person_role_id, first_name, last_name, phone, email)
        VALUES (?, ?, ?, ?, ?, ?)
        `;

        for (const detail of contactDetails) {
            const { role, firstName: first_name, lastName: last_name, phoneNumber: phone, email } = detail;
            await pool.execute(query3, [customer_id, role, first_name, last_name, phone, email]);
        }

        return customer_id;

    } catch (err) {
        console.error('Error inserting data:', err);
        throw err;
    }
}


   
};



module.exports = {
    createCustomer,
};