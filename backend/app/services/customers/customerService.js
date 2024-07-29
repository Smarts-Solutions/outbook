
const customerModel = require('../../models/customerModel');

const addCustomer = async (customer) => {
  return customerModel.createCustomer(customer);
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



module.exports = {
  addCustomer,
  updateProcessCustomer,
  updateProcessCustomerFile
};