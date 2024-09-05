import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { Get_All_Client } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Get_All_Job_List  } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
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

  let tabs = [
    { id: "client", label: "Client" },
    ...(ClientData && ClientData.length > 0
      ? [{ id: "job", label: "Job" }]
      : []),
    { id: "documents", label: "Documents" },
    { id: "status", label: "Status" },
    { id: "checklist", label: "Checklist" },
  ];

  const JobDetails = async () => {
    const req = { action: "getByCustomer", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Job_List(data))
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
      selector: (row) => row.client_code,
      sortable: true,
    },
    {
      name: "Client Type",
      selector: (row) =>
        row.client_type_name == null ? "" : row.client_type_name,
      sortable: true,
    },
    { name: "Email Address", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
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
          <button className="delete-icon" onClick={() => handleDelete(row)}>
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
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleJobEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleJobDelete(row)}>
            <i className="ti-trash" />
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
    { name: "Job Type", selector: (row) => row.job_type_type, sortable: true },
    {
      name: "Client Type",
      selector: (row) => row.client_type_type,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (row.status == "1" ? "Active" : "Deactive"),
      sortable: true,
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

  const GetAllClientData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Client(data))
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

  useEffect(() => {
    getCheckListData();
    GetAllClientData();
    JobDetails();
  }, []);

  const getCheckListData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCheckList(response.data);
          setCheckList1(response.data);
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

  const handleJobDelete = async (row) => {
    const req = { action: "delete", job_id: row.job_id };
    const data = { req: req, authToken: token };

    console.log("data", data);

    return 
    await dispatch(Get_All_Job_List(data))
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
          JobDetails();
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
    navigate("/admin/job/logs", { state: { job_id: row.job_id, goto: "Customer" } });
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


  function handleDelete(row) {
    console.log("Deleting row:", row);
  }
  const handleClick = () => {
    navigate("/admin/create/checklist", { state: { id: location.state.id } });
  };
  const EditChecklist = (row) => {
    navigate("/admin/edit/checklist", {
      state: { id: location.state.id, checklist_id: row.checklists_id },
    });
  };


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
                    <p>No data available.</p>
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
