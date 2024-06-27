const authService = require('../../services/auth/authService');

const handleStaff = async (req, res) => {
  const { action, ...staff } = req.body;

  try {
      let result;
      switch (action) {
          case 'add':
              result = await authService.addStaff(staff);
              res.status(201).json({ userId: result });
              break;
          case 'delete':
              await authService.removeStaff(staff.id);
              res.status(200).json({ message: 'Staff deleted successfully' });
              break;
          case 'update':
              await authService.modifyStaff(staff);
              res.status(200).json({ message: 'Staff updated successfully' });
              break;
          default:
              res.status(400).json({ message: 'Invalid action' });
      }
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
    handleStaff,
    login
};