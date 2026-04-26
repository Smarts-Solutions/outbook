import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CustomerClientList,
  CustomerJobList,
  updateCustomerJobStatus,
  GetCustomerDropdown,
  getCustomerMasterStatus,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getList } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Download, ArrowLeft, Plus, User, Briefcase } from "lucide-react";

const ClientLists = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));

  const customer_id_sidebar = sessionStorage.getItem("customer_id_sidebar");
  const [CustomerData, setCustomerData] = useState([]);
  const [customerId, setCustomerId] = useState(customer_id_sidebar || "");
  const [customerName, setCustomerName] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState([]);
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);
  const [hararchyData, setHararchyData] = useState({
    customer: { id: customerId, trading_name: customerName },
  });
  const [selectStatusIs, setStatusId] = useState("");
  const [statusDataAll, setStatusDataAll] = useState([]);
  
  const [activeTab, setActiveTab] = useState("client");

  // Permissions (Mirroring Admin logic but you might want to adjust for Customer User)
  const [getAccessDataClient, setAccessDataClient] = useState({ insert: 1, update: 1, delete: 1, client: 1, all_clients: 1 });
  const [getAccessDataJob, setAccessDataJob] = useState({ insert: 1, update: 1, delete: 1, job: 1, all_jobs: 1 });
  const [getAccessDataCustomer, setAccessDataCustomer] = useState({ insert: 1, update: 1, delete: 1, view: 1, all_customers: 1 });

  const GetAllCustomer = async () => {
    setLoading(true);
    const req = { staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(GetCustomerDropdown(data))
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    GetAllCustomer();
    GetStatus();
  }, []);

  const GetStatus = async () => {
    await dispatch(getCustomerMasterStatus({ req: { action: "get" }, authToken: token }))
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

  useEffect(() => {
    if (activeTab !== "") {
      if (activeTab === "checklist") {
        getCheckListData();
      } else if (activeTab === "client") {
        GetAllClientData(customerId, 1, pageSize, "");
      } else if (activeTab === "job") {
        JobDetails(1, pageSize, "");
      }
    }
  }, [activeTab]);

  const SetTab = (e) => {
    setActiveTab(e);
    setCurrentPage(1);
    setSearchTerm("");
  };

  const initialTabs = [];
  const [tabs, setTabs] = useState([]);

  useEffect(() => {
    let tabsData = [];
    tabsData.push({
      id: "client",
      label: "Client ",
      icon: <User size={16} />,
    });
    if (customerId != "") {
      tabsData.push({
        id: "job",
        label: "Job",
        icon: <Briefcase size={16} />,
      });
    }
    setTabs(tabsData);
  }, [customerId]);

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
      selector: (row) => row.client_name,
      sortable: true,
    },
    {
      name: "Client Code",
      cell: (row) => (
        <div title={row.client_code || "-"}>{row.client_code || "-"}</div>
      ),
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Customer Name",
      cell: (row) => (
        <div title={row.customer_name || "-"}>{row.customer_name || "-"}</div>
      ),
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
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="edit-icon"
            onClick={() =>
              navigate("/customer/client/edit", {
                state: { row, id: customerId, activeTab: activeTab },
              })
            }
          >
            <i className="ti-pencil" />
          </button>
        </div>
      ),
    },
  ];

  const JobColumns = [
    {
      name: "Job ID",
      cell: (row) => (
        <a
          onClick={() => HandleJobView(row)}
          style={{ cursor: "pointer", color: "#26bdf0" }}
        >
          {row.job_code_id}
        </a>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Priority",
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
      name: "Created By",
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="edit-icon"
            onClick={() =>
              navigate("/customer/job/edit", {
                state: {
                  job_id: row.job_id,
                  goto: "Customer",
                  activeTab: activeTab,
                },
              })
            }
          >
            <i className="ti-pencil" />
          </button>
        </div>
      ),
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

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    if (activeTab === "client") {
      GetAllClientData(customerId, newPage, pageSize, searchTerm);
    } else if (activeTab === "job") {
      JobDetails(newPage, pageSize, searchTerm);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    if (activeTab === "client") {
      GetAllClientData(customerId, 1, newSize, searchTerm);
    } else if (activeTab === "job") {
      JobDetails(1, newSize, searchTerm);
    }
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

  const JobDetails = async (page = 1, limit = 10, search = "") => {
    const req = { staff_id: staffDetails.id, customer_id: customerId, page, limit, search };
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
      .catch(() => {
        setGetJobDetails([]);
        setTotalRecords(0);
      });
  };

  const GetAllClientData = async (id, page = 1, limit = 10, search = "") => {
    setLoading(true);
    const req = { staff_id: staffDetails.id, customer_id: id, page, limit, search };
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
      .catch(() => {
        setClientData([]);
        setTotalRecords(0);
      })
      .finally(() => setLoading(false));
  };

  const handleExport = async () => {
    setLoading(true);
    const req = { staff_id: staffDetails.id, customer_id: customerId, page: 1, limit: 100000, search: "" };
    let exportData = [];
    if (activeTab === "client") {
      const res = await dispatch(CustomerClientList({ req, authToken: token })).unwrap();
      if (res.status && res.data.data.length > 0) {
        exportData = res.data.data.map(item => ({
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
      if (res.status && res.data.data.length > 0) {
        exportData = res.data.data.map(item => ({
          "Job ID": item.job_code_id,
          "Priority": item.job_priority,
          "Client Name": item.client_trading_name,
          "Job Type": item.job_type_name,
          Status: item.status_name,
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
    navigate("/customer/client/profile", { state: { Client_id: row.id, activeTab: activeTab } });
  };

  const HandleJobView = (row) => {
    navigate("/customer/job/logs", { state: { job_id: row.job_id, activeTab: activeTab } });
  };

  const selectCustomerId = (id, name) => {
    sessionStorage.setItem("customer_id_sidebar", id);
    setCustomerId(id);
    setCustomerName(name);
    setCurrentPage(1);
    setSearchTerm("");
    if (id !== "") {
        if(activeTab === "client") GetAllClientData(id, 1, pageSize, "");
        else if(activeTab === "job") JobDetails(1, pageSize, "");
    }
  };

  const customerOptions = [
    { value: "", label: "All" },
    ...(CustomerData || []).map((val) => ({ value: val.id, label: val.trading_name })),
  ];

  const selectedOption = customerOptions.find((opt) => Number(opt.value) === Number(customerId)) || { value: "", label: "All" };

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row ">
          <div className="col-sm-12">
            <div className="form-group col-md-4 mb-0">
              <label className="form-label mb-2"> Customer</label>
              <Select
                options={customerOptions}
                value={selectedOption}
                onChange={(selected) => {
                  const selectedCustomer = CustomerData.find(c => c.id == selected.value);
                  selectCustomerId(selected.value, selectedCustomer?.trading_name);
                }}
                placeholder="All"
              />
            </div>

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
                <div className="col-md-4 d-flex justify-content-end">
                   {/* Add Client / Create Job buttons could go here if Customer side allows creation */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content mt-4">
          <div className="report-data">
            <div className="d-flex justify-content-between align-items-center">
              <div className="tab-title">
                <h3 className="mt-0">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}s</h3>
              </div>
              <button className="btn btn-outline-info fw-bold d-inline-flex align-items-center gap-2" onClick={handleExport}>
                <Download size={16} /> Export Excel
              </button>
            </div>

            <div className="row mb-3 mt-3">
              <div className="col-md-4">
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="form-control"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
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
    </div>
  );
};

export default ClientLists;
