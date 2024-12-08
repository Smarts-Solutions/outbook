import React, { useEffect, useState } from 'react'
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
import Hierarchy from '../../../Components/ExtraComponents/Hierarchy';


const JobLogs = () => {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('job information');
  const [getAccessDataJob, setAccessDataJob] = useState({ insert: 0, update: 0, delete: 0, view: 0, });

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job"
    )?.items || [];


  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    setAccessDataJob(updatedAccess);
  }, []);


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
                        onClick={() => setSelectedTab('job information')}
                      >
                        <i className='fa-solid fa-info-circle' />
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
                        onClick={() => setSelectedTab('task timesheet')}
                      >
                        <i className='fa-solid fa-clock' />
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
                        onClick={() => setSelectedTab('job timeline')}
                      >
                        <i className='fa-solid fa-table' />
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
                        onClick={() => setSelectedTab('missing logs')}
                      >
                        <i className='fa-solid fa-exclamation-triangle' />
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
                        onClick={() => setSelectedTab('queries')}
                      >
                        <i className='fa-solid fa-question-circle' />
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
                        onClick={() => setSelectedTab('drafts')}
                      >
                        <i className='fa-solid fa-file-alt' />
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
                        onClick={() => setSelectedTab('documents')}
                      >
                        <i className='fa-solid fa-folder' />
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
                    onClick={() => {
                      sessionStorage.setItem('activeTab', location.state.activeTab);
                      window.history.back()
                    }}
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Hierarchy show={location.state.goto == "Customer" ? ["Customer", "Job", selectedTab] : ["Customer", "Client", "Job", selectedTab]} active={location.state.goto == "Customer" ? 2 : 3} data={location.state.data} />

      <div className="tab-content report-data mt-4" id="pills-tabContent">

        <div
          className="tab-pane fade show active"
          id="job-information"
          role="tabpanel"
          aria-labelledby="job-information-tab"
        >
          <JobInformation job_id={location.state.job_id} getAccessDataJob={getAccessDataJob} />
        </div>

        <div
          className="tab-pane fade"
          id="job-timeline"
          role="tabpanel"
          aria-labelledby="job-timeline-tab"
        >
          <JobTimeline getAccessDataJob={getAccessDataJob} />
        </div>
        <div
          className="tab-pane fade"
          id="task-timesheet"
          role="tabpanel"
          aria-labelledby="task-timesheet-tab"
        >
          <TaskTimesheet getAccessDataJob={getAccessDataJob} />
        </div>
        <div
          className="tab-pane fade"
          id="missing-logs"
          role="tabpanel"
          aria-labelledby="missing-logs-tab"
        >
          <MissingLogs getAccessDataJob={getAccessDataJob} />
        </div>
        <div
          className="tab-pane fade"
          id="queries"
          role="tabpanel"
          aria-labelledby="queries-tab"
        >
          <Queries getAccessDataJob={getAccessDataJob} />
        </div>
        <div
          className="tab-pane fade"
          id="drafts"
          role="tabpanel"
          aria-labelledby="drafts-tab"
        >
          <Drafts getAccessDataJob={getAccessDataJob} />
        </div>
        <div
          className="tab-pane fade"
          id="documents"
          role="tabpanel"
          aria-labelledby="documents-tab"
        >
          <Documents getAccessDataJob={getAccessDataJob} />
        </div>

      </div>

    </div>
  )
}

export default JobLogs