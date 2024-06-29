const statusTypeService = require('../../services/systemTypes/statusTypeService');

const handleStatusType = async (req, res) => {
    const { action, ...StatusType } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await statusTypeService.addStatusType(StatusType);
                res.status(201).json({ status: true, userId: result, message: 'StatusType created successfully' });
                break;
            case 'get':
                result = await statusTypeService.getStatusType();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await statusTypeService.removeStatusType(StatusType.id);
                res.status(200).json({ status: true, message: 'StatusType deleted successfully' });
                break;
            case 'update':
                await statusTypeService.modifyStatusType(StatusType);
                res.status(200).json({ status: true, message: 'StatusType updated successfully' });
                break;
            default:
                res.status(400).json({ status: false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

module.exports = {
    handleStatusType,
};
