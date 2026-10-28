import React, { useState } from "react";
import { BillingHeader } from "./BillingHeader";
import BillingDatatable from "./BillingDatatable";
import {
  initialMissingEngagements,
  initialClients,
  initialRevenueSplitTeam,
  initialUsersAccess,
  initialAuditLogs,
} from "./billingMockData";
import { Plus, Download, Upload } from "lucide-react";

export const MasterData = () => {
  const [activeSubTab, setActiveSubTab] = useState("engagements");

  // State collections
  const [engagements, setEngagements] = useState(initialMissingEngagements);
  const [clients, setClients] = useState(initialClients);
  const [revenueTeam, setRevenueTeam] = useState(initialRevenueSplitTeam);
  const [usersAccess, setUsersAccess] = useState(initialUsersAccess);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);

  // Settings tab form state
  const [settings, setSettings] = useState({
    billingMonth: "September 2026",
    creditPeriodDays: 14,
    varianceWarningPct: 20,
    highPriorityVariancePct: 40,
    serviceLines: `Accounts Finalisation\nBookkeeping\nPayroll\nPersonal Tax Return\nCompliance\nCompany Secretary`,
    entryTypes: `Bookkeeping\nYearend\nPayroll\nAudit\nPersonal Tax Return\nCompany Secretary`,
    fteWording: `Bookkeeping = Bookkeeper`,
    nomismaFte: `{fteRole} - {period}`,
    nomismaAdhoc: `{type} - {assignment} - {period}`,
    nomismaSharingAssignment: `{type} - {assignment} - {period}`,
    nomismaSharingMonth: `sharing charges for the month of {period} at {pct}% sharing`,
    nomismaSharingPeriod: `sharing charges for the period {period} at {pct}% sharing`,
    nomismaFixedFee: `{type} - {assignment} - Fixed fee incl. excess - {period}`,
  });

  // Import subtab state
  const [selectedFile, setSelectedFile] = useState(null);

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

  /* -------------------------------------------------------------
   * 1. ENGAGEMENTS COLUMNS (Screenshot 1)
   * ------------------------------------------------------------- */
  const engagementsColumns = [
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

  /* -------------------------------------------------------------
   * 2. CLIENTS COLUMNS (Screenshot 2)
   * ------------------------------------------------------------- */
  const clientsColumns = [
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
      cell: (row) => <strong className="text-dark">{row.client}</strong>,
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
    },
    {
      name: "Currency",
      selector: (row) => row.currency,
      sortable: true,
      cell: (row) => <span className="fw-bold">{row.currency}</span>,
    },
    {
      name: "Credit terms",
      selector: (row) => row.creditTerms,
      sortable: true,
      cell: (row) => <span className="text-muted">{row.creditTerms}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.status === "Active"
              ? "status-indicator-active"
              : "status-indicator-inactive"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: () => (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary py-1 px-2 fs-12"
        >
          Edit
        </button>
      ),
    },
  ];

  /* -------------------------------------------------------------
   * 3. REVENUE-SPLIT TEAM COLUMNS (Screenshot 3)
   * ------------------------------------------------------------- */
  const revenueTeamColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <strong className="text-dark">{row.name}</strong>,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <span className="text-muted">{row.email}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.status === "Active"
              ? "status-indicator-active"
              : "status-indicator-inactive"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-flex align-items-center gap-1">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary py-1 px-2 fs-12"
            onClick={() => {
              setRevenueTeam((prev) =>
                prev.map((item) =>
                  item.id === row.id
                    ? {
                        ...item,
                        status: item.status === "Active" ? "Inactive" : "Active",
                      }
                    : item
                )
              );
            }}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary py-1 px-2 fs-12"
            onClick={() => {
              setRevenueTeam((prev) => prev.filter((item) => item.id !== row.id));
            }}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  /* -------------------------------------------------------------
   * 4. USERS & ACCESS COLUMNS (Screenshot 4)
   * ------------------------------------------------------------- */
  const usersAccessColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => <strong className="text-dark">{row.name}</strong>,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <span className="text-muted">{row.email}</span>,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Manager",
      selector: (row) => row.manager,
      sortable: true,
      cell: (row) =>
        row.manager === "—" ? (
          <span className="text-muted">—</span>
        ) : (
          <span>{row.manager}</span>
        ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span
          className={
            row.status === "Active"
              ? "status-indicator-active"
              : "status-indicator-inactive"
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      name: "Action",
      cell: () => (
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary py-1 px-2 fs-12"
        >
          Edit
        </button>
      ),
    },
  ];

  /* -------------------------------------------------------------
   * 5. AUDIT LOG COLUMNS (Screenshot 3)
   * When (UTC) | Who | Action | Item | Before | After | Reason
   * ------------------------------------------------------------- */
  const auditColumns = [
    {
      name: "When (UTC)",
      selector: (row) => row.when,
      sortable: true,
      cell: (row) => <span className="text-secondary">{row.when}</span>,
    },
    {
      name: "Who",
      selector: (row) => row.who,
      sortable: true,
      cell: (row) => <strong className="text-dark">{row.who}</strong>,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.item,
      sortable: true,
    },
    {
      name: "Before",
      selector: (row) => row.before || "—",
      cell: (row) => (
        <span className="text-muted">{row.before || "—"}</span>
      ),
    },
    {
      name: "After",
      selector: (row) => row.after || "—",
      cell: (row) => (
        <span className="font-monospace fs-12 text-dark">{row.after || "—"}</span>
      ),
    },
    {
      name: "Reason",
      selector: (row) => row.reason || "—",
      cell: (row) => (
        <span className="text-muted">{row.reason || "—"}</span>
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
          <div className="master-data-subtabs">
            {subTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`master-data-subtab-btn ${
                  activeSubTab === tab.id ? "active" : ""
                }`}
                onClick={() => setActiveSubTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: ENGAGEMENTS */}
          {activeSubTab === "engagements" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <BillingDatatable
                  title="Engagements"
                  totalCount={engagements.length}
                  columns={engagementsColumns}
                  data={engagements}
                  filter={true}
                  exportFileName="Master_Engagements"
                  actionButton={
                    <button
                      type="button"
                      className="btn-brown"
                      onClick={() => alert("Open New Engagement Modal / Form")}
                    >
                      <Plus size={15} /> New engagement
                    </button>
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 2: CLIENTS */}
          {activeSubTab === "clients" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <BillingDatatable
                  title="Clients"
                  totalCount={clients.length}
                  columns={clientsColumns}
                  data={clients}
                  filter={true}
                  exportFileName="Master_Clients"
                  actionButton={
                    <button
                      type="button"
                      className="btn-brown"
                      onClick={() => alert("Open New Client Modal / Form")}
                    >
                      <Plus size={15} /> New client
                    </button>
                  }
                />
              </div>
            </div>
          )}

          {/* TAB 3: REVENUE-SPLIT TEAM */}
          {activeSubTab === "revenue_split" && (
            <div>
              <div className="billing-info-banner">
                These are the people who can be given a share of an entry's revenue.
                People with a login are added here automatically.
              </div>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <BillingDatatable
                    title="Revenue-split team"
                    totalCount={revenueTeam.length}
                    columns={revenueTeamColumns}
                    data={revenueTeam}
                    filter={true}
                    exportFileName="Master_Revenue_Split_Team"
                    actionButton={
                      <button
                        type="button"
                        className="btn-brown"
                        onClick={() => alert("Open Add Member Modal")}
                      >
                        <Plus size={15} /> Add member
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: USERS & ACCESS */}
          {activeSubTab === "users" && (
            <div>
              <div className="billing-info-banner">
                Only people listed here can sign in, and only with their Microsoft 365
                account. Switching someone off blocks them immediately.
              </div>
              <div className="card border-0 shadow-sm">
                <div className="card-body p-3">
                  <BillingDatatable
                    title="Users & access"
                    totalCount={usersAccess.length}
                    columns={usersAccessColumns}
                    data={usersAccess}
                    filter={true}
                    exportFileName="Master_Users_Access"
                    actionButton={
                      <button
                        type="button"
                        className="btn-brown"
                        onClick={() => alert("Open Add User Modal")}
                      >
                        <Plus size={15} /> Add user
                      </button>
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: IMPORT (Screenshot 5) */}
          {activeSubTab === "import" && (
            <div>
              <div className="billing-info-banner">
                Upload a CSV or Excel file of clients and engagements. You will see
                exactly what will be added or changed <strong>before anything is saved</strong>.
                A changed rate needs an EffectiveFrom date; past rates are kept.
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-4">
                    <label className="form-label fw-bold fs-13 mb-2">
                      File (CSV or Excel)
                    </label>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        style={{ maxWidth: "340px" }}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm py-1 px-3 fs-13"
                      onClick={() => alert("Downloading blank template...")}
                    >
                      Download blank template
                    </button>
                    {selectedFile && (
                      <button
                        type="button"
                        className="btn btn-brown btn-sm"
                        onClick={() => alert(`Uploading ${selectedFile.name}...`)}
                      >
                        <Upload size={14} /> Review & Import
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS (Screenshots 1 & 2) */}
          {activeSubTab === "settings" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4" style={{ maxWidth: "780px" }}>
                {/* Row 1: Billing month & Credit period */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="settings-label">
                      Billing month being worked on
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={settings.billingMonth}
                      onChange={(e) =>
                        setSettings({ ...settings, billingMonth: e.target.value })
                      }
                    />
                    <p className="settings-hint">
                      Defaults to last month. Change it when the new month's billing starts.
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="settings-label">
                      Default credit period (days)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={settings.creditPeriodDays}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          creditPeriodDays: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Row 2: Variance warning % & High-priority variance % */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="settings-label">
                      Variance warning at (% change vs previous)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={settings.varianceWarningPct}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          varianceWarningPct: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="settings-label">
                      High-priority variance at (%)
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={settings.highPriorityVariancePct}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          highPriorityVariancePct: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Row 3: Service lines & Types in dropdown */}
                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="settings-label">
                      Service lines (one per line)
                    </label>
                    <textarea
                      rows={6}
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.serviceLines}
                      onChange={(e) =>
                        setSettings({ ...settings, serviceLines: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="settings-label">
                      Types in the entry dropdown (one per line)
                    </label>
                    <textarea
                      rows={6}
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.entryTypes}
                      onChange={(e) =>
                        setSettings({ ...settings, entryTypes: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Row 4: FTE wording */}
                <div className="mb-4">
                  <label className="settings-label">
                    FTE wording — type = label (e.g. Bookkeeping = Bookkeeper)
                  </label>
                  <textarea
                    rows={2}
                    className="form-control form-control-sm font-monospace fs-12"
                    value={settings.fteWording}
                    onChange={(e) =>
                      setSettings({ ...settings, fteWording: e.target.value })
                    }
                  />
                </div>

                {/* Section: Nomisma description wording */}
                <div className="border-top pt-3">
                  <h6 className="settings-section-title">Nomisma description wording</h6>
                  <p className="settings-section-subtitle">
                    You can use {"{type}"} {"{assignment}"} {"{period}"} {"{pct}"} {"{fteRole}"}. Changes apply to new entries only.
                  </p>

                  <div className="mb-3">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      FTE
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaFte}
                      onChange={(e) =>
                        setSettings({ ...settings, nomismaFte: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      Adhoc
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaAdhoc}
                      onChange={(e) =>
                        setSettings({ ...settings, nomismaAdhoc: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      % sharing — with assignment list
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaSharingAssignment}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          nomismaSharingAssignment: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      % sharing — one line for the month
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaSharingMonth}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          nomismaSharingMonth: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      % sharing — one line for a week / quarter / year
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaSharingPeriod}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          nomismaSharingPeriod: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fs-12 fw-semibold text-muted mb-1">
                      Fixed fee
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm font-monospace fs-12"
                      value={settings.nomismaFixedFee}
                      onChange={(e) =>
                        setSettings({ ...settings, nomismaFixedFee: e.target.value })
                      }
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn-brown"
                      onClick={() => alert("Settings saved successfully!")}
                    >
                      Save settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AUDIT LOG (Screenshot 3) */}
          {activeSubTab === "audit" && (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-3">
                <BillingDatatable
                  title="Audit log"
                  totalCount={auditLogs.length}
                  columns={auditColumns}
                  data={auditLogs}
                  filter={false}
                  exportFileName="Master_Audit_Log"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MasterData;
