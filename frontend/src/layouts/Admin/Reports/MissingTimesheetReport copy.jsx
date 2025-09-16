import React, { useState, useEffect, useRef } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTaskByStaff } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Select from 'react-select';


const MissingTimesheet = () => {

  const getFormattedDate = (type, date) => {
    let now = new Date();
    if (type === "convert") {
      now = new Date(date);
    }

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are 0-indexed
    const week = Math.ceil(now.getDate() / 7); // Calculate week number of the month
    return `Week ${week}, Month ${month}, Year ${year}`;
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [missingTimesheetReportData, setMissingTimesheetReportData] = useState([]);
  const [staffDataWeekDataAll, setStaffDataWeekDataAll] = useState({
    loading: true,
    data: [],
  });

  const [hasValidWeekOffsetZero, setHasValidWeekOffsetZero] = useState(false);
  const weekOffSetValue = useRef(0);

  useEffect(() => {
    // MissingTimesheet("");
    MissingTimesheetCurrent("");
  }, []);

   
  const MissingTimesheetCurrent = async (filterStaffIds) => {
    const req = { action: "missingTimesheetReport" , filterStaffIds : filterStaffIds ,type: "filterDate" };
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          console.log("MissingTimesheet Data:", res.data);
          console.log("MissingTimesheet Data:", res);
          setMissingTimesheetReportData(res.data.result);
          setStaffDataWeekDataAll({
            loading: false,
            data: res.data.filterDataWeek
          });
        }
        else {
          setMissingTimesheetReportData([]);
          setStaffDataWeekDataAll({
            loading: false,
            data: []
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const MissingTimesheet = async (filterStaffIds) => {
    const req = { action: "missingTimesheetReport" , filterStaffIds : filterStaffIds };
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          console.log("MissingTimesheet Data:", res.data);
          console.log("MissingTimesheet Data:", res);
          setMissingTimesheetReportData(res.data.result);
          setStaffDataWeekDataAll({
            loading: false,
            data: res.data.filterDataWeek
          });
        }
        else {
          setMissingTimesheetReportData([]);
          setStaffDataWeekDataAll({
            loading: false,
            data: []
          });
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
    { name: 'Staff Name', selector: row => row.staff_fullname, sortable: true, width: '50%' },

    { name: 'Staff Email', selector: row => row.staff_email, sortable: true, width: '50%' },
  ]



  // SELECT OPTIONS FOR WEEK START //
  const weekOptions = [];
  if (staffDataWeekDataAll.data) {
    staffDataWeekDataAll.data.forEach((val) => {
      weekOptions.push({
        value: val.valid_weekOffsets,
        label: getFormattedDate("convert", val.month_date),
      });
    });
  }
 


  const selectFilterStaffANdWeek = async (e) => {
    const { name, value } = e.target;
    // console.log("Selected Week:", value);
    if(value != ""){
    // let filterStaffIds = staffDataWeekDataAll && staffDataWeekDataAll?.data?.filter((item) => item.valid_weekOffsets == value).map(i => i.staff_id);
    MissingTimesheet(value);
    }else{
    MissingTimesheet("");
    }

  };

  return (
    <div>
      <div className='report-data'>
        <div className='row mb-5'>
          <div className='col-md-7 '>
            <div className='tab-title'>
              <h3>Missing Timesheet Report</h3>
            </div>
          </div>
          <div className='col-md-5'>
              <div className='tab-title mt-2'>
                <label className='form-label'> <b>Weekly Staff Data</b></label>
                <Select
                  id="tabSelect"
                  name="week"
                  className="basic-multi-select"
                  // options={weekOptions}
                  options={[
                    { value: "", label: "Current Week " },
                    ...weekOptions,
                  ]}
                  defaultValue={{ value: "", label: "Current Week " }}
                  onChange={(selectedOption) => {
                    // simulate e.target.value
                    const e = { target: { name: 'week', value: selectedOption.value } };
                    selectFilterStaffANdWeek(e);
                  }}
                  classNamePrefix="react-select"
                  isSearchable
                />
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