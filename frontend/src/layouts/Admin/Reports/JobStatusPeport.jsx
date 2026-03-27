import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { JobStatusReport } from "../../../ReduxStore/Slice/Report/ReportSlice";
import { useDispatch } from "react-redux";
import { convertDate } from "../../../Utils/Comman_function";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const JobStatus = () => {
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("role"));

  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [JobStatusData, setJobStatusData] = useState([]);
  const [getAccessDataJob, setAccessDataJob] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
    all_jobs: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(false);

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    // GetJobStatus(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    // GetJobStatus(1, newSize, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    // GetJobStatus(1, pageSize, term);
  };

  useEffect(() => {
    GetJobStatus(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const GetJobStatus = async (page = 1, limit = 10, search = "") => {
    setLoading(true);

    const data = { req: { page, limit, search }, authToken: token };
    await dispatch(JobStatusReport(data))
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


  const maxManagers = Math.max(
    ...JobStatusData.map((row) => (row.account_managers || []).length)
  );

  console.log("maxManagers", maxManagers)

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
      }
    ]
  );

  const HandleJob = (row) => {

    const updatedData = {

      job: row,
    };



    // return
    navigate("/admin/job/logs", {
      state: {
        job_id: row?.id,
        timesheet_job_id: null,
        data: updatedData,
        goto: "client",
        activeTab: undefined
      },
    });

  };




  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job",
    )?.items || [];

  const accessDataJobAll =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_jobs",
    )?.items || [];

  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = {
      insert: 0,
      update: 0,
      delete: 0,
      view: 0,
      all_jobs: 0,
    };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });

    accessDataJobAll.forEach((item) => {
      if (item.type === "view") updatedAccess.all_jobs = item.is_assigned;
    });

    setAccessDataJob(updatedAccess);
  }, []);

  const columns = [


    {
      name: "Job ID",
      cell: (row) => (
        <div title={row.job_code_id}>
          {getAccessDataJob.view == 1 ||
            getAccessDataJob.all_jobs == 1 ||
            role === "SUPERADMIN" ? (
            <a
              onClick={() => HandleJob(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.job_code_id}
            </a>
          ) : (
            <a>{row.job_code_id}</a>
          )}
        </div>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Job Received On",
      selector: (row) => convertDate(row.job_received_on),
      reorder: false,
      sortable: true,
    },

    {
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        const cap = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return <div title={cap}>{cap}</div>;
      },
      selector: (row) => {
        if (!row.job_priority) return "-";
        return (
          row.job_priority.charAt(0).toUpperCase() +
          row.job_priority.slice(1).toLowerCase()
        );
      },
      sortable: true,
    },

    {
      name: "Customer Name",
      cell: (row) => (
        <div title={row.customer_trading_name}>{row.customer_trading_name}</div>
      ),
      selector: (row) => row.customer_trading_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Account Manager",
      cell: (row) => (
        <div title={row.account_manager_name}>{row.account_manager_name}</div>
      ),
      selector: (row) => row.account_manager_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Employee ID",
      cell: (row) => (
        <div title={row.account_manager_employee_number}>{row.account_manager_employee_number}</div>
      ),
      selector: (row) => row.account_manager_employee_number,
      reorder: false,
      sortable: true,
    },

    ...dynamicManagerColumns,






    {
      name: "Clients",
      cell: (row) => (
        <div title={row.client_trading_name}>{row.client_trading_name}</div>
      ),
      selector: (row) => row.client_trading_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Service Type",
      cell: (row) => <div title={row.service_name}>{row.service_name}</div>,
      selector: (row) => row.service_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row) => <div title={row.job_type_name}>{row.job_type_name}</div>,
      selector: (row) => row.job_type_name,
      reorder: false,
      sortable: true,
    },
    {
      name: "Year Ending",
      cell: (row) => <> {row.service_name == "Accounts Production" ? <div title={row.Year_Ending_id_1}>{row.Year_Ending_id_1 ? convertDate(row.Year_Ending_id_1) : "-"}</div> : "-"}</>,
      selector: (row) => row.Year_Ending_id_1,
      reorder: false,
      sortable: true,
    },
    {
      name: "Tax Year",
      cell: (row) => <> {row.service_name == "Personal Tax Return" ? <div title={row.Tax_Year_id_4}>{row.Tax_Year_id_4 ? row.Tax_Year_id_4 : "-"}</div> : "-"}</>,
      selector: (row) => row.Tax_Year_id_4,
      reorder: false,
      sortable: true,
    },

    {
      name: "Payroll Frequency",
      cell: (row) => <> {row.service_name == "Payroll" ? <div title={row.Payroll_Frequency_id_3}>{row.Payroll_Frequency_id_3 ? row.Payroll_Frequency_id_3 : "-"}</div> : "-"}</>,
      selector: (row) => row.Payroll_Frequency_id_3,
      reorder: false,
      sortable: true,
    },
    {
      name: "Payroll Year",
      cell: (row) =>
        <> {row.service_name == "Payroll" ? row.Payroll_Frequency_id_3 == "Weekly" ? <div title={row.Payroll_Week_Year_id_3}>{row.Payroll_Week_Year_id_3 ? row.Payroll_Week_Year_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Monthly" ? <div title={row.Payroll_Month_Year_id_3}>{row.Payroll_Month_Year_id_3 ? row.Payroll_Month_Year_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Fortnightly" ? <div title={row.Payroll_Fortnight_Year_id_3}>{row.Payroll_Fortnight_Year_id_3 ? row.Payroll_Fortnight_Year_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Quarterly" ? <div title={row.Payroll_Quarter_Year_id_3}>{row.Payroll_Quarter_Year_id_3 ? row.Payroll_Quarter_Year_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Yearly" ? <div title={row.Payroll_Year_id_3}>{row.Payroll_Year_id_3 ? row.Payroll_Year_id_3 : "-"}</div> : "-" : "-"}

        </>,
      selector: (row) => row.Payroll_Week_Year_id_3,
      reorder: false,
      sortable: true,
    },
    {
      name: "Payroll Month",
      cell: (row) => <>
        {row.service_name == "Payroll" ? row.Payroll_Frequency_id_3 == "Weekly" ? <div title={row.Payroll_Week_Month_id_3}>{row.Payroll_Week_Month_id_3 ? row.Payroll_Week_Month_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Monthly" ? <div title={row.Payroll_Month_id_3}>{row.Payroll_Month_id_3 ? row.Payroll_Month_id_3 : "-"}</div> : row.Payroll_Frequency_id_3 == "Fortnightly" ? <div title={row.Payroll_Fortnight_Month_id_3}>{row.Payroll_Fortnight_Month_id_3 ? row.Payroll_Fortnight_Month_id_3 : "-"}</div> : "-" : "-"}
      </>,
      selector: (row) => row.Payroll_Week_Month_id_3,
      reorder: false,
      sortable: true,
    },
    {
      name: "Payroll Week",
      cell: (row) => <> {row.service_name == "Payroll" ? <div title={row.Payroll_Week_id_3}>{row.Payroll_Week_id_3 ? row.Payroll_Week_id_3 : "-"}</div> : "-"}</>,
      selector: (row) => row.Payroll_Week_id_3,
      reorder: false,
      sortable: true,
    },

    {
      name: "Bookkeeping Frequency",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? <div title={row.Bookkeeping_Frequency_id_2}>{row.Bookkeeping_Frequency_id_2 ? row.Bookkeeping_Frequency_id_2 : "-"}</div> : "-"}</>,
      selector: (row) => row.Bookkeeping_Frequency_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Date",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? <div title={row.Day_Date_id_2}>{row.Day_Date_id_2 ? convertDate(row.Day_Date_id_2) : "-"}</div> : "-"}</>,
      selector: (row) => row.Day_Date_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Year",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? row.Bookkeeping_Frequency_id_2 == "Weekly" ? <div title={row.Week_Year_id_2}>{row.Week_Year_id_2 ? row.Week_Year_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Fortnightly" ? <div title={row.Fortnight_Year_id_2}>{row.Fortnight_Year_id_2 ? row.Fortnight_Year_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Monthly" ? <div title={row.Month_Year_id_2}>{row.Month_Year_id_2 ? row.Month_Year_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Quarterly" ? <div title={row.Quarter_Year_id_2}>{row.Quarter_Year_id_2 ? row.Quarter_Year_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Yearly" ? <div title={row.Year_id_2}>{row.Year_id_2 ? row.Year_id_2 : "-"}</div> : "-" : "-"}</>,
      selector: (row) => row.Week_Year_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Month",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? row.Bookkeeping_Frequency_id_2 == "Weekly" ? <div title={row.Week_Month_id_2}>{row.Week_Month_id_2 ? row.Week_Month_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Fortnightly" ? <div title={row.Fortnight_Month_id_2}>{row.Fortnight_Month_id_2 ? row.Fortnight_Month_id_2 : "-"}</div> : row.Bookkeeping_Frequency_id_2 == "Monthly" ? <div title={row.Month_id_2}>{row.Month_id_2 ? row.Month_id_2 : "-"}</div> : "-" : "-"}</>,
      selector: (row) => row.Week_Month_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Week",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? row.Bookkeeping_Frequency_id_2 == "Weekly" ? <div title={row.Week_id_2}>{row.Week_id_2 ? row.Week_id_2 : "-"}</div> : "-" : "-"}</>,
      selector: (row) => row.Week_Month_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Fortnight",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? row.Bookkeeping_Frequency_id_2 == "Fortnightly" ? <div title={row.Fortnight_id_2}>{row.Fortnight_id_2 ? row.Fortnight_id_2 : "-"}</div> : "-" : "-"}</>,
      selector: (row) => row.Fortnight_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Quarter",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? row.Bookkeeping_Frequency_id_2 == "Quarterly" ? <div title={row.Quarter_id_2}>{row.Quarter_id_2 ? row.Quarter_id_2 : "-"}</div> : "-" : "-"}</>,
      selector: (row) => row.Quarter_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "From Date",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? <div title={row.Other_FromDate_id_2}>{row.Other_FromDate_id_2 ? convertDate(row.Other_FromDate_id_2) : "-"}</div> : "-"}</>,
      selector: (row) => row.Other_FromDate_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "To Date",
      cell: (row) => <> {row.service_name == "Bookkeeping" ? <div title={row.Other_ToDate_id_2}>{row.Other_ToDate_id_2 ? convertDate(row.Other_ToDate_id_2) : "-"}</div> : "-"}</>,
      selector: (row) => row.Other_ToDate_id_2,
      reorder: false,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => <div title={row.status}>{row.status}</div>,
      selector: (row) => row.status,
      reorder: false,
      sortable: true,
    },
    {
      name: "Allocated To",
      cell: (row) => <div title={row.allocated_name}>{row.allocated_name}</div>,
      selector: (row) => row.allocated_name,
      reorder: false,
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = (a.allocated_name || "").toLowerCase();
        const nameB = (b.allocated_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      name: "Allocated to (Other)",
      cell: (row) => (
        <div title={row.multiple_staff_names}>{row.multiple_staff_names}</div>
      ),
      selector: (row) => row.multiple_staff_names,
      reorder: false,
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = (a.multiple_staff_names || "").toLowerCase();
        const nameB = (b.multiple_staff_names || "").toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      name: "Reviewer Name",
      cell: (row) => <div title={row.reviewer_name}>{row.reviewer_name}</div>,
      selector: (row) => row.reviewer_name,
      reorder: false,
      sortable: true,
      sortFunction: (a, b) => {
        const nameA = (a.reviewer_name || "").toLowerCase();
        const nameB = (b.reviewer_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      },
    },
    {
      name: "Companies House Due Date",

      selector: (row) => convertDate(row.filing_Companies_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Internal Deadline",
      selector: (row) => convertDate(row.internal_deadline_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Customer Deadline",
      selector: (row) => convertDate(row.customer_deadline_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Initial Query Sent Date",
      selector: (row) => convertDate(row.query_sent_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "Final Query Response Received Date",
      selector: (row) => convertDate(row.final_query_response_received_date),
      reorder: false,
      sortable: true,
    },
    {
      name: "First Draft Sent",
      selector: (row) => convertDate(row.draft_sent_on),
      reorder: false,
      sortable: true,
    },
    {
      name: "Final Draft Sent",
      selector: (row) => convertDate(row.final_draft_sent_on),
      reorder: false,
      sortable: true,
    },
  ];



  const handleExport = async () => {
    const data = {
      req: { page: 1, limit: 1000000, search: "" },
      authToken: token,
    };

    const response = await dispatch(JobStatusReport(data)).unwrap();

    if (
      !response.status ||
      !response?.data?.rows ||
      response?.data?.rows?.length === 0
    ) {
      alert("No data to export!");
      return;
    }

    const rows = response?.data?.rows || [];

    // ✅ Find maximum account managers

    console.log("maxManagers", maxManagers)
    const exportData = rows.map((item) => {
      // ✅ Build rowData in EXACT same order as columns array
      const rowData = {};

      // 1. Job ID
      rowData["Job Id"] = item.job_code_id || "-";

      // 2. Job Received On
      rowData["Job Received On"] = item.job_received_on
        ? convertDate(item.job_received_on)
        : "-";

      // 3. Job Priority
      rowData["Job Priority"] = item.job_priority
        ? item.job_priority.charAt(0).toUpperCase() +
        item.job_priority.slice(1).toLowerCase()
        : "-";

      // 4. Customer Name
      rowData["Customer Name"] = item.customer_trading_name || "-";

      // 5. Account Manager
      rowData["Account Manager"] = item.account_manager_name || "-";

      // 6. Employee ID
      rowData["Employee ID"] = item.account_manager_employee_number || "-";

      // 7. Dynamic Manager Columns (...dynamicManagerColumns)
      for (let i = 0; i < maxManagers; i++) {
        const manager = item.account_managers?.[i];
        rowData[`Individual Account Manager ${i + 1}`] = manager?.full_name || "-";
        rowData[`Employee ID ${i + 1}`] = manager?.employee_number || "-";
      }

      // 8. Clients
      rowData["Clients"] = item.client_trading_name || "-";

      // 9. Service Type
      rowData["Service Type"] = item.service_name || "-";

      // 10. Job Type
      rowData["Job Type"] = item.job_type_name || "-";

      // 11. Year Ending
      rowData["Year Ending"] =
        item.service_name === "Accounts Production"
          ? item.Year_Ending_id_1
            ? convertDate(item.Year_Ending_id_1)
            : "-"
          : "-";

      // 12. Tax Year
      rowData["Tax Year"] =
        item.service_name === "Personal Tax Return"
          ? item.Tax_Year_id_4 || "-"
          : "-";

      // 13. Payroll Frequency
      rowData["Payroll Frequency"] =
        item.service_name === "Payroll"
          ? item.Payroll_Frequency_id_3 || "-"
          : "-";

      // 14. Payroll Year
      rowData["Payroll Year"] =
        item.service_name === "Payroll"
          ? item.Payroll_Frequency_id_3 === "Weekly"
            ? item.Payroll_Week_Year_id_3 || "-"
            : item.Payroll_Frequency_id_3 === "Monthly"
              ? item.Payroll_Month_Year_id_3 || "-"
              : item.Payroll_Frequency_id_3 === "Fortnightly"
                ? item.Payroll_Fortnight_Year_id_3 || "-"
                : item.Payroll_Frequency_id_3 === "Quarterly"
                  ? item.Payroll_Quarter_Year_id_3 || "-"
                  : item.Payroll_Frequency_id_3 === "Yearly"
                    ? item.Payroll_Year_id_3 || "-"
                    : "-"
          : "-";

      // 15. Payroll Month
      rowData["Payroll Month"] =
        item.service_name === "Payroll"
          ? item.Payroll_Frequency_id_3 === "Weekly"
            ? item.Payroll_Week_Month_id_3 || "-"
            : item.Payroll_Frequency_id_3 === "Monthly"
              ? item.Payroll_Month_id_3 || "-"
              : item.Payroll_Frequency_id_3 === "Fortnightly"
                ? item.Payroll_Fortnight_Month_id_3 || "-"
                : "-"
          : "-";

      // 16. Payroll Week
      rowData["Payroll Week"] =
        item.service_name === "Payroll"
          ? item.Payroll_Week_id_3 || "-"
          : "-";

      // 17. Bookkeeping Frequency
      rowData["Bookkeeping Frequency"] =
        item.service_name === "Bookkeeping"
          ? item.Bookkeeping_Frequency_id_2 || "-"
          : "-";

      // 18. Date
      rowData["Date"] =
        item.service_name === "Bookkeeping"
          ? item.Day_Date_id_2
            ? convertDate(item.Day_Date_id_2)
            : "-"
          : "-";

      // 19. Year
      rowData["Year"] =
        item.service_name === "Bookkeeping"
          ? item.Bookkeeping_Frequency_id_2 === "Weekly"
            ? item.Week_Year_id_2 || "-"
            : item.Bookkeeping_Frequency_id_2 === "Fortnightly"
              ? item.Fortnight_Year_id_2 || "-"
              : item.Bookkeeping_Frequency_id_2 === "Monthly"
                ? item.Month_Year_id_2 || "-"
                : item.Bookkeeping_Frequency_id_2 === "Quarterly"
                  ? item.Quarter_Year_id_2 || "-"
                  : item.Bookkeeping_Frequency_id_2 === "Yearly"
                    ? item.Year_id_2 || "-"
                    : "-"
          : "-";

      // 20. Month
      rowData["Month"] =
        item.service_name === "Bookkeeping"
          ? item.Bookkeeping_Frequency_id_2 === "Weekly"
            ? item.Week_Month_id_2 || "-"
            : item.Bookkeeping_Frequency_id_2 === "Fortnightly"
              ? item.Fortnight_Month_id_2 || "-"
              : item.Bookkeeping_Frequency_id_2 === "Monthly"
                ? item.Month_id_2 || "-"
                : "-"
          : "-";

      // 21. Week
      rowData["Week"] =
        item.service_name === "Bookkeeping" &&
          item.Bookkeeping_Frequency_id_2 === "Weekly"
          ? item.Week_id_2 || "-"
          : "-";

      // 22. Fortnight
      rowData["Fortnight"] =
        item.service_name === "Bookkeeping" &&
          item.Bookkeeping_Frequency_id_2 === "Fortnightly"
          ? item.Fortnight_id_2 || "-"
          : "-";

      // 23. Quarter
      rowData["Quarter"] =
        item.service_name === "Bookkeeping" &&
          item.Bookkeeping_Frequency_id_2 === "Quarterly"
          ? item.Quarter_id_2 || "-"
          : "-";

      // 24. FromDate
      rowData["FromDate"] =
        item.service_name === "Bookkeeping"
          ? item.Other_FromDate_id_2
            ? convertDate(item.Other_FromDate_id_2)
            : "-"
          : "-";

      // 25. ToDate
      rowData["ToDate"] =
        item.service_name === "Bookkeeping"
          ? item.Other_ToDate_id_2
            ? convertDate(item.Other_ToDate_id_2)
            : "-"
          : "-";

      // 26. Status
      rowData["Status"] = item.status || "-";

      // 27. Allocated To
      rowData["Allocated To"] = item.allocated_name || "-";

      // 28. Allocated to (Other)
      rowData["Allocated to (Other)"] = item.multiple_staff_names || "-";

      // 29. Reviewer Name
      rowData["Reviewer Name"] = item.reviewer_name || "-";

      // 30. Companies House Due Date
      rowData["Companies House Due Date"] = item.filing_Companies_date
        ? convertDate(item.filing_Companies_date)
        : "-";

      // 31. Internal Deadline
      rowData["Internal Deadline"] = item.internal_deadline_date
        ? convertDate(item.internal_deadline_date)
        : "-";

      // 32. Customer Deadline
      rowData["Customer Deadline"] = item.customer_deadline_date
        ? convertDate(item.customer_deadline_date)
        : "-";

      // 33. Initial Query Sent Date
      rowData["Initial Query Sent Date"] = item.query_sent_date
        ? convertDate(item.query_sent_date)
        : "-";

      // 34. Final Query Response Received Date
      rowData["Final Query Response Received Date"] =
        item.final_query_response_received_date
          ? convertDate(item.final_query_response_received_date)
          : "-";

      // 35. First Draft Sent
      rowData["First Draft Sent"] = item.draft_sent_on
        ? convertDate(item.draft_sent_on)
        : "-";

      // 36. Final Draft Sent
      rowData["Final Draft Sent"] = item.final_draft_sent_on
        ? convertDate(item.final_draft_sent_on)
        : "-";

      return rowData;
    });

    downloadCSV(exportData, "Job Status Report.csv");
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
                 <Download size={16}/>
                  <span>Export Excel</span>
                </button>
              </div>
            )}
          </div>

          <div className="row mb-3 mt-3">
            <div className="col-md-4">
              <input
                type="text"
                placeholder={`Search ...`}
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
            // filter={true}
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
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={500}>500</option>
            {/* <option value={100000}>All</option> */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobStatus;
