import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import {
  getSubmissionsForApprovalsApi,
  managerApproveSubmissionApi,
  managerReturnSubmissionApi,
  managerEditSubmissionApi,
} from "../../../Services/Billing/BillingService";
import { convertDate1 } from "../../../Utils/Comman_function";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Check, CheckCheck, Eye, RotateCcw, Edit, X } from "lucide-react";
import sweatalert from "sweetalert2";

const BillingApprovals = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [returningId, setReturningId] = useState(null);
  const [returnNote, setReturnNote] = useState("");
  const [viewDetailsModal, setViewDetailsModal] = useState(null);

  // Edit Submission State for Manager
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [editGross, setEditGross] = useState("");
  const [editDiscountPct, setEditDiscountPct] = useState("");
  const [editReason, setEditReason] = useState("");
  const [editContributors, setEditContributors] = useState([]);

  const staffDetailsStr = localStorage.getItem("staffDetails");
  const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
  const roleId = Number(staffDetails?.role_id);
  const roleName = (staffDetails?.role_name || "").toLowerCase();
  const isAdmin = roleId === 1 || roleId === 2 || roleName.includes("admin") || roleName.includes("superadmin");

  const getAuthToken = () => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return localStorage.getItem("token");
    }
  };

  const fetchApprovalsData = async () => {
    try {
      setLoading(true);
      const payload = {
        StaffUserId: staffDetails?.id || null,
        status: "all",
      };
      const res = await getSubmissionsForApprovalsApi(payload, getAuthToken());
      if (res && res.status && Array.isArray(res.data)) {
        setSubmissions(res.data);
      } else {
        setSubmissions([]);
      }
    } catch (err) {
      console.error("Error fetching approvals:", err);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalsData();
  }, []);

  const handleApprove = async (id) => {
    try {
      const result = await sweatalert.fire({
        title: "Approve Submission?",
        text: "This will approve the billing entry and forward it to Credit Control.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
        confirmButtonColor: "#26bdf0",
      });

      if (result.isConfirmed) {
        const payload = {
          StaffUserId: staffDetails?.id || null,
          submission_id: id,
        };
        const res = await managerApproveSubmissionApi(payload, getAuthToken());
        if (res && res.status) {
          sweatalert.fire({
            icon: "success",
            title: "Approved!",
            text: res.message || "Submission approved and sent to Credit Control.",
            confirmButtonColor: "#26bdf0",
          });
          fetchApprovalsData();
        } else {
          sweatalert.fire({
            icon: "error",
            title: "Failed",
            text: res?.message || "Could not approve submission.",
            confirmButtonColor: "#26bdf0",
          });
        }
      }
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const handleApproveAll = async () => {
    if (!submissions.length) return;
    try {
      const result = await sweatalert.fire({
        title: `Approve All (${submissions.length}) Submissions?`,
        text: "All pending submissions in this list will be approved and sent to Credit Control.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve All",
        confirmButtonColor: "#26bdf0",
      });

      if (result.isConfirmed) {
        const payload = {
          StaffUserId: staffDetails?.id || null,
          submission_id: "all",
        };
        const res = await managerApproveSubmissionApi(payload, getAuthToken());
        if (res && res.status) {
          sweatalert.fire({
            icon: "success",
            title: "All Approved!",
            text: res.message || "All submissions approved and sent to Credit Control.",
            confirmButtonColor: "#26bdf0",
          });
          fetchApprovalsData();
        } else {
          sweatalert.fire({
            icon: "error",
            title: "Failed",
            text: res?.message || "Could not approve all submissions.",
            confirmButtonColor: "#26bdf0",
          });
        }
      }
    } catch (err) {
      console.error("Approve all error:", err);
    }
  };

  const handleReturnConfirm = async (id) => {
    if (!returnNote.trim()) {
      sweatalert.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please provide a reason or note explaining why this submission is being returned.",
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    try {
      const payload = {
        StaffUserId: staffDetails?.id || null,
        submission_id: id,
        return_note: returnNote.trim(),
      };
      const res = await managerReturnSubmissionApi(payload, getAuthToken());
      if (res && res.status) {
        sweatalert.fire({
          icon: "success",
          title: "Returned!",
          text: "Submission returned for correction.",
          confirmButtonColor: "#26bdf0",
        });
        setReturningId(null);
        setReturnNote("");
        fetchApprovalsData();
      } else {
        sweatalert.fire({
          icon: "error",
          title: "Failed",
          text: res?.message || "Could not return submission.",
          confirmButtonColor: "#26bdf0",
        });
      }
    } catch (err) {
      console.error("Return error:", err);
    }
  };

  // Open Edit in Submit Billing screen
  const openEditModal = (row) => {
    navigate("/admin/billing/submit", { state: { editSubmission: row } });
  };

  // Save Manager Edits
  const handleSaveEdit = async () => {
    const grossNum = parseFloat(editGross) || 0;
    const discPctNum = Math.min(100, Math.max(0, parseFloat(editDiscountPct) || 0));
    const discAmtNum = (grossNum * discPctNum) / 100;
    const netNum = Math.max(0, grossNum - discAmtNum);

    const totalContribPct = editContributors.reduce(
      (sum, c) => sum + (parseFloat(c.pct) || 0),
      0
    );

    if (editContributors.length > 0 && Math.round(totalContribPct) !== 100) {
      sweatalert.fire({
        icon: "warning",
        title: "Allocation Error",
        text: `Revenue split percentage must equal exactly 100%. (Current: ${totalContribPct.toFixed(0)}%)`,
        confirmButtonColor: "#26bdf0",
      });
      return;
    }

    try {
      const payload = {
        StaffUserId: staffDetails?.id || null,
        submission_id: editingSubmission.id,
        editData: {
          gross_amount: grossNum.toFixed(2),
          discount_pct: discPctNum.toFixed(2),
          discount_amt: discAmtNum.toFixed(2),
          net_amount: netNum.toFixed(2),
          calc_json: editingSubmission.calc_json,
          contributors: editContributors,
          edit_reason: editReason || "Adjusted by Approver/Manager",
        },
      };

      const res = await managerEditSubmissionApi(payload, getAuthToken());
      if (res && res.status) {
        sweatalert.fire({
          icon: "success",
          title: "Updated Successfully!",
          text: "Billing submission figures and discount have been updated.",
          confirmButtonColor: "#26bdf0",
        });
        setEditingSubmission(null);
        fetchApprovalsData();
      } else {
        sweatalert.fire({
          icon: "error",
          title: "Update Failed",
          text: res?.message || "Could not update submission.",
          confirmButtonColor: "#26bdf0",
        });
      }
    } catch (err) {
      console.error("Save edit error:", err);
    }
  };

  // Helper to split and format multiple model labels into clean badges
  const renderModelBadges = (modelStr) => {
    if (!modelStr) return <span className="badge bg-light text-dark border">—</span>;
    const parts = modelStr.split(",").map((p) => p.trim()).filter(Boolean);
    return (
      <div className="d-flex flex-wrap gap-1">
        {parts.map((part, idx) => (
          <span
            key={idx}
            className="badge bg-white text-dark border px-2 py-1 shadow-xs fw-medium text-wrap"
            style={{ fontSize: "11px", whiteSpace: "normal", textAlign: "left" }}
          >
            {part}
          </span>
        ))}
      </div>
    );
  };

  // Approvals columns: "Created At" is now placed at the very end right before "Actions"
  const approvalsColumns = [
    {
      name: "Submitted By",
      selector: (row) => row.submitted_by_name,
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <div title={row.submitted_by_name || `Staff #${row.submitted_by}`}>
          {row.submitted_by_name || `Staff #${row.submitted_by}`}
        </div>
      ),
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div
          title={row.customer_name || `Customer #${row.customer_id}`}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.customer_name || `Customer #${row.customer_id}`}
        </div>
      ),
    },
    {
      name: "Client Name",
      selector: (row) => row.client_name,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div
          title={row.client_name || `Client #${row.client_id}`}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.client_name || `Client #${row.client_id}`}
        </div>
      ),
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      minWidth: "160px",
      cell: (row) => (
        <div
          title={row.service_name || "Service"}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.service_name || "Service"}
        </div>
      ),
    },
    {
      name: "Period",
      selector: (row) => row.period_label,
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <span className="badge bg-light text-dark border">
          {row.period_label || "-"}
        </span>
      ),
    },
    {
      name: "Model",
      selector: (row) => row.engagement_model,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div className="py-2">
          {renderModelBadges(row.engagement_model)}
        </div>
      ),
    },
    {
      name: "Account Manager",
      selector: (row) => row.manager_name,
      sortable: true,
      minWidth: "150px",
      cell: (row) => (
        <div title={row.manager_name || "-"}>
          {row.manager_name || "-"}
        </div>
      ),
    },
    {
      name: "Gross Amount",
      selector: (row) => row.gross_amount,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className="text-dark">
          £{parseFloat(row.gross_amount || row.net_amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Discount",
      selector: (row) => row.discount_pct,
      sortable: true,
      minWidth: "110px",
      cell: (row) => {
        const pct = parseFloat(row.discount_pct) || 0;
        return pct > 0 ? (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle fw-medium">
            {pct}% off
          </span>
        ) : (
          <span className="text-muted small">—</span>
        );
      },
    },
    {
      name: "Net Amount",
      selector: (row) => row.net_amount,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className="fw-bold text-info fs-6">
          £{parseFloat(row.net_amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Revenue Split",
      minWidth: "160px",
      cell: (row) => {
        const list = row.contributors || [];
        if (!list.length) return <span className="text-muted small">—</span>;
        return (
          <div className="small py-2">
            {list.map((c, i) => (
              <span key={i} className="badge bg-white text-dark border me-1 mb-1 fw-normal">
                {c.staff_name} ({parseFloat(c.pct).toFixed(0)}%)
              </span>
            ))}
          </div>
        );
      },
    },
    {
      name: "Created At",
      selector: (row) => row.submitted_at,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <div title={row.submitted_at} className="text-muted">
          {convertDate1(row.submitted_at)}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "130px",
      cell: (row) => {
        const st = (row.status || "").toLowerCase();
        if (st.includes("approved")) {
          return (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
              <Check size={13} /> Approved
            </span>
          );
        }
        if (st.includes("return")) {
          return (
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
              <RotateCcw size={13} /> Returned
            </span>
          );
        }
        return (
          <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1 fw-semibold">
            Pending
          </span>
        );
      },
    },
    {
      name: "Actions",
      minWidth: "200px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) =>
        returningId === row.id ? (
          <div className="d-flex flex-column gap-1 py-2" style={{ minWidth: "180px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Reason for return..."
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              autoFocus
            />
            <div className="d-flex gap-1 justify-content-end">
              <button
                type="button"
                className="btn btn-danger btn-sm py-1 px-2 fs-12 rounded-pill"
                onClick={() => handleReturnConfirm(row.id)}
              >
                Confirm Return
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm py-1 px-2 fs-12 rounded-pill"
                onClick={() => setReturningId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="d-flex align-items-center justify-content-start gap-1">
            {/* View Snapshot / Details Modal */}
            <button
              type="button"
              className="view-icon rounded-pills border-primary"
              title="View Calculation Snapshot"
              onClick={() => setViewDetailsModal(row)}
            >
              <i className="ti-eye text-primary" />
            </button>

            {/* Edit in Submit Billing Screen */}
            <button
              type="button"
              className="edit-icon rounded-pills border-warning"
              title="Edit Submission"
              onClick={() => openEditModal(row)}
            >
              <i className="ti-pencil-alt text-warning" />
            </button>

            {/* Manager Approve */}
            {row.status !== "Approved" && (
              <button
                type="button"
                className="add-icon rounded-pills"
                title="Approve Submission"
                onClick={() => handleApprove(row.id)}
              >
                <i className="ti-check text-success" />
              </button>
            )}

            {/* Return for correction */}
            {row.status === "Pending Manager Approval" && (
              <button
                type="button"
                className="delete-icon rounded-pills"
                title="Return for correction"
                onClick={() => {
                  setReturningId(row.id);
                  setReturnNote("");
                }}
              >
                <i className="ti-back-left text-danger" />
              </button>
            )}
          </div>
        ),
    },
  ];

  // Calculated values for Edit Modal
  const editGrossNum = parseFloat(editGross) || 0;
  const editDiscPctNum = Math.min(100, Math.max(0, parseFloat(editDiscountPct) || 0));
  const editDiscAmtNum = (editGrossNum * editDiscPctNum) / 100;
  const editNetNum = Math.max(0, editGrossNum - editDiscAmtNum);

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="approvals" />

        <div className="report-data mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h5 className="fw-bold mb-1 text-dark">
                {isAdmin
                  ? "Manager Approvals Queue (All Teams)"
                  : "Awaiting Your Approval (Your Customers)"}
              </h5>
              <p className="text-muted small mb-0">
                Review and approve billing submissions entered by team members before they go to Credit Control.
              </p>
            </div>
            {submissions.length > 0 && (
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <div className="btn-group btn-group-sm bg-white p-1 rounded-pill border">
                  {[
                    { id: "all", label: "All" },
                    { id: "pending", label: "Pending" },
                    { id: "approved", label: "Approved" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`btn btn-sm rounded-pill px-3 py-1 fw-medium ${
                        statusFilter === tab.id
                          ? "btn-info text-white shadow-xs"
                          : "btn-light text-dark border-0 bg-transparent"
                      }`}
                      onClick={() => setStatusFilter(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn btn-outline-info rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1"
                  onClick={handleApproveAll}
                >
                  <CheckCheck size={16} /> Approve All
                </button>
              </div>
            )}
          </div>

          <BillingDatatable
            columns={approvalsColumns}
            data={statusFilter === "all" ? submissions : submissions.filter(s => {
              const st = (s.status || "").toLowerCase();
              if (statusFilter === "pending") return st.includes("pending");
              if (statusFilter === "approved") return st.includes("approved");
              if (statusFilter === "returned") return st.includes("return");
              return true;
            })}
            loading={loading}
            title="Submissions Awaiting Manager Approval"
            exportFileName="Submissions_Awaiting_Approval"
          />
        </div>
      </div>

      {/* Snapshot / Details Modal */}
      <CommanModal
        isOpen={!!viewDetailsModal}
        handleClose={() => setViewDetailsModal(null)}
        setIsOpen={() => setViewDetailsModal(null)}
        hideFooter={true}
        title="Billing Submission Details & Snapshot"
        size="lg"
      >
        {viewDetailsModal && (
          <div className="p-3">
            {/* Meta Header */}
            <div className="row g-2 mb-3 pb-3 border-bottom">
              <div className="col-md-6">
                <span className="text-muted small d-block">Customer</span>
                <strong className="text-dark">{viewDetailsModal.customer_name || "-"}</strong>
              </div>
              <div className="col-md-6">
                <span className="text-muted small d-block">Client</span>
                <strong className="text-dark">{viewDetailsModal.client_name || "-"}</strong>
              </div>
              <div className="col-md-6">
                <span className="text-muted small d-block">Service</span>
                <span className="fw-medium text-dark">{viewDetailsModal.service_name || "-"}</span>
              </div>
              <div className="col-md-6">
                <span className="text-muted small d-block">Billing Period</span>
                <span className="badge bg-light text-dark border">
                  {viewDetailsModal.period_label || "-"}
                </span>
              </div>
              <div className="col-12 mt-2">
                <span className="text-muted small d-block">Nomisma Line</span>
                <code className="text-dark bg-light px-2 py-1 rounded d-block border">
                  {viewDetailsModal.nomisma_description || "-"}
                </code>
              </div>
            </div>

            {/* Breakdown per model if structured */}
            {viewDetailsModal.calc_json && typeof viewDetailsModal.calc_json === "object" ? (
              <div className="mb-3">
                <h6 className="fw-bold text-dark mb-2">Calculation Breakdown</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Model</th>
                        <th>Details</th>
                        <th className="text-end">Subtotal (£)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewDetailsModal.calc_json.adhoc && (
                        <tr>
                          <td><span className="badge bg-primary text-white">Adhoc / Hourly</span></td>
                          <td>
                            {viewDetailsModal.calc_json.adhoc.role || "Standard"} — {viewDetailsModal.calc_json.adhoc.hours || 0} hrs @ £{parseFloat(viewDetailsModal.calc_json.adhoc.rate || 0).toFixed(2)}/hr
                          </td>
                          <td className="text-end fw-semibold">
                            £{parseFloat(viewDetailsModal.calc_json.adhoc.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.fte && (
                        <tr>
                          <td><span className="badge bg-success text-white">FTE Staffing</span></td>
                          <td>Fixed FTE allocation fee</td>
                          <td className="text-end fw-semibold">
                            £{parseFloat(viewDetailsModal.calc_json.fte.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.percentage && (
                        <tr>
                          <td><span className="badge bg-info text-white">Percentage Model</span></td>
                          <td>
                            Base: £{parseFloat(viewDetailsModal.calc_json.percentage.base || 0).toFixed(2)} @ {viewDetailsModal.calc_json.percentage.pct || 0}%
                          </td>
                          <td className="text-end fw-semibold">
                            £{parseFloat(viewDetailsModal.calc_json.percentage.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.customised && (
                        <tr>
                          <td><span className="badge bg-warning text-dark">Customised Pricing</span></td>
                          <td>
                            {viewDetailsModal.calc_json.customised.count || 0} jobs @ £{parseFloat(viewDetailsModal.calc_json.customised.costPerJob || 0).toFixed(2)}/job
                          </td>
                          <td className="text-end fw-semibold">
                            £{parseFloat(viewDetailsModal.calc_json.customised.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {/* Revenue Split / Contributors */}
            {viewDetailsModal.contributors && viewDetailsModal.contributors.length > 0 && (
              <div className="mb-3">
                <h6 className="fw-bold text-dark mb-2">Revenue Allocation</h6>
                <div className="d-flex flex-wrap gap-2">
                  {viewDetailsModal.contributors.map((c, i) => (
                    <span key={i} className="badge bg-white text-dark border px-2 py-1">
                      {c.staff_name} — <strong>{parseFloat(c.pct).toFixed(0)}%</strong> (£{((parseFloat(viewDetailsModal.net_amount || 0) * parseFloat(c.pct)) / 100).toFixed(2)})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Grand Total & Discount Footer */}
            <div className="bg-light rounded p-3 mt-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small">Gross Billable Amount:</span>
                <span className="fw-semibold text-dark">
                  £{parseFloat(viewDetailsModal.gross_amount || viewDetailsModal.net_amount || 0).toFixed(2)}
                </span>
              </div>
              {parseFloat(viewDetailsModal.discount_pct || 0) > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-1 text-danger">
                  <span className="small">
                    Discount ({parseFloat(viewDetailsModal.discount_pct)}%):
                  </span>
                  <span className="fw-semibold">
                    - £{parseFloat(viewDetailsModal.discount_amt || 0).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                <span className="fw-bold text-dark fs-15">Net Billable Amount:</span>
                <span className="fs-5 fw-bold text-info">
                  £{parseFloat(viewDetailsModal.net_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CommanModal>

      {/* Edit Submission Modal for Approver / Manager */}
      <CommanModal
        isOpen={!!editingSubmission}
        setIsOpen={() => setEditingSubmission(null)}
        title={`Edit Billing Figures — #${editingSubmission?.id || ""}`}
        size="lg"
      >
        {editingSubmission && (
          <div className="p-3">
            <div className="alert alert-info py-2 px-3 small mb-3">
              <strong>Client:</strong> {editingSubmission.client_name || "-"} |{" "}
              <strong>Service:</strong> {editingSubmission.service_name || "-"} |{" "}
              <strong>Period:</strong> {editingSubmission.period_label || "-"}
            </div>

            <div className="row g-3 mb-3">
              {/* Gross Amount Input */}
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1 fw-medium">
                  Gross Billable Amount (£)
                </label>
                <input
                  type="number" onWheel={(e) => e.target.blur()}
                  min="0"
                  step="0.01"
                  className="form-control rounded-pill"
                  value={editGross}
                  onChange={(e) => setEditGross(e.target.value)}
                />
              </div>

              {/* Discount % Input */}
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1 fw-medium">
                  Discount % (Optional)
                </label>
                <div className="position-relative">
                  <input
                    type="number" onWheel={(e) => e.target.blur()}
                    min="0"
                    max="100"
                    step="any"
                    className="form-control rounded-pill pe-4"
                    value={editDiscountPct}
                    onChange={(e) => setEditDiscountPct(e.target.value)}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted fw-bold"
                    style={{ pointerEvents: "none" }}
                  >
                    %
                  </span>
                </div>
              </div>

              {/* Calculated Net Amount */}
              <div className="col-md-4">
                <label className="form-label text-muted small mb-1 fw-medium">
                  Calculated Net Amount (£)
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill bg-light fw-bold text-info"
                  readOnly
                  value={`£ ${editNetNum.toFixed(2)}`}
                />
              </div>
            </div>

            {/* Discount Summary Alert */}
            {editDiscPctNum > 0 && (
              <div className="text-muted small mb-3">
                Applied Discount: <strong className="text-danger">{editDiscPctNum}% (-£{editDiscAmtNum.toFixed(2)})</strong>
              </div>
            )}

            {/* Contributors Revenue Allocation */}
            {editContributors.length > 0 && (
              <div className="card border p-3 mb-3 bg-light">
                <h6 className="fw-semibold text-dark mb-2">Revenue Split Across Contributors</h6>
                {editContributors.map((c, idx) => (
                  <div key={idx} className="row g-2 align-items-center mb-2">
                    <div className="col-md-6">
                      <span className="fw-medium text-dark">{c.staff_name}</span>
                    </div>
                    <div className="col-md-4">
                      <div className="input-group input-group-sm">
                        <input
                          type="number" onWheel={(e) => e.target.blur()}
                          min="0"
                          max="100"
                          className="form-control"
                          value={c.pct}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditContributors((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, pct: val } : item
                              )
                            );
                          }}
                        />
                        <span className="input-group-text">%</span>
                      </div>
                    </div>
                    <div className="col-md-2 text-end text-muted small">
                      £{((editNetNum * (parseFloat(c.pct) || 0)) / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Reason for Edit */}
            <div className="mb-3">
              <label className="form-label text-muted small mb-1 fw-medium">
                Reason for Adjustment / Note
              </label>
              <textarea
                rows="2"
                className="form-control"
                placeholder="e.g. Adjusted agreed fee or applied promotional discount"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
              />
            </div>

            {/* Modal Actions */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
              <button
                type="button"
                className="btn btn-secondary rounded-pill px-4"
                onClick={() => setEditingSubmission(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-info text-white rounded-pill px-4"
                onClick={handleSaveEdit}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </CommanModal>
    </div>
  );
};

export default BillingApprovals;
