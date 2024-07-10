const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const staffModel = require('../../models/staffsModel');
const { jwtSecret } = require('../../config/config');


const addStaff = async (staff) => {
  const { role_id, first_name, last_name, email, phone, password, status } = staff;
  const hashedPassword = await bcrypt.hash(password, 10);
  return staffModel.createStaff({ role_id, first_name, last_name, email, phone, status, password: hashedPassword });
};
const getStaff = async () => {
  return staffModel.getStaff();
}

const removeStaff = async (staffId) => {
  return staffModel.deleteStaff(staffId);
};



const modifyStaff = async (staff) => {
  const { id, password, ...otherFields } = staff;
  const fieldsToUpdate = { ...otherFields };
  if (password) {
      fieldsToUpdate.password = await bcrypt.hash(password, 10);
  }

  // console.log(fieldsToUpdate);
  // Pass the fields to be updated to the updateStaff function
  return staffModel.updateStaff({ id, ...fieldsToUpdate });
};

const staffCompetency = async (staffCompetency) => {
  return staffModel.staffCompetency(staffCompetency);
}


const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await staffModel.getStaffByEmail(email);
    console.log("user",user)
    if (!user) {
      throw new Error('Invalid email');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
  
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '10h' });
    const fieldsToUpdate = { login_auth_token: token };
    const id = user.id;
    staffModel.updateStaff({ id, ...fieldsToUpdate });
    return {token:token , staffDetails:user};
  };


const isLoginAuthTokenCheck = async (staff) => {
  return staffModel.isLoginAuthTokenCheckmodel(staff);
};



module.exports = {
    addStaff,
    getStaff,
    removeStaff,
    modifyStaff,
    staffCompetency,
    login,
    isLoginAuthTokenCheck
};