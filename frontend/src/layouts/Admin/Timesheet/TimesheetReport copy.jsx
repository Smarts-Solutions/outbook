import React, { useState, useEffect } from 'react';
import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';
import { useDispatch, useSelector } from "react-redux";
// import TimesheetReport from './TimesheetReport';
// import JobStatusReport from './JobStatusPeport';
// import JobSummaryReport from './JobSummaryReport';
// import TeamMonthlyReport from './TeamMonthlyReports';
// import JobPendingReport from './JobPendingReports';
// import JobsReceivedSentReports from './JobsReceivedSentReports';
// import DueByReport from './DueByReport';
// import TextWeelyReport from './TextWeelyReport';
// import AverageTatReport from './AverageTatReport';


import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
 

function TimesheetReport() {
 
  const [filter, setFilter] = useState(false);
  const getActiveTab = sessionStorage.getItem('activeReport');
  const [activeTab, setActiveTab] = useState(getActiveTab || "jobStatusReport");

  const handleTabClick = (tabValue) => {
    sessionStorage.setItem('activeReport', tabValue);
    setActiveTab(tabValue);
  };


//   const getTabContent = () => {
//     switch (activeTab) {
//       case 'jobStatusReport':
//         return <JobStatusReport />
//       case 'jobsReceivedSentReports':
//         return <JobsReceivedSentReports />;
//       case 'jobSummaryReport':
//         return <JobSummaryReport />
//       case 'jobsPendingReport':
//         return <JobPendingReport />;
//       case 'dueByReport':
//         return <DueByReport />;
//       case 'teamPerformanceReport':
//         return <TeamMonthlyReport />;
//       case 'timesheetReport':
//         return <TimesheetReport />
//       case 'averageTATReport':
//         return <AverageTatReport />;
//       case 'taxWeeklyStatusReport':
//         return <TextWeelyReport />;
//       default:
//         return null;
//     }
//   };
const dispatch = useDispatch(); 
const token = JSON.parse(localStorage.getItem("token"));
const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
const [selectedStaff, setSelectedStaff] = useState({});

 const staffData = async () => {
    await dispatch(Staff({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          console.log("response.data ", response.data);
          setStaffDataAll({ loading: false, data: response.data });
        } else {
          setStaffDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    staffData();
  }, []);

  const handleSelectStaff = (e) => {
    let {name, value} = e.target;
    let staff = staffDataAll.data.find(staff => staff.id === parseInt(value));
    setSelectedStaff(staff);
  }


  console.log("selectStaff ", selectedStaff);


  return (
    <div className='container-fluid'>
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row">
              <div>
                <h5 className="mb-4" style={{ fontWeight: 600 }}>Timesheet Reports</h5>
              </div>
              <div className="col-lg-4 col-md-6 ">
                <>
                 <label htmlFor="tabSelect" className="form-label">Select Staff</label>
                  <select className="form-select" id="tabSelect" name='staff'
                  // value={activeTab}
                   onChange={(e)=>handleSelectStaff(e)}
                   > 
                    <option value="">---Select Staff---</option>
                    {staffDataAll &&  staffDataAll.data.map((staff, index) => (
                      <option key={index} value={staff.id}>
                        {staff.first_name} {staff.last_name}
                      </option>
                    ))}
                  </select>
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        {/* {getTabContent()} */}
      </div>
      <CommanModal
        isOpen={filter}
        backdrop="static"
        size="ms-5"
        title="Task"
        cancel_btn="cancel"
        hideBtn={false}
        btn_name="Save"
        handleClose={() => setFilter(false)}
      >
        {/* Modal content here */}
      </CommanModal>
    </div>
  );
}

export default TimesheetReport;
