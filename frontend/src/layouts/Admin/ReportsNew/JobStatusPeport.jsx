import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import {JobStatusReport} from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';

const JobStatus = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [JobStatusData, setJobStatusData] = useState([]);

    useEffect(() => {
        GetJobStatus();
      }, []);
    
      const GetJobStatus = async () => {
        const data = { req: {}, authToken: token };
        await dispatch(JobStatusReport(data))
          .unwrap()
          .then((res) => {
            if (res.status) {
              setJobStatusData(res.data);
            }
            else {
                setJobStatusData([]);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

  
  const columns = [
    { name: 'Job Id', selector: row => row.job_code_id, sortable: true },
    { name: 'Customer Name', selector: row => row.customer_trading_name, sortable: true },
    { name: 'Account Manager', selector: row => row.account_manager_name, sortable: true },
    { name: 'Clients', selector: row => row.client_trading_name, sortable: true },
    { name: 'Service Type', selector: row => row.service_name, sortable: true },
    { name: 'Job Type', selector: row => row.job_type_name, sortable: true },
    { name: 'Status', selector: row => row.status, sortable: true },
    { name: 'Allocated To', selector: row => row.allocated_name, sortable: true },
    { name: 'Received On', selector: row => row.reviewer_name, sortable: true },
    { name: 'Companies House Due Date', selector: row => row.filing_Companies_date, sortable: true },
    { name: 'Internal Deadline', selector: row => row.internal_deadline_date, sortable: true },
    { name: 'Customer Deadline', selector: row => row.customer_deadline_date, sortable: true },
    { name: 'Initial Query Sent Date', selector: row => row.query_sent_date, sortable: true },
    { name: 'Final Query Response Received Date', selector: row => row.final_query_response_received_date, sortable: true },
    { name: 'First Draft Sent', selector: row => row.draft_sent_on, sortable: true },
    { name: 'Final Draft Sent', selector: row => row.final_draft_sent_on, sortable: true },
  ]

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7'>
                <div className='tab-title'>
                  <h3>Job Status Report</h3>
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
                columns={columns} data={JobStatusData && JobStatusData} />
            </div>
          </div>
    </div>
  )
}

export default JobStatus