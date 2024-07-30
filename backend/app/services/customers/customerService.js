
const customerModel = require('../../models/customerModel');

const addCustomer = async (customer) => {
  return customerModel.createCustomer(customer);
};

const customerAction = async (customer) => {
  const {action} = customer
  if(action === "get"){
    return customerModel.getCustomer(customer);
  }else if(action === "delete"){
    return customerModel.deleteCustomer(customer);
  }else{
   return
  }
};

const getSingleCustomer = async (customer) => {
    return customerModel.getSingleCustomer(customer);
};

const updateProcessCustomer = async (customerProcessData) => {
  const { pageStatus } = customerProcessData;
  if (pageStatus === "2") {
    const { services } = customerProcessData;
    if (services.length > 0) {
      return customerModel.updateProcessCustomerServices(customerProcessData);
    } else {
      return undefined;
    }
  }
  
  else if(pageStatus === "3"){
    return customerModel.updateProcessCustomerEngagementModel(customerProcessData);
  }



};

const updateProcessCustomerFile = async (customerProcessDataFiles , customer_id) => {
  return customerModel.updateProcessCustomerFile(customerProcessDataFiles , customer_id);
};

const updateProcessCustomerFileAction = async (customerProcessData) => {
  const {action} = customerProcessData
  if(action === "get"){
    return customerModel.updateProcessCustomerFileGet(customerProcessData);
  }else if(action === "delete"){
    return customerModel.updateProcessCustomerFileDelete(customerProcessData);
  }else{
   return
  }
};



module.exports = {
  addCustomer,
  customerAction,
  getSingleCustomer,
  updateProcessCustomer,
  updateProcessCustomerFile,
  updateProcessCustomerFileAction
};