const pool = require('../config/database');
const deleteUploadFile = require('../../app/middlewares/deleteUploadFile');
//   deleteUploadFile('1722257591646-SSSSSSSS.jpg')

async function generateNextUniqueCode() {
    const [rows] = await pool.execute('SELECT customer_code FROM customers ORDER BY id DESC LIMIT 1');
    let newCode = '00001'; // Default code if table is empty
    if (rows.length > 0) {
        const inputString = rows[0].customer_code;
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

const createCustomer = async (customer) => {
    // Customer Code(cust+CustName+UniqueNo)
    let UniqueNo = await generateNextUniqueCode()

    if (customer.CustomerType == "1") {
        // console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, First_Name, Last_Name, Phone, Email, Residential_Address } = customer;
        const firstThreeLetters = Trading_Name.substring(0, 3)
        const customer_code = "cust_" + firstThreeLetters + "_" + UniqueNo;


        const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ?`;

        const [check] = await pool.execute(checkQuery, [Trading_Name]);
        if (check.length > 0) {
            return { status: false, message: 'Customer Trading Name Already Exists.' };
        }



        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
            const customer_id = result.insertId;

            const query2 = `
        INSERT INTO customer_contact_details (customer_id,first_name,last_name,phone,email,residential_address)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
            const [result2] = await pool.execute(query2, [customer_id, First_Name, Last_Name, Phone, Email, Residential_Address]);
            return { status: true, message: 'customer add successfully.', data: customer_id };
        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if (customer.CustomerType == "2") {
        //console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in, contactDetails } = customer;

        const firstThreeLetters = Trading_Name.substring(0, 3)
        const customer_code = "cust_" + firstThreeLetters + "_" + UniqueNo;
        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
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

            return { status: true, message: 'customer add successfully.', data: customer_id };

        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    else if (customer.CustomerType == "3") {
        //console.log("customer model", customer)
        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, contactDetails } = customer;

        const firstThreeLetters = Trading_Name.substring(0, 3)
        const customer_code = "cust_" + firstThreeLetters + "_" + UniqueNo;

        const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        try {
            const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus]);
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

            return { status: true, message: 'customer add successfully.', data: customer_id };

        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

};

const getCustomer = async (customer) => {
    const query = `
    SELECT 
    customers.*, 
    staff1.first_name AS staff_firstname, 
    staff1.last_name AS staff_lastname,
    staff2.first_name AS account_manager_firstname, 
    staff2.last_name AS account_manager_lastname,
    customer_company_information.company_name AS company_name,
    customer_company_information.company_number AS company_number
FROM 
    customers
JOIN 
    staffs AS staff1 ON customers.staff_id = staff1.id
JOIN 
    staffs AS staff2 ON customers.account_manager_id = staff2.id
LEFT JOIN 
    customer_company_information ON customers.id = customer_company_information.customer_id
ORDER BY 
    customers.id DESC;
    `;

    try {
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success..', data: result };

    } catch (err) {
        // console.error('Error selecting data:', err);
      return { status: true, message: 'Error selecting data', data: err };
    }

}

const deleteCustomer = async (customer) => {
    // const { customer_id } = customer;
    // console.log("customer_id", customer_id);
    // try {
    //     await pool.execute('DELETE FROM customers WHERE id = ?', [customer_id]);
    //     await pool.execute('DELETE FROM customer_company_information WHERE customer_id = ?', [customer_id]);
    // } catch (err) {
    //     console.error('Error deleting data:', err);
    //     throw err;
    // }

}

const updateProcessCustomerServices = async (customerProcessData) => {
    //console.log("customerProcessData",customerProcessData)
    const { customer_id, services } = customerProcessData;
    const [ExistCustomer] = await pool.execute('SELECT customer_type , customer_code , account_manager_id  FROM `customers` WHERE id =' + customer_id);

    var account_manager_id_exit = ExistCustomer[0].account_manager_id;
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


                const selectManagerQuery = `
                        SELECT COUNT(*) as count 
                        FROM customer_service_account_managers 
                        WHERE customer_service_id = ? AND account_manager_id = ?
                    `;

                    const [rows] = await pool.execute(selectManagerQuery, [customer_service_id, account_manager_id_exit]);
                    const exists = rows[0].count > 0;

                    if (!exists) {

                const insertManagerQuery1 = `
                INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                VALUES (?, ?)
                `;
                await pool.execute(insertManagerQuery1, [customer_service_id, account_manager_id_exit]);
                    }
            }
            else {
                const selectManagerQuery = `
                        SELECT COUNT(*) as count 
                        FROM customer_service_account_managers 
                        WHERE customer_service_id = ? AND account_manager_id = ?
                    `;

                    const [rows] = await pool.execute(selectManagerQuery, [customer_service_id, account_manager_id_exit]);
                    const exists = rows[0].count > 0;

                    if (!exists) {

                const insertManagerQuery2 = `
                INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                VALUES (?, ?)
                `;
                await pool.execute(insertManagerQuery2, [customer_service_id, account_manager_id_exit]);
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

        const { customer_id, percentage_model, total_outsourcing, accountants, bookkeepers, payroll_experts, tax_experts, admin_staff } = customerProcessData;
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

        const { customer_id, adhoc_payg_hourly, adhoc_accountants, adhoc_bookkeepers, adhoc_payroll_experts, adhoc_tax_experts, adhoc_admin_staff } = customerProcessData;

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

        const { customer_id, customised_pricing, customised_pricing_data } = customerProcessData;

        if (customised_pricing_data.length > 0) {
            for (const customisedVal of customised_pricing_data) {
                console.log("customised_pricing", customised_pricing);
                let minimum_number_of_jobs = customisedVal.minimum_number_of_jobs
                let job_type_id = customisedVal.job_type_id
                let cost_per_job = customisedVal.cost_per_job

                const checkQuery4 = `SELECT id FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ? AND minimum_number_of_jobs = ? AND job_type_id = ? AND cost_per_job = ?`;
                const [exist4] = await pool.execute(checkQuery4, [customer_engagement_model_id, minimum_number_of_jobs, job_type_id, cost_per_job]);
                let customer_engagement_customised_pricing_id;
                console.log("exist4", exist4[0])
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

        const updateQueryEngagementModel = `UPDATE customer_engagement_model SET customised_pricing = ? WHERE customer_id = ? `;
        await pool.execute(updateQueryEngagementModel, [customised_pricing, customer_id]);


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

        if (percentage_model === "0") {
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

        if (adhoc_payg_hourly === "0") {
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

        if (customised_pricing === "0") {
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

const updateProcessCustomerFile = async (customerProcessDataFiles, customer_id) => {
    console.log("customerProcessDataFiles", customerProcessDataFiles);
    console.log("customer_id", customer_id);
    if (customerProcessDataFiles.length > 0) {

        for (let file of customerProcessDataFiles) {
            const file_name = file.filename;
            const original_name = file.originalname;
            const file_type = file.mimetype;
            const file_size = file.size;


            const insertQuery = `
                INSERT INTO customer_paper_work (
                    customer_id, file_name, original_name, file_type, file_size
                ) VALUES (?, ?, ?, ?, ?)
            `;

            try {
                const [result] = await pool.execute(insertQuery, [
                    customer_id,
                    file_name,
                    original_name,
                    file_type,
                    file_size
                ]);

                console.log(`File inserted with ID: ${result.insertId}`);
            } catch (error) {
                console.error('Error inserting file:', error);
            }
        }
    }
    return customer_id
}

const updateProcessCustomerFileGet = async (customerProcessData) => {
    const { customer_id } = customerProcessData;
    console.log("customer_id", customer_id);
    try {
        const query = `SELECT * FROM customer_paper_work WHERE customer_id = ?`
        const [result] = await pool.execute(query, [customer_id]);
        return result;
    } catch (err) {
        //console.error('Error selecting data:', err);
        return [];
    }

}

const updateProcessCustomerFileDelete = async (customerProcessData) => {
    const { id, file_name } = customerProcessData;
    

    const query = `
    DELETE FROM customer_paper_work WHERE id = ?`;

    try {
        await pool.execute(query, [id]);
        deleteUploadFile(file_name)
        return { status: true, message: 'File deleted successfully.' };
    } catch (err) {
        return { status: false, message: 'Err file Delete' };
    }

}

const getSingleCustomer = async (customer) => {
    let customerDetals = {}
    const { customer_id, pageStatus } = customer;
    const [ExistCustomer] = await pool.execute('SELECT customer_type FROM `customers` WHERE id =' + customer_id);

    const customer_type = ExistCustomer[0].customer_type;

    // Page Status 1 
    if (pageStatus === "1") {
        //Solo Traders Details
        if (customer_type == "1") {
            const query = `
        SELECT 
        customers.id AS customer_id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.customer_code AS customer_code,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.status AS status,
        customer_contact_details.id AS contact_id,
        customer_contact_details.first_name AS first_name,
        customer_contact_details.last_name AS last_name,
        customer_contact_details.email AS email,
        customer_contact_details.phone AS phone,
        customer_contact_details.residential_address AS residential_address,
        customer_contact_person_role.name AS customer_role_contact_name,
        customer_contact_person_role.id AS customer_role_contact_id
    FROM 
        customers
    JOIN 
        customer_contact_details ON customers.id = customer_contact_details.customer_id
    LEFT JOIN 
        customer_contact_person_role ON customer_contact_person_role.id = customer_contact_details.contact_person_role_id 
    WHERE 
        customers.id = ?
`;

            const [rows] = await pool.execute(query, [customer_id]);

            if (rows.length > 0) {

                const customerData = {
                    customer_id: rows[0].customer_id,
                    customer_type: rows[0].customer_type,
                    staff_id: rows[0].staff_id,
                    account_manager_id: rows[0].account_manager_id,
                    trading_name: rows[0].trading_name,
                    customer_code: rows[0].customer_code,
                    trading_address: rows[0].trading_address,
                    vat_registered: rows[0].vat_registered,
                    vat_number: rows[0].vat_number,
                    website: rows[0].website,
                    form_process: rows[0].form_process,
                    status: rows[0].status,


                };

                const contactDetails = rows.map(row => ({
                    contact_id: row.contact_id,
                    customer_contact_person_role_id: row.customer_role_contact_id,
                    customer_contact_person_role_name: row.customer_role_contact_name,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    residential_address: row.residential_address,
                    // Add other contact detail fields as needed
                }));

                const result = {
                    customer: customerData,
                    contact_details: contactDetails
                };

                customerDetals = result
                return customerDetals
                // Return or further process `result` as needed
            } else {
                // console.log("No customer found with the given ID.");
                return []
            }
            ;
        }

        // Company Details
        else if (customer_type == "2") {
            const query = `
            SELECT
            customers.id AS customer_id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.customer_code AS customer_code,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.status AS status, 
            customer_contact_details.id AS contact_id,
            customer_contact_details.first_name AS first_name,
            customer_contact_details.last_name AS last_name,
            customer_contact_details.email AS email,
            customer_contact_details.phone AS phone,
            customer_contact_details.residential_address AS residential_address,
            customer_company_information.*,
            customer_contact_person_role.name AS customer_role_contact_name,
            customer_contact_person_role.id AS customer_role_contact_id
            FROM 
                customers
            JOIN 
                customer_contact_details ON customers.id = customer_contact_details.customer_id
            LEFT JOIN 
                customer_contact_person_role ON customer_contact_person_role.id = customer_contact_details.contact_person_role_id 
            JOIN 
                customer_company_information ON customers.id = customer_company_information.customer_id    
            WHERE 
                customers.id = ?
        `;

            const [rows] = await pool.execute(query, [customer_id]);

            if (rows.length > 0) {

                const customerData = {
                    customer_id: rows[0].customer_id,
                    customer_type: rows[0].customer_type,
                    staff_id: rows[0].staff_id,
                    account_manager_id: rows[0].account_manager_id,
                    trading_name: rows[0].trading_name,
                    customer_code: rows[0].customer_code,
                    trading_address: rows[0].trading_address,
                    vat_registered: rows[0].vat_registered,
                    vat_number: rows[0].vat_number,
                    website: rows[0].website,
                    form_process: rows[0].form_process,
                    status: rows[0].status,
                };

                const companyData = {
                    company_name: rows[0].company_name,
                    entity_type: rows[0].entity_type,
                    company_status: rows[0].company_status,
                    company_number: rows[0].company_number,
                    registered_office_address: rows[0].registered_office_address,
                    incorporation_date: rows[0].incorporation_date,
                    incorporation_in: rows[0].incorporation_in
                };

                const contactDetails = rows.map(row => ({
                    contact_id: row.contact_id,
                    customer_contact_person_role_id: row.customer_role_contact_id,
                    customer_contact_person_role_name: row.customer_role_contact_name,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    residential_address: row.residential_address,
                    // Add other contact detail fields as needed
                }));

                const result = {
                    customer: customerData,
                    company_details: companyData,
                    contact_details: contactDetails
                };

                customerDetals = result
                return customerDetals
                // Return or further process `result` as needed
            } else {
                // console.log("No customer found with the given ID.");
                return []
            }
            ;
        }

        // Partnership Details
        else if (customer_type == "3") {
            const query = `
            SELECT 
            customers.id AS customer_id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.customer_code AS customer_code,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.status AS status,
            customer_contact_details.id AS contact_id,
            customer_contact_details.first_name AS first_name,
            customer_contact_details.last_name AS last_name,
            customer_contact_details.email AS email,
            customer_contact_details.phone AS phone,
            customer_contact_details.residential_address AS residential_address,
            customer_contact_details.authorised_signatory_status AS authorised_signatory_status,
                customer_contact_person_role.name AS customer_role_contact_name,
                customer_contact_person_role.id AS customer_role_contact_id
            FROM 
                customers
            JOIN 
                customer_contact_details ON customers.id = customer_contact_details.customer_id
            LEFT JOIN 
                customer_contact_person_role ON customer_contact_person_role.id = customer_contact_details.contact_person_role_id   
            WHERE 
                customers.id = ?
        `;

            const [rows] = await pool.execute(query, [customer_id]);

            if (rows.length > 0) {

                const customerData = {
                    customer_id: rows[0].customer_id,
                    customer_type: rows[0].customer_type,
                    staff_id: rows[0].staff_id,
                    account_manager_id: rows[0].account_manager_id,
                    trading_name: rows[0].trading_name,
                    customer_code: rows[0].customer_code,
                    trading_address: rows[0].trading_address,
                    vat_registered: rows[0].vat_registered,
                    vat_number: rows[0].vat_number,
                    website: rows[0].website,
                    form_process: rows[0].form_process,
                    status: rows[0].status,
                };


                const contactDetails = rows.map(row => ({
                    contact_id: row.contact_id,
                    customer_contact_person_role_id: row.customer_role_contact_id,
                    customer_contact_person_role_name: row.customer_role_contact_name,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone: row.phone,
                    residential_address: row.residential_address,
                    authorised_signatory_status: row.authorised_signatory_status
                    // Add other contact detail fields as needed
                }));

                const result = {
                    customer: customerData,
                    contact_details: contactDetails
                };

                customerDetals = result
                return customerDetals
                // Return or further process `result` as needed
            } else {
                // console.log("No customer found with the given ID.");
                return []
            }
            ;
        }

    }

    //  Page Status 2 Service Part
    else if (pageStatus === "2") {
        const query = `
        SELECT 
            customers.id AS customer_id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.customer_code AS customer_code,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.status AS status,
            customer_services.id as customer_service_id,
            customer_services.service_id,
            GROUP_CONCAT(customer_service_account_managers.account_manager_id) AS account_manager_ids
        FROM 
            customers
        JOIN 
            customer_services ON customers.id = customer_services.customer_id
        LEFT JOIN 
            customer_service_account_managers ON customer_services.id = customer_service_account_managers.customer_service_id
        WHERE 
            customers.id = ?
        GROUP BY
            customers.id, customer_services.id
    `;

        const [rows] = await pool.execute(query, [customer_id]);
        if (rows.length > 0) {
            const customerData = {
                customer_id: rows[0].customer_id,
                customer_type: rows[0].customer_type,
                staff_id: rows[0].staff_id,
                trading_name: rows[0].trading_name,
                customer_code: rows[0].customer_code,
                trading_address: rows[0].trading_address,
                vat_registered: rows[0].vat_registered,
                vat_number: rows[0].vat_number,
                website: rows[0].website,
                form_process: rows[0].form_process,
                status: rows[0].status,
            };

            const services = rows.map(row => ({
                service_id: row.service_id,
                account_manager_ids: row.account_manager_ids ? row.account_manager_ids.split(',').map(Number) : []
            }));

            const result = {
                customer: customerData,
                services: services
            };

            return result;
        } else {
            // console.log("No customer found with the given ID.");
            return [];
        }


    }

    //  Page Status 3 Customer engagement model Part
    else if (pageStatus === "3") {
        const query = `
        SELECT 
            customers.id AS customer_id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.customer_code AS customer_code,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.status AS status,
            customer_engagement_model.*, 
            customer_engagement_fte.*, 
            customer_engagement_percentage.*, 
            customer_engagement_adhoc_hourly.*, 
            customer_engagement_customised_pricing.id AS customised_pricing_id,
            customer_engagement_customised_pricing.minimum_number_of_jobs AS minimum_number_of_jobs,
            customer_engagement_customised_pricing.job_type_id AS job_type_id,
            customer_engagement_customised_pricing.cost_per_job AS cost_per_job
        FROM 
            customers
        JOIN 
            customer_engagement_model ON customers.id = customer_engagement_model.customer_id
        LEFT JOIN 
            customer_engagement_fte ON customer_engagement_model.id = customer_engagement_fte.customer_engagement_model_id 
        LEFT JOIN 
            customer_engagement_percentage ON customer_engagement_model.id = customer_engagement_percentage.customer_engagement_model_id
        LEFT JOIN 
            customer_engagement_adhoc_hourly ON customer_engagement_model.id = customer_engagement_adhoc_hourly.customer_engagement_model_id
        LEFT JOIN 
            customer_engagement_customised_pricing ON customer_engagement_model.id = customer_engagement_customised_pricing.customer_engagement_model_id
        WHERE 
            customers.id = ?
        `;

        const [rows] = await pool.execute(query, [customer_id]);
        if (rows.length > 0) {
            const customerData = {
                customer_id: rows[0].customer_id,
                customer_type: rows[0].customer_type,
                staff_id: rows[0].staff_id,
                account_manager_id: rows[0].account_manager_id,
                trading_name: rows[0].trading_name,
                customer_code: rows[0].customer_code,
                trading_address: rows[0].trading_address,
                vat_registered: rows[0].vat_registered,
                vat_number: rows[0].vat_number,
                website: rows[0].website,
                form_process: rows[0].form_process,
                status: rows[0].status,
            };

            const customer_engagement_model_status = {
                fte_dedicated_staffing: rows[0].fte_dedicated_staffing, // replace with actual field name
                percentage_model: rows[0].percentage_model, // replace with actual field name
                adhoc_payg_hourly: rows[0].adhoc_payg_hourly, // replace with actual field name
                customised_pricing: rows[0].customised_pricing, // replace with actual field name
                // Add other fields as necessary
            };

            let fte_dedicated_staffing = {}
            if (rows[0].fte_dedicated_staffing == "1") {
                fte_dedicated_staffing = {
                    number_of_accountants: rows[0].number_of_accountants,
                    fee_per_accountant: rows[0].fee_per_accountant,
                    number_of_bookkeepers: rows[0].number_of_bookkeepers,
                    fee_per_bookkeeper: rows[0].fee_per_bookkeeper,
                    number_of_payroll_experts: rows[0].number_of_payroll_experts,
                    fee_per_payroll_expert: rows[0].fee_per_payroll_expert,
                    number_of_tax_experts: rows[0].number_of_tax_experts,
                    fee_per_tax_expert: rows[0].fee_per_tax_expert,
                    number_of_admin_staff: rows[0].number_of_admin_staff,
                    fee_per_admin_staff: rows[0].fee_per_admin_staff
                };
            }


            let percentage_model = {}
            if (rows[0].percentage_model == "1") {
                percentage_model = {
                    total_outsourcing: rows[0].total_outsourcing,
                    accountants: rows[0].accountants,
                    bookkeepers: rows[0].bookkeepers,
                    payroll_experts: rows[0].payroll_experts,
                    tax_experts: rows[0].tax_experts,
                    admin_staff: rows[0].admin_staff
                };
            }

            let adhoc_payg_hourly = {}
            if (rows[0].adhoc_payg_hourly == "1") {
                adhoc_payg_hourly = {
                    adhoc_accountants: rows[0].adhoc_accountants,
                    adhoc_bookkeepers: rows[0].adhoc_bookkeepers,
                    adhoc_payroll_experts: rows[0].adhoc_payroll_experts,
                    adhoc_tax_experts: rows[0].adhoc_tax_experts,
                    adhoc_admin_staff: rows[0].adhoc_admin_staff
                };
            }


            let customised_pricing = {}
            if (rows[0].customised_pricing == "1") {
                customised_pricing = rows.map(row => ({
                    customised_pricing_id: row.customised_pricing_id,
                    minimum_number_of_jobs: row.minimum_number_of_jobs,
                    job_type_id: row.job_type_id,
                    cost_per_job: row.cost_per_job
                }));
            }



            const result = {
                customer: customerData,
                customer_engagement_model_status: customer_engagement_model_status,
                fte_dedicated_staffing: fte_dedicated_staffing,
                percentage_model: percentage_model,
                adhoc_payg_hourly: adhoc_payg_hourly,
                customised_pricing: customised_pricing,
            };

            return result;
        } else {
            return [];
        }
    }

    //  Page Status 4 Paper Work Part
    else if (pageStatus === "4") {
        const query = `
        SELECT 
            customers.id AS customer_id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.customer_code AS customer_code,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.status AS status,
            customer_paper_work.id AS customer_paper_work_id,
            customer_paper_work.file_name AS file_name,
            customer_paper_work.original_name AS original_name,
            customer_paper_work.file_type AS file_type,
            customer_paper_work.file_size AS file_size
        FROM 
            customers
        JOIN 
            customer_paper_work ON customers.id = customer_paper_work.customer_id
        WHERE 
            customers.id = ?
        `;

        const [rows] = await pool.execute(query, [customer_id]);
        if (rows.length > 0) {
            const customerData = {
                customer_id: rows[0].customer_id,
                customer_type: rows[0].customer_type,
                staff_id: rows[0].staff_id,
                account_manager_id: rows[0].account_manager_id,
                trading_name: rows[0].trading_name,
                customer_code: rows[0].customer_code,
                trading_address: rows[0].trading_address,
                vat_registered: rows[0].vat_registered,
                vat_number: rows[0].vat_number,
                website: rows[0].website,
                form_process: rows[0].form_process,
                status: rows[0].status,
            };

            const customer_paper_work = rows.map(row => ({
                customer_paper_work_id: row.customer_paper_work_id,
                file_name: row.file_name,
                original_name: row.original_name,
                file_type: row.file_type,
                file_size: row.file_size
            }));



            const result = {
                customer: customerData,
                customer_paper_work: customer_paper_work
            };

            return result;
        } else {
            return [];
        }
    }


}

const customerUpdate = async (customer) => {

    const { customer_id, pageStatus } = customer;
    const [ExistCustomer] = await pool.execute('SELECT customer_type , customer_code , account_manager_id  FROM `customers` WHERE id =' + customer_id);
    var account_manager_id = ExistCustomer[0].account_manager_id;
    const customer_type = ExistCustomer[0].customer_type;
    const lastCode = ExistCustomer[0].customer_code.slice(ExistCustomer[0].customer_code.lastIndexOf('_') + 1);

    // Page Status 1 
    if (pageStatus === "1") {

        console.log("customer", customer)
        const { customer_type, staff_id, account_manager_id, trading_name, trading_address, vat_registered, vat_number, website, contactDetails } = customer;


        const firstThreeLetters = trading_name.substring(0, 3);
        const customer_code = "cust_" + firstThreeLetters + "_" + lastCode;

        const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ? AND id != ?`;
        const [check] = await pool.execute(checkQuery, [trading_name, customer_id]);

        if (check.length > 0) {
            return { status: false, message: 'Customers Trading Name Already Exists.' };
        }

        const query = `
        UPDATE customers
        SET customer_type = ?, staff_id = ?, account_manager_id = ?, trading_name = ?, customer_code = ?, trading_address = ?, vat_registered = ?, vat_number = ?, website = ?
        WHERE id = ?
        `;

        const [result] = await pool.execute(query, [customer_type, staff_id, account_manager_id, trading_name, customer_code, trading_address, vat_registered, vat_number, website, customer_id]);

        //Solo Traders Details
        if (customer_type == "1") {

            let contact_id = contactDetails[0].contact_id;
            let first_name = contactDetails[0].first_name;
            let last_name = contactDetails[0].last_name;
            let email = contactDetails[0].email;
            let phone = contactDetails[0].phone;
            let residential_address = contactDetails[0].residential_address;

            const query2 = `
        UPDATE customer_contact_details
        SET first_name = ?, last_name = ?, phone = ?, email = ?, residential_address = ?
        WHERE customer_id = ? AND id = ?
         `;

            try {
                const [result2] = await pool.execute(query2, [first_name, last_name, phone, email, residential_address, customer_id, contact_id]);
                return { status: true, message: 'Customer updated successfully.', data: customer_id };
            } catch (err) {
                return { status: false, message: 'Update Error Customer Type 1' };
            }


        }

        // Company Details
        else if (customer_type == "2") {
            const { company_name, entity_type, company_status, company_number, registered_office_address, incorporation_date, incorporation_in } = customer;
            try {
                // Update customer_company_information

                console.log("registered_office_address", registered_office_address)
                console.log("incorporation_date", incorporation_date)
                console.log("incorporation_in", incorporation_in)
                console.log('customer', customer)


                const [incorporation_date_s] = incorporation_date.split('T');



                const query2 = `
                    UPDATE customer_company_information
                    SET company_name = ?, entity_type = ?, company_status = ?, company_number = ?, registered_office_address = ?, incorporation_date = ?, incorporation_in = ?
                    WHERE customer_id = ?
                `;
                const [result2] = await pool.execute(query2, [company_name, entity_type, company_status, company_number, registered_office_address, incorporation_date_s, incorporation_in, customer_id]);


                console.log("CP 2")

                const [existIdResult] = await pool.execute('SELECT id FROM customer_contact_details WHERE customer_id = ?', [customer_id]);
                const idArray = await existIdResult.map(item => item.id);
                let arrayInterId = []

                console.log("CP 3")

                // Update customer_contact_details
                const query3 = `
                    UPDATE customer_contact_details
                    SET contact_person_role_id = ?, first_name = ?, last_name = ?, phone = ?, email = ? ,residential_address = ?
                    WHERE customer_id = ? AND id = ?
                `;

                for (const detail of contactDetails) {

                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone = detail.phone;
                    let residential_address = detail.residential_address;
                    if (contact_id == "" || contact_id == undefined || contact_id == null) {
                        console.log("CP 4")

                        const query4 = `
                        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone,email,residential_address)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        const [result3] = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone, email, residential_address]);

                    }
                    else {
                        console.log("CP 5")
                        arrayInterId.push(contact_id)
                        const [result3] = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone, email, residential_address, customer_id, contact_id]);
                    }
                }

                let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
                console.log("CP 6")

                if (deleteIdArray.length > 0) {
                    for (const id of deleteIdArray) {

                        const query3 = `
                        DELETE FROM customer_contact_details WHERE id = ?
                        `;
                        const [result3] = await pool.execute(query3, [id]);
                    }
                }


                return { status: true, message: 'Customer updated successfully.', data: customer_id };

            } catch (err) {
                console.log("err ", err)
                return { status: false, message: 'Update Error Customer Type 2' };
            }


        }

        // Partnership Details
        else if (customer_type == "3") {

            try {


                const [existIdResult] = await pool.execute('SELECT id FROM customer_contact_details WHERE customer_id = ?', [customer_id]);
                const idArray = await existIdResult.map(item => item.id);
                let arrayInterId = []


                const query3 = `
                UPDATE customer_contact_details
                SET contact_person_role_id = ?, first_name = ?, last_name = ?, phone = ?, email = ? ,residential_address = ? ,authorised_signatory_status = ?
                WHERE customer_id = ? AND id = ?
               `;



                for (const detail of contactDetails) {

                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone = detail.phone;
                    let residential_address = detail.residential_address;
                    let authorised_signatory_status = detail.authorised_signatory_status;
                    if (contact_id == "" || contact_id == undefined || contact_id == null) {
                        const query4 = `
                        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone,email,residential_address,authorised_signatory_status)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        `;
                        const [result3] = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone, email, residential_address, authorised_signatory_status]);
                    } else {

                        arrayInterId.push(contact_id)
                        const [result3] = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone, email, residential_address, authorised_signatory_status, customer_id, contact_id]);
                    }

                }

                let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
                if (deleteIdArray.length > 0) {
                    for (const id of deleteIdArray) {
                        const query3 = `
                        DELETE FROM customer_contact_details WHERE id = ?
                        `;
                        const [result3] = await pool.execute(query3, [id]);
                    }
                }

                return { status: true, message: 'Customer updated successfully.', data: customer_id };

            } catch (err) {
                return { status: false, message: 'Update Error Customer Type 3' };
            }

        }

    }

    //  Page Status 2 Service Part
    else if (pageStatus === "2") {
        const { services } = customer;

        const [ExistServiceids] = await pool.execute('SELECT service_id  FROM `customer_services` WHERE customer_id =' + customer_id);
        const [ExistCustomer] = await pool.execute('SELECT customer_type , customer_code , account_manager_id  FROM `customers` WHERE id =' + customer_id);
        var account_manager_id = ExistCustomer[0].account_manager_id;

        const idArray = await ExistServiceids.map(item => item.service_id);
        let arrayInterId = []

        for (const serVal of services) {
            let service_id = serVal.service_id;
            let account_manager_ids = serVal.account_manager_ids;
            arrayInterId.push(service_id)
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

                await pool.execute('DELETE FROM customer_service_account_managers WHERE customer_service_id = ?', [customer_service_id]);


                if (account_manager_ids.length > 0) {
                    for (const ac_id of account_manager_ids) {
                        //If not exists, insert into customer_service_account_managers
                        const insertManagerQuery = `
                                INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                                VALUES (?, ?)
                            `;
                        await pool.execute(insertManagerQuery, [customer_service_id, ac_id]);
                    }
                    const selectManagerQuery = `
                    SELECT COUNT(*) as count 
                    FROM customer_service_account_managers 
                    WHERE customer_service_id = ? AND account_manager_id = ?
                `;

                const [rows] = await pool.execute(selectManagerQuery, [customer_service_id, account_manager_id]);
                const exists = rows[0].count > 0;

                   if (!exists) {
                    const insertManagerQuery2 = `
                        INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                        VALUES (?, ?)
                    `;
                    await pool.execute(insertManagerQuery2, [customer_service_id, account_manager_id]);
                  } 
                } else {

                    const selectManagerQuery = `
                        SELECT COUNT(*) as count 
                        FROM customer_service_account_managers 
                        WHERE customer_service_id = ? AND account_manager_id = ?
                    `;

                    const [rows] = await pool.execute(selectManagerQuery, [customer_service_id, account_manager_id]);
                    const exists = rows[0].count > 0;

                    if (!exists) {
                        const insertManagerQuery2 = `
                            INSERT INTO customer_service_account_managers (customer_service_id, account_manager_id)
                            VALUES (?, ?)
                        `;
                        await pool.execute(insertManagerQuery2, [customer_service_id, account_manager_id]);
                    } 
                }

            } catch (err) {
                console.log("err", err)
                return { status: false, message: 'Customer Services Err update.' };
            }
        }

        let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
        if (deleteIdArray.length > 0) {
            for (const id of deleteIdArray) {

                const query = `
            SELECT id 
            FROM customer_services 
            WHERE customer_id = ? AND service_id = ?
           `;
                const [ExistCustomeServicesId] = await pool.execute(query, [customer_id, id]);
                if (ExistCustomeServicesId.length > 0) {
                    await pool.execute('DELETE FROM customer_service_account_managers WHERE customer_service_id = ?', [ExistCustomeServicesId[0].id]);
                }


                const query3 = `
                DELETE FROM customer_services WHERE service_id = ? AND customer_id= ?
                `;
                await pool.execute(query3, [id, customer_id]);
            }
        }
        return { status: true, message: 'customer services update successfully.', data: customer_id };


    }

    //  Page Status 3 Customer engagement model Part
    else if (pageStatus === "3") {

        // console.log("customer", customer)
        const { customer_id, fte_dedicated_staffing, percentage_model, adhoc_payg_hourly, customised_pricing } = customer;
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

            const { customer_id, fte_dedicated_staffing, number_of_accountants, fee_per_accountant, number_of_bookkeepers, fee_per_bookkeeper, number_of_payroll_experts, fee_per_payroll_expert, number_of_tax_experts, fee_per_tax_expert, number_of_admin_staff, fee_per_admin_staff } = customer;

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

            const { customer_id, percentage_model, total_outsourcing, accountants, bookkeepers, payroll_experts, tax_experts, admin_staff } = customer;
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

            const { customer_id, adhoc_payg_hourly, adhoc_accountants, adhoc_bookkeepers, adhoc_payroll_experts, adhoc_tax_experts, adhoc_admin_staff } = customer;

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

            const { customer_id, customised_pricing, customised_pricing_data } = customer;

            const [existPricingData] = await pool.execute('SELECT id FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ?', [customer_engagement_model_id]);

            console.log("existPricingData", existPricingData);

            const idArray = existPricingData.map(item => item.id);
            let arrayInterId = [];

            if (customised_pricing_data.length > 0) {
                for (const customisedVal of customised_pricing_data) {
                    console.log("customised_pricing", customised_pricing);
                    let customised_pricing_id = customisedVal.customised_pricing_id;
                    let minimum_number_of_jobs = customisedVal.minimum_number_of_jobs;
                    let job_type_id = customisedVal.job_type_id;
                    let cost_per_job = customisedVal.cost_per_job;

                    if (customised_pricing_id == "" || customised_pricing_id == undefined || customised_pricing_id == null) {
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
                        arrayInterId.push(customised_pricing_id);

                        const updateQuery = `
                            UPDATE customer_engagement_customised_pricing SET
                                minimum_number_of_jobs = ?, job_type_id = ?, cost_per_job = ?
                            WHERE id = ?
                        `;
                        await pool.execute(updateQuery, [
                            minimum_number_of_jobs,
                            job_type_id,
                            cost_per_job,
                            customised_pricing_id
                        ]);
                    }
                }

                let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
                if (deleteIdArray.length > 0) {
                    for (const id of deleteIdArray) {
                        const query3 = `
                            DELETE FROM customer_engagement_customised_pricing WHERE id = ?
                        `;
                        await pool.execute(query3, [id]);
                    }
                }
            }

            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET customised_pricing = ? WHERE customer_id = ? `;
            await pool.execute(updateQueryEngagementModel, [customised_pricing, customer_id]);



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

            if (percentage_model === "0") {
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

            if (adhoc_payg_hourly === "0") {
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

            if (customised_pricing === "0") {
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

        return { status: true, message: 'customers model updated successfully.', data: customer_id };

    }

    //  Page Status 4 Paper Work Part
    // else if (pageStatus === "4") {
    //     console.log("Done")
    //     const { customer_id, customer_paper_work } = customer;

    //     const [ExistPaperWorkIds] = await pool.execute('SELECT id  FROM `customer_paper_work` WHERE customer_id =' + customer_id);
    //     console.log("customer_id", customer_id);
    //     console.log("customer_paper_work", customer_paper_work);
      



        
    // }
    else {
        return { status: false, message: 'Error in page status.' };
    }

    return { status: true, message: 'customers updated successfully.', data: customer_id };
}






module.exports = {
    createCustomer,
    getCustomer,
    deleteCustomer,
    updateProcessCustomerServices,
    updateProcessCustomerEngagementModel,
    updateProcessCustomerFile,
    updateProcessCustomerFileGet,
    updateProcessCustomerFileDelete,
    getSingleCustomer,
    customerUpdate

};