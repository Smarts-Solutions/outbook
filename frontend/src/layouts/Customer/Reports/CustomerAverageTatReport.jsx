import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { CustomerAverageTatReport as fetchAverageTatReport } from '../../../ReduxStore/Slice/Report/CustomerReportSlice';
import { useDispatch } from 'react-redux';
import { Download } from "lucide-react";

const CustomerAverageTatReport = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AvgTatReport();
  }, []);

  const AvgTatReport = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(fetchAverageTatReport(data))
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
      name: 'Month',
      selector: row => row.month,
      sortable: true,
      reorder: false,
    },
    {
      name: 'Average TAT Per Day',
      selector: row => (row.average_tat_per_day ? parseFloat(row.average_tat_per_day).toFixed(2) : '0.00'),
      sortable: true,
      reorder: false,
    },
  ];

  const handleExport = () => {
    const exportData = reportData.map((row) => ({
      "Month": row.month,
      "Average TAT Per Day": row.average_tat_per_day ? parseFloat(row.average_tat_per_day).toFixed(2) : '0.00',
    }));
    downloadCSV(exportData, "Average_TAT_Report.csv");
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
      <div className='report-data'>
        <div className='row'>
          <div className='col-md-7 mb-5'>
            <div className='tab-title'>
              <h3>Average TAT Report</h3>
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
        <div className='datatable-wrapper mt-minus'>
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

export default CustomerAverageTatReport;
