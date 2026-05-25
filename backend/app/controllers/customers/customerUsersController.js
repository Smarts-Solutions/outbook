const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");
const { commonEmail } = require("../../utils/commonEmail");
const e = require('cors');
const jwt = require("jsonwebtoken");
const { SatffLogUpdateOperation } = require('../../utils/helper');



const getAllCustomerUsers = async (req, res) => {





  try {
    const { ...customerUsers } = req.body;
    // get data customer users table based on action direct pool used here
    const action = customerUsers.action;
    let result;

    try { await pool.execute(`ALTER TABLE customer_access ADD COLUMN client_id TEXT`); } catch (e) { }
    try { await pool.execute(`ALTER TABLE customer_access MODIFY COLUMN job_id TEXT`); } catch (e) { }

    if (action === 'getCustomerUsers') {
      const page = customerUsers.page || 1;
      const limit = customerUsers.limit || 10;
      const search = customerUsers.search || '';
      const offset = (page - 1) * limit;
      let query = `SELECT 
          staffs.id,
          staffs.first_name,
          staffs.last_name,
          staffs.email,
          staffs.phone,
          staffs.phone_code,
          customer_contact_person_role.name AS role_name,
          customer_contact_person_role.id AS customer_contact_person_role_id,
          staffs.status,
          staffs.created_at,
          GROUP_CONCAT(DISTINCT NULLIF(customer_access.customer_id, '')) AS allCustomerAccess,
          GROUP_CONCAT(DISTINCT NULLIF(customer_access.client_id, '')) AS selectedClients,
          GROUP_CONCAT(DISTINCT NULLIF(customer_access.job_id, '')) AS selectedJobs
          FROM staffs 
          LEFT JOIN customer_contact_person_role ON customer_contact_person_role.id = staffs.customer_contact_person_role_id
          LEFT JOIN customer_access ON customer_access.staff_id = staffs.id
          WHERE staffs.role_id = 12
          `;

      if (search) {
        query += ` AND (staffs.first_name LIKE ? OR staffs.email LIKE ? )`;
      }
      query += ` GROUP BY staffs.id LIMIT ? OFFSET ?`;

      const queryParams = [];
      if (search) {
        const searchParam = `%${search}%`;
        queryParams.push(searchParam, searchParam);
      }
      queryParams.push(parseInt(limit), parseInt(offset));

      // console.log("Executing Query:", query);
      // console.log("With Parameters:", queryParams);
      const [rows] = await pool.execute(query, queryParams);

      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) as total FROM staffs WHERE role_id = 12`;
      const countParams = [];
      if (search) {
        countQuery += ` AND (first_name LIKE ? OR email LIKE ? )`;

        const searchParam = `%${search}%`;
        countParams.push(searchParam, searchParam);
      }
      const [countRows] = await pool.execute(countQuery, countParams);
      const totalRecords = countRows[0].total;
      result = { data: rows, totalRecords };
      return res.status(200).json({ status: true, message: "Success..", data: result });
    }
    else if (action === 'addCustomerUsers') {
console.log("customerUsers--",customerUsers)

      let customer_contact_person_role_id = customerUsers.customer_contact_person_role_id || 1;
      let first_name = customerUsers.first_name;
      let last_name = customerUsers.last_name;
      let email = customerUsers.email;
      let phone = customerUsers.phone;
      let phone_code = customerUsers.phone_code;
      let role_id = customerUsers.role_id;
      let status = customerUsers.status;
      let allCustomerAccess = customerUsers.allCustomerAccess; // array of customer IDs
      let selectedClients = customerUsers.selectedClients || []; // array of client IDs
      let selectedJobs = customerUsers.selectedJobs; // array of job IDs
      let ip = customerUsers.ip;
      let StaffUserId = customerUsers.StaffUserId;
      let password = "abc@123456";
      const hashedPassword = await bcrypt.hash(password, 10);
      let created_by = customerUsers.created_by;

      // Call the service function to add customer user
      const checkQuery = `SELECT id FROM staffs WHERE email = ?`;
      const [checkRows] = await pool.execute(checkQuery, [email]);
      if (checkRows.length > 0) {
        return res.status(400).json({ status: false, message: "Email already exists." });
      }
      // insert customer user
      const insertQuery = `INSERT INTO staffs 
        (role_id, customer_contact_person_role_id, first_name, last_name, email, phone, phone_code, status, password,created_by, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
      const [insertResult] = await pool.execute(insertQuery,
        [12, customer_contact_person_role_id, first_name, last_name, email, phone, phone_code, status, hashedPassword, created_by]);
      const newCustomerUserId = insertResult.insertId;

      // insert into customer_access table
      if (allCustomerAccess && allCustomerAccess.length > 0) {
        const accessInsertQuery = `INSERT INTO customer_access (staff_id, customer_id, client_id, job_id) VALUES (?, ?, ?, ?)`;
        for (const customerId of allCustomerAccess) {
          // Filter selected clients for this customer
          let custClients = [];
          if (selectedClients && selectedClients.length > 0) {
            const [clientRows] = await pool.execute(`SELECT id FROM clients WHERE id IN (${selectedClients.join(',')}) AND customer_id = ?`, [customerId]);
            custClients = clientRows.map(r => r.id);
          }

          // Filter selected jobs for this customer
          let custJobs = [];
          if (selectedJobs && selectedJobs.length > 0) {
            const [jobRows] = await pool.execute(`SELECT id FROM jobs WHERE id IN (${selectedJobs.join(',')}) AND customer_id = ?`, [customerId]);
            custJobs = jobRows.map(r => r.id);
          }

          await pool.execute(accessInsertQuery, [newCustomerUserId, customerId, custClients.join(','), custJobs.join(',')]);
        }
      }




      const token = jwt.sign({ uid: newCustomerUserId }, "ABC-D", { expiresIn: "7d" });

      let loginUrl = `${req.protocol}://${req.get("host")}`;
      if (loginUrl.includes("localhost")) {
        loginUrl = `http://localhost:3001/#/customer/login?token=${token}`;
      } else {
        loginUrl = loginUrl + `/#/customer/login?token=${token}`;
      }

      // verify on backend
      // const decoded = jwt.verify(token, "ABC-D");
      // const userId = decoded.uid;


      let subject = "Customer Login Details";
      let html = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Account Created</title>
</head>

<body style="margin:0; padding:20px 0; background:#eef2f7; font-family:Segoe UI, Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">

        <table width="500" cellpadding="0" cellspacing="0"
          style="background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 6px 24px rgba(0,0,0,0.08);">

          <tr>
            <td align="center"
              style="background:linear-gradient(135deg,#00afef,#008acb); padding:28px 30px;">


              <h1 style="margin:0; color:#fff; font-size:24px; font-weight:700;">
                Account Created
              </h1>

              <p style="margin:8px 0 0; color:rgba(255,255,255,0.85);
                font-size:14px; line-height:22px;">
               You have been invited to the Outbooks Job Portal.<br/>
                Please use the credentials below to log in to your account.
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:28px 30px;">



<table width="100%" cellpadding="0" cellspacing="0"
  style="margin-top:22px;">

  <tr>
    <td style="padding-bottom:14px;">

      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#f9fbff;
        border:1px solid #e2e8f0;
        border-radius:10px;
        padding:14px 18px;">

        <tr>

          <td width="90"
            style="font-size:13px;
            font-weight:700;
            color:#64748b;
            text-transform:uppercase;
            letter-spacing:0.8px;">

            Email

          </td>

          <td width="20"
            style="text-align:center;
            color:#cbd5e1;
            font-size:18px;
            font-weight:300;">

            |

          </td>

          <td style="font-size:14px;
            color:#111827;
            font-weight:500;
            word-break:break-word;">

            ${email}

          </td>

        </tr>

      </table>

    </td>
  </tr>

  <tr>
    <td>

      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#f9fbff;
        border:1px solid #e2e8f0;
        border-radius:10px;
        padding:14px 18px;">

        <tr>

          <td width="90"
            style="font-size:13px;
            font-weight:700;
            color:#64748b;
            text-transform:uppercase;
            letter-spacing:0.8px;">

            Password

          </td>

          <td width="20"
            style="text-align:center;
            color:#cbd5e1;
            font-size:18px;
            font-weight:300;">

            |

          </td>

          <td>

            <span style="display:inline-block;
              background:#e0f2fe;
              color:#0f172a;
              padding:7px 14px;
              border-radius:6px;
              font-size:14px;
              font-family:monospace;
              font-weight:600;">

              ${password}

            </span>

          </td>

        </tr>

      </table>

    </td>
  </tr>

</table>




<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
  <tr>
    <td align="center">

      <a href="${loginUrl}"
        style="display:block;
        width:100%;
        box-sizing:border-box;
        text-align:center;
        background:linear-gradient(135deg,#00afef,#008acb);
        color:#ffffff;
        text-decoration:none;
        padding:14px 20px;
        border-radius:10px;
        font-size:15px;
        font-weight:600;
        box-shadow:0 4px 12px rgba(0,175,239,0.25);">

        Login to Account →

      </a>

    </td>
  </tr>
</table>

              <div style="margin-top:22px;
                background:#fff7e6;
                border-left:4px solid #f4b400;
                padding:12px 14px;
                border-radius:6px;
                font-size:13px;
                line-height:20px;
                color:#6b4f1d;">

                🔒 <strong>Security Tip:</strong>
                Please change your password after your first login.

              </div>

            </td>
          </tr>

          <tr>
            <td align="center"
              style="padding:18px 25px;
              background:#f9fbfd;
              border-top:1px solid #e6edf5;">

              <p style="margin:0;
                font-size:12px;
                line-height:18px;
                color:#8b98a9;">

               If you did not create this account, please ignore this email or contact Outbooks Support.

              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>

`;
      const result = await commonEmail(email, subject, html);

      console.log("ffff", result);

      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: StaffUserId,
        ip: ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "staff",
        log_message: `created customer user profile for ${first_name} ${last_name}.`,
        permission_type: "created",
        module_id: newCustomerUserId,
      });

      return res.status(200).json({ status: true, message: "Customer User added successfully." });

    }
    else if (action === 'deleteCustomerUsers') {
      const customer_user_id = customerUsers.customer_user_id;
      const replace_id = customerUsers.replace_id;

      if (replace_id) {
        // Transfer logic
        const [accessRecords] = await pool.execute(`SELECT * FROM customer_access WHERE staff_id = ?`, [customer_user_id]);

        for (const record of accessRecords) {
          const { customer_id, client_id, job_id } = record;

          // Check if replacement user already has access to this customer
          const [existingAccess] = await pool.execute(
            `SELECT id, client_id, job_id FROM customer_access WHERE staff_id = ? AND customer_id = ?`,
            [replace_id, customer_id]
          );

          if (existingAccess.length > 0) {
            // Merge assignments
            let mergedClients = Array.from(new Set([
              ...(existingAccess[0].client_id ? existingAccess[0].client_id.split(',') : []),
              ...(client_id ? client_id.split(',') : [])
            ])).filter(x => x).join(',');

            let mergedJobs = Array.from(new Set([
              ...(existingAccess[0].job_id ? existingAccess[0].job_id.split(',') : []),
              ...(job_id ? job_id.split(',') : [])
            ])).filter(x => x).join(',');

            await pool.execute(
              `UPDATE customer_access SET client_id = ?, job_id = ? WHERE id = ?`,
              [mergedClients, mergedJobs, existingAccess[0].id]
            );
          } else {
            // Simply transfer the record
            await pool.execute(
              `UPDATE customer_access SET staff_id = ? WHERE id = ?`,
              [replace_id, record.id]
            );
          }
        }
      }

      const deleteQueryCustomerAccess = `DELETE FROM customer_access WHERE staff_id = ?`;
      await pool.execute(deleteQueryCustomerAccess, [customer_user_id]);

      const deleteQuery = `DELETE FROM staffs WHERE id = ?`;
      await pool.execute(deleteQuery, [customer_user_id]);
      const currentDate = new Date();
      await SatffLogUpdateOperation({
        staff_id: customerUsers.StaffUserId,
        ip: customerUsers.ip,
        date: currentDate.toISOString().split("T")[0],
        module_name: "staff",
        log_message: `deleted customer user profile.`,
        permission_type: "deleted",
        module_id: customer_user_id,
      });

      return res.status(200).json({ status: true, message: "Customer User deleted and assignments transferred successfully." });
    }
    else if (action === 'updateCustomerUsers') {
      const customer_user_id = customerUsers.customer_user_id;
      let customer_contact_person_role_id = customerUsers.customer_contact_person_role_id || 1;
      let first_name = customerUsers.first_name;
      let last_name = customerUsers.last_name;
      let email = customerUsers.email;
      let phone = customerUsers.phone;
      let phone_code = customerUsers.phone_code;
      let status = customerUsers.status;
      let allCustomerAccess = customerUsers.allCustomerAccess; // array of customer IDs
      let selectedClients = customerUsers.selectedClients || []; // array of client IDs
      let selectedJobs = customerUsers.selectedJobs; // array of job IDs
      let ip = customerUsers.ip;



      // check if email already exists for other user
      const checkQuery = `SELECT id FROM staffs WHERE email = ? AND id != ?`;
      const [checkRows] = await pool.execute(checkQuery, [email, customer_user_id]);
      if (checkRows.length > 0) {
        return res.status(400).json({ status: false, message: "Email already exists for another user." });
      }
      // update customer user

      try {


        const updateQuery = `UPDATE staffs SET 
        customer_contact_person_role_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, phone_code = ?, status = ? 
        WHERE id = ?`;
        await pool.execute(updateQuery,
          [customer_contact_person_role_id, first_name, last_name, email, phone, phone_code, status, customer_user_id]);
        // update customer_access table
        const deleteAccessQuery = `DELETE FROM customer_access WHERE staff_id = ?`;
        await pool.execute(deleteAccessQuery, [customer_user_id]);

        if (allCustomerAccess && allCustomerAccess.length > 0) {
          const accessInsertQuery = `INSERT INTO customer_access (staff_id, customer_id, client_id, job_id) VALUES (?, ?, ?, ?)`;
          for (const customerId of allCustomerAccess) {
            // Filter selected clients for this customer
            let custClients = [];
            if (selectedClients && selectedClients.length > 0) {
              const [clientRows] = await pool.execute(`SELECT id FROM clients WHERE id IN (${selectedClients.join(',')}) AND customer_id = ?`, [customerId]);
              custClients = clientRows.map(r => r.id);
            }

            // Filter selected jobs for this customer
            let custJobs = [];
            if (selectedJobs && selectedJobs.length > 0) {
              const [jobRows] = await pool.execute(`SELECT id FROM jobs WHERE id IN (${selectedJobs.join(',')}) AND customer_id = ?`, [customerId]);
              custJobs = jobRows.map(r => r.id);
            }

            await pool.execute(accessInsertQuery, [customer_user_id, customerId, custClients.join(','), custJobs.join(',')]);
          }
        }

        const currentDate = new Date();
        await SatffLogUpdateOperation({
          staff_id: customerUsers.StaffUserId,
          ip: ip,
          date: currentDate.toISOString().split("T")[0],
          module_name: "staff",
          log_message: `updated customer user profile for ${first_name} ${last_name}.`,
          permission_type: "updated",
          module_id: customer_user_id,
        });

        return res.status(200).json({ status: true, message: "Customer User updated successfully." });

      } catch (error) {
        console.log("error", error)

      }
    }
    else {
      return res.status(400).json({ status: false, message: "Invalid action parameter." });
    }

  } catch (error) {
    console.error("Error in getAllCustomerUsers:", error); 
    res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = {
  getAllCustomerUsers
};