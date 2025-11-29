const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');



const getAllCustomerUsers = async (req, res) => {
  try {
    console.log("Inside getAllCustomerUsers Controller");
     const { ...customerUsers } = req.body;

     console.log("Request Body in customerUsers:", customerUsers);

     // get data customer users table based on action direct pool used here
      const action = customerUsers.action;
      let result;

      if(action === 'getCustomerUsers'){
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
          customer_users.status,
          customer_users.created_at
          FROM customer_users 
          LEFT JOIN customer_contact_person_role ON customer_contact_person_role.id = customer_users.customer_contact_person_role_id
          WHERE 1=1`;

        if(search){
          query += ` AND (customer_users.first_name LIKE ? OR customer_users.email LIKE ? )`;
        }
        query += ` LIMIT ? OFFSET ?`;

        const queryParams = [];
        if(search){
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
        if(search){
          countQuery += ` AND (first_name LIKE ? OR email LIKE ? )`;

          const searchParam = `%${search}%`;
          countParams.push(searchParam, searchParam);
        }
        const [countRows] = await pool.execute(countQuery, countParams);
        const totalRecords = countRows[0].total;
        result = { data: rows, totalRecords };
        return res.status(200).json({ status:true,message: "Success..",data : result});
      } else {
        return res.status(400).json({ status:false, message: "Invalid action parameter."});
      }

    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}





module.exports = {
 getAllCustomerUsers
};