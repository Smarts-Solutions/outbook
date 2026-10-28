import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export const SubmitBilling = () => {
  const navigate = useNavigate();
  const [submitStep, setSubmitStep] = useState(1);

  // Form State
  const [practice, setPractice] = useState("Demo Accountants LLP");
  const [engagement, setEngagement] = useState("alpha_adhoc");

  // Step 2 Form State
  const [assignmentName, setAssignmentName] = useState("");
  const [workType, setWorkType] = useState("Yearend");
  const [periodType, setPeriodType] = useState("Month");
  const [periodDate, setPeriodDate] = useState("September 2026");

  // Step 3 Form State
  const [hours, setHours] = useState("");
  const hourlyRate = 22.0;

  // Contributors State
  const [contributors, setContributors] = useState([
    { id: 1, name: "Ravi Manager", pct: 100 },
  ]);

  const engagementsData = {
    alpha_adhoc: {
      client: "Alpha Retail Ltd (Demo Accountants LLP)",
      serviceLine: "Accounts Finalisation",
      model: "Adhoc",
      manager: "Ravi Manager",
      currency: "GBP",
      rate: 22.0,
      subTitle: "Demo Accountants LLP — Adhoc — Accounts Finalisation",
    },
    peak_fte: {
      client: "Peak Digital Ltd (Acorn Accountancy LLP)",
      serviceLine: "Bookkeeping",
      model: "FTE",
      manager: "David Smith",
      currency: "GBP",
      rate: 1850.0,
      subTitle: "Acorn Accountancy LLP — FTE — Bookkeeping",
    },
    glen_adhoc: {
      client: "Glen View Hotels (Highland Chartered CPAs)",
      serviceLine: "Payroll",
      model: "Adhoc",
      manager: "Sarah Jenkins",
      currency: "GBP",
      rate: 25.0,
      subTitle: "Highland Chartered CPAs — Adhoc — Payroll",
    },
  };

  const selectedEngData = engagementsData[engagement] || engagementsData.alpha_adhoc;

  // Calculations
  const numHours = parseFloat(hours) || 0;
  const grossAmount = numHours * hourlyRate;
  const totalAllocation = contributors.reduce((acc, curr) => acc + (parseFloat(curr.pct) || 0), 0);

  const handleAddContributor = () => {
    setContributors([
      ...contributors,
      { id: Date.now(), name: "Priya Sharma", pct: 0 },
    ]);
  };

  const handleRemoveContributor = (id) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const handleContributorChange = (id, field, value) => {
    setContributors(
      contributors.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Billing submitted for approval!");
    navigate("/admin/billing/approvals");
  };

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="submit" />

        <div className="report-data mt-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* Header Title & Subtitle */}
              <div className="mb-4">
                <h4 className="fw-bold mb-1 text-dark" style={{ fontSize: "20px" }}>
                  Submit billing
                </h4>
                <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                  {selectedEngData.subTitle}
                </p>
              </div>

              {/* 3 Step Wizard Navigation Tabs */}
              <div className="mb-4 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-4 flex-wrap">
                  <button
                    type="button"
                    className={`btn btn-link text-decoration-none p-0 fw-semibold position-relative pb-2 ${
                      submitStep === 1 ? "text-dark" : "text-muted"
                    }`}
                    style={{
                      fontSize: "14px",
                      borderBottom: submitStep === 1 ? "3px solid #26bdf0" : "3px solid transparent",
                      borderRadius: 0,
                    }}
                    onClick={() => setSubmitStep(1)}
                  >
                    1 · Practice & engagement
                  </button>

                  <button
                    type="button"
                    className={`btn btn-link text-decoration-none p-0 fw-semibold position-relative pb-2 ${
                      submitStep === 2 ? "text-dark" : "text-muted"
                    }`}
                    style={{
                      fontSize: "14px",
                      borderBottom: submitStep === 2 ? "3px solid #26bdf0" : "3px solid transparent",
                      borderRadius: 0,
                    }}
                    onClick={() => setSubmitStep(2)}
                  >
                    2 · Assignment & period
                  </button>

                  <button
                    type="button"
                    className={`btn btn-link text-decoration-none p-0 fw-semibold position-relative pb-2 ${
                      submitStep === 3 ? "text-dark" : "text-muted"
                    }`}
                    style={{
                      fontSize: "14px",
                      borderBottom: submitStep === 3 ? "3px solid #26bdf0" : "3px solid transparent",
                      borderRadius: 0,
                    }}
                    onClick={() => setSubmitStep(3)}
                  >
                    3 · Figures, revenue split & submit
                  </button>
                </div>
              </div>

              {/* ================= STEP 1: Practice & Engagement ================= */}
              {submitStep === 1 && (
                <div style={{ maxWidth: "600px" }}>
                  <div className="mb-3">
                    <label className="form-label text-muted small mb-1 fw-medium">
                      Accounting practice / agent
                    </label>
                    <select
                      className="form-select"
                      value={practice}
                      onChange={(e) => setPractice(e.target.value)}
                    >
                      <option value="Demo Accountants LLP">Demo Accountants LLP</option>
                      <option value="Acorn Accountancy LLP">Acorn Accountancy LLP</option>
                      <option value="Highland Chartered CPAs">Highland Chartered CPAs</option>
                    </select>
                    <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                      3 practices available to you.
                    </small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted small mb-1 fw-medium">
                      Engagement
                    </label>
                    <select
                      className="form-select"
                      value={engagement}
                      onChange={(e) => setEngagement(e.target.value)}
                    >
                      <option value="alpha_adhoc">
                        Alpha Retail Ltd — Adhoc / Hourly (Accounts Finalisation)
                      </option>
                      <option value="peak_fte">
                        Peak Digital Ltd — FTE (Bookkeeping)
                      </option>
                      <option value="glen_adhoc">
                        Glen View Hotels — Adhoc (Payroll)
                      </option>
                    </select>
                  </div>

                  <div className="d-flex align-items-center gap-2 pt-2">
                    <button
                      type="button"
                      className="btn btn-info text-white blue-btn d-flex align-items-center gap-1"
                      onClick={() => navigate("/admin/billing/dashboard")}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white px-4 fw-semibold"
                      onClick={() => setSubmitStep(2)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 2: Assignment & Period ================= */}
              {submitStep === 2 && (
                <div style={{ maxWidth: "650px" }}>
                  {/* Context Summary Box */}
                  <div className="card bg-light border mb-4">
                    <div className="card-body p-3">
                      <div className="row g-2" style={{ fontSize: "13px" }}>
                        <div className="col-4 text-muted">Client</div>
                        <div className="col-8 fw-bold text-dark">{selectedEngData.client}</div>

                        <div className="col-4 text-muted">Service line</div>
                        <div className="col-8 text-dark">{selectedEngData.serviceLine}</div>

                        <div className="col-4 text-muted">Billing model</div>
                        <div className="col-8">
                          <span className="badge bg-light text-dark border px-2 py-1">
                            {selectedEngData.model}
                          </span>
                        </div>

                        <div className="col-4 text-muted">Approving manager</div>
                        <div className="col-8 fw-semibold text-dark">
                          {selectedEngData.manager}
                        </div>

                        <div className="col-4 text-muted">Currency</div>
                        <div className="col-8 text-dark">{selectedEngData.currency}</div>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="row g-3 mb-3">
                    <div className="col-md-7">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Name of the assignment
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type freely — e.g. Year-End Accounts"
                        value={assignmentName}
                        onChange={(e) => setAssignmentName(e.target.value)}
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label text-muted small mb-1 fw-medium">
                        Type
                      </label>
                      <select
                        className="form-select"
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                      >
                        <option value="Yearend">Yearend</option>
                        <option value="Bookkeeping">Bookkeeping</option>
                        <option value="Payroll">Payroll</option>
                        <option value="VAT Return">VAT Return</option>
                        <option value="Management Accounts">Management Accounts</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-muted small mb-1 fw-medium">
                      Billing period
                    </label>
                    <select
                      className="form-select mb-2"
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value)}
                    >
                      <option value="Month">Month</option>
                      <option value="Week">Week</option>
                      <option value="Quarter">Quarter</option>
                      <option value="One-Off">One-Off</option>
                    </select>

                    <input
                      type="text"
                      className="form-control"
                      value={periodDate}
                      onChange={(e) => setPeriodDate(e.target.value)}
                    />
                    <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>
                      Nomisma period label: Sep-26
                    </small>
                  </div>

                  <div className="d-flex align-items-center gap-2 pt-3">
                    <button
                      type="button"
                      className="btn btn-info text-white blue-btn d-flex align-items-center gap-1"
                      onClick={() => setSubmitStep(1)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white px-4 fw-semibold"
                      onClick={() => setSubmitStep(3)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: Figures, Revenue Split & Submit ================= */}
              {submitStep === 3 && (
                <div>
                  {/* Top row: Number of Hours & Live Calculation Preview */}
                  <div className="row g-4 mb-4">
                    <div className="col-md-5">
                      <div className="card border p-3 h-100">
                        <div className="mb-3">
                          <label className="form-label text-muted small mb-1 fw-medium">
                            Number of hours
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            className="form-control form-control-lg"
                            placeholder="e.g. 15"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                          />
                        </div>
                        <div className="d-flex justify-content-between align-items-center text-muted small pt-2">
                          <span>Hourly rate</span>
                          <span className="fw-bold text-dark">
                            {selectedEngData.currency} {hourlyRate.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div
                        className="card border h-100 p-3"
                        style={{ backgroundColor: "#fafbfc" }}
                      >
                        <div className="small fw-semibold text-muted mb-2">
                          Live calculation (preview)
                        </div>
                        {numHours > 0 ? (
                          <div>
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="text-muted">Calculated Total:</span>
                              <span className="fw-bold text-dark">
                                £{grossAmount.toFixed(2)}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between py-1 border-bottom">
                              <span className="text-muted">Nomisma Line:</span>
                              <span className="small text-dark fw-medium">
                                {workType} - {assignmentName || "Assignment"} - Sep-26
                              </span>
                            </div>
                            <div className="d-flex justify-content-between pt-2">
                              <span className="fw-bold">Net Billable:</span>
                              <span className="fw-bold text-info" style={{ fontSize: "16px" }}>
                                £{grossAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-dashed p-4 text-center rounded text-muted small my-auto">
                            Enter the figures on the left to see the total and the generated description.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Revenue Split Section */}
                  <div className="card border mb-4">
                    <div className="card-body p-3">
                      <div className="mb-3">
                        <h6 className="fw-bold text-dark mb-0">
                          Revenue split — who worked on this?
                        </h6>
                        <small className="text-muted" style={{ fontSize: "12px" }}>
                          Assign the billed amount across contributors
                        </small>
                      </div>

                      <div className="row g-2 mb-2 text-muted small fw-medium">
                        <div className="col-8">Contributor</div>
                        <div className="col-3">% share</div>
                        <div className="col-1"></div>
                      </div>

                      {contributors.map((c) => (
                        <div key={c.id} className="row g-2 align-items-center mb-2">
                          <div className="col-8">
                            <select
                              className="form-select form-select-sm"
                              value={c.name}
                              onChange={(e) =>
                                handleContributorChange(c.id, "name", e.target.value)
                              }
                            >
                              <option value="Ravi Manager">Ravi Manager</option>
                              <option value="Priya Sharma">Priya Sharma</option>
                              <option value="Rahul Verma">Rahul Verma</option>
                              <option value="David Smith">David Smith</option>
                            </select>
                          </div>
                          <div className="col-3">
                            <input
                              type="number"
                              className="form-control form-control-sm text-end"
                              value={c.pct}
                              onChange={(e) =>
                                handleContributorChange(c.id, "pct", e.target.value)
                              }
                            />
                          </div>
                          <div className="col-1 text-center">
                            {contributors.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-link text-danger p-0"
                                onClick={() => handleRemoveContributor(c.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm fw-semibold"
                          onClick={handleAddContributor}
                        >
                          <Plus size={14} className="me-1" /> Add contributor
                        </button>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center small">
                        <span className="text-muted">Total allocated:</span>
                        <span
                          className={`fw-bold ${
                            totalAllocation === 100 ? "text-success" : "text-danger"
                          }`}
                        >
                          {totalAllocation}% {totalAllocation === 100 && "✓"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Helper / Validation warning */}
                  {numHours <= 0 && (
                    <p className="text-muted small mb-2">
                      To continue: Number of hours must be more than 0.
                    </p>
                  )}

                  {/* Approval info callout */}
                  <div
                    className="p-3 mb-4 rounded"
                    style={{
                      backgroundColor: "#f0f9ff",
                      borderLeft: "4px solid #26bdf0",
                      fontSize: "13px",
                    }}
                  >
                    On submit, this goes to <strong>{selectedEngData.manager}</strong> for approval,
                    then to Credit Control.
                  </div>

                  {/* Bottom Actions */}
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-info text-white blue-btn d-flex align-items-center gap-1"
                      onClick={() => setSubmitStep(2)}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-info text-white px-4 fw-semibold"
                      disabled={numHours <= 0 || totalAllocation !== 100}
                      onClick={handleSubmit}
                    >
                      Submit for approval
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitBilling;
