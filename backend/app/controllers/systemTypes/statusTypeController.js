const statusTypeService = require('../../services/systemTypes/statusTypeService');

const handleStatusType = async (req, res) => {
    const { action, ...StatusType } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await statusTypeService.addStatusType(StatusType);
                if(!result.status){
                    res.status(200).json({ status: false, message: result.message });
                    break;
                }else{
                    res.status(200).json({ status: true, message: result.message , userId: result.data});
                    break;
                }
            case 'get':
                result = await statusTypeService.getStatusType();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await statusTypeService.getStatusTypeAll();
                res.status(200).json({ status: true, data: result });
                break;    
            case 'delete':
                await statusTypeService.removeStatusType(StatusType);
                res.status(200).json({ status: true, message: 'Status type deleted successfully' });
                break;
            case 'update':
                result = await statusTypeService.modifyStatusType(StatusType);
                if(!result.status){
                    res.status(200).json({ status: false, message: result.message });
                    break;
                }else{
                    res.status(200).json({ status: true, message: result.message , userId: result.data});
                    break;
                }
            default:
                res.status(400).json({ status: false, message: 'Invalid action' });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
};

const handleMasterStatus = async (req, res) => {
    const { action, ...masterStatus } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await statusTypeService.addMasterStatus(masterStatus);
                if(!result.status){
                    res.status(200).json({ status: false, message: result.message });
                    break;
                }else{
                    res.status(200).json({ status: true, message: result.message , userId: result.data});
                    break;
                }
            case 'get':
                result = await statusTypeService.getMasterStatus(masterStatus);
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await statusTypeService.getMasterStatus(masterStatus);
                res.status(200).json({ status: true, data: result });
                break;    
            case 'delete':
                await statusTypeService.removeMasterStatus(masterStatus);
                res.status(200).json({ status: true, message: 'Master Status deleted successfully' });
                break;
            case 'update':
                result = await statusTypeService.modifyMasterStatus(masterStatus);
                if(!result.status){
                    res.status(200).json({ status: false, message: result.message });
                    break;
                }else{
                    res.status(200).json({ status: true, message: result.message , userId: result.data});
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
    handleStatusType,
    handleMasterStatus
};
