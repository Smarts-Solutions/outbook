import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { dueByReport } from "../../../ReduxStore/Slice/Report/ReportSlice";
import { useDispatch } from "react-redux";
import { json, useNavigate } from "react-router-dom";
import { Filter, FileSpreadsheet } from "lucide-react";
import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";

const DueByReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [getDueByReport, setDueByReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    DueReport();
  }, []);

  const DueReport = async () => {
    setLoading(true);
    const data = { req: {}, authToken: token };
    await dispatch(dueByReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setDueByReport(res.data);
         
        } else {
          setDueByReport([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleOnClick = (ids) => {
    navigate("/admin/report/jobs", { state: { job_ids: ids } });
  };
  const columns = [
    {
      name: "Count Of Customer",
      selector: (row) => row.customer_name,
      reorder: false,
      sortable: true,
    },

    {
      name: "Due Date Within 1 Month(s)",
      cell: (row) =>
        row.due_within_1_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_1_months.job_ids)}
          >
            {row.due_within_1_months.count}
          </div>
        ) : (
          <div>{row.due_within_1_months.count}</div>
        ),
      selector: (row) => row.due_within_1_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 2 Month(s)",
      cell: (row) =>
        row.due_within_2_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_2_months.job_ids)}
          >
            {row.due_within_2_months.count}
          </div>
        ) : (
          <div>{row.due_within_2_months.count}</div>
        ),
      selector: (row) => row.due_within_2_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 3 Month(s)",
      cell: (row) =>
        row.due_within_3_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_3_months.job_ids)}
          >
            {row.due_within_3_months.count}
          </div>
        ) : (
          <div>{row.due_within_3_months.count}</div>
        ),
      selector: (row) => row.due_within_3_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 4 Month(s)",
      cell: (row) =>
        row.due_within_4_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_4_months.job_ids)}
          >
            {row.due_within_4_months.count}
          </div>
        ) : (
          <div>{row.due_within_4_months.count}</div>
        ),
      selector: (row) => row.due_within_4_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 5 Month(s)",
      cell: (row) =>
        row.due_within_5_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_5_months.job_ids)}
          >
            {row.due_within_5_months.count}
          </div>
        ) : (
          <div>{row.due_within_5_months.count}</div>
        ),
      selector: (row) => row.due_within_5_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 6 Month(s)",
      cell: (row) =>
        row.due_within_6_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_6_months.job_ids)}
          >
            {row.due_within_6_months.count}
          </div>
        ) : (
          <div>{row.due_within_6_months.count}</div>
        ),
      selector: (row) => row.due_within_6_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 7 Month(s)",
      cell: (row) =>
        row.due_within_7_months.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_within_7_months.job_ids)}
          >
            {row.due_within_7_months.count}
          </div>
        ) : (
          <div>{row.due_within_7_months.count}</div>
        ),
      selector: (row) => row.due_within_7_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 8 Month(s)",
      cell: (row) =>
        row.due_within_8_months.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_within_8_months.job_ids)}
          >
            {row.due_within_8_months.count}
          </div>
        ) : (
          <div>{row.due_within_8_months.count}</div>
        ),
      selector: (row) => row.due_within_8_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 9 Month(s)",
      cell: (row) =>
        row.due_within_9_months.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_within_9_months.job_ids)}
          >
            {row.due_within_9_months.count}
          </div>
        ) : (
          <div>{row.due_within_9_months.count}</div>
        ),
      selector: (row) => row.due_within_9_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 10 Month(s)",
      cell: (row) =>
        row.due_within_10_months.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_within_10_months.job_ids)}
          >
            {row.due_within_10_months.count}
          </div>
        ) : (
          <div>{row.due_within_10_months.count}</div>
        ),
      selector: (row) => row.due_within_10_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 11 Month(s)",
      cell: (row) =>
        row.due_within_11_months.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_within_11_months.job_ids)}
          >
            {row.due_within_11_months.count}
          </div>
        ) : (
          <div>{row.due_within_11_months.count}</div>
        ),
      selector: (row) => row.due_within_11_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Within 12 Month(s)",
      cell: (row) =>
        row.due_within_12_months.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_within_12_months.job_ids)}
          >
            {row.due_within_12_months.count}
          </div>
        ) : (
          <div>{row.due_within_12_months.count}</div>
        ),
      selector: (row) => row.due_within_12_months.count,
      sortable: true,
      reorder: false,
    },

    {
      name: "Due Date Passed",
      cell: (row) =>
        row.due_passed.count > 0 ? (
          <div
            style={{
              color: "rgb(38, 189, 240)",
              cursor: "pointer",
            }}
            onClick={() => handleOnClick(row.due_passed.job_ids)}
          >
            {row.due_passed.count}
          </div>
        ) : (
          <div>{row.due_passed.count}</div>
        ),
      selector: (row) => row.due_passed.count,
      sortable: true,
      reorder: false,
    },
  ];

  const headers = [
    { label: "Count Of Customer", key: "customer_name" },
    { label: "Due Date Within 1 Month(s)", key: "due_within_1_months" },
    { label: "Due Date Within 2 Month(s)", key: "due_within_2_months" },
    { label: "Due Date Within 3 Month(s)", key: "due_within_3_months" },
    { label: "Due Date Within 4 Month(s)", key: "due_within_4_months" },
    { label: "Due Date Within 5 Month(s)", key: "due_within_5_months" },
    { label: "Due Date Within 6 Month(s)", key: "due_within_6_months" },
    { label: "Due Date Within 7 Month(s)", key: "due_within_7_months" },
    { label: "Due Date Within 8 Month(s)", key: "due_within_8_months" },
    { label: "Due Date Within 9 Month(s)", key: "due_within_9_months" },
    { label: "Due Date Within 10 Month(s)", key: "due_within_10_months" },
    { label: "Due Date Within 11 Month(s)", key: "due_within_11_months" },
    { label: "Due Date Within 12 Month(s)", key: "due_within_12_months" },
    { label: "Due Date Passed", key: "due_passed" },
  ];

  const exportData = getDueByReport.map(row => ({
    customer_name: row.customer_name,
    due_within_1_months: row.due_within_1_months.count,
    due_within_2_months: row.due_within_2_months.count,
    due_within_3_months: row.due_within_3_months.count,
    due_within_4_months: row.due_within_4_months.count,
    due_within_5_months: row.due_within_5_months.count,
    due_within_6_months: row.due_within_6_months.count,
    due_within_7_months: row.due_within_7_months.count,
    due_within_8_months: row.due_within_8_months.count,
    due_within_9_months: row.due_within_9_months.count,
    due_within_10_months: row.due_within_10_months.count,
    due_within_11_months: row.due_within_11_months.count,
    due_within_12_months: row.due_within_12_months.count,
    due_passed: row.due_passed.count,
  }));

  return (
    <div>
      <div className="report-data">
        <div className="row">
          <div className="col-md-7">
            <div className="tab-title mb-5">
              <h3>Due By Report</h3>
            </div>
          </div>
          <div className="col-md-5">
             <ExportToExcel apiData={exportData} fileName={'Due_By_Report'} headers={headers} />
          </div>
        </div>
        <div className="datatable-wrapper mt-minus">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <Datatable
            filter={true}
            columns={columns}
            data={getDueByReport && getDueByReport}
          />
        </div>
      </div>
    </div>
  );
};

export default DueByReport;

