import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { Jobs } from '../../../ReduxStore/Slice/Report/ReportSlice'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const JobStatus = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [jobsData, setJobsData] = useState([]);


  useEffect(() => {
    GetJobs();
  }, []);


  const GetJobs = async () => {
    const data = { req: { job_ids: location?.state?.job_ids }, authToken: token };
    await dispatch(Jobs(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setJobsData(res.data);
        }
        else {
          setJobsData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const HandleJobView = (row) => {
    navigate("/admin/job/logs", { state: { job_id: row.job_id, timesheet_job_id:row.timesheet_job_id,goto: "report", } });
  }

  const columns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div title={row.job_code_id}>
          <a
            onClick={() => HandleJobView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
      reorder: false,
    },

    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name || "-"}>
          
            {row.job_type_name || "-"}
         
        </div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
      reorder: false,
    },
    
    {
      name: "Client Contact Person",
      cell: (row) => (
        <div title={ row.account_manager_officer_first_name +
          " " +
          row.account_manager_officer_last_name || "-"}>
         
            { row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name || "-"}
         
        </div>
      ),
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Client Job Code",
      selector: (row) => row.client_job_code || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Outbook Account Manager",
      cell: (row) => (
        <div title={row.outbooks_acount_manager_first_name +
          " " +
          row.outbooks_acount_manager_last_name || "-"}>
          
            {row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name || "-"}
          
        </div>
      ),
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Allocated To",
      cell: (row) => (
        <div title={ row.allocated_name == null ? "-" : row.allocated_name}>
         
            { row.allocated_name == null ? "-" : row.allocated_name}
         
        </div>
      ),
      selector: (row) =>
      row.allocated_name == null ? "-" : row.allocated_name,
      sortable: true,
      reorder: false,
    },
    {
      name: "Timesheet",
      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null ?
          row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
          : "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
      reorder: false,
    },

  ];
  
  return (
    <div className='container-fluid '>

      <div className='content-title mt-4'>
       <div className='row'>
              <div className='tab-title d-flex'>

              <button
                  type="button"
                  className="btn p-0"
                  onClick={() => {
                    window.history.back();
                  }}
                >
                  <i className="pe-3 fa-regular fa-arrow-left-long  fs-4"></i>
                </button>
                <h3 className='mt-0'>Job</h3>
              </div>
            
            </div>
            </div>
      <div className='report-data mt-4'>
        <div className='row'>
          <div className='col-md-12 mb-5'>
           
            {/* <div className='job-filter-btn '>
              <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal ms-2'><i className="fas fa-file-excel"></i></button>
            </div> */}
          </div>
        </div>
        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={columns} data={jobsData && jobsData} />
        </div>
      </div>
    </div>
  )
}

export default JobStatus