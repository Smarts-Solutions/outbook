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
            case 'delete':
                await statusTypeService.removeStatusType(StatusType.id);
                res.status(200).json({ status: true, message: 'StatusType deleted successfully' });
                break;
            case 'update':
                result = await statusTypeService.modifyStatusType(StatusType);
                console.log("await pool.execute(query, values); ",result)
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
};
