import React, { useEffect, useState } from "react";
import { GET_ASSIGNED_JOBS } from "../../../Services/CustomerUser/customerPortalService";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { Download } from "lucide-react";

const JobList = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const [jobData, setJobData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    const response = await GET_ASSIGNED_JOBS(token);
    if (response.status) {
      setJobData(response.data);
      setFilteredData(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const filtered = jobData.filter((item) => {
      const matchesSearch =
        item.job_code_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.client_trading_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job_type_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "" || item.job_priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesPriority;
    });
    setFilteredData(filtered);
  }, [searchTerm, priorityFilter, jobData]);

  const handleExport = () => {
    const headers = ["Job ID", "Priority", "Client Name", "Job Type", "Status", "Contact Person", "Account Manager", "Allocated To", "Created At"];
    const csvData = filteredData.map((item) => [
      item.job_code_id,
      item.job_priority || "-",
      item.client_trading_name,
      item.job_type_name,
      item.status_name,
      item.client_contact_person,
      item.outbooks_account_manager,
      item.allocated_to || "Unallocated",
      item.created_at
    ]);

    const csvContent = [headers.join(","), ...csvData.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "My_Jobs.csv";
    a.click();
  };

  const columns = [
    {
      name: "Job ID",
      cell: (row) => (
        <span style={{ color: "#26bdf0", fontWeight: "bold", cursor: "default" }}>
          {row.job_code_id}
        </span>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => row.job_priority || "-",
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.client_trading_name,
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status_name,
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) => row.allocated_to || "Unallocated",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
    },
  ];

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row">
          <div className="col-md-6">
            <div className="tab-title">
              <h3 className="mt-0">Jobs</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="card-datatable">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Search Jobs"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select form-control"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-6 text-end">
              <button
                className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2 float-end"
                onClick={handleExport}
              >
                <Download size={16} />
                <span>Export Excel</span>
              </button>
            </div>
          </div>

          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <Datatable columns={columns} data={filteredData} />
        </div>
      </div>
    </div>
  );
};

export default JobList;
