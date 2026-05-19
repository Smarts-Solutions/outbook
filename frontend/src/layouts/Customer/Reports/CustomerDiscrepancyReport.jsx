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

  const convertTimeFormat = (value) => {
    let final_value = value;
    if (!value) return final_value;
    let [intPart, decimalPart] = value.toString().split(".");
    if (decimalPart) {
      let multiplied = Math.floor(parseInt(decimalPart) * 0.6);
      const multipliedStr = multiplied.toString().padStart(2, '0');
      final_value = `${intPart}:${multipliedStr}`;
    }
    return final_value;
  };

  function convertTimeFormatString(timeStr) {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    let result = "";
    if (hours > 0) result += `${hours} Hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) result += (result ? " " : "") + `${minutes} Minute${minutes > 1 ? "s" : ""}`;
    return result || "0 minutes";
  }

  const columns = [
    {
      name: 'Job Name',
      selector: row => row.job_code_id,
      sortable: true
    },
    {
      name: 'Timesheet Total Hours',
      selector: row => (convertTimeFormatString(convertTimeFormat(row.total_spent_hours))),
      sortable: true
    },
    {
      name: 'Job Total Hours',
      selector: row => convertTimeFormatString(row.job_total_time),
      sortable: true
    },
  ];

  const handleExport = () => {
    const exportData = (reportData || []).map(row => ({
      "Job Name": row.job_code_id,
      "Timesheet Total Hours": convertTimeFormatString(convertTimeFormat(row.total_spent_hours)),
      "Job Total Hours": convertTimeFormatString(row.job_total_time)
    }));
    downloadCSV(exportData, "Discrepancy_Report.csv");
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
              <h3>Discrepancy Report</h3>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-end align-items-center mb-5">
            {reportData && reportData.length > 0 && (
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
            data={reportData && reportData}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDiscrepancyReport;
