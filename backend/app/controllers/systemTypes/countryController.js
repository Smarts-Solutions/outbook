const countryService = require('../../services/systemTypes/countryService');

const handleCountry = async (req, res) => {
    const { action, ...Country } = req.body;

    try {
        let result;
        switch (action) {
            case 'add':
                result = await countryService.addCountry(Country);
                if (!result.status) {
                    res.status(200).json({ status: false, message: result.message });
                    break;
                } else {
                    res.status(200).json({ status: true, message: result.message, userId: result.data });
                    break;
                }
            case 'get':
                result = await countryService.getCountry();
                res.status(200).json({ status: true, data: result });
                break;
            case 'delete':
                await countryService.removeCountry(Country.id);
                res.status(200).json({ status: true, message: 'Country deleted successfully' });
                break;
            case 'update':
                result = await countryService.modifyCountry(Country);
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
    handleCountry,
};