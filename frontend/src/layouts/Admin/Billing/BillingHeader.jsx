import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";

export const BillingHeader = ({ activeTab }) => {
  const navigate = useNavigate();

  // Get logged-in user role
  const staffDetailsStr = localStorage.getItem("staffDetails");
  const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
  const roleId = Number(staffDetails?.role_id);
  const roleName = (staffDetails?.role_name || "").toLowerCase();

  // Role Checks
  // Super Admin (1) / Admin (2)
  const isAdmin = roleId === 1 || roleId === 2 || roleName.includes("admin") || roleName.includes("superadmin");
  // Account Manager (4) -> Manager / Approver
  const isAccountManager = roleId === 4 || roleName.includes("account manager");

  const allTabs = [
    { id: "dashboard", path: "/admin/billing/dashboard", label: "My Dashboard" },
    { id: "submit", path: "/admin/billing/submit", label: "Submit Billing" },
    { id: "approvals", path: "/admin/billing/approvals", label: "Approvals" },
    { id: "credit", path: "/admin/billing/credit-control", label: "Credit Control" },
    { id: "control", path: "/admin/billing/control-centre", label: "Billing Control Centre" },
    { id: "master", path: "/admin/billing/master-data", label: "Master Data" },
  ];

  // Role-based visibility:
  // 1. Admin & Super Admin: All 6 tabs
  // 2. Account Manager (Manager/Approver): Approvals tab (no Submit Billing tab)
  // 3. Team Member / Processor / Other: My Dashboard, Submit Billing
  const tabsList = allTabs.filter((tab) => {
    if (isAdmin) return true;
    if (isAccountManager) {
      // Approver / Account Manager should NOT see Submit Billing tab
      return tab.id === "dashboard" || tab.id === "approvals";
    }
    // General Staff / Processor / Team Member
    return tab.id === "dashboard" || tab.id === "submit";
  });

  return (
    <>
      {/* Content Title Header */}
      <div className="content-title">
        <div className="row align-items-center">
          <div className="col-12 col-sm-6">
            <div className="tab-title">
              <h3 className="mt-0">Billing & Invoice</h3>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="d-flex justify-content-sm-end align-items-center gap-2 mt-3 mt-sm-0">
              <button
                type="button"
                className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-1"
              >
                <Download size={16} /> Export Excel
              </button>
              {(!isAccountManager || isAdmin) && (
                <button
                  type="button"
                  className="btn btn-info text-white d-flex align-items-center gap-1"
                  onClick={() => navigate("/admin/billing/submit")}
                >
                  <Plus size={16} /> Add Billing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Outbook Standard nav-pills rounded-tabs */}
      <div className="page-title-box pt-2 pb-0">
        <div className="row align-items-center">
          <div className="col-12">
            <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
              {tabsList.map((tab) => (
                <li className="nav-item" role="presentation" key={tab.id}>
                  <button
                    type="button"
                    className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                    id={`${tab.id}-tab`}
                    role="tab"
                    onClick={() => navigate(tab.path)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingHeader;
