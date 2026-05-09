import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerTaxWeeklyReport as fetchTaxWeeklyReport } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const CustomerTaxWeeklyReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    getReport();
  }, []);

  const getReport = async () => {
    setLoading(true);
    const data = { req: {}, authToken: token };
    await dispatch(fetchTaxWeeklyReport(data))
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

  const handleOnClick = (ids) => {
    if (!ids) return;
    navigate("/customer/report/jobs", { state: { job_ids: ids } });
  };

  const columns = [
    {
      name: "Job Status",
      selector: (row) => row.job_status,
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customer_name,
      sortable: true,
    },
    ...Array.from({ length: 53 }, (_, i) => {
      const weekKey = `WE_${i + 1}_${currentYear}`;
      return {
        name: `WE ${i + 1}`,
        cell: (row) => {
          const weekData = row.weeks?.[0]?.[weekKey];
          return weekData?.count > 0 ? (
            <div
              style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
              onClick={() => handleOnClick(weekData.job_ids)}
            >
              {weekData.count}
            </div>
          ) : (
            <div>{weekData?.count || 0}</div>
          );
        },
        selector: (row) => row.weeks?.[0]?.[weekKey]?.count || 0,
        sortable: true,
        width: "80px",
      };
    }),
    {
      name: "Grand Total",
      cell: (row) => (
        <div
          style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
          onClick={() => handleOnClick(row.Grand_Total?.job_ids)}
        >
          {row.Grand_Total?.count || 0}
        </div>
      ),
      selector: (row) => row.Grand_Total?.count || 0,
      sortable: true,
      fixed: "right",
    },
  ];

  const handleExport = () => {
    const exportData = reportData.map((row) => {
      const rowData = {
        "Job Status": row.job_status,
        "Customer Name": row.customer_name,
      };
      for (let i = 1; i <= 53; i++) {
        const weekKey = `WE_${i}_${currentYear}`;
        rowData[`WE ${i}`] = row.weeks?.[0]?.[weekKey]?.count || 0;
      }
      rowData["Grand Total"] = row.Grand_Total?.count || 0;
      return rowData;
    });
    downloadCSV(exportData, "Customer_Tax_Weekly_Report.csv");
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
              <h3>Tax Weekly Status Report</h3>
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

          <div className="scroll-x">
            <Datatable
              columns={columns}
              data={reportData && reportData}
              filter={false}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerTaxWeeklyReport;
