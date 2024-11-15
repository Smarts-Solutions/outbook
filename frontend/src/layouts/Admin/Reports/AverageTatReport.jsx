import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { averageTatReport } from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AverageTatReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const [getAverageTatReport, setAverageTatReport] = useState([]);


  useEffect(() => {
    AvgTatReport();
  }, []);

  const AvgTatReport = async () => {
    const data = { req: {}, authToken: token };
    await dispatch(averageTatReport(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setAverageTatReport(res.data);
        }
        else {
          setAverageTatReport([]);
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
      sortable: true
    },
    {
      name: 'Job Type Name',
      selector: row => row.job_type_name,
      sortable: true
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
      sortable: true,
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
              <h3>Average TAT Report</h3>
            </div>
           
          </div>
        </div>
        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns} data={getAverageTatReport && getAverageTatReport} />
        </div>
      </div>
    </div>
  )
}

export default AverageTatReport