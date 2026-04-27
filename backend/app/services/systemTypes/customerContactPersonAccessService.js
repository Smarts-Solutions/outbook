const customerContactPersonAccessModel = require('../../models/customerContactPersonAccessModel');

const accessRolePermissions = async (data) => {
    const { action } = data;
    if (action === 'get') {
        const rowData = await customerContactPersonAccessModel.accessRolePermissions(data);
        if (!rowData.length) {
            return [];
        }

        console.log("rowData", rowData)
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
    } else if (action === 'update') {
        const rowData = await customerContactPersonAccessModel.accessRolePermissions(data);
        return rowData;
    }
}

module.exports = {
    accessRolePermissions,
};
