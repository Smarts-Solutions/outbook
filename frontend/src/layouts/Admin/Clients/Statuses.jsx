import React, { useState } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";

const Statuses = () => {

  const [addstatus, setAddstatus] = useState(false);
  const data = [
    {
      TradingName: "W120",
      Code: "012_BlaK_T_1772",
      CustomerName: "The Black T",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Admin/Support Tasks",
      JobType: "Year End",
    },
    {
      TradingName: "W121",
      Code: "025_NesTea_1663",
      CustomerName: "Nestea",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Onboarding/Setup",
      JobType: "Year End",
    },
    {
      TradingName: "W121",
      Code: "025_NesTea_1663",
      CustomerName: "Nestea",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Onboarding/Setup",
      JobType: "Year End",
    },
    {
      TradingName: "W121",
      Code: "025_NesTea_1663",
      CustomerName: "Nestea",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Onboarding/Setup",
      JobType: "Year End",
    },
    {
      TradingName: "W121",
      Code: "025_NesTea_1663",
      CustomerName: "Nestea",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Onboarding/Setup",
      JobType: "Year End",
    },
  ];

  const columns = [
    {
      name: "Trading Name",
      selector: (row) => row.TradingName,
      sortable: true,
    },
    { name: "Customer Code", selector: (row) => row.Code, sortable: true },
    {
      name: "Customer Name",
      selector: (row) => row.CustomerName,
      sortable: true,
    },
    {
      name: "Service Type",
      selector: (row) => row.ServiceType,
      sortable: true,
    },
    { name: "Account Manager", selector: (row) => row.JobType, sortable: true },
  ];

  return (
    <div className="contaiber-fluid">
      <div className="content-title">
        <div className="tab-title">
          <h3>Status List</h3>
        </div>
      </div>
      <div className="report-data mt-4">
        <div className="d-flex justify-content-end align-items-center">
          <div>
            <button
              type="button"
              className="btn btn-info text-white float-end "
              onClick={() => setAddstatus(true)}
            >
              <i className="fa-regular fa-plus pe-1" /> Add Status
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-9">
            <div className="datatable-wrapper mt-minus">
              <Datatable columns={columns} data={data} />
            </div>
          </div>
          <div className="col-md-3 mt-3 ">
            <div className="card ">
              <div className="card-header card-header-light-blue">
                <h6 className="card-title fs-16">Master Status</h6>
              </div>
              <div className="card-body">
                <ul className="list-group custom-list-group mb-n3">
                  <li className="list-group-item align-items-center d-flex justify-content-between py-1">
                    <div className="media">
                      <div className="media-body align-self-center">
                        <h6 className="fs-14 mb-0">USA</h6>
                      </div>
                 
                    </div>
                  </li>
                  <li className="list-group-item align-items-center d-flex justify-content-between py-1">
                    <div className="media">
                      <div className="media-body align-self-center">
                        <h6 className="fs-14 mb-0">Germany</h6>
                      </div>
                      
                    </div>
                  </li>
                  <li className="list-group-item align-items-center d-flex justify-content-between py-1">
                    <div className="media">
                      <div className="media-body align-self-center">
                        <h6 className="fs-14 mb-0">French</h6>
                      </div>
                    
                    </div>
                  </li>
                  <li className="list-group-item align-items-center d-flex justify-content-between py-1">
                    <div className="media">
                      <div className="media-body align-self-center">
                        <h6 className="fs-14 mb-0">Spain</h6>
                      </div>
                   
                    </div>
                  </li>
                  <li className="list-group-item align-items-center d-flex justify-content-between py-1">
                    <div className="media">
                      <div className="media-body align-self-center">
                        <h6 className="fs-14 mb-0">Italy</h6>
                      </div>
                
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Statuses;
