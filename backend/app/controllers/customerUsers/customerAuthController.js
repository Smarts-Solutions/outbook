const customerService = require('../../services/customers/customerService');
const pool = require('../../config/database');
const bcrypt = require("bcryptjs");
const { commonEmail } = require("../../utils/commonEmail");
const e = require('cors');
const jwt = require("jsonwebtoken");

exports.customerLogin = async (req, res) => {
  const { email, password } = req.body;

  const customer = await Customer.findOne({ where: { email } });

  if (!customer) {
    return res.status(400).json({ message: "Invalid credentials" });
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

