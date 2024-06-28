const authService = require('../../services/auth/authService');

const handleStaff = async (req, res) => {
  const { action, ...staff } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await authService.addStaff(staff);
              res.status(201).json({ status:true, userId: result ,message: 'Staff created successfully' });
              break;
          case 'delete':
              await authService.removeStaff(staff.id);
              res.status(200).json({ status:true,message: 'Staff deleted successfully' });
              break;
          case 'update':
              await authService.modifyStaff(staff);
              res.status(200).json({ status:true, message: 'Staff updated successfully' });
              break;
          default:
              res.status(400).json({ status:false, message: 'Invalid action' });
      }
  } catch (error) {
      res.status(500).json({status:false, message: error.message });
  }
};

const login = async (req, res) => {
    try {
      const data = await authService.login(req.body);
      // delete the password property from the data object
      delete data.password
      return res.send({ status:true, data : data , message: "Login Successfully.."});
    } catch (error) {
      return res.send({ status:false, message: error.message});
     
    }
  };

   const loginAuthToken = async (req, res) => {
    try {
    const { ...staff } = req.body;
      const data = await authService.modifyStaff(staff);
      return res.send({ status:true, message: "Success.."});
    } catch (error) {
      return res.send({ status:false, message: error.message});
    }
  };


  const isLoginAuthTokenCheck = async (req, res) => {
    try {
      const { ...staff } = req.body;
      const data = await authService.isLoginAuthTokenCheck(staff);
       if(data != undefined){
        return res.send({ status:true, message: "success.."});
       }else{
        return res.send({ status:false, message: "token not match"});
       }
    } catch (error) {
      return res.send({ status:false, message: error.message});
    }
  };


module.exports = {
    handleStaff,
    login,
    loginAuthToken,
    isLoginAuthTokenCheck
};