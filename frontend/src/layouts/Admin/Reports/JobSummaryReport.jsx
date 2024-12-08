import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import {jobSummaryReports} from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';

const JobStatus = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [jobSummaryReportData, setJobSummaryReportData] = useState([]);


    useEffect(() => {
        JobSummary();
      }, []);
    
      const JobSummary = async () => {
        const data = { req: {}, authToken: token };
        await dispatch(jobSummaryReports(data))
          .unwrap()
          .then((res) => {
            if (res.status) {
              setJobSummaryReportData(res.data);
            }
            else {
                setJobSummaryReportData([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

  
  const columns = [
    { name: 'Status', selector: row => row.job_status, sortable: true },
    { name: 'No Of Jobs', selector: row => row.number_of_job, sortable: true },
   
  ]

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7'>
                <div className='tab-title'>
                  <h3>Job Summary Report</h3>
                </div>
                <div className='job-filter-btn '>
                  <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
                  <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
                </div>
              </div>
            </div>
            <div className='datatable-wrapper mt-minus'>
              <Datatable
                filter={true}
                columns={columns} data={jobSummaryReportData && jobSummaryReportData} />
            </div>
          </div>
    </div>
  )
}

export default JobStatus