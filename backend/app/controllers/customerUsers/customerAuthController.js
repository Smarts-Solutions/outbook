const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");
const { commonEmail } = require("../../utils/commonEmail");
const e = require('cors');
const jwt = require("jsonwebtoken");

exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;
  
  const [[customer]] = await pool.query(`SELECT * FROM customer_users WHERE email = ? `, [email]);

  if (!customer) {
    return res.json({ status: false, message: "Customer not found" });
  }
 
  const isPasswordValid = await bcrypt.compare(password, customer.password);
  if (!isPasswordValid) {
    return res.json({ status: false, message: "Please enter a valid password" });
  }

  if (Number(customer.is_first_login) === 0) {
    return res.json({
      status: true,
      step: "CHANGE_PASSWORD",
      customer_user_id: customer.id
    })
  }

  const token = jwt.sign(
    { id: customer.id, role: "CUSTOMER" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.cookie("customer_token", token, {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: "Customer login successful",
    customer
  });
};

