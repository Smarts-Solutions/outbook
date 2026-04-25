const customerDashboardService = require('../../services/customers/customerDashboardService');

const getCustomerDashboardData = async (req, res) => {
  try {
    const { ...dashboard } = req.body;

    const result = await customerDashboardService.getCustomerDashboardData(dashboard);

    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCustomerDashboardActivityLog = async (req, res) => {
  try {
    const { ...dashboard } = req.body;

    const result = await customerDashboardService.getCustomerDashboardActivityLog(dashboard);

    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res
        .status(200)
        .json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCustomerCountLinkData = async (req, res) => {
  try {
    const { ...dashboard } = req.body;
    const result = await customerDashboardService.getCustomerCountLinkData(dashboard);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getCustomerMasterStatus = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerMasterStatus();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateCustomerJobStatus = async (req, res) => {
  try {
    const result = await customerDashboardService.updateCustomerJobStatus(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  getCustomerDashboardData,
  getCustomerDashboardActivityLog,
  getCustomerCountLinkData,
  getCustomerMasterStatus,
  updateCustomerJobStatus,
};
