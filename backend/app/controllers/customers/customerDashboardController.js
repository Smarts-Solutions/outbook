const customerDashboardService = require('../../services/customers/customerDashboardService');
const { CustomerLogUpdateOperation } = require("../../utils/customerHelper");

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

const getCustomerDropdown = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerDropdown(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCustomerList = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerList(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCustomerClients = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerClientList(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCustomerJobs = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerJobList(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerClientAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerClientAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerClientAdd = async (req, res) => {
  try {
    const result = await customerDashboardService.customerClientAdd(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerJobAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerJobAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerJobUpdate = async (req, res) => {
  try {
    const result = await customerDashboardService.customerJobUpdate(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerJobTimeline = async (req, res) => {
  try {
    const result = await customerDashboardService.customerJobTimeline(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerTaskTimesheetAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerTaskTimesheetAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerMissingLogAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerMissingLogAction(req);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerQueryAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerQueryAction(req);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerDraftAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerDraftAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerDocumentAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerDocumentAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCustomerAddJobData = async (req, res) => {
  try {
    const result = await customerDashboardService.getCustomerAddJobData(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerJobAdd = async (req, res) => {
  try {
    const result = await customerDashboardService.customerJobAdd(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerChecklistAction = async (req, res) => {
  try {
    const result = await customerDashboardService.customerChecklistAction(req.body);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerGetOfficerDetails = async (req, res) => {
  try {
    const result = await customerDashboardService.customerGetOfficerDetails(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const customerJobType = async (req, res) => {
  try {
    const result = await customerDashboardService.customerJobType(req.body);
    return res.status(200).json({ status: true, data: result });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const customerDownloadChecklist = async (req, res) => {
  try {
    const result = await customerDashboardService.customerDownloadChecklist(req.params.checklist_id);
    if (result.status === false) {
      return res.status(404).send(result.message);
    }
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${result.filename}`);
    return res.send(result.data);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {
  getCustomerDashboardData,
  getCustomerDashboardActivityLog,
  getCustomerCountLinkData,
  getCustomerMasterStatus,
  updateCustomerJobStatus,
  getCustomerDropdown,
  getCustomerList,
  getCustomerClients,
  getCustomerJobs,
  customerClientAction,
  customerClientAdd,
  customerJobAction,
  customerJobUpdate,
  customerJobTimeline,
  customerTaskTimesheetAction,
  customerMissingLogAction,
  customerQueryAction,
  customerDraftAction,
  customerDocumentAction,
  getCustomerAddJobData,
  customerJobAdd,
  customerChecklistAction,
  customerGetOfficerDetails,
  customerJobType,
  customerDownloadChecklist,
};
