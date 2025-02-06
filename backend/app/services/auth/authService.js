const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const staffModel = require("../../models/staffsModel");
const { jwtSecret } = require("../../config/config");
const { SatffLogUpdateOperation } = require("../../utils/helper");

const addStaff = async (staff) => {
  const {
    role_id,
    first_name,
    last_name,
    email,
    phone,
    phone_code,
    status,
    created_by,
    StaffUserId,
    ip,
  } = staff;
  let password = "abc@123456";
  const hashedPassword = await bcrypt.hash(password, 10);
  return staffModel.createStaff({
    role_id,
    first_name,
    last_name,
    email,
    phone,
    phone_code,
    status,
    password: hashedPassword,
    created_by,
    StaffUserId,
    ip,
  });
};

const getStaff = async () => {
  return staffModel.getStaff();
};

const managePortfolio = async (staff_id) => {
  return staffModel.managePortfolio(staff_id);
};

const getManagerStaff = async () => {
  return staffModel.getManagerStaff();
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

const staffCompetency = async (staffCompetency) => {
  return staffModel.staffCompetency(staffCompetency);
};

const profile = async (staff) => {
  return staffModel.profile(staff);
};

const login = async (credentials) => {
  const { email, password } = credentials;
  const user = await staffModel.getStaffByEmail(email);

  // console.log("user,",user);

  const sharepoint_token = await staffModel.sharepoint_token();

  //console.log("sharepoint_token",sharepoint_token);

  if (!user) {
    return { status: false, message: "Please enter a valid Email" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { status: false, message: "Please enter a valid password" };
  }

  if (user.status == "0") {
    return {
      status: false,
      message: "Your account has been deactivated. Please contact the admin.",
    };
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "10h" });
  const fieldsToUpdate = { login_auth_token: token };
  const id = user.id;
  staffModel.updateStaffwithLogin({ id, ...fieldsToUpdate });

  const currentDate = new Date();
  await SatffLogUpdateOperation({
    staff_id: id,
    date: currentDate.toISOString().split("T")[0],
    module_name: "-",
    log_message: ` Logged In`,
    permission_type: "-",
    ip: credentials.ip,
  });

  return {
    status: true,
    token: token,
    staffDetails: user,
    sharepoint_token: sharepoint_token,
  };
};

const loginWithAzure = async (credentials) => {
  const { email } = credentials;
  const user = await staffModel.getStaffByEmail(email);

  const sharepoint_token = await staffModel.sharepoint_token();

  if (!user) {
    return { status: false, message: "User not exist." };
  }

  if (user.status == "0") {
    return {
      status: false,
      message: "Your account has been deactivated. Please contact the admin.",
    };
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "10h" });
  const fieldsToUpdate = { login_auth_token: token };
  const id = user.id;
  staffModel.updateStaffwithLogin({ id, ...fieldsToUpdate });

  const currentDate = new Date();
  await SatffLogUpdateOperation({
    staff_id: id,
    date: currentDate.toISOString().split("T")[0],
    module_name: "-",
    log_message: ` Logged In With Microsoft`,
    permission_type: "-",
    ip: credentials.ip,
  });
  return {
    status: true,
    token: token,
    staffDetails: user,
    sharepoint_token: sharepoint_token,
  };
};

const isLogOut = async (credentials) => {
  const { id } = credentials;
  const currentDate = new Date();
  await SatffLogUpdateOperation({
    staff_id: id,
    date: currentDate.toISOString().split("T")[0],
    module_name: "-",
    log_message: ` Logged Out`,
    permission_type: "-",
    ip: credentials.ip,
  });
  return { status: true, message: "Success.." };
};

const status = async (id) => {
  return staffModel.status(id);
};

const getSharePointToken = async (staff) => {
  return staffModel.getSharePointToken(staff);
};

const isLoginAuthTokenCheck = async (staff) => {
  return staffModel.isLoginAuthTokenCheckmodel(staff);
};

const GetStaffPortfolio = async (staff) => {
  return staffModel.GetStaffPortfolio(staff);
}

const UpdateStaffPortfolio = async (staff) => {
  return staffModel.UpdateStaffPortfolio(staff);
}

const deleteStaff = async (staff) => {
  return staffModel.deleteStaffUpdateStaff(staff);
}


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
  isLoginAuthTokenCheck,
  isLogOut,
  managePortfolio,
  status,
  getSharePointToken,
  GetStaffPortfolio,
  UpdateStaffPortfolio,
  deleteStaff

};
