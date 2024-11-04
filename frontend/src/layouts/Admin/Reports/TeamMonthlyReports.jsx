import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import {teamMonthlyReports} from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';

const TeamMonthlyReport = () => {
    const dispatch = useDispatch();
    const token = JSON.parse(localStorage.getItem("token"));
    const [getMonthlyReport, setMonthlyReport] = useState([]);


    console.log(getMonthlyReport);
    useEffect(() => {
        MonthlyReport();
      }, []);
    
      const MonthlyReport = async () => {
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
          })
          .catch((err) => {
            console.log(err);
          });
      }

  
  const columns = [
    { name: 'Staff Name', selector: row => row.staff_name, sortable: true },
    { name: 'No.Of Jobs Completed', selector: row => row.number_of_job_completed, sortable: true },
   
  ]

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7'>
                <div className='tab-title'>
                  <h3>Team Performance Report by Month</h3>
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
                columns={columns} data={getMonthlyReport && getMonthlyReport} />
            </div>
          </div>
    </div>
  )
}

export default TeamMonthlyReport