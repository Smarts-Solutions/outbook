const pool = require("../config/database");
const deleteUploadFile = require("../middlewares/deleteUploadFile");
const { SatffLogUpdateOperation, generateNextUniqueCode } = require('../../app/utils/helper');

const createClient = async (client) => {
 
  // client Code(cli_CUS_CLI_00001)
  let data = {
    table: "clients",
    field: "client_code"
  }
  let client_code = await generateNextUniqueCode(data);

  let client_id;
  const {
    client_type,
    customer_id,
    trading_address,
    vat_registered,
    vat_number,
    website,
    StaffUserId
  } = client;

  let trading_name = client.trading_name;
  let notes = client.notes;

  if (client_type == "2") {
    trading_name = trading_name + '_' + client_code;
  }

  const checkQuery = `SELECT 1 FROM clients WHERE trading_name = ?`;

  const [check] = await pool.execute(checkQuery, [trading_name]);
  if (check.length > 0) {
    return { status: false, message: "Client Trading Name Already Exists." };
  }

  let client_industry_id =
    client.client_industry_id == undefined || client.client_industry_id == ""
      ? 0
      : client.client_industry_id;

  if (client_type != "4") {

    if(client_type == "5"){
      //console.log('client', client)
      let {service_address} = client;
      const query = `
      INSERT INTO clients (client_type,customer_id,staff_created_id,trading_name,client_code,trading_address,vat_registered,vat_number,website,notes,service_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          try {
            const [result] = await pool.execute(query, [
              client_type,
              customer_id,
              StaffUserId,
              trading_name,
              client_code,
              trading_address,
              vat_registered,
              vat_number,
              website,
              notes,
              service_address
            ]);
            client_id = result.insertId;
            const currentDate = new Date();
            await SatffLogUpdateOperation(
              {
                staff_id: client.StaffUserId,
                ip: client.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: 'client',
                log_message: `created client profile. client code :`,
                permission_type: 'created',
                module_id: client_id,
              }
            );
          } catch (err) {
            console.error("Error inserting data: - 5 ", err);
            throw err;
          }

    }
    else if(client_type == "6" || client_type == "7"){

      const query = `
      INSERT INTO clients (client_type,customer_id,staff_created_id,trading_name,client_code,trading_address,vat_registered,vat_number,website,notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
          try {
            const [result] = await pool.execute(query, [
              client_type,
              customer_id,
              StaffUserId,
              trading_name,
              client_code,
              trading_address,
              vat_registered,
              vat_number,
              website,
              notes,
            ]);
            client_id = result.insertId;
            const currentDate = new Date();
            await SatffLogUpdateOperation(
              {
                staff_id: client.StaffUserId,
                ip: client.ip,
                date: currentDate.toISOString().split('T')[0],
                module_name: 'client',
                log_message: `created client profile. client code :`,
                permission_type: 'created',
                module_id: client_id,
              }
            );
          } catch (err) {
            console.error("Error inserting data: - 1 , 2 , 3 ", err);
            throw err;
          }

    }
    else{
    const query = `
INSERT INTO clients (client_type,customer_id,staff_created_id,client_industry_id,trading_name,client_code,trading_address,vat_registered,vat_number,website,notes)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await pool.execute(query, [
        client_type,
        customer_id,
        StaffUserId,
        client_industry_id,
        trading_name,
        client_code,
        trading_address,
        vat_registered,
        vat_number,
        website,
        notes,
      ]);
      client_id = result.insertId;
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: client.StaffUserId,
          ip: client.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'client',
          log_message: `created client profile. client code :`,
          permission_type: 'created',
          module_id: client_id,
        }
      );
    } catch (err) {
      console.error("Error inserting data: - 1 , 2 , 3 ", err);
      throw err;
    }
  }


  }
  else {
    const query = `
    INSERT INTO clients (client_type,customer_id,staff_created_id,client_industry_id,trading_name,client_code,notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await pool.execute(query, [
        client_type,
        customer_id,
        StaffUserId,
        client_industry_id,
        trading_name,
        client_code,
        notes,
      ]);
      client_id = result.insertId;
      const currentDate = new Date();
      await SatffLogUpdateOperation(
        {
          staff_id: client.StaffUserId,
          ip: client.ip,
          date: currentDate.toISOString().split('T')[0],
          module_name: 'client',
          log_message: `created client profile. client code :`,
          permission_type: 'created',
          module_id: client_id,
        }
      );
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  }


  if (client_type == "1") {
    const { first_name, last_name, phone, email, residential_address } = client;
    let phone_code =
      client.phone_code == undefined || client.phone_code == ""
        ? ""
        : client.phone_code;
    let role = client.role == undefined || client.role == "" ? 0 : client.role;

    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id, role,first_name, last_name, phone_code,phone, email, residential_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const [result2] = await pool.execute(query2, [
        client_id,
        role,
        first_name,
        last_name,
        phone_code,
        phone,
        email,
        residential_address,
      ]);
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  } 
  else if (client_type == "2") {
    const {
      company_name,
      entity_type,
      company_status,
      company_number,
      registered_office_address,
      incorporation_date,
      incorporation_in,
      contactDetails,
    } = client;

    try {
      const query1 = `
        INSERT INTO client_company_information (client_id,company_name,entity_type,company_status,company_number,registered_office_address,incorporation_date,incorporation_in)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const [result1] = await pool.execute(query1, [
        client_id,
        company_name,
        entity_type,
        company_status,
        company_number,
        registered_office_address,
        incorporation_date,
        incorporation_in,
      ]);
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }

    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,phone_code,phone,email)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

      for (const detail of contactDetails) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
        let phone = detail.phone;
        let email = detail.email;
        const [result2] = await pool.execute(query2, [
          client_id,
          role,
          first_name,
          last_name,
          phone_code,
          phone,
          email,
        ]);
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  } 
  else if (client_type == "3") {
    const { contactDetails } = client;
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      for (const detail of contactDetails) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
        let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query2, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  }
  else if (client_type == "4") {
    const { first_name, last_name, phone, email, residential_address } = client;
    let phone_code =
      client.phone_code == undefined || client.phone_code == ""
        ? ""
        : client.phone_code;
    let role = client.role == undefined || client.role == "" ? 0 : client.role;

    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id, role,first_name, last_name, phone_code,phone, email, residential_address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
      const [result2] = await pool.execute(query2, [
        client_id,
        role,
        first_name,
        last_name,
        phone_code,
        phone,
        email,
        residential_address,
      ]);
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  }
  else if (client_type == "5") {
    const { member_details , trustee_details} = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if(member_details.length > 0){
       for (const detail of member_details) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
          let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query2, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
       }
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }

    // Trustee Details
    try {
      const query3 = `
        INSERT INTO client_trustee_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if(trustee_details.length > 0){
       for (const detail of trustee_details) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
          let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query3, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
       }
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  }
  else if (client_type == "6") {
    const { member_details} = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if(member_details.length > 0){
       for (const detail of member_details) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
          let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query2, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
       }
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }

  }
  else if (client_type == "7") {
    const { beneficiaries_details , trustee_details} = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if(beneficiaries_details.length > 0){
       for (const detail of beneficiaries_details) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
          let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query2, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
       }
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }

    // Trustee Details
    try {
      const query3 = `
        INSERT INTO client_trustee_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if(trustee_details.length > 0){
       for (const detail of trustee_details) {
        let role =
          detail.role == undefined || detail.role == "" ? 0 : detail.role;
        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
          let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let phone = detail.phone;
        let alternate_phone = detail.alternate_phone;
        let authorised_signatory_status = detail.authorised_signatory_status;
        const [result2] = await pool.execute(query3, [
          client_id,
          role,
          first_name,
          last_name,
          email,
          alternate_email,
          phone_code,
          phone,
          alternate_phone_code,
          alternate_phone,
          authorised_signatory_status,
        ]);
       }
      }
    } catch (err) {
      console.error("Error inserting data:", err);
      throw err;
    }
  }

  return { status: true, message: "client add successfully.", data: client_id };
};

const getClient = async (client) => {
  const { customer_id, StaffUserId } = client;

  try {
    const QueryRole = `
  SELECT
    staffs.id AS id,
    staffs.role_id AS role_id,
    roles.role AS role_name
  FROM
    staffs
  JOIN
    roles ON roles.id = staffs.role_id
  WHERE
    staffs.id = ${StaffUserId}
  LIMIT 1
  `
    const [rows] = await pool.execute(QueryRole);

    // Condition with Admin And SuperAdmin
    if (rows.length > 0 && (rows[0].role_name == "SUPERADMIN" || rows[0].role_name == "ADMIN")) {
      const query = `
    SELECT  
        clients.id AS id,
        clients.trading_name AS client_name,
        clients.status AS status,
        client_types.type AS client_type_name,
        client_contact_details.email AS email,
        client_contact_details.phone_code AS phone_code,
        client_contact_details.phone AS phone,
        CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
    FROM 
        clients
    JOIN 
       customers ON customers.id = clients.customer_id    
    JOIN 
        client_types ON client_types.id = clients.client_type
    LEFT JOIN 
        client_contact_details ON client_contact_details.id = (
            SELECT MIN(cd.id)
            FROM client_contact_details cd
            WHERE cd.client_id = clients.id
        )
    WHERE clients.customer_id = ?
 ORDER BY 
    clients.id DESC;
    `;
      const [result] = await pool.execute(query, [customer_id]);
      return { status: true, message: "success.", data: result };
    }

    const [existStaffbyCustomer] = await pool.execute('SELECT id  FROM customers WHERE id = "' + customer_id + '" AND staff_id = "' + StaffUserId + '" LIMIT 1');

    if (existStaffbyCustomer.length > 0) {

      const [rows] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + StaffUserId + '" LIMIT 1');

      if (rows.length > 0) {
        // Allocated to
        if (rows[0].role_id == 3) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id    
        JOIN 
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id   
        WHERE 
          (jobs.allocated_to = ? OR clients.customer_id = ?  OR clients.staff_created_id = ?) AND (jobs.client_id = clients.id OR clients.staff_created_id = ?) AND (jobs.allocated_to = ? OR clients.staff_created_id = ?) OR clients.customer_id = ?
        GROUP BY 
        CASE 
            WHEN jobs.allocated_to = ? THEN jobs.client_id
            ELSE clients.id
        END
        ORDER BY 
        clients.id DESC
            `;
          const [resultAllocated] = await pool.execute(query, [StaffUserId, customer_id, StaffUserId, StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId]);
          if (resultAllocated.length == 0) {
            return { status: true, message: "success.", data: resultAllocated };
          }
          const filteredData = resultAllocated.filter(item => parseInt(item.customer_id) === parseInt(customer_id));

          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        }
        // Account Manger
        else if (rows[0].role_id == 4) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id    
        JOIN 
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id
        LEFT JOIN 
          customer_services ON customer_services.customer_id = customers.id
        LEFT JOIN 
          customer_service_account_managers ON customer_service_account_managers.customer_service_id  = customer_services.id   
          WHERE 
          (jobs.account_manager_id = ? OR customer_service_account_managers.account_manager_id = ?  OR clients.staff_created_id = ?) AND (clients.customer_id = ? OR jobs.client_id = clients.id OR clients.staff_created_id = ? ) OR clients.customer_id = ?
        ORDER BY 
        clients.id DESC
            `;

          //   WHERE 
          // (jobs.account_manager_id = ? OR customer_service_account_managers.account_manager_id = ?) AND (clients.customer_id = ? OR jobs.client_id = clients.id OR clients.staff_created_id = ? )


          const [resultAccounrManage] = await pool.execute(query, [StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId, customer_id]);
          if (resultAccounrManage.length == 0) {
            return { status: true, message: "success.", data: resultAccounrManage };
          }

          const filteredData = resultAccounrManage.filter(item => parseInt(item.customer_id) === parseInt(customer_id));

          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        }
        // Reviewer
        else if (rows[0].role_id == 6) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id   
        JOIN
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id 
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id
        WHERE 
          (jobs.reviewer = ? OR clients.customer_id = ?  OR clients.staff_created_id = ?) AND (jobs.client_id = clients.id OR clients.staff_created_id = ?) AND (jobs.reviewer = ? OR clients.staff_created_id = ?) OR clients.customer_id = ?
        GROUP BY
        CASE 
            WHEN jobs.reviewer = ? THEN jobs.client_id 
            ELSE clients.id
        END
        ORDER BY 
        clients.id DESC
            `;

          try {
            const [resultReviewer] = await pool.execute(query, [StaffUserId, customer_id, StaffUserId, StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId]);
          
          } catch (error) {
            console.log('error', error)

          }

          if (resultReviewer.length == 0) {
            return { status: true, message: "success.", data: resultReviewer };
          }

          const filteredData = resultReviewer.filter(item => parseInt(item.customer_id) === parseInt(customer_id));

          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        } else {
          const query = `
          SELECT  
              clients.id AS id,
              clients.trading_name AS client_name,
              clients.status AS status,
              client_types.type AS client_type_name,
              client_contact_details.email AS email,
              client_contact_details.phone_code AS phone_code,
              client_contact_details.phone AS phone,
              CONCAT(
                  'cli_', 
                  SUBSTRING(customers.trading_name, 1, 3), '_',
                  SUBSTRING(clients.trading_name, 1, 3), '_',
                  SUBSTRING(clients.client_code, 1, 15)
                  ) AS client_code
          FROM 
              clients
          JOIN 
             customers ON customers.id = clients.customer_id    
          JOIN 
              client_types ON client_types.id = clients.client_type
          LEFT JOIN 
              client_contact_details ON client_contact_details.id = (
                  SELECT MIN(cd.id)
                  FROM client_contact_details cd
                  WHERE cd.client_id = clients.id
              )
          WHERE clients.customer_id = ?
       ORDER BY 
          clients.id DESC;
            `;
          const [result] = await pool.execute(query, [customer_id]);
          return { status: true, message: "success.", data: result };
        }

      }


    } else {


      const [rows] = await pool.execute('SELECT id , role_id  FROM staffs WHERE id = "' + StaffUserId + '" LIMIT 1');

      if (rows.length > 0) {
        // Allocated to
        if (rows[0].role_id == 3) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id    
        JOIN 
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id   
        WHERE 
          (jobs.allocated_to = ? OR clients.customer_id = ?  OR clients.staff_created_id = ?) AND (jobs.client_id = clients.id OR clients.staff_created_id = ?) AND (jobs.allocated_to = ? OR clients.staff_created_id = ?) OR clients.customer_id = ?
        GROUP BY 
        CASE 
            WHEN jobs.allocated_to = ? THEN jobs.client_id
            ELSE clients.id
        END
        ORDER BY 
        clients.id DESC
            `;
          const [resultAllocated] = await pool.execute(query, [StaffUserId, customer_id, StaffUserId, StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId]);
          if (resultAllocated.length == 0) {
            return { status: true, message: "success.", data: resultAllocated };
          }
          const filteredData = resultAllocated.filter(item => parseInt(item.customer_id) === parseInt(customer_id));

          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        }
        // Account Manger
        else if (rows[0].role_id == 4) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id    
        JOIN 
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id
        LEFT JOIN 
          customer_services ON customer_services.customer_id = customers.id
        LEFT JOIN 
          customer_service_account_managers ON customer_service_account_managers.customer_service_id  = customer_services.id   
          WHERE 
          (jobs.account_manager_id = ? OR customer_service_account_managers.account_manager_id = ? OR clients.staff_created_id = ?) AND (clients.customer_id = ? OR jobs.client_id = clients.id OR clients.staff_created_id = ? ) OR clients.customer_id = ?
        ORDER BY 
        clients.id DESC
            `;

          //   WHERE 
          // (jobs.account_manager_id = ? OR customer_service_account_managers.account_manager_id = ?) AND (clients.customer_id = ? OR jobs.client_id = clients.id OR clients.staff_created_id = ? )


          const [resultAccounrManage] = await pool.execute(query, [StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId, customer_id]);
          if (resultAccounrManage.length == 0) {
            return { status: true, message: "success.", data: resultAccounrManage };
          }

          const filteredData = resultAccounrManage.filter(item => parseInt(item.customer_id) === parseInt(customer_id));

          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        }
        // Reviewer
        else if (rows[0].role_id == 6) {
          const query = `
           SELECT  
          clients.customer_id AS customer_id,
          clients.id AS id,
          clients.trading_name AS client_name,
          clients.status AS status,
          client_types.type AS client_type_name,
          client_contact_details.email AS email,
          client_contact_details.phone_code AS phone_code,
          client_contact_details.phone AS phone,
          CONCAT(
              'cli_', 
              SUBSTRING(customers.trading_name, 1, 3), '_',
              SUBSTRING(clients.trading_name, 1, 3), '_',
              SUBSTRING(clients.client_code, 1, 15)
              ) AS client_code
        FROM 
            clients
        JOIN 
          customers ON customers.id = clients.customer_id   
        JOIN
            client_types ON client_types.id = clients.client_type
            LEFT JOIN 
            client_contact_details ON client_contact_details.id = (
                SELECT MIN(cd.id)
                FROM client_contact_details cd
                WHERE cd.client_id = clients.id
            )
        LEFT JOIN
          jobs ON jobs.client_id = clients.id 
        LEFT JOIN 
          staffs ON customers.staff_id = staffs.id
        WHERE 
          (jobs.reviewer = ? OR clients.customer_id = ?  OR clients.staff_created_id = ?) AND (jobs.client_id = clients.id OR clients.staff_created_id = ?) AND (jobs.reviewer = ? OR clients.staff_created_id = ?) OR clients.customer_id = ?
        GROUP BY
        CASE 
            WHEN jobs.reviewer = ? THEN jobs.client_id 
            ELSE clients.id
        END
        ORDER BY 
        clients.id DESC
            `;


          const [resultReviewer] = await pool.execute(query, [StaffUserId, customer_id, StaffUserId, StaffUserId, StaffUserId, StaffUserId, customer_id, StaffUserId]);

          if (resultReviewer.length == 0) {
            return { status: true, message: "success.", data: resultReviewer };
          }

          const filteredData = resultReviewer.filter(item => parseInt(item.customer_id) === parseInt(customer_id));
          const uniqueData = filteredData.filter((value, index, self) =>
            index === self.findIndex((t) => t.id === value.id)
          );
          return { status: true, message: "success.", data: uniqueData };

        }

      }

    }





  } catch (err) {
    return { status: false, message: "Err Client Get" };
  }
};

