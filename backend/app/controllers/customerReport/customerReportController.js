const customerReportModel = require("../../models/customerReportModel");

exports.jobStatusReports = async (req, res) => {
  try {
    const { page, limit, search } = req.body;
    const result = await customerReportModel.jobStatusReports({
      StaffUserId: req.userId,
      page,
      limit,
      search,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.jobReceivedSentReports = async (req, res) => {
  try {
    const result = await customerReportModel.jobReceivedSentReports({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.jobSummaryReports = async (req, res) => {
  try {
    const result = await customerReportModel.jobSummaryReports({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.jobPendingReports = async (req, res) => {
  try {
    const result = await customerReportModel.jobPendingReports({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.dueByReport = async (req, res) => {
  try {
    const result = await customerReportModel.dueByReport({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.teamMonthlyReports = async (req, res) => {
  try {
    const result = await customerReportModel.teamMonthlyReports({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.taxWeeklyStatusReport = async (req, res) => {
  try {
    const result = await customerReportModel.taxWeeklyStatusReport({ 
      StaffUserId: req.userId,
      ...req.body 
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.averageTatReport = async (req, res) => {
  try {
    const result = await customerReportModel.averageTatReport({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.reportCountJob = async (req, res) => {
  try {
    const { job_ids, page, limit, search } = req.body;
    const result = await customerReportModel.reportCountJob({
      StaffUserId: req.userId,
      job_ids,
      page,
      limit,
      search,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.missingTimesheetReport = async (req, res) => {
  try {
    const result = await customerReportModel.missingTimesheetReport({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

exports.discrepancyReport = async (req, res) => {
  try {
    const result = await customerReportModel.discrepancyReport({ StaffUserId: req.userId });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
