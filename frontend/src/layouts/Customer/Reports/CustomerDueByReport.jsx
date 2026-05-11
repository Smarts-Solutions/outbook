import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerDueByReport as fetchDueByReport } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const CustomerDueByReport = () => {
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
    const data = { authToken: token };
    await dispatch(fetchDueByReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setDueByReport(res.data);
        } else {
          setDueByReport([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOnClick = (ids) => {
    if (!ids) return;
    navigate("/customer/report/jobs", { state: { job_ids: ids } });
  };

  const columns = [
    {
      name: "Count Of Customer",
      selector: (row) => row.customer_name,
      reorder: false,
      sortable: true,
    },
    ...Array.from({ length: 12 }, (_, i) => ({
      name: `Due Date Within ${i + 1} Month(s)`,
      cell: (row) => {
        const field = `due_within_${i + 1}_months`;
        const data = row[field];
        return data?.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(data.job_ids)}
          >
            {data.count}
          </div>
        ) : (
          <div></div>
        );
      },
      selector: (row) => row[`due_within_${i + 1}_months`]?.count || 0,
      sortable: true,
      reorder: false,
    })),
    {
      name: "Due Date Passed",
      cell: (row) =>
        row.due_passed?.count > 0 ? (
          <div
            style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
            onClick={() => handleOnClick(row.due_passed.job_ids)}
          >
            {row.due_passed.count}
          </div>
        ) : (
          <div></div>
        ),
      selector: (row) => row.due_passed?.count || 0,
      sortable: true,
      reorder: false,
    },
  ];

  const handleExport = () => {
    const exportData = getDueByReport.map((row) => {
      const rowData = { "Count Of Customer": row.customer_name };
      for (let i = 1; i <= 12; i++) {
        rowData[`Due Date Within ${i} Month(s)`] = row[`due_within_${i}_months`]?.count || 0;
      }
      rowData["Due Date Passed"] = row.due_passed?.count || 0;
      return rowData;
    });
    downloadCSV(exportData, "Due_By_Report.csv");
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = headers.map((h) => `"${row[h] || 0}"`);
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
          <div className="col-md-7 mb-5">
            <div className="tab-title">
              <h3>Due By Report</h3>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-end align-items-center mb-5">
            {getDueByReport && getDueByReport.length > 0 && (
                <button
                  className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2 lh-1"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span>Export Excel</span>
                </button>
            )}
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

export default CustomerDueByReport;