const getByidClient = async (client) => {
  const { client_id } = client;
  const [ExistClient] = await pool.execute(
    "SELECT client_type FROM `clients` WHERE id =" + client_id
  );

  const client_type = ExistClient[0].client_type;

  //Solo Traders Details
  if (client_type == "1") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name, 
    clients.client_code AS client_code, 
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website, 
    clients.notes AS notes, 
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.residential_address AS residential_address,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.id AS client_documents_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN 
    customers ON customers.id = clients.customer_id    
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
LEFT JOIN 
    client_documents ON client_documents.client_id = clients.id 
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);

    // console.log('rows', rows)
    // return
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
        notes: rows[0].notes,
        status: rows[0].status,
      };

     
      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
          contact_id: row.contact_id,
          customer_contact_person_role_id: row.customer_role_contact_id,
          customer_contact_person_role_name: row.customer_role_contact_name,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone_code: row.phone_code,
          phone: row.phone,
          residential_address: row.residential_address,
        }));



      const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        contact_details: contactDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  }
  else if (client_type == "2") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name, 
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website,
    clients.notes AS notes,
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.residential_address AS residential_address,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_company_information.*,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN 
    customers ON clients.customer_id = customers.id
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role 
LEFT JOIN 
   client_company_information ON clients.id = client_company_information.client_id
