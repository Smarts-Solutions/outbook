import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import {jobPendingReports} from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';

const JobPendingReport = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [getJobPendingReport, setJobPendingReport] = useState([]);

  
    useEffect(() => {
        JobPending();
      }, []);
    
      const JobPending = async () => {
        const data = { req: {}, authToken: token };
        await dispatch(jobPendingReports(data))
          .unwrap()
          .then((res) => {
            if (res.status) {
              setJobPendingReport(res.data);
            }
            else {
                setJobPendingReport([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

  
  const columns = [
    { name: 'Job Status', selector: row => row.job_status, sortable: true },
    { name: 'Job Type Name', selector: row => row.job_type_name, sortable: true },
    { name: 'Number of Job', selector: row => row.number_of_job, sortable: true },

   
  ]

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7'>
                <div className='tab-title'>
                  <h3>Job Pending Report</h3>
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
                columns={columns} data={getJobPendingReport && getJobPendingReport} />
            </div>
          </div>
    </div>
  )
}

export default JobPendingReport