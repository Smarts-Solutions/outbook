import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { CustomerMissingTimesheetReport as fetchMissingTimesheet } from "../../../ReduxStore/Slice/Report/CustomerReportSlice";
import { Download } from 'lucide-react';

const CustomerMissingTimesheetReport = () => {
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
    await dispatch(fetchMissingTimesheet(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setReportData(res.data.result);
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
  }

  const columns = [
    { name: 'Staff Name', selector: row => row.staff_fullname, sortable: true },
    { name: 'Staff Email', selector: row => row.staff_email, sortable: true },
    { name: 'Week Date', selector: row => row.week_date, sortable: true },
  ];

  const handleExport = () => {
    const exportData = reportData.map((row) => ({
      "Staff Name": row.staff_fullname,
      "Staff Email": row.staff_email,
      "Week Date": row.week_date,
    }));
    downloadCSV(exportData, "Customer_Missing_Timesheet_Report.csv");
  };

  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) return;
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
      <div className='report-data'>
        <div className="row">
          <div className="col-md-7 mb-2">
            <div className="tab-title">
              <h3>Missing Timesheet Report</h3>
            </div>
          </div>
        </div>
        <div className='datatable-wrapper mt-minus'>
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
  )
}

export default CustomerMissingTimesheetReport;