LEFT JOIN
  client_documents ON clients.id = client_documents.client_id
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
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
        incorporation_in: rows[0].incorporation_in,
      };

      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone_code: row.phone_code,
        phone: row.phone,
        residential_address: row.residential_address,
        }));


      const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        company_details: companyData,
        contact_details: contactDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  } 
  else if (client_type == "3") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name,  
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website,
    clients.notes AS notes,
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.alternate_email AS alternate_email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.alternate_phone_code AS alternate_phone_code,
    client_contact_details.alternate_phone AS alternate_phone,
    client_contact_details.authorised_signatory_status AS authorised_signatory_status,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN
    customers ON clients.customer_id = customers.id
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
    LEFT JOIN
    client_documents ON clients.id = client_documents.client_id
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
        notes: rows[0].notes,
        status: rows[0].status,
      };

      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


        const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        contact_details: contactDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  } 
  else if (client_type == "4") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id,  
    clients.trading_name AS trading_name,
    clients.status AS status,
    clients.notes AS notes,
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.residential_address AS residential_address,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN
    customers ON clients.customer_id = customers.id    
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
    LEFT JOIN
    client_documents ON client_documents.client_id = clients.id
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        notes: rows[0].notes,
        status: rows[0].status,
      };


      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
          contact_id: row.contact_id,
          customer_contact_person_role_id: row.customer_role_contact_id,
          customer_contact_person_role_name: row.customer_role_contact_name,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone_code: row.phone_code,
          phone: row.phone,
          residential_address: row.residential_address,
        }));


        const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        contact_details: contactDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  }
  else if (client_type == "5") {
    const query = `
  SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name,  
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website,
    clients.notes AS notes,
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.alternate_email AS alternate_email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.alternate_phone_code AS alternate_phone_code,
    client_contact_details.alternate_phone AS alternate_phone,
    client_contact_details.authorised_signatory_status AS authorised_signatory_status,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN
    customers ON clients.customer_id = customers.id
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
    LEFT JOIN
    client_documents ON clients.id = client_documents.client_id
WHERE 
    clients.id = ?
    `;
    const [rows] = await pool.execute(query, [client_id]);

    // Trustee Details

    const query2 = `
    SELECT 
      clients.id AS client_id, 
      client_trustee_contact_details.id AS contact_id,
      client_trustee_contact_details.first_name AS first_name,
      client_trustee_contact_details.last_name AS last_name,
      client_trustee_contact_details.email AS email,
      client_trustee_contact_details.alternate_email AS alternate_email,
      client_trustee_contact_details.phone_code AS phone_code,
      client_trustee_contact_details.phone AS phone,
      client_trustee_contact_details.alternate_phone_code AS alternate_phone_code,
      client_trustee_contact_details.alternate_phone AS alternate_phone,
      client_trustee_contact_details.authorised_signatory_status AS authorised_signatory_status,
      customer_contact_person_role.name AS customer_role_contact_name,
      customer_contact_person_role.id AS customer_role_contact_id
  FROM 
      clients
  JOIN
      customers ON clients.customer_id = customers.id
  LEFT JOIN 
      client_trustee_contact_details ON clients.id = client_trustee_contact_details.client_id
  LEFT JOIN 
      customer_contact_person_role ON customer_contact_person_role.id = client_trustee_contact_details.role
      LEFT JOIN
      client_documents ON clients.id = client_documents.client_id
  WHERE 
      clients.id = ?
      `;
      const [rows2] = await pool.execute(query2, [client_id]);



    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
        notes: rows[0].notes,
        status: rows[0].status,
      };

      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


        const trusteeDetails = rows2
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


        const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        member_details: contactDetails,
        trustee_details: trusteeDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  }
  else if (client_type == "6") {
    const query = `
  SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name,  
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website,
    clients.notes AS notes,
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.alternate_email AS alternate_email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.alternate_phone_code AS alternate_phone_code,
    client_contact_details.alternate_phone AS alternate_phone,
    client_contact_details.authorised_signatory_status AS authorised_signatory_status,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN
    customers ON clients.customer_id = customers.id
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
    LEFT JOIN
    client_documents ON clients.id = client_documents.client_id
WHERE 
    clients.id = ?
    `;
    const [rows] = await pool.execute(query, [client_id]);

    

    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
        notes: rows[0].notes,
        status: rows[0].status,
      };

      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


      
        const clientDocuments = rows
        .filter(row => row.original_name !== null) // Filter out rows with file_name as null
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        member_details: contactDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  }
  else if (client_type == "7") {
    const query = `
  SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id, 
    clients.client_industry_id AS client_industry_id, 
    clients.trading_name AS trading_name,  
    clients.trading_address AS trading_address, 
    clients.vat_registered AS vat_registered, 
    clients.vat_number AS vat_number, 
    clients.website AS website,
    clients.notes AS notes,
    clients.status AS status, 
    client_contact_details.id AS contact_id,
    client_contact_details.first_name AS first_name,
    client_contact_details.last_name AS last_name,
    client_contact_details.email AS email,
    client_contact_details.alternate_email AS alternate_email,
    client_contact_details.phone_code AS phone_code,
    client_contact_details.phone AS phone,
    client_contact_details.alternate_phone_code AS alternate_phone_code,
    client_contact_details.alternate_phone AS alternate_phone,
    client_contact_details.authorised_signatory_status AS authorised_signatory_status,
    customer_contact_person_role.name AS customer_role_contact_name,
    customer_contact_person_role.id AS customer_role_contact_id,
    client_documents.file_name AS file_name,
    client_documents.original_name AS original_name,
    client_documents.file_type AS file_type,
    client_documents.file_size AS file_size,
    client_documents.web_url AS web_url,
    CONCAT(
            'cli_', 
            SUBSTRING(customers.trading_name, 1, 3), '_',
            SUBSTRING(clients.trading_name, 1, 3), '_',
            SUBSTRING(clients.client_code, 1, 15)
            ) AS client_code
FROM 
    clients
JOIN
    customers ON clients.customer_id = customers.id
LEFT JOIN 
    client_contact_details ON clients.id = client_contact_details.client_id
LEFT JOIN 
    customer_contact_person_role ON customer_contact_person_role.id = client_contact_details.role
    LEFT JOIN
    client_documents ON clients.id = client_documents.client_id
WHERE 
    clients.id = ?
    `;
    const [rows] = await pool.execute(query, [client_id]);

    // Trustee Details

    const query2 = `
    SELECT 
      clients.id AS client_id, 
      client_trustee_contact_details.id AS contact_id,
      client_trustee_contact_details.first_name AS first_name,
      client_trustee_contact_details.last_name AS last_name,
      client_trustee_contact_details.email AS email,
      client_trustee_contact_details.alternate_email AS alternate_email,
      client_trustee_contact_details.phone_code AS phone_code,
      client_trustee_contact_details.phone AS phone,
      client_trustee_contact_details.alternate_phone_code AS alternate_phone_code,
      client_trustee_contact_details.alternate_phone AS alternate_phone,
      client_trustee_contact_details.authorised_signatory_status AS authorised_signatory_status,
      customer_contact_person_role.name AS customer_role_contact_name,
      customer_contact_person_role.id AS customer_role_contact_id
  FROM 
      clients
  JOIN
      customers ON clients.customer_id = customers.id
  LEFT JOIN 
      client_trustee_contact_details ON clients.id = client_trustee_contact_details.client_id
  LEFT JOIN 
      customer_contact_person_role ON customer_contact_person_role.id = client_trustee_contact_details.role
      LEFT JOIN
      client_documents ON clients.id = client_documents.client_id
  WHERE 
      clients.id = ?
      `;
      const [rows2] = await pool.execute(query2, [client_id]);



    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
        client_industry_id: rows[0].client_industry_id,
        trading_name: rows[0].trading_name,
        client_code: rows[0].client_code,
        trading_address: rows[0].trading_address,
        vat_registered: rows[0].vat_registered,
        vat_number: rows[0].vat_number,
        website: rows[0].website,
        notes: rows[0].notes,
        status: rows[0].status,
      };

      const contactDetails = rows
        .filter(row => row.contact_id !== null) // Filter out rows with file_name as null
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


        const trusteeDetails = rows2
        .filter(row => row.contact_id !== null) 
        .map(row => ({
        contact_id: row.contact_id,
        customer_contact_person_role_id: row.customer_role_contact_id,
        customer_contact_person_role_name: row.customer_role_contact_name,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        alternate_email: row.alternate_email,
        phone_code: row.phone_code,
        phone: row.phone,
        alternate_phone_code: row.alternate_phone_code,
        alternate_phone: row.alternate_phone,
        authorised_signatory_status:
        row.authorised_signatory_status == "1" ? true : false,
        }));


        const clientDocuments = rows
        .filter(row => row.original_name !== null) 
        .map(row => ({
          client_documents_id: row.client_documents_id,
          file_name: row.file_name,
          original_name: row.original_name,
          file_type: row.file_type,
          file_size: row.file_size,
          web_url: row.web_url
        }));

      const result = {
        client: clientData,
        beneficiaries_details: contactDetails,
        trustee_details: trusteeDetails,
        client_documents: clientDocuments
      };

      return { status: true, message: "success.", data: result };
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  }
  else {
    return { status: false, message: "No customer found with the given ID." };
  }
};

const getCustomerId = async (client) => {
  const { client_id } = client;
  const [ExistClient] = await pool.execute(
    "SELECT client_type FROM `clients` WHERE id =" + client_id
  );

  const client_type = ExistClient[0].client_type;

  //Solo Traders Details
  if (client_type == "1") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id
    
FROM 
    clients
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);

    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
      };

      const result = {
        client: clientData,
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  } else if (client_type == "2") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id
FROM 
    clients
 
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
      };
      const result = {
        client: clientData,
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  } else if (client_type == "3") {
    const query = `
 SELECT 
    clients.id AS client_id, 
    clients.client_type AS client_type, 
    clients.customer_id AS customer_id
     
FROM 
    clients 
WHERE 
    clients.id = ?
`;

    const [rows] = await pool.execute(query, [client_id]);
    if (rows.length > 0) {
      const clientData = {
        id: rows[0].client_id,
        client_type: rows[0].client_type,
        customer_id: rows[0].customer_id,
      };
      const result = {
        client: clientData,
      };

      return { status: true, message: "success.", data: result };
      // Return or further process `result` as needed
    } else {
      return { status: false, message: "No customer found with the given ID." };
    }
  } else {
    return { status: false, message: "No customer found with the given ID." };
  }
};

const deleteClient = async (client) => {
  const { client_id } = client;
  if (parseInt(client_id) > 0) {
    const currentDate = new Date();
    await SatffLogUpdateOperation(
      {
        staff_id: client.StaffUserId,
        ip: client.ip,
        date: currentDate.toISOString().split('T')[0],
        module_name: 'client',
        log_message: `deleted client profile. client code :`,
        permission_type: 'deleted',
        module_id: client_id,
      }
    );
  }

  try {
    await pool.execute("DELETE FROM clients WHERE id = ?", [client_id]);
    await pool.execute(
      "DELETE FROM client_company_information WHERE client_id = ?",
      [client_id]
    );
    await pool.execute(
      "DELETE FROM client_contact_details WHERE client_id = ?",
      [client_id]
    );
    await pool.execute("DELETE FROM client_documents WHERE client_id = ?", [
      client_id,
    ]);
    return { status: true, message: "Client deleted successfully." };
  } catch (err) {
    return { status: false, message: "Err Client Delete" };
  }
};

const clientUpdate = async (client) => {
  const {
    client_id,
    client_type,
    customer_id,
    client_industry_id,
    trading_name,
    trading_address,
    vat_registered,
    vat_number,
    website,
  } = client;

  let notes = client.notes == undefined ? "" : client.notes;


  const checkQuery = `SELECT 1 FROM clients WHERE trading_name = ? AND id != ?`;

  const [check] = await pool.execute(checkQuery, [trading_name, client_id]);
  if (check.length > 0) {
    return { status: false, message: "Client Trading Name Already Exists." };
  }

  let information_client = false


  let cli_type = 'sole trader'
  if (client_type === '2') {
    cli_type = 'company'
  } else if (client_type === '3') {
    cli_type = 'partnership'
  } else if (client_type === '4') {
    cli_type = 'individual'
  }

  if (client_type != "4") {
    try {
      const query = `
         UPDATE clients
         SET 
             client_type = ?,
             client_industry_id = ?,
             trading_name = ?,
             trading_address = ?,
             vat_registered = ?,
             vat_number = ?,
             website = ?,
             notes = ?
         WHERE
             id = ?
      `;
      const [result] = await pool.execute(query, [
        client_type,
        client_industry_id,
        trading_name,
        trading_address,
        vat_registered,
        vat_number,
        website,
        notes,
        client_id,
      ]);
      if (result.changedRows > 0) {
        information_client = true
      }
    } catch (err) {
      return { status: false, message: "client update Err" };
    }
  } else {
    try {
      const query = `
         UPDATE clients
         SET 
             client_type = ?,
             trading_name = ?,
             notes = ?
         
         WHERE
             id = ?
      `;
      const [result] = await pool.execute(query, [
        client_type,
        trading_name,
        notes,
        client_id
      ]);
      if (result.changedRows > 0) {
        information_client = true
      }
    } catch (err) {

      return { status: false, message: "client update Err" };
    }
  }

  if (client_type == "1") {
    const { first_name, last_name, phone, email, residential_address } = client;
    let phone_code = client.phone_code == undefined ? "" : client.phone_code;
    try {
      const query2 = `
                UPDATE client_contact_details 
                SET first_name = ?, last_name = ?, phone_code = ? ,phone = ?, email = ?, residential_address = ?
                WHERE client_id = ?
            `;
      const [result2] = await pool.execute(query2, [
        first_name,
        last_name,
        phone_code,
        phone,
        email,
        residential_address,
        client_id,
      ]);

      if (result2.changedRows > 0 && information_client == true) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} information and Officer information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );
      }
      else if (information_client == true) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );
      }
      else if (result2.changedRows > 0) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} Officer information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );

      }

    } catch (err) {
      console.log("err", err);
      return { status: false, message: "client update Err Client Type 1" };
    }
  }

  else if (client_type == "2") {

    let addedOfficer = false;
    let removeOfficer = false;
    let editOfficer = false;


    const {
      company_name,
      entity_type,
      company_status,
      company_number,
      registered_office_address,
      incorporation_date,
      incorporation_in,
      contactDetails,
    } = client;

    const [incorporation_date_s] = incorporation_date.split('T');

    try {
      const query1 = `
    UPDATE client_company_information
    SET company_name = ?, entity_type = ?, company_status = ?, company_number = ?, registered_office_address = ?, incorporation_date = ?, incorporation_in = ?
    WHERE client_id = ?
    `;
      const [result1] = await pool.execute(query1, [
        company_name,
        entity_type,
        company_status,
        company_number,
        registered_office_address,
        incorporation_date_s,
        incorporation_in,
        client_id,
      ]);
      if (result1.changedRows > 0) {
        information_client = true
      }

    } catch (err) {
      console.log("err", err);
      return { status: false, message: "client update Err Client Type 2" };
    }

    try {
      const [existIdResult] = await pool.execute(
        "SELECT id FROM client_contact_details WHERE client_id = ?",
        [client_id]
      );
      const idArray = await existIdResult.map((item) => item.id);
      let arrayInterId = [];

      const query2 = `
    UPDATE client_contact_details
    SET role = ?, first_name = ?, last_name = ?,phone_code = ? ,phone = ?, email = ?
    WHERE client_id = ? AND id = ?
    `;
      if (contactDetails.length > 0) {
        for (const detail of contactDetails) {
          let {
            first_name,
            last_name,
            phone,
            email,
            contact_id,
          } = detail; // Assuming each contactDetail has an id
          let phone_code =
            detail.phone_code == undefined || detail.phone_code == ""
              ? ""
              : detail.phone_code;

          let customer_contact_person_role_id = detail.customer_contact_person_role_id == null || detail.customer_contact_person_role_id == '' || detail.customer_contact_person_role_id == undefined ? 0 : detail.customer_contact_person_role_id

          if (
            contact_id == "" ||
            contact_id == undefined ||
            contact_id == null
          ) {
            const [result2] = await pool.execute(
              "INSERT INTO client_contact_details (client_id,role,first_name,last_name,phone,phone_code,email) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                client_id,
                customer_contact_person_role_id,
                first_name,
                last_name,
                phone_code,
                phone,
                email,
              ]
            );
            if (result2.changedRows > 0) {
              addedOfficer = true
            }
          } else {
            arrayInterId.push(contact_id);
            const [result2] = await pool.execute(query2, [
              customer_contact_person_role_id,
              first_name,
              last_name,
              phone_code,
              phone,
              email,
              client_id,
              contact_id,
            ]);
            if (result2.changedRows > 0) {
              editOfficer = true
            }
          }
        }

        let deleteIdArray = idArray.filter((id) => !arrayInterId.includes(id));
        if (deleteIdArray.length > 0) {
          removeOfficer = true
          for (const id of deleteIdArray) {
            const query3 = `
                    DELETE FROM client_contact_details WHERE id = ?
                    `;
            const [result3] = await pool.execute(query3, [id]);
          }
        }
      }

      let model_name = [];
      if (information_client == true) {
        model_name.push(`edited information`)
      }
      if (addedOfficer == true) {
        model_name.push('added additional Officer information')
      }
      if (editOfficer == true) {
        model_name.push('edited Officer information')
      }
      if (removeOfficer == true) {
        model_name.push('removed Officer information')
      }


      if (model_name.length > 0) {
        const msgLog = model_name.length > 1
          ? model_name.slice(0, -1).join(', ') + ' and ' + model_name.slice(-1)
          : model_name[0];

        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `${cli_type} ${msgLog}. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );

      }


    } catch (err) {
      console.log("err", err);
      return { status: false, message: "client update Err Client Type 2" };
    }
  }
  else if (client_type == "3") {
    const { contactDetails } = client;
    let addedOfficer = false;
    let removeOfficer = false;
    let editOfficer = false;
    try {
      const [existIdResult] = await pool.execute(
        "SELECT id FROM client_contact_details WHERE client_id = ?",
        [client_id]
      );
      const idArray = await existIdResult.map((item) => item.id);
      let arrayInterId = [];

      const query2 = `
    UPDATE client_contact_details
    SET role = ?, first_name = ?, last_name = ?, email = ?, alternate_email = ?, phone_code = ?,phone = ?, alternate_phone_code = ? ,alternate_phone = ?
    WHERE client_id = ? AND id = ?
    `;

      for (const detail of contactDetails) {
        let customer_contact_person_role_id = detail.customer_contact_person_role_id == null || detail.customer_contact_person_role_id == '' || detail.customer_contact_person_role_id == undefined ? 0 : detail.customer_contact_person_role_id

        let first_name = detail.first_name;
        let last_name = detail.last_name;
        let email = detail.email;
        let alternate_email = detail.alternate_email;
        let phone_code =
          detail.phone_code == undefined || detail.phone_code == ""
            ? ""
            : detail.phone_code;
        let phone = detail.phone;
        let alternate_phone_code =
          detail.alternate_phone_code == undefined ||
            detail.alternate_phone_code == ""
            ? ""
            : detail.alternate_phone_code;
        let alternate_phone = detail.alternate_phone;

        let contact_id = detail.contact_id; // Assuming each contactDetail has an id
        if (contact_id == "" || contact_id == undefined || contact_id == null) {
          const [result2] = await pool.execute(
            "INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
              client_id,
              customer_contact_person_role_id,
              first_name,
              last_name,
              email,
              alternate_email,
              phone_code,
              phone,
              alternate_phone_code,
              alternate_phone,

            ]
          );
          if (result2.changedRows > 0) {
            addedOfficer = true
          }
        } else {
          arrayInterId.push(contact_id);
          const [result2] = await pool.execute(query2, [
            customer_contact_person_role_id,
            first_name,
            last_name,
            email,
            alternate_email,
            phone_code,
            phone,
            alternate_phone_code,
            alternate_phone,
            client_id,
            contact_id,
          ]);
          if (result2.changedRows > 0) {
            editOfficer = true
          }
        }
      }

      let deleteIdArray = idArray.filter((id) => !arrayInterId.includes(id));
      if (deleteIdArray.length > 0) {
        for (const id of deleteIdArray) {
          removeOfficer = true
          const query3 = `
                        DELETE FROM client_contact_details WHERE id = ?
                        `;
          const [result3] = await pool.execute(query3, [id]);
        }
      }
      let model_name = [];
      if (information_client == true) {
        model_name.push(`edited ${cli_type} information`)
      }
      if (addedOfficer == true) {
        model_name.push(`added ${cli_type} additional Officer information`)
      }
      if (editOfficer == true) {
        model_name.push(`edited ${cli_type} Officer information`)
      }
      if (removeOfficer == true) {
        model_name.push(`removed ${cli_type} Officer information`)
      }

      if (model_name.length > 0) {
        const msgLog = model_name.length > 1
          ? model_name.slice(0, -1).join(', ') + ' and ' + model_name.slice(-1)
          : model_name[0];

        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `${msgLog}. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );

      }

    } catch (err) {
      console.log("err", err);
      return { status: false, message: "client update Err Client Type 3" };
    }
  }
  else if (client_type == "4") {
    const { first_name, last_name, phone, email, residential_address } = client;
    let phone_code = client.phone_code == undefined ? "" : client.phone_code;
    try {
      const query2 = `
                UPDATE client_contact_details 
                SET first_name = ?, last_name = ?, phone_code = ? ,phone = ?, email = ?, residential_address = ?
                WHERE client_id = ?
            `;
      const [result2] = await pool.execute(query2, [
        first_name,
        last_name,
        phone_code,
        phone,
        email,
        residential_address,
        client_id,
      ]);
      if (result2.changedRows > 0 && information_client == true) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} information and Officer information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );

      }
      else if (information_client == true) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );
      }
      else if (result2.changedRows > 0) {
        const currentDate = new Date();
        await SatffLogUpdateOperation(
          {
            staff_id: client.StaffUserId,
            ip: client.ip,
            date: currentDate.toISOString().split('T')[0],
            module_name: 'client',
            log_message: `edited ${cli_type} Officer information. client code :`,
            permission_type: 'updated',
            module_id: client_id,
          }
        );
      }
    } catch (err) {
      console.log("err", err);
      return { status: false, message: "client update Err Client Type 1" };
    }
  }

  return {
    status: true,
    message: "client updated successfully.",
    data: client_id,
  };
};

