import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import {
  initialSubmissions,
  initialMissingEngagements,
  initialExceptions,
} from "./billingMockData";

const BillingControlCentre = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const billingMonth = "Sep-26";

  const getModelBadge = (model) => {
    const m = (model || "").toLowerCase();
    if (m.includes("adhoc")) {
      return <span className="billing-badge billing-badge-adhoc">Adhoc</span>;
    }
    if (m.includes("fte")) {
      return <span className="billing-badge billing-badge-fte">FTE</span>;
    }
    if (m.includes("sharing") || m.includes("%")) {
      return <span className="billing-badge billing-badge-sharing">% Sharing</span>;
    }
    return <span className="billing-badge billing-badge-fixed">{model || "Fixed fee"}</span>;
  };

  // Columns for Missing Billing Table (Matches image screenshot)
  const missingColumns = [
    {
      name: "Practice",
      selector: (row) => row.practice,
      sortable: true,
      cell: (row) => <span className="text-secondary">{row.practice}</span>,
    },
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
      cell: (row) => <span className="fw-semibold text-dark">{row.client}</span>,
    },
    {
      name: "Service line",
      selector: (row) => row.serviceLine,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
      cell: (row) => getModelBadge(row.model),
    },
    {
      name: "Approving manager",
      selector: (row) => row.manager,
      sortable: true,
      cell: (row) => <span>{row.manager}</span>,
    },
  ];

  // Columns for All Billing Submissions
  const submissionColumns = [
    {
      name: "Practice",
      selector: (row) => row.practice,
      sortable: true,
      cell: (row) => <span className="text-secondary">{row.practice}</span>,
    },
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
      cell: (row) => (
        <div>
          <span className="fw-semibold text-dark">{row.client}</span>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.assignmentName}</div>
        </div>
      ),
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
      cell: (row) => getModelBadge(row.model),
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
      name: "Revenue Split",
      selector: (row) => row.revenueSplit,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => {
        let color = "#f1b44c";
        if (row.status === "Approved") color = "#0ab39c";
        if (row.status === "Returned") color = "#f06548";
        if (row.status?.includes("Credit Control")) color = "#299cdb";
        return (
          <span style={{ color, fontWeight: 600, fontSize: "12px" }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  const filteredMissing = initialMissingEngagements.filter(
    (item) =>
      (modelFilter === "" ||
        item.model.toLowerCase().includes(modelFilter.toLowerCase())) &&
      (searchTerm === "" ||
        item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.practice.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="control" />

        <div className="report-data mt-4">
          {/* Header Summary info */}
          <div className="mb-4">
            <h4 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Billing Control Centre
            </h4>
            <p className="text-muted fs-13 mb-0">
              {billingMonth} — reconciliation across all practices.
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
                        EXPECTED ENGAGEMENTS
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{initialMissingEngagements.length}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/users.png"
                        alt="engagements"
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
                        ENTERED
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">2</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/suitcase.png"
                        alt="entered"
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
                        MISSING
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-danger">{initialMissingEngagements.length}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/time-management.png"
                        alt="missing"
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
                        OPEN EXCEPTIONS
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{initialExceptions.length}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/pending.png"
                        alt="exceptions"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approval pipeline */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark mb-3">Approval pipeline (all months)</h6>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="card border p-3 bg-white">
                  <div className="text-muted fs-12">Awaiting manager</div>
                  <h4 className="fw-bold mt-2 mb-0">2</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border p-3 bg-white">
                  <div className="text-muted fs-12">Awaiting Credit Control</div>
                  <h4 className="fw-bold mt-2 mb-0">1</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border p-3 bg-white">
                  <div className="text-muted fs-12">Approved — ready to bill</div>
                  <h4 className="fw-bold mt-2 mb-0">2</h4>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border p-3 bg-white">
                  <div className="text-muted fs-12">Billed</div>
                  <h4 className="fw-bold mt-2 mb-0">0</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Missing Billing Datatable */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="Missing billing"
                totalCount={filteredMissing.length}
                columns={missingColumns}
                data={filteredMissing}
                filter={true}
                exportFileName={`Missing_Billing_${billingMonth}`}
                noDataText="No missing billing engagements for this month."
              />
            </div>
          </div>

          {/* Section 2: All Billing submissions Datatable */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="All billing submissions"
                totalCount={initialSubmissions.length}
                columns={submissionColumns}
                data={initialSubmissions}
                filter={true}
                exportFileName={`Billing_Submissions_${billingMonth}`}
                noDataText="No billing submissions entered yet."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingControlCentre;
