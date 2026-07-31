const pool = require('../config/database');
const deleteUploadFile = require('../../app/middlewares/deleteUploadFile');
const { SatffLogUpdateOperation, generateNextUniqueCode, LineManageStaffIdHelperFunction, QueryRoleHelperFunction, buildAssignedJobsTempTable } = require('../../app/utils/helper');



const createCustomer = async (customer) => {

    // Customer Code(cust+CustName+UniqueNo)
    const { customer_id } = customer;

    if (customer_id == undefined || customer_id == null || customer_id == "") {

        let data = {
            table: 'customers',
            field: 'customer_code'
        }
        const customer_code = await generateNextUniqueCode(data);

        if (customer.CustomerType == "1") {
            const { CustomerType, staff_id, account_manager_id, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, First_Name, Last_Name, Phone, Email, Residential_Address, notes } = customer;

            const Trading_Name = customer.Trading_Name;

            const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ?`;

            const [check] = await pool.execute(checkQuery, [Trading_Name]);
            if (check.length > 0) {
                return { status: false, message: 'Customer Trading Name Already Exists.' };
            }


            const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process,notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
    `;

            try {
                const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, notes]);
                const customer_id = result.insertId;
                const currentDate = new Date();
                await SatffLogUpdateOperation(
                    {
                        staff_id: customer.StaffUserId,
                        ip: customer.ip,
                        date: currentDate.toISOString().split('T')[0],
                        module_name: 'customer',
                        log_message: `created customer profile. customer code :`,
                        permission_type: 'created',
                        module_id: customer_id,
                    }
                );


                const query2 = `
        INSERT INTO customer_contact_details (customer_id,first_name,last_name,phone_code,phone,email,residential_address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
                let phone_code = customer.phone_code == undefined ? "" : customer.phone_code

                const [result2] = await pool.execute(query2, [customer_id, First_Name, Last_Name, phone_code, Phone, Email, Residential_Address]);
                return { status: true, message: 'customer add successfully.', data: customer_id };
            } catch (err) {
                console.error('Error inserting data:', err);
                throw err;
            }
        }
        else if (customer.CustomerType == "2") {

            const { CustomerType, staff_id, account_manager_id, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in, contactDetails, notes } = customer;

            // const Trading_Name = customer.Trading_Name + '_' + customer_code;
            const Trading_Name = customer.Trading_Name;

            const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ?`;

            const [check] = await pool.execute(checkQuery, [Trading_Name]);
            if (check.length > 0) {
                return { status: false, message: 'Customer Trading Name Already Exists.' };
            }


            const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process,notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

            try {
                const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, notes]);
                const customer_id = result.insertId;
                const currentDate = new Date();
                await SatffLogUpdateOperation(
                    {
                        staff_id: customer.StaffUserId,
                        ip: customer.ip,
                        date: currentDate.toISOString().split('T')[0],
                        module_name: 'customer',
                        log_message: `created customer profile. customer code :`,
                        permission_type: 'created',
                        module_id: customer_id,
                    }
                );


                const query2 = `
        INSERT INTO customer_company_information (customer_id,company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
                const [result2] = await pool.execute(query2, [customer_id, company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in]);


                const query3 = `
        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone_code,phone,email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

                for (const detail of contactDetails) {
                    let role = detail.customer_contact_person_role_id == '' ? 0 : detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let phone_code = detail.phone_code == undefined ? "" : detail.phone_code;
                    let phone = detail.phone;
                    let email = detail.email;
                    const [result3] = await pool.execute(query3, [customer_id, role, first_name, last_name, phone_code, phone, email]);

                }

                return { status: true, message: 'customer add successfully.', data: customer_id };

            } catch (err) {
                console.log('Error inserting data:', err);
                throw err;
            }
        }
        else if (customer.CustomerType == "3") {


            const { CustomerType, staff_id, account_manager_id, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, contactDetails, notes } = customer;

            const Trading_Name = customer.Trading_Name;

            const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ?`;

            const [check] = await pool.execute(checkQuery, [Trading_Name]);
            if (check.length > 0) {
                return { status: false, message: 'Customer Trading Name Already Exists.' };
            }



            const query = `
    INSERT INTO customers (customer_type,staff_id,account_manager_id,trading_name,customer_code,trading_address,vat_registered,vat_number,website,form_process,notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

            try {
                const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, customer_code, Trading_Address, VAT_Registered, VAT_Number, Website, PageStatus, notes]);
                const customer_id = result.insertId;
                const currentDate = new Date();
                await SatffLogUpdateOperation(
                    {
                        staff_id: customer.StaffUserId,
                        ip: customer.ip,
                        date: currentDate.toISOString().split('T')[0],
                        module_name: 'customer',
                        log_message: `created customer profile. customer code :`,
                        permission_type: 'created',
                        module_id: customer_id,
                    }
                );



                const query2 = `
        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone_code,phone,email,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

                for (const detail of contactDetails) {

                    let role = detail.customer_contact_person_role_id == '' ? 0 : detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let phone_code = detail.phone_code == undefined ? "" : detail.phone_code;
                    let phone = detail.phone;
                    let email = detail.email;
                    let authorised_signatory_status = detail.authorised_signatory_status == true ? "1" : "0";


                    const [result3] = await pool.execute(query2, [customer_id, role, first_name, last_name, phone_code, phone, email, authorised_signatory_status]);

                }


                return { status: true, message: 'customer add successfully.', data: customer_id };

            } catch (err) {
                console.error('Error inserting data:', err);
                throw err;
            }
        }
    }

    else {

        const { CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, contactDetails } = customer;

        const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ? AND id != ?`;
        const [check] = await pool.execute(checkQuery, [Trading_Name, customer_id]);

        if (check.length > 0) {
            return { status: false, message: 'Customers Trading Name Already Exists.' };
        }

        const query = `
    UPDATE customers
    SET customer_type = ?, staff_id = ?, account_manager_id = ?, trading_name = ?, trading_address = ?, vat_registered = ?, vat_number = ?, website = ?
    WHERE id = ?
    `;

        const [result] = await pool.execute(query, [CustomerType, staff_id, account_manager_id, Trading_Name, Trading_Address, VAT_Registered, VAT_Number, Website, customer_id]);

        //Solo Traders Details
        if (CustomerType == "1") {
            const { First_Name, Last_Name, Phone, Email, Residential_Address, contact_id } = customer;

            const query2 = `
    UPDATE customer_contact_details
    SET first_name = ?, last_name = ?, phone = ?,phone_code = ?, email = ?, residential_address = ?
    WHERE customer_id = ? AND id = ?
     `;

            let phone_code = customer.phone_code == undefined ? "" : customer.phone_code
            try {


                const [result2] = await pool.execute(query2, [First_Name, Last_Name, Phone, phone_code, Email, Residential_Address, customer_id, contact_id]);
                return { status: true, message: 'Customer updated successfully.', data: customer_id };
            } catch (err) {
                console.error('Error inserting data:', err);
                return { status: false, message: 'Update Error Customer Type 1' };
            }


        }


        // Company Details
        else if (CustomerType == "2") {
            const { company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in } = customer;
            try {
                // Update customer_company_information
                const query2 = `
                UPDATE customer_company_information
                SET company_name = ?, entity_type = ?, company_status = ?, company_number = ?, registered_office_address = ?, incorporation_date = ?, incorporation_in = ?
                WHERE customer_id = ?
            `;

                const [result2] = await pool.execute(query2, [company_name, entity_type, company_status, company_number, Registered_Office_Addres, Incorporation_Date, Incorporation_in, customer_id]);




                const [existIdResult] = await pool.execute('SELECT id FROM customer_contact_details WHERE customer_id = ?', [customer_id]);
                const idArray = await existIdResult.map(item => item.id);
                let arrayInterId = []



                // Update customer_contact_details
                const query3 = `
                UPDATE customer_contact_details
                SET contact_person_role_id = ?, first_name = ?, last_name = ?, phone_code = ?, phone = ?, email = ? 
                WHERE customer_id = ? AND id = ?
            `;
                for (const detail of contactDetails) {
                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id == '' ? 0 : detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone_code = detail.phone_code == undefined ? "" : detail.phone_code;
                    let phone = detail.phone;

                    if (contact_id == "" || contact_id == undefined || contact_id == null) {


                        const query4 = `
                    INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone_code,phone,email)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    `;
                        const [result3] = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone_code, phone, email]);

                    }
                    else {

                        arrayInterId.push(contact_id)
                        const [result3] = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone_code, phone, email, customer_id, contact_id]);
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
                console.error('Error inserting data:', err);

                return { status: false, message: 'Update Error Customer Type 2' };
            }


        }

        // Partnership Details
        else if (CustomerType == "3") {

            try {
                const [existIdResult] = await pool.execute('SELECT id FROM customer_contact_details WHERE customer_id = ?', [customer_id]);
                const idArray = await existIdResult.map(item => item.id);
                let arrayInterId = []


                const query3 = `
            UPDATE customer_contact_details
            SET contact_person_role_id = ?, first_name = ?, last_name = ?,phone_code = ? ,phone = ?, email = ? ,authorised_signatory_status = ?
            WHERE customer_id = ? AND id = ?
           `;

                for (const detail of contactDetails) {

                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone_code = detail.phone_code == undefined ? "" : detail.phone_code;
                    let phone = detail.phone;

                    let authorised_signatory_status = detail.authorised_signatory_status;


                    if (contact_id == "" || contact_id == undefined || contact_id == null) {
                        const query4 = `
                    INSERT INTO customer_contact_details (customer_id, contact_person_role_id, first_name, last_name, phone_code,phone, email, authorised_signatory_status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;


                        const [result3] = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone_code, phone, email, authorised_signatory_status]);
                    } else {

                        arrayInterId.push(contact_id)
                        const [result3] = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone_code, phone, email, authorised_signatory_status, customer_id, contact_id]);
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
                console.log('Error inserting data:', err);
                return { status: false, message: 'Update Error Customer Type 3' };
            }

        }

    }
};

// const getCustomer = async (customer) => {

//     const { staff_id } = customer;

//     const page = parseInt(customer.page) || 1;
//     const limit = parseInt(customer.limit) || 10;
//     const offset = (page - 1) * limit;

//     const search = customer.search ? customer.search.trim() : "";
//     const pattern = search ? `%${search}%` : `%`;

//     const LineManageStaffId = await LineManageStaffIdHelperFunction(staff_id);
//     const rows = await QueryRoleHelperFunction(staff_id);

//     const RoleAccessQuery = `
//         SELECT * FROM role_permissions 
//         WHERE role_id = ? AND permission_id = ?
//     `;

//     const [RoleAccess] = await pool.execute(RoleAccessQuery, [rows[0].role_id, 33]);

//     // SUPERADMIN OR ROLE ACCESS
//     if (rows.length > 0 && (rows[0].role_name === "SUPERADMIN" || RoleAccess.length > 0)) {

//         try {

//             const countQuery = `
//             SELECT COUNT(DISTINCT customers.id) AS total
//             FROM customers
//             LEFT JOIN staffs ON customers.staff_id = staffs.id
//             LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
//             WHERE 
//                 customers.trading_name LIKE ? OR
//                 staff2.first_name LIKE ? OR
//                 staff2.last_name LIKE ? OR
//                 CONCAT(staffs.first_name,' ',staffs.last_name) LIKE ? OR
//                 CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) LIKE ?
//             `;

//             const [[{ total }]] = await pool.execute(countQuery, [
//                 pattern,
//                 pattern,
//                 pattern,
//                 pattern,
//                 pattern
//             ]);

//             const query = `
//             SELECT  
//                 customers.id,
//                 customers.customer_type,
//                 customers.staff_id,
//                 CONCAT(staffs.first_name,' ',staffs.last_name) AS customer_created_by,
//                 customers.account_manager_id,
//                 customers.trading_name,
//                 customers.trading_address,
//                 customers.vat_registered,
//                 customers.vat_number,
//                 customers.website,
//                 customers.form_process,
//                 DATE_FORMAT(customers.created_at,'%d/%m/%Y') AS created_at,
//                 DATE_FORMAT(customers.updated_at,'%d/%m/%Y') AS updated_at,
//                 customers.status,
//                 staff2.first_name AS account_manager_firstname,
//                 staff2.last_name AS account_manager_lastname,
//                 staff2.employee_number AS account_manager_employee_number,
//                 CONCAT(
//                     'cust_',
//                     SUBSTRING(customers.trading_name,1,3),'_',
//                     SUBSTRING(customers.customer_code,1,15)
//                 ) AS customer_code,
//                 CASE
//                     WHEN EXISTS (
//                         SELECT 1 FROM clients WHERE clients.customer_id = customers.id
//                     ) THEN 1 ELSE 0
//                 END AS is_client
//             FROM customers
//             LEFT JOIN staffs ON customers.staff_id = staffs.id
//             LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
//             LEFT JOIN clients ON clients.customer_id = customers.id
//             WHERE
//                 customers.trading_name LIKE ? OR
//                 staff2.first_name LIKE ? OR
//                 staff2.last_name LIKE ? OR
//                 CONCAT(staffs.first_name,' ',staffs.last_name) LIKE ? OR
//                 CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) LIKE ?
//             GROUP BY customers.id
//             ORDER BY customers.id DESC
//             LIMIT ? OFFSET ?
//             `;

//             const [result] = await pool.execute(query, [
//                 pattern,
//                 pattern,
//                 pattern,
//                 pattern,
//                 pattern,
//                 limit,
//                 offset
//             ]);

//             return {
//                 status: true,
//                 message: "Success",
//                 data: {
//                     data: result,
//                     pagination: {
//                         totalItems: total,
//                         totalPages: Math.ceil(total / limit),
//                         currentPage: page,
//                         limit
//                     }
//                 }
//             };

//         } catch (error) {

//             console.error("Error fetching customers:", error);

//             return {
//                 status: false,
//                 message: "Error fetching customers",
//                 error: error.message
//             };

//         }

//     }

//     // NON SUPERADMIN

//     try {

//         let countQuery = `
//         SELECT COUNT(DISTINCT customers.id) AS total
//         FROM customers
//         JOIN staffs AS staff1 ON customers.staff_id = staff1.id
//         JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
//         LEFT JOIN clients ON clients.customer_id = customers.id
//         LEFT JOIN assigned_jobs_staff_view 
//             ON assigned_jobs_staff_view.customer_id = customers.id
//         LEFT JOIN customer_company_information 
//             ON customers.id = customer_company_information.customer_id
//         WHERE
//             (
//                 customers.staff_id = ?
//                 OR assigned_jobs_staff_view.staff_id = ?
//                 OR customers.staff_id IN (${LineManageStaffId})
//                 OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
//             )
//         `;

//         let query = `
//         SELECT
//             customers.id,
//             customers.customer_type,
//             customers.staff_id,
//             customers.account_manager_id,
//             customers.trading_name,
//             customers.trading_address,
//             customers.vat_registered,
//             customers.vat_number,
//             customers.website,
//             customers.form_process,
//             DATE_FORMAT(customers.created_at,'%d/%m/%Y') AS created_at,
//             DATE_FORMAT(customers.updated_at,'%d/%m/%Y') AS updated_at,
//             customers.status,
//             staff1.first_name AS staff_firstname,
//             staff1.last_name AS staff_lastname,
//             CONCAT(staff1.first_name,' ',staff1.last_name) AS customer_created_by,
//             staff2.first_name AS account_manager_firstname,
//             staff2.last_name AS account_manager_lastname,
//             customer_company_information.company_name,
//             customer_company_information.company_number,
//             CONCAT(
//                 'cust_',
//                 SUBSTRING(customers.trading_name,1,3),'_',
//                 SUBSTRING(customers.customer_code,1,15)
//             ) AS customer_code,
//             CASE
//                 WHEN clients.id IS NOT NULL THEN 1
//                 ELSE 0
//             END AS is_client
//         FROM customers
//         JOIN staffs AS staff1 ON customers.staff_id = staff1.id
//         JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
//         LEFT JOIN clients ON clients.customer_id = customers.id
//         LEFT JOIN assigned_jobs_staff_view 
//             ON assigned_jobs_staff_view.customer_id = customers.id
//         LEFT JOIN customer_company_information 
//             ON customers.id = customer_company_information.customer_id
//         WHERE
//             (
//                 customers.staff_id = ?
//                 OR assigned_jobs_staff_view.staff_id = ?
//                 OR customers.staff_id IN (${LineManageStaffId})
//                 OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
//             )
//         `;

//         const params = [staff_id, staff_id];

//         if (search) {

//             const searchCondition = `
//             AND (
//                 customers.trading_name LIKE ?
//                 OR staff2.first_name LIKE ?
//                 OR staff2.last_name LIKE ?
//                 OR CONCAT(staff1.first_name,' ',staff1.last_name) LIKE ?
//                 OR CONCAT('cust_',SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) LIKE ?
//             )
//             `;

//             countQuery += searchCondition;
//             query += searchCondition;

//             params.push(pattern, pattern, pattern, pattern, pattern);

//         }

//         const [[{ total }]] = await pool.execute(countQuery, params);

//         query += `
//         GROUP BY customers.id
//         ORDER BY customers.id DESC
//         LIMIT ? OFFSET ?
//         `;

//         params.push(limit, offset);

//         const [result] = await pool.execute(query, params);

//         return {
//             status: true,
//             message: "Success",
//             data: {
//                 data: result,
//                 pagination: {
//                     totalItems: total,
//                     totalPages: Math.ceil(total / limit),
//                     currentPage: page,
//                     limit
//                 }
//             }
//         };

//     } catch (error) {

//         console.error("Error selecting data:", error);

//         return {
//             status: false,
//             message: "Error selecting data",
//             data: error
//         };

//     }

// };

const getCustomer = async (customer) => {
    const { staff_id } = customer;


    // console time milesecond




    const page = parseInt(customer.page) || 1;
    const limit = parseInt(customer.limit) || 10;
    const offset = (page - 1) * limit;

    const search = customer.search ? customer.search.trim() : "";
    const pattern = `%${search}%`;

    let LineManageStaffId = await LineManageStaffIdHelperFunction(staff_id);
    const rows = await QueryRoleHelperFunction(staff_id);

    const RoleAccessQuery = `
    SELECT * FROM role_permissions 
    WHERE role_id = ? AND permission_id = ?
  `;

    const [RoleAccess] = await pool.execute(RoleAccessQuery, [
        rows[0].role_id,
        33,
    ]);

    // ===============================
    // ✅ SUPERADMIN (UNCHANGED - already fast)
    // ===============================
    if (
        rows.length > 0 &&
        (rows[0].role_name === "SUPERADMIN" || RoleAccess.length > 0)
    ) {
        try {
            const countQuery = `
        SELECT COUNT(*) AS total
        FROM customers
        LEFT JOIN staffs ON customers.staff_id = staffs.id
        LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
        WHERE 
          customers.trading_name LIKE ?
          OR staff2.first_name LIKE ?
          OR staff2.last_name LIKE ?
          OR CONCAT(staffs.first_name,' ',staffs.last_name) LIKE ?
          OR CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) LIKE ?
      `;

            const [[{ total }]] = await pool.execute(countQuery, [
                pattern,
                pattern,
                pattern,
                pattern,
                pattern,
            ]);

            const query = `
        SELECT  
          customers.id,
          customers.customer_type,
          customers.staff_id,
          CONCAT(staffs.first_name,' ',staffs.last_name) AS customer_created_by,
          customers.account_manager_id,
          customers.trading_name,
          customers.trading_address,
          customers.vat_registered,
          customers.vat_number,
          customers.website,
          customers.form_process,
          DATE_FORMAT(customers.created_at,'%d/%m/%Y') AS created_at,
          DATE_FORMAT(customers.updated_at,'%d/%m/%Y') AS updated_at,
          customers.status,
          staff2.first_name AS account_manager_firstname,
          staff2.last_name AS account_manager_lastname,
          staff2.employee_number,
          CONCAT(
            'cust_',
            SUBSTRING(customers.trading_name,1,3),'_',
            SUBSTRING(customers.customer_code,1,15)
          ) AS customer_code,
          EXISTS (
            SELECT 1 FROM clients WHERE clients.customer_id = customers.id
          ) AS is_client
        FROM customers
        LEFT JOIN staffs ON customers.staff_id = staffs.id
        LEFT JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
        WHERE 
          customers.trading_name LIKE ?
          OR staff2.first_name LIKE ?
          OR staff2.last_name LIKE ?
          OR CONCAT(staffs.first_name,' ',staffs.last_name) LIKE ?
          OR CONCAT('cust_', SUBSTRING(customers.trading_name,1,3),'_',SUBSTRING(customers.customer_code,1,15)) LIKE ?
           GROUP BY customers.id
        ORDER BY customers.id DESC
       
        LIMIT ? OFFSET ?
      `;

            const [result] = await pool.execute(query, [
                pattern,
                pattern,
                pattern,
                pattern,
                pattern,
                limit,
                offset,
            ]);

            return {
                status: true,
                message: "Success",
                data: {
                    data: result,
                    pagination: {
                        totalItems: total,
                        totalPages: Math.ceil(total / limit),
                        currentPage: page,
                        limit,
                    },
                },
            };
        } catch (error) {
            return { status: false, message: error.message };
        }
    }

    // ===============================
    // 🚀 NON SUPERADMIN (OPTIMIZED)
    // ===============================

    //   try {
    //     // 🔥 UNION BASE FILTER
    //     const unionFilter = `
    //       SELECT id FROM customers WHERE staff_id = ?

    //       UNION

    //       SELECT c.id
    //       FROM customers c
    //       JOIN assigned_jobs_staff_view ajsv 
    //         ON ajsv.customer_id = c.id
    //       WHERE ajsv.staff_id = ?

    //       UNION

    //       SELECT id FROM customers 
    //       WHERE staff_id IN (${LineManageStaffId})

    //       UNION

    //       SELECT c.id
    //       FROM customers c
    //       JOIN assigned_jobs_staff_view ajsv 
    //         ON ajsv.customer_id = c.id
    //       WHERE ajsv.staff_id IN (${LineManageStaffId})
    //     `;

    //     // =====================
    //     // ✅ COUNT QUERY
    //     // =====================
    //     let countQuery = `
    //       SELECT COUNT(*) as total FROM (
    //         ${unionFilter}
    //       ) AS filtered_ids
    //     `;

    //     let countParams = [staff_id, staff_id];

    //     if (search) {
    //       countQuery = `
    //         SELECT COUNT(*) as total
    //         FROM (
    //           ${unionFilter}
    //         ) ids
    //         JOIN customers c ON c.id = ids.id
    //         JOIN staffs s1 ON c.staff_id = s1.id
    //         JOIN staffs s2 ON c.account_manager_id = s2.id
    //         WHERE
    //           c.trading_name LIKE ?
    //           OR s2.first_name LIKE ?
    //           OR s2.last_name LIKE ?
    //           OR CONCAT(s1.first_name,' ',s1.last_name) LIKE ?
    //           OR CONCAT('cust_',SUBSTRING(c.trading_name,1,3),'_',SUBSTRING(c.customer_code,1,15)) LIKE ?
    //       `;

    //       countParams.push(
    //         pattern,
    //         pattern,
    //         pattern,
    //         pattern,
    //         pattern
    //       );
    //     }

    //     const [[{ total }]] = await pool.execute(countQuery, countParams);

    //     // =====================
    //     // ✅ MAIN DATA QUERY
    //     // =====================
    //     let query = `
    //       SELECT
    //         c.id,
    //         c.customer_type,
    //         c.staff_id,
    //         c.account_manager_id,
    //         c.trading_name,
    //         c.trading_address,
    //         c.vat_registered,
    //         c.vat_number,
    //         c.website,
    //         c.form_process,
    //         DATE_FORMAT(c.created_at,'%d/%m/%Y') AS created_at,
    //         DATE_FORMAT(c.updated_at,'%d/%m/%Y') AS updated_at,
    //         c.status,

    //         s1.first_name AS staff_firstname,
    //         s1.last_name AS staff_lastname,
    //         CONCAT(s1.first_name,' ',s1.last_name) AS customer_created_by,

    //         s2.first_name AS account_manager_firstname,
    //         s2.last_name AS account_manager_lastname,

    //         cci.company_name,
    //         cci.company_number,

    //         CONCAT(
    //           'cust_',
    //           SUBSTRING(c.trading_name,1,3),'_',
    //           SUBSTRING(c.customer_code,1,15)
    //         ) AS customer_code,

    //         CASE WHEN cl.id IS NOT NULL THEN 1 ELSE 0 END AS is_client

    //       FROM (
    //         ${unionFilter}
    //       ) ids

    //       JOIN customers c ON c.id = ids.id
    //       JOIN staffs s1 ON c.staff_id = s1.id
    //       JOIN staffs s2 ON c.account_manager_id = s2.id

    //       LEFT JOIN clients cl ON cl.customer_id = c.id
    //       LEFT JOIN customer_company_information cci 
    //         ON c.id = cci.customer_id
    //     `;

    //     let params = [staff_id, staff_id];

    //     if (search) {
    //       query += `
    //         WHERE
    //           c.trading_name LIKE ?
    //           OR s2.first_name LIKE ?
    //           OR s2.last_name LIKE ?
    //           OR CONCAT(s1.first_name,' ',s1.last_name) LIKE ?
    //           OR CONCAT('cust_',SUBSTRING(c.trading_name,1,3),'_',SUBSTRING(c.customer_code,1,15)) LIKE ?
    //       `;

    //       params.push(
    //         pattern,
    //         pattern,
    //         pattern,
    //         pattern,
    //         pattern
    //       );
    //     }

    //     query += `
    //       GROUP BY c.id
    //       ORDER BY c.id DESC
    //       LIMIT ? OFFSET ?
    //     `;

    //     params.push(limit, offset);

    //     const [result] = await pool.execute(query, params);

    //     return {
    //       status: true,
    //       message: "Success",
    //       data: {
    //         data: result,
    //         pagination: {
    //           totalItems: total,
    //           totalPages: Math.ceil(total / limit),
    //           currentPage: page,
    //           limit,
    //         },
    //       },
    //     };
    //   } catch (error) {
    //     console.error(error);
    //     return {
    //       status: false,
    //       message: "Error fetching data",
    //       error: error.message,
    //     };
    //   }

    try {


        ////////////////////////////////
        LineManageStaffId = [
            ...new Set(LineManageStaffId),
        ];
        const connection = await pool.getConnection();
        await buildAssignedJobsTempTable(connection, LineManageStaffId);

        // 🔥 UNION BASE FILTER


        const unionFilter = `
  SELECT id FROM customers WHERE staff_id = ?

  UNION

  SELECT id FROM customers 
  WHERE staff_id IN (${LineManageStaffId})

  UNION

  SELECT c.id
  FROM customers c
  WHERE c.id IN (
    SELECT customer_id 
    FROM temp_assigned_jobs_staff 
    WHERE staff_id = ? 
       OR staff_id IN (${LineManageStaffId})
  )
`;

        // =====================
        // ✅ COUNT QUERY
        // =====================
        let countQuery = `
      SELECT COUNT(*) as total FROM (
        ${unionFilter}
      ) AS filtered_ids
    `;

        let countParams = [staff_id, staff_id];

        if (search) {
            countQuery = `
        SELECT COUNT(*) as total
        FROM (
          ${unionFilter}
        ) ids
        JOIN customers c ON c.id = ids.id
        JOIN staffs s1 ON c.staff_id = s1.id
        JOIN staffs s2 ON c.account_manager_id = s2.id
        WHERE
          c.trading_name LIKE ?
          OR s2.first_name LIKE ?
          OR s2.last_name LIKE ?
          OR CONCAT(s1.first_name,' ',s1.last_name) LIKE ?
          OR CONCAT('cust_',SUBSTRING(c.trading_name,1,3),'_',SUBSTRING(c.customer_code,1,15)) LIKE ?
      `;

            countParams.push(
                pattern,
                pattern,
                pattern,
                pattern,
                pattern
            );
        }

        const [[{ total }]] = await connection.execute(countQuery, countParams);

        // =====================
        // ✅ MAIN DATA QUERY
        // =====================
        let query = `
      SELECT
        c.id,
        c.customer_type,
        c.staff_id,
        c.account_manager_id,
        c.trading_name,
        c.trading_address,
        c.vat_registered,
        c.vat_number,
        c.website,
        c.form_process,
        DATE_FORMAT(c.created_at,'%d/%m/%Y') AS created_at,
        DATE_FORMAT(c.updated_at,'%d/%m/%Y') AS updated_at,
        c.status,

        s1.first_name AS staff_firstname,
        s1.last_name AS staff_lastname,
        CONCAT(s1.first_name,' ',s1.last_name) AS customer_created_by,

        s2.first_name AS account_manager_firstname,
        s2.last_name AS account_manager_lastname,
        s2.employee_number,

        cci.company_name,
        cci.company_number,

        CONCAT(
          'cust_',
          SUBSTRING(c.trading_name,1,3),'_',
          SUBSTRING(c.customer_code,1,15)
        ) AS customer_code,

        CASE WHEN cl.id IS NOT NULL THEN 1 ELSE 0 END AS is_client

      FROM (
        ${unionFilter}
      ) ids

      JOIN customers c ON c.id = ids.id
      JOIN staffs s1 ON c.staff_id = s1.id
      JOIN staffs s2 ON c.account_manager_id = s2.id

      LEFT JOIN clients cl ON cl.customer_id = c.id
      LEFT JOIN customer_company_information cci 
        ON c.id = cci.customer_id
    `;

        let params = [staff_id, staff_id];

        if (search) {
            query += `
        WHERE
          c.trading_name LIKE ?
          OR s2.first_name LIKE ?
          OR s2.last_name LIKE ?
          OR CONCAT(s1.first_name,' ',s1.last_name) LIKE ?
          OR CONCAT('cust_',SUBSTRING(c.trading_name,1,3),'_',SUBSTRING(c.customer_code,1,15)) LIKE ?
      `;

            params.push(
                pattern,
                pattern,
                pattern,
                pattern,
                pattern
            );
        }

        query += `
     GROUP BY c.id
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `;

        params.push(limit, offset);

        const [result] = await connection.execute(query, params);

        

        return {
            status: true, 
            message: "Success",
            data: {
                data: result,
                pagination: {
                    totalItems: total,
                    totalPages: Math.ceil(total / limit),
                    currentPage: page,
                    limit,
                },
            },
        };
    } catch (error) {
        console.error(error);
        return {
            status: false,
            message: "Error fetching data",
            error: error.message,
        };
    }

}

const getCustomer_dropdown = async (customer) => {
    const { StaffUserId } = customer;
    // Line Manager
    let LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        const query = `
    SELECT  
    customers.id AS id,
    customers.status AS status,
    customers.form_process AS form_process,
    customers.trading_name AS trading_name,
    CONCAT(
    'cust_', 
    SUBSTRING(customers.trading_name, 1, 3), '_',
    SUBSTRING(customers.customer_code, 1, 15)
    ) AS customer_code
FROM 
    customers 
ORDER BY 
trading_name ASC;`;

        const [result] = await pool.execute(query);

        return { status: true, message: 'Success..', data: result };
    }




    // other Role Data

    LineManageStaffId = [
        ...new Set(LineManageStaffId),
    ];
    const connection = await pool.getConnection();
    await buildAssignedJobsTempTable(connection, LineManageStaffId);



    let query = `
    SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.created_at AS created_at,
        customers.updated_at AS updated_at,
        customers.status AS status,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code,
        CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
        END AS is_client
        FROM 
            customers
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN
            temp_assigned_jobs_staff ON temp_assigned_jobs_staff.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE
             customers.staff_id IN (${LineManageStaffId}) OR temp_assigned_jobs_staff.staff_id IN (${LineManageStaffId})
           GROUP BY customers.id
           ORDER BY customers.trading_name ASC

         `;
    try {
        const [result] = await connection.execute(query);
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
    }

}
const getCustomer_dropdown_filter = async (customer) => {
    const { StaffUserId, pagination, filters, job_id, client_id, task_id } = customer;
     console.log("job_id", job_id);
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 20;
    const search = pagination.search || "";

    const offset = (page - 1) * limit;
    const filterStaffId = filters?.staff_id;

    // Line Manager
    let LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId);
    
    if (filterStaffId) {
        LineManageStaffId = [filterStaffId];
    }

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        if (!filterStaffId) {
   
       try {
        // let query = `
        //     SELECT
        //         customers.id AS id,
        //         customers.status AS status,
        //         customers.form_process AS form_process,
        //         customers.trading_name AS trading_name,
        //         CONCAT(
        //             'cust_',
        //             SUBSTRING(customers.trading_name, 1, 3), '_',
        //             SUBSTRING(customers.customer_code, 1, 15)
        //         ) AS customer_code
        //     FROM customers
        //     LEFT JOIN clients ON clients.customer_id = customers.id
        //     LEFT JOIN jobs ON jobs.customer_id = customers.id
        //     WHERE customers.trading_name LIKE '%${search}%'
        //     `;

        //     if (Array.isArray(job_id) && job_id.length > 0 && Array.isArray(client_id) && client_id.length > 0) {
        //         query += `
        //         AND (
        //             jobs.id IN (${job_id})
        //             OR clients.id IN (${client_id})
        //         )
        //         `;
        //     } else if (Array.isArray(job_id) && job_id.length > 0) {
        //         query += `
        //         AND jobs.id IN (${job_id})
        //         `;
        //     } else if (Array.isArray(client_id) && client_id.length > 0) {
        //         query += `
        //         AND clients.id IN (${client_id})
        //         `;
        //     }

        //     query += `
        //     GROUP BY customers.id
        //     ORDER BY customers.trading_name ASC
        //     LIMIT ? OFFSET ?
        //     `;

        // const [result] = await pool.execute(query, [limit, offset]);

        let query = `
            SELECT
                c.id,
                c.status,
                c.form_process,
                c.trading_name,
                CONCAT(
                    'cust_',
                    SUBSTRING(c.trading_name, 1, 3),
                    '_',
                    SUBSTRING(c.customer_code, 1, 15)
                ) AS customer_code
            FROM customers c
            WHERE c.trading_name LIKE ?
        `;

        const params = [`%${search}%`];

        if (Array.isArray(job_id) && job_id.length > 0 &&
            Array.isArray(client_id) && client_id.length > 0) {

            query += `
                AND (
                    EXISTS (
                        SELECT 1
                        FROM jobs j
                        WHERE j.customer_id = c.id
                        AND j.id IN (${job_id.map(() => '?').join(',')})
                    )
                    OR
                    EXISTS (
                        SELECT 1
                        FROM clients cl
                        WHERE cl.customer_id = c.id
                        AND cl.id IN (${client_id.map(() => '?').join(',')})
                    )
                )
            `;

            params.push(...job_id);
            params.push(...client_id);

        } else if (Array.isArray(job_id) && job_id.length > 0) {

            query += `
                AND EXISTS (
                    SELECT 1
                    FROM jobs j
                    WHERE j.customer_id = c.id
                    AND j.id IN (${job_id.map(() => '?').join(',')})
                )
            `;

            params.push(...job_id);

        } else if (Array.isArray(client_id) && client_id.length > 0) {

            query += `
                AND EXISTS (
                    SELECT 1
                    FROM clients cl
                    WHERE cl.customer_id = c.id
                    AND cl.id IN (${client_id.map(() => '?').join(',')})
                )
            `;

            params.push(...client_id);
        }

        if (Array.isArray(task_id) && task_id.length > 0) {
            query += `
                AND EXISTS (
                    SELECT 1
                    FROM timesheet ts
                    WHERE ts.customer_id = c.id
                    AND ts.task_id IN (${task_id.map(() => '?').join(',')})
                )
            `;
            params.push(...task_id);
        }

        query += `
            ORDER BY c.trading_name ASC
            LIMIT ? OFFSET ?
        `;

        params.push(limit, offset);
        const [result] = await pool.execute(query, params);
        return { status: true, message: 'Success..', data: result };
       } catch (err) {
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
        }


      }
    }

    // other Role Data OR Admin/Superadmin with filterStaffId
       const connection = await pool.getConnection();
    try {
        await buildAssignedJobsTempTable(connection, LineManageStaffId);

        let query = `
        SELECT  
            customers.id AS id,
            customers.customer_type AS customer_type,
            customers.staff_id AS staff_id,
            customers.account_manager_id AS account_manager_id,
            customers.trading_name AS trading_name,
            customers.trading_address AS trading_address,
            customers.vat_registered AS vat_registered,
            customers.vat_number AS vat_number,
            customers.website AS website,
            customers.form_process AS form_process,
            customers.created_at AS created_at,
            customers.updated_at AS updated_at,
            customers.status AS status,
            staff2.first_name AS account_manager_firstname, 
            staff2.last_name AS account_manager_lastname,
            customer_company_information.company_name AS company_name,
            customer_company_information.company_number AS company_number,
            CONCAT(
                'cust_', 
                SUBSTRING(customers.trading_name, 1, 3), '_',
                SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code,
            CASE
            WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
            THEN 1 ELSE 0
            END AS is_client
            FROM 
                customers
            LEFT JOIN 
                staffs AS staff2 ON customers.account_manager_id = staff2.id
            LEFT JOIN
                temp_assigned_jobs_staff ON temp_assigned_jobs_staff.customer_id = customers.id
            LEFT JOIN
                customer_company_information ON customers.id = customer_company_information.customer_id
            WHERE
              (customers.staff_id IN (${LineManageStaffId}) OR customers.account_manager_id IN (${LineManageStaffId}) OR temp_assigned_jobs_staff.staff_id IN (${LineManageStaffId}))
              AND customers.trading_name LIKE '%${search}%'
             `;
        
            if (Array.isArray(job_id) && job_id.length > 0) {
            query += ` AND temp_assigned_jobs_staff.job_id IN (${job_id})`;
            }

            if (Array.isArray(client_id) && client_id.length > 0) {
            query += ` AND EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id AND clients.id IN (${client_id}))`;
            }

            if (Array.isArray(task_id) && task_id.length > 0) {
            query += ` AND EXISTS (SELECT 1 FROM timesheet ts WHERE ts.customer_id = customers.id AND ts.task_id IN (${task_id}))`;
            }

            query += `
            GROUP BY customers.id
            ORDER BY customers.trading_name ASC
            LIMIT ? OFFSET ?
            `;


        const [result] = await connection.execute(query, [limit, offset]);
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        console.error('Error executing query getCustomer_dropdown_filter:', err);
        return { status: false, message: 'Error executing query', data: err };
    } finally {
        connection.release();
    }
}

const get_customers_filter = async (customer) => {
    const { StaffUserId, filters, pagination  } = customer;
    let { job_id, client_id, task_id } = customer;

  //   console.log("job_id", job_id);
   //  console.log("client_id", client_id);

    if (Array.isArray(job_id)) {
        job_id = job_id;
    } else if (!["", null, undefined].includes(job_id)) {
        job_id = [job_id];
    }

    if (Array.isArray(client_id)) {
        client_id = client_id;
    } else if (!["", null, undefined].includes(client_id)) {
        client_id = [client_id];
    }



    if (Array.isArray(task_id)) {
        task_id = task_id;
    } else if (!["", null, undefined].includes(task_id)) {
        task_id = [task_id];
    }

    const rows = await QueryRoleHelperFunction(StaffUserId)

    return await getCustomer_dropdown_filter({ StaffUserId, pagination, filters , job_id, client_id, task_id });
}

async function getAllCustomerByClientIdFilter(client_id) {
    const query = `
            SELECT  
            customers.id AS id,
            customers.status AS status,
            customers.form_process AS form_process,
            customers.trading_name AS trading_name,
            CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code
        FROM
            customers
        JOIN
            clients ON clients.customer_id = customers.id
        WHERE
            clients.id IN (${client_id})
        GROUP BY customers.id    
        ORDER BY 
        trading_name ASC;`;

    const [result] = await pool.execute(query);
    return { status: true, message: 'Success..', data: result };
}

async function getAllCustomerByJobIdFilter(rows, job_id) {
    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        const query = `
            SELECT  
            customers.id AS id,
            customers.status AS status,
            customers.form_process AS form_process,
            customers.trading_name AS trading_name,
            CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code
        FROM
            customers
        JOIN
            jobs ON jobs.customer_id = customers.id
        WHERE
            jobs.id IN (${job_id})
        GROUP BY customers.id    
        ORDER BY 
        trading_name ASC;`;

        const [result] = await pool.execute(query);

        return { status: true, message: 'Success..', data: result };
    }

    // other Role Data
    let query = `
    SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.created_at AS created_at,
        customers.updated_at AS updated_at,
        customers.status AS status,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code,
        CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
        END AS is_client
        FROM 
            customers
        JOIN
            jobs ON jobs.customer_id = customers.id    
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE
           jobs.id IN (${job_id})
           GROUP BY customers.id
           ORDER BY customers.trading_name ASC

         `;
    try {
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
    }
}

