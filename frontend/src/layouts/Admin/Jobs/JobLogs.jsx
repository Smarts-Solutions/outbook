import React from 'react'
import Datatable from '../../../Components/ExtraComponents/Datatable';
import TaskTimesheet from './TaskTimesheet';
import MissingLogs from './MissingLogs';
import Queries from './Queries';
import Drafts from './Drafts';
import Documents from './Documents';
import JobTimeline from './JobTimeline'
import JobInformation from './JobInformation';
import CommonModal from '../../../Components/ExtraComponents/Modals/Modal';
import { useLocation } from 'react-router-dom';

const data = [
  { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },

];


const columns = [
  { name: 'Trading Name', selector: row => row.TradingName, sortable: true },
  { name: 'Customer Code', selector: row => row.Code, sortable: true },
  { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
  { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
  { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
  { name: 'Account Manager', selector: row => row.JobType, sortable: true },
]


const JobLogs = () => {
  const location = useLocation();
 
  return (
    <div className='container-fluid'>

      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-8">
                <>
                  <ul className="nav nav-pills rounded-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="job-information-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#job-information"
                        type="button"
                        role="tab"
                        aria-controls="job-information"
                        aria-selected="true"
                      >
                        Job Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="task-timesheet-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#task-timesheet"
                        type="button"
                        role="tab"
                        aria-controls="task-timesheet"
                        aria-selected="false"
                      >
                        Task Timesheet
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="job-timeline-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#job-timeline"
                        type="button"
                        role="tab"
                        aria-controls="job-timeline"
                        aria-selected="false"
                      >
                        Job Timeline
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="missing-logs-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#missing-logs"
                        type="button"
                        role="tab"
                        aria-controls="missing-logs"
                        aria-selected="false"
                      >
                        Missing Logs
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="queries-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#queries"
                        type="button"
                        role="tab"
                        aria-controls="queries"
                        aria-selected="false"
                      >
                        Queries
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="drafts-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#drafts"
                        type="button"
                        role="tab"
                        aria-controls="drafts"
                        aria-selected="false"
                      >
                        Drafts
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="documents-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#documents"
                        type="button"
                        role="tab"
                        aria-controls="documents"
                        aria-selected="false"
                      >
                        Documents
                      </button>
                    </li>

                  </ul>


                </>

              </div>
              <div className="col-md-4">

                <div className="page-title-right">
                  <div
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={() => window.history.back()}
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
      <div className="row ">
        <div className="col-sm-12">
        <div className="breadcrumb">
    <a href="#" className='active'>
      <span className="breadcrumb__inner">
        <span className="breadcrumb__title">Customer</span>
        <span className="breadcrumb__desc">First Item</span>
      </span>
    </a>
    <a href="#" className='active'>
      <span className="breadcrumb__inner">
        <span className="breadcrumb__title">Client</span>
        <span className="breadcrumb__desc">Second Item</span>
      </span>
    </a>
    <a href="#" className='active'>
      <span className="breadcrumb__inner">
        <span className="breadcrumb__title">Job</span>
        <span className="breadcrumb__desc">Third Item</span>
      </span>
    </a>
    <a href="#">
      <span className="breadcrumb__inner">
        <span className="breadcrumb__title">Page Depth 04</span>
        <span className="breadcrumb__desc">Fourth Item</span>
       
      </span>
    </a>
  
  </div>

        </div>

      </div>
      <div className="tab-content report-data mt-4" id="pills-tabContent">

        <div
          className="tab-pane fade show active"
          id="job-information"
          role="tabpanel"
          aria-labelledby="job-information-tab"
        >
          <JobInformation job_id = {location.state.job_id} />
        </div>

        <div
          className="tab-pane fade"
          id="job-timeline"
          role="tabpanel"
          aria-labelledby="job-timeline-tab"
        >
          <JobTimeline />
        </div>
        <div
          className="tab-pane fade"
          id="task-timesheet"
          role="tabpanel"
          aria-labelledby="task-timesheet-tab"
        >
          <TaskTimesheet />
        </div>
        <div
          className="tab-pane fade"
          id="missing-logs"
          role="tabpanel"
          aria-labelledby="missing-logs-tab"
        >
          <MissingLogs />
        </div>
        <div
          className="tab-pane fade"
          id="queries"
          role="tabpanel"
          aria-labelledby="queries-tab"
        >
          <Queries />
        </div>
        <div
          className="tab-pane fade"
          id="drafts"
          role="tabpanel"
          aria-labelledby="drafts-tab"
        >
          <Drafts />
        </div>
        <div
          className="tab-pane fade"
          id="documents"
          role="tabpanel"
          aria-labelledby="documents-tab"
        >
          <Documents />
        </div>

      </div>

    </div>
  )
}

export default JobLogs