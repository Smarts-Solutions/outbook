const customerService = require('../../services/customers/customerService');


const addCustomer = async (req, res) => {
  try {
     const { ...customer } = req.body;
    
      const result = await customerService.addCustomer(customer);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const customerAction = async (req, res) => {
  try {
     const { ...customer } = req.body;
   
      const result = await customerService.customerAction(customer);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const getSingleCustomer = async (req, res) => {
  try {
     const { ...customer } = req.body;
  
      const data = await customerService.getSingleCustomer(customer);
      if(data != undefined){
       return res.status(200).json({ status:true,message: "Success..",data : data});
      }else{
       return res.status(200).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const updateProcessCustomer = async (req, res) => {
  
  try {
     const { ...customerProcessData } = req.body;
   
      const data = await customerService.updateProcessCustomer(customerProcessData);
      if(data != undefined){
       return res.status(200).json({ status:true,message: "Customer details have been saved successfully!",data : data});
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
       return res.status(200).json({ status:true,message: "Customer details have been saved successfully!",data : data});
      }else{
       return res.status(400).json({ status:false, message: "Invalid..."});
      }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


const updateProcessCustomerFileAction = async (req, res) => {
  try {
    const { ...customerProcessData } = req.body;
      const result = await customerService.updateProcessCustomerFileAction(customerProcessData);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}


const customerUpdate = async (req, res) => {
  try {
     const { ...customer } = req.body;
    
      const result = await customerService.customerUpdate(customer);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}

const customerStatusUpdate = async (req, res) => {
  try {
     const { ...customer } = req.body;
    
      const result = await customerService.customerStatusUpdate(customer);
      if(!result.status){
        return  res.status(200).json({ status: false, message: result.message });  
        }else{
        return  res.status(200).json({ status: true, message: result.message , data : result.data});
        }
    } catch (error) {
      res.status(500).json({ status:false, message: error.message});
    }
}




module.exports = {
  addCustomer,
  customerAction,
  getSingleCustomer,
  updateProcessCustomer,
  updateProcessCustomerFile,
  updateProcessCustomerFileAction,
  customerUpdate,
  customerStatusUpdate
};