async function getAllCustomerByClientIdAndJobIdFilter(rows, client_id, job_id) {
    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        const query = `
            SELECT  
            customers.id AS id,
            customers.status AS status,
            customers.form_process AS form_process,
            customers.trading_name AS trading_name,
            CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code
        FROM
            customers
        JOIN
            jobs ON jobs.customer_id = customers.id
        LEFT JOIN
            clients ON clients.customer_id = customers.id    
        WHERE
            jobs.id IN (${job_id}) OR clients.id IN (${client_id})
        GROUP BY customers.id
        ORDER BY 
        trading_name ASC;`;

        const [result] = await pool.execute(query);

        return { status: true, message: 'Success..', data: result };
    }

    // other Role Data
    let query = `
    SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.created_at AS created_at,
        customers.updated_at AS updated_at,
        customers.status AS status,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code,
        CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
        END AS is_client
        FROM 
            customers
        JOIN
            jobs ON jobs.customer_id = customers.id
        LEFT JOIN
            clients ON clients.customer_id = customers.id        
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE
           jobs.id IN (${job_id}) OR clients.id IN (${client_id})
           GROUP BY customers.id
           ORDER BY customers.trading_name ASC

         `;
    try {
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
    }
}

const getCustomer_dropdown_delete_old_working = async (customer) => {
    // const { StaffUserId ,staff_id } = customer;
    let StaffUserId = customer.staff_id;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        const query = `
    SELECT  
    customers.id AS id,
    customers.status AS status,
    customers.form_process AS form_process,
    customers.trading_name AS trading_name,
    CONCAT(
    'cust_', 
    SUBSTRING(customers.trading_name, 1, 3), '_',
    SUBSTRING(customers.customer_code, 1, 15)
    ) AS customer_code
FROM 
    customers 
ORDER BY 
id DESC;`;

        const [result] = await pool.execute(query);

        return { status: true, message: 'Success..', data: result };
    }

    // other Role Data
    let query = `
    SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.created_at AS created_at,
        customers.updated_at AS updated_at,
        customers.status AS status,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code,
        CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
        END AS is_client
        FROM 
            customers
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN
            assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE
             customers.staff_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
           GROUP BY customers.id
           ORDER BY customers.id DESC

         `;
    try {
        const [result] = await pool.execute(query);
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
    }

}



