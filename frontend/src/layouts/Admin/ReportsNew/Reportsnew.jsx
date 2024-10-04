import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import ExpandableTable from '../../../Components/ExtraComponents/ExpandableTable';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';


const data = [
  { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },

];


const columns1 = [
  { name: 'Customer Code', selector: row => row.Code, sortable: true },
]
const columns = [

  {
    name: 'Trading Name',
    cell: (row) => (
      <div>
        <span onClick={(e) => console.log(e.target)} className="mx-3 pointer  Plas-center">
          +
        </span>
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
                        <li className="nav-item" role="presentation">
                          <button
                            className={`nav-link ${index === 1 ? 'active' : ''}`}
                            id={tab.value}
                            data-bs-toggle="pill"
                            data-bs-target={`#${tab.value}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.value}
                            aria-selected={index === 1 ? 'true' : 'false'}
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
        <div className="tab-pane fade show active" id="job-status" role="tabpanel" aria-labelledby="job-status-tab"  >
          <div className='report-data'>
            <div className='tab-title'>
              <h3>Job Status Report</h3>
            </div>
            <div className='job-filter-btn'>
              <button className='filter btn btn-info text-white fw-normal' onClick={() => setFilter(true)}><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
            </div>
            <div className='datatable-wrapper mt-minus'>
              <Datatable
                filter={true}
                columns={columns} data={data} />
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="job-received" role="tabpanel" aria-labelledby="job-received-tab" >
          <div className='report-data'>
            <div className='tab-title'>
              <h3>Jobs Received Sent Reports</h3>
            </div>
            <div className='job-filter-btn'>
              <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
            </div>
            <div className='datatable-wrapper mt-minus'>
              <ExpandableTable
                columns={columns}
                data={data}
                filter={true}
              />
            </div>
          </div>
        </div>

        <div
          className="tab-pane fade"
          id="team-performance"
          role="tabpanel"
          aria-labelledby="team-performance-tab"
        >
          <div className='report-data'>
            <div className='tab-title'>
              <h3>Team Performance Report by Month</h3>
            </div>
            <div className='job-filter-btn'>
              <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
            </div>
            <div className='datatable-wrapper mt-minus'>
              <Datatable
                filter={true}
                columns={columns} data={data} />
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="average-TAT"
          role="tabpanel"
          aria-labelledby="average-TAT-tab"
        >
          <div className='report-data'>
            <div className='tab-title'>
              <h3>Average TAT Report</h3>
            </div>
            <div className='job-filter-btn'>
              <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
            </div>
            <div className='datatable-wrapper mt-minus'>
              <ExpandableTable
                columns={columns}
                data={data}
                filter={true}
              />
            </div>
          </div>
        </div>

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

        <div className="row">
          <div className="accordion" id="default-accordion-example">
            <div className="accordion-item mt-2">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button "
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Date Range
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapsed"
                aria-labelledby="headingOne"
                data-bs-parent="#default-accordion-example"
                style={{}}
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-10">
                          <div className="row">
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  This Week
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Last Week
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  This Month
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Last Month
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  This Quarter
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Last Quarter
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-10">
                          <div className="row">
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  This 6 Months
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Last 6 Months
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  This Year
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Last Year
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input "
                                  type="checkbox"
                                  id="customdate"
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="customdate"
                                >
                                  Custom Date Range
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="accordion-item mt-2">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="true"
                  aria-controls="collapseTwo"
                >
                  Job Type
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#default-accordion-example"
                style={{}}
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-10">
                          <div className="row">
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                  defaultChecked=""
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  All
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                  defaultChecked=""
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  Year End
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item mt-2">
              <h2 className="accordion-header" id="headingFour">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFour"
                  aria-expanded="true"
                  aria-controls="collapseFour"
                >
                  Service Type
                </button>
              </h2>
              <div
                id="collapseFour"
                className="accordion-collapse collapse"
                aria-labelledby="headingFour"
                data-bs-parent="#default-accordion-example"
                style={{}}
              >
                <div className="accordion-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="row">
                        <div className="col-md-10">
                          <div className="row">
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                  defaultChecked=""
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  All
                                </label>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="form-check form-check-outline form-check-dark">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="formCheck"
                                  defaultChecked=""
                                />
                                <label
                                  className="form-check-label new_checkbox"
                                  htmlFor="formCheck"
                                >
                                  LTD
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3 mt-3">
              <label htmlFor="firstNameinput" className="form-label">
                Account Manager
              </label>
              <div>
                <datalist id="suggestions">
                  <option>Ajeet Agarwal</option>
                  <option>Hemant D</option>
                </datalist>
                <input
                  type="text"
                  placeholder="Search Account Manager"
                  className="form-control"
                  autoComplete="on"
                  list="suggestions"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3 mt-3">
              <label htmlFor="firstNameinput" className="form-label">
                Customer
              </label>
              <div>
                <datalist id="suggestions1">
                  <option>Outbooks Outsourcing PVT LTD</option>
                  <option>NSGC LTD</option>
                </datalist>
                <input
                  type="text"
                  placeholder="Search Customer"
                  className="form-control"
                  autoComplete="on"
                  list="suggestions1"
                />
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3 mt-3">
              <label htmlFor="firstNameinput" className="form-label">
                Processor
              </label>
              <div>
                <datalist id="suggestions2">
                  <option>Harsh Mehta </option>
                  <option>Devang Agarwal</option>
                </datalist>
                <input
                  type="text"
                  placeholder="Search Processor"
                  className="form-control"
                  autoComplete="on"
                  list="suggestions2"
                />
              </div>
            </div>
          </div>
        </div>
      </CommanModal >
    </div>

  );
}

export default Reportsnew;
