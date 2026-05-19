const customerContactPersonAccessService = require('../../services/systemTypes/customerContactPersonAccessService');

const accessRolePermissions = async (req, res) => {
    try {
        const data = await customerContactPersonAccessService.accessRolePermissions(req.body);
        return res.send({ status: true, data: data, message: "success" });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};

const getCustomerAccessByCustomerId = async (req, res) => {
    try {
        const { roleInfo, permissions } = await customerContactPersonAccessService.getCustomerAccessByCustomerId(req.body);
        return res.send({ status: true, data: permissions, roleInfo: roleInfo, message: "success" });
    } catch (error) {
        return res.send({ status: false, message: error.message });
    }
};

module.exports = {
    accessRolePermissions,
    getCustomerAccessByCustomerId
};
