import React, { useState, useEffect, useRef } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { CustomerReportCountJob as fetchJobs } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { getCustomerMasterStatus, updateCustomerJobStatus } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
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
  const role = JSON.parse(localStorage.getItem("role"));
  const [jobsData, setJobsData] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
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
    GetStatus();
    GetJobs(1, pageSize, "");
  }, []);

  const GetStatus = async () => {
    setLoading(true);
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(getCustomerMasterStatus(data))
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
            const apiData = res.data.data;
            const exportMaxManagers = apiData && apiData.length > 0
                ? Math.max(...apiData.map((row) => (row.account_managers || []).length))
                : 0;

            const exportData = apiData.map((item) => {
                const status = statusDataAll.find(
                    (s) => Number(s.id) === Number(item.status_type)
                );
                const statusName = status ? status.name : "-";
                
                const rowData = {
                    "Job ID": item.job_code_id,
                    "Job Priority": item.job_priority ? (item.job_priority.charAt(0).toUpperCase() + item.job_priority.slice(1).toLowerCase()) : "-",
                    "Client Name": item.client_trading_name || "-",
                    "Account Manager": item.account_manager_name || "-",
                    "Employee ID": item.account_manager_employee_number || "-",
                };

                for (let i = 0; i < exportMaxManagers; i++) {
                    const manager = item.account_managers?.[i];
                    rowData[`Individual Account Manager ${i + 1}`] = manager?.full_name || "-";
                    rowData[`Employee ID ${i + 1}`] = manager?.employee_number || "-";
                }

                Object.assign(rowData, {
                    "Job Type": item.job_type_name || "-",
                    "Status": statusName,
                    "Client Contact Person": (item.account_manager_officer_first_name || "") + " " + (item.account_manager_officer_last_name || "") || "-",
                    "Client Job Code": item.client_job_code || "-",
                    "Allocated To": item.allocated_name || "-",
                    "Timesheet": item.total_hours_status == "1" && item.total_hours != null
                        ? item.total_hours.split(":")[0] + "h " + item.total_hours.split(":")[1] + "m"
                        : "-",
                    "Invoicing": item.invoiced == "1" ? "YES" : "NO",
                    "Created By": item.job_created_by || "-",
                    "Created At": item.created_at || "-",
                });

                return rowData;
            });
            downloadCSV(exportData, "Job_Report.csv");
        } else {
            Swal.fire({
                title: "Info",
                text: "No data found to export.",
                icon: "info",
            });
        }
    } catch (err) {
        console.log(err);
        Swal.fire({
            title: "Error",
            text: "Failed to export data.",
            icon: "error",
        });
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
    window.URL.revokeObjectURL(url);
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

  const maxManagers = jobsData && jobsData.length > 0
    ? Math.max(...jobsData.map((row) => (row.account_managers || []).length))
    : 0;

  const dynamicManagerColumns = Array.from({ length: maxManagers }).flatMap(
    (_, index) => [
      {
        name: `Individual Account Manager`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return (
            <div title={manager?.full_name || "-"}>
              {manager?.full_name || "-"}
            </div>
          );
        },
        selector: (row) => row.account_managers?.[index]?.full_name || "-",
        sortable: true,
      },
      {
        name: `Employee ID`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return (
            <div title={manager?.employee_number || "-"}>
              {manager?.employee_number || "-"}
            </div>
          );
        },
        selector: (row) => row.account_managers?.[index]?.employee_number || "-",
        sortable: true,
      },
    ]
  );

  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { job_id: row.id || row.job_id, status_type: Number(Id) };
          const res = await dispatch(
            updateCustomerJobStatus({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetJobs(currentPage, pageSize, searchTerm);
          } else {
            Swal.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
              timer: 2000,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 2000,
          });
        }
      }
    });
  };

  const columns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div title={row.job_code_id}>
          <a
            onClick={() => HandleJobView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        const cap = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return <div title={cap}>{cap}</div>;
      },
      selector: (row) => row.job_priority || "-",
      sortable: true,
    },
    {
      name: "Client Name",
      cell: (row) => (
        <div title={row.client_trading_name || "-"}>
          {row.client_trading_name || "-"}
        </div>
      ),
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Account Manager",
      cell: (row) => (
        <div title={row.account_manager_name || "-"}>
          {row.account_manager_name || "-"}
        </div>
      ),
      selector: (row) => row.account_manager_name || "-",
      sortable: true,
    },
    {
      name: "Employee ID",
      cell: (row) => (
        <div title={row.account_manager_employee_number || "-"}>
          {row.account_manager_employee_number || "-"}
        </div>
      ),
      selector: (row) => row.account_manager_employee_number || "-",
      sortable: true,
    },
    ...dynamicManagerColumns,
    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name || "-"}>{row.job_type_name || "-"}</div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        const status = statusDataAll.find(
          (s) => Number(s.id) === Number(row.status_type),
        );
        return status ? status.name.toLowerCase() : "-";
      },
      sortable: true,
      cell: (row) => (
        <div>
          <select
            className="form-select form-control"
            value={row.status_type}
            onChange={(e) => handleStatusChange(e, row)}
            disabled={true} // Customer usually cannot change status, but we show the same design
          >
            {statusDataAll.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      ),
      width: "325px",
    },
    {
      name: "Client Contact Person",
      cell: (row) => (
        <div title={(row.account_manager_officer_first_name || "") + " " + (row.account_manager_officer_last_name || "")}>
          {(row.account_manager_officer_first_name || "") + " " + (row.account_manager_officer_last_name || "") || "-"}
        </div>
      ),
      selector: (row) => (row.account_manager_officer_first_name || "") + " " + (row.account_manager_officer_last_name || ""),
      sortable: true,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code || "-",
      sortable: true,
    },
    {
      name: "Allocated To",
      cell: (row) => (
        <div title={row.allocated_name || "-"}>
          {row.allocated_name || "-"}
        </div>
      ),
      selector: (row) => row.allocated_name || "-",
      sortable: true,
    },
    {
      name: "Timesheet",
      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null
          ? row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
          : "-",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
    },
    {
      name: "Created By",
      cell: (row) => (
        <div title={row.job_created_by || "-"}>{row.job_created_by || "-"}</div>
      ),
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },
    {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>{row.created_at || "-"}</div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
  ];

  return (
    <div>
      <div className="report-data mt-5">
        <div className="row">
          <div className="col-md-12">
            <div className="">
              <div className="row mb-5">
                <div className="tab-title col-lg-6">
                  <h3>Job Report</h3>
                </div>
                <div className="col-lg-6 d-flex justify-content-end">
                  <div
                    className="btn btn-info text-white blue-btn"
                    onClick={() => navigate(-1)}
                  >
                     <ArrowLeft size={16}/> Back
                  </div>

                  {jobsData && jobsData.length > 0 && (
                    <div className="ms-2">
                      <button
                        className="btn btn-outline-info fw-bold border-3 d-flex align-items-center gap-2"
                        onClick={() => handleExport()}
                      >
                        <Download size={16}/>
                        <span>Export Excel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-4 mb-4">
                  <input
                    type="text"
                    placeholder="Search Jobs"
                    className="form-control"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="datatable-wrapper mt-minus">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}

          <Datatable
            filter={false}
            pagination={false}
            columns={columns}
            data={jobsData || []}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="pagination-wrapper">
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
            </div>
            <select
              className="perpage-select"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerReportJobs;
