const pool = require("../config/database");
const {
  SatffLogUpdateOperation,
  generateNextUniqueCode,
  grantStaffAccess,
  QueryRoleHelperFunction,
} = require("../../app/utils/helper");
const { CustomerLogUpdateOperation } = require("../../app/utils/customerHelper");

const createClient = async (client) => {
  // client Code(cli_CUS_CLI_00001)
  let data = {
    table: "clients",
    field: "client_code",
  };
  let client_code = await generateNextUniqueCode(data);

  let client_id;
  const {
    client_type,
    customer_id,
    trading_address,
    vat_registered,
    vat_number,
    website,
    StaffUserId,
  } = client;

  let trading_name = client.trading_name;
  let notes = client.notes;

  const checkQuery = `SELECT 1 FROM clients WHERE trading_name = ? AND customer_id = ?`;

  const [check] = await pool.execute(checkQuery, [trading_name, customer_id]);
  if (check.length > 0) {
    return { status: false, message: "Client Trading Name Already Exists." };
  }

  let client_industry_id =
    client.client_industry_id == undefined || client.client_industry_id == ""
      ? 0
      : client.client_industry_id;

  if (client_type != "4") {
    if (client_type == "5") {
      let { service_address, charity_commission_number, company_number } =
        client;

      const query = `
      INSERT INTO clients (client_type,customer_id,staff_created_id,trading_name,client_code,trading_address,vat_registered,vat_number,website,notes,service_address,charity_commission_number,company_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          service_address,
          charity_commission_number,
          company_number,
        ]);
        client_id = result.insertId;
        const currentDate = new Date();
        await CustomerLogUpdateOperation({
          staff_id: client.StaffUserId,
          ip: client.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "client",
          log_message: `Created client profile. client code:`,
          permission_type: "Created",
          module_id: client_id,
        });
      } catch (err) {
        console.error("Error inserting data: - 5 ", err);
        throw err;
      }
    } else if (client_type == "6" || client_type == "7") {
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
        await CustomerLogUpdateOperation({
          staff_id: client.StaffUserId,
          ip: client.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "client",
          log_message: `Created client profile. client code:`,
          permission_type: "Created",
          module_id: client_id,
        });
      } catch (err) {
        console.error("Error inserting data: - 6, 7 ", err);
        throw err;
      }
    } else {
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
        await CustomerLogUpdateOperation({
          staff_id: client.StaffUserId,
          ip: client.ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "client",
          log_message: `Created client profile. client code:`,
          permission_type: "Created",
          module_id: client_id,
        });
      } catch (err) {
        console.error("Error inserting data: - 1, 2, 3 ", err);
        throw err;
      }
    }
  } else {
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
      await CustomerLogUpdateOperation({
        staff_id: client.StaffUserId,
        ip: client.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "client",
        log_message: `Created client profile. client code:`,
        permission_type: "Created",
        module_id: client_id,
      });
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
  } else if (client_type == "2") {
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
  } else if (client_type == "3") {
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
  } else if (client_type == "4") {
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
  } else if (client_type == "5") {
    const { member_details, trustee_details } = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if (member_details && member_details.length > 0) {
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
      if (trustee_details && trustee_details.length > 0) {
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
  } else if (client_type == "6") {
    const { member_details } = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if (member_details && member_details.length > 0) {
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
  } else if (client_type == "7") {
    const { beneficiaries_details, trustee_details } = client;
    // Member Details
    try {
      const query2 = `
        INSERT INTO client_contact_details (client_id,role,first_name,last_name,email,alternate_email,phone_code,phone,alternate_phone_code,alternate_phone,authorised_signatory_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
      if (beneficiaries_details && beneficiaries_details.length > 0) {
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
      if (trustee_details && trustee_details.length > 0) {
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

  const roleData = await QueryRoleHelperFunction(StaffUserId);
  if (roleData.length > 0 && roleData[0].role_id === 12) {
    await grantStaffAccess(StaffUserId, customer_id, "client", client_id);
  }

  return { status: true, message: "Client Added Successfully.", data: client_id };
};

module.exports = {
  createClient,
};
