import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerJobStatusReport } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { convertDate } from "../../../Utils/Comman_function";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const CustomerJobStatus = () => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("role"));
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  
  const [JobStatusData, setJobStatusData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  useEffect(() => {
    GetJobStatus(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const GetJobStatus = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    const data = { req: { page, limit, search }, authToken: token };
    await dispatch(CustomerJobStatusReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setJobStatusData(res.data.rows);
          setTotalRecords(res.data.total || 0);
        } else {
          setJobStatusData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const maxManagers = JobStatusData.length > 0 
    ? Math.max(...JobStatusData.map((row) => (row.account_managers || []).length)) 
    : 0;

  const dynamicManagerColumns = Array.from({ length: maxManagers }).flatMap(
    (_, index) => [
      {
        name: `Individual Account Manager ${index + 1}`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return <div title={manager?.full_name || "-"}>{manager?.full_name || "-"}</div>;
        },
        selector: (row) => row.account_managers?.[index]?.full_name || "-",
        sortable: true,
      },
      {
        name: `Employee ID ${index + 1}`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return <div title={manager?.employee_number || "-"}>{manager?.employee_number || "-"}</div>;
        },
        selector: (row) => row.account_managers?.[index]?.employee_number || "-",
        sortable: true,
      }
    ]
  );

  const HandleJob = (row) => {
    const updatedData = {
        customer: { id: row.customer_id, trading_name: row.customer_trading_name },
        client: { id: row.client_id, client_name: row.client_trading_name },
        job: row,
    };
    navigate("/customer/job/logs", {
      state: {
        job_id: row?.id,
        timesheet_job_id: null,
        data: updatedData,
        goto: "client",
      },
    });
  };

  const columns = [
    {
      name: "Job ID",
      cell: (row) => (
        <a onClick={() => HandleJob(row)} style={{ cursor: "pointer", color: "#26bdf0" }}>
          {row.job_code_id}
        </a>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Received On",
      selector: (row) => convertDate(row.job_received_on),
      sortable: true,
    },
    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        return <div title={v}>{v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()}</div>;
      },
      selector: (row) => row.job_priority,
      sortable: true,
    },
    {
      name: "Client Name",
      selector: (row) => row.client_trading_name,
      sortable: true,
    },
    {
      name: "Service Type",
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Job Type",
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
        name: "Account Manager",
        selector: (row) => row.account_manager_name,
        sortable: true,
    },
    ...dynamicManagerColumns,
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Internal Deadline",
      selector: (row) => convertDate(row.internal_deadline_date),
      sortable: true,
    },
    {
      name: "Customer Deadline",
      selector: (row) => convertDate(row.customer_deadline_date),
      sortable: true,
    }
  ];

  const handleExport = () => {
    if (!JobStatusData || JobStatusData.length === 0) {
      alert("No data to export!");
      return;
    }

    const exportData = JobStatusData.map((item) => {
      const rowData = {};
      rowData["Job ID"] = item.job_code_id || "-";
      rowData["Job Received On"] = item.job_received_on ? convertDate(item.job_received_on) : "-";
      rowData["Job Priority"] = item.job_priority || "-";
      rowData["Client Name"] = item.client_trading_name || "-";
      rowData["Service Type"] = item.service_name || "-";
      rowData["Job Type"] = item.job_type_name || "-";
      rowData["Account Manager"] = item.account_manager_name || "-";

      for (let i = 0; i < maxManagers; i++) {
        const manager = item.account_managers?.[i];
        rowData[`Individual Account Manager ${i + 1}`] = manager?.full_name || "-";
        rowData[`Employee ID ${i + 1}`] = manager?.employee_number || "-";
      }

      rowData["Status"] = item.status || "-";
      rowData["Internal Deadline"] = convertDate(item.internal_deadline_date) || "-";
      rowData["Customer Deadline"] = convertDate(item.customer_deadline_date) || "-";

      return rowData;
    });

    downloadCSV(exportData, "Customer_Job_Status_Report.csv");
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

  return (
    <div>
      <div className="report-data">
        <div className="row">
          <div className="col-md-7 mb-2">
            <div className="tab-title">
              <h3>Job Status Report</h3>
            </div>
          </div>
        </div>

        <div className="datatable-wrapper mt-minus">
          <div className="d-flex justify-content-end mb-3">
            {JobStatusData && JobStatusData.length > 0 && (
              <div className="col-md-8 d-flex justify-content-end">
                <button
                  className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span>Export Excel</span>
                </button>
              </div>
            )}
          </div>

          <div className="row mb-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder="Search ..."
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
            data={JobStatusData && JobStatusData}
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

export default CustomerJobStatus;
