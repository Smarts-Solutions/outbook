import React, { useState, useEffect, useRef } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { CustomerReportCountJob as fetchJobs } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Download, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

const CustomerReportJobs = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!location.state?.job_ids) {
        navigate(-1);
        return;
    }
    GetJobs(1, pageSize, "");
  }, []);

  const GetJobs = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    const data = {
      req: { 
        job_ids: location.state?.job_ids,
        page,
        limit,
        search
      },
      authToken: token,
    };
    await dispatch(fetchJobs(data))
      .unwrap()
      .then((res) => {
        if (res.status && res.data) {
          setJobsData(res.data.data);
          setTotalRecords(res.data.pagination?.totalItems || 0);
        } else {
          setJobsData([]);
          setTotalRecords(0);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    GetJobs(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    GetJobs(1, newSize, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
        GetJobs(1, pageSize, term);
    }, 500);
  };

  const handleExport = async () => {
    setLoading(true);
    const data = {
      req: { 
        job_ids: location.state?.job_ids,
        page: 1,
        limit: 1000000,
        search: searchTerm
      },
      authToken: token,
    };
    
    try {
        const res = await dispatch(fetchJobs(data)).unwrap();
        if (res.status && res.data?.data?.length > 0) {
            const exportData = res.data.data.map((item) => ({
                "Job ID": item.job_code_id,
                "Job Priority": item.job_priority || "-",
                "Client Name": item.client_trading_name || "-",
                "Account Manager": item.account_manager_name || "-",
                "Job Type": item.job_type_name || "-",
                "Status": item.status || "-",
                "Created At": item.created_at || "-",
            }));
            downloadCSV(exportData, "Customer_Job_Report.csv");
        }
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map((h) => `"${(row[h] || "").toString().replace(/"/g, '""')}"`);
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

  const HandleJobView = (row) => {
    navigate("/customer/job/logs", {
      state: {
        job_id: row.job_id,
        data: { job: row },
        goto: "reports",
      },
    });
  };

  const columns = [
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
      name: "Priority",
      selector: (row) => row.job_priority || "-",
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) => row.account_manager_name || "-",
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status || "-",
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="report-data">
        <div className="row">
          <div className="col-md-7 mb-2">
            <div className="tab-title">
              <h3>Job Report</h3>
            </div>
          </div>
        </div>

        <div className="datatable-wrapper mt-minus">
          <div className="d-flex justify-content-end mb-3 gap-2">
            <button
              className="btn btn-outline-secondary fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            {jobsData && jobsData.length > 0 && (
              <button
                className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
                onClick={handleExport}
              >
                <Download size={16} />
                <span>Export Excel</span>
              </button>
            )}
          </div>

          <div className="row mb-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Search Jobs..."
                className="form-control"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}

          <Datatable
            columns={columns}
            data={jobsData && jobsData}
            filter={false}
            pagination={false}
          />

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

          <select
            className="perpage-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CustomerReportJobs;
