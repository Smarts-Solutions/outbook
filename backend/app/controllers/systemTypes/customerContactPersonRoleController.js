const customerContactPersonRoleService = require('../../services/systemTypes/customerContactPersonRoleService');

const handleCustomerContactPersonRole = async (req, res) => {
    const { action, ...CustomerContactPersonRole } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await customerContactPersonRoleService.addCustomerContactPersonRole(CustomerContactPersonRole);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }

            case 'get':
                result = await customerContactPersonRoleService.getCustomerContactPersonRole();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await customerContactPersonRoleService.getCustomerContactPersonRoleAll();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await customerContactPersonRoleService.removeCustomerContactPersonRole(CustomerContactPersonRole);
                res.status(200).json({ status: true, message: 'CustomerContactPersonRole deleted successfully' });
                break;
            case 'update':
                result = await customerContactPersonRoleService.modifyCustomerContactPersonRole(CustomerContactPersonRole);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
                break;
            default:
                res.status(400).json({ status: false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    handleCustomerContactPersonRole,
};