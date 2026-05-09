import React, { useState, useEffect } from 'react';
import CustomerJobStatusReport from './CustomerJobStatusReport';
import CustomerJobSummaryReport from './CustomerJobSummaryReport';
import CustomerJobPendingReport from './CustomerJobPendingReport';
import CustomerJobsReceivedSentReports from './CustomerJobsReceivedSentReports';
import CustomerDueByReport from './CustomerDueByReport';
import CustomerTeamMonthlyReport from './CustomerTeamMonthlyReport';
import CustomerTaxWeeklyReport from './CustomerTaxWeeklyReport';
import CustomerAverageTatReport from './CustomerAverageTatReport';
import CustomerMissingTimesheetReport from './CustomerMissingTimesheetReport';
import CustomerDiscrepancyReport from './CustomerDiscrepancyReport';
import { useCustomerAccess } from '../../../Utils/CustomerAccessContext';
import { useNavigate } from 'react-router-dom';

function CustomerReports() {
  const { hasAccess, loading: accessLoading } = useCustomerAccess();
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("role"));

  useEffect(() => {
    if (!accessLoading && !hasAccess("report", "view") && role !== "SUPERADMIN") {
      navigate("/customer/dashboard");
    }
  }, [hasAccess, role, navigate, accessLoading]);

  const getActiveTab = sessionStorage.getItem('activeReportCustomer');
  const [activeTab, setActiveTab] = useState(getActiveTab || "jobStatusReport");

  const handleTabClick = (tabValue) => {
    sessionStorage.setItem('activeReportCustomer', tabValue);
    setActiveTab(tabValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobStatusReport':
        return <CustomerJobStatusReport />
      case 'jobsReceivedSentReports':
        return <CustomerJobsReceivedSentReports />;
      case 'jobSummaryReport':
        return <CustomerJobSummaryReport />
      case 'jobsPendingReport':
        return <CustomerJobPendingReport />;
      case 'dueByReport':
        return <CustomerDueByReport />;
      case 'teamMonthlyReports':
        return <CustomerTeamMonthlyReport />;
      case 'taxWeeklyStatusReport':
        return <CustomerTaxWeeklyReport />;
      case 'averageTatReport':
        return <CustomerAverageTatReport />;
      case 'missingTimesheetReport':
        return <CustomerMissingTimesheetReport />;
      case 'discrepancyReport':
        return <CustomerDiscrepancyReport />;
      default:
        return <div className="p-4 text-center"><h5>Coming Soon...</h5></div>;
    }
  };

  return (
    <div className='container-fluid'>
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div>
                <h5 className="mb-4" style={{ fontWeight: 600 }}>Customer Reports</h5>
              </div>
              <div className="col-lg-4 col-md-6 ">
                  <select className="form-select" id="tabSelect"
                    value={activeTab}
                    onChange={(e) => handleTabClick(e.target.value)}
                  >
                    <option value="jobStatusReport">Job Status Report</option>
                    <option value="jobsReceivedSentReports">Jobs Received Sent Reports</option>
                    <option value="jobSummaryReport">Job Summary Report</option>
                    <option value="jobsPendingReport">Jobs Pending Report</option>
                    <option value="dueByReport">Due By Report</option>
                    <option value="teamMonthlyReports">Team Monthly Reports</option>
                    <option value="taxWeeklyStatusReport">Tax Weekly Status Report</option>
                    <option value="averageTatReport">Average TAT Report</option>
                    <option value="missingTimesheetReport">Missing Timesheet Report</option>
                    <option value="discrepancyReport">Discrepancy Report</option>
                  </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content mt-4" id="pills-tabContent">
        {getTabContent()}
      </div>
    </div>
  );
}

export default CustomerReports;
