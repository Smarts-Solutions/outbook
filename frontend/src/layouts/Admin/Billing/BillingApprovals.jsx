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
import { Check, CheckCheck, Eye, RotateCcw, Edit, X, Clock } from "lucide-react";
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

  const handleReturnClick = async (row) => {
    const { value: text, isConfirmed } = await sweatalert.fire({
      title: "Revert / Return Submission",
      html: `<p class="text-muted small mb-2">Please enter the reason or message for returning this billing entry for <b>${row.client_name || "this client"}</b>:</p>`,
      input: "textarea",
      inputPlaceholder: "Enter reason / message for revert...",
      inputAttributes: {
        "aria-label": "Enter reason or message",
        rows: 3,
      },
      showCancelButton: true,
      confirmButtonText: "Confirm Revert",
      confirmButtonColor: "#f06548",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please enter a message explaining why this billing is being reverted!";
        }
      },
    });

    if (isConfirmed && text) {
      try {
        const payload = {
          StaffUserId: staffDetails?.id || null,
          submission_id: row.id,
          return_note: text.trim(),
        };
        const res = await managerReturnSubmissionApi(payload, getAuthToken());
        if (res && res.status) {
          sweatalert.fire({
            icon: "success",
            title: "Reverted!",
            text: "Billing submission has been reverted with your note.",
            confirmButtonColor: "#26bdf0",
          });
          fetchApprovalsData();
        } else {
          sweatalert.fire({
            icon: "error",
            title: "Failed",
            text: res?.message || "Could not revert submission.",
            confirmButtonColor: "#26bdf0",
          });
        }
      } catch (err) {
        console.error("Return error:", err);
      }
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
    if (!parts.length) return <span className="badge bg-light text-dark border">—</span>;

    // Show 1 badge, and if more, show +X more badge
    return (
      <div className="d-flex align-items-center gap-1 flex-wrap">
        <span
          className="badge bg-white text-dark border px-2 py-1 shadow-xs fw-medium text-truncate text-start"
          style={{ fontSize: "11px", maxWidth: "160px" }}
          title={parts[0]}
        >
          {parts[0]}
        </span>
        {parts.length > 1 && (
          <span
            className="badge bg-light text-muted border px-2 py-1 fw-semibold cursor-pointer"
            style={{ fontSize: "10.5px" }}
            title={parts.slice(1).join("\n")}
          >
            +{parts.length - 1} more
          </span>
        )}
      </div>
    );
  };

  // Approvals columns: "Created At" is now placed at the very end right before "Actions"
  const approvalsColumns = [
    {
      name: "Submitted By",
      selector: (row) => row.submitted_by_name,
      sortable: true,
      minWidth: "160px",
      cell: (row) => (
        <div title={row.submitted_by_name || `Staff #${row.submitted_by}`} className="text-break py-1">
          {row.submitted_by_name || `Staff #${row.submitted_by}`}
        </div>
      ),
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
      minWidth: "180px",
      cell: (row) => (
        <div
          title={row.customer_name || `Customer #${row.customer_id}`}
          className="text-break py-1"
        >
          {row.customer_name || `Customer #${row.customer_id}`}
        </div>
      ),
    },
    {
      name: "Client Name",
      selector: (row) => row.client_name,
      sortable: true,
      minWidth: "180px",
      cell: (row) => (
        <div
          title={row.client_name || `Client #${row.client_id}`}
          className="text-break py-1"
        >
          {row.client_name || `Client #${row.client_id}`}
        </div>
      ),
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div
          title={row.service_name || "Service"}
          className="text-break py-1"
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
      minWidth: "160px",
      cell: (row) => (
        <div title={row.manager_name || "-"} className="text-break py-1">
          {row.manager_name || "-"}
        </div>
      ),
    },
    {
      name: "Gross Amount",
      selector: (row) => row.gross_amount,
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <span className="text-dark fw-semibold">
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
      minWidth: "130px",
      cell: (row) => (
        <span className="fw-bold text-info fs-6">
          £{parseFloat(row.net_amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Revenue Split",
      selector: (row) => (row.contributors || []).map((c) => `${c.staff_name} (${parseFloat(c.pct).toFixed(0)}%)`).join(", "),
      minWidth: "220px",
      cell: (row) => {
        const list = row.contributors || [];
        if (!list.length) return <span className="text-muted small">—</span>;
        
        // Show 1 contributor badge, and if more, show +X more badge
        const first = list[0];
        return (
          <div className="d-flex align-items-center gap-1 flex-wrap">
            <span
              className="badge bg-white text-dark border fw-normal text-truncate text-start"
              style={{ lineHeight: "1.4", padding: "4px 8px", fontSize: "11.5px", maxWidth: "160px" }}
              title={`${first.staff_name} (${parseFloat(first.pct).toFixed(0)}%)`}
            >
              {first.staff_name} <span className="fw-semibold text-primary">({parseFloat(first.pct).toFixed(0)}%)</span>
            </span>
            {list.length > 1 && (
              <span
                className="badge bg-light text-muted border px-2 py-1 fw-semibold cursor-pointer"
                style={{ fontSize: "11px" }}
                title={list.slice(1).map((c) => `${c.staff_name} (${parseFloat(c.pct).toFixed(0)}%)`).join("\n")}
                onClick={() => setViewDetailsModal(row)}
              >
                +{list.length - 1} more
              </span>
            )}
          </div>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        const st = (row.status || "").toLowerCase();
        if (st === "invoiced") {
          return (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 text-nowrap" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              <CheckCheck size={14} /> Invoiced
            </span>
          );
        }
        if (st.includes("credit control")) {
          return (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 text-nowrap" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              <Check size={14} /> Sent to Credit Control
            </span>
          );
        }
        if (st.includes("approved")) {
          return (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 text-nowrap" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              <Check size={14} /> Approved
            </span>
          );
        }
        if (st.includes("return")) {
          return (
            <span
              className="badge px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
              style={{
                backgroundColor: "#fff8e6",
                color: "#b76e00",
                border: "1px solid #ffd591",
                fontSize: "12px",
                whiteSpace: "nowrap"
              }}
            >
              <RotateCcw size={14} /> Returned
            </span>
          );
        }
        if (st.includes("reject")) {
          return (
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 text-nowrap" style={{ fontSize: "12px", whiteSpace: "nowrap" }}>
              Rejected
            </span>
          );
        }
        return (
          <span
            className="badge px-3 py-1 fw-bold d-inline-flex align-items-center gap-1 shadow-sm text-nowrap"
            style={{
              backgroundColor: "#e6f7ff",
              color: "#0070ba",
              border: "1px solid #91d5ff",
              fontSize: "12px",
              whiteSpace: "nowrap"
            }}
          >
            <Clock size={14} /> Pending Manager Approval
          </span>
        );
      },
    },
    {
      name: "Created At",
      selector: (row) => row.submitted_at,
      sortable: true,
      minWidth: "140px",
      cell: (row) => (
        <div title={row.submitted_at} className="text-muted text-nowrap" style={{ whiteSpace: "nowrap" }}>
          {convertDate1(row.submitted_at)}
        </div>
      ),
    },
    {
      name: "Actions",
      minWidth: "220px",
      width: "220px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => {
        const currentStaffId = Number(staffDetails?.id);
        const isSubmitter = Number(row.submitted_by) === currentStaffId;
        const isDesignatedManager = Number(row.manager_id) === currentStaffId;
        const isAccountManager = Number(row.account_manager_id) === currentStaffId;
        // User can take manager actions (Approve, Edit, Return) if they are Admin, designated manager, account manager,
        // or in the manager hierarchy chain (row.can_manage flag from backend).
        // If a user is purely the submitter without management authority, they only see the View button.
        const canManage = Boolean(
          isAdmin ||
          row.can_manage === 1 ||
          row.can_manage === true ||
          isDesignatedManager ||
          isAccountManager
        );

        return (
          <div className="d-flex align-items-center justify-content-start gap-1">
            {/* View Snapshot / Details Modal (Visible to Submitter, Manager, and Admin) */}
            <button
              type="button"
              className="view-icon rounded-pills border-primary"
              title="View Calculation Snapshot"
              onClick={() => setViewDetailsModal(row)}
            >
              <i className="ti-eye text-primary" />
            </button>

            {/* Edit in Submit Billing Screen (Only when Pending Manager Approval and user has management rights) */}
            {canManage && row.status === "Pending Manager Approval" && (
              <button
                type="button"
                className="edit-icon rounded-pills border-warning"
                title="Edit Submission"
                onClick={() => openEditModal(row)}
              >
                <i className="ti-pencil-alt text-warning" />
              </button>
            )}

            {/* Manager Approve (Only when user has management rights) */}
            {canManage && row.status === "Pending Manager Approval" && (
              <button
                type="button"
                className="add-icon rounded-pills"
                title="Approve Submission"
                onClick={() => handleApprove(row.id)}
              >
                <i className="ti-check text-success" />
              </button>
            )}

            {/* Return / Revert for correction with message (Only when user has management rights) */}
            {canManage && row.status === "Pending Manager Approval" && (
              <button
                type="button"
                className="delete-icon rounded-pills"
                title="Revert / Return for correction"
                onClick={() => handleReturnClick(row)}
              >
                <i className="ti-back-left text-danger" />
              </button>
            )}
          </div>
        );
      },
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
                  : "Awaiting Your Approval (Your Team Submissions)"}
              </h5>
              <p className="text-muted small mb-0">
                Review and approve billing submissions entered by team members before they go to Credit Control.
              </p>
            </div>

          </div>

          <BillingDatatable
            columns={approvalsColumns}
            data={statusFilter === "all" ? submissions : submissions.filter(s => {
              const st = (s.status || "").toLowerCase();
              if (statusFilter === "pending") return st === "pending manager approval" || st === "pending";
              if (statusFilter === "approved") return st.includes("approved") || st.includes("credit control");
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
            {/* Meta Information Card */}
            <div
              className="p-3 rounded-3 mb-3 border"
              style={{ backgroundColor: "#f8fafd", borderColor: "#e2ecf5" }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Customer / Practice
                  </span>
                  <div className="fw-bold text-dark fs-14 mt-1">
                    {viewDetailsModal.customer_name || "-"}
                  </div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Client
                  </span>
                  <div className="fw-bold text-dark fs-14 mt-1">
                    {viewDetailsModal.client_name || "-"}
                  </div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Service
                  </span>
                  <div className="fw-semibold text-dark fs-13 mt-1">
                    {viewDetailsModal.service_name || "-"}
                  </div>
                </div>
                <div className="col-md-6">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Billing Period
                  </span>
                  <div className="mt-1">
                    <span className="badge bg-white text-primary border px-2 py-1 fw-bold fs-12">
                      {viewDetailsModal.period_label || "-"}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <span className="text-muted small text-uppercase fw-semibold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                    Nomisma Line
                  </span>
                  <div
                    className="p-2 rounded mt-1 border text-dark fw-medium fs-12"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    {viewDetailsModal.nomisma_description || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown per model if structured */}
            {viewDetailsModal.calc_json && typeof viewDetailsModal.calc_json === "object" ? (
              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <h6 className="fw-bold text-dark mb-0 fs-14">Calculation Breakdown</h6>
                </div>
                <div className="table-responsive rounded border">
                  <table className="table table-sm align-middle mb-0">
                    <thead style={{ backgroundColor: "#f1f5f9" }}>
                      <tr>
                        <th className="py-2 px-3 text-secondary text-uppercase" style={{ fontSize: "11.5px", width: "170px" }}>Model</th>
                        <th className="py-2 px-3 text-secondary text-uppercase" style={{ fontSize: "11.5px" }}>Details</th>
                        <th className="py-2 px-3 text-secondary text-uppercase text-end" style={{ fontSize: "11.5px", width: "130px" }}>Subtotal (£)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewDetailsModal.calc_json.adhoc && (
                        <tr>
                          <td className="px-3 py-2">
                            <span
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                backgroundColor: "#e8f1fc",
                                color: "#0d5ca8",
                                border: "1px solid #b6d4f7",
                                fontSize: "11.5px",
                              }}
                            >
                              Adhoc / Hourly
                            </span>
                          </td>
                          <td className="px-3 py-2 text-dark fs-13">
                            <span className="fw-semibold text-capitalize">
                              {(viewDetailsModal.calc_json.adhoc.role || "Standard").replace(/_/g, " ")}
                            </span>
                            <span className="text-muted mx-1">—</span>
                            <span>{viewDetailsModal.calc_json.adhoc.hours || 0} hrs @ £{parseFloat(viewDetailsModal.calc_json.adhoc.rate || 0).toFixed(2)}/hr</span>
                          </td>
                          <td className="px-3 py-2 text-end fw-bold text-dark fs-13">
                            £{parseFloat(viewDetailsModal.calc_json.adhoc.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.fte && (
                        <tr>
                          <td className="px-3 py-2">
                            <span
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                backgroundColor: "#eaf7ee",
                                color: "#137333",
                                border: "1px solid #b7e1cd",
                                fontSize: "11.5px",
                              }}
                            >
                              FTE Staffing
                            </span>
                          </td>
                          <td className="px-3 py-2 text-dark fs-13">
                            {(() => {
                              const roles = [
                                { label: "Accountants", qty: viewDetailsModal.calc_json.fte.accountants },
                                { label: "Bookkeepers", qty: viewDetailsModal.calc_json.fte.bookkeepers },
                                { label: "Payroll", qty: viewDetailsModal.calc_json.fte.payroll },
                                { label: "Tax", qty: viewDetailsModal.calc_json.fte.tax },
                                { label: "Admin", qty: viewDetailsModal.calc_json.fte.admin },
                              ].filter((r) => r.qty > 0);

                              if (roles.length > 0) {
                                return (
                                  <span>
                                    {roles.map((r, idx) => (
                                      <span key={idx} className="badge bg-light text-dark border me-1">
                                        {r.label}: <strong>{r.qty}</strong>
                                      </span>
                                    ))}
                                  </span>
                                );
                              }
                              return <span className="text-muted">Dedicated FTE Resource Allocation</span>;
                            })()}
                          </td>
                          <td className="px-3 py-2 text-end fw-bold text-dark fs-13">
                            £{parseFloat(viewDetailsModal.calc_json.fte.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.percentage && (
                        <tr>
                          <td className="px-3 py-2">
                            <span
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                backgroundColor: "#e1f5fe",
                                color: "#0277bd",
                                border: "1px solid #81d4fa",
                                fontSize: "11.5px",
                              }}
                            >
                              Percentage Model
                            </span>
                          </td>
                          <td className="px-3 py-2 text-dark fs-13">
                            {Array.isArray(viewDetailsModal.calc_json.percentage.items) && viewDetailsModal.calc_json.percentage.items.length > 0 ? (
                              <div className="d-flex flex-column gap-1">
                                {viewDetailsModal.calc_json.percentage.items
                                  .filter((it) => it.base > 0 || it.subtotal > 0)
                                  .map((it, idx) => (
                                    <div key={idx} className="d-flex justify-content-between align-items-center">
                                      <span className="fw-medium">{it.label || it.key}:</span>
                                      <span className="text-muted small">
                                        Base £{parseFloat(it.base || 0).toFixed(2)} @ {it.pct}% = £{parseFloat(it.subtotal || 0).toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <span>
                                Base: £{parseFloat(viewDetailsModal.calc_json.percentage.base || 0).toFixed(2)} @ {viewDetailsModal.calc_json.percentage.pct || 0}%
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-end fw-bold text-dark fs-13">
                            £{parseFloat(viewDetailsModal.calc_json.percentage.total || 0).toFixed(2)}
                          </td>
                        </tr>
                      )}
                      {viewDetailsModal.calc_json.customised && (
                        <tr>
                          <td className="px-3 py-2">
                            <span
                              className="badge px-2 py-1 fw-bold"
                              style={{
                                backgroundColor: "#fff4e5",
                                color: "#b76e00",
                                border: "1px solid #ffd599",
                                fontSize: "11.5px",
                              }}
                            >
                              Customised Pricing
                            </span>
                          </td>
                          <td className="px-3 py-2 text-dark fs-13">
                            <span>
                              <strong>{viewDetailsModal.calc_json.customised.count || 0}</strong> {Number(viewDetailsModal.calc_json.customised.count) === 1 ? "Job" : "Jobs"}
                              <span className="text-muted mx-1">@</span>
                              £{parseFloat(viewDetailsModal.calc_json.customised.costPerJob || 0).toFixed(2)}/Job
                            </span>
                          </td>
                          <td className="px-3 py-2 text-end fw-bold text-dark fs-13">
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
                <h6 className="fw-bold text-dark mb-2 fs-14">Revenue Allocation</h6>
                <div className="table-responsive rounded border">
                  <table className="table table-sm align-middle mb-0">
                    <thead style={{ backgroundColor: "#f8fafc" }}>
                      <tr>
                        <th className="py-2 px-3 text-secondary text-uppercase" style={{ fontSize: "11px" }}>Contributor / Staff</th>
                        <th className="py-2 px-3 text-secondary text-uppercase text-center" style={{ fontSize: "11px", width: "120px" }}>Share %</th>
                        <th className="py-2 px-3 text-secondary text-uppercase text-end" style={{ fontSize: "11px", width: "140px" }}>Allocated Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewDetailsModal.contributors.map((c, i) => {
                        const contributorPct = parseFloat(c.pct || 0);
                        const netAmt = parseFloat(viewDetailsModal.net_amount || 0);
                        const contributorAmt = parseFloat(c.amount || 0) || ((netAmt * contributorPct) / 100);
                        return (
                          <tr key={i}>
                            <td className="px-3 py-2 fw-semibold text-dark fs-13">
                              {c.staff_name}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="badge bg-light text-primary border px-2 py-1 fw-bold">
                                {contributorPct.toFixed(contributorPct % 1 === 0 ? 0 : 2)}%
                              </span>
                            </td>
                            <td className="px-3 py-2 text-end fw-bold text-dark fs-13">
                              £{contributorAmt.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Revert / Return Note if available */}
            {viewDetailsModal.return_note && (
              <div className="alert alert-danger py-2 px-3 mb-3 border-danger shadow-sm">
                <div className="fw-bold fs-13 mb-1 d-flex align-items-center gap-1 text-danger">
                  <RotateCcw size={14} /> Revert / Return Note:
                </div>
                <div className="small text-dark">{viewDetailsModal.return_note}</div>
              </div>
            )}

            {/* Grand Total & Discount Card */}
            <div
              className="rounded-3 p-3 border"
              style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-secondary small fw-medium">Gross Billable Amount:</span>
                <span className="fw-semibold text-dark fs-14">
                  £{parseFloat(viewDetailsModal.gross_amount || viewDetailsModal.net_amount || 0).toFixed(2)}
                </span>
              </div>
              {parseFloat(viewDetailsModal.discount_pct || 0) > 0 && (
                <div className="d-flex justify-content-between align-items-center mb-2 text-danger">
                  <span className="small fw-medium">
                    Discount ({parseFloat(viewDetailsModal.discount_pct)}%):
                  </span>
                  <span className="fw-semibold fs-14">
                    - £{parseFloat(viewDetailsModal.discount_amt || 0).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                <span className="fw-bold text-dark fs-15">Net Billable Amount:</span>
                <span className="fs-4 fw-bold text-info">
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
