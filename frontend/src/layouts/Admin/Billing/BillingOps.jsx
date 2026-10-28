import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import {
  Plus,
  Download,
  AlertTriangle,
  X,
  Check,
  LayoutDashboard,
  PlusCircle,
  CheckCircle,
  CreditCard,
  Sliders,
  Database
} from "lucide-react";

const BillingOps = ({ initialTab }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    initialTab || location.state?.tab || sessionStorage.getItem("activeBillingTab") || "dashboard"
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [initialTab, location.state]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    sessionStorage.setItem("activeBillingTab", tabId);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [currentCycle] = useState("Aug-26");

  // Wizard state for Submit Billing
  const [submitStep, setSubmitStep] = useState(1);
  const [selectedPractice, setSelectedPractice] = useState("Acorn Accountancy LLP");
  const [selectedEngagement, setSelectedEngagement] = useState(1);
  const [formValues, setFormValues] = useState({
    assignmentName: "August Bookkeeping & Reconciliations",
    workType: "Bookkeeping",
    periodType: "Month",
    periodValue: "2026-08",
    qty: "1",
    discountPct: "0",
    assignmentOverride: "",
  });

  const [contributors, setContributors] = useState([
    { id: 1, name: "Priya Sharma", pct: 60 },
    { id: 2, name: "Rahul Verma", pct: 40 },
  ]);

  // Approvals & return state
  const [returningId, setReturningId] = useState(null);
  const [returnNote, setReturnNote] = useState("");

  // Submissions list
  const [submissions, setSubmissions] = useState([
    {
      id: 101,
      practice: "Acorn Accountancy LLP",
      client: "Peak Digital Ltd",
      model: "FTE",
      workType: "Bookkeeping",
      assignmentName: "Aug Dedicated Bookkeeper",
      periodLabel: "Aug-26",
      submittedBy: "Priya Sharma",
      submittedAt: "2026-08-28 14:30",
      gross: 1850.0,
      discountPct: 0,
      net: 1850.0,
      currency: "GBP",
      status: "Pending Manager Approval",
      manager: "David Smith",
      qtyInfo: "1.00 FTE",
      rateInfo: "£1,850.00 /FTE",
      revenueSplit: "Priya Sharma (100%)",
    },
    {
      id: 102,
      practice: "Highland Chartered CPAs",
      client: "Glen View Hotels",
      model: "ADHOC",
      workType: "Payroll",
      assignmentName: "Monthly Payroll Run",
      periodLabel: "W/E 24-Aug-2026",
      submittedBy: "Amit Patel",
      submittedAt: "2026-08-27 11:15",
      gross: 650.0,
      discountPct: 5,
      net: 617.5,
      currency: "GBP",
      status: "Pending Credit Control Approval",
      manager: "Sarah Jenkins",
      qtyInfo: "26 hrs",
      rateInfo: "£25.00 /hr",
      revenueSplit: "Amit Patel (70%), Priya Sharma (30%)",
    },
    {
      id: 103,
      practice: "Sterling Tax & Advisory",
      client: "Crestview Holdings",
      model: "PCT_SHARING",
      workType: "Accounts Finalisation",
      assignmentName: "Q2 Accounts Sharing",
      periodLabel: "QE 30-Jun-2026",
      submittedBy: "Sunil Rao",
      submittedAt: "2026-08-26 16:45",
      gross: 3200.0,
      discountPct: 0,
      net: 3200.0,
      currency: "GBP",
      status: "Approved",
      manager: "David Smith",
      qtyInfo: "End Client: £16,000",
      rateInfo: "20% Share",
      revenueSplit: "Sunil Rao (100%)",
      invoiceNo: "INV-2026-0891",
      billDate: "2026-08-31",
    },
    {
      id: 104,
      practice: "Vanguard Accounting",
      client: "TechStream Solutions",
      model: "FIXED_COMMITMENT",
      workType: "Yearend",
      assignmentName: "Year-End Statutory Filing",
      periodLabel: "Aug-26",
      submittedBy: "Priya Sharma",
      submittedAt: "2026-08-25 10:20",
      gross: 1200.0,
      discountPct: 0,
      net: 1200.0,
      currency: "GBP",
      status: "Returned",
      manager: "David Smith",
      qtyInfo: "45 hrs (40 incl, 5 excess)",
      rateInfo: "£1,000 fixed + £40/hr excess",
      revenueSplit: "Priya Sharma (100%)",
      returnNote: "Excess hours not pre-approved by client manager.",
    },
  ]);

  // Missing monthly engagements
  const [missingEngagements] = useState([
    {
      id: 1,
      practice: "Acorn Accountancy LLP",
      client: "Northern Logistics",
      model: "FTE",
      serviceLine: "Bookkeeping",
      manager: "David Smith",
    },
    {
      id: 2,
      practice: "Sterling Tax & Advisory",
      client: "Apex Manufacturing",
      model: "ADHOC",
      serviceLine: "Payroll",
      manager: "Sarah Jenkins",
    },
    {
      id: 3,
      practice: "Highland Chartered CPAs",
      client: "Lochside Retail",
      model: "PCT_SHARING",
      serviceLine: "Accounts Finalisation",
      manager: "David Smith",
    },
  ]);

  // Invoices for Credit Control
  const [invoices, setInvoices] = useState([
    {
      id: 1,
      practice: "Sterling Tax & Advisory",
      client: "Crestview Holdings",
      number: "INV-2026-0891",
      billDate: "2026-08-15",
      dueDate: "2026-08-29",
      amount: 3200.0,
      currency: "GBP",
      paidDate: null,
      daysLate: 5,
    },
    {
      id: 2,
      practice: "Acorn Accountancy LLP",
      client: "Apex Distribution",
      number: "INV-2026-0842",
      billDate: "2026-07-28",
      dueDate: "2026-08-11",
      amount: 1450.0,
      currency: "GBP",
      paidDate: "2026-08-08",
      daysLate: 0,
    },
    {
      id: 3,
      practice: "Vanguard Accounting",
      client: "Metro Retailers",
      number: "INV-2026-0790",
      billDate: "2026-06-15",
      dueDate: "2026-06-29",
      amount: 2100.0,
      currency: "GBP",
      paidDate: null,
      daysLate: 60,
    },
  ]);

  const handleApprove = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleReturnConfirm = (id) => {
    if (!returnNote.trim()) return;
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: "Returned", returnNote: returnNote }
          : item
      )
    );
    setReturningId(null);
    setReturnNote("");
  };

  // Outbook Standard Datatable Column definitions
  const missingColumns = [
    { name: "Practice", selector: (row) => row.practice, sortable: true },
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
      cell: (row) => (
        <a style={{ color: "#26bdf0", cursor: "pointer", fontWeight: 500 }}>
          {row.client}
        </a>
      ),
    },
    { name: "Model", selector: (row) => row.model, sortable: true },
    { name: "Service Line", selector: (row) => row.serviceLine, sortable: true },
    { name: "Approving Manager", selector: (row) => row.manager, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-info text-white btn-sm"
          onClick={() => {
            setSelectedPractice(row.practice);
            setSelectedEngagement(row.id);
            setActiveTab("submit");
            setSubmitStep(2);
          }}
        >
          Submit Billing
        </button>
      ),
    },
  ];

  const recentColumns = [
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
      cell: (row) => (
        <div>
          <a style={{ color: "#26bdf0", cursor: "pointer", fontWeight: 500 }}>
            {row.client}
          </a>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.practice}</div>
        </div>
      ),
    },
    { name: "Assignment", selector: (row) => row.assignmentName, sortable: true },
    { name: "Period", selector: (row) => row.periodLabel, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    {
      name: "Net Amount",
      selector: (row) => row.net,
      sortable: true,
      cell: (row) => <span className="fw-bold">£{row.net.toFixed(2)}</span>,
    },
    { name: "Revenue Split", selector: (row) => row.revenueSplit },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        let statusColor = "#f1b44c";
        if (row.status === "Approved" || row.status === "Invoiced") statusColor = "#50a5f1";
        if (row.status === "Returned") statusColor = "#f46a6a";
        return (
          <span style={{ color: statusColor, fontWeight: 600, fontSize: "12px" }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const approvalsColumns = [
    {
      name: "Submitted By",
      selector: (row) => row.submittedBy,
      cell: (row) => (
        <div>
          <div className="fw-bold">{row.submittedBy}</div>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.submittedAt}</div>
        </div>
      ),
    },
    {
      name: "Client & Practice",
      selector: (row) => row.client,
      cell: (row) => (
        <div>
          <a style={{ color: "#26bdf0", fontWeight: 500 }}>{row.client}</a>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.practice}</div>
        </div>
      ),
    },
    { name: "Model", selector: (row) => row.model },
    {
      name: "Assignment",
      selector: (row) => row.assignmentName,
      cell: (row) => (
        <div>
          <div>{row.assignmentName}</div>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.workType}</div>
        </div>
      ),
    },
    { name: "Period", selector: (row) => row.periodLabel },
    {
      name: "Rate / Qty",
      cell: (row) => (
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600 }}>{row.qtyInfo}</div>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.rateInfo}</div>
        </div>
      ),
    },
    {
      name: "Net Amount",
      selector: (row) => row.net,
      cell: (row) => <span className="fw-bold">£{row.net.toFixed(2)}</span>,
    },
    { name: "Revenue Split", selector: (row) => row.revenueSplit },
    {
      name: "Action",
      cell: (row) =>
        returningId === row.id ? (
          <div className="d-flex flex-column gap-1 py-1">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Reason..."
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
            />
            <div className="d-flex gap-1 justify-content-end">
              <button
                type="button"
                className="btn btn-danger btn-sm py-0 px-2"
                onClick={() => handleReturnConfirm(row.id)}
              >
                Return
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm py-0 px-2"
                onClick={() => setReturningId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex gap-1">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                setReturningId(row.id);
                setReturnNote("");
              }}
            >
              Return
            </button>
            <button
              type="button"
              className="btn btn-info text-white btn-sm"
              onClick={() =>
                handleApprove(
                  row.id,
                  row.status === "Pending Manager Approval"
                    ? "Pending Credit Control Approval"
                    : "Approved"
                )
              }
            >
              {row.status === "Pending Manager Approval" ? "Manager Approve" : "CC Approve"}
            </button>
          </div>
        ),
    },
  ];

  const tabsList = [
    { id: "dashboard", label: "My Dashboard" },
    { id: "submit", label: "Submit Billing" },
    { id: "approvals", label: "Approvals" },
    { id: "credit", label: "Credit Control" },
    { id: "control", label: "Billing Control Centre" },
    { id: "master", label: "Master Data" },
  ];

  return (
    <div>
      <div className="container-fluid">
        {/* Outbook Content-Title Header */}
        <div className="content-title">
          <div className="row align-items-center">
            <div className="col-12 col-sm-6">
              <div className="tab-title">
                <h3 className="mt-0">Billing Operations</h3>
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="d-flex justify-content-sm-end align-items-center gap-2 mt-3 mt-sm-0">
                <button
                  type="button"
                  className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-1"
                >
                  <Download size={16} /> Export Excel
                </button>
                <button
                  type="button"
                  className="btn btn-info text-white d-flex align-items-center gap-1"
                  onClick={() => {
                    setActiveTab("submit");
                    setSubmitStep(1);
                  }}
                >
                  <Plus size={16} /> Add Billing
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Outbook Standard nav-pills rounded-tabs */}
        <div className="page-title-box pt-2 pb-0">
          <div className="row align-items-center">
            <div className="col-12">
              <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
                {tabsList.map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                      id={`${tab.id}-tab`}
                      type="button"
                      role="tab"
                      onClick={() => handleTabClick(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Body with Outbook report-data layout */}
        <div className="report-data mt-4">
          {/* TAB 1: DASHBOARD (ONLY TILES EXACTLY MATCHING MAIN DASHBOARD) */}
          {activeTab === "dashboard" && (
            <div className="row justify-content-center">
              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("master")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          ENGAGEMENTS IN SCOPE
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">48</h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/users.png"
                          alt="engagements"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("control")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          UNBILLED THIS MONTH
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">{missingEngagements.length}</h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/time-management.png"
                          alt="unbilled"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("approvals")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          AWAITING APPROVAL
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">
                          {
                            submissions.filter(
                              (s) =>
                                s.status === "Pending Manager Approval" ||
                                s.status === "Pending Credit Control Approval"
                            ).length
                          }
                        </h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/pending.png"
                          alt="awaiting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("approvals")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          RETURNED ENTRIES
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">
                          {submissions.filter((s) => s.status === "Returned").length}
                        </h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/suitcase.png"
                          alt="returned"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("credit")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          READY TO INVOICE
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">
                          {submissions.filter((s) => s.status === "Approved").length}
                        </h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/handshake.png"
                          alt="ready to invoice"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="col-md-12 col-xl-4 col-lg-6"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveTab("credit")}
              >
                <div className="card report-card dashboard-card">
                  <div className="card-body">
                    <div className="row d-flex justify-content-center">
                      <div className="col-12">
                        <p className="text-dark mb-1 font-weight-semibold">
                          OUTSTANDING INVOICES
                        </p>
                      </div>
                      <div className="col-12 d-flex align-items-center justify-content-between">
                        <h3 className="my-4">
                          {invoices.filter((i) => !i.paidDate).length}
                        </h3>
                        <img
                          className="dashboad-img"
                          src="/assets/images/dashboards/teamwork.png"
                          alt="outstanding"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBMIT BILLING */}
          {activeTab === "submit" && (
            <div className="card">
              <div className="card-body">
                <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                  Create Billing Submission
                </h5>

                {/* Sub Tab Stepper */}
                <div className="mb-4">
                  <ul className="nav nav-pills rounded-tabs" role="tablist">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${submitStep === 1 ? "active" : ""}`}
                        onClick={() => setSubmitStep(1)}
                      >
                        1. Practice & Engagement
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${submitStep === 2 ? "active" : ""}`}
                        onClick={() => setSubmitStep(2)}
                      >
                        2. Assignment & Period
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${submitStep === 3 ? "active" : ""}`}
                        onClick={() => setSubmitStep(3)}
                      >
                        3. Figures & Revenue Split
                      </button>
                    </li>
                  </ul>
                </div>

                {submitStep === 1 && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label mb-2 fw-semibold">Practice / Firm</label>
                        <select
                          className="form-select form-control"
                          value={selectedPractice}
                          onChange={(e) => setSelectedPractice(e.target.value)}
                        >
                          <option value="Acorn Accountancy LLP">Acorn Accountancy LLP</option>
                          <option value="Highland Chartered CPAs">Highland Chartered CPAs</option>
                          <option value="Sterling Tax & Advisory">Sterling Tax & Advisory</option>
                          <option value="Vanguard Accounting">Vanguard Accounting</option>
                        </select>
                      </div>

                      <div className="form-group mb-4">
                        <label className="form-label mb-2 fw-semibold">Client Engagement</label>
                        <div className="list-group">
                          <label className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div>
                              <input
                                type="radio"
                                className="form-check-input me-2"
                                name="eng_radio"
                                checked={selectedEngagement === 1}
                                onChange={() => setSelectedEngagement(1)}
                              />
                              <strong>FTE — Bookkeeping</strong>
                              <div style={{ fontSize: "12px", color: "#6c757d" }} className="ms-4">
                                Peak Digital Ltd · David Smith · £1,850/FTE
                              </div>
                            </div>
                            <span className="badge bg-light text-dark border">FTE</span>
                          </label>

                          <label className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div>
                              <input
                                type="radio"
                                className="form-check-input me-2"
                                name="eng_radio"
                                checked={selectedEngagement === 2}
                                onChange={() => setSelectedEngagement(2)}
                              />
                              <strong>Adhoc / Hourly — Payroll</strong>
                              <div style={{ fontSize: "12px", color: "#6c757d" }} className="ms-4">
                                Glen View Hotels · Sarah Jenkins · £25.00/hr
                              </div>
                            </div>
                            <span className="badge bg-light text-dark border">ADHOC</span>
                          </label>

                          <label className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            <div>
                              <input
                                type="radio"
                                className="form-check-input me-2"
                                name="eng_radio"
                                checked={selectedEngagement === 3}
                                onChange={() => setSelectedEngagement(3)}
                              />
                              <strong>% Sharing — Accounts Finalisation</strong>
                              <div style={{ fontSize: "12px", color: "#6c757d" }} className="ms-4">
                                Crestview Holdings · David Smith · 20% Sharing
                              </div>
                            </div>
                            <span className="badge bg-light text-dark border">% SHARING</span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-info text-white"
                        onClick={() => setSubmitStep(2)}
                      >
                        Continue to Step 2 →
                      </button>
                    </div>
                  </div>
                )}

                {submitStep === 2 && (
                  <div className="row">
                    <div className="col-md-8">
                      <div className="form-group mb-3">
                        <label className="form-label mb-2 fw-semibold">Assignment Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formValues.assignmentName}
                          onChange={(e) =>
                            setFormValues({ ...formValues, assignmentName: e.target.value })
                          }
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 form-group mb-3">
                          <label className="form-label mb-2 fw-semibold">Work Type</label>
                          <select
                            className="form-select form-control"
                            value={formValues.workType}
                            onChange={(e) =>
                              setFormValues({ ...formValues, workType: e.target.value })
                            }
                          >
                            <option value="Bookkeeping">Bookkeeping</option>
                            <option value="Yearend">Yearend</option>
                            <option value="Payroll">Payroll</option>
                            <option value="Audit">Audit</option>
                            <option value="Personal Tax Return">Personal Tax Return</option>
                          </select>
                        </div>

                        <div className="col-md-6 form-group mb-3">
                          <label className="form-label mb-2 fw-semibold">Period Type</label>
                          <select
                            className="form-select form-control"
                            value={formValues.periodType}
                            onChange={(e) =>
                              setFormValues({ ...formValues, periodType: e.target.value })
                            }
                          >
                            <option value="Month">Month</option>
                            <option value="Week">Week (Week Ending)</option>
                            <option value="Quarter">Quarter</option>
                            <option value="Year">Year</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group mb-4">
                        <label className="form-label mb-2 fw-semibold">Period Date</label>
                        {formValues.periodType === "Month" ? (
                          <input
                            type="month"
                            className="form-control"
                            value={formValues.periodValue}
                            onChange={(e) =>
                              setFormValues({ ...formValues, periodValue: e.target.value })
                            }
                          />
                        ) : (
                          <input
                            type="date"
                            className="form-control"
                            onChange={(e) =>
                              setFormValues({ ...formValues, periodValue: e.target.value })
                            }
                          />
                        )}
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setSubmitStep(1)}
                        >
                          ← Back
                        </button>
                        <button
                          type="button"
                          className="btn btn-info text-white"
                          onClick={() => setSubmitStep(3)}
                        >
                          Continue to Step 3 →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {submitStep === 3 && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label mb-2 fw-semibold">Number of FTE</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={formValues.qty}
                          onChange={(e) =>
                            setFormValues({ ...formValues, qty: e.target.value })
                          }
                        />
                      </div>

                      <div className="form-group mb-3">
                        <label className="form-label mb-2 fw-semibold">Discount %</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formValues.discountPct}
                          onChange={(e) =>
                            setFormValues({ ...formValues, discountPct: e.target.value })
                          }
                        />
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <label className="form-label mb-0 fw-semibold">Revenue Allocation</label>
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm"
                          onClick={() =>
                            setContributors([
                              ...contributors,
                              { id: Date.now(), name: "Amit Patel", pct: 0 },
                            ])
                          }
                        >
                          + Add Contributor
                        </button>
                      </div>

                      {contributors.map((c, index) => (
                        <div key={c.id} className="row g-2 align-items-center mb-2">
                          <div className="col-7">
                            <select className="form-select form-control" defaultValue={c.name}>
                              <option value="Priya Sharma">Priya Sharma</option>
                              <option value="Rahul Verma">Rahul Verma</option>
                              <option value="Amit Patel">Amit Patel</option>
                              <option value="Sunil Rao">Sunil Rao</option>
                            </select>
                          </div>
                          <div className="col-4">
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control text-end"
                                value={c.pct}
                                onChange={(e) => {
                                  const list = [...contributors];
                                  list[index].pct = Number(e.target.value);
                                  setContributors(list);
                                }}
                              />
                              <span className="input-group-text">%</span>
                            </div>
                          </div>
                          <div className="col-1">
                            {contributors.length > 1 && (
                              <button
                                type="button"
                                className="btn text-danger p-0"
                                onClick={() =>
                                  setContributors(contributors.filter((_, i) => i !== index))
                                }
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="p-2 border rounded mt-2 d-flex justify-content-between align-items-center">
                        <span className="small fw-semibold">Total Allocation:</span>
                        <span
                          className={`fw-bold ${
                            contributors.reduce((acc, curr) => acc + Number(curr.pct), 0) === 100
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {contributors.reduce((acc, curr) => acc + Number(curr.pct), 0)}%
                        </span>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card border p-3">
                        <h6 className="fw-bold mb-3">Live Calculation Preview</h6>
                        <table className="table table-bordered mb-3">
                          <tbody>
                            <tr>
                              <td>Gross Amount:</td>
                              <td className="fw-bold">£1,850.00</td>
                            </tr>
                            <tr>
                              <td>Discount:</td>
                              <td className="text-danger">− £0.00</td>
                            </tr>
                            <tr>
                              <td className="fw-bold">Net Payable:</td>
                              <td className="fw-bold text-info">£1,850.00</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className="form-group mb-3">
                          <label className="form-label mb-1 small text-muted">Nomisma Description</label>
                          <div className="p-2 bg-light border rounded small">
                            Bookkeeper - August Bookkeeping & Reconciliations - Aug-26
                          </div>
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setSubmitStep(2)}
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            className="btn btn-info text-white"
                            onClick={() => {
                              alert("Submitted Successfully!");
                              setActiveTab("dashboard");
                            }}
                          >
                            Submit Entry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: APPROVALS */}
          {activeTab === "approvals" && (
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mt-0 mb-0" style={{ fontWeight: 600 }}>
                    Pending Approvals Queue
                  </h5>
                  <button
                    type="button"
                    className="btn btn-outline-info fw-bold btn-sm border-2"
                    onClick={() => {
                      setSubmissions((prev) =>
                        prev.map((s) =>
                          s.status === "Pending Manager Approval"
                            ? { ...s, status: "Pending Credit Control Approval" }
                            : s
                        )
                      );
                    }}
                  >
                    <Check size={16} /> Approve All (Manager)
                  </button>
                </div>
                <div className="datatable-wrapper">
                  <Datatable
                    columns={approvalsColumns}
                    data={submissions.filter(
                      (s) =>
                        s.status === "Pending Manager Approval" ||
                        s.status === "Pending Credit Control Approval"
                    )}
                    filter={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CREDIT CONTROL */}
          {activeTab === "credit" && (
            <div>
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                    Ready To Invoice
                  </h5>
                  <div className="datatable-wrapper">
                    <table className="table table-bordered table-striped align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Client</th>
                          <th>Nomisma Line Description</th>
                          <th>Period</th>
                          <th className="text-end">Net Amount</th>
                          <th style={{ width: "160px" }}>Bill Number</th>
                          <th style={{ width: "160px" }}>Bill Date</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.filter((s) => s.status === "Approved").length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-3 text-muted">
                              No approved items waiting for billing.
                            </td>
                          </tr>
                        ) : (
                          submissions
                            .filter((s) => s.status === "Approved")
                            .map((s) => (
                              <tr key={s.id}>
                                <td>
                                  <a style={{ color: "#26bdf0", fontWeight: 500 }}>{s.client}</a>
                                  <div style={{ fontSize: "11px", color: "#6c757d" }}>{s.practice}</div>
                                </td>
                                <td>
                                  {s.workType} - {s.assignmentName} - {s.periodLabel}
                                </td>
                                <td>{s.periodLabel}</td>
                                <td className="text-end fw-bold">£{s.net.toFixed(2)}</td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    defaultValue="INV-2026-0912"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    defaultValue="2026-08-31"
                                  />
                                </td>
                                <td className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-info text-white btn-sm"
                                    onClick={() => handleApprove(s.id, "Invoiced")}
                                  >
                                    Mark Billed
                                  </button>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body">
                  <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                    Invoices & Collections Register
                  </h5>
                  <div className="datatable-wrapper">
                    <table className="table table-bordered table-striped align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Client</th>
                          <th>Invoice #</th>
                          <th>Bill Date</th>
                          <th>Due Date</th>
                          <th className="text-end">Amount</th>
                          <th>Status</th>
                          <th className="text-end">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>
                              <a style={{ color: "#26bdf0", fontWeight: 500 }}>{inv.client}</a>
                              <div style={{ fontSize: "11px", color: "#6c757d" }}>{inv.practice}</div>
                            </td>
                            <td className="fw-bold">{inv.number}</td>
                            <td>{inv.billDate}</td>
                            <td>{inv.dueDate}</td>
                            <td className="text-end fw-bold">
                              {inv.currency} {inv.amount.toFixed(2)}
                            </td>
                            <td>
                              {inv.paidDate ? (
                                <span className="text-success fw-bold">Paid ({inv.paidDate})</span>
                              ) : (
                                <span className="text-warning fw-bold">Outstanding</span>
                              )}
                            </td>
                            <td className="text-end">
                              {inv.paidDate ? (
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={() =>
                                    setInvoices(
                                      invoices.map((i) =>
                                        i.id === inv.id ? { ...i, paidDate: null } : i
                                      )
                                    )
                                  }
                                >
                                  Undo
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    setInvoices(
                                      invoices.map((i) =>
                                        i.id === inv.id
                                          ? { ...i, paidDate: new Date().toISOString().split("T")[0] }
                                          : i
                                      )
                                    )
                                  }
                                >
                                  Mark Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTROL CENTRE */}
          {activeTab === "control" && (
            <div className="card">
              <div className="card-body">
                <div className="row mb-3 align-items-center">
                  <div className="col-md-4">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="form-control"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select form-control"
                      value={modelFilter}
                      onChange={(e) => setModelFilter(e.target.value)}
                    >
                      <option value="">All Models</option>
                      <option value="FTE">FTE</option>
                      <option value="ADHOC">Adhoc</option>
                      <option value="PCT_SHARING">% Sharing</option>
                      <option value="FIXED_COMMITMENT">Fixed Fee</option>
                    </select>
                  </div>
                </div>

                <div className="datatable-wrapper">
                  <Datatable
                    columns={recentColumns}
                    data={submissions.filter(
                      (s) =>
                        (modelFilter === "" || s.model === modelFilter) &&
                        (searchTerm === "" ||
                          s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.practice.toLowerCase().includes(searchTerm.toLowerCase()))
                    )}
                    filter={false}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MASTER DATA */}
          {activeTab === "master" && (
            <div className="card">
              <div className="card-body">
                <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                  Master Engagements & Rate Cards
                </h5>
                <div className="datatable-wrapper">
                  <table className="table table-bordered table-striped align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Practice Name</th>
                        <th>Client</th>
                        <th>Model</th>
                        <th>Service Line</th>
                        <th>Current Rate Terms</th>
                        <th>Billing Owner (Manager)</th>
                        <th>Credit Terms</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Acorn Accountancy LLP</td>
                        <td>
                          <a style={{ color: "#26bdf0", fontWeight: 500 }}>Peak Digital Ltd</a>
                        </td>
                        <td>FTE</td>
                        <td>Bookkeeping</td>
                        <td>£1,850.00 / FTE</td>
                        <td>David Smith</td>
                        <td>14 days</td>
                      </tr>
                      <tr>
                        <td>Highland Chartered CPAs</td>
                        <td>
                          <a style={{ color: "#26bdf0", fontWeight: 500 }}>Glen View Hotels</a>
                        </td>
                        <td>ADHOC</td>
                        <td>Payroll</td>
                        <td>£25.00 / hour</td>
                        <td>Sarah Jenkins</td>
                        <td>30 days</td>
                      </tr>
                      <tr>
                        <td>Sterling Tax & Advisory</td>
                        <td>
                          <a style={{ color: "#26bdf0", fontWeight: 500 }}>Crestview Holdings</a>
                        </td>
                        <td>PCT_SHARING</td>
                        <td>Accounts Finalisation</td>
                        <td>20.00% of Billing</td>
                        <td>David Smith</td>
                        <td>14 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingOps;
