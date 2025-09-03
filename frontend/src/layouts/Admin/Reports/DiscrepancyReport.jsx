import React, { useState, useEffect, useRef } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTaskByStaff } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Select from 'react-select';
import { Modal } from "react-bootstrap";


const DiscrepancyReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [discrepancyReportData, setDiscrepancyReportData] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);


  useEffect(() => {
    Discrepancy();
  }, []);




  const Discrepancy = async () => {
    const req = { action: "discrepancyReport" };
    const data = { req: req, authToken: token };
    await dispatch(getAllTaskByStaff(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          console.log("Discrepancy Data:", res);
          setDiscrepancyReportData(res.data);
        }
        else {
          setDiscrepancyReportData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }



  const convertTimeFormat = (value) => {
    let final_value = value;
    if (!value) return final_value;
    let [intPart, decimalPart] = value.toString().split(".");
    if (decimalPart) {
      let multiplied = Math.floor(parseInt(decimalPart) * 0.6);

      const multipliedStr = multiplied.toString().padStart(2, '0');
      final_value = `${intPart}:${multipliedStr}`;
    }
    return final_value;
  }

  function convertTimeFormatString(timeStr) {
    if (!timeStr) return "";
    // Expected format: "HH:MM"
    const [hours, minutes] = timeStr.split(":").map(Number);
    let result = "";
    if (hours > 0) result += `${hours} Hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) result += (result ? " " : "") + `${minutes} Minute${minutes > 1 ? "s" : ""}`;

    return result || "0 minutes";
  }


  const handleClickTimesheet = (row) => {
    console.log("Timesheet clicked:", row);
    setSelectedRow(row);
    setShowModal(true);
  }


  const columns = [
    {
      name: 'Staff Name',
      selector: row => row.staff_fullname,
      sortable: true
    },

    {
      name: 'Role',
      selector: row => row.role_name,
      sortable: true
    },

    {
      name: 'Timesheet Total Hours',
      // selector: row => (convertTimeFormatString(convertTimeFormat(row.timesheet_total_hours))),
      cell: (row) => (
        <span
          onClick={() => handleClickTimesheet(row)}
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
        >
          {convertTimeFormatString(convertTimeFormat(row.timesheet_total_hours))}
        </span>
      ),
      sortable: true
    },

    {
      name: 'Job Name',
      selector: row => row.job_code_id, sortable: true
    },

    {
      name: 'Job Total Hours',
      selector: row => convertTimeFormatString(row.job_budgeted_hours),
      sortable: true
    },

  ]



  return (
    <div>
      <div className='report-data'>
        <div className='row'>
          <div className='col-md-7 mb-5'>
            <div className='tab-title'>
              <h3>Discrepancy Report</h3>
            </div>
          </div>
        </div>

        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns}
            data={discrepancyReportData && discrepancyReportData} />
        </div>




      </div>


      {/* Modal */}
      <>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Timesheet Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRow && (
             
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Monday</td>
                    <td>{convertTimeFormatString(convertTimeFormat((selectedRow?.monday_hours)?.replace(":", "."))) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Tuesday</td>
                    <td>{convertTimeFormatString(convertTimeFormat((selectedRow?.tuesday_hours)?.replace(":", "."))) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Wednesday</td>
                    <td>{convertTimeFormatString(convertTimeFormat((selectedRow?.wednesday_hours)?.replace(":", "."))) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Thursday</td>
                    <td>{convertTimeFormatString(convertTimeFormat((selectedRow?.thursday_hours)?.replace(":", "."))) || '-'}</td>
                  </tr>
                  <tr>
                    <td>Friday</td>
                    <td>{convertTimeFormatString(convertTimeFormat((selectedRow?.friday_hours)?.replace(":", "."))) || '-'}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </Modal.Body>
        </Modal>
      </>




    </div>
  )
}

export default DiscrepancyReport