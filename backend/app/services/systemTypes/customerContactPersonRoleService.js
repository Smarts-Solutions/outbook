
const customerContactPersonRoleModel = require('../../models/customerContactPersonRoleModel');


const addCustomerContactPersonRole = async (CustomerContactPersonRole) => {
  return customerContactPersonRoleModel.createCustomerContactPersonRole(CustomerContactPersonRole);
};

const getCustomerContactPersonRole = async () => {
  return customerContactPersonRoleModel.getCustomerContactPersonRole();
}
const getCustomerContactPersonRoleAll = async () => {
  return customerContactPersonRoleModel.getCustomerContactPersonRoleAll();
}

const removeCustomerContactPersonRole = async (CustomerContactPersonRoleId) => {
  return customerContactPersonRoleModel.deleteCustomerContactPersonRole(CustomerContactPersonRoleId);
};

const modifyCustomerContactPersonRole = async (CustomerContactPersonRole) => {
  return customerContactPersonRoleModel.updateCustomerContactPersonRole(CustomerContactPersonRole);
};


module.exports = {
  addCustomerContactPersonRole,
  getCustomerContactPersonRole,
  removeCustomerContactPersonRole,
  modifyCustomerContactPersonRole,
  getCustomerContactPersonRoleAll
};