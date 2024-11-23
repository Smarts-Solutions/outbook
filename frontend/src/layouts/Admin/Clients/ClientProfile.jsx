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
  const role = JSON.parse(localStorage.getItem("role"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState("NoOfJobs");
  const [getClientDetails, setClientDetails] = useState({ loading: true, data: [], });
  const [informationData, informationSetData] = useState([]);
  const [clientInformationData, setClientInformationData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [hararchyData, setHararchyData] = useState(location.state.data);
  const [statusDataAll, setStatusDataAll] = useState([])
  const [selectStatusIs, setStatusId] = useState('')
  const [getAccessDataJob, setAccessDataJob] = useState({ insert: 0, update: 0, delete: 0, view: 0, });

  useEffect(() => {
    GetAllJobList();
    GetClientDetails();
    GetStatus();
  }, []);

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job"
    )?.items || [];


  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    setAccessDataJob(updatedAccess);
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
    { id: "view client", label: "View Client", icon: "fa-solid fa-user" },
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
          {
            getAccessDataJob.view == 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <a onClick={() => HandleJob(row)} style={{ cursor: "pointer", color: "#26bdf0" }}>
                {row.job_code_id}
              </a>
            ) : <a>{row.job_code_id}</a>
          }
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },
    {
      name: "Client Name",

      selector: (row) => row.client_trading_name || "-",
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
              value={row.status_type}
              onChange={(e) => handleStatusChange(e, row)}
              disabled={ getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN" ? false : true}
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
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          {(getAccessDataJob.update == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
            <button className="edit-icon" onClick={() => handleEdit(row)}>
              <i className="ti-pencil" />
            </button>
          )}
          {
            (getAccessDataJob.delete == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
              <button className="delete-icon" onClick={() => handleDelete(row, 'job')}>
                <i className="ti-trash text-danger" />
              </button>
            )}
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
      navigate("/admin/job/logs", { state: { job_id: row?.job_id, data: updatedData, goto: "client" , activeTab : location?.state?.activeTab  } });
      return updatedData;
    });
  };

  function handleEdit(row) {
    navigate("/admin/job/edit", { state: { job_id: row.job_id, goto: "client" , activeTab : location?.state?.activeTab  } });
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

  const handleCreateJob = (row) => {
    if (getClientDetails?.data?.client?.customer_id) {
      navigate("/admin/createjob", {
        state: { customer_id: getClientDetails?.data?.client?.customer_id, clientName: location?.state?.data?.client, goto: "client" , activeTab : location?.state?.activeTab },
      });
    }
  };

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
                  {
                    (getAccessDataJob.insert == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                      <div className="btn btn-info text-white float-end blue-btn ms-2" onClick={handleCreateJob}   >
                        <i className="fa fa-plus pe-1" /> Create Job
                      </div>
                    )
                  }
                  <button
                    type="button"
                    className="btn btn-info text-white float-end blue-btn"

                    onClick={() => {
                      sessionStorage.setItem('activeTab', location.state.activeTab);
                      window.history.back()
                    }
                    }
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </button>
                </div>
              </>
            )}

            {activeTab === "view client" && (
              <div className="col-md-4 col-auto">
                <button
                  type="button"
                  className="btn btn-info text-white float-end blue-btn me-2"
                  onClick={() => {
                    sessionStorage.setItem('activeTab', location.state.activeTab);
                    window.history.back()
                  }
                  }
                >
                  <i className="fa fa-arrow-left pe-1" /> Back
                </button>
              </div>
            )}
          </div>
        </div>

        <Hierarchy show={["Customer", "Client", activeTab == 'NoOfJobs' ? 'No. Of Jobs' : activeTab]} active={2} data={hararchyData} NumberOfActive={activeTab == 'NoOfJobs' ? customerData.length : ""} />

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
                    
                  </ul>

                  
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
                          filter={true}
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
              </div>
            </div>
          </div>
        )}

        {activeTab == "view client" && clientInformationData && (
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
                          <b>Phone : </b>
                          {clientInformationData &&
                            clientInformationData.phone &&
                            clientInformationData.phone_code +
                            " " +
                            clientInformationData.phone || 'NA'}

                        </li>
                        <li className="mt-2">
                          <i className="fa-regular fa-envelope text-secondary font-22 align-middle me-2"></i>
                          <b>Email : </b>{" "}
                          {clientInformationData && clientInformationData.email || 'NA'}
                        </li>
                      </ul>
                    </div>

                    <div className="col-lg-4 align-self-center">
                      <ul className="list-unstyled personal-detail mb-0">
                        <li className="row">
                          <div className="col-md-12">
                            <b>Trading Name :</b> {informationData && informationData.trading_name || 'NA'}</div>

                        </li>
                        <li className="mt-2 row">
                          <div className="col-md-12">
                            <b>Trading Address :</b>  {informationData && informationData.trading_address || 'NA'}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
           {
            informationData.client_type == 4?"":
            <div className=" report-data mt-4">
              <div className="card-header border-bottom pb-3 row">
                <div className="col-8">
                  <h4 className="card-title">
                    {informationData && informationData.client_type == 1
                      ? "Sole Trader"
                      : informationData.client_type == 2
                        ? "Company" : informationData.client_type == 3 ? "Partnership" :""
                  
                    }
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
                        <b>Trading Name :</b> {informationData.trading_name || 'NA'}
                       
                          {/* <p className="font-14  ml-3">
                            {informationData.trading_name}
                          </p> */}
                        </li>
                        <li className="mb-4">
                          <h6 className="">VAT Registered : {informationData.vat_registered == 0 ?  "No" : "Yes"}</h6>
                          {/* <p className="font-14  ml-3">
                            {" "}
                            
                          </p> */}
                        </li>
                        <li className="mb-4">
                          <b className="">Website : </b>{informationData.website || 'NA'}
                          {/* <p className="font-14  ml-3">
                            
                          </p> */}
                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul className="list-unstyled faq-qa">
                        <li className="mb-4">
                          <b className="">Trading Address :</b> {informationData.trading_address || 'NA'}
                          {/* <p className="font-14  ml-3">
                            {" "}
                            {informationData.trading_address}
                          </p> */}
                        </li>
                        <li className="mb-4">
                          <b className="">VAT Number :</b>  {informationData.vat_number || 'NA'}
                          {/* <p className="font-14  ml-3">
                            {" "}
                            {informationData.vat_number}
                          </p> */}
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
                          <h6 className="">Company Name :  {companyDetails.company_name || "NA"}</h6>

                        </li>
                        <li className="mb-4">
                          <h6 className="">Company Status :  {companyDetails.company_status || "NA"}</h6>

                        </li>
                        <li className="mb-4">
                          <h6 className="">Registered Office Address :  {companyDetails.registered_office_address || "NA"}</h6>

                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul className="list-unstyled faq-qa">
                        <li className="mb-4">
                          <h6 className="">Entity Type : {companyDetails.entity_type || "NA"}</h6>

                        </li>
                        <li className="mb-4">
                          <h6 className="">Company Number : {companyDetails.company_number || "NA"}</h6>

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
                          <h6 className="">Trading Name : {informationData && informationData.trading_name || "NA"}</h6>
                          <p className="font-14  ml-3">

                          </p>
                        </li>
                        <li className="mb-4">
                          <b className="">VAT Registered :</b> {informationData &&
                            informationData.vat_registered == "0"
                            ? "No"
                            : "Yes"}

                        </li>
                        <li className="mb-4">
                          <h6 className="">Website : {informationData && informationData.website || "NA"}</h6>

                        </li>
                      </ul>
                    </div>
                    <div className="col-lg-6">
                      <ul className="list-unstyled faq-qa">
                        <li className="mb-4">
                          <h6 className="">Trading Address : {informationData && informationData.trading_address || "NA"}</h6>
                        </li>
                        <li className="mb-4">
                          <h6 className="">VAT Number : {informationData && informationData.vat_number || "NA"}</h6>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
           }
            
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientList;
