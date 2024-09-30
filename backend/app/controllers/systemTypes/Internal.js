const InternalService = require('../../services/systemTypes/Internal');

const handleInternal = async (req, res) => {
    const { action, ...Internal } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await InternalService.AddInternal(Internal);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await InternalService.getInternal(Internal);
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await InternalService.getInternalAll(Internal);
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await InternalService.removeInternal(Internal);
                res.status(200).json({ status: true, message: 'Internal deleted successfully' });
                break;
            case 'update':
                result = await InternalService.modifyInternal(Internal);
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
    handleInternal,
};