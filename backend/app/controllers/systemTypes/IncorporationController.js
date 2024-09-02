const IncorporationService = require('../../services/systemTypes/IncorporationService');

const handleIncorporation = async (req, res) => {
    const { action, ...Incorporation } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await IncorporationService.addIncorporation(Incorporation);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await IncorporationService.getIncorporation();
                res.status(200).json({ status: true, data: result });
                break;
            case 'getAll':
                result = await IncorporationService.getIncorporationAll();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await IncorporationService.removeIncorporation(Incorporation.id);
                res.status(200).json({ status: true, message: 'Incorporation deleted successfully' });
                break;
            case 'update':
                result = await IncorporationService.modifyIncorporation(Incorporation);
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
    handleIncorporation,
};