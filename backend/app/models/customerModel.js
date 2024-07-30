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
            return customer_id;
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

            return customer_id;

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

            return customer_id;

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
    staffs.first_name AS staff_firstname, 
    staffs.last_name AS staff_lastname,
    customer_company_information.company_name AS company_name,
    customer_company_information.company_number AS company_number
FROM 
    customers
JOIN 
    staffs ON customers.staff_id = staffs.id
LEFT JOIN 
    customer_company_information ON customers.id = customer_company_information.customer_id;
    `;

    try {
        const [result] = await pool.execute(query);
        return result;
    } catch (err) {
        // console.error('Error selecting data:', err);
        return [];
    }

}

const deleteCustomer = async (customer) => {
    // const { id } = customer;
    // console.log("customer_id", id);
    // const query = `
    // DELETE FROM customers WHERE id = ?`;

    // try {
    //     await pool.execute(query, [id]);
    // } catch (err) {
    //     console.error('Error deleting data:', err);
    //     throw err;
    // }

}

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
    console.log("customer_id", customer_id);
    const query = `
    DELETE FROM customer_paper_work WHERE id = ?`;

    try {
        await pool.execute(query, [id]);
        deleteUploadFile(file_name)
    } catch (err) {
        console.error('Error deleting data:', err);
        throw err;
    }

}

const getSingleCustomer = async (customer) => {
    let customerDetals = {}
    const { customer_id, pageStatus } = customer;
    console.log("customer_id", customer_id);
    const [ExistCustomer] = await pool.execute('SELECT customer_type FROM `customers` WHERE id =' + customer_id);
    console.log("pageStatus", pageStatus);
    console.log("ExistCustomer", ExistCustomer[0].customer_type);
    const customer_type = ExistCustomer[0].customer_type;

    // Page Status 1 
    if (pageStatus === "1") {
        //Solo Traders Details
        if (customer_type == "1") {
            const query = `
    SELECT 
        customers.*, 
        customer_contact_details.*,
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
                    id: rows[0].id,
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
                customers.*, 
                customer_contact_details.*,
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
                    id: rows[0].id,
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
                customers.*, 
                customer_contact_details.*,
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
                    id: rows[0].id,
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
            customers.id,
            customers.staff_id,
            customers.trading_name,
            customers.customer_code,
            customers.trading_address,
            customers.vat_registered,
            customers.vat_number,
            customers.website,
            customers.form_process,
            customers.status,
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
                id: rows[0].id,
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
            customers.*, 
            customer_engagement_model.*, 
            customer_engagement_fte.*, 
            customer_engagement_percentage.*, 
            customer_engagement_adhoc_hourly.*, 
            customer_engagement_customised_pricing.*
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
                id: rows[0].id,
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
                    number_of_accountants:rows[0].number_of_accountants,
                    fee_per_accountant:rows[0].fee_per_accountant,
                    number_of_bookkeepers:rows[0].number_of_bookkeepers,
                    fee_per_bookkeeper:rows[0].fee_per_bookkeeper,
                    number_of_payroll_experts:rows[0].number_of_payroll_experts,
                    fee_per_payroll_expert:rows[0].fee_per_payroll_expert,
                    number_of_tax_experts:rows[0].number_of_tax_experts,
                    fee_per_tax_expert:rows[0].fee_per_tax_expert,
                    number_of_admin_staff:rows[0].number_of_admin_staff,
                    fee_per_admin_staff:rows[0].fee_per_admin_staff
                };
            }


            let percentage_model = {}
            if (rows[0].percentage_model == "1") {
            percentage_model = {
                total_outsourcing : rows[0].total_outsourcing,
                accountants : rows[0].accountants,
                bookkeepers : rows[0].bookkeepers,
                payroll_experts : rows[0].payroll_experts,
                tax_experts : rows[0].tax_experts,
                admin_staff : rows[0].admin_staff
                };
            }

            let adhoc_payg_hourly = {}
            if (rows[0].adhoc_payg_hourly == "1") {
            adhoc_payg_hourly = {
                adhoc_accountants:rows[0].adhoc_accountants,
                adhoc_bookkeepers:rows[0].adhoc_bookkeepers,
                adhoc_payroll_experts:rows[0].adhoc_payroll_experts,
                adhoc_tax_experts:rows[0].adhoc_tax_experts,
                adhoc_admin_staff:rows[0].adhoc_admin_staff
                };
            }


            let customised_pricing = {}
            if (rows[0].customised_pricing == "1") {
            customised_pricing = rows.map(row => ({
                minimum_number_of_jobs : row.minimum_number_of_jobs,
                job_type_id : row.job_type_id,
                cost_per_job : row.cost_per_job
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
    getSingleCustomer

};