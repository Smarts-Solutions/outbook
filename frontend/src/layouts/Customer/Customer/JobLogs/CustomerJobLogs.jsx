import React, { useEffect, useState } from "react";
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

const CustomerJobLogs = () => {
  const location = useLocation();
  const tab = sessionStorage.getItem("activeTab2") || "job information";
  const [selectedTab, setSelectedTab] = useState(tab);
  const [getAccessDataJob, setAccessDataJob] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
  });

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job",
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

  useEffect(() => {}, [tab]);

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
                        <Info size={18} className="me-1"/>
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
                        <Clock size={18} className="me-1" />
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
                        <Table size={18} className="me-1" />
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
                        <HelpCircle size={18} className="me-1"/>
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
                        <Folder  size={18} className="me-1" />
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
                        location.state.goto == "report"
                          ? "client"
                          : location.state.activeTab || "client",
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

      {location?.state?.goto == "report" ? (
        ""
      ) : (
        <Hierarchy
          show={
            location?.state?.goto == "Customer"
              ? ["Customer", "Job", selectedTab]
              : ["Customer", "Client", "Job", selectedTab]
          }
          active={location.state.goto == "Customer" ? 2 : 3}
          data={location.state.data}
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
            job_id={location?.state?.job_id}
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
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
            getAccessDataJob={getAccessDataJob}
            goto={location?.state?.goto}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerJobLogs;
