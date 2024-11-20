import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { JobAction, Update_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getList } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";


const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState([]);
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);
  const [hararchyData, setHararchyData] = useState({ customer: location.state });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectStatusIs, setStatusId] = useState('')
  const [statusDataAll, setStatusDataAll] = useState([])
  const [getAccessDataClient, setAccessDataClient] = useState({ insert: 0, update: 0, delete: 0, client: 0, });
  const [getAccessDataJob, setAccessDataJob] = useState({ insert: 0, update: 0, delete: 0, job: 0, });
  const [activeTab, setActiveTab] = useState('');
  const role = JSON.parse(localStorage.getItem("role"));

  const [getAccessDataCustomer, setAccessDataCustomer] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
  });

  const accessDataCustomer =
  JSON.parse(localStorage.getItem("accessData") || "[]").find(
    (item) => item.permission_name === "customer"
  )?.items || [];


  useEffect(() => {
    if (accessDataCustomer.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataCustomer.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    setAccessDataCustomer(updatedAccess);
  }, []);


  useEffect(() => {
    const retrievedData = sessionStorage.getItem('activeTab');
    const retrievedData1 = sessionStorage.getItem('activeTab1');
    if (retrievedData && retrievedData !== "clear") {
      setActiveTab(retrievedData);
      sessionStorage.setItem('activeTab1', "clear");
    }
    else if (retrievedData1 == "clear") {
      setActiveTab(retrievedData);
    }
    else {
      setActiveTab(
        (getAccessDataClient && getAccessDataClient.client == 1) || role === "ADMIN" || role === "SUPERADMIN" ? "client" :
          (getAccessDataJob && getAccessDataJob.job == 1) || role === "ADMIN" || role === "SUPERADMIN" ? "job" :
            "documents")
    }
  }, [getAccessDataJob, getAccessDataClient]);


  const initialTabs = [
    { id: "documents", label: "Documents", icon: "fa-solid fa-file" },
    { id: "status", label: "Status", icon: "fa-solid fa-info-circle" },
    { id: "checklist", label: "Checklist", icon: "fa-solid fa-check-square" },
  ];

  const [tabs, setTabs] = useState(initialTabs);

  const accessDataClient =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client"
    )?.items || [];

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job"
    )?.items || [];

  useEffect(() => {
    if (accessDataClient.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, client: 0 };
    accessDataClient.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });
    setAccessDataClient(updatedAccess);
  }, []);

  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, job: 0 };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.job = item.is_assigned;
    });
    setAccessDataJob(updatedAccess);
  }, []);

  const SetTab = (e) => {
    setActiveTab(e);
  };

  useEffect(() => {
    GetStatus();
    if (activeTab !== "") {
      if (activeTab === "checklist") {
        getCheckListData();
      }
      else if (activeTab === "client") {
        GetAllClientData();
      }
      else if (activeTab === "job") {
        GetAllClientData();
        JobDetails();
      }
    }

  }, [activeTab]);

  useEffect(() => {
    if (getCheckList) {
      const filteredData = getCheckList.filter((item) =>
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setCheckList1(filteredData);
    } else {
      setCheckList1([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    let tabsData = [];
    if ((getAccessDataClient && getAccessDataClient.client == 1) || role === "ADMIN" || role === "SUPERADMIN") {
      tabsData.push({ id: "client", label: "Client", icon: "fa-solid fa-user" });
    }
    if ((getAccessDataJob && getAccessDataJob.job == 1) || role === "ADMIN" || role === "SUPERADMIN") {
      tabsData.push({ id: "job", label: "Job", icon: "fa-solid fa-briefcase" })
    }
    setTabs([...tabsData, ...initialTabs]);
  }, [getAccessDataJob, getAccessDataClient, ClientData]);

  const ClientListColumns = [
    {
      name: "Client Name",
      cell: (row) => (
        <div>
          {
            getAccessDataJob.job === 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <a
                onClick={() => HandleClientView(row)}
                style={{ cursor: "pointer", color: "#26bdf0" }}
              >
                {row.client_name}
              </a>
            ) : row.client_name
          }

        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Client Code",
      selector: (row) => row.client_code || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Client Type",
      selector: (row) =>
        row.client_type_name == null ? "-" : row.client_type_name,
      sortable: true,
      width: "150px",
      reorder: false,
    },
    {
      name: "Status",
      selector: (row) => (<div>
        <span
          className={` ${row.status === "1" ? "text-success" : "text-danger"
            }`}
        >
          {row.status === "1" ? "Active" : "Deactive"}
        </span>
      </div>),
      sortable: true,
      width: '130px',
      reorder: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {
            getAccessDataClient.update === 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <button className="edit-icon" onClick={() =>
                navigate("/admin/client/edit", { state: { row, id: location.state.id, activeTab: activeTab } })}>
                <i className="ti-pencil" />
              </button>
            ) : null
          }
          {
            getAccessDataClient.delete === 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <button
                className="delete-icon"
                onClick={() => handleDelete(row, "client")}
              >
                {" "}
                <i className="ti-trash text-danger" />
              </button>
            ) : null
          }
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

  const JobColumns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleJobView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
      reorder: false,
    },

    {
      name: "Client Name",

      selector: (row) => row.client_trading_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Job Type",

      selector: (row) => row.job_type_name || "-",
      sortable: true,
      reorder: false,
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
      width: "325px",
      reorder: false,
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Outbook Account Manager",
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Allocated To",
      selector: (row) =>
        row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name,
      sortable: true,
      reorder: false,
    },
    {
      name: "Timesheet",
      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null ?
          row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
          : "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
      reorder: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {
            getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <button className="edit-icon" onClick={() =>
                navigate("/admin/job/edit", {
                  state: { job_id: row.job_id, goto: "Customer", activeTab: activeTab },
                })}>
                <i className="ti-pencil" />
              </button>
            ) : null
          }
          {
            getAccessDataJob.delete === 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <button className="delete-icon" onClick={() => handleDelete(row, "job")}>
                <i className="ti-trash text-danger" />
              </button>
            ) : null
          }

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

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
            JobDetails();
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

  const CheckListColumns = [
    {
      name: "Checklist Name",
      cell: (row) => (
        <div>
          <a
          // onClick={() => HandleClientView(row)}
          // style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.check_list_name}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Service Type",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_type, sortable: true,
      width: "120px"
    }
    ,
    {
      name: "Client Type",
      selector: (row) => row.client_type_type,
      sortable: true,
      width: "400px",
    },
    {
      name: "Status",
      selector: (row) => (row.status == "1" ? "Active" : "Deactive"),
      sortable: true,
      width: "100px",

    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {
            (getAccessDataCustomer.update === 1 || role === "ADMIN" || role === "SUPERADMIN") ?
              <button className="edit-icon" onClick={() =>
                navigate("/admin/edit/checklist", {
                  state: { id: location.state.id, checklist_id: row.checklists_id, activeTab: activeTab },
                })}>
                <i className="ti-pencil" />
              </button> : null
          }
          {
            (getAccessDataCustomer.delete === 1 || role === "ADMIN" || role === "SUPERADMIN") ?
              <button className="delete-icon" onClick={() => ChecklistDelete(row)}>
                <i className="ti-trash text-danger" />
              </button> : null
          }
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const tabs1 = [
    {
      key: "client",
      title: "Clients",
      placeholder: "Search clients...",
      data: ClientData,
      columns: ClientListColumns,
    },
    {
      key: "job",
      title: "Jobs",
      placeholder: "Search jobs...",
      data: getJobDetails,
      columns: JobColumns,
    },
    {
      key: "documents",
      title: "Documents",
      placeholder: null,
      data: [],
      columns: ClientListColumns,
    },
    {
      key: "status",
      title: "Status",
      placeholder: "Search Status...",
      data: [],
      columns: JobColumns,
    },
    {
      key: "checklist",
      title: "Checklist",
      placeholder: "Search...",
      data: getCheckList1,
      columns: CheckListColumns,
    },
  ];

  const JobDetails = async () => {
    const req = { action: "getByCustomer", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetJobDetails(response.data);
        } else {
          setGetJobDetails([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetAllClientData = async () => {
    const req = { action: "get", customer_id: location?.state?.id };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setClientData(response.data);
        } else {
          setClientData(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const getCheckListData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          if (response.data.length > 0) {
            let Array = [
              { id: 1, name: "SoleTrader" },
              { id: 2, name: "Company" },
              { id: 3, name: "Partnership" },
              { id: 4, name: "Individual" },
            ];
            let data = response.data.map((item) => {
              return {
                ...item,
                check_list_name: item.check_list_name,
                service_name: item.service_name,
                job_type_type: item.job_type_type,
                // client_type_type: item.client_type_type,
                status: item.status,
                checklists_id: item.checklists_id,
                client_type_type: item.checklists_client_type_id.split(",").map(id => {
                  let matchedItem = Array.find(item => item.id === Number(id));
                  return matchedItem ? matchedItem.name : null;
                }).filter(name => name !== null).join(", ")
              };
            });


            setCheckList(data);
            setCheckList1(data);
          } else {
            setCheckList([]);
          }

          // setCheckList(response.data);
          // setCheckList1(response.data);
        } else {
          setCheckList([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const ChecklistDelete = async (row) => {
    const req = { action: "delete", checklist_id: row.checklists_id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
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
          getCheckListData();
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

  const handleDelete = async (row, type) => {
    sweatalert.fire({
      title: "Are you sure?",
      text: "Do you want to delete this " + type + "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const req = {
          action: "delete",
          ...(type === "job" ? { job_id: row.job_id } : { client_id: row.id }),
        };
        const data = { req: req, authToken: token };
        await dispatch(type == "job" ? JobAction(data) : ClientAction(data))
          .unwrap()
          .then(async (response) => {
            if (response.status) {
              sweatalert.fire({
                title: type + " deleted successfully",
                icon: "success",
                showCancelButton: false,
                showConfirmButton: false,
                timer: 1500,
              });
              JobDetails()
              GetAllClientData();
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
      } else if (result.dismiss === sweatalert.DismissReason.cancel) {
        sweatalert.fire({
          title: "Cancelled",
          text: type + " was not deleted",
          icon: "error",
          confirmButtonText: "Ok",
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  };

  const HandleClientView = (row) => {
    setHararchyData(prevState => {
      const updatedData = {
        ...prevState,
        client: row
      };
      navigate("/admin/client/profile", { state: { Client_id: row.id, data: updatedData, activeTab: activeTab } });
      return updatedData;
    });
  };

  const HandleJobView = (row) => {
    setHararchyData(prevState => {
      const updatedData = {
        ...prevState,
        job: row
      };
      navigate("/admin/job/logs", { state: { job_id: row.job_id, goto: "Customer", data: updatedData, activeTab: activeTab } });
      return updatedData;
    });
  };


  return (
    <div className="container-fluid">
      <div className="row ">
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
                        onClick={() => SetTab(tab.id)}
                      >
                        <i className={tab.icon}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-4 col-auto">
                {activeTab === "client" ||
                  activeTab === "checklist" ||
                  activeTab === "" ||
                  activeTab === "job" ? (
                  <>

                    {
                      (getAccessDataClient.insert === 1 || role === "ADMIN" || role === "SUPERADMIN") && activeTab === "client" ? (
                        <>
                          <div className="btn btn-info text-white float-end blue-btn"
                            onClick={() => navigate("/admin/addclient", { state: { id: location.state.id, activeTab: activeTab } })} >
                            <i className="fa fa-plus pe-1" /> Add Client
                          </div>
                        </>
                      ) : (ClientData?.length > 0 && (getAccessDataJob.insert == 1 || role === "ADMIN" || role === "SUPERADMIN")) && activeTab === "job" ? (
                        <>

                          <div className="btn btn-info text-white float-end blue-btn" onClick={() =>
                            navigate("/admin/createjob", {
                              state: { customer_id: location.state.id, goto: "Customer", activeTab: activeTab },
                            })
                          } >
                            <i className="fa fa-plus pe-1" /> Create Job
                          </div>
                        </>
                      ) : (getAccessDataCustomer.insert === 1 || role === "ADMIN" || role === "SUPERADMIN") && activeTab === "checklist" ? (
                        <>
                          <div className="btn btn-info text-white float-end blue-btn" onClick={() =>
                            navigate("/admin/create/checklist", { state: { id: location.state.id, activeTab: activeTab } })
                          } >
                            <i className="fa fa-plus pe-1" /> Add Checklist
                          </div>
                        </>
                      ) : (
                        null
                      )}
                    <div
                      className="btn btn-info text-white float-end blue-btn me-2"
                      onClick={() => {
                        window.history.back();
                      }}
                    >
                      <i className="fa fa-arrow-left pe-1" /> Back
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Hierarchy show={["Customer", activeTab]} active={1} data={hararchyData} NumberOfActive={activeTab == 'client' ? ClientData?.length : activeTab == 'job' ? getJobDetails?.length : ""} />

      <div className="tab-content" id="pills-tabContent">
        {tabs1.map((tab) => (
          <div
            key={tab.key}
            className={`tab-pane fade ${activeTab == tab.key ? "show active" : ""
              }`}
            id={tab.key}
            role="tabpanel"
            aria-labelledby={`${tab.key}-tab`}
          >

            <div className="report-data mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="tab-title">
                  <h3 className="mt-0">{tab.title}</h3>
                </div>

                {/* {tab.placeholder && (
                  <div className="search-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={tab.placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )} */}
              </div>

              <div className="datatable-wrapper">
                {tab.data && tab.data.length > 0 ? (
                  <Datatable
                    columns={tab.columns}
                    data={tab.data}
                    filter={true}
                  />
                ) : (
                  <div className="text-center">
                    <img
                      src="/assets/images/No-data-amico.png"
                      alt="No records available"
                      style={{
                        width: "250px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                    <p>No data available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        ))}
      </div>
    </div>
  );
};

export default ClientList;
