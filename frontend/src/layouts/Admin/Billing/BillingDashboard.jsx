import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import {
  getBillingDashboardMetricsApi,
  getSubmissionsForApprovalsApi
} from "../../../Services/Billing/BillingService";

const BillingDashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    totalSubmitted: 0,
    totalApproved: 0,
    pendingCreditControl: 0,
    totalReturned: 0,
  });

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

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const payload = {
          StaffUserId: staffDetails?.id || null,
        };
        const token = getAuthToken();

        // Fetch live metrics from database
        const metricsRes = await getBillingDashboardMetricsApi(payload, token);
        let mData = {
          totalSubmitted: 0,
          totalApproved: 0,
          pendingCreditControl: 0,
          totalReturned: 0,
        };

        if (metricsRes && metricsRes.status && metricsRes.data) {
          mData = {
            totalSubmitted: metricsRes.data.totalSubmitted || 0,
            totalApproved: metricsRes.data.totalApproved || 0,
            pendingCreditControl: metricsRes.data.pendingCreditControl || 0,
            totalReturned: metricsRes.data.totalReturned || 0,
          };
        } else {
          // Fallback calculation
          const submissionsRes = await getSubmissionsForApprovalsApi({ StaffUserId: staffDetails?.id, status: "all" }, token);
          if (submissionsRes && submissionsRes.status && Array.isArray(submissionsRes.data)) {
            const list = submissionsRes.data;
            mData.totalSubmitted = list.length;
            list.forEach((item) => {
              const st = (item.status || "").toLowerCase();
              if (st.includes("return")) {
                mData.totalReturned += 1;
              } else if (st === "pending credit control approval") {
                mData.pendingCreditControl += 1;
                mData.totalApproved += 1;
              } else if (st.includes("approved") || st === "invoiced") {
                mData.totalApproved += 1;
              }
            });
          }
        }

        setMetrics(mData);
      } catch (err) {
        console.error("Dashboard metrics error:", err);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="dashboard" />

        <div className="report-data mt-4">
          <div className="row justify-content-center">
            {/* 1. Submitted Bills */}
            <div
              className="col-md-6 col-xl-3 col-lg-6 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/submit")}
            >
              <div className="card report-card dashboard-card h-100">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        SUBMITTED BILLS
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.totalSubmitted}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/time-management.png"
                        alt="submitted bills"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Approved Bills */}
            <div
              className="col-md-6 col-xl-3 col-lg-6 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(isAdmin ? "/admin/billing/credit-control" : "/admin/billing/approvals")}
            >
              <div className="card report-card dashboard-card h-100">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        APPROVED BILLS
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-success">{metrics.totalApproved}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/handshake.png"
                        alt="approved bills"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. In Credit Control */}
            <div
              className="col-md-6 col-xl-3 col-lg-6 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(isAdmin ? "/admin/billing/credit-control" : "/admin/billing/approvals")}
            >
              <div className="card report-card dashboard-card h-100">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        IN CREDIT CONTROL
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-primary">{metrics.pendingCreditControl}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/pending.png"
                        alt="in credit control"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Returned Bills */}
            <div
              className="col-md-6 col-xl-3 col-lg-6 mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/approvals")}
            >
              <div className="card report-card dashboard-card h-100">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        RETURNED BILLS
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4 text-danger">{metrics.totalReturned}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/suitcase.png"
                        alt="returned bills"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;
