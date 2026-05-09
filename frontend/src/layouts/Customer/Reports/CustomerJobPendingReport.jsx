import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { customerJobPendingReports } from '../../../ReduxStore/Slice/Report/CustomerReportSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Download } from "lucide-react";

const CustomerJobPending = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [jobPendingReportData, setJobPendingReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    JobPending();
  }, []);

  const JobPending = async () => {
    setLoading(true);
    const data = { authToken: token };
    await dispatch(customerJobPendingReports(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setJobPendingReportData(res.data);
        } else {
          setJobPendingReportData([]);
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
    {
      name: 'Job Status',
      selector: row => row.job_status,
      sortable: true,
      reorder: false,
    },
    {
      name: 'Job Type Name',
      selector: row => row.job_type_name,
      sortable: true,
      reorder: false,
    },
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
      reorder: false,
    }
  ];

  const handleExport = () => {
    const exportData = jobPendingReportData.map(row => ({
      "Job Status": row.job_status,
      "Job Type Name": row.job_type_name,
      "No Of Jobs": row.number_of_job
    }));
    downloadCSV(exportData, "Job_Pending_Report.csv");
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
              <h3>Job Pending Report</h3>
            </div>
          </div>
          <div className="col-md-5 d-flex justify-content-end align-items-center mb-5">
            {jobPendingReportData && jobPendingReportData.length > 0 && (
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
        {loading && (
          <div className="overlay">
            <div className="loader"></div>
          </div>
        )}
        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns}
            data={jobPendingReportData && jobPendingReportData}
          />
        </div>
      </div>
    </div>
  )
}

export default CustomerJobPending;
