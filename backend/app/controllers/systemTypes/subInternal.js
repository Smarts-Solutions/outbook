const subInternalService = require('../../services/systemTypes/subInternal');

const handleSubInternal = async (req, res) => {
    const { action, ...subInternal } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await subInternalService.AddSubInternal(subInternal);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await subInternalService.getSubInternal(subInternal);
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await subInternalService.getSubInternalAll(subInternal);
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await subInternalService.removeSubInternal(subInternal);
                res.status(200).json({ status: true, message: 'Internal Task deleted successfully' });
                break;
            case 'update':
                result = await subInternalService.modifySubInternal(subInternal);
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
    handleSubInternal,
};