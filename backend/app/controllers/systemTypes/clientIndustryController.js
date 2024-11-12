const clientIndustryService = require('../../services/systemTypes/clientIndustryService');

const handleClientIndustry = async (req, res) => {
    const { action, ...ClientIndustry } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await clientIndustryService.addClientIndustry(ClientIndustry);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await clientIndustryService.getClientIndustry();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await clientIndustryService.getClientIndustryAll();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await clientIndustryService.removeClientIndustry(ClientIndustry);
                res.status(200).json({ status: true, message: 'Client industry deleted successfully' });
                break;
            case 'update':
                result = await clientIndustryService.modifyClientIndustry(ClientIndustry);
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
    handleClientIndustry,
};