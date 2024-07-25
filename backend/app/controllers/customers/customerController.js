const customerService = require('../../services/customers/customerService');

const addCustomer = async (req, res) => {
  try {
     const { ...customer } = req.body;
      const data = await customerService.addCustomer(customer);
      if(data != undefined){
        res.status(200).json({ status:true,message: "Success..",data : data});
      }else{
        res.status(400).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


module.exports = {
  addCustomer
};