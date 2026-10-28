import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { initialSubmissions } from "./billingMockData";
import { Check } from "lucide-react";

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

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="approvals" />

        <div className="report-data mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default BillingApprovals;
