const customerService = require('../../services/customers/customerService');


const addCustomer = async (req, res) => {
  try {
     const { ...customer } = req.body;
    //  console.log("customer",customer)
      const data = await customerService.addCustomer(customer);
      if(data != undefined){
       return res.status(200).json({ status:true,message: "Success..",data : data});
      }else{
       return res.status(400).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const updateProcessCustomer = async (req, res) => {
  
  try {
     const { ...customerProcessData } = req.body;
    //  console.log("customer",customer)
      const data = await customerService.updateProcessCustomer(customerProcessData);
      if(data != undefined){
       return res.status(200).json({ status:true,message: "Success..",data : data});
      }else{
       return res.status(400).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const updateProcessCustomerFile = async (req, res) => {
  try {
      const customer_id = req.body.customer_id
      const customerProcessDataFiles = req.files;
      const data = await customerService.updateProcessCustomerFile(customerProcessDataFiles , customer_id);
      if(data != undefined){
       return res.status(200).json({ status:true,message: "Success..",data : data});
      }else{
       return res.status(400).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}




module.exports = {
  addCustomer,
  updateProcessCustomer,
  updateProcessCustomerFile
};