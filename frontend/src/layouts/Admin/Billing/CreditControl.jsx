import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import { initialInvoices, initialSubmissions } from "./billingMockData";

const CreditControl = () => {
  const [invoices, setInvoices] = useState(initialInvoices);
  const billingMonth = "Sep-26";

  const readyToInvoiceList = initialSubmissions.filter(
    (s) => s.status === "Approved"
  );

  const readyColumns = [
    {
      name: "Client",
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
      name: "Assignment",
      selector: (row) => row.assignmentName,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Period",
      selector: (row) => row.periodLabel,
      sortable: true,
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
    {
      name: "Action",
      cell: (row) => (
        <button
          type="button"
          className="btn btn-sm btn-outline-primary py-1 px-2 fs-12"
          onClick={() => {
            const newInv = {
              id: Date.now(),
              practice: row.practice,
              client: row.client,
              number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
              billDate: new Date().toISOString().split("T")[0],
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              amount: row.net,
              currency: row.currency || "GBP",
              paidDate: null,
              daysLate: 0,
              status: "Outstanding",
            };
            setInvoices([newInv, ...invoices]);
          }}
        >
          Generate Bill
        </button>
      ),
    },
  ];

  const invoiceColumns = [
    {
      name: "Client",
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
      name: "Invoice #",
      selector: (row) => row.number,
      sortable: true,
      cell: (row) => <span className="fw-bold">{row.number}</span>,
    },
    {
      name: "Bill Date",
      selector: (row) => row.billDate,
      sortable: true,
    },
    {
      name: "Due Date",
      selector: (row) => row.dueDate,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      cell: (row) => (
        <span className="fw-bold">
          {row.currency} {row.amount.toFixed(2)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => (row.paidDate ? "Paid" : row.status || "Outstanding"),
      sortable: true,
      cell: (row) =>
        row.paidDate ? (
          <span className="text-success fw-bold">Paid ({row.paidDate})</span>
        ) : row.status === "Overdue" ? (
          <span className="text-danger fw-bold">Overdue</span>
        ) : (
          <span className="text-warning fw-bold">Outstanding</span>
        ),
    },
    {
      name: "Action",
      cell: (row) =>
        row.paidDate ? (
          <button
            type="button"
            className="btn btn-secondary btn-sm py-1 px-2 fs-12"
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
            className="btn btn-outline-success btn-sm py-1 px-2 fs-12"
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
    </div>
  );
};

export default CreditControl;
