import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { CustomerAverageTatReport as fetchAverageTatReport } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const CustomerAverageTatReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [tatData, setTatData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTatReport();
  }, []);

  const getTatReport = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(fetchAverageTatReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setTatData(res.data);
        } else {
          setTatData([]);
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
      name: "Month",
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: "Average TAT (Days)",
      cell: (row) => (
        <div
          style={{ color: "rgb(38, 189, 240)", cursor: "pointer" }}
          onClick={() => handleOnClick(row.job_ids)}
        >
          {parseFloat(row.average_tat_per_day || 0).toFixed(2)}
        </div>
      ),
      selector: (row) => row.average_tat_per_day,
      sortable: true,
    },
  ];

  const handleExport = () => {
    const exportData = tatData.map((row) => ({
      Month: row.month,
      "Average TAT (Days)": parseFloat(row.average_tat_per_day || 0).toFixed(2),
    }));
    downloadCSV(exportData, "Customer_Average_TAT_Report.csv");
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
              <h3>Average TAT Report</h3>
            </div>
          </div>
        </div>
        <div className="datatable-wrapper mt-minus">
          <div className="d-flex justify-content-end mb-3">
            {tatData && tatData.length > 0 && (
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
            data={tatData && tatData}
            filter={false}
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerAverageTatReport;
