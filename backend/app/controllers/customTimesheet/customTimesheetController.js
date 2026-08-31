const customTimesheetService = require("../../services/customTimesheet/customTimesheetService");

const handleCustomActions = async (req, res) => {
  try {
    const action = req.body.action;
    let result = null;

    if (!action) {
      return res.status(400).json({ status: false, message: "Action is required" });
    }

    result = await customTimesheetService.handleAction(req.body);

    if (result && result.status) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result || { status: false, message: "Action failed" });
    }
  } catch (error) {
    console.error("Error in customTimesheetController:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  handleCustomActions,
};
