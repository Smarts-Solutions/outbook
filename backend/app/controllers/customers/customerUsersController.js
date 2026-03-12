const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");
const { commonEmail } = require("../../utils/commonEmail");
const e = require('cors');
const jwt = require("jsonwebtoken");



const getAllCustomerUsers = async (req, res) => {





  try {
    console.log("Inside getAllCustomerUsers Controller");
    const { ...customerUsers } = req.body;

    console.log("Request Body in customerUsers:", customerUsers);

    // get data customer users table based on action direct pool used here
    const action = customerUsers.action;
    let result;

    if (action === 'getCustomerUsers') {
      const staff_id = customerUsers.staff_id;
      const page = customerUsers.page || 1;
      const limit = customerUsers.limit || 10;
      const search = customerUsers.search || '';
      const offset = (page - 1) * limit;
      let query = `SELECT 
          customer_users.id,
          customer_users.first_name,
          customer_users.last_name,
          customer_users.email,
          customer_users.phone,
          customer_users.phone_code,
          customer_contact_person_role.name AS role_name,
          customer_contact_person_role.id AS customer_contact_person_role_id,
          customer_users.status,
          customer_users.created_at,
          GROUP_CONCAT(customer_access.customer_id) AS allCustomerAccess
          FROM customer_users 
          LEFT JOIN customer_contact_person_role ON customer_contact_person_role.id = customer_users.customer_contact_person_role_id
          LEFT JOIN customer_access ON customer_access.customer_user_id = customer_users.id
          WHERE 1=1
          GROUP BY customer_users.id
          `;

      if (search) {
        query += ` AND (customer_users.first_name LIKE ? OR customer_users.email LIKE ? )`;
      }
      query += ` LIMIT ? OFFSET ?`;

      const queryParams = [];
      if (search) {
        const searchParam = `%${search}%`;
        queryParams.push(searchParam, searchParam);
      }
      queryParams.push(parseInt(limit), parseInt(offset));

      console.log("Executing Query:", query);
      console.log("With Parameters:", queryParams);
      const [rows] = await pool.execute(query, queryParams);

      // Get total count for pagination
      let countQuery = `SELECT COUNT(*) as total FROM customer_users WHERE 1=1`;
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

      let customer_contact_person_role_id = customerUsers.customer_contact_person_role_id || 1;
      let first_name = customerUsers.first_name;
      let last_name = customerUsers.last_name;
      let email = customerUsers.email;
      let phone = customerUsers.phone;
      let phone_code = customerUsers.phone_code;
      let role_id = customerUsers.role_id;
      let status = customerUsers.status;
      let allCustomerAccess = customerUsers.allCustomerAccess; // array of customer IDs
      let ip = customerUsers.ip;
      let StaffUserId = customerUsers.StaffUserId;
      let password = "abc@123456";
      const hashedPassword = await bcrypt.hash(password, 10);

      // Call the service function to add customer user
      const checkQuery = `SELECT id FROM customer_users WHERE email = ?`;
      const [checkRows] = await pool.execute(checkQuery, [email]);
      if (checkRows.length > 0) {
        return res.status(400).json({ status: false, message: "Email already exists." });
      }
      // insert customer user
      const insertQuery = `INSERT INTO customer_users 
        (customer_contact_person_role_id,first_name, last_name, email, phone, phone_code, status, password,staff_id, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
      const [insertResult] = await pool.execute(insertQuery,
        [customer_contact_person_role_id, first_name, last_name, email, phone, phone_code, status, hashedPassword, StaffUserId]);
      const newCustomerUserId = insertResult.insertId;

      // insert into customer_user_access table
      if (allCustomerAccess && allCustomerAccess.length > 0) {
        const accessInsertQuery = `INSERT INTO customer_access (customer_user_id, customer_id) VALUES (?, ?)`;
        for (const customerId of allCustomerAccess) {
          await pool.execute(accessInsertQuery, [newCustomerUserId, customerId]);
        }
      }
       
      // Encoding Method
      // const encodedUid = Buffer.from(String(newCustomerUserId)).toString("base64");
      // React get code
      // const params = new URLSearchParams(location.search);
      // const uid = params.get("uid");
      // const userId = atob(uid);
      // let loginUrl = `${req.protocol}://${req.get("host")}`;
      // if (loginUrl.includes("localhost")) {
      //   loginUrl = `http://localhost:3001/#/customer/login?uid=${encodedUid}`;
      // } else {
      //   loginUrl = loginUrl + `/#/customer/login?uid=${encodedUid}`;
      // }


       // Secure Method

      const token = jwt.sign({ uid: newCustomerUserId },"ABC-D",{ expiresIn: "7d" });

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
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family:'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: #00afef; padding: 36px 40px; text-align:center;">
              <div style="width:56px; height:56px; background:rgba(255,255,255,0.2); border-radius:50%; margin: 0 auto 16px; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:28px;">✓</span>
              </div>
              <h1 style="color:#ffffff; margin:0; font-size:22px; font-weight:700; letter-spacing:0.3px;">Account Successfully Created</h1>
              <p style="color:rgba(255,255,255,0.8); margin:8px 0 0; font-size:14px;">Welcome aboard! Here are your login credentials.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 40px;">
              
              <!-- Credentials Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8faff; border:1px solid #e3eaf7; border-radius:8px; overflow:hidden;">
                
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf7;">
                    <span style="font-size:11px; font-weight:600; color:#6b7a99; text-transform:uppercase; letter-spacing:0.8px;">User ID</span><br/>
                    <span style="font-size:15px; color:#1a1a2e; font-weight:500; margin-top:4px; display:block;">${email}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #e3eaf7;">
                    <span style="font-size:11px; font-weight:600; color:#6b7a99; text-transform:uppercase; letter-spacing:0.8px;">Password</span><br/>
                    <span style="font-size:15px; color:#1a1a2e; font-weight:500; margin-top:4px; display:block; font-family: monospace; background:#eef2ff; padding:4px 10px; border-radius:4px; display:inline-block;">${password}</span>
                  </td>
                </tr>

                <!--<tr>
                  <td style="padding: 16px 20px;">
                    <span style="font-size:11px; font-weight:600; color:#6b7a99; text-transform:uppercase; letter-spacing:0.8px;">Login URL</span><br/>
                    <a href="${loginUrl}" style="font-size:14px; color:#1a73e8; margin-top:4px; display:block; text-decoration:none; word-break:break-all;">${loginUrl}</a>
                  </td>
                </tr> -->

              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display:inline-block; background: #00afef; color:#ffffff; text-decoration:none; padding:13px 36px; border-radius:8px; font-size:15px; font-weight:600; letter-spacing:0.3px;">Login to Your Account →</a>
                  </td>
                </tr>
              </table>

              <!-- Warning -->
              <p style="margin-top:24px; padding:12px 16px; background:#fff8e1; border-left:3px solid #f9a825; border-radius:4px; font-size:13px; color:#795548; line-height:1.5;">
                🔒 <strong>Security Tip:</strong> Please change your password after your first login for better security.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8faff; border-top:1px solid #e3eaf7; padding:20px 40px; text-align:center;">
              <p style="margin:0; font-size:12px; color:#a0aec0;">If you didn't create this account, please ignore this email or contact support.</p>
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

      return res.status(200).json({ status: true, message: "Customer User added successfully." });

    }
    else if (action === 'deleteCustomerUsers') {
      const customer_user_id = customerUsers.customer_user_id;
      // delete customer user customer_access

      const deleteQueryCustomerAccess = `DELETE FROM customer_access WHERE customer_user_id = ?`;
      await pool.execute(deleteQueryCustomerAccess, [customer_user_id]);

      const deleteQuery = `DELETE FROM customer_users WHERE id = ?`;
      await pool.execute(deleteQuery, [customer_user_id]);
      return res.status(200).json({ status: true, message: "Customer User deleted successfully." });
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
      let ip = customerUsers.ip;
      let StaffUserId = customerUsers.StaffUserId;



      // check if email already exists for other user
      const checkQuery = `SELECT id FROM customer_users WHERE email = ? AND id != ?`;
      const [checkRows] = await pool.execute(checkQuery, [email, customer_user_id]);
      if (checkRows.length > 0) {
        return res.status(400).json({ status: false, message: "Email already exists for another user." });
      }
      // update customer user

      try {


        const updateQuery = `UPDATE customer_users SET 
        customer_contact_person_role_id = ?, first_name = ?, last_name = ?, email = ?, phone = ?, phone_code = ?, status = ?, staff_id = ? 
        WHERE id = ?`;
        await pool.execute(updateQuery,
          [customer_contact_person_role_id, first_name, last_name, email, phone, phone_code, status, StaffUserId, customer_user_id]);
        // update customer_user_access table
        const deleteAccessQuery = `DELETE FROM customer_access WHERE customer_user_id = ?`;
        await pool.execute(deleteAccessQuery, [customer_user_id]);
        if (allCustomerAccess && allCustomerAccess.length > 0) {
          const accessInsertQuery = `INSERT INTO customer_access (customer_user_id, customer_id) VALUES (?, ?)`;
          for (const customerId of allCustomerAccess) {
            await pool.execute(accessInsertQuery, [customer_user_id, customerId]);
          }
        }

        return res.status(200).json({ status: true, message: "Customer User updated successfully." });

      } catch (error) {
        console.log("error", error)

      }
    }
    else {
      return res.status(400).json({ status: false, message: "Invalid action parameter." });
    }

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = {
  getAllCustomerUsers
};