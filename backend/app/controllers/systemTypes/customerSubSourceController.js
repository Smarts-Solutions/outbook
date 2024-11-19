const CustomerSubSourceService = require('../../services/systemTypes/CustomerSubSourceService');

const handleCustomerSubSource = async (req, res) => {
    const { action, ...CustomerSubSource } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await CustomerSubSourceService.addCustomerSubSource(CustomerSubSource);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await CustomerSubSourceService.getCustomerSubSource(CustomerSubSource);
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await CustomerSubSourceService.getCustomerSubSourceAll(CustomerSubSource);
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await CustomerSubSourceService.removeCustomerSubSource(CustomerSubSource);
                res.status(200).json({ status: true, message: 'Customer Sub Source deleted successfully' });
                break;
            case 'update':
                result = await CustomerSubSourceService.modifyCustomerSubSource(CustomerSubSource);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            default:
                res.status(400).json({ status: false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};


module.exports = {
    handleCustomerSubSource,
};