const getCustomer_dropdown_delete = async (customer) => {
    // const { StaffUserId ,staff_id } = customer;
    let StaffUserId = customer.staff_id;
    // Line Manager
    const LineManageStaffId = await LineManageStaffIdHelperFunction(StaffUserId)

    // Get Role
    const rows = await QueryRoleHelperFunction(StaffUserId)

    const [RoleAccess] = await pool.execute('SELECT * FROM `role_permissions` WHERE role_id = ? AND permission_id = ?', [rows[0].role_id, 33]);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || RoleAccess.length > 0)) {
        const query = `
    SELECT  
    customers.id AS id,
    customers.status AS status,
    customers.form_process AS form_process,
    customers.trading_name AS trading_name,
    CONCAT(
    'cust_', 
    SUBSTRING(customers.trading_name, 1, 3), '_',
    SUBSTRING(customers.customer_code, 1, 15)
    ) AS customer_code
FROM 
    customers 
ORDER BY 
id DESC;`;

        const [result] = await pool.execute(query);

        return { status: true, message: 'Success..', data: result };
    }

    // other Role Data
    let query = `
    SELECT  
        customers.id AS id,
        customers.customer_type AS customer_type,
        customers.staff_id AS staff_id,
        customers.account_manager_id AS account_manager_id,
        customers.trading_name AS trading_name,
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.created_at AS created_at,
        customers.updated_at AS updated_at,
        customers.status AS status,
        staff2.first_name AS account_manager_firstname, 
        staff2.last_name AS account_manager_lastname,
        customer_company_information.company_name AS company_name,
        customer_company_information.company_number AS company_number,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
        ) AS customer_code,
        CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
        END AS is_client
        FROM 
            customers
        JOIN 
            staffs AS staff2 ON customers.account_manager_id = staff2.id
        LEFT JOIN
            temp_assigned_jobs_staff ON temp_assigned_jobs_staff.customer_id = customers.id
        LEFT JOIN
            customer_company_information ON customers.id = customer_company_information.customer_id
        WHERE
             customers.staff_id IN (${LineManageStaffId}) OR temp_assigned_jobs_staff.staff_id IN (${LineManageStaffId})
           GROUP BY customers.id
           ORDER BY customers.id DESC

         `;
    let connection;
    try {
        connection = await pool.getConnection();
        await buildAssignedJobsTempTable(connection, LineManageStaffId);
        const [result] = await connection.execute(query);
        connection.release();
        return { status: true, message: 'Success..', data: result };
    } catch (err) {
        if (connection) connection.release();
        console.error('Error executing query getCustomer_dropdown:', err);
        return { status: false, message: 'Error executing query', data: err };
    }

}



// const getCustomer_dropdown_delete = async (customer) => {
//     // const { StaffUserId ,staff_id } = customer;
//     let StaffUserId = customer.staff_id;
//     // Line Manager
//     const [LineManage] = await pool.execute('SELECT staff_to FROM line_managers WHERE staff_by = ?', [StaffUserId]);
//     let LineManageStaffId = LineManage?.map(item => item.staff_to);

//     if (LineManageStaffId.length == 0) {
//         LineManageStaffId.push(StaffUserId);
//     }

//     const QueryRole = `
//   SELECT
//     staffs.id AS id,
//     staffs.role_id AS role_id,
//     roles.role AS role_name
//   FROM
//     staffs
//   JOIN
//     roles ON roles.id = staffs.role_id
//   WHERE
//     staffs.id = ${StaffUserId}
//   LIMIT 1
//   `
//     const [rows] = await pool.execute(QueryRole);

//     let query = `
//     SELECT  
//         customers.id AS id,
//         customers.customer_type AS customer_type,
//         customers.staff_id AS staff_id,
//         customers.account_manager_id AS account_manager_id,
//         customers.trading_name AS trading_name,
//         customers.trading_address AS trading_address,
//         customers.vat_registered AS vat_registered,
//         customers.vat_number AS vat_number,
//         customers.website AS website,
//         customers.form_process AS form_process,
//         customers.created_at AS created_at,
//         customers.updated_at AS updated_at,
//         customers.status AS status,
//         staff1.first_name AS staff_firstname, 
//         staff1.last_name AS staff_lastname,
//         staff2.first_name AS account_manager_firstname, 
//         staff2.last_name AS account_manager_lastname,
//         customer_company_information.company_name AS company_name,
//         customer_company_information.company_number AS company_number,
//         CONCAT(
//             'cust_', 
//             SUBSTRING(customers.trading_name, 1, 3), '_',
//             SUBSTRING(customers.customer_code, 1, 15)
//         ) AS customer_code,
//         CASE
//             WHEN clients.id IS NOT NULL THEN 1
//             ELSE 0
//         END AS is_client
//         FROM 
//             customers  
//         JOIN 
//             staffs AS staff1 ON customers.staff_id = staff1.id
//         JOIN 
//             staffs AS staff2 ON customers.account_manager_id = staff2.id
//         LEFT JOIN clients ON clients.customer_id = customers.id
//         LEFT JOIN
//             assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
//         LEFT JOIN
//             customer_company_information ON customers.id = customer_company_information.customer_id
//         LEFT JOIN staff_portfolio ON staff_portfolio.customer_id = customers.id
//          LEFT JOIN customer_services ON customer_services.customer_id = customers.id
//         JOIN customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
//         WHERE
//             (customers.staff_id = ?  OR customers.account_manager_id = ? OR assigned_jobs_staff_view.staff_id = ? OR staff_portfolio.staff_id = ? OR customer_service_account_managers.account_manager_id = ? 

