const authService = require('../../services/auth/authService');

const addStaff = async (req, res) => {
 //console.log("addStaff  = ",req.body)
  try {
    const userId = await authService.addStaff(req.body);
    res.status(201).json({ userId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
    try {
      const data = await authService.login(req.body);
      delete data.staffDetails.password
     return res.send({ status:true, data : data , msg: "Login Successfully.."});
    } catch (error) {
      return res.send({ status:false, msg: error.message});
     
    }
  };


module.exports = {
    addStaff,
    login
};