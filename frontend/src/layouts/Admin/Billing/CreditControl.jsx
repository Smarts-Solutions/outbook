import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import { initialSubmissions, initialInvoices } from "./billingMockData";

const CreditControl = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [invoices, setInvoices] = useState(initialInvoices);

  const handleApprove = (id, newStatus) => {
    setSubmissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="credit" />

        <div className="report-data mt-4">
          {/* Ready to Invoice Table */}
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

          {/* Invoices and Collections Register */}
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
                              onClick={() => {
                                setInvoices(
                                  invoices.map((i) =>
                                    i.id === inv.id ? { ...i, paidDate: null } : i
                                  )
                                );
                              }}
                            >
                              Undo
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline-success btn-sm"
                              onClick={() => {
                                setInvoices(
                                  invoices.map((i) =>
                                    i.id === inv.id
                                      ? { ...i, paidDate: new Date().toISOString().split("T")[0] }
                                      : i
                                  )
                                );
                              }}
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
      </div>
    </div>
  );
};

export default CreditControl;