//             OR customers.staff_id IN (${LineManageStaffId}) OR customers.account_manager_id IN (${LineManageStaffId}) OR assigned_jobs_staff_view.staff_id IN (${LineManageStaffId})
//             OR staff_portfolio.staff_id IN (${LineManageStaffId}) OR customer_service_account_managers.account_manager_id IN (${LineManageStaffId})
//             )
//            GROUP BY customers.id
//            ORDER BY customers.id DESC

//          `;
//     try {
//         const [result] = await pool.execute(query, [StaffUserId, StaffUserId, StaffUserId, StaffUserId, StaffUserId]);
//         return { status: true, message: 'Success..', data: result };
//     } catch (err) {
//         console.error('Error executing query getCustomer_dropdown:', err);
//         return { status: false, message: 'Error executing query', data: err };
//     }

// }

const updateProcessCustomerServices = async (customerProcessData) => {

    const { customer_id, services, Task } = customerProcessData;

    const [ExistCustomer] = await pool.execute('SELECT customer_type , customer_code , account_manager_id  FROM `customers` WHERE id =' + customer_id);

    var account_manager_id_exit = ExistCustomer[0].account_manager_id;
    const customer_type = ExistCustomer[0].customer_type;


    for (const serVal of services) {
        let service_id = serVal.service_id;
        let account_manager_id = serVal.account_manager_id;
        let customer_service_task = serVal.customer_service_task;


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


            // Process 2 table Account manager id
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


            // Process 3 table customer service task
            if (customer_service_task != undefined) {
                const insertCSTQuery = `
                INSERT INTO customer_service_task (customer_id,service_id,task_id)
                VALUES (?, ?, ?)
            `;
                if (customer_service_task.length > 0) {
                    for (const cst of customer_service_task) {
                        const checkQuery3 = `
                    SELECT customer_id , service_id , task_id FROM customer_service_task WHERE customer_id = ? AND service_id = ? AND task_id = ?
                   `;
                        const [existing3] = await pool.execute(checkQuery3, [customer_id, service_id, cst]);
                        if (existing3.length === 0) {
                            await pool.execute(insertCSTQuery, [customer_id, service_id, cst]);
                        }

                    }
                }
            }



        } catch (err) {
            console.error('Error inserting data:', err);
            throw err;
        }
    }

    // Update customer process page
    let pageStatus = "2";
    await pool.execute('UPDATE customers SET form_process = ? WHERE id = ?', [pageStatus, customer_id]);

    return customer_id;

}

