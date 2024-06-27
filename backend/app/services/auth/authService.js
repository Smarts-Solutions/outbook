const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const staffModel = require('../../models/staffsModel');
const { jwtSecret } = require('../../config/config');


const addStaff = async (staff) => {
  const { role_id, first_name, last_name, email, phone, password, status } = staff;
  const hashedPassword = await bcrypt.hash(password, 10);
  return staffModel.createStaff({ role_id, first_name, last_name, email, phone, status, password: hashedPassword });
};

const removeStaff = async (staffId) => {
  return staffModel.deleteStaff(staffId);
};



const modifyStaff = async (staff) => {
  const { id, password, ...otherFields } = staff;
  const fieldsToUpdate = { ...otherFields };
  if (password) {
      fieldsToUpdate.password = await bcrypt.hash(password, 10);
  }
  // Pass the fields to be updated to the updateStaff function
  return staffModel.updateStaff({ id, ...fieldsToUpdate });
};


const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await staffModel.getStaffByEmail(email);
    if (!user) {
      throw new Error('Invalid email');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });
    return {token:token , staffDetails:user};
  };



module.exports = {
    addStaff,
    removeStaff,
    modifyStaff,
    login
};