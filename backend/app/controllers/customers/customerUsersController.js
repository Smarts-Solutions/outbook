const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");



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

      return res.status(200).json({ status: true, message: "Customer User added successfully." });

    }
    else if (action === 'deleteCustomerUsers') {
      const customer_user_id = customerUsers.customer_user_id;
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