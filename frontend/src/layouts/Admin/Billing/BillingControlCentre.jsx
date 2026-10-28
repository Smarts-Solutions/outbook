import React, { useState } from "react";
import BillingHeader from "./BillingHeader";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { initialSubmissions } from "./billingMockData";

const BillingControlCentre = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const currentCycle = "Aug-26";

  const recentColumns = [
    {
      name: "Client",
      selector: (row) => row.client,
      sortable: true,
      cell: (row) => (
        <div>
          <a style={{ color: "#26bdf0", cursor: "pointer", fontWeight: 500 }}>
            {row.client}
          </a>
          <div style={{ fontSize: "11px", color: "#6c757d" }}>{row.practice}</div>
        </div>
      ),
    },
    { name: "Assignment", selector: (row) => row.assignmentName, sortable: true },
    { name: "Period", selector: (row) => row.periodLabel, sortable: true },
    { name: "Model", selector: (row) => row.model, sortable: true },
    {
      name: "Net Amount",
      selector: (row) => row.net,
      sortable: true,
      cell: (row) => <span className="fw-bold">£{row.net.toFixed(2)}</span>,
    },
    { name: "Revenue Split", selector: (row) => row.revenueSplit },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        let statusColor = "#f1b44c";
        if (row.status === "Approved" || row.status === "Invoiced") statusColor = "#50a5f1";
        if (row.status === "Returned") statusColor = "#f46a6a";
        return (
          <span style={{ color: statusColor, fontWeight: 600, fontSize: "12px" }}>
            {row.status}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="control" />

        <div className="report-data mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                Billing Control Centre ({currentCycle})
              </h5>

              <div className="row mb-3 align-items-center">
                <div className="col-md-4">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-control"
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                  >
                    <option value="">All Models</option>
                    <option value="FTE">FTE</option>
                    <option value="ADHOC">Adhoc</option>
                    <option value="PCT_SHARING">% Sharing</option>
                    <option value="FIXED_COMMITMENT">Fixed Fee</option>
                  </select>
                </div>
              </div>

              <div className="datatable-wrapper">
                <Datatable
                  columns={recentColumns}
                  data={initialSubmissions.filter(
                    (s) =>
                      (modelFilter === "" || s.model === modelFilter) &&
                      (searchTerm === "" ||
                        s.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.practice.toLowerCase().includes(searchTerm.toLowerCase()))
                  )}
                  filter={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingControlCentre;
