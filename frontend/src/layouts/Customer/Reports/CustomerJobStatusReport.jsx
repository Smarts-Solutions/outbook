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
        name: `Individual Account Manager`,
        cell: (row) => {
          const manager = row.account_managers?.[index];
          return <div title={manager?.full_name || "-"}>{manager?.full_name || "-"}</div>;
        },
        selector: (row) => row.account_managers?.[index]?.full_name || "-",
        sortable: true,
      },
      {
        name: `Employee ID`,
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
        const cap = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return <div title={cap}>{cap}</div>;
      },
      selector: (row) => row.job_priority,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_trading_name,
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) => row.account_manager_name,
      sortable: true,
    },
    {
      name: "Employee ID",
      selector: (row) => row.account_manager_employee_number,
      sortable: true,
    },
    ...dynamicManagerColumns,
    {
      name: "Clients",
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
      name: "Year Ending",
      cell: (row) => (row.service_name === "Accounts Production" ? <div>{row.Year_Ending_id_1 ? convertDate(row.Year_Ending_id_1) : "-"}</div> : "-"),
      selector: (row) => row.Year_Ending_id_1,
      sortable: true,
    },
    {
      name: "Tax Year",
      cell: (row) => (row.service_name === "Personal Tax Return" ? <div>{row.Tax_Year_id_4 || "-"}</div> : "-"),
      selector: (row) => row.Tax_Year_id_4,
      sortable: true,
    },
    {
      name: "Payroll Frequency",
      cell: (row) => (row.service_name === "Payroll" ? <div>{row.Payroll_Frequency_id_3 || "-"}</div> : "-"),
      selector: (row) => row.Payroll_Frequency_id_3,
      sortable: true,
    },
    {
      name: "Payroll Year",
      cell: (row) => (
        row.service_name === "Payroll" ? (
          row.Payroll_Frequency_id_3 === "Weekly" ? (row.Payroll_Week_Year_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Monthly" ? (row.Payroll_Month_Year_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Fortnightly" ? (row.Payroll_Fortnight_Year_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Quarterly" ? (row.Payroll_Quarter_Year_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Yearly" ? (row.Payroll_Year_id_3 || "-") : "-"
        ) : "-"
      ),
      selector: (row) => row.Payroll_Week_Year_id_3,
      sortable: true,
    },
    {
      name: "Payroll Month",
      cell: (row) => (
        row.service_name === "Payroll" ? (
          row.Payroll_Frequency_id_3 === "Weekly" ? (row.Payroll_Week_Month_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Monthly" ? (row.Payroll_Month_id_3 || "-") :
          row.Payroll_Frequency_id_3 === "Fortnightly" ? (row.Payroll_Fortnight_Month_id_3 || "-") : "-"
        ) : "-"
      ),
      selector: (row) => row.Payroll_Week_Month_id_3,
      sortable: true,
    },
    {
      name: "Payroll Week",
      cell: (row) => (row.service_name === "Payroll" ? (row.Payroll_Week_id_3 || "-") : "-"),
      selector: (row) => row.Payroll_Week_id_3,
      sortable: true,
    },
    {
      name: "Bookkeeping Frequency",
      cell: (row) => (row.service_name === "Bookkeeping" ? (row.Bookkeeping_Frequency_id_2 || "-") : "-"),
      selector: (row) => row.Bookkeeping_Frequency_id_2,
      sortable: true,
    },
    {
      name: "Date",
      cell: (row) => (row.service_name === "Bookkeeping" ? (row.Day_Date_id_2 ? convertDate(row.Day_Date_id_2) : "-") : "-"),
      selector: (row) => row.Day_Date_id_2,
      sortable: true,
    },
    {
      name: "Year",
      cell: (row) => (
        row.service_name === "Bookkeeping" ? (
          row.Bookkeeping_Frequency_id_2 === "Weekly" ? (row.Week_Year_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Fortnightly" ? (row.Fortnight_Year_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Monthly" ? (row.Month_Year_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Quarterly" ? (row.Quarter_Year_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Yearly" ? (row.Year_id_2 || "-") : "-"
        ) : "-"
      ),
      selector: (row) => row.Week_Year_id_2,
      sortable: true,
    },
    {
      name: "Month",
      cell: (row) => (
        row.service_name === "Bookkeeping" ? (
          row.Bookkeeping_Frequency_id_2 === "Weekly" ? (row.Week_Month_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Fortnightly" ? (row.Fortnight_Month_id_2 || "-") :
          row.Bookkeeping_Frequency_id_2 === "Monthly" ? (row.Month_id_2 || "-") : "-"
        ) : "-"
      ),
      selector: (row) => row.Week_Month_id_2,
      sortable: true,
    },
    {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) => row.allocated_name,
      sortable: true,
    },
    {
      name: "Reviewer Name",
      selector: (row) => row.reviewer_name,
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

  const handleExport = async () => {
    const data = { req: { page: 1, limit: 1000000, search: "" }, authToken: token };
    const response = await dispatch(CustomerJobStatusReport(data)).unwrap();

    if (!response.status || !response?.data?.rows || response?.data?.rows?.length === 0) {
      alert("No data to export!");
      return;
    }

    const rows = response.data.rows;
    const exportData = rows.map((item) => {
      const rowData = {};
      rowData["Job ID"] = item.job_code_id || "-";
      rowData["Job Received On"] = item.job_received_on ? convertDate(item.job_received_on) : "-";
      rowData["Job Priority"] = item.job_priority || "-";
      rowData["Customer Name"] = item.customer_trading_name || "-";
      rowData["Account Manager"] = item.account_manager_name || "-";
      rowData["Employee ID"] = item.account_manager_employee_number || "-";

      for (let i = 0; i < maxManagers; i++) {
        const manager = item.account_managers?.[i];
        rowData[`Individual Account Manager ${i + 1}`] = manager?.full_name || "-";
        rowData[`Employee ID ${i + 1}`] = manager?.employee_number || "-";
      }

      rowData["Clients"] = item.client_trading_name || "-";
      rowData["Service Type"] = item.service_name || "-";
      rowData["Job Type"] = item.job_type_name || "-";
      rowData["Status"] = item.status || "-";
      rowData["Allocated To"] = item.allocated_name || "-";
      rowData["Reviewer Name"] = item.reviewer_name || "-";
      rowData["Internal Deadline"] = convertDate(item.internal_deadline_date) || "-";
      rowData["Customer Deadline"] = convertDate(item.customer_deadline_date) || "-";

      return rowData;
    });

    downloadCSV(exportData, "Job_Status_Report.csv");
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
          <div className="col-md-7 mb-5">
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
            filter={true}
          />

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="d-flex align-items-center">
                <span className="me-2">Show</span>
                <select
                    className="perpage-select form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={pageSize}
                    onChange={handlePageSizeChange}
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="ms-2">entries</span>
            </div>
            
            <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={Math.ceil(totalRecords / pageSize)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageChange}
                containerClassName={"pagination mb-0"}
                activeClassName={"active"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                forcePage={currentPage - 1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJobStatus;
