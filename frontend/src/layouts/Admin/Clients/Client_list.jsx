import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { JobAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getList } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import Statuses from "./Statuses";

const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState([]);
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);

  const [activeTab, setActiveTab] = useState(
    location.state &&
      location.state.route &&
      location.state.route == "Checklist"
      ? "checklist"
      : location.state.route == "job"
        ? "job"
        : "client"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const SetTab = (e) => {
    setActiveTab(e);
  };

  useEffect(() => {
    getCheckListData();
    GetAllClientData();
    JobDetails();
  }, []);

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

  let tabs = [
    { id: "client", label: "Client" },
    ...(ClientData && ClientData.length > 0
      ? [{ id: "job", label: "Job" }]
      : []),
    { id: "documents", label: "Documents" },
    { id: "status", label: "Status" },
    { id: "checklist", label: "Checklist" },
  ];

  const ClientListColumns = [
    {
      name: "Client Name",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.client_name}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Client Code (cli+CustName+ClientName+UniqueNo)",
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Client Type",
      selector: (row) =>
        row.client_type_name == null ? "-" : row.client_type_name,
      sortable: true,
      width: "200px",
    },
    { name: "Email Address", selector: (row) => row.email || "-", sortable: true, width: '250px' },
    { name: "Phone", selector: (row) => row.phone || "-", sortable: true },
    {
      name: "Status",
      selector: (row) => (row.status == "1" ? "Active" : "Deactive"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            {" "}
            <i className="ti-pencil" />
          </button>
          <button
            className="delete-icon"
            onClick={() => handleDelete(row, "client")}
          >
            {" "}
            <i className="ti-trash text-danger" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
    },

    {
      name: "Job Type",
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name || "-",
      sortable: true,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code || "-",
      sortable: true,
    },
    {
      name: "Outbooks Acount Manager",
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name || "-",
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) =>
        row.allocated_first_name==null ? "-" :  row.allocated_first_name  + " " + row.allocated_last_name==null ? "-" : row.allocated_last_name,
      sortable: true,
    },
    {
      name: "Timesheet",
      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null ?
          row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
          : "-",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) =>
        row.status == null || row.status == 0 ? "To Be Started - Not Yet Allocated Internally" : row.status,
      sortable: true,
      width: "325px"
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleJobEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row, "job")}>
            <i className="ti-trash text-danger" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const CheckListColumns = [
    {
      name: "Checklist Name",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
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
          <button className="edit-icon" onClick={() => EditChecklist(row)}>
            {" "}
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => ChecklistDelete(row)}>
            {" "}
            <i className="ti-trash" />
          </button>
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
        console.log("Error", error);
      });
  };
  const GetAllClientData = async () => {
    const req = { action: "get", customer_id: location.state.id };
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
        console.log("Error", error);
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
        console.log("Error", error);
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
        console.log("Error", error);
      });
  };
  const handleDelete = async (row, type) => {
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
            title: "Deleted",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });

          type === "job" ? JobDetails() : GetAllClientData();
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
        console.log("Error", error);
      });
  };
  const HandleClientView = (row) => {
    navigate("/admin/client/profile", { state: { Client_id: row.id } });
  };
  const HandleJobView = (row) => {
    navigate("/admin/job/logs", {
      state: { job_id: row.job_id, goto: "Customer" },
    });
  };
  const handleAddClient = () => {
    navigate("/admin/addclient", { state: { id: location.state.id } });
  };
  const handleAddJob = () => {
    navigate("/admin/createjob", {
      state: { customer_id: location.state.id, goto: "Customer" },
    });
  };
  function handleEdit(row) {
    navigate("/admin/client/edit", { state: { row, id: location.state.id } });
  }
  function handleJobEdit(row) {
    navigate("/admin/job/edit", {
      state: { job_id: row.job_id, goto: "Customer" },
    });
  }
  const handleClick = () => {
    navigate("/admin/create/checklist", { state: { id: location.state.id } });
  };
  const EditChecklist = (row) => {
    navigate("/admin/edit/checklist", {
      state: { id: location.state.id, checklist_id: row.checklists_id },
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
                    <div
                      className="btn btn-info text-white float-end blue-btn"
                      onClick={
                        activeTab === "client"
                          ? handleAddClient
                          : activeTab === "checklist"
                            ? handleClick
                            : handleAddJob
                      }
                    >
                      <i className="fa fa-plus pe-1" />
                      {activeTab === "client"
                        ? "Add Client"
                        : activeTab === "checklist"
                          ? "Add Checklist"
                          : "Create Job"}
                    </div>
                    <div
                      className="btn btn-info text-white float-end blue-btn"
                      onClick={() => window.history.back()}
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
            <div className="container-fluid">
              <div className="report-data mt-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="tab-title">
                    <h3 className="mt-0">{tab.title}</h3>
                  </div>

                  {tab.placeholder && (
                    <div className="search-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={tab.placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="datatable-wrapper">
                  {tab.data && tab.data.length > 0 ? (
                    <Datatable
                      columns={tab.columns}
                      data={tab.data}
                      filter={false}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
