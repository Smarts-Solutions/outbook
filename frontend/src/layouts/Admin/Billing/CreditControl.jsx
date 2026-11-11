import React, { useState, useEffect } from "react";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import { getSubmissionsForApprovalsApi, markSubmissionBilledApi, recordInvoicePaymentApi } from "../../../Services/Billing/BillingService";
import { convertDate1 } from "../../../Utils/Comman_function";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Check, Eye, FileText, CheckCircle, Undo2 } from "lucide-react";
import sweatalert from "sweetalert2";

const CreditControl = () => {
  const [invoices, setInvoices] = useState([]);
  const [readyToInvoiceList, setReadyToInvoiceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const billingMonth = "Sep-26";

  const staffDetailsStr = localStorage.getItem("staffDetails");
  const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;

  const getAuthToken = () => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return localStorage.getItem("token");
    }
  };

  const fetchCreditControlSubmissions = async () => {
    try {
      setLoading(true);
      const payload = {
        StaffUserId: staffDetails?.id || null,
        status: "all",
      };
      const res = await getSubmissionsForApprovalsApi(payload, getAuthToken());
      if (res && res.status && Array.isArray(res.data)) {
        // 1. Ready To Invoice: manager approved entries waiting to be billed
        const approvedForCredit = res.data.filter((s) => {
          const st = (s.status || "").toLowerCase();
          return st === "pending credit control approval" || st === "approved";
        });
        setReadyToInvoiceList(approvedForCredit);

        // 2. Invoiced Register: entries that have been billed / invoiced
        const invoicedList = res.data
          .filter((s) => (s.status || "").toLowerCase() === "invoiced")
          .map((s) => {
            const today = new Date().toISOString().split("T")[0];
            const isOverdue = !s.paid_date && s.due_date && s.due_date < today;
            return {
              ...s,
              id: s.id,
              practice: s.customer_name || `Customer #${s.customer_id}`,
              client: s.client_name || `Client #${s.client_id}`,
              number: s.nomisma_bill_number || `INV-${s.id}`,
              billDate: s.nomisma_bill_date || s.submitted_at || null,
              dueDate: s.due_date || null,
              amount: parseFloat(s.net_amount || 0),
              currency: s.currency || "GBP",
              paidDate: s.paid_date || null,
              status: s.paid_date ? "Paid" : isOverdue ? "Overdue" : "Outstanding",
            };
          });
        setInvoices(invoicedList);
      } else {
        setReadyToInvoiceList([]);
        setInvoices([]);
      }
    } catch (err) {
      console.error("Error fetching credit control submissions:", err);
      setReadyToInvoiceList([]);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditControlSubmissions();
  }, []);

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

  // Generate Bill Modal (prompts for Bill Number and Bill Date)
  const handleGenerateBill = async (row) => {
    const today = new Date().toISOString().split("T")[0];
    const defaultBillNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { value: formValues, isConfirmed } = await sweatalert.fire({
      title: "Generate Bill / Raise Invoice",
      html: `
        <div class="text-start fs-13 mb-3">
          <div class="mb-1"><strong>Client:</strong> ${row.client_name || "Client"}</div>
          <div class="mb-1"><strong>Customer:</strong> ${row.customer_name || "Customer"}</div>
          <div class="mb-2"><strong>Net Amount:</strong> £${parseFloat(row.net_amount || 0).toFixed(2)}</div>
        </div>
        <div class="text-start mb-2">
          <label class="form-label small fw-bold mb-1">Bill / Invoice Number *</label>
          <input id="swal-bill-num" class="form-control form-control-sm" value="${defaultBillNum}" placeholder="e.g. INV-2026-0912" />
        </div>
        <div class="text-start">
          <label class="form-label small fw-bold mb-1">Bill Date *</label>
          <input id="swal-bill-date" type="date" class="form-control form-control-sm" value="${today}" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Raise & Save Invoice",
      confirmButtonColor: "#26bdf0",
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const billNumber = document.getElementById("swal-bill-num").value;
        const billDate = document.getElementById("swal-bill-date").value;
        if (!billNumber || !billNumber.trim()) {
          sweatalert.showValidationMessage("Please enter a valid Bill Number!");
          return false;
        }
        if (!billDate) {
          sweatalert.showValidationMessage("Please select a Bill Date!");
          return false;
        }
        return { billNumber: billNumber.trim(), billDate };
      },
    });

    if (isConfirmed && formValues) {
      try {
        const payload = {
          StaffUserId: staffDetails?.id || null,
          submission_id: row.id,
          billNumber: formValues.billNumber,
          billDate: formValues.billDate,
        };

        const res = await markSubmissionBilledApi(payload, getAuthToken());
        if (res && res.status) {
          sweatalert.fire({
            icon: "success",
            title: "Invoice Raised!",
            text: `Invoice #${formValues.billNumber} generated successfully and moved to Invoice Register.`,
            confirmButtonColor: "#26bdf0",
          });
          fetchCreditControlSubmissions();
        } else {
          sweatalert.fire({
            icon: "error",
            title: "Failed",
            text: res?.message || "Could not raise invoice.",
            confirmButtonColor: "#26bdf0",
          });
        }
      } catch (err) {
        console.error("Generate bill error:", err);
      }
    }
  };

  // Toggle Payment (Mark Paid / Undo)
  const handlePaymentToggle = async (row) => {
    try {
      const isCurrentlyPaid = !!row.paidDate;
      const today = new Date().toISOString().split("T")[0];

      if (!isCurrentlyPaid) {
        const { value: paidDate, isConfirmed } = await sweatalert.fire({
          title: "Record Payment",
          html: `<p class="text-muted small mb-2">Marking Invoice <b>#${row.number}</b> as Paid. Select payment date:</p>`,
          input: "date",
          inputValue: today,
          showCancelButton: true,
          confirmButtonText: "Confirm Payment",
          confirmButtonColor: "#0ab39c",
        });

        if (isConfirmed && paidDate) {
          const payload = {
            StaffUserId: staffDetails?.id || null,
            submission_id: row.id,
            paidDate: paidDate,
          };
          const res = await recordInvoicePaymentApi(payload, getAuthToken());
          if (res && res.status) {
            sweatalert.fire({
              icon: "success",
              title: "Payment Recorded!",
              text: `Invoice #${row.number} marked as Paid.`,
              confirmButtonColor: "#26bdf0",
            });
            fetchCreditControlSubmissions();
          }
        }
      } else {
        const confirm = await sweatalert.fire({
          title: "Undo Payment?",
          text: `Mark Invoice #${row.number} back to Outstanding?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Undo",
          confirmButtonColor: "#f06548",
        });

        if (confirm.isConfirmed) {
          const payload = {
            StaffUserId: staffDetails?.id || null,
            submission_id: row.id,
            paidDate: null,
          };
          const res = await recordInvoicePaymentApi(payload, getAuthToken());
          if (res && res.status) {
            sweatalert.fire({
              icon: "success",
              title: "Payment Cleared",
              text: `Invoice #${row.number} status reverted to Outstanding.`,
              confirmButtonColor: "#26bdf0",
            });
            fetchCreditControlSubmissions();
          }
        }
      }
    } catch (err) {
      console.error("Payment toggle error:", err);
    }
  };

  // Ready To Invoice Datatable Columns matching Approvals standard
  const readyColumns = [
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
      selector: (row) => row.customer_name || row.practice,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div
          title={row.customer_name || row.practice || "-"}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.customer_name || row.practice || "-"}
        </div>
      ),
    },
    {
      name: "Client Name",
      selector: (row) => row.client_name || row.client,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div
          title={row.client_name || row.client || "-"}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.client_name || row.client || "-"}
        </div>
      ),
    },
    {
      name: "Service Name",
      selector: (row) => row.service_name || row.assignmentName,
      sortable: true,
      minWidth: "160px",
      cell: (row) => (
        <div
          title={row.service_name || row.assignmentName || "Service"}
          style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {row.service_name || row.assignmentName || "Service"}
        </div>
      ),
    },
    {
      name: "Period",
      selector: (row) => row.period_label || row.periodLabel,
      sortable: true,
      minWidth: "130px",
      cell: (row) => (
        <span className="badge bg-light text-dark border">
          {row.period_label || row.periodLabel || "-"}
        </span>
      ),
    },
    {
      name: "Model",
      selector: (row) => row.engagement_model || row.model,
      sortable: true,
      minWidth: "180px",
      cell: (row) => (
        <div className="py-2">
          {renderModelBadges(row.engagement_model || row.model)}
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
          £{parseFloat(row.gross_amount || row.net_amount || row.net || 0).toFixed(2)}
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
      selector: (row) => parseFloat(row.net_amount || row.net || 0),
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className="fw-bold text-info fs-6">
          {row.currency === "AUD" ? "AUD " : "£"}
          {parseFloat(row.net_amount || row.net || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1 fw-semibold d-inline-flex align-items-center gap-1">
          <Check size={13} /> Sent to Credit Control
        </span>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.submitted_at,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <div className="text-muted">
          {row.submitted_at ? convertDate1(row.submitted_at) : "30-10-2026"}
        </div>
      ),
    },
    {
      name: "Actions",
      minWidth: "190px",
      width: "190px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-start gap-2 text-nowrap">
          {/* View Snapshot / Details Modal */}
          <button
            type="button"
            className="view-icon rounded-pills border-primary flex-shrink-0"
            title="View Details"
            onClick={() => setViewDetailsModal(row)}
          >
            <i className="ti-eye text-primary" />
          </button>

          {/* Raise Bill Button */}
          <button
            type="button"
            className="btn btn-sm btn-info text-white py-1 px-3 fs-12 rounded-pill shadow-xs d-inline-flex align-items-center gap-1 fw-medium text-nowrap"
            style={{ whiteSpace: "nowrap" }}
            onClick={() => handleGenerateBill(row)}
          >
            <FileText size={13} className="flex-shrink-0" /> Generate Bill
          </button>
        </div>
      ),
    },
  ];

  const invoiceColumns = [
    {
      name: "Invoice #",
      selector: (row) => row.number,
      sortable: true,
      minWidth: "140px",
      cell: (row) => <span className="fw-bold text-dark">{row.number}</span>,
    },
    {
      name: "Customer Name",
      selector: (row) => row.practice,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row.practice}
        </div>
      ),
    },
    {
      name: "Client Name",
      selector: (row) => row.client,
      sortable: true,
      minWidth: "170px",
      cell: (row) => (
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {row.client}
        </div>
      ),
    },
    {
      name: "Bill Date",
      selector: (row) => row.billDate,
      sortable: true,
      minWidth: "110px",
      width: "120px",
      cell: (row) => <div className="text-muted">{row.billDate ? convertDate1(row.billDate) : "-"}</div>,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
      minWidth: "110px",
      width: "120px",
      cell: (row) => <div className="text-muted">{row.dueDate ? convertDate1(row.dueDate) : "-"}</div>,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      minWidth: "120px",
      cell: (row) => (
        <span className="fw-bold text-dark fs-6">
          {row.currency === "AUD" ? "AUD " : "£"}
          {parseFloat(row.amount || 0).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      minWidth: "120px",
      width: "130px",
      cell: (row) => {
        if (row.paidDate) {
          return (
            <span className="badge rounded-pill px-3 py-1 fw-semibold shadow-xs" style={{ backgroundColor: "#dcfce7", color: "#15803d", border: "1px solid #bbf7d0", fontSize: "11.5px" }}>
              ✓ Paid
            </span>
          );
        }
        if (row.status === "Overdue") {
          return (
            <span className="badge rounded-pill px-3 py-1 fw-semibold shadow-xs" style={{ backgroundColor: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5", fontSize: "11.5px" }}>
              ⚠ Overdue
            </span>
          );
        }
        return (
          <span className="badge rounded-pill px-3 py-1 fw-semibold shadow-xs" style={{ backgroundColor: "#fef3c7", color: "#b45309", border: "1px solid #fde68a", fontSize: "11.5px" }}>
            Outstanding
          </span>
        );
      },
    },
    {
      name: "Action",
      minWidth: "180px",
      width: "180px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-start gap-2 text-nowrap">
          {/* View Details / Snapshot Button */}
          <button
            type="button"
            className="view-icon rounded-pills border-primary flex-shrink-0"
            title="View Details"
            onClick={() => setViewDetailsModal(row)}
          >
            <i className="ti-eye text-primary" />
          </button>

          {/* Mark Paid / Undo Button */}
          {row.paidDate ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm py-1 px-3 fs-12 rounded-pill d-inline-flex align-items-center gap-1 shadow-xs fw-medium text-nowrap"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => handlePaymentToggle(row)}
              title="Undo Paid status"
            >
              <Undo2 size={13} className="flex-shrink-0" /> Undo
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-success text-white py-1 px-3 fs-12 rounded-pill shadow-xs d-inline-flex align-items-center gap-1 fw-medium text-nowrap"
              style={{ whiteSpace: "nowrap" }}
              onClick={() => handlePaymentToggle(row)}
              title="Mark Invoice as Paid"
            >
              <CheckCircle size={13} className="flex-shrink-0" /> Mark Paid
            </button>
          )}
        </div>
      ),
    },
  ];

  const totalInvoices = invoices.length;
  const paidCount = invoices.filter((i) => i.paidDate).length;
  const outstandingCount = invoices.filter((i) => !i.paidDate && i.status !== "Overdue").length;
  const overdueCount = invoices.filter((i) => !i.paidDate && i.status === "Overdue").length;
  const paidPct = totalInvoices > 0 ? Math.round((paidCount / totalInvoices) * 100) : 0;

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="credit" />

        <div className="report-data mt-4">
          {/* Header Description */}
          <div className="mb-4">
            <h4 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Credit Control
            </h4>
            <p className="text-muted fs-13 mb-0">
              Raise bills, record payments and chase overdue invoices. Amounts are shown per currency; nothing is converted.
            </p>
          </div>

          {/* Metric Tiles matching Main Dashboard Cards */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-12 col-xl-3 col-lg-6 mb-3">
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        INVOICES RAISED
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{totalInvoices}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/suitcase.png"
                        alt="invoices"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-xl-3 col-lg-6 mb-3">
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        OUTSTANDING
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{outstandingCount}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/time-management.png"
                        alt="outstanding"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-xl-3 col-lg-6 mb-3">
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        OVERDUE
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-danger">{overdueCount}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/pending.png"
                        alt="overdue"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 col-xl-3 col-lg-6 mb-3">
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        PAID (BY COUNT)
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-success">{paidPct}%</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/handshake.png"
                        alt="paid"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Ready to Invoice */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="Ready to invoice"
                totalCount={readyToInvoiceList.length}
                columns={readyColumns}
                data={readyToInvoiceList}
                loading={loading}
                filter={true}
                exportFileName={`Ready_To_Invoice_${billingMonth}`}
                noDataText="Nothing approved and waiting to be billed right now."
              />
            </div>
          </div>

          {/* Section 2: Invoice Register */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="Invoice register"
                totalCount={invoices.length}
                columns={invoiceColumns}
                data={invoices}
                filter={true}
                exportFileName={`Invoice_Register_${billingMonth}`}
                noDataText="No invoices raised yet."
              />
            </div>
          </div>
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

            {/* Revenue Split / Contributors if present */}
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
    </div>
  );
};

export default CreditControl;
