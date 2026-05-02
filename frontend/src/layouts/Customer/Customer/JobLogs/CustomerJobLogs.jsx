import React, { useEffect, useState, useMemo } from "react";
import TaskTimesheet from "./CustomerTaskTimesheet";
import MissingLogs from "./CustomerMissingLogs";
import Queries from "./CustomerQueries";
import Drafts from "./CustomerDrafts";
import Documents from "./CustomerDocuments";
import JobTimeline from "./CustomerJobTimeline";
import JobInformation from "./CustomerJobInformation";
import { useLocation } from "react-router-dom";
import Hierarchy from "../../../../Components/ExtraComponents/Hierarchy";
import {
  Info,
  ArrowLeft,
  Circle,
  Clock,
  Table,
  AlertTriangle,
  HelpCircle,
  File,
  Folder,
} from "lucide-react";
import { useCustomerAccess } from "../../../../Utils/CustomerAccessContext";

const CustomerJobLogs = () => {
  const location = useLocation();
  const tab = sessionStorage.getItem("activeTab2") || "job information";
  const [selectedTab, setSelectedTab] = useState(tab);
  const role = JSON.parse(localStorage.getItem("role"));
  const { hasAccess } = useCustomerAccess();

  const [jobId, setJobId] = useState(location?.state?.job_id || sessionStorage.getItem("currentJobId"));
  const [hierarchyData, setHierarchyData] = useState(location?.state?.data || JSON.parse(sessionStorage.getItem("currentHierarchyData") || "{}"));
  const [goto, setGoto] = useState(location?.state?.goto || sessionStorage.getItem("currentGoto"));

  const getAccessDataJob = {
    insert: hasAccess("job", "insert") || role === "SUPERADMIN" ? 1 : 0,
    update: hasAccess("job", "update") || role === "SUPERADMIN" ? 1 : 0,
    delete: hasAccess("job", "delete") || role === "SUPERADMIN" ? 1 : 0,
    view: hasAccess("job", "view") || role === "SUPERADMIN" ? 1 : 0,
  };

  useEffect(() => {
    if (location?.state?.job_id) {
      setJobId(location.state.job_id);
      sessionStorage.setItem("currentJobId", location.state.job_id);
    }
    if (location?.state?.data) {
      setHierarchyData(location.state.data);
      sessionStorage.setItem("currentHierarchyData", JSON.stringify(location.state.data));
    }
    if (location?.state?.goto) {
      setGoto(location.state.goto);
      sessionStorage.setItem("currentGoto", location.state.goto);
    }
  }, [location]);


  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-8">
                <>
                  <ul className="nav nav-pills rounded-tabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${selectedTab === "job information" ? "active" : ""}`}
                        id="job-information-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#job-information"
                        type="button"
                        role="tab"
                        aria-controls="job-information"
                        aria-selected="true"
                        onClick={() => {
                          setSelectedTab("job information");
                          sessionStorage.setItem(
                            "activeTab2",
                            "job information",
                          );
                        }}
                      >
                        <Info size={18} className="me-1" />
                        Job Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "task timesheet" ? " active" : "")
                        }
                        id="task-timesheet-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#task-timesheet"
                        type="button"
                        role="tab"
                        aria-controls="task-timesheet"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("task timesheet");
                          sessionStorage.setItem(
                            "activeTab2",
                            "task timesheet",
                          );
                        }}
                      >
                        <Table size={18} className="me-1" />
                        Task Timesheet
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "job timeline" ? " active" : "")
                        }
                        id="job-timeline-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#job-timeline"
                        type="button"
                        role="tab"
                        aria-controls="job-timeline"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("job timeline");
                          sessionStorage.setItem("activeTab2", "job timeline");
                        }}
                      >
                        <Clock size={18} className="me-1" />
                        Job Timeline
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "missing logs" ? " active" : "")
                        }
                        id="missing-logs-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#missing-logs"
                        type="button"
                        role="tab"
                        aria-controls="missing-logs"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("missing logs");
                          sessionStorage.setItem("activeTab2", "missing logs");
                        }}
                      >
                        <AlertTriangle size={18} className="me-1" />
                        Missing Logs
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "queries" ? " active" : "")
                        }
                        id="queries-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#queries"
                        type="button"
                        role="tab"
                        aria-controls="queries"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("queries");
                          sessionStorage.setItem("activeTab2", "queries");
                        }}
                      >
                        <HelpCircle size={18} className="me-1" />
                        Queries
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "drafts" ? " active" : "")
                        }
                        id="drafts-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#drafts"
                        type="button"
                        role="tab"
                        aria-controls="drafts"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("drafts");
                          sessionStorage.setItem("activeTab2", "drafts");
                        }}
                      >
                        <File size={18} className="me-1" />
                        Drafts
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={
                          "nav-link" +
                          (selectedTab === "documents" ? " active" : "")
                        }
                        id="documents-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#documents"
                        type="button"
                        role="tab"
                        aria-controls="documents"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedTab("documents");
                          sessionStorage.setItem("activeTab2", "documents");
                        }}
                      >
                        <Folder size={18} className="me-1" />
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
                      sessionStorage.setItem(
                        "activeTab",
                        goto == "report"
                          ? "client"
                          : location.state?.activeTab || "client",
                      );
                      window.history.back();
                      sessionStorage.removeItem("activeTab2");
                    }}
                  >
                    <ArrowLeft size={16} /> Back
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {goto == "report" ? (
        ""
      ) : (
        <Hierarchy
          show={
            goto == "Customer"
              ? ["Customer", "Job", selectedTab]
              : ["Customer", "Client", "Job", selectedTab]
          }
          active={goto == "Customer" ? 2 : 3}
          data={hierarchyData}
        />
      )}

      <div className="tab-content report-data mt-4" id="pills-tabContent">
        <div
          className={
            "tab-pane fade" +
            (selectedTab === "job information" ? " show active" : "")
          }
          id="job-information"
          role="tabpanel"
          aria-labelledby="job-information-tab"
        >
          <JobInformation
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>

        <div
          className={
            "tab-pane fade" +
            (selectedTab === "job timeline" ? " show active" : "")
          }
          id="job-timeline"
          role="tabpanel"
          aria-labelledby="job-timeline-tab"
        >
          <JobTimeline
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
        <div
          className={
            "tab-pane fade" +
            (selectedTab === "task timesheet" ? " show active" : "")
          }
          id="task-timesheet"
          role="tabpanel"
          aria-labelledby="task-timesheet-tab"
        >
          <TaskTimesheet
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
        <div
          className={
            "tab-pane fade" +
            (selectedTab === "missing logs" ? " show active" : "")
          }
          id="missing-logs"
          role="tabpanel"
          aria-labelledby="missing-logs-tab"
        >
          <MissingLogs
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
        <div
          className={
            "tab-pane fade" + (selectedTab === "queries" ? " show active" : "")
          }
          id="queries"
          role="tabpanel"
          aria-labelledby="queries-tab"
        >
          <Queries
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
        <div
          className={
            "tab-pane fade" + (selectedTab === "drafts" ? " show active" : "")
          }
          id="drafts"
          role="tabpanel"
          aria-labelledby="drafts-tab"
        >
          <Drafts
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
        <div
          className={
            "tab-pane fade" +
            (selectedTab === "documents" ? " show active" : "")
          }
          id="documents"
          role="tabpanel"
          aria-labelledby="documents-tab"
        >
          <Documents
            job_id={jobId}
            getAccessDataJob={getAccessDataJob}
            goto={goto}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerJobLogs;
