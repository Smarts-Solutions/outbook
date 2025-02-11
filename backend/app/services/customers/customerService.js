
const customerModel = require('../../models/customerModel');

const addCustomer = async (customer) => {
  return customerModel.createCustomer(customer);
};

const customerAction = async (customer) => {
  
  const {action} = customer
  if(action === "get"){
    return customerModel.getCustomer(customer);
  }
  else if(action === "get_dropdown"){
    return customerModel.getCustomer_dropdown(customer);
  }
  else if(action === "get_dropdown_delete"){
    return customerModel.getCustomer_dropdown_delete(customer);
  }
  else if(action === "delete"){
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

const updateProcessCustomerFile = async (customerProcessDataFiles , customer_id ,uploadedFiles) => {
  return customerModel.updateProcessCustomerFile(customerProcessDataFiles , customer_id ,uploadedFiles);
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

const customerUpdate = async (customer) => {
  return customerModel.customerUpdate(customer);
};

const deleteCustomer = async (customer) => {
  return customerModel.deleteCustomer(customer);
};

const customerStatusUpdate = async (customer) => {
  return customerModel.customerStatusUpdate(customer);
}

const getcustomerschecklist = async (customer) => {
  return customerModel.getcustomerschecklist(customer);
}

module.exports = {
  addCustomer,
  customerAction,
  getSingleCustomer,
  updateProcessCustomer,
  updateProcessCustomerFile,
  updateProcessCustomerFileAction,
  customerUpdate,
  customerStatusUpdate,
  getcustomerschecklist,
  deleteCustomer
};