import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerDiscrepancyReport as fetchDiscrepancy } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { Download } from "lucide-react";

const CustomerDiscrepancyReport = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getReport();
  }, []);

  const getReport = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(fetchDiscrepancy(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setReportData(res.data);
        } else {
          setReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      name: "Job ID",
      selector: (row) => row.job_code_id,
      sortable: true,
    },
    {
      name: "Total Quoted Time",
      selector: (row) => row.job_total_time || "00:00:00",
      sortable: true,
    },
    {
      name: "Total Spent Time",
      selector: (row) => row.total_spent_hours || 0,
      sortable: true,
    },
    {
      name: "Discrepancy",
      cell: (row) => {
          const quoted = parseFloat((row.job_total_time || "0:0").replace(":", ".")) || 0;
          const spent = parseFloat(row.total_spent_hours) || 0;
          const diff = quoted - spent;
          return <span style={{ color: diff < 0 ? 'red' : 'green' }}>{diff.toFixed(2)}</span>;
      },
      sortable: true,
    },
  ];

  const handleExport = () => {
    const exportData = reportData.map((row) => {
        const quoted = parseFloat((row.job_total_time || "0:0").replace(":", ".")) || 0;
        const spent = parseFloat(row.total_spent_hours) || 0;
        const diff = quoted - spent;
        return {
            "Job ID": row.job_code_id,
            "Total Quoted Time": row.job_total_time || "00:00:00",
            "Total Spent Time": row.total_spent_hours || 0,
            "Discrepancy": diff.toFixed(2),
        };
    });
    downloadCSV(exportData, "Customer_Discrepancy_Report.csv");
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
          <div className="col-md-7 mb-2">
            <div className="tab-title">
              <h3>Discrepancy Report</h3>
            </div>
          </div>
        </div>
        <div className="datatable-wrapper mt-minus">
          <div className="d-flex justify-content-end mb-3">
            {reportData && reportData.length > 0 && (
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

          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}

          <Datatable
            columns={columns}
            data={reportData && reportData}
            filter={false}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDiscrepancyReport;
