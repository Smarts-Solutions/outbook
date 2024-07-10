
const rolePermissionsModel = require('../../models/rolePermissionsModel');


const addRole = async (Role) => {
  return rolePermissionsModel.createRole(Role);
};

const getRole = async () => {
  return rolePermissionsModel.getRole();
}
const staffRole = async () => {
  return rolePermissionsModel.staffRole();
}

const removeRole = async (RoleId) => {
  return rolePermissionsModel.deleteRole(RoleId);
};
const getRoleById = async (RoleId) => {
  return rolePermissionsModel.getRoleById(RoleId);
};

const modifyRole = async (Role) => {
  return rolePermissionsModel.updateRole(Role);
};

const accessRolePermissions = async (data) => {
  const { role_id, action } = data;
  if (action === 'get') {
    const rowData = await rolePermissionsModel.accessRolePermissions(data);
    if (!rowData.length) {
      return [];
    }
    const result = rowData.reduce((acc, curr) => {
      const { permission_name, id, type, is_assigned } = curr;
      let permission = acc.find(p => p.permission_name === permission_name);
      if (!permission) {
        permission = { permission_name, items: [] };
        acc.push(permission);
      }
      permission.items.push({ type, is_assigned, id });
      return acc;
    }, []);

    return result;
  } else if(action === 'update'){
    const rowData = await rolePermissionsModel.accessRolePermissions(data);
    return rowData;
  }

}


module.exports = {
  addRole,
  removeRole,
  getRoleById,
  modifyRole,
  getRole,
  staffRole,
  accessRolePermissions
};