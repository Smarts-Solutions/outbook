import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import ExpandableTable from '../../../Components/ExtraComponents/ExpandableTable';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import TimesheetReport from './TimesheetReport';
import JobStatusReport from './JobStatusPeport';
import JobSummaryReport from './JobSummaryReport';
import TeamMonthlyReport from './TeamMonthlyReports';
import JobPendingReport from './JobPendingReports';
import JobsReceivedSentReports from './JobsReceivedSentReports';
import DueByReport from './DueByReport';
import TextWeelyReport from './TextWeelyReport';
import AverageTatReport from './AverageTatReport';
 

function Reportsnew() {

  const [filter, setFilter] = useState(false);
  const [activeTab, setActiveTab] = useState("jobStatusReport");

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobStatusReport':
        return <JobStatusReport />
      case 'jobsReceivedSentReports':
        return <JobsReceivedSentReports />;
      case 'jobSummaryReport':
        return <JobSummaryReport />
      case 'jobsPendingReport':
        return <JobPendingReport />;
      case 'dueByReport':
        return <DueByReport />;
      case 'teamPerformanceReport':
        return <TeamMonthlyReport />;
      case 'timesheetReport':
        return <TimesheetReport />
      case 'averageTATReport':
        return <AverageTatReport />;
      case 'taxWeeklyStatusReport':
        return <TextWeelyReport />;
      default:
        return null;
    }
  };

  return (
    <div className='container-fluid'>
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div>
                <h5 className="mb-2" style={{ fontWeight: 600 }}>Reports</h5>
              </div>
              <div className="col-md-3">
                <>
                  <select className="form-select" id="tabSelect" 
                   value={activeTab}
                   onChange={(e)=>handleTabClick(e.target.value)}
                   >
                    <option value="jobStatusReport">Job Status Report</option>
                    <option value="jobsReceivedSentReports">Jobs Received Sent Reports</option>
                    <option value="jobSummaryReport">Job Summary Report</option>
                    <option value="jobsPendingReport">Jobs Pending Report</option>
                    <option value="dueByReport">Due By Report</option>
                    <option value="teamPerformanceReport">Team Performance Report by Month</option>
                    <option value="taxWeeklyStatusReport">Tax Weekly Status Report</option>
                    <option value="averageTATReport">Average TAT Report</option>
                  </select>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        {getTabContent()}
      </div>
      <CommanModal
        isOpen={filter}
        backdrop="static"
        size="ms-5"
        title="Task"
        cancel_btn="cancel"
        hideBtn={false}
        btn_name="Save"
        handleClose={() => setFilter(false)}
      >
        {/* Modal content here */}
      </CommanModal>
    </div>
  );
}

export default Reportsnew;
