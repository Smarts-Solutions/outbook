import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import ExpandableTable from '../../../Components/ExtraComponents/ExpandableTable';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import TimesheetReport from './TimesheetReport';


const data = [
  { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  // { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' }
];



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
  { name: 'Timesheet Report', icon: 'fas fa-clock', value: 'timesheetReport' },
  { name: 'Job Status Report', icon: 'fas fa-clipboard-list', value: 'jobStatusReport' },
  { name: 'Jobs Received Sent Reports', icon: 'fas fa-inbox', value: 'jobsReceivedSentReports' },
  { name: 'Job Summary Report', icon: 'fas fa-chart-pie', value: 'jobSummaryReport' },
  { name: 'Jobs Pending Report', icon: 'fas fa-tasks', value: 'jobsPendingReport' },
  { name: 'Due By Report', icon: 'fas fa-calendar-alt', value: 'dueByReport' },
  { name: 'Team Performance Report by Month', icon: 'fas fa-users', value: 'teamPerformanceReport' },
  { name: 'Average TAT Report', icon: 'fas fa-stopwatch', value: 'averageTATReport' },
]

function Reportsnew() {

  const [filter, setFilter] = useState(false);

  const [expandedRows, setExpandedRows] = useState({
    teamMember1: false,
    customer1: false,
    client1: false,
    teamMember2: false,
    customer2: false,
    client2: false,
  });

  const toggleRow = (rowKey) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [rowKey]: !prevState[rowKey],
    }));
  };

  const [activeTab, setActiveTab] = useState(tabs[0].value);

  const handleTabClick = (tabValue) => {
    setActiveTab(tabValue);
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'timesheetReport':
        return <div>
          <TimesheetReport />
        </div>;
      case 'jobStatusReport':
        return (
          <div className='report-data'>
            <div className='datatable-wrapper mt-minus'>
              <div className="card-body">
                <div id="customerList">
                  <div className="row">
                    <div className="table-responsive report-table table-card mt-4 mb-1">
                      <div className='tab-title mb-3'>
                        <h3>Job Status Report</h3>
                      </div>
                      <table className="table align-middle table-nowrap" id="customerTable">
                        <thead className="table-light table-light table-head-blue">
                          <tr>
                            <th>Team Member Name</th>
                            <th>Task1</th>
                            <th>Task2</th>
                            <th>Task3</th>
                            <th>Total</th>
                            <th>Processor</th>
                            <th>Reviewer</th>
                            <th>Other</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody className="list form-check-all">
                          {
                            data.map((item, index) => (
                              <React.Fragment key={`teamMember${index + 1}`}>
                                <tr className="tabel_new">
                                  <td className="d-flex">
                                    <span
                                      onClick={() => toggleRow(`teamMember${index + 1}`)}
                                      className="mx-1 pointer Plas-center"
                                    >
                                      {expandedRows[`teamMember${index + 1}`] ? '-' : '+'}
                                    </span>
                                    <span>{item.CustomerName}</span>
                                  </td>
                                  <td>23</td>
                                  <td>23</td>
                                  <td>8</td>
                                  <td>4</td>
                                  <td>3</td>
                                  <td>8</td>
                                  <td>4</td>
                                  <td>23</td>
                                </tr> 
                                {expandedRows[`teamMember${index + 1}`] && (
                                  <>
                                    <tr key="customer1">
                                      <td className="d-flex ms-2">
                                        <span
                                          onClick={() => toggleRow('customer1')}
                                          className="mx-1 pointer Plas-center"
                                        >
                                          {expandedRows.customer1 ? '-' : '+'}
                                        </span>
                                        <span>Customer 1</span>
                                      </td>
                                      <td>23</td>
                                      <td>23</td>
                                      <td>8</td>
                                      <td>4</td>
                                      <td>3</td>
                                      <td>8</td>
                                      <td>4</td>
                                      <td>23</td>
                                    </tr>

                                    {expandedRows.customer1 && (
                                      <>
                                        <tr key="client1">
                                          <td className="d-flex ms-3">
                                            <span
                                              onClick={() => toggleRow('client1')}
                                              className="mx-1 pointer Plas-center"
                                            >
                                              {expandedRows.client1 ? '-' : '+'}
                                            </span>
                                            <span>Client 1</span>
                                          </td>
                                          <td>23</td>
                                          <td>23</td>
                                          <td>8</td>
                                          <td>4</td>
                                          <td>3</td>
                                          <td>8</td>
                                          <td>3</td>
                                          <td>23</td>
                                        </tr>

                                        {expandedRows.client1 && (
                                          <>
                                            <tr key="job1 mx-5">
                                              <td className="d-flex ms-5">
                                                Job 1
                                              </td>
                                              <td>4</td>
                                              <td>2</td>
                                              <td>2</td>
                                              <td>1</td>
                                              <td>1</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>23</td>
                                            </tr>
                                            <tr key="job2">
                                              <td className="d-flex ms-5">
                                                Job 2
                                              </td>
                                              <td>3</td>
                                              <td>2</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>3</td>
                                              <td>8</td>
                                              <td>4</td>
                                              <td>23</td>
                                            </tr>
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
                                )}
                              </React.Fragment>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                    <div className="row align-items-center gy-2 text-center text-sm-start">
                      <div className="col-sm">
                        <div className="text-muted">
                          Showing <span className="fw-semibold">1-2</span> of{" "}
                          <span className="fw-semibold">13</span> Records
                        </div>
                      </div>
                      <div className="col-sm-auto">
                        <ul className="pagination pagination-separated pagination-sm mb-0 justify-content-center justify-content-sm-start">
                          <li className="page-item disabled">
                            <a href="#" className="page-link">
                              <b>
                                <i className="fa fa-angle-left" />
                              </b>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a href="#" className="page-link">
                              1
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              2
                            </a>
                          </li>
                          <li className="page-item">
                            <a href="#" className="page-link">
                              <b>
                                <i className="fa fa-angle-right" />
                              </b>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'jobsReceivedSentReports':
        return <div>Jobs Received Sent Reports Content</div>;
      case 'jobSummaryReport':
        return <div>Job Summary Report Content</div>;
      case 'jobsPendingReport':
        return <div>Jobs Pending Report Content</div>;
      case 'dueByReport':
        return <div>Due By Report Content</div>;
      case 'teamPerformanceReport':
        return <div>Team Performance Report by Month Content</div>;
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
