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
    { userId: customer.id, role: "CUSTOMER" },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  await pool.query(`UPDATE customer_users SET login_auth_token = ? WHERE id = ?`, [token, customer.id]);

  res.cookie("customer_token", token, {
    httpOnly: true,
    secure: false, // production me true
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  res.json({
    status: true,
    message: "Customer login successful",
    customer,
    token
  });
};

exports.customerUpdatePassword = async (req, res) => {
  const { customer_user_id, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE customer_users SET password = ?, is_first_login = 1 WHERE id = ?`, [hashedPassword, customer_user_id]);

    const [[customer]] = await pool.query(`SELECT * FROM customer_users WHERE id = ?`, [customer_user_id]);

    const token = jwt.sign(
      { userId: customer.id, role: "CUSTOMER" },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    await pool.query(`UPDATE customer_users SET login_auth_token = ? WHERE id = ?`, [token, customer_user_id]);

    res.cookie("customer_token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    res.json({
      status: true,
      message: "Password updated successfully",
      customer,
      token
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message
    });
  }
};
