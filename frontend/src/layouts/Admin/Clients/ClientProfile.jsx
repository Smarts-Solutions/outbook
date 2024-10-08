import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { Get_All_Job_List } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Get_All_Client } from "../../../ReduxStore/Slice/Client/ClientSlice";

const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState("viewclient");
  const [getClientDetails, setClientDetails] = useState({
    loading: true,
    data: [],
  });
  const [informationData, informationSetData] = useState([]);
  const [clientInformationData, setClientInformationData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);

  const GetClientDetails = async () => {
    const req = { action: "getByid", client_id: location.state.row.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Client(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientDetails({
            loading: false,
            data: response.data,
          });
          informationSetData(response.data.client);
          setClientInformationData(response.data.contact_details[0]);
          setCompanyDetails(response.data.company_details);
        } else {
          setClientDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  const tabs = [
    { id: "viewclient", label: "View Client" },
    { id: "NoOfJobs", label: "No.Of Jobs" },
    { id: "documents", label: "Documents" },
  ];

  const columns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Job Type",
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name,
      sortable: true,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code,
      sortable: true,
    },
    {
      name: "Outbooks Acount Manager",
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name,
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) =>
        row.allocated_first_name + " " + row.allocated_last_name,
      sortable: true,
    },
    {
      name: "Timesheet",
      selector: (row) =>
        // row.allocated_first_name + " " + row.allocated_last_name,
      "",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) =>
      row.invoiced == "1"? "YES" :"NO",
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row)}>
            <i className="ti-trash" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const HandleClientView = (row) => {
    navigate("/admin/client/profile", { state: row });
  };

  function handleEdit(row) {
    navigate("/admin/job/edit", {
      state: { details: location.state, row: row },
    });
  }

  function handleDelete(row) {
    console.log("Deleting row:", row);
  }

  const GetAllJobList = async () => {
    const req = { action: "getByClient", client_id: location.state.row.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Job_List(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerData(response.data);
        } else {
          setCustomerData(response.data);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };



  const handleAddClient = () => {
    navigate("/admin/createjob", {
      state: { details: location.state, goto: "client" },
    });
  };


  useEffect(() => {
    GetAllJobList();
    GetClientDetails();
  }, []);

  
  return (
    <div className="container-fluid">
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row align-items-start">
            <div className="col-md-8">
              <ul
                className="nav nav-pills rounded-tabs"
                id="pills-tab"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={`nav-link ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      id={`${tab.id}-tab`}
                      data-bs-toggle="pill"
                      data-bs-target={`#${tab.id}`}
                      type="button"
                      role="tab"
                      aria-controls={tab.id}
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {activeTab == "NoOfJobs" && (
              <>
                <div className="col-md-4 col-auto">
                  <div
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={handleAddClient}
                  >
                    <i className="fa fa-plus pe-1" /> Create Job
                  </div>
                </div>
              </>
            )}

            {activeTab === "viewclient" && (
              <div className="col-md-4 col-auto">
                <button
                  type="button"
                  className="btn btn-info text-white float-end blue-btn"
                  onClick={() => window.history.back()}
                >
                  <i className="fa fa-arrow-left pe-1" /> Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab == "NoOfJobs" && (
        <div
          className={`tab-pane fade ${
            activeTab == "NoOfJobs" ? "show active" : ""
          }`}
          id={"NoOfJobs"}
          role="tabpanel"
          aria-labelledby={`NoOfJobs-tab`}
        >
          {customerData && customerData && (
            <Datatable columns={columns} data={customerData} filter={false} />
          )}
        </div>
      )}

      {activeTab == "viewclient" && clientInformationData && (
        <div className="tab-content" id="pills-tabContent">
          <div className="report-data">
            <div className="card-body">
              <div className="dastyle-profile">
                <div className="row">
                  <div className="col-lg-4 align-self-center mb-3 mb-lg-0">
                    <div className="dastyle-profile-main">
                      <div className="dastyle-profile-main-pic">
                        <span className="dastyle-profile_main-pic-change">
                          <i className="ti-user"></i>
                        </span>
                      </div>
                      <div className="dastyle-profile_user-detail">
                        <h5 className="dastyle-user-name">
                          {clientInformationData.first_name +
                            " " +
                            clientInformationData.last_name}
                        </h5>
                        <p className="mb-0 dastyle-user-name-post">
                          Client Code: {informationData.client_code}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 ml-auto align-self-center">
                    <ul className="list-unstyled personal-detail mb-0">
                      <li className="">
                        <i className="fa-regular fa-phone me-2 text-secondary font-22 align-middle"></i>
                        <b>phone </b>:{" "}
                        {clientInformationData.phone_code +
                          " " +
                          clientInformationData.phone}
                      </li>
                      <li className="mt-2">
                        <i className="fa-regular fa-envelope text-secondary font-22 align-middle me-2"></i>
                        <b>Email </b>: {clientInformationData.email}
                      </li>
                    </ul>
                  </div>

                  <div className="col-lg-4 align-self-center">
                    <ul className="list-unstyled personal-detail mb-0">
                      <li className="">
                        <b>Trading Name</b>: {informationData.trading_name}
                      </li>
                      <li className="mt-2">
                        <b>Trading Address</b>:{informationData.trading_address}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=" report-data mt-4">
            <div className="card-header border-bottom pb-3 row">
              <div className="col-8">
                <h4 className="card-title">
                  {informationData.client_type == 1
                    ? "Sole Trader"
                    : informationData.client_type == 2
                    ? "Company"
                    : "Partnership"}{" "}
                  Information
                </h4>
              </div>
              <div className="col-4">
                <div className="float-end">
                  <button type="button" className="btn btn-info text-white  ">
                    <i className="fa-regular fa-pencil me-2" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-0 btn btn-danger text-white float-end fw-bold ms-1"
                  >
                    <i className="fa-regular fa-trash me-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {informationData.client_type == 1 ? (
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Trading Name</h6>
                        <p className="font-14  ml-3">
                          {informationData.trading_name}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">VAT Registered</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {informationData.vat_registered == 0 ? "Yes" : "No"}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Website</h6>
                        <p className="font-14  ml-3">
                          {informationData.website}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Trading Address</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {informationData.trading_address}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">VAT Number</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {informationData.vat_number}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : informationData.client_type == 2 ? (
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Company Name</h6>
                        <p className="font-14  ml-3">
                          {companyDetails.company_name}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Company Status</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {companyDetails.company_status}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Registered Office Address</h6>
                        <p className="font-14  ml-3">
                          {companyDetails.registered_office_address}
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Entity Type</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {companyDetails.entity_type}
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Company Number</h6>
                        <p className="font-14  ml-3">
                          {" "}
                          {companyDetails.company_number}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : informationData.client_type == 3 ? (
              <div className="card-body pt-3">
                <div className="row">
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Company Name</h6>
                        <p className="font-14  ml-3">
                          Outbooks Outsourcing Pvt Ltd
                        </p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Company Status</h6>
                        <p className="font-14  ml-3">Active</p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Registered Office Address</h6>
                        <p className="font-14  ml-3">
                          Suite 18, Winsor & Newton Building, Whitefriars
                          Avenue, Harrow HA3 5RN
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div className="col-lg-6">
                    <ul className="list-unstyled faq-qa">
                      <li className="mb-4">
                        <h6 className="">Entity Type</h6>
                        <p className="font-14  ml-3">Entity Type</p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">Company Number</h6>
                        <p className="font-14  ml-3">06465146</p>
                      </li>
                      <li className="mb-4">
                        <h6 className="">6. What is Dastyle?</h6>
                        <p className="font-14  ml-3">
                          Anim pariatur cliche reprehenderit, enim eiusmod high
                          life accusamus terry richardson ad squid.
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
