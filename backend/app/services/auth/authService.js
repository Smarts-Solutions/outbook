const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const staffModel = require('../../models/staffsModel');
const { jwtSecret } = require('../../config/config');


const addStaff = async (staff) => {
  const { role_id, first_name, last_name, email, phone, password, status ,created_by } = staff;
  const hashedPassword = await bcrypt.hash(password, 10);
  return staffModel.createStaff({ role_id, first_name, last_name, email, phone, status, password: hashedPassword ,created_by});
};
const getStaff = async () => {
  return staffModel.getStaff();
}

const getManagerStaff = async () => {
  return staffModel.getManagerStaff();
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

  // Pass the fields to be updated to the updateStaff function
  return staffModel.updateStaff({ id, ...fieldsToUpdate });
};

const staffCompetency = async (staffCompetency) => {
  return staffModel.staffCompetency(staffCompetency);
}

const profile = async (staff) => {
  return staffModel.profile(staff);
}


const login = async (credentials) => {
    const { email, password } = credentials;
    const user = await staffModel.getStaffByEmail(email);

    if (!user) {
      return {status:false,message:"Please enter a valid Email"}
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {status:false,message:"Please enter a valid password"}
    }

    if (user.status == '0') {
      return {status:false,message:"Your account has been deactivated. Please contact the admin."}
    }
  
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '10h' });
    const fieldsToUpdate = { login_auth_token: token };
    const id = user.id;
    staffModel.updateStaff({ id, ...fieldsToUpdate });
    return {status:true,token:token , staffDetails:user};
  };

  const loginWithAzure = async (credentials) => {
    const { email } = credentials;
    const user = await staffModel.getStaffByEmail(email);
   
    if (!user) {
      return {status:false,message:"User not exist."}
    }

    if (user.status == '0') {
      return {status:false,message:"Your account has been deactivated. Please contact the admin."}
    }
    
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '10h' });
    const fieldsToUpdate = { login_auth_token: token };
    const id = user.id;
    staffModel.updateStaff({ id, ...fieldsToUpdate });
    return {status:true, token:token , staffDetails:user};
  };




const isLoginAuthTokenCheck = async (staff) => {
  return staffModel.isLoginAuthTokenCheckmodel(staff);
};



module.exports = {
    addStaff,
    getStaff,
    getManagerStaff,
    removeStaff,
    modifyStaff,
    staffCompetency,
    login,
    isLoginAuthTokenCheck,
    profile,
    loginWithAzure,
    isLoginAuthTokenCheck
};