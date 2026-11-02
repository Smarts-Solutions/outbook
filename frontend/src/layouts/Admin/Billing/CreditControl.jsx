import React, { useState, useEffect } from "react";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import { initialInvoices } from "./billingMockData";
import { getSubmissionsForApprovalsApi } from "../../../Services/Billing/BillingService";
import { convertDate1 } from "../../../Utils/Comman_function";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Check, Eye, FileText, ArrowUpRight } from "lucide-react";
import sweatalert from "sweetalert2";

const CreditControl = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
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
        // Submissions that are approved by manager and sent to credit control
        const approvedForCredit = res.data.filter((s) => {
          const st = (s.status || "").toLowerCase();
          return st.includes("credit control") || st === "approved";
        });
        setReadyToInvoiceList(approvedForCredit);
      } else {
        setReadyToInvoiceList([]);
      }
    } catch (err) {
      console.error("Error fetching credit control submissions:", err);
      setReadyToInvoiceList([]);
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

  const handleGenerateBill = (row) => {
    const invNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInv = {
      id: Date.now(),
      practice: row.customer_name || row.practice,
      client: row.client_name || row.client,
      number: invNumber,
      billDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      amount: parseFloat(row.net_amount || row.net || 0),
      currency: row.currency || "GBP",
      paidDate: null,
      daysLate: 0,
      status: "Outstanding",
    };
    setInvoices([newInv, ...invoices]);
    sweatalert.fire({
      icon: "success",
      title: "Bill Generated!",
      text: `Invoice #${invNumber} raised for £${parseFloat(row.net_amount || row.net || 0).toFixed(2)}.`,
      confirmButtonColor: "#26bdf0",
    });
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
      minWidth: "160px",
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      cell: (row) => (
        <div className="d-flex align-items-center justify-content-start gap-2">
          {/* View Snapshot / Details Modal */}
          <button
            type="button"
            className="view-icon rounded-pills border-primary"
            title="View Details"
            onClick={() => setViewDetailsModal(row)}
          >
            <i className="ti-eye text-primary" />
          </button>

          {/* Raise Bill Button */}
          <button
            type="button"
            className="btn btn-sm btn-info text-white py-1 px-3 fs-12 rounded-pill shadow-xs d-flex align-items-center gap-1 fw-medium"
            onClick={() => handleGenerateBill(row)}
          >
            <FileText size={13} /> Generate Bill
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
      minWidth: "120px",
      cell: (row) => <div className="text-muted">{row.billDate}</div>,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
      minWidth: "120px",
      cell: (row) => <div className="text-muted">{row.dueDate}</div>,
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
      minWidth: "130px",
      cell: (row) => {
        if (row.paidDate) {
          return (
            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 fw-semibold">
              Paid
            </span>
          );
        }
        if (row.status === "Overdue") {
          return (
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1 fw-semibold">
              Overdue
            </span>
          );
        }
        return (
          <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-2 py-1 fw-semibold">
            Outstanding
          </span>
        );
      },
    },
    {
      name: "Action",
      minWidth: "120px",
      cell: (row) =>
        row.paidDate ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm py-1 px-3 fs-12 rounded-pill"
            onClick={() =>
              setInvoices(
                invoices.map((i) =>
                  i.id === row.id ? { ...i, paidDate: null, status: "Outstanding" } : i
                )
              )
            }
          >
            Undo
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-outline-success btn-sm py-1 px-3 fs-12 rounded-pill"
            onClick={() =>
              setInvoices(
                invoices.map((i) =>
                  i.id === row.id
                    ? {
                        ...i,
                        paidDate: new Date().toISOString().split("T")[0],
                        status: "Paid",
                      }
                    : i
                )
              )
            }
          >
            Mark Paid
          </button>
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
    </div>
  );
};

export default CreditControl;
