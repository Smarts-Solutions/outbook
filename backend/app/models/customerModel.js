const pool = require('../config/database');

const createCustomer = async (customer) => {
    console.log("customer model id", customer.CustomerType)
    if (customer.CustomerType == "1") {
        // console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, First_Name, Last_Name, Phone, Email, Residential_Address } = customer;

        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
            const customer_id = result.insertId;

            const query2 = `
        INSERT INTO customer_contact_details (customer_id,first_name,last_name,phone,email,residential_address)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
            const [result2] = await pool.execute(query2, [customer_id, First_Name, Last_Name, Phone, Email, Residential_Address]);
            return customer_id;
        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if (customer.CustomerType == "2") {
        //console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in, contactDetails } = customer;

        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
            const customer_id = result.insertId;

            const query2 = `
        INSERT INTO customer_company_information (customer_id,company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
            const [result2] = await pool.execute(query2, [customer_id, company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in]);


            const query3 = `
        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone,email)
        VALUES (?, ?, ?, ?, ?, ?)
        `;

            for (const detail of contactDetails) {
                // console.log("detail",detail)
                let role = detail.role;
                let first_name = detail.firstName;
                let last_name = detail.lastName;
                let phone = detail.phoneNumber;
                let email = detail.email;
                //   console.log("first_name",first_name)
                //   console.log("last_name",last_name)
                //   console.log("role",role)
                //   console.log("phone_number",phone_number)
                //   console.log("email",email)
                const [result3] = await pool.execute(query3, [customer_id, role, first_name, last_name, phone, email]);

            }

            return customer_id;

        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if (customer.CustomerType == "3") {
        //console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, contactDetails } = customer;

        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
            const customer_id = result.insertId;


            const query2 = `
        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone,email,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

            for (const detail of contactDetails) {
                // console.log("detail",detail)
                let role = detail.role;
                let first_name = detail.firstName;
                let last_name = detail.lastName;
                let phone = detail.phoneNumber;
                let email = detail.email;
                let authorised_signatory_status = detail.authorised_signatory_status == true ? "1" : "0";
                //   console.log("first_name",first_name)
                //   console.log("last_name",last_name)
                //   console.log("role",role)
                //   console.log("phone_number",phone_number)
                //   console.log("email",email)
                //   console.log("authorised_signatory_status",authorised_signatory_status)
                const [result3] = await pool.execute(query2, [customer_id, role, first_name, last_name, phone, email, authorised_signatory_status]);

            }

            return customer_id;

        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

};

const updateProcessCustomerServices = async (customerProcessData) => {
    //console.log("customerProcessData",customerProcessData)
    const { customer_id, services } = customerProcessData;
    // console.log("customer_id",customer_id);
    // console.log("services",services);
    for (const serVal of services) {
        let service_id = serVal.service_id;
        let account_manager_id = serVal.account_manager_id;

        try {
            // Process 1 table
            const checkQuery = `
                SELECT id FROM customer_services WHERE customer_id = ? AND service_id = ?
            `;
            const [existing] = await pool.execute(checkQuery, [customer_id, service_id]);

            let customer_service_id;

            if (existing.length === 0) {
                // If not exists, insert into customer_services
                const insertQuery = `
                    INSERT INTO customer_services (customer_id, service_id)
                    VALUES (?, ?)
                `;
                const [result] = await pool.execute(insertQuery, [customer_id, service_id]);
                customer_service_id = result.insertId;
            } else {
                customer_service_id = existing[0].id;
            }


            // Process 2 table
            const insertManagerQuery = `
                INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                VALUES (?, ?)
            `;

            if (account_manager_id.length > 0) {
                for (const ac_id of account_manager_id) {
                    // WORKING IN PROGRESS................
                    const checkQuery2 = `
                    SELECT customer_service_id , account_manager_id FROM customer_service_account_managers WHERE customer_service_id = ? AND account_manager_id = ?
                   `;

                    const [existing2] = await pool.execute(checkQuery2, [customer_service_id, ac_id]);

                    if (existing2.length === 0) {
                        await pool.execute(insertManagerQuery, [customer_service_id, ac_id]);
                    }


                }
            }

        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }
    return customer_id;

}

const updateProcessCustomerEngagementModel = async (customerProcessData) => {
    // console.log("customerProcessData", customerProcessData)
    const { customer_id, fte_dedicated_staffing, percentage_model, adhoc_payg_hourly, customised_pricing } = customerProcessData;
    console.log("customer_id", customer_id);

    const checkQuery = `SELECT id FROM customer_engagement_model WHERE customer_id = ? `;
    const [existCustomer] = await pool.execute(checkQuery, [customer_id]);
    let customer_engagement_model_id;
    if (existCustomer.length === 0) {
        const insertCustomer = `INSERT INTO customer_engagement_model (customer_id) VALUES (?)`;
        const [result] = await pool.execute(insertCustomer, [customer_id]);
        customer_engagement_model_id = result.insertId;
    } else {
        customer_engagement_model_id = existCustomer[0].id;
    }



    console.log("customer_engagement_model_id", customer_engagement_model_id)



    if (fte_dedicated_staffing === "1") {

        const { customer_id, fte_dedicated_staffing, number_of_accountants, fee_per_accountant, number_of_bookkeepers, fee_per_bookkeeper, number_of_payroll_experts, fee_per_payroll_expert, number_of_tax_experts, fee_per_tax_expert, number_of_admin_staff, fee_per_admin_staff } = customerProcessData;

        console.log("fte_dedicated_staffing", fte_dedicated_staffing);

        const checkQuery1 = `SELECT id FROM customer_engagement_fte WHERE customer_engagement_model_id  = ?`;
        const [exist1] = await pool.execute(checkQuery1, [customer_engagement_model_id]);
        let fte_dedicated_staffing_id;

        if (exist1.length === 0) {
            // INSER
            const insertQuery = `
            INSERT INTO customer_engagement_fte (
                customer_engagement_model_id,
                number_of_accountants,
                fee_per_accountant,
                number_of_bookkeepers,
                fee_per_bookkeeper,
                number_of_payroll_experts,
                fee_per_payroll_expert,
                number_of_tax_experts,
                fee_per_tax_expert,
                number_of_admin_staff,
                fee_per_admin_staff
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
            const [result] = await pool.execute(insertQuery, [
                customer_engagement_model_id,
                number_of_accountants,
                fee_per_accountant,
                number_of_bookkeepers,
                fee_per_bookkeeper,
                number_of_payroll_experts,
                fee_per_payroll_expert,
                number_of_tax_experts,
                fee_per_tax_expert,
                number_of_admin_staff,
                fee_per_admin_staff
            ]);
            fte_dedicated_staffing_id = result.insertId;

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET fte_dedicated_staffing = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [fte_dedicated_staffing, customer_id]);

        } else {
            // UPDATE 
            fte_dedicated_staffing_id = exist1[0].id;
            const updateQuery = `
        UPDATE customer_engagement_fte SET
            number_of_accountants = ?,
            fee_per_accountant = ?,
            number_of_bookkeepers = ?,
            fee_per_bookkeeper = ?,
            number_of_payroll_experts = ?,
            fee_per_payroll_expert = ?,
            number_of_tax_experts = ?,
            fee_per_tax_expert = ?,
            number_of_admin_staff = ?,
            fee_per_admin_staff = ?
        WHERE id = ?
    `;
            await pool.execute(updateQuery, [
                number_of_accountants,
                fee_per_accountant,
                number_of_bookkeepers,
                fee_per_bookkeeper,
                number_of_payroll_experts,
                fee_per_payroll_expert,
                number_of_tax_experts,
                fee_per_tax_expert,
                number_of_admin_staff,
                fee_per_admin_staff,
                fte_dedicated_staffing_id
            ]);

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET fte_dedicated_staffing = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [fte_dedicated_staffing, customer_id]);
        }


    }

    if (percentage_model === "1") {

        const { customer_id,percentage_model,total_outsourcing,accountants,bookkeepers,payroll_experts,tax_experts,admin_staff} = customerProcessData;
        console.log("percentage_model", percentage_model);
        
        const checkQuery2 = `SELECT id FROM customer_engagement_percentage WHERE customer_engagement_model_id  = ?`;
        const [exist2] = await pool.execute(checkQuery2, [customer_engagement_model_id]);
        let customer_engagement_percentage_id;
        if (exist2.length === 0) {
            // INSER
            const insertQuery = `
            INSERT INTO customer_engagement_percentage (
                customer_engagement_model_id,
                total_outsourcing,
                accountants,
                bookkeepers,
                payroll_experts,
                tax_experts,
                admin_staff
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
            const [result] = await pool.execute(insertQuery, [
                customer_engagement_model_id,
                total_outsourcing,
                accountants,
                bookkeepers,
                payroll_experts,
                tax_experts,
                admin_staff  
            ]);
            customer_engagement_percentage_id = result.insertId;

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET percentage_model = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [percentage_model, customer_id]);
        } else {
            customer_engagement_percentage_id = exist2[0].id;
            // UPDATE
            const updateQuery = `
        UPDATE customer_engagement_percentage SET
            total_outsourcing = ?,
            accountants = ?,
            bookkeepers = ?,
            payroll_experts = ?,
            tax_experts = ?,
            admin_staff = ?
        WHERE id = ?
    `;
            await pool.execute(updateQuery, [
                total_outsourcing,
                accountants,
                bookkeepers,
                payroll_experts,
                tax_experts,
                admin_staff,
                customer_engagement_percentage_id
            ]);

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET percentage_model = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [percentage_model, customer_id]);
        }

    }


    if (adhoc_payg_hourly === "1") {
          
        const { customer_id, adhoc_payg_hourly,adhoc_accountants,adhoc_bookkeepers,adhoc_payroll_experts,adhoc_tax_experts,adhoc_admin_staff } = customerProcessData;

        console.log("adhoc_payg_hourly", adhoc_payg_hourly);
        const checkQuery3 = `SELECT id FROM customer_engagement_adhoc_hourly WHERE customer_engagement_model_id  = ?`;
        const [exist3] = await pool.execute(checkQuery3, [customer_engagement_model_id]);
        let customer_engagement_adhoc_hourly_id;
        if (exist3.length === 0) {

             const insertQuery = `
            INSERT INTO customer_engagement_adhoc_hourly (
                customer_engagement_model_id,
                adhoc_accountants,
                adhoc_bookkeepers,
                adhoc_payroll_experts,
                adhoc_tax_experts,
                adhoc_admin_staff

            ) VALUES (?, ?, ?, ?, ?, ?)
        `;
            const [result] = await pool.execute(insertQuery, [
                customer_engagement_model_id, 
                adhoc_accountants,
                adhoc_bookkeepers,
                adhoc_payroll_experts,
                adhoc_tax_experts,
                adhoc_admin_staff
            ]);
            
            customer_engagement_adhoc_hourly_id = result.insertId;

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET adhoc_payg_hourly = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [adhoc_payg_hourly, customer_id]);
        } else {
            customer_engagement_adhoc_hourly_id = exist3[0].id;
            // UPDATE
            const updateQuery = `
        UPDATE customer_engagement_adhoc_hourly SET
            adhoc_accountants = ?,
            adhoc_bookkeepers = ?,
            adhoc_payroll_experts = ?,
            adhoc_tax_experts = ?,
            adhoc_admin_staff = ?
        WHERE id = ?
    `;
            await pool.execute(updateQuery, [
                adhoc_accountants,
                adhoc_bookkeepers,
                adhoc_payroll_experts,
                adhoc_tax_experts,
                adhoc_admin_staff,
                customer_engagement_adhoc_hourly_id
            ]);

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET adhoc_payg_hourly = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [adhoc_payg_hourly, customer_id]);
        }

    }

    if (customised_pricing === "1") {
        
        const { customer_id, customised_pricing , customised_pricing_data} = customerProcessData;
        
     if(customised_pricing_data.length > 0){
        for (const customisedVal of customised_pricing_data) {   
        console.log("customised_pricing", customised_pricing);
        let minimum_number_of_jobs = customisedVal.minimum_number_of_jobs
        let job_type_id = customisedVal.job_type_id
        let cost_per_job = customisedVal.cost_per_job
        
        const checkQuery4 = `SELECT id FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ? AND minimum_number_of_jobs = ? AND job_type_id = ? AND cost_per_job = ?`;
        const [exist4] = await pool.execute(checkQuery4, [customer_engagement_model_id ,minimum_number_of_jobs , job_type_id , cost_per_job]);
        let customer_engagement_customised_pricing_id;
        console.log("exist4",exist4[0])
        if (exist4.length === 0) {
              const insertQuery = `
            INSERT INTO customer_engagement_customised_pricing (
                customer_engagement_model_id,
                minimum_number_of_jobs,
                job_type_id,
                cost_per_job
            ) VALUES (?, ?, ?, ?)
        `;
            const [result] = await pool.execute(insertQuery, [
                customer_engagement_model_id,
                minimum_number_of_jobs,
                job_type_id,
                cost_per_job
            ]);
            customer_engagement_customised_pricing_id = result.insertId;
        } else {
            customer_engagement_customised_pricing_id = exist4[0].id;
        }
     }
    }


    }


    // Delete Entry
    if (fte_dedicated_staffing === "0" || percentage_model === "0" || adhoc_payg_hourly === "0" || customised_pricing === "0") {

        if (fte_dedicated_staffing === "0") {
            const query = `
            DELETE FROM customer_engagement_fte WHERE customer_engagement_model_id = ? `;
            try {
                await pool.execute(query, [customer_engagement_model_id]);
            } catch (err) {
                console.error('Error deleting data:', err);
                throw err;
            }
            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET fte_dedicated_staffing = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [fte_dedicated_staffing, customer_id]);
        }

        if(percentage_model === "0"){
            const query = `
            DELETE FROM customer_engagement_percentage WHERE customer_engagement_model_id = ? `;
            try {
                await pool.execute(query, [customer_engagement_model_id]);
            } catch (err) {
                console.error('Error deleting data:', err);
                throw err;
            }

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET percentage_model = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [percentage_model, customer_id]);
        }

        if(adhoc_payg_hourly === "0"){
            const query = `
            DELETE FROM customer_engagement_adhoc_hourly WHERE customer_engagement_model_id = ? `;
            try {
                await pool.execute(query, [customer_engagement_model_id]);
            } catch (err) {
                console.error('Error deleting data:', err);
                throw err;
            }

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET adhoc_payg_hourly = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [adhoc_payg_hourly, customer_id]);
        }

        if(customised_pricing === "0"){
            const query = `
            DELETE FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ? `;
            try {
                await pool.execute(query, [customer_engagement_model_id]);
            } catch (err) {
                console.error('Error deleting data:', err);
                throw err;
            }

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET customised_pricing = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [customised_pricing, customer_id]);
        }


    }

    return customer_id;
}





module.exports = {
    createCustomer,
    updateProcessCustomerServices,
    updateProcessCustomerEngagementModel
};