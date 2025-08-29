const reportService = require('../../services/report/reportService');

const jobStatusReports = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.jobStatusReports(Report);

    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }

  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const jobReceivedSentReports = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.jobReceivedSentReports(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  }
  catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const jobSummaryReports = async (req, res) => {
  try {

    const { ...Report } = req.body;
    const result = await reportService.jobSummaryReports(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const jobPendingReports = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.jobPendingReports(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const teamMonthlyReports = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.teamMonthlyReports(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const dueByReport = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.dueByReport(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    } else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const reportCountJob = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.reportCountJob(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  }
  catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const taxWeeklyStatusReport = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.taxWeeklyStatusReport(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  }
  catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const taxWeeklyStatusReportFilterKey = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.taxWeeklyStatusReportFilterKey(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  }
  catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const averageTatReport = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.averageTatReport(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  }
  catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const getAllTaskByStaff = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.getAllTaskByStaff(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

const getTimesheetReportData = async (req, res) => {
  try {
    const { ...Report } = req.body;
    const result = await reportService.getTimesheetReportData(Report);
    if (!result.status) {
      return res.status(200).json({ status: false, message: result.message });
    }
    else {
      return res.status(200).json({ status: true, message: result.message, data: result.data });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
}

module.exports = {
  jobStatusReports,
  jobReceivedSentReports,
  jobSummaryReports,
  jobPendingReports,
  teamMonthlyReports,
  dueByReport,
  reportCountJob,
  taxWeeklyStatusReport,
  taxWeeklyStatusReportFilterKey,
  averageTatReport,
  getAllTaskByStaff,
  getTimesheetReportData
};