const addClientDocument = async (client) => {
  const { client_id, uploadedFiles , StaffUserId } = client;
  try {
    if (uploadedFiles && uploadedFiles.length > 0) {

      for (let file of uploadedFiles) {
          const file_name = file.filename;
          const original_name = file.originalname;
          const file_type = file.mimetype;
          const file_size = file.size;
          const web_url = file.web_url;
         
          const checkQuery = `SELECT id FROM client_documents WHERE client_id = ? AND original_name = ?`;
          const [rows] = await pool.execute(checkQuery, [client_id, original_name]);
          if (rows.length > 0) {
            continue;
          }
          
          const insertQuery = `
              INSERT INTO client_documents (
                  client_id, file_name, original_name, file_type, file_size , web_url
              ) VALUES (?, ?, ?, ?, ?, ?)
          `;

          try {
              const [result] = await pool.execute(insertQuery, [
                  client_id,
                  file_name,
                  original_name,
                  file_type,
                  file_size,
                  web_url
              ]);

          } catch (error) {
              console.log('Error inserting file:', error);
              return { status: false, message: "Error inserting file - 1" };
          }
      }
      return { status: true, message: "client document uploaded successfully.", data: client_id };
  }else{
      return { status: true, message: "client document uploaded successfully.", data: client_id };
  }
  } catch (error) {
    return { status: false, message: "Error inserting file - 2" };
  } 
}

const deleteClientFile = async (client) => {
  const {client_id, id, file_name } = client;
    const query = `
    DELETE FROM client_documents WHERE id = ?`;
    try {
        await pool.execute(query, [id]);
        deleteUploadFile(file_name)
        return { status: true, message: 'File deleted successfully.' };
    } catch (err) {
        return { status: false, message: 'Err file Delete' };
    }


};

module.exports = {
  createClient,
  getClient,
  getByidClient,
  getCustomerId,
  deleteClient,
  clientUpdate,
  addClientDocument,
  deleteClientFile
};
