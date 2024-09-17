import React , {useEffect , useState} from 'react'
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

  console.log(selectedTab)
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

      <Hierarchy show={["Customer" , "Client" , "Job" , selectedTab  ]} active={3} id={location.state}/>

      <div className="tab-content report-data mt-4" id="pills-tabContent">

        <div
          className="tab-pane fade show active"
          id="job-information"
          role="tabpanel"
          aria-labelledby="job-information-tab"
        >
          <JobInformation job_id={location.state.job_id} />
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