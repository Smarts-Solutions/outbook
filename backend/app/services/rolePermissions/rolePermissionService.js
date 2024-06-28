
const rolePermissionsModel = require('../../models/rolePermissionsModel');


const addRole = async (Role) => {
  return rolePermissionsModel.createRole(Role);
};

const getRole = async () => {
  return rolePermissionsModel.getRole();
}

const removeRole = async (RoleId) => {
  return rolePermissionsModel.deleteRole(RoleId);
};

const modifyRole = async (Role) => {
  return rolePermissionsModel.updateRole(Role);
};


module.exports = {
    addRole,
    removeRole,
    modifyRole,
    getRole
};