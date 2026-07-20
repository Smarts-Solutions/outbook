import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import {teamMonthlyReports} from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';
import ExportToExcel from '../../../Components/ExtraComponents/ExportToExcel';

const TeamMonthlyReport = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [getMonthlyReport, setMonthlyReport] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        MonthlyReport();
      }, []);
    
      const MonthlyReport = async () => {
        setLoading(true);
        const data = { req: {}, authToken: token };
        await dispatch(teamMonthlyReports(data))
          .unwrap()
          .then((res) => {
            if (res.status) {
              setMonthlyReport(res.data);
            }
            else {
                setMonthlyReport([]);
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }

  
  const columns = [
    { name: 'Staff Name', selector: row => row.staff_name, sortable: true },
    { name: 'No.Of Jobs Completed', selector: row => row.number_of_job_completed, sortable: true },
   
  ]

  const headers = [
    { label: 'Staff Name', key: 'staff_name' },
    { label: 'No.Of Jobs Completed', key: 'number_of_job_completed' },
  ];

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7 mb-5'>
                <div className='tab-title'>
                  <h3>Team Performance Report by Month</h3>
                </div>
              
              </div>
              <div className='col-md-5'>
                <ExportToExcel apiData={getMonthlyReport} fileName={'Team_Performance_Report'} headers={headers} />
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
                columns={columns} data={getMonthlyReport && getMonthlyReport} />
            </div>
          </div>
    </div>
  )
}

export default TeamMonthlyReport