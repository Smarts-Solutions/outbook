import React, { useEffect, useState } from "react";
import TaskTimesheet from "./CustomerTaskTimesheet";
import MissingLogs from "./CustomerMissingLogs";
import Queries from "./CustomerQueries";
import Drafts from "./CustomerDrafts";
import Documents from "./CustomerDocuments";
import CustomerJobTimeline from "./CustomerJobTimeline";
import JobInformation from "./CustomerJobInformation";
import { useLocation } from "react-router-dom";
import Hierarchy from "../../../../Components/ExtraComponents/Hierarchy";
import {
  Info,
  ArrowLeft,
  Clock,
  AlertCircle,
  Pencil,
  FileText,
  PlayCircle,
  CheckCircle2
} from "lucide-react";
import { useCustomerAccess } from "../../../../Utils/CustomerAccessContext";

const CustomerJobLogs = () => {
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem("role"));
  const { hasAccess } = useCustomerAccess();

  const [jobId, setJobId] = useState(location?.state?.job_id || sessionStorage.getItem("currentJobId"));
  const [hierarchyData, setHierarchyData] = useState(location?.state?.data || JSON.parse(sessionStorage.getItem("currentHierarchyData") || "{}"));
  const [goto, setGoto] = useState(location?.state?.goto || sessionStorage.getItem("currentGoto"));
  
  const initialTab = sessionStorage.getItem("activeTab2") || "JobInformation";
  const [activeSubTab, setActiveSubTab] = useState(initialTab);

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

  const handleTabChange = (tabName) => {
    setActiveSubTab(tabName);
    sessionStorage.setItem("activeTab2", tabName);
  };

  useEffect(() => {
    const tabs = [
      { id: "JobInformation", key: "job_information" },
      { id: "TaskTimesheet", key: "task_timesheet" },
      { id: "Timeline", key: "job_timeline" },
      { id: "MissingLogs", key: "missing_logs" },
      { id: "Queries", key: "queries" },
      { id: "Drafts", key: "draft" },
      { id: "Documents", key: "job_document" },
    ];

    const isAccessible = (tabId) => {
      const tab = tabs.find(t => t.id === tabId);
      return tab ? (hasAccess(tab.key, "view") || role === "SUPERADMIN") : false;
    };

    if (!isAccessible(activeSubTab)) {
      const firstAccessibleTab = tabs.find(t => isAccessible(t.id));
      if (firstAccessibleTab) {
        setActiveSubTab(firstAccessibleTab.id);
      }
    }
  }, [hasAccess, role, activeSubTab]);

  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-8">
                <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
                  {(hasAccess("job_information", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "JobInformation" ? "active" : ""}`}
                        onClick={() => handleTabChange("JobInformation")}
                      >
                        <Info size={16} /> Job Information
                      </button>
                    </li>
                  )}
                  {(hasAccess("task_timesheet", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "TaskTimesheet" ? "active" : ""}`}
                        onClick={() => handleTabChange("TaskTimesheet")}
                      >
                        <Clock size={16} /> Task Timesheet
                      </button>
                    </li>
                  )}
                  {(hasAccess("job_timeline", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "Timeline" ? "active" : ""}`}
                        onClick={() => handleTabChange("Timeline")}
                      >
                        <PlayCircle size={16} /> Job Timeline
                      </button>
                    </li>
                  )}
                  {(hasAccess("missing_logs", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "MissingLogs" ? "active" : ""}`}
                        onClick={() => handleTabChange("MissingLogs")}
                      >
                        <AlertCircle size={16} /> Missing Logs
                      </button>
                    </li>
                  )}
                  {(hasAccess("queries", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "Queries" ? "active" : ""}`}
                        onClick={() => handleTabChange("Queries")}
                      >
                        <CheckCircle2 size={16} /> Queries
                      </button>
                    </li>
                  )}
                  {(hasAccess("draft", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "Drafts" ? "active" : ""}`}
                        onClick={() => handleTabChange("Drafts")}
                      >
                        <Pencil size={16} /> Drafts
                      </button>
                    </li>
                  )}
                  {(hasAccess("job_document", "view") || role === "SUPERADMIN") && (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeSubTab === "Documents" ? "active" : ""}`}
                        onClick={() => handleTabChange("Documents")}
                      >
                        <FileText size={16} /> Documents
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              <div className="col-md-4">
                <div className="page-title-right">
                  <div
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={() => {
                      sessionStorage.setItem(
                        "activeTab",
                        goto == "report" ? "client" : location.state?.activeTab || "client"
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

      {goto !== "report" && (
        <Hierarchy
          show={
            goto == "Customer"
              ? ["Customer", "Job", activeSubTab]
              : ["Customer", "Client", "Job", activeSubTab]
          }
          active={goto == "Customer" ? 2 : 3}
          data={hierarchyData}
        />
      )}

      <div className="tab-content mt-4">
        {activeSubTab === "JobInformation" && (hasAccess("job_information", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <JobInformation job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
        {activeSubTab === "TaskTimesheet" && (hasAccess("task_timesheet", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <TaskTimesheet job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} timesheet_job_id={location.state?.timesheet_job_id} />
          </div>
        )}
        {activeSubTab === "Timeline" && (hasAccess("job_timeline", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <CustomerJobTimeline job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
        {activeSubTab === "MissingLogs" && (hasAccess("missing_logs", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <MissingLogs job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
        {activeSubTab === "Queries" && (hasAccess("queries", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <Queries job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
        {activeSubTab === "Drafts" && (hasAccess("draft", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <Drafts job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
        {activeSubTab === "Documents" && (hasAccess("job_document", "view") || role === "SUPERADMIN") && (
          <div className="tab-pane fade show active">
            <Documents job_id={jobId} getAccessDataJob={getAccessDataJob} goto={goto} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerJobLogs;
