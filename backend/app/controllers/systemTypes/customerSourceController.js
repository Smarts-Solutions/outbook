const CustomerSourceService = require('../../services/systemTypes/CustomerSourceService');

const handleCustomerSource = async (req, res) => {
    const { action, ...CustomerSource } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await CustomerSourceService.addCustomerSource(CustomerSource);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await CustomerSourceService.getCustomerSource();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await CustomerSourceService.getCustomerSourceAll();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await CustomerSourceService.removeCustomerSource(CustomerSource.id);
                res.status(200).json({ status: true, message: 'CustomerSource deleted successfully' });
                break;
            case 'update':
                result = await CustomerSourceService.modifyCustomerSource(CustomerSource);
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
    handleCustomerSource,
};