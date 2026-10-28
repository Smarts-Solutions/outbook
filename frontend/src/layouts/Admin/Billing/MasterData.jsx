import React from "react";
import { BillingHeader } from "./BillingHeader";
import Datatable from "../../../Components/ExtraComponents/Datatable";

export const MasterData = () => {
  const masterColumns = [
    {
      name: "Practice Name",
      selector: (row) => row.practice,
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.client,
      cell: (row) => <span className="text-info fw-semibold">{row.client}</span>,
      sortable: true,
    },
    {
      name: "Model",
      selector: (row) => row.model,
      sortable: true,
    },
    {
      name: "Service Line",
      selector: (row) => row.serviceLine,
      sortable: true,
    },
    {
      name: "Current Rate Terms",
      selector: (row) => row.rateTerms,
      sortable: true,
    },
    {
      name: "Billing Owner (Manager)",
      selector: (row) => row.manager,
      sortable: true,
    },
    {
      name: "Credit Terms",
      selector: (row) => row.creditTerms,
      sortable: true,
    },
  ];

  const masterRows = [
    {
      id: 1,
      practice: "Acorn Accountancy LLP",
      client: "Peak Digital Ltd",
      model: "FTE",
      serviceLine: "Bookkeeping",
      rateTerms: "£1,850.00 / FTE",
      manager: "David Smith",
      creditTerms: "14 days",
    },
    {
      id: 2,
      practice: "Highland Chartered CPAs",
      client: "Glen View Hotels",
      model: "ADHOC",
      serviceLine: "Payroll",
      rateTerms: "£25.00 / hour",
      manager: "Sarah Jenkins",
      creditTerms: "30 days",
    },
    {
      id: 3,
      practice: "Sterling Tax & Advisory",
      client: "Crestview Holdings",
      model: "PCT_SHARING",
      serviceLine: "Accounts Finalisation",
      rateTerms: "20.00% of Billing",
      manager: "David Smith",
      creditTerms: "14 days",
    },
  ];

  return (
    <div>
      <div className="container-fluid">
        <BillingHeader activeTab="master" />

        <div className="report-data mt-4">
          <div className="card">
            <div className="card-body">
              <h5 className="mt-0 mb-3" style={{ fontWeight: 600 }}>
                Master Engagements & Rate Cards
              </h5>
              <div className="datatable-wrapper">
                <Datatable filter={true} columns={masterColumns} data={masterRows} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasterData;
