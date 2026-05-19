import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { customerJobSummaryReports } from '../../../ReduxStore/Slice/Report/CustomerReportSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Download } from "lucide-react";

const CustomerJobSummary = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [jobSummaryReportData, setJobSummaryReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    JobSummary();
  }, []);

  const JobSummary = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(customerJobSummaryReports(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          const sortedData = [...res.data].sort((a, b) => 
            (a.job_status || "").localeCompare(b.job_status || "")
          );
          setJobSummaryReportData(sortedData);
        } else {
          setJobSummaryReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const handleOnClick = (row) => {
    navigate('/customer/report/jobs', { state: { job_ids: row?.job_ids } });
  }

  const columns = [
    { name: 'Status', selector: row => row.job_status, sortable: true, width: '50%' },
    {
      name: 'No Of Jobs',
      cell: (row) => (
        row.number_of_job > 0 ? (
          <div 
            style={{ color: 'rgb(38, 189, 240)', cursor: 'pointer' }} 
            onClick={() => handleOnClick(row)}
          >
            {row.number_of_job}
          </div>
        ) : (
          <div>{row.number_of_job}</div>
        )
      ),
      selector: row => row.number_of_job,
      sortable: true,
      width: '50%'
    }
  ];

  const handleExport = () => {
    const exportData = jobSummaryReportData.map(row => ({
      "Status": row.job_status,
      "No Of Jobs": row.number_of_job
    }));
    downloadCSV(exportData, "Job_Summary_Report.csv");
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
              <h3>Job Summary Report</h3>
            </div>
          </div>
        </div>
        {loading && (
          <div className="overlay">
            <div className="loader"></div>
          </div>
        )}
        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns}
            data={jobSummaryReportData && jobSummaryReportData}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerJobSummary;
