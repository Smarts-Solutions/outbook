import React, { useState, useEffect, useRef } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTaskByStaff } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Select from 'react-select';
import { Modal } from "react-bootstrap";


const CapacityReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [capacityReportData, setCapacityReportData] = useState([]);


  useEffect(() => {
    Capacity();
  }, []);




  const Capacity = async () => {
    const req = { action: "capacityReport" };
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          console.log("Capacity Data:", res);
          setCapacityReportData(res.data);
        }
        else {
          setCapacityReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const columns = [
    // {
    //   name: 'Staff Name',
    //   selector: row => row.staff_fullname,
    //   sortable: true
    // },

    // {
    //   name: 'Role',
    //   selector: row => row.role_name,
    //   sortable: true
    // },


    // {
    //   name: 'Job Name',
    //   selector: row => row.job_code_id, sortable: true
    // },

   

  ]



  return (
    <div>
      <div className='report-data'>
        <div className='row'>
          <div className='col-md-7 mb-5'>
            <div className='tab-title'>
              <h3>Capacity Report</h3>
            </div>
          </div>
        </div>

        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns}
            data={capacityReportData && capacityReportData} />
        </div>
      </div>



    </div>
  )
}

export default CapacityReport