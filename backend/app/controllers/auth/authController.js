const authService = require("../../services/auth/authService");
const pool = require("../../config/database");
const staffModel = require("../../models/staffsModel");

const handleStaff = async (req, res) => {
  const { action, ...staff } = req.body;
  try {
    let result;
    switch (action) {
      case "add":
        result = await authService.addStaff(staff);
        if (!result.status) {
          return res
            .status(200)
            .json({ status: false, message: result.message });
        } else {
          return res
            .status(200)
            .json({ status: true, message: result.message, data: result.data });
        }

      case "get":
        result = await authService.getStaff(req.body);
        res.status(200).json({ status: true, data: result });
        break;

      case "getnew":
        result = await authService.getStaffNew(req.body);
        res.status(200).json({ status: true, data: result });
        break;

      case "getstaffbyfilter":
        result = await authService.getStaffByFilter(req.body);
        res.status(200).json({ status: true, data: result });
        break;
        
      case "getmanager":
        result = await authService.getManagerStaff();
        res.status(200).json({ status: true, data: result });
        break;
      case "delete":
        await authService.removeStaff(staff.id);
        res
          .status(200)
          .json({ status: true, message: "Staff deleted successfully" });
        break;
      case "update":
        result = await authService.modifyStaff(staff);
        if (!result.status) {
          res.status(200).json({ status: false, message: result.message });
          break;
        } else {
          res.status(200).json({
            status: true,
            message: result.message,
            userId: result.data,
          });
          break;
        }
      case "portfolio":
        result = await authService.managePortfolio(staff);
        res.status(200).json({
          status: true,
          message: "All Customer get successfully",
          data: result,
        });
        break;
      case "get_line_manager":
        result = await authService.getLineManagerStaff(staff);
        res.status(200).json({ status: true, data: result });
        break;
      case "get_active_line_managers":
        result = await authService.getActiveLineManagers();
        res.status(200).json(result);
        break;
      case "get_my_line_managers":
        result = await authService.getMyLineManagers(staff);
        res.status(200).json({ status: true, data: result });
        break;
      default:
        res.status(400).json({ status: false, message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const staffCompetency = async (req, res) => {
  try {
    const { ...staffCompetency } = req.body;
    const data = await authService.staffCompetency(staffCompetency);

    if (data != undefined) {
      return res.send({ status: true, message: "Success", data: data });
    } else {
      return res.send({
        status: true,
        message: "Competency updated successfully",
      });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    // delete the password property from the data object
    if (data.status == true) {
      // delete the password property from the data object
      delete data.password;
      return res
        .status(200)
        .json({ status: true, data: data, message: "Login Successfully.." });
    } else {
      return res.status(200).json({ status: false, message: data.message });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const loginWithAzure = async (req, res) => {
  try {
    const data = await authService.loginWithAzure(req.body);
    if (data.status == true) {
      // delete the password property from the data object
      delete data.password;
      return res
        .status(200)
        .json({ status: true, data: data, message: "Login Successfully.." });
    } else {
      return res.status(200).json({ status: false, message: data.message });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const loginAuthToken = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.modifyStaff(staff);
    return res.send({ status: true, message: "Success.." });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const isLoginAuthTokenCheck = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.isLoginAuthTokenCheck(staff);
    if (data != undefined) {
      if (staff.email) {
        const user = await staffModel.getStaffByEmail(staff.email);
        const other_role = await staffModel.getStaffOtherRole(staff.email);
        let other_role_id = null;
        if (other_role && other_role.length > 0) {
          other_role_id = { other_role_id: other_role[0].other_role_id, role_name: other_role[0].role_name };
        }
        return res.send({ status: true, message: "success..", user: user, other_role_id: other_role_id });
      }
      return res.send({ status: true, message: "success.." });
    } else {
      return res.send({ status: false, message: "token not match" });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const profile = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.profile(staff);
    return res.send({ status: true, message: "Success..", data });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const isLogOut = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.isLogOut(staff);
    return res.send({ status: true, message: "Success.." });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const status = async (req, res) => {
  try {
    // console.log(req.body)
    const { id } = req.body;
    const data = await authService.status(id);
    return res.send({ status: true, message: "Success..", data });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const getSharePointToken = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.getSharePointToken(staff);
    if (data == "sharepoint_token_not_found") {
      return res.send({
        status: false,
        message: "Sharepoint token not found",
        data: data,
      });
    } else {
      return res.send({ status: true, message: "Success..", data: data });
    }
  } catch (error) {
    return res.send({
      status: false,
      message: error.message,
      data: "sharepoint_token_not_found",
    });
  }
};
const HandelStaffPortfolio = async (req, res) => {
  const { action, ...staff } = req.body.req;

  try {
    let result;
    switch (action) {
      case "get":
        result = await authService.GetStaffPortfolio(staff);

        res.status(200).json({ status: true, data: result });
        break;

      case "update":
        result = await authService.UpdateStaffPortfolio(staff);
        if (!result.status) {
          res.status(200).json({ status: false, message: result.message });
          break;
        } else {
          res.status(200).json({
            status: true,
            message: result.message,
            userId: result.data,
          });
          break;
        }

      default:
        res.status(400).json({ status: false, message: "Invalid action" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteStaff = async (req, res) => {
  try {
    const { ...staff } = req.body;
    const data = await authService.deleteStaff(staff);
    return res.send({ status: true, message: "Success.." });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const GetStaffByRole = async (req, res) => {
  const { action, ...staff } = req.body.req;

  try {
    let result;
    switch (action) {
      case "get":
        result = await authService.GetStaffByRole(staff);
        res.status(200).json({ status: true, data: result });
        break;
      case "delete":
        result = await authService.GetStaffAndDeleteData(staff);
        res.status(200).json({ status: true, data: result });
        break;

      default:
        res.status(400).json({ status: false, message: "Invalid action" });
    }
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    let { current_role_id, update_role_id, staff_id, ip, StaffUserId, email } = req.body;

    const user = await staffModel.getStaffByEmail(email);
    const other_role = await staffModel.getStaffOtherRole(email);

    let current_role_id_status = 0;
    let change_role_id = null;

    if (Number(user.role_id) !== Number(update_role_id)) {
      current_role_id_status = 1;
      change_role_id = update_role_id; // Set the role_id they are switching to
    }

    await pool.query(
      "UPDATE staffs SET current_role_id_status = ?, change_role_id = ? WHERE id = ?",
      [current_role_id_status, change_role_id, staff_id]
    );

    let other_role_id = null;
    if (other_role.length > 0) {
      other_role_id = { other_role_id: other_role[0].other_role_id, role_name: other_role[0].role_name };
    }

    const data = {
      staffDetails: user,
      other_role_id: other_role_id,
      current_role_id_status: current_role_id_status,
      change_role_id: change_role_id,
      active_role_id: Number(update_role_id)
    }

    return res.send({ status: true, message: "Role switched successfully.", data });
  } catch (error) {
    return res.send({ status: false, message: error.message });
  }
};

module.exports = {
  GetStaffByRole,
  handleStaff,
  staffCompetency,
  login,
  loginWithAzure,
  loginAuthToken,
  isLoginAuthTokenCheck,
  profile,
  isLogOut,
  status,
  getSharePointToken,
  HandelStaffPortfolio,
  deleteStaff,
  updateRole
};
