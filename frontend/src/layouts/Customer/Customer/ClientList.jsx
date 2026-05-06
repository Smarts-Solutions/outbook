import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAccess } from "../../../Utils/CustomerAccessContext";
import {
  CustomerClientList,
  CustomerJobList,
  GetCustomerDropdown,
  getCustomerMasterStatus,
  CustomerJobAction,
  CustomerClientAction,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import CustomerHierarchy from "../../../Components/ExtraComponents/CustomerHierarchy";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Download, Plus, User, Briefcase } from "lucide-react";

const ClientLists = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const { hasAccess, selectedCustomer } = useCustomerAccess();

  const customer_id_sidebar = sessionStorage.getItem("cust_id_sidebar");
  const [CustomerData, setCustomerData] = useState([]);
  const [customerId, setCustomerId] = useState(selectedCustomer?.value || "");
  const [customerName, setCustomerName] = useState(selectedCustomer?.label || "");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [activeTab, setActiveTab] = useState("client");

  const [hararchyData, setHararchyData] = useState({
    customer: { id: customerId, trading_name: sessionStorage.getItem("cust_id_sidebar_name") || "" },
  });

  const GetAllCustomer = async () => {
    setLoading(true);
    const req = { staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(GetCustomerDropdown(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const data = response.data?.data || response.data || [];
          setCustomerData(data);
          if (customerId) {
            const selected = data.find(c => c.id == customerId);
            if (selected) {
              setCustomerName(selected.trading_name);
              setHararchyData({ customer: { id: customerId, trading_name: selected.trading_name } });
            }
          }
        } else {
          setCustomerData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetStatus = async () => {
    await dispatch(getCustomerMasterStatus({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      });
  };

  useEffect(() => {
    GetAllCustomer();
  }, []);

  useEffect(() => {
    if (activeTab === "job") {
      GetStatus();
    }

    const id = selectedCustomer.value === "All" ? "" : selectedCustomer.value;
    setCustomerId(id);
    setCustomerName(selectedCustomer.label);

    if (activeTab === "client") {
      GetAllClientData(id, 1, pageSize, "");
    } else if (activeTab === "job") {
      JobDetails(1, pageSize, "", id);
    }
  }, [activeTab, selectedCustomer, pageSize]);

  const SetTab = (e) => {
    setActiveTab(e);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const GetAllClientData = async (id, page = 1, limit = 10, search = "") => {
    setLoading(true);
    const req = { action: "getByCustomer", customer_id: id, page, limit, search };
    await dispatch(CustomerClientList({ req, authToken: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientData(response.data || []);
          setTotalRecords(response.pagination?.total || 0);
        } else {
          setClientData([]);
          setTotalRecords(0);
        }
      })
      .finally(() => setLoading(false));
  };

  const JobDetails = async (page = 1, limit = 10, search = "", id = customerId) => {
    setLoading(true);
    const req = { action: "getByCustomer", customer_id: id, page, limit, search };
    await dispatch(CustomerJobList({ req, authToken: token }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetJobDetails(response.data || []);
          setTotalRecords(response.pagination?.total || 0);
        } else {
          setGetJobDetails([]);
          setTotalRecords(0);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = (row, type) => {
    sweatalert
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete this ${type}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            let response;
            if (type === "client") {
              const req = { action: "delete", id: row.id };
              response = await dispatch(CustomerClientAction({ req, authToken: token })).unwrap();
            } else if (type === "job") {
              const req = { action: "delete", job_id: row.job_id };
              response = await dispatch(CustomerJobAction({ req, authToken: token })).unwrap();
            }

            if (response?.status) {
              sweatalert.fire({
                title: "Deleted!",
                text: response.message,
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });
              if (type === "client") GetAllClientData(customerId, currentPage, pageSize, searchTerm);
              else JobDetails(currentPage, pageSize, searchTerm);
            } else {
              sweatalert.fire({ title: "Error", text: response?.message || "Delete failed", icon: "error" });
            }
          } catch (error) {
            console.error("Delete error:", error);
            sweatalert.fire({ title: "Error", text: "Something went wrong", icon: "error" });
          }
        }
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
          const res = await dispatch(updateCustomerJobStatus({ req, authToken: token })).unwrap();
          if (res.status) {
            sweatalert.fire({ title: "Success", text: res.message, icon: "success", timer: 1000, showConfirmButton: false });
            JobDetails(currentPage, pageSize, searchTerm);
          } else {
            sweatalert.fire({ title: "Error", text: res.message, icon: "error" });
          }
        } catch (error) {
          sweatalert.fire({ title: "Error", text: "Something went wrong", icon: "error" });
        }
      }
    });
  };

  const ClientListColumns = [
    {
      name: "Client Name",
      cell: (row) => (
        <a onClick={() => HandleClientView(row)} style={{ cursor: "pointer", color: "#26bdf0" }}>
          {row.client_name}
        </a>
      ),
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: "Client Code",
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name || "-",
      sortable: true,
    },
    {
      name: "Client Type",
      selector: (row) => row.client_type_name || "-",
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.client_created_by || "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.status === "1" ? "text-success" : "text-danger"}>
          {row.status === "1" ? "Active" : "Deactive"}
        </span>
      ),
      sortable: true,
    },
    ...((hasAccess("client", "update") || hasAccess("client", "delete")) ? [
      {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex">
            {hasAccess("client", "update") && (
              <button className="edit-icon" onClick={() => navigate("/customer/client/edit", { state: { row, id: customerId, activeTab: activeTab } })}>
                <i className="ti-pencil" />
              </button>
            )}
            {hasAccess("client", "delete") && row.Delete_Status == null && (
              <button className="delete-icon" onClick={() => handleDelete(row, "client")}>
                <i className="ti-trash text-danger" />
              </button>
            )}
          </div>
        ),
      }
    ] : []),
  ];

  const JobColumns = [
    {
      name: "Job ID",
      cell: (row) => (
        <a onClick={() => HandleJobView(row)} style={{ cursor: "pointer", color: "#26bdf0" }}>
          {row.job_code_id}
        </a>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
      },
      selector: (row) => row.job_priority || "-",
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <select
          className="form-select form-control"
          value={row.status_type}
          onChange={(e) => handleStatusChange(e, row)}
          disabled={!(hasAccess("job", "status_update") || role === "SUPERADMIN")}
        >
          {statusDataAll.map((status) => (
            <option key={status.id} value={status.id}>
              {status.name}
            </option>
          ))}
        </select>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Client Contact Person",
      cell: (row) => (
        <div title={row.account_manager_officer_first_name + " " + row.account_manager_officer_last_name || "-"}>
          {row.account_manager_officer_first_name + " " + row.account_manager_officer_last_name || "-"}
        </div>
      ),
      selector: (row) => row.account_manager_officer_first_name + " " + row.account_manager_officer_last_name || "-",
      sortable: true,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code || "-",
      sortable: true,
    },
    {
      name: "Outbook Account Manager",
      cell: (row) => (
        <div title={row.outbooks_acount_manager_first_name + " " + row.outbooks_acount_manager_last_name || "-"}>
          {row.outbooks_acount_manager_first_name + " " + row.outbooks_acount_manager_last_name || "-"}
        </div>
      ),
      selector: (row) => row.outbooks_acount_manager_first_name + " " + row.outbooks_acount_manager_last_name || "-",
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) => row.allocated_id != null ? row.allocated_first_name + " " + row.allocated_last_name : "-",
      sortable: true,
    },
    {
      name: "Timesheet",
      cell: (row) => (
        <div title={row.total_hours_status == "1" && row.total_hours != null ? row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m" : "-"}>
          {row.total_hours_status == "1" && row.total_hours != null ? row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m" : "-"}
        </div>
      ),
      selector: (row) => row.total_hours_status == "1" && row.total_hours != null ? row.total_hours : "-",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
    ...((hasAccess("job", "update") || hasAccess("job", "delete")) ? [
      {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex">
            {hasAccess("job", "update") && (
              <button className="edit-icon" onClick={() => navigate("/customer/job/edit", { state: { job_id: row.job_id, goto: "Customer", activeTab: activeTab } })}>
                <i className="ti-pencil" />
              </button>
            )}
            {hasAccess("job", "delete") && row.timesheet_job_id == null && (
              <button className="delete-icon" onClick={() => handleDelete(row, "job")}>
                <i className="ti-trash text-danger" />
              </button>
            )}
          </div>
        ),
      }
    ] : []),
  ];

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    if (activeTab === "client") GetAllClientData(customerId, newPage, pageSize, searchTerm);
    else if (activeTab === "job") JobDetails(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    if (activeTab === "client") GetAllClientData(customerId, 1, newSize, searchTerm);
    else if (activeTab === "job") JobDetails(1, newSize, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (activeTab === "client") GetAllClientData(customerId, 1, pageSize, term);
      else if (activeTab === "job") JobDetails(1, pageSize, term);
    }, 500);
  };

  const handleExport = async () => {
    setLoading(true);
    const req = { action: "getByCustomer", customer_id: customerId, page: 1, limit: 100000, search: "" };
    let exportData = [];
    if (activeTab === "client") {
      const res = await dispatch(CustomerClientList({ req, authToken: token })).unwrap();
      if (res.status && res.data.length > 0) {
        exportData = res.data.map(item => ({
          "Client Name": item.client_name,
          "Client Code": item.client_code,
          "Customer Name": item.customer_name,
          "Client Type Name": item.client_type_name,
          "Created By": item.client_created_by,
          "Created At": item.created_at,
          Status: item.status == 1 ? "Active" : "Deactive",
        }));
      }
    } else if (activeTab === "job") {
      const res = await dispatch(CustomerJobList({ req, authToken: token })).unwrap();
      if (res.status && res.data.length > 0) {
        exportData = res.data.map(item => ({
          "Job ID": item.job_code_id,
          "Priority": item.job_priority,
          "Client Name": item.client_trading_name,
          "Job Type": item.job_type_name,
          Status: item.status,
          "Created By": item.job_created_by,
          "Created At": item.created_at,
        }));
      }
    }
    setLoading(false);
    if (exportData.length > 0) downloadCSV(exportData, `${activeTab}_details.csv`);
    else alert("No data to export!");
  };

  const downloadCSV = (data, filename) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map((h) => `"${row[h] || ""}"`);
      csvRows.push(values.join(","));
    });
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  };

  const HandleClientView = (row) => {
    const updatedData = { ...hararchyData, client: row };
    setHararchyData(updatedData);
    sessionStorage.setItem("cli_id_sidebar", row.id);
    sessionStorage.setItem("cli_id_sidebar_name", row.client_name);
    navigate("/customer/client/profile", { state: { Client_id: row.id, activeTab: activeTab, customer_id: customerId, data: updatedData } });
  };

  const HandleJobView = (row) => {
    const updatedData = { customer: { id: customerId, trading_name: customerName }, job: row };
    setHararchyData(updatedData);
    navigate("/customer/job/logs", { state: { job_id: row.job_id, activeTab: activeTab, customer_id: customerId, data: updatedData } });
  };

  const tabs = [];
  if (hasAccess("client", "view")) {
    tabs.push({ id: "client", label: "Client", icon: <User size={16} /> });
  }
  if (customerId && hasAccess("job", "view")) {
    tabs.push({ id: "job", label: "Job", icon: <Briefcase size={16} /> });
  }

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row ">
          <div className="col-sm-12">
            {/* <div className="form-group col-md-4 mb-0">
              <label className="form-label mb-2"> Customer</label>
              <Select
                options={customerOptions}
                value={selectedOption}
                onChange={(selected) => {
                  const selectedCustomer = CustomerData.find(c => c.id == selected.value);
                  selectCustomerId(selected.value, selectedCustomer?.trading_name);
                }}
                placeholder="All"
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              />
            </div> */}

            <div className="page-title-box pt-2">
              <div className="row align-items-start">
                <div className="col-md-8">
                  <ul className="nav nav-pills rounded-tabs">
                    {tabs.map((tab) => (
                      <li className="nav-item" key={tab.id}>
                        <button
                          className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                          onClick={() => SetTab(tab.id)}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-4 d-flex justify-content-end align-items-center">
                  {activeTab === "client" && customerId && hasAccess("client", "add") && (
                    <div className="btn btn-info text-white blue-btn mt-2 mt-sm-0" onClick={() => navigate("/customer/addclient", { state: { id: customerId, activeTab: activeTab } })}>
                      <Plus size={16} /> Add Client
                    </div>
                  )}
                  {activeTab === "job" && customerId && hasAccess("job", "add") && (
                    <div className="btn btn-info text-white blue-btn mt-2 mt-sm-0" onClick={() => navigate("/customer/createjob", { state: { customer_id: customerId, goto: "Customer", activeTab: activeTab } })}>
                      <Plus size={16} /> Create Job
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {customerId && (
        <CustomerHierarchy
          show={["Customer", activeTab.charAt(0).toUpperCase() + activeTab.slice(1)]}
          active={1}
          data={hararchyData}
          NumberOfActive={totalRecords}
        />
      )}

      <div className="tab-content mt-4">
        <div className="report-data">
          <div className="d-flex justify-content-between align-items-center">
            <div className="tab-title">
              <h3 className="mt-0">{activeTab === "client" ? "Clients" : "Jobs"}</h3>
            </div>

          </div>

          <div className="row mb-3 mt-3 d-flex justify-content-between align-items-center">
            <div className="col-md-4 ">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="form-control"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex justify-content-end">
              {(hasAccess("export", "data") || role === "SUPERADMIN") && (
                <button className="btn btn-outline-info fw-bold d-inline-flex align-items-center gap-2" onClick={handleExport}>
                  <Download size={16} /> Export Excel
                </button>
              )}
            </div>

          </div>

          <div className="datatable-wrapper">
            {loading && <div className="overlay"><div className="loader"></div></div>}
            <Datatable
              columns={activeTab === "client" ? ClientListColumns : JobColumns}
              data={activeTab === "client" ? ClientData : getJobDetails}
              filter={false}
              pagination={false}
            />

            <div className="d-flex justify-content-between align-items-center mt-3">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(totalRecords / pageSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination"}
                activeClassName={"active"}
                forcePage={currentPage - 1}
              />
              <select className="perpage-select" value={pageSize} onChange={handlePageSizeChange}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLists;
