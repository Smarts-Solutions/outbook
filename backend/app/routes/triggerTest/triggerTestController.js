const { dispatchReports, REPORT_CONFIG } = require("./triggerTestService");

const handleTriggerTest = async (req, res) => {
  try {
    const { email, reportType } = req.body;
    const result = await dispatchReports({ email, reportType });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

const handleGetReportList = async (req, res) => {
  try {
    const list = Object.keys(REPORT_CONFIG).map((k) => ({
      key: k,
      name: REPORT_CONFIG[k].name
    }));
    return res.status(200).json({ status: true, data: list });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

module.exports = {
  handleTriggerTest,
  handleGetReportList
};
