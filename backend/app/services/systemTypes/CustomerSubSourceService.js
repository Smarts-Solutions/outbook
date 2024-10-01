
const customerSubSourceModel = require('../../models/customerSubSourceModel');


const addCustomerSubSource = async (CustomerSubSource) => {
  return customerSubSourceModel.createCustomerSubSource(CustomerSubSource);
};

const getCustomerSubSource = async (CustomerSubSource) => {
  return customerSubSourceModel.getCustomerSubSource(CustomerSubSource);
}

const getCustomerSubSourceAll = async (CustomerSubSource) => {
  return customerSubSourceModel.getCustomerSubSourceAll(CustomerSubSource);
}

const removeCustomerSubSource = async (CustomerSubSourceId) => {
  return customerSubSourceModel.deleteCustomerSubSource(CustomerSubSourceId);
};

const modifyCustomerSubSource = async (CustomerSubSource) => {
  return customerSubSourceModel.updateCustomerSubSource(CustomerSubSource);
};


module.exports = {
  addCustomerSubSource,
  getCustomerSubSource,
  removeCustomerSubSource,
  modifyCustomerSubSource,
  getCustomerSubSourceAll
};