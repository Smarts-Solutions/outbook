
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


const checkCustomerContactPersonRoleAssignment = async (id) => {
  return customerContactPersonRoleModel.checkCustomerContactPersonRoleAssignment(id);
};

const reassignAndDeleteCustomerContactPersonRole = async (data) => {
  return customerContactPersonRoleModel.reassignAndDeleteCustomerContactPersonRole(data);
};

module.exports = {
  addCustomerContactPersonRole,
  getCustomerContactPersonRole,
  removeCustomerContactPersonRole,
  modifyCustomerContactPersonRole,
  getCustomerContactPersonRoleAll,
  checkCustomerContactPersonRoleAssignment,
  reassignAndDeleteCustomerContactPersonRole
};