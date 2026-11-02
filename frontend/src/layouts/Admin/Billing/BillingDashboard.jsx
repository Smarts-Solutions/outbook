import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import { getSubmissionsForApprovalsApi, getActiveCustomersBilling } from "../../../Services/Billing/BillingService";

const BillingDashboard = () => {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({
    engagementsInScope: 0,
    unbilledThisMonth: 0,
    awaitingApproval: 0,
    returnedEntries: 0,
    readyToInvoice: 0,
    outstandingInvoices: 0,
  });

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

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        const payload = {
          StaffUserId: staffDetails?.id || null,
          status: "all",
        };
        const token = getAuthToken();

        // 1. Fetch live submissions from database
        const submissionsRes = await getSubmissionsForApprovalsApi(payload, token);
        let awaitingCount = 0;
        let returnedCount = 0;
        let readyToInvoiceCount = 0;

        if (submissionsRes && submissionsRes.status && Array.isArray(submissionsRes.data)) {
          const list = submissionsRes.data;
          list.forEach((item) => {
            const st = (item.status || "").toLowerCase();
            if (st === "pending manager approval" || st === "pending") {
              awaitingCount += 1;
            } else if (st.includes("return")) {
              returnedCount += 1;
            } else if (st.includes("credit control") || st === "approved") {
              readyToInvoiceCount += 1;
            }
          });
        }

        // 2. Fetch active customers / engagements in scope
        let customerCount = 0;
        try {
          const custRes = await getActiveCustomersBilling({ searchValue: "", pageNo: 1 }, token);
          if (custRes && custRes.status && Array.isArray(custRes.data)) {
            customerCount = custRes.totalCount || custRes.data.length;
          }
        } catch (e) {
          console.error("Error fetching customers count:", e);
        }

        setMetrics({
          engagementsInScope: customerCount || 3, // In scope customers
          unbilledThisMonth: 0,
          awaitingApproval: awaitingCount,
          returnedEntries: returnedCount,
          readyToInvoice: readyToInvoiceCount,
          outstandingInvoices: 0,
        });
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
            {/* 1. Engagements In Scope */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/master-data")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        ENGAGEMENTS IN SCOPE
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.engagementsInScope}</h3>
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

            {/* 2. Unbilled This Month */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/control-centre")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        UNBILLED THIS MONTH
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.unbilledThisMonth}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/time-management.png"
                        alt="unbilled"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Awaiting Approval */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/approvals")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        AWAITING APPROVAL
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.awaitingApproval}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/pending.png"
                        alt="awaiting"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Returned Entries */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/approvals")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        RETURNED ENTRIES
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.returnedEntries}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/suitcase.png"
                        alt="returned"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Ready To Invoice */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/credit-control")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        READY TO INVOICE
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.readyToInvoice}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/handshake.png"
                        alt="ready to invoice"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Outstanding Invoices */}
            <div
              className="col-md-12 col-xl-4 col-lg-6"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/admin/billing/credit-control")}
            >
              <div className="card report-card dashboard-card">
                <div className="card-body">
                  <div className="row d-flex justify-content-center">
                    <div className="col-12">
                      <p className="text-dark mb-1 font-weight-semibold">
                        OUTSTANDING INVOICES
                      </p>
                    </div>
                    <div className="col-12 d-flex align-items-center justify-content-between">
                      <h3 className="my-4">{metrics.outstandingInvoices}</h3>
                      <img
                        className="dashboad-img"
                        src="/assets/images/dashboards/teamwork.png"
                        alt="outstanding"
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
