import React, { useState } from "react";
import { BillingHeader } from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import { initialMissingEngagements } from "./billingMockData";
import { Plus } from "lucide-react";

export const MasterData = () => {
  const [activeSubTab, setActiveSubTab] = useState("engagements");

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

  // Columns exactly as shown in Screenshot 4:
  // Practice | Client | Service | Model | Billing owner | Account mgr | Rates | Action
  const masterColumns = [
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
        <span>
          <strong className="text-dark">{row.client}</strong>{" "}
          <span className="badge bg-light text-muted border">{row.country}</span>
        </span>
      ),
    },
    {
      name: "Service",
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
      name: "Billing owner",
      selector: (row) => row.manager,
      sortable: true,
    },
    {
      name: "Account mgr",
      selector: (row) => row.accountMgr || "—",
      sortable: true,
      cell: () => <span className="text-muted">—</span>,
    },
    {
      name: "Rates",
      selector: (row) => row.rates,
      sortable: true,
      cell: (row) => <span className="fw-medium text-dark">{row.rates}</span>,
    },
    {
      name: "Action",
      cell: () => (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary py-1 px-2 fs-12"
        >
          Edit / rates
        </button>
      ),
    },
  ];

  const subTabs = [
    { id: "engagements", label: "Engagements" },
    { id: "clients", label: "Clients" },
    { id: "revenue_split", label: "Revenue-split team" },
    { id: "users", label: "Users & access" },
    { id: "import", label: "Import" },
    { id: "settings", label: "Settings" },
    { id: "audit", label: "Audit log" },
  ];

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="master" />

        <div className="report-data mt-4">
          <div className="mb-3">
            <h4 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Master Data
            </h4>
            <p className="text-muted fs-13 mb-0">
              Client → Engagement → Billing model, rates with history, and who can sign in.
            </p>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="border-bottom mb-3 pb-1">
            <ul className="nav nav-tabs border-0 gap-3">
              {subTabs.map((tab) => (
                <li key={tab.id} className="nav-item">
                  <button
                    type="button"
                    className={`nav-link border-0 pb-2 px-1 fw-medium ${
                      activeSubTab === tab.id
                        ? "active border-bottom border-3 border-dark fw-bold text-dark"
                        : "text-muted"
                    }`}
                    style={{ background: "transparent" }}
                    onClick={() => setActiveSubTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <BillingDatatable
                title="Engagements"
                totalCount={initialMissingEngagements.length}
                columns={masterColumns}
                data={initialMissingEngagements}
                filter={true}
                exportFileName="Master_Engagements"
                actionButton={
                  <button
                    type="button"
                    className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-1 py-1 px-3 fs-13"
                  >
                    <Plus size={16} /> Add Engagement
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

export default MasterData;
