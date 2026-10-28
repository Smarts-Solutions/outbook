import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import { X } from "lucide-react";

const SubmitBilling = () => {
  const navigate = useNavigate();
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

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="submit" />

        <div className="report-data mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                Create Billing Submission
              </h5>

              {/* Sub Stepper */}
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

              {/* Step 1 */}
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

              {/* Step 2 */}
              {submitStep === 2 && (
                <div className="row">
                  <div className="col-md-8">
                    <div className="alert alert-light border mb-3">
                      <small className="text-muted d-block">Selected Engagement:</small>
                      <strong>{selectedPractice}</strong> — Peak Digital Ltd (FTE Bookkeeper)
                    </div>

                    <div className="row">
                      <div className="col-md-8 mb-3">
                        <label className="form-label fw-semibold">Assignment Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formValues.assignmentName}
                          onChange={(e) =>
                            setFormValues({ ...formValues, assignmentName: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-semibold">Work Type</label>
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
                    </div>

                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Period Type</label>
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
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Period Date</label>
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

              {/* Step 3 */}
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
                            navigate("/admin/billing/dashboard");
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
        </div>
      </div>
    </div>
  );
};

export default SubmitBilling;
