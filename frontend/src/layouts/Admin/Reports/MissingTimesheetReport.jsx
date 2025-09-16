import React, { useState, useEffect, useRef } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTaskByStaff } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Select from 'react-select';


const MissingTimesheet = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [missingTimesheetReportData, setMissingTimesheetReportData] = useState([]);

  useEffect(() => {
    MissingTimesheet();
  }, []);

   
  const MissingTimesheet = async () => {
    const req = { action: "missingTimesheetReport"};
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          //console.log("MissingTimesheet Data:", res);
          setMissingTimesheetReportData(res.data.result);
        }
        else {
          setMissingTimesheetReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const columns = [
    { name: 'Staff Name', selector: row => row.staff_fullname, sortable: true, width: '50%' },

    { name: 'Staff Email', selector: row => row.staff_email, sortable: true, width: '50%' },
  ]



  return (
    <div>
      <div className='report-data'>
        <div className='row mb-5'>
          <div className='col-md-7 '>
            <div className='tab-title'>
              <h3>Missing Timesheet Report</h3>
            </div>
          </div>
        </div>

        <div className='datatable-wrapper mt-minus'>
          <div className='row'>
          </div>
          <Datatable
            filter={false}
            columns={columns}
            data={missingTimesheetReportData && missingTimesheetReportData} />
        </div>




      </div>
    </div>
  )
}

export default MissingTimesheet