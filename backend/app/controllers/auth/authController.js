const authService = require("../../services/auth/authService");

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
        result = await authService.getStaff();
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
        console.log("result", result);
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
};
