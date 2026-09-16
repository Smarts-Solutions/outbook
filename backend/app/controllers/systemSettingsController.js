const systemSettingsModel = require("../models/systemSettingsModel");

exports.getSettings = async (req, res) => {
    try {
        const result = await systemSettingsModel.getSettings();
        if (result) {
            res.status(200).json({ status: true, data: result, message: "Settings fetched successfully" });
        } else {
            res.status(200).json({ status: true, data: null, message: "No settings found" });
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const result = await systemSettingsModel.updateSettings(req.body);
        res.status(200).json({ status: true, message: "Settings updated successfully", data: result });
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
