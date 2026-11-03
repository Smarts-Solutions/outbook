import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Plus } from "lucide-react";
import { checkApproverAccessApi } from "../../../Services/Billing/BillingService";

export const BillingHeader = ({ activeTab }) => {
  const navigate = useNavigate();

  // Get logged-in user role
  const staffDetailsStr = localStorage.getItem("staffDetails");
  const staffDetails = staffDetailsStr ? JSON.parse(staffDetailsStr) : null;
  const roleId = Number(staffDetails?.role_id);
  const roleName = (staffDetails?.role_name || "").toLowerCase();

  // Super Admin (1) / Admin (2)
  const isAdmin = roleId === 1 || roleId === 2 || roleName.includes("admin") || roleName.includes("superadmin");

  // Read job create permission from localStorage accessData if present
  const checkJobCreateFromLocal = () => {
    if (isAdmin) return true;
    try {
      const accessData = JSON.parse(localStorage.getItem("accessData") || "[]");
      const jobPerm = accessData.find((item) => item.permission_name === "job");
      if (jobPerm && Array.isArray(jobPerm.items)) {
        const insertItem = jobPerm.items.find((it) => it.type === "insert");
        if (insertItem !== undefined) {
          return insertItem.is_assigned === 1 || insertItem.is_assigned === true;
        }
      }
    } catch (e) {
      // fallback
    }
    return false;
  };

  // State: Can current user approve (is Line Manager)
  const [canApprove, setCanApprove] = useState(() => {
    if (isAdmin) return true;
    const cached = sessionStorage.getItem(`is_line_manager_${staffDetails?.id}`);
    return cached === "true";
  });

  // State: Can current user create job / submit billing
  const [canCreateJob, setCanCreateJob] = useState(() => {
    if (isAdmin) return true;
    const cached = sessionStorage.getItem(`can_create_job_${staffDetails?.id}`);
    if (cached !== null) return cached === "true";
    return checkJobCreateFromLocal();
  });

  const getAuthToken = () => {
    try {
      const raw = localStorage.getItem("token");
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return localStorage.getItem("token");
    }
  };

  useEffect(() => {
    if (isAdmin) {
      setCanApprove(true);
      setCanCreateJob(true);
      return;
    }

    let isMounted = true;
    const verifyUserPermissions = async () => {
      try {
        const token = getAuthToken();
        const payload = { StaffUserId: staffDetails?.id };
        const res = await checkApproverAccessApi(payload, token);
        if (res && res.status && isMounted) {
          const isManager = Boolean(res.can_approve || res.is_line_manager);
          const hasJobCreate = Boolean(res.can_create_job);

          setCanApprove(isManager);
          setCanCreateJob(hasJobCreate);

          sessionStorage.setItem(`is_line_manager_${staffDetails?.id}`, String(isManager));
          sessionStorage.setItem(`can_create_job_${staffDetails?.id}`, String(hasJobCreate));
        }
      } catch (err) {
        console.error("Error verifying billing permissions:", err);
      }
    };

    if (staffDetails?.id) {
      verifyUserPermissions();
    }

    return () => {
      isMounted = false;
    };
  }, [staffDetails?.id, isAdmin]);

  const allTabs = [
    { id: "dashboard", path: "/admin/billing/dashboard", label: "My Dashboard" },
    { id: "submit", path: "/admin/billing/submit", label: "Submit Billing" },
    { id: "approvals", path: "/admin/billing/approvals", label: "Approvals" },
    { id: "credit", path: "/admin/billing/credit-control", label: "Credit Control" },
    { id: "control", path: "/admin/billing/control-centre", label: "Billing Control Centre" },
    { id: "master", path: "/admin/billing/master-data", label: "Master Data" },
  ];

  // Role & Hierarchy based visibility:
  // 1. Admin & Super Admin: All 6 tabs
  // 2. Staff / User:
  //    - "My Dashboard": Always visible
  //    - "Submit Billing": Only visible if user has job create permission (`canCreateJob`)
  //    - "Approvals": Only visible if user is a Line Manager (`canApprove`)
  const tabsList = allTabs.filter((tab) => {
    if (isAdmin) return true;
    if (tab.id === "dashboard") return true;
    if (tab.id === "submit") return canCreateJob;
    if (tab.id === "approvals") return canApprove;
    return false;
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
              {(canCreateJob || isAdmin) && (
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
