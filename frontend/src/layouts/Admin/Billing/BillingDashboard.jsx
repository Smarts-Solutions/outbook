import React from "react";
import { useNavigate } from "react-router-dom";
import BillingHeader from "./BillingHeader";
import { initialMissingEngagements, initialSubmissions, initialInvoices } from "./billingMockData";

const BillingDashboard = () => {
  const navigate = useNavigate();

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
                      <h3 className="my-4">48</h3>
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
                      <h3 className="my-4">{initialMissingEngagements.length}</h3>
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
                      <h3 className="my-4">
                        {
                          initialSubmissions.filter(
                            (s) =>
                              s.status === "Pending Manager Approval" ||
                              s.status === "Pending Credit Control Approval"
                          ).length
                        }
                      </h3>
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
                      <h3 className="my-4">
                        {initialSubmissions.filter((s) => s.status === "Returned").length}
                      </h3>
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
                      <h3 className="my-4">
                        {initialSubmissions.filter((s) => s.status === "Approved").length}
                      </h3>
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
                      <h3 className="my-4">
                        {initialInvoices.filter((i) => !i.paidDate).length}
                      </h3>
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
