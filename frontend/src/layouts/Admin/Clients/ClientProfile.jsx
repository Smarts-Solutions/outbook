import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { JobAction, Update_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import sweatalert from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";

const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState("NoOfJobs");
  const [getClientDetails, setClientDetails] = useState({ loading: true, data: [], });
  const [informationData, informationSetData] = useState([]);
  const [clientInformationData, setClientInformationData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [hararchyData, setHararchyData] = useState(location.state.data);
  const [statusDataAll, setStatusDataAll] = useState([])
  const [selectStatusIs, setStatusId] = useState('')

  useEffect(() => {
    GetAllJobList();
    GetClientDetails();
    GetStatus();
  }, []);



  const GetClientDetails = async () => {
    const req = { action: "getByid", client_id: location.state.Client_id };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
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
        return;
      });
  };

  const tabs = [
    { id: "NoOfJobs", label: "No. Of Jobs", icon: "fa-solid fa-briefcase" },
    { id: "viewclient", label: "View Client", icon: "fa-solid fa-user" },
    { id: "documents", label: "Documents", icon: "fa-solid fa-file" },
  ];

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };



  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    sweatalert.fire({
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { job_id: row.job_id, status_type: Number(Id) };
          const res = await dispatch(Update_Status({ req, authToken: token })).unwrap();

          if (res.status) {
            sweatalert.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });

            setStatusId(Id);
            GetAllJobList();
          } else if (res.data === "W") {
            sweatalert.fire({
              title: "Warning",
              text: res.message,
              icon: "warning",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          } else {
            sweatalert.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          sweatalert.fire({
            title: "Error",
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
            timerProgressBar: true,
          });
        }
      } else if (result.dismiss === sweatalert.DismissReason.cancel) {
        sweatalert.fire({
          title: "Cancelled",
          text: "Status change was not performed",
          icon: "error",
          confirmButtonText: "Ok",
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  };


  const columns = [
    {
      name: "Job ID",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleJob(row)}
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
      name: "Status",
      cell: (row) => (
        <div>
          <div>
            <select
              className="form-select form-control"
              value={row.status == "completed" ? 6 : row.status == "WIP – To Be Reviewed" ? 5 : row.status == "WIP – In queries" ? 4 : row.status == "WIP – Processing" ? 3 : row.status == "WIP – Missing Paperwork" ? 2 : row.status == "To Be Started - Not Yet Allocated Internally" ? 1 : 0}
              onChange={(e) => handleStatusChange(e, row)}
            >
              {statusDataAll.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ),
      sortable: true,
      width: "325px"
    },

    {
      name: "Client Manager",
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name,
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.client_trading_name,
      sortable: true,
    },
    {
      name: "Outbook Account Manager",
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name,
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) =>
        row.allocated_id != null
          ? row.allocated_first_name + " " + row.allocated_last_name
          : "",
      sortable: true,
    },
    // {
    //   name: "Timesheet",
    //   selector: (row) =>
    //     row.total_hours_status == "1" && row.total_hours != null ?
    //       row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
    //       : "",
    //   sortable: true,
    // },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row, 'job')}>
            <i className="ti-trash text-danger" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];


  const HandleJob = (row) => {
    setHararchyData(prevState => {
      const updatedData = {
        ...prevState,
        job: row
      };
      navigate("/admin/job/logs", { state: { job_id: row.job_id, data: updatedData, goto: "client" } });
      return updatedData;
    });
  };

  function handleEdit(row) {
    navigate("/admin/job/edit", { state: { job_id: row.job_id, goto: "client" } });
  }

  const handleDelete = async (row, type) => {
    const req = { action: "delete", ...(type === "job" ? { job_id: row.job_id } : { client_id: row.id }) };
    const data = { req: req, authToken: token };
    await dispatch(type == 'job' ? JobAction(data) : ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Deleted",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });

          type === "job" ? GetAllJobList() : GetClientDetails();

        } else {
          sweatalert.fire({
            title: "Failed",
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetAllJobList = async () => {
    const req = { action: "getByClient", client_id: location.state.Client_id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerData(response.data);
        } else {
          setCustomerData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleAddClient = (row) => {
    if (getClientDetails?.data?.client?.customer_id) {
      navigate("/admin/createjob", {
        state: { customer_id: getClientDetails?.data?.client?.customer_id, clientName: location?.state?.data?.client, goto: "client" },
      });
    }
  };

  function ClientEdit(row) {

    navigate("/admin/client/edit", { state: { row, id: row } });
  }

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
                      className={`nav-link ${activeTab === tab.id ? "active" : ""
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
                      <i className={tab.icon}></i>
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
                    className="btn btn-info text-white float-end blue-btn ms-2"
                    onClick={handleAddClient}
                  >
                    <i className="fa fa-plus pe-1" /> Create Job
                  </div>

                  <button
                    type="button"
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={() => window.history.back()}
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </button>
                </div>
              </>
            )}

            {activeTab === "viewclient" && (
              <div className="col-md-4 col-auto">
                <button
                  type="button"
                  className="btn btn-info text-white float-end blue-btn me-2"
                  onClick={() => window.history.back()}
                >
                  <i className="fa fa-arrow-left pe-1" /> Back
                </button>
              </div>
            )}
          </div>
        </div>

        <Hierarchy show={["Customer", "Client", activeTab]} active={2} data={hararchyData} NumberOfActive={customerData.length} />

      </div>

      <div className="mt-4">
        {activeTab == "NoOfJobs" && (
          <div
            className={`tab-pane fade ${activeTab == "NoOfJobs" ? "show active" : ""
              }`}
            id={"NoOfJobs"}
            role="tabpanel"
            aria-labelledby={`NoOfJobs-tab`}
          >
            <div className="">
              <div className="report-data mt-4 ">
                <div className="d-flex justify-content-between align-items-center">
                  <ul className="nav nav-tabs border-0 mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="assignedjob-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#assignedjob"
                        type="button"
                        role="tab"
                        aria-controls="assignedjob"
                        aria-selected="true"
                        tabIndex={-1}
                      >
                        Assigned Jobs
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="alljob-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#alljob"
                        type="button"
                        role="tab"
                        aria-controls="alljob"
                        aria-selected="false"
                        tabIndex={-1}
                      >
                        All Jobs
                      </button>
                    </li>
                  </ul>

                  <div className="search-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search Job.."
                    />
                  </div>
                </div>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade active show"
                    id="assignedjob"
                    role="tabpanel"
                    aria-labelledby="assignedjob-tab"
                  >

                    <div className="datatable-wrapper ">
                      {customerData && customerData && (
                        <Datatable
                          columns={columns}
                          data={customerData}
                          filter={false}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    className="tab-pane fade"
                    id="alljob"
                    role="tabpanel"
                    aria-labelledby="alljob-tab"
                  >
                  </div>
                </div>
                {/* <div className="datatable-wrapper ">
                {customerData && customerData && (
            <Datatable columns={columns} data={customerData} filter={false} />
          )}
                </div> */}
              </div>
            </div>
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
                          <b>Phone </b>
                          {clientInformationData &&
                            clientInformationData.phone &&
                            clientInformationData.phone_code +
                            " " +
                            clientInformationData.phone}

                        </li>
                        <li className="mt-2">
                          <i className="fa-regular fa-envelope text-secondary font-22 align-middle me-2"></i>
                          <b>Email </b>:{" "}
                          {clientInformationData && clientInformationData.email}
                        </li>
                      </ul>
                    </div>

                    <div className="col-lg-4 align-self-center">
                      <ul className="list-unstyled personal-detail mb-0">
                        <li className="row">
                          <div className="col-md-12">
                            <b>Trading Name</b>:{" "}</div>
                          <div className="col-md-12">{informationData && informationData.trading_name}</div>
                        </li>
                        <li className="mt-2 row">
                          <div className="col-md-12">
                            <b>Trading Address</b>:
                          </div>
                          <div className="col-md-12">
                            {informationData && informationData.trading_address}
                          </div>
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
                    {informationData && informationData.client_type == 1
                      ? "Sole Trader"
                      : informationData.client_type == 2
                        ? "Company"
                        : "Partnership"}{" "}
                    Information
                  </h4>
                </div>
                {/* <div className="col-4">
                <div className="float-end">
                  <button type="button" className="btn btn-info text-white " onClick={(e) => ClientEdit(informationData.id)}>
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
              </div> */}
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
                          <h6 className="">Trading Name</h6>
                          <p className="font-14  ml-3">
                            {informationData && informationData.trading_name}
                          </p>
                        </li>
                        <li className="mb-4">
                          <h6 className="">VAT Registered</h6>
                          <p className="font-14  ml-3">
                            {informationData &&
                              informationData.vat_registered == "0"
                              ? "No"
                              : "Yes"}
                          </p>
                        </li>
                        <li className="mb-4">
                          <h6 className="">Website</h6>
                          <p className="font-14  ml-3">
                            {informationData && informationData.website}
                          </p>
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul className="list-unstyled faq-qa">
                        <li className="mb-4">
                          <h6 className="">Trading Address</h6>
                          <p className="font-14  ml-3">
                            {informationData && informationData.trading_address}
                          </p>
                        </li>
                        <li className="mb-4">
                          <h6 className="">VAT Number</h6>
                          <p className="font-14  ml-3">
                            {informationData && informationData.vat_number}
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
    </div>
  );
};

export default ClientList;
