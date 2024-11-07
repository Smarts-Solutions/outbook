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
        navigate("/admin/job/logs", { state: { job_id: row.job_id, goto: "report", } });
    }

    const columns = [
        {
          name: "Job ID (CustName+ClientName+UniqueNo)",
          cell: (row) => (
            <div>
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
        },
    
        {
          name: "Job Type",
    
          selector: (row) => row.job_type_name || "-",
          sortable: true,
        },
        {
          name: "Status",
          cell: (row) => (
            <div>
              <div>
                <select
                  className="form-select form-control"
                  value={row.status_type}
                > 
                </select>
              </div>
            </div>
          ),
          sortable: true,
          width: "325px"
        },
        {
          name: "Account Manager",
          selector: (row) =>
            row.account_manager_officer_first_name +
            " " +
            row.account_manager_officer_last_name || "-",
          sortable: true,
        },
        {
          name: "Client Job Code",
          selector: (row) => row.client_job_code || "-",
          sortable: true,
        },
        {
          name: "Outbook Account Manager",
          selector: (row) =>
            row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name || "-",
          sortable: true,
        },
        {
          name: "Allocated To",
          selector: (row) =>
            row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name,
          sortable: true,
        },
        {
          name: "Timesheet",
          selector: (row) =>
            row.total_hours_status == "1" && row.total_hours != null ?
              row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
              : "-",
          sortable: true,
        },
        {
          name: "Invoicing",
          selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
          sortable: true,
        },
         
      ];

   

    return (
        <div>
            <div className='report-data'>
                <div className='row'>
                    <div className='col-md-7'>
                        <div className='tab-title'>
                            <h3>Job</h3>
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
                        columns={columns} data={jobsData && jobsData} />
                </div>
            </div>
        </div>
    )
}

export default JobStatus