const updateProcessCustomerEngagementModel = async (customerProcessData) => {

    const { customer_id, fte_dedicated_staffing, percentage_model, adhoc_payg_hourly, customised_pricing, customerJoiningDate, customerSource, customerSubSource } = customerProcessData;


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



    const customerUpdateQuery = `UPDATE customers SET customerJoiningDate = ?, customerSource = ?, customerSubSource = ? WHERE id = ?`;
    const [updateQuery] = await pool.execute(customerUpdateQuery, [customerJoiningDate, customerSource, customerSubSource, customer_id]);

    if (fte_dedicated_staffing === "1") {

        const { customer_id, fte_dedicated_staffing, number_of_accountants, fee_per_accountant, number_of_bookkeepers, fee_per_bookkeeper, number_of_payroll_experts, fee_per_payroll_expert, number_of_tax_experts, fee_per_tax_expert, number_of_admin_staff, fee_per_admin_staff } = customerProcessData;

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

                let minimum_number_of_jobs = customisedVal.minimum_number_of_jobs
                let cost_per_job = customisedVal.cost_per_job
                let service_id = customisedVal.service_id


                const checkQuery4 = `SELECT id FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ? AND minimum_number_of_jobs = ?  AND cost_per_job = ? AND service_id = ?`;
                const [exist4] = await pool.execute(checkQuery4, [customer_engagement_model_id, minimum_number_of_jobs, cost_per_job, service_id]);
                let customer_engagement_customised_pricing_id;

                if (exist4.length === 0) {
                    const insertQuery = `
            INSERT INTO customer_engagement_customised_pricing (
                customer_engagement_model_id,
                minimum_number_of_jobs,
                cost_per_job,
                service_id
            ) VALUES (?, ?, ?, ?)
        `;
                    const [result] = await pool.execute(insertQuery, [
                        customer_engagement_model_id,
                        minimum_number_of_jobs,
                        cost_per_job,
                        service_id
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

    // Update customer process page
    let pageStatus = "3";
    await pool.execute('UPDATE customers SET form_process = ? WHERE id = ?', [pageStatus, customer_id]);

    return customer_id;
}

const updateProcessCustomerFile = async (customerProcessDataFiles, customer_id, uploadedFiles) => {

    if (uploadedFiles && uploadedFiles.length > 0) {

        for (let file of uploadedFiles) {
            const file_name = file.filename;
            const original_name = file.originalname;
            const file_type = file.mimetype;
            const file_size = file.size;
            const web_url = file.web_url;

            const checkQuery = `SELECT id FROM customer_paper_work WHERE customer_id = ? AND original_name = ?`;
            const [rows] = await pool.execute(checkQuery, [customer_id, original_name]);
            if (rows.length > 0) {
                continue;
            }

            const insertQuery = `
                INSERT INTO customer_paper_work (
                    customer_id, file_name, original_name, file_type, file_size , web_url
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;

            try {
                const [result] = await pool.execute(insertQuery, [
                    customer_id,
                    file_name,
                    original_name,
                    file_type,
                    file_size,
                    web_url
                ]);

            } catch (error) {
                console.log('Error inserting file:', error);
            }
        }
    }



    // if (customerProcessDataFiles && customerProcessDataFiles.length > 0) {

    //     for (let file of customerProcessDataFiles) {
    //         const file_name = file.filename;
    //         const original_name = file.originalname;
    //         const file_type = file.mimetype;
    //         const file_size = file.size;


    //         const insertQuery = `
    //             INSERT INTO customer_paper_work (
    //                 customer_id, file_name, original_name, file_type, file_size
    //             ) VALUES (?, ?, ?, ?, ?)
    //         `;

    //         try {
    //             const [result] = await pool.execute(insertQuery, [
    //                 customer_id,
    //                 file_name,
    //                 original_name,
    //                 file_type,
    //                 file_size
    //             ]);

    //         } catch (error) {
    //             console.log('Error inserting file:', error);
    //         }
    //     }
    // }
    // Update customer process page
    let pageStatus = "4"
    await pool.execute('UPDATE customers SET form_process = ? WHERE id = ?', [pageStatus, customer_id]);
    return customer_id
}

const updateProcessCustomerFileGet = async (customerProcessData) => {
    const { customer_id } = customerProcessData;

    try {
        const query = `SELECT * FROM customer_paper_work WHERE customer_id = ?`
        const [result] = await pool.execute(query, [customer_id]);
        return result;
    } catch (err) {
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
        customers.trading_address AS trading_address,
        customers.vat_registered AS vat_registered,
        customers.vat_number AS vat_number,
        customers.website AS website,
        customers.form_process AS form_process,
        customers.notes AS notes,
        customers.status AS status,
        customer_contact_details.id AS contact_id,
        customer_contact_details.first_name AS first_name,
        customer_contact_details.last_name AS last_name,
        customer_contact_details.email AS email,
        customer_contact_details.phone_code AS phone_code,
        customer_contact_details.phone AS phone,
        customer_contact_details.residential_address AS residential_address,
        customer_contact_person_role.name AS customer_role_contact_name,
        customer_contact_person_role.id AS customer_role_contact_id,
        CONCAT(
            'cust_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(customers.customer_code, 1, 15)
            ) AS customer_code
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
                    notes: rows[0].notes


                };

                const contactDetails = rows.map(row => ({
                    contact_id: row.contact_id,
                    customer_contact_person_role_id: row.customer_role_contact_id,
                    customer_contact_person_role_name: row.customer_role_contact_name,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone_code: row.phone_code,
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
            customers.notes AS notes,
            customers.status AS status, 
            customer_contact_details.id AS contact_id,
            customer_contact_details.first_name AS first_name,
            customer_contact_details.last_name AS last_name,
            customer_contact_details.email AS email,
            customer_contact_details.phone_code AS phone_code,
            customer_contact_details.phone AS phone,
            customer_contact_details.residential_address AS residential_address,
            customer_company_information.company_name AS company_name,
            customer_company_information.entity_type AS entity_type,
            customer_company_information.company_status AS company_status,
            customer_company_information.company_number AS company_number,
            customer_company_information.registered_office_address AS registered_office_address,
            DATE_FORMAT(customer_company_information.incorporation_date, '%Y-%m-%d') AS incorporation_date,
            customer_company_information.incorporation_in AS incorporation_in,
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
                    notes: rows[0].notes,
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
                    phone_code: row.phone_code,
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
            customers.notes AS notes,
            customers.status AS status,
            customer_contact_details.id AS contact_id,
            customer_contact_details.first_name AS first_name,
            customer_contact_details.last_name AS last_name,
            customer_contact_details.email AS email,
            customer_contact_details.phone_code AS phone_code,
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
                    notes: rows[0].notes,
                    status: rows[0].status,
                };


                const contactDetails = rows.map(row => ({
                    contact_id: row.contact_id,
                    customer_contact_person_role_id: row.customer_role_contact_id,
                    customer_contact_person_role_name: row.customer_role_contact_name,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    email: row.email,
                    phone_code: row.phone_code,
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

                return []
            }
            ;
        }

    }

    //  Page Status 2 Service Part
    else if (pageStatus === "2") {
        //     const query = `
        //     SELECT 
        //         customers.id AS customer_id,
        //         customers.customer_type AS customer_type,
        //         customers.staff_id AS staff_id,
        //         customers.account_manager_id AS account_manager_id,
        //         customers.trading_name AS trading_name,
        //         customers.customer_code AS customer_code,
        //         customers.trading_address AS trading_address,
        //         customers.vat_registered AS vat_registered,
        //         customers.vat_number AS vat_number,
        //         customers.website AS website,
        //         customers.form_process AS form_process,
        //         customers.status AS status,
        //         customer_services.id as customer_service_id,
        //         customer_services.service_id,
        //         GROUP_CONCAT(customer_service_account_managers.account_manager_id) AS account_manager_ids
        //     FROM 
        //         customers
        //     JOIN 
        //         customer_services ON customers.id = customer_services.customer_id
        //     LEFT JOIN 
        //         customer_service_account_managers ON customer_services.id = customer_service_account_managers.customer_service_id
        //     WHERE 
        //         customers.id = ?
        //     GROUP BY
        //         customers.id, customer_services.id
        // `;

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
            customers.notes AS notes,
            customers.status AS status,
            customer_services.id as customer_service_id,
            customer_services.service_id,
            jobs.id AS job_id,
            jobs.id AS job_exist,
            GROUP_CONCAT(customer_service_account_managers.account_manager_id) AS account_manager_ids
        FROM 
            customers
        JOIN 
            customer_services ON customers.id = customer_services.customer_id
        LEFT JOIN 
            jobs ON jobs.service_id = customer_services.service_id AND jobs.customer_id = customers.id
        LEFT JOIN 
            customer_service_account_managers ON customer_services.id = customer_service_account_managers.customer_service_id
        WHERE 
            customers.id = ?
        GROUP BY
            customers.id, customer_services.id`;
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
                notes: rows[0].notes,
                status: rows[0].status,
            };

            const services = rows.map(row => ({
                service_id: row.service_id,
                job_id: row.job_id,
                job_exist: row.job_exist,
                //account_manager_ids: row.account_manager_ids ? row.account_manager_ids.split(',').map(Number) : []
                account_manager_ids: row.account_manager_ids
                    ? [...new Set(row.account_manager_ids.split(',').map(Number))]
                    : []

            }));

            const result = {
                customer: customerData,
                services: services
            };

            return result;
        } else {

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
            customers.notes AS notes,
            customers.status AS status,

            DATE_FORMAT(customers.customerJoiningDate, '%Y-%m-%d') AS customerJoiningDate,
            customers.customerSource AS customerSource,
            customers.customerSubSource AS customerSubSource,


            customer_engagement_model.*, 
            customer_engagement_fte.*, 
            customer_engagement_percentage.*, 
            customer_engagement_adhoc_hourly.*, 
            customer_engagement_customised_pricing.id AS customised_pricing_id,
            customer_engagement_customised_pricing.minimum_number_of_jobs AS minimum_number_of_jobs,
            customer_engagement_customised_pricing.job_type_id AS job_type_id,
            customer_engagement_customised_pricing.cost_per_job AS cost_per_job,
            customer_engagement_customised_pricing.service_id AS service_id

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
                notes: rows[0].notes,
                status: rows[0].status,
                customerJoiningDate: rows[0].customerJoiningDate,
                customerSource: rows[0].customerSource,
                customerSubSource: rows[0].customerSubSource,
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
                    cost_per_job: row.cost_per_job,
                    service_id: row.service_id

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
            customers.notes AS notes,
            customers.status AS status,
            customer_paper_work.id AS customer_paper_work_id,
            customer_paper_work.file_name AS file_name,
            customer_paper_work.original_name AS original_name,
            customer_paper_work.file_type AS file_type,
            customer_paper_work.file_size AS file_size,
            customer_paper_work.web_url AS web_url

        FROM 
            customers
        LEFT JOIN 
            customer_paper_work ON customers.id = customer_paper_work.customer_id
        WHERE 
            customers.id = ?
        ORDER BY customer_paper_work.id DESC    
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
                notes: rows[0].notes,
                status: rows[0].status,
            };

            // const customer_paper_work = rows.map(row => ({
            //     customer_paper_work_id: row.customer_paper_work_id,
            //     file_name: row.file_name,
            //     original_name: row.original_name,
            //     file_type: row.file_type,
            //     file_size: row.file_size
            // }));
            const customer_paper_work = rows
                .filter(row => row.file_name !== null) // Filter out rows with file_name as null
                .map(row => ({
                    customer_paper_work_id: row.customer_paper_work_id,
                    file_name: row.file_name,
                    original_name: row.original_name,
                    file_type: row.file_type,
                    file_size: row.file_size,
                    web_url: row.web_url
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
    const lastCode = ExistCustomer[0].customer_code;
      
    
    // Page Status 1 
    if (pageStatus === "1") {

        const { customer_type, staff_id, account_manager_id, trading_name, trading_address, vat_registered, vat_number, website, contactDetails, notes } = customer;

        //  console.log("account_manager_id", account_manager_id)
        //  console.log("ExistCustomer[0].account_manager_id", ExistCustomer[0].account_manager_id)

        if (Number(account_manager_id) != Number(ExistCustomer[0].account_manager_id)) {
             
             const [exist_account_manager] = await pool.execute(`SELECT id FROM customer_services JOIN customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id WHERE customer_services.customer_id = ${Number(customer_id)} AND customer_service_account_managers.account_manager_id = ${Number(ExistCustomer[0].account_manager_id)}`);
             
             //console.log("exist_account_manager", exist_account_manager)
             if(exist_account_manager.length > 0){
                for (let index = 0; index < exist_account_manager.length; index++) {
                    const element = exist_account_manager[index];
                    // update customer_service_account_managers
                    // await pool.execute(`UPDATE customer_service_account_managers SET account_manager_id = ${Number(account_manager_id)} WHERE customer_service_id = ${element.id} AND account_manager_id = ${Number(ExistCustomer[0].account_manager_id)}`);
                     await pool.execute(
                        `UPDATE customer_service_account_managers c
                        SET c.account_manager_id = ?
                        WHERE c.customer_service_id = ?
                        AND c.account_manager_id = ?
                        AND NOT EXISTS (
                                SELECT 1
                                FROM customer_service_account_managers c2
                                WHERE c2.customer_service_id = c.customer_service_id
                                AND c2.account_manager_id = ?
                        )`,
                        [
                            Number(account_manager_id),
                            element.id,
                            Number(ExistCustomer[0].account_manager_id),
                            Number(account_manager_id)
                        ]
                    );
                }
             }

            /////////////
            // const [exist_account_manager] = await pool.execute(`SELECT id FROM customer_services JOIN customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id WHERE customer_services.customer_id = ${Number(customer_id)} AND customer_service_account_managers.account_manager_id = ${Number(ExistCustomer[0].account_manager_id)}`);

            // let customer_services_ids = exist_account_manager.map(item => item.id);

            // if (customer_services_ids.length > 0) {

            //     const placeholders = customer_services_ids.map(() => '?').join(', ');
            //     const query = `DELETE FROM customer_service_account_managers WHERE customer_service_id IN (${placeholders})`;
            //     await pool.execute(query, customer_services_ids);
            // }

        }

        const firstThreeLetters = trading_name.substring(0, 3);
        const customer_code = "cust_" + firstThreeLetters + "_" + lastCode;

        const checkQuery = `SELECT 1 FROM customers WHERE trading_name = ? AND id != ?`;
        const [check] = await pool.execute(checkQuery, [trading_name, customer_id]);

        if (check.length > 0) {
            return { status: false, message: 'Customers Trading Name Already Exists.' };
        }

        const query = `
        UPDATE customers
        SET customer_type = ?, staff_id = ?, account_manager_id = ?, trading_name = ?, trading_address = ?, vat_registered = ?, vat_number = ?, website = ? ,notes = ? 
        WHERE id = ?
        `;

        const [result] = await pool.execute(query, [customer_type, staff_id, account_manager_id, trading_name, trading_address, vat_registered, vat_number, website, notes, customer_id]);

        let cust_type = 'sole trader'
        if (customer_type === '2') {
            cust_type = 'company'
        } else if (customer_type === '3') {
            cust_type = 'partnership'
        }

        //Solo Traders Details
        if (customer_type == "1") {

            let contact_id = contactDetails[0].contact_id;
            let first_name = contactDetails[0].first_name;
            let last_name = contactDetails[0].last_name;
            let email = contactDetails[0].email;
            let phone_code = contactDetails[0].phone_code;
            let phone = contactDetails[0].phone;
            let residential_address = contactDetails[0].residential_address;

            const query2 = `
        UPDATE customer_contact_details
        SET first_name = ?, last_name = ?, phone_code = ?, phone = ?, email = ?, residential_address = ?
        WHERE customer_id = ? AND id = ?
         `;

            try {
                const [result2] = await pool.execute(query2, [first_name, last_name, phone_code, phone, email, residential_address, customer_id, contact_id]);
                // Add log
                if (result.changedRows > 0 || result2.changedRows) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `edited ${cust_type} information. customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                }

                return { status: true, message: 'Customer updated successfully.', data: customer_id };
            } catch (err) {
                return { status: false, message: 'Update Error Customer Type 1' };
            }


        }

        // Company Details
        else if (customer_type == "2") {
            const { company_name, entity_type, company_status, company_number, registered_office_address, incorporation_date, incorporation_in } = customer;
            try {

                const [incorporation_date_s] = incorporation_date.split('T');


                const query2 = `
                    UPDATE customer_company_information
                    SET company_name = ?, entity_type = ?, company_status = ?, company_number = ?, registered_office_address = ?, incorporation_date = ?, incorporation_in = ?
                    WHERE customer_id = ?
                `;
                const [result2] = await pool.execute(query2, [company_name, entity_type, company_status, company_number, registered_office_address, incorporation_date_s, incorporation_in, customer_id]);




                const [existIdResult] = await pool.execute('SELECT id FROM customer_contact_details WHERE customer_id = ?', [customer_id]);
                const idArray = await existIdResult.map(item => item.id);
                let arrayInterId = []


                // Update customer_contact_details
                const query3 = `
                    UPDATE customer_contact_details
                    SET contact_person_role_id = ?, first_name = ?, last_name = ?, phone_code = ?, phone = ?, email = ?
                    WHERE customer_id = ? AND id = ?
                `;

                let result3;
                let result4;
                let logUpdateRequired = false;
                let logAdditional = false;
                for (const detail of contactDetails) {

                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id == "" ? 0 : detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone_code = detail.phone_code;
                    let phone = detail.phone;

                    if (contact_id == "" || contact_id == undefined || contact_id == null) {

                        // Insert customer_contact_details

                        const query4 = `
                        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone_code,phone,email)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        result4 = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone_code, phone, email]);
                        logAdditional = true;

                    }
                    else {

                        arrayInterId.push(contact_id)
                        result3 = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone_code, phone, email, customer_id, contact_id]);
                        if (result3[0].changedRows > 0) {
                            logUpdateRequired = true;
                        }
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

                // Add log
                if (logAdditional == true && (result.changedRows > 0 || result2.changedRows > 0 || logUpdateRequired == true)) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `edited ${cust_type} information and added additional Officer information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                }
                else if (logAdditional == true) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `added additional Officer to the ${cust_type} information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                } else if (result.changedRows > 0 || result2.changedRows > 0 || logUpdateRequired == true) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `edited the ${cust_type} information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                }
                return { status: true, message: 'Customer updated successfully.', data: customer_id };

            } catch (err) {
                console.log(err);
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
                SET contact_person_role_id = ?, first_name = ?, last_name = ?,phone_code = ? ,phone = ?, email = ? 
                WHERE customer_id = ? AND id = ?
               `;


                let logUpdateRequired = false;
                let logAdditional = false;

                for (const detail of contactDetails) {

                    let contact_id = detail.contact_id;
                    let customer_contact_person_role_id = detail.customer_contact_person_role_id == "" ? 0 : detail.customer_contact_person_role_id;
                    let first_name = detail.first_name;
                    let last_name = detail.last_name;
                    let email = detail.email;
                    let phone_code = detail.phone_code;
                    let phone = detail.phone;

                    if (contact_id == "" || contact_id == undefined || contact_id == null) {
                        const query4 = `
                        INSERT INTO customer_contact_details (customer_id,contact_person_role_id,first_name,last_name,phone_code,phone,email)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                        `;
                        const [result3, err3] = await pool.execute(query4, [customer_id, customer_contact_person_role_id, first_name, last_name, phone_code, phone, email]);
                        logAdditional = true;


                    } else {

                        arrayInterId.push(contact_id)
                        const [result3] = await pool.execute(query3, [customer_contact_person_role_id, first_name, last_name, phone_code, phone, email, customer_id, contact_id]);

                        if (result3.changedRows > 0) {
                            logUpdateRequired = true;
                        }

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

                // Add log
                if (logAdditional == true && (result.changedRows > 0 || logUpdateRequired == true)) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `edited ${cust_type} information and added additional Partner information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                }
                else if (logAdditional == true) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `added additional Partner to the ${cust_type} information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                } else if (result.changedRows > 0 || logUpdateRequired == true) {
                    const currentDate = new Date();
                    await SatffLogUpdateOperation(
                        {
                            staff_id: customer.StaffUserId,
                            ip: customer.ip,
                            date: currentDate.toISOString().split('T')[0],
                            module_name: 'customer',
                            log_message: `edited the ${cust_type} information customer code :`,
                            permission_type: 'updated',
                            module_id: customer_id,
                        }
                    );
                }

                return { status: true, message: 'Customer updated successfully.', data: customer_id };

            } catch (err) {
                console.log("err ", err)
                return { status: false, message: 'Update Error Customer Type 3' };
            }

        }

    }

    //  Page Status 2 Service Part
    else if (pageStatus === "2") {
    
        const { services, Task } = customer;

        const [ExistServiceids] = await pool.execute('SELECT service_id  FROM `customer_services` WHERE customer_id =' + customer_id);
        const [ExistCustomer] = await pool.execute('SELECT customer_type , customer_code , account_manager_id  FROM `customers` WHERE id =' + customer_id);
        var account_manager_id = ExistCustomer[0].account_manager_id;

        const idArray = await ExistServiceids.map(item => item.service_id);
        let arrayInterId = []


        let logUpdateRequired = false;
        let logAdditional = false;
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
                    logAdditional = true

                } else {
                    customer_service_id = existing[0].id;
                }
                // Process 2 table
                const [[exist_count_manager]] = await pool.execute('SELECT COUNT(*) as exist_count_manager FROM `customer_service_account_managers`WHERE customer_service_id = ?', [customer_service_id]);


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
                        logUpdateRequired = true
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
                        logUpdateRequired = true
                    }
                }

                const [[new_count_manager]] = await pool.execute('SELECT COUNT(*) as new_count_manager FROM `customer_service_account_managers`WHERE customer_service_id = ?', [customer_service_id]);


                if (exist_count_manager.exist_count_manager !== new_count_manager.new_count_manager) {
                    logUpdateRequired = true
                }


            } catch (err) {
                console.log("err ", err)
                return { status: false, message: 'Customer Services Err update.' };
            }
        }

        let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
        if (deleteIdArray.length > 0) {
            logUpdateRequired = true
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


        // Add log
        if (logAdditional == true && logUpdateRequired == true) {
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'customer',
                    log_message: ` edited the service details and added an additional service while editing the customer code :`,
                    permission_type: 'updated',
                    module_id: customer_id,
                }
            );
        }
        else if (logAdditional == true) {
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'customer',
                    log_message: `added an additional service while editing the customer code :`,
                    permission_type: 'updated',
                    module_id: customer_id,
                }
            );
        }
        else if (logUpdateRequired == true) {
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'customer',
                    log_message: `edited the service details customer code :`,
                    permission_type: 'updated',
                    module_id: customer_id,
                }
            );
        }


        return { status: true, message: 'customer services update successfully.', data: customer_id };


    }

    //  Page Status 3 Customer engagement model Part
    else if (pageStatus === "3") {

        const { customer_id, fte_dedicated_staffing, percentage_model, adhoc_payg_hourly, customised_pricing, customerJoiningDate, customerSource, customerSubSource } = customer;
        // console.log("customer", customer)

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

        const customerUpdateQuery = `UPDATE customers SET customerJoiningDate = ?, customerSource = ?, customerSubSource = ? WHERE id = ?`;
        const [updateQuery] = await pool.execute(customerUpdateQuery, [customerJoiningDate, customerSource, customerSubSource, customer_id]);




        let logUpdateRequired = false;
        let logAdditional = false;
        let model_name = [];

        if (fte_dedicated_staffing === "1") {

            const { customer_id, fte_dedicated_staffing, number_of_accountants, fee_per_accountant, number_of_bookkeepers, fee_per_bookkeeper, number_of_payroll_experts, fee_per_payroll_expert, number_of_tax_experts, fee_per_tax_expert, number_of_admin_staff, fee_per_admin_staff } = customer;


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

                // console.log("insertQuery", insertQuery)
                // console.log("customer_engagement_model_id", customer_engagement_model_id)
                // console.log("number_of_accountants", number_of_accountants)
                // console.log("fee_per_accountant", fee_per_accountant)
                // console.log("number_of_bookkeepers", number_of_bookkeepers)
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

                model_name.push('added FTE/Dedicated Staffing')
                logAdditional = true


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
                const [result] = await pool.execute(updateQuery, [
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

                if (result.changedRows > 0) {
                    model_name.push('edited FTE/Dedicated Staffing')
                    logUpdateRequired = true
                }

                const updateQueryEngagementModel = `UPDATE customer_engagement_model SET fte_dedicated_staffing = ? WHERE customer_id = ? `;
                await pool.execute(updateQueryEngagementModel, [fte_dedicated_staffing, customer_id]);

            }


        }

        if (percentage_model === "1") {

            const { customer_id, percentage_model, total_outsourcing, accountants, bookkeepers, payroll_experts, tax_experts, admin_staff } = customer;


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
                model_name.push("added Percentage Model")
                logAdditional = true

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
                const [result] = await pool.execute(updateQuery, [
                    total_outsourcing,
                    accountants,
                    bookkeepers,
                    payroll_experts,
                    tax_experts,
                    admin_staff,
                    customer_engagement_percentage_id
                ]);

                if (result.changedRows > 0) {
                    model_name.push('edited Percentage Model')
                    logUpdateRequired = true
                }


                const updateQueryEngagementModel = `UPDATE customer_engagement_model SET percentage_model = ? WHERE customer_id = ? `;
                await pool.execute(updateQueryEngagementModel, [percentage_model, customer_id]);

            }

        }

        if (adhoc_payg_hourly === "1") {

            const { customer_id, adhoc_payg_hourly, adhoc_accountants, adhoc_bookkeepers, adhoc_payroll_experts, adhoc_tax_experts, adhoc_admin_staff } = customer;

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
                model_name.push('added Adhoc/PAYG/Hourly')
                logAdditional = true

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
                const [result] = await pool.execute(updateQuery, [
                    adhoc_accountants,
                    adhoc_bookkeepers,
                    adhoc_payroll_experts,
                    adhoc_tax_experts,
                    adhoc_admin_staff,
                    customer_engagement_adhoc_hourly_id
                ]);

                if (result.changedRows > 0) {
                    model_name.push('edited Adhoc/PAYG/Hourly')
                    logUpdateRequired = true
                }

                const updateQueryEngagementModel = `UPDATE customer_engagement_model SET adhoc_payg_hourly = ? WHERE customer_id = ? `;
                await pool.execute(updateQueryEngagementModel, [adhoc_payg_hourly, customer_id]);


            }

        }

        if (customised_pricing === "1") {
            const { customer_id, customised_pricing, customised_pricing_data } = customer;

            const [existPricingData] = await pool.execute('SELECT id FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ?', [customer_engagement_model_id]);


            const idArray = existPricingData.map(item => item.id);
            let arrayInterId = [];
            let logUpdate = false;
            if (customised_pricing_data.length > 0) {
                for (const customisedVal of customised_pricing_data) {
                    let customised_pricing_id = customisedVal.customised_pricing_id;
                    let minimum_number_of_jobs = customisedVal.minimum_number_of_jobs;
                    let cost_per_job = customisedVal.cost_per_job;
                    let service_id = customisedVal.service_id;


                    if (customised_pricing_id == "" || customised_pricing_id == undefined || customised_pricing_id == null) {
                        const insertQuery = `
                            INSERT INTO customer_engagement_customised_pricing (
                                customer_engagement_model_id,
                                minimum_number_of_jobs,
                                cost_per_job,
                                service_id
                            ) VALUES (?, ?, ?, ?)
                        `;
                        const [result] = await pool.execute(insertQuery, [
                            customer_engagement_model_id,
                            minimum_number_of_jobs,
                            cost_per_job,
                            service_id
                        ]);
                        customer_engagement_customised_pricing_id = result.insertId;
                        logUpdate = true;
                    } else {
                        arrayInterId.push(customised_pricing_id);

                        const updateQuery = `
                            UPDATE customer_engagement_customised_pricing SET
                                minimum_number_of_jobs = ?,cost_per_job = ?, service_id = ?
                            WHERE id = ?
                        `;
                        const [result] = await pool.execute(updateQuery, [
                            minimum_number_of_jobs,
                            cost_per_job,
                            service_id,
                            customised_pricing_id
                        ]);
                        if (result.changedRows > 0) {
                            logUpdate = true;
                        }
                    }
                }

                let deleteIdArray = idArray.filter(id => !arrayInterId.includes(id));
                if (deleteIdArray.length > 0) {
                    logUpdate = true
                    for (const id of deleteIdArray) {
                        const query3 = `
                            DELETE FROM customer_engagement_customised_pricing WHERE id = ?
                        `;
                        await pool.execute(query3, [id]);
                    }
                }
            }
            const updateQueryEngagementModel = `UPDATE customer_engagement_model SET customised_pricing = ? WHERE customer_id = ? `;
            const [rows] = await pool.execute(updateQueryEngagementModel, [customised_pricing, customer_id]);
            if (rows.changedRows > 0) {
                model_name.push('added Customised Pricing')
                logAdditional = true
            } else {
                if (logUpdate == true) {
                    model_name.push('edited Customised Pricing')
                    logUpdateRequired = true
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
                const [result] = await pool.execute(updateQueryEngagementModel, [fte_dedicated_staffing, customer_id]);
                if (result.changedRows > 0) {
                    model_name.push('Removed FTE/Dedicated Staffing')
                    logUpdateRequired = true
                }

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
                const [result] = await pool.execute(updateQueryEngagementModel, [percentage_model, customer_id]);
                if (result.changedRows > 0) {
                    model_name.push('Removed Percentage Model')
                    logUpdateRequired = true
                }

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
                const [result] = await pool.execute(updateQueryEngagementModel, [adhoc_payg_hourly, customer_id]);
                if (result.changedRows > 0) {
                    model_name.push('Removed Adhoc/PAYG/Hourly')
                    logUpdateRequired = true
                }

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
                const [result] = await pool.execute(updateQueryEngagementModel, [customised_pricing, customer_id]);
                if (result.changedRows > 0) {
                    model_name.push('Removed Customised Pricing')
                    logUpdateRequired = true
                }

            }


        }

        if (model_name.length > 0) {
            const msgLog = model_name.length > 1
                ? model_name.slice(0, -1).join(', ') + ' and ' + model_name.slice(-1)
                : model_name[0];

            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'customer',
                    log_message: `${msgLog} (engagement model) customer code :`,
                    permission_type: 'updated',
                    module_id: customer_id,
                }
            );

        }



        return { status: true, message: 'customers model updated successfully.', data: customer_id };

    }

    //  Page Status 4 Paper Work Part
    // else if (pageStatus === "4") {

    //     const { customer_id, customer_paper_work } = customer;

    //     const [ExistPaperWorkIds] = await pool.execute('SELECT id  FROM `customer_paper_work` WHERE customer_id =' + customer_id);

    // }
    else {
        return { status: false, message: 'Error in page status.' };
    }

    return { status: true, message: 'customers updated successfully.', data: customer_id };
}

const getAllAccountManager = async (customer) => {
    let { customer_id } = customer;

    const query = `
    SELECT  
    customers.id AS id,
    staffs.id AS staff_id,
    CONCAT(staffs.first_name, ' ', staffs.last_name) AS account_manager_name,
    services.id AS service_id,
    services.name AS service_name
FROM 
    customers
JOIN 
    customer_services ON customer_services.customer_id = customers.id
JOIN
    services ON services.id = customer_services.service_id    
JOIN 
    customer_service_account_managers ON customer_service_account_managers.customer_service_id = customer_services.id
JOIN 
    staffs ON staffs.id = customer_service_account_managers.account_manager_id    
 WHERE 
    customers.id = ${customer_id}
 GROUP BY services.id , staffs.id
    `;

    const [result] = await pool.execute(query);




    const FinalResult = Object.values(
        result?.reduce((acc, curr) => {
            if (!acc[curr.service_id]) {
                acc[curr.service_id] = {
                    service_id: curr.service_id,
                    service_name: curr.service_name,
                    account_managers: []
                };
            }

            // Add account manager if not already added for same service
            const alreadyExists = acc[curr.service_id].account_managers.some(
                (m) => m.staff_id === curr.staff_id
            );

            if (!alreadyExists) {
                acc[curr.service_id].account_managers.push({
                    staff_id: curr.staff_id,
                    account_manager_name: curr.account_manager_name
                });
            }

            return acc;
        }, {})
    );

    console.log(FinalResult);
    return { status: true, data: FinalResult };
}

const customerStatusUpdate = async (customer) => {
    const { customer_id, status } = customer;
    const query = `UPDATE customers SET status = ? WHERE id = ?`;
    const [result] = await pool.execute(query, [status, customer_id]);

    if (result.affectedRows > 0) {
        if (result.changedRows > 0) {
            let status_change = "Deactivate"
            if (parseInt(status) == 1) {
                status_change = "Activate"
            }
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'customer',
                    log_message: `changes the status ${status_change} customer code :`,
                    permission_type: 'updated',
                    module_id: customer_id,
                }
            );
        }
        return { status: true, message: 'Customer status updated successfully.' };
    }
    return { status: false, message: 'Error updating customer status.' };
}

const getcustomerschecklist = async (customer) => {
    try {
        const { customer_id, service_id, job_type_id } = customer;
        const query = `SELECT c.*, ct.*
    FROM checklists c
    LEFT JOIN checklist_tasks ct
    ON c.id = ct.checklist_id
    WHERE c.service_id = ?
    AND c.job_type_id = ?
    AND (c.customer_id = ? OR c.customer_id = 0);`;
        const [result] = await pool.execute(query, [
            service_id,
            job_type_id,
            customer_id,
        ]);

        if (result.length === 0) {
            return [];
        }
        const formattedResults = result.map((item) => ({
            checklistName: item.check_list_name,
            JobTypeId: item.job_type_id,
            Task: [
                {
                    TaskName: item.task_name,
                    BudgetHour: item.budgeted_hour,
                },
            ],
            serviceId: item.service_id,
            id: item.id,
            checklist_id: item.checklist_id,
        }));
        return formattedResults
    } catch (err) {
        console.log(err);
    }
};

const deleteCustomer = async (customer) => {
    const { customer_id } = customer;

    try {
        await pool.execute(`DELETE FROM customer_company_information WHERE customer_id = ?`, [customer_id]);


        await pool.execute(`DELETE FROM customer_contact_details WHERE customer_id = ?`, [customer_id]);
        await pool.execute(`DELETE FROM customer_documents WHERE customer_id = ?`, [customer_id]);


        const [checklcustomerEngagementModelRowsistRows] = await pool.execute(`SELECT id FROM customer_engagement_model WHERE customer_id = ?`, [customer_id]);

        if (checklcustomerEngagementModelRowsistRows.length > 0) {

            for (const item of checklcustomerEngagementModelRowsistRows) {
                await pool.execute(`DELETE FROM customer_engagement_fte WHERE customer_engagement_model_id = ?`, [item.id]);
                await pool.execute(`DELETE FROM customer_engagement_percentage WHERE customer_engagement_model_id = ?`, [item.id]);
                await pool.execute(`DELETE FROM customer_engagement_adhoc_hourly WHERE customer_engagement_model_id = ?`, [item.id]);
                await pool.execute(`DELETE FROM customer_engagement_customised_pricing WHERE customer_engagement_model_id = ?`, [item.id]);

            }
        }
        await pool.execute(`DELETE FROM customer_engagement_model WHERE customer_id = ?`, [customer_id]);


        await pool.execute(`DELETE FROM customer_paper_work WHERE customer_id = ?`, [customer_id]);


        const [checklistRows] = await pool.execute(`SELECT id FROM checklists WHERE customer_id = ?`, [customer_id]);
        if (checklistRows.length > 0) {
            for (const item of checklistRows) {
                await pool.execute(`DELETE FROM checklist_tasks WHERE checklist_id = ?`, [item.id]);
            }
            await pool.execute(`DELETE FROM checklists WHERE customer_id = ?`, [customer_id]);
        }


        const [customerServicesRows] = await pool.execute(`SELECT id FROM customer_services WHERE customer_id = ?`, [customer_id]);
        if (customerServicesRows.length > 0) {
            for (const item of customerServicesRows) {
                await pool.execute(`DELETE FROM customer_service_account_managers WHERE customer_service_id = ?`, [item.id]);
            }
            await pool.execute(`DELETE FROM customer_services WHERE customer_id = ?`, [customer_id]);
        }


        await pool.execute(`DELETE FROM customer_service_task WHERE customer_id = ?`, [customer_id]);
        const [result] = await pool.execute(`DELETE FROM customers WHERE id = ?`, [customer_id]);

        if (parseInt(customer_id) > 0) {
            const currentDate = new Date();
            await SatffLogUpdateOperation(
                {
                    staff_id: customer.StaffUserId,
                    ip: customer.ip,
                    date: currentDate.toISOString().split('T')[0],
                    module_name: 'client',
                    log_message: `deleted customer. customer code :`,
                    permission_type: 'deleted',
                    module_id: customer_id,
                }
            );
        }


        if (result.affectedRows > 0) {
            return { status: true, message: 'Customer deleted successfully.' };
        }

    } catch (error) {
        console.log("error ", error)
        return { status: false, message: 'Error deleting customer.' };

    }



}

const getCustomersJobs = async (data) => {
    try {
        const [customers] = await pool.execute(`SELECT id, trading_name FROM customers WHERE status = '1' ORDER BY trading_name ASC`);
        const [clients] = await pool.execute(`SELECT id, trading_name, customer_id FROM clients WHERE status = '1' ORDER BY trading_name ASC`);
        const [jobs] = await pool.execute(`
            SELECT 
                jobs.id, 
                jobs.client_id, 
                jobs.customer_id,
                CONCAT(
                    SUBSTRING(customers.trading_name, 1, 3), '_',
                    SUBSTRING(clients.trading_name, 1, 3), '_',
                    SUBSTRING(job_types.type, 1, 4), '_',
                    SUBSTRING(jobs.job_id, 1, 15)
                ) AS job_id
            FROM jobs
            LEFT JOIN customers ON customers.id = jobs.customer_id
            LEFT JOIN clients ON clients.id = jobs.client_id
            LEFT JOIN job_types ON job_types.id = jobs.job_type_id
            ORDER BY jobs.job_id ASC
        `);
        
        return { status: true, message: 'Success', data: { customers, clients, jobs } };
    } catch (error) {
        return { status: false, message: error.message };
    }
}


module.exports = {
    createCustomer,
    getCustomer,
    getCustomer_dropdown,
    deleteCustomer,
    updateProcessCustomerServices,
    updateProcessCustomerEngagementModel,
    updateProcessCustomerFile,
    updateProcessCustomerFileGet,
    updateProcessCustomerFileDelete,
    getSingleCustomer,
    customerUpdate,
    customerStatusUpdate,
    getcustomerschecklist,
    getCustomer_dropdown_delete,
    getAllAccountManager,
    get_customers_filter,
    getCustomersJobs
};