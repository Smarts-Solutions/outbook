import React, { useState } from "react";
import Swal from "sweetalert2";
import { Send, CheckCircle2, RefreshCw, FileText } from "lucide-react";
import { SEND_TRIGGER_TEST } from "../../../Services/TriggerTest/triggerTestService";

const AVAILABLE_REPORTS = [
  {
    key: "wip_7_days",
    name: "Jobs in WIP or to be started - Status not updated in 7 days",
    desc: "WIP & To Be Started jobs with customer month-wise ageing",
  },
  {
    key: "sitting_over_month",
    name: "Jobs Sitting With Staff For Over Month",
    desc: "Jobs received over 30 days ago and still pending",
  },
  {
    key: "not_delivered_14_days",
    name: "Jobs Not Delivered Within 14 Days",
    desc: "Jobs older than 14 days and not yet delivered",
  },
  {
    key: "missing_paperwork_7_days",
    name: "Jobs Not Delivered Missing Paperwork 7 Days",
    desc: "Missing paperwork reviewed > 7 days ago",
  },
  {
    key: "missing_paperwork_2_days",
    name: "Missing Paperwork In Max 2 Days",
    desc: "Missing paperwork pending review within 2 days",
  },
  {
    key: "expected_delivery_date_changed",
    name: "Expected Delivery Date Changed Report",
    desc: "Jobs where expected delivery date has been modified",
  },
  {
    key: "missing_timesheet",
    name: "Missing Timesheet Report",
    desc: "Staff who haven't submitted timesheets",
  },
];

const TriggerReportTest = () => {
  const getRawToken = () => {
    try {
      const stored = localStorage.getItem("token");
      if (!stored) return "";
      try {
        return JSON.parse(stored);
      } catch (e) {
        return stored;
      }
    } catch (e) {
      return "";
    }
  };

  const staffDetails = JSON.parse(localStorage.getItem("staffDetails") || "{}");
  const role = JSON.parse(localStorage.getItem("role") || '""');

  if (role !== "SUPERADMIN") {
    return (
      <div className="container-fluid px-3 py-5 text-center">
        <div className="alert alert-danger d-inline-block px-4 py-3 shadow-sm rounded-3">
          <h4 className="fw-bold mb-2">Access Denied</h4>
          <p className="mb-0">This testing panel is restricted to Super Admin only.</p>
        </div>
      </div>
    );
  }

  const [email, setEmail] = useState(staffDetails?.email );
  const [reportType, setReportType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [dispatchResults, setDispatchResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter a valid recipient email address.",
      });
      return;
    }

    setLoading(true);
    setDispatchResults([]);

    try {
      const activeToken = getRawToken();
      const res = await SEND_TRIGGER_TEST(
        { email: email.trim(), reportType },
        activeToken
      );

      if (res?.status) {
        setDispatchResults(res?.data || []);
        Swal.fire({
          icon: "success",
          title: "Report Triggered!",
          text: res?.message || `Report process initiated for ${email}`,
          timer: 3500,
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Trigger Failed",
          text: res?.message || "Something went wrong while dispatching report.",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: err?.message || "Could not connect to trigger test service.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-3 py-2">
      <div className="report-data">
        {/* Title */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="tab-title">
            <h3 className="mb-0 fw-bold">Trigger Reports Test</h3>
          </div>
        </div>

        {/* Card */}
        <div className="card border-0 shadow-sm rounded-3">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Recipient Email Row */}
              <div className="row mb-4">
                <div className="col-lg-6 col-md-8">
                  <label className="form-label fw-semibold text-dark">
                    Recipient Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="form-text text-muted" style={{ fontSize: "12px" }}>
                    The selected report Excel attachment will be delivered to this address.
                  </div>
                </div>
              </div>

              {/* Select Report */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-dark mb-2">
                  Select Report to Dispatch <span className="text-danger">*</span>
                </label>

                <div className="row g-3">
                  {/* All option */}
                  <div className="col-12 col-md-6">
                    <div
                      className={`p-3 border rounded-3 d-flex align-items-center ${
                        reportType === "all"
                          ? "border-primary bg-light"
                          : "border-light-subtle bg-white"
                      }`}
                      style={{ cursor: "pointer", transition: "all 0.2s" }}
                      onClick={() => setReportType("all")}
                    >
                      <div className="form-check m-0 d-flex align-items-center w-100">
                        <input
                          type="radio"
                          id="report_all"
                          name="reportSelect"
                          className="form-check-input me-3 mt-0"
                          checked={reportType === "all"}
                          onChange={() => setReportType("all")}
                        />
                        <label
                          htmlFor="report_all"
                          className="form-check-label w-100"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="fw-bold text-dark">🌟 All Triggered Reports</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>
                            Generates and dispatches all 7 triggered reports together
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reports */}
                  {AVAILABLE_REPORTS.map((r) => (
                    <div className="col-12 col-md-6" key={r.key}>
                      <div
                        className={`p-3 border rounded-3 d-flex align-items-center ${
                          reportType === r.key
                            ? "border-primary bg-light"
                            : "border-light-subtle bg-white"
                        }`}
                        style={{ cursor: "pointer", transition: "all 0.2s" }}
                        onClick={() => setReportType(r.key)}
                      >
                        <div className="form-check m-0 d-flex align-items-center w-100">
                          <input
                            type="radio"
                            id={`report_${r.key}`}
                            name="reportSelect"
                            className="form-check-input me-3 mt-0"
                            checked={reportType === r.key}
                            onChange={() => setReportType(r.key)}
                          />
                          <label
                            htmlFor={`report_${r.key}`}
                            className="form-check-label w-100"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="fw-semibold text-dark d-flex align-items-center">
                              <FileText size={16} className="me-2 text-primary flex-shrink-0" />
                              <span>{r.name}</span>
                            </div>
                            {r.desc && (
                              <div className="text-muted ms-4" style={{ fontSize: "12px" }}>
                                {r.desc}
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 rounded-pill fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="spinner-border spinner-border-sm" />
                      Dispatching Report...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Report to Email
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Results */}
            {dispatchResults && dispatchResults.length > 0 && (
              <div className="mt-4 pt-3 border-top">
                <h5 className="fw-bold mb-3 text-dark d-flex align-items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" /> Dispatch Status
                </h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-striped align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Report Name</th>
                        <th style={{ width: "120px" }} className="text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatchResults.map((item, idx) => (
                        <tr key={idx}>
                          <td className="fw-medium">{item.name}</td>
                          <td className="text-center">
                            <span className="badge bg-success px-2 py-1">
                              <CheckCircle2 size={13} className="me-1" /> {item.status || "Initiated"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerReportTest;
