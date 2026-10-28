import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import { initialSubmissions } from "./billingMockData";
import { Check, RotateCcw } from "lucide-react";

const BillingApprovals = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [returningId, setReturningId] = useState(null);
  const [returnNote, setReturnNote] = useState("");

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

  const approvalsColumns = [
    {
      name: "Submitted By",
      selector: (row) => row.submittedBy,
      sortable: true,
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
      sortable: true,
      cell: (row) => (
        <div>
          <span className="fw-semibold text-dark">{row.client}</span>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.practice}</div>
        </div>
      ),
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
      cell: (row) => (
        <span className="badge bg-light text-dark border">{row.model}</span>
      ),
    },
    {
      name: "Assignment",
      selector: (row) => row.assignmentName,
      sortable: true,
      cell: (row) => (
        <div>
          <div>{row.assignmentName}</div>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.workType}</div>
        </div>
      ),
    },
    { name: "Period", selector: (row) => row.periodLabel, sortable: true },
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
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          {row.currency === "AUD" ? "AUD " : "£"}
          {row.net.toFixed(2)}
        </span>
      ),
    },
    { name: "Revenue Split", selector: (row) => row.revenueSplit },
    {
      name: "Action",
      cell: (row) =>
        returningId === row.id ? (
          <div className="d-flex flex-column gap-1 py-1" style={{ minWidth: "160px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Reason..."
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              autoFocus
            />
            <div className="d-flex gap-1 justify-content-end">
              <button
                type="button"
                className="btn btn-danger btn-sm py-0 px-2 fs-12"
                onClick={() => handleReturnConfirm(row.id)}
              >
                Return
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm py-0 px-2 fs-12"
                onClick={() => setReturningId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="billing-action-btn billing-action-btn-danger"
              title="Return"
              onClick={() => {
                setReturningId(row.id);
                setReturnNote("");
              }}
            >
              <RotateCcw size={15} />
            </button>
            <button
              type="button"
              className="billing-action-btn billing-action-btn-primary"
              title={row.status === "Pending Manager Approval" ? "Manager Approve" : "CC Approve"}
              onClick={() =>
                handleApprove(
                  row.id,
                  row.status === "Pending Manager Approval"
                    ? "Pending Credit Control Approval"
                    : "Approved"
                )
              }
            >
              <Check size={16} />
            </button>
          </div>
        ),
    },
  ];

  const pendingApprovals = submissions.filter(
    (s) =>
      s.status === "Pending Manager Approval" ||
      s.status === "Pending Credit Control Approval"
  );

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="approvals" />

        <div className="report-data mt-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="Pending approvals queue"
                totalCount={pendingApprovals.length}
                columns={approvalsColumns}
                data={pendingApprovals}
                filter={true}
                exportFileName="Pending_Billing_Approvals"
                noDataText="No pending submissions awaiting approval."
                actionButton={
                  <button
                    type="button"
                    className="btn btn-outline-info fw-bold btn-sm border-2 d-flex align-items-center gap-1"
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
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingApprovals;
