
const customerModel = require('../../models/customerModel');

const addCustomer = async (customer) => {
  return customerModel.createCustomer(customer);
};

module.exports = {
    addCustomer,
};