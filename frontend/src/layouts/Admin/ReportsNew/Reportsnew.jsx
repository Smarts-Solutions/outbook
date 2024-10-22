import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import ExpandableTable from '../../../Components/ExtraComponents/ExpandableTable';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import TimesheetReport from './TimesheetReport';
import JobStatusReport from './JobStatusPeport';
import JobSummaryReport from './JobSummaryReport';
import TeamMonthlyReport from './TeamMonthlyReports';
import JobPendingReport from './JobPendingReports';


const columns = [

  {
    name: 'Trading Name',
    cell: (row) => (
      <div>
        {/* <span onClick={(e) => console.log(e.target)} className="mx-3 pointer  Plas-center">
          +
        </span> */}
        {row.TradingName}
      </div>
    ),
    sortable: true
  },

  { name: 'Customer Code', selector: row => row.Code, sortable: true },
  { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
  { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
  { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
  { name: 'Account Manager', selector: row => row.JobType, sortable: true },
]

const tabs = [
  { name: 'Job Status Report', icon: 'fas fa-clipboard-list', value: 'jobStatusReport' },
  { name: 'Jobs Received Sent Reports', icon: 'fas fa-inbox', value: 'jobsReceivedSentReports' },
  { name: 'Job Summary Report', icon: 'fas fa-chart-pie', value: 'jobSummaryReport' },
  { name: 'Jobs Pending Report', icon: 'fas fa-tasks', value: 'jobsPendingReport' },
  { name: 'Due By Report', icon: 'fas fa-calendar-alt', value: 'dueByReport' },
  { name: 'Team Performance Report by Month', icon: 'fas fa-users', value: 'teamPerformanceReport' },
  { name: 'Average TAT Report', icon: 'fas fa-stopwatch', value: 'averageTATReport' },
  { name: 'Timesheet Report', icon: 'fas fa-clock', value: 'timesheetReport' },
]

function Reportsnew() {

  const [filter, setFilter] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'jobStatusReport':
        return <JobStatusReport /> 
      case 'jobsReceivedSentReports':
        return <div>Job Summary Report Content</div>;
      case 'jobSummaryReport':
        return <JobSummaryReport />
      case 'jobsPendingReport':
        return <JobPendingReport />;
      case 'dueByReport':
        return <div>Due By Report Content</div>;
      case 'teamPerformanceReport':
        return <TeamMonthlyReport />;
      case 'timesheetReport':
        return <TimesheetReport />
      case 'averageTATReport':
        return <div>Average TAT Report Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className='container-fluid'>
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-9">
                <>
                  <ul className="nav nav-pills rounded-tabs" role="tablist">
                    {
                      tabs.map((tab, index) => (
                        <li className="nav-item" role="presentation" key={tab.value}>
                          <button
                            className={`nav-link ${activeTab === tab.value ? 'active' : ''}`}
                            id={tab.value}
                            data-bs-toggle="pill"
                            data-bs-target={`#${tab.value}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.value}
                            aria-selected={activeTab === tab.value ? 'true' : 'false'}
                            onClick={() => handleTabClick(tab.value)}
                          >
                            <i className={tab.icon}></i>
                            {tab.name}
                          </button>
                        </li>
                      ))
                    }
                  </ul>
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
