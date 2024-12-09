import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { jobPendingReports } from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const JobPendingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const handleOnClick = (row) => {
    navigate('/admin/report/jobs', { state: { job_ids: row?.job_ids } });
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
    },

    // {
    //   name: 'Number of Job',
    //   selector: row => row.number_of_job,
    //   sortable: true
    // },


  ]

  return (
    <div>
      <div className='report-data'>
        <div className='row'>
          <div className='col-md-7'>
            <div className='tab-title mb-5'>
              <h3>Job Pending Report</h3>
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