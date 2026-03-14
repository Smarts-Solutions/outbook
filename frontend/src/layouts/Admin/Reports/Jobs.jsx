import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { Jobs } from "../../../ReduxStore/Slice/Report/ReportSlice";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { Update_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";

const JobStatus = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [jobsData, setJobsData] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [loading, setLoading] = useState(false);

  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
    client: 0,
    job: 0,
    all_customers: 0,
    all_clients: 0,
    all_jobs: 0,
    staff: 0,
  });

  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer",
    )?.items || [];

  const accessData1 =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client",
    )?.items || [];

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job",
    )?.items || [];

  const accessDataAllCustomer =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_customers",
    )?.items || [];

  const accessDataAllJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_jobs",
    )?.items || [];

  const accessDataClients =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_clients",
    )?.items || [];

  const accessDataStaff =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "staff",
    )?.items || [];

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = {
      insert: 0,
      update: 0,
      delete: 0,
      view: 0,
      client: 0,
      job: 0,
      all_customers: 0,
      all_clients: 0,
      all_jobs: 0,
      staff: 0,
    };
    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    accessData1.forEach((item) => {
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });

    accessDataJob.forEach((item) => {
      if (item.type === "view") updatedAccess.job = item.is_assigned;
    });

    accessDataAllCustomer.forEach((item) => {
      if (item.type === "view") updatedAccess.all_customers = item.is_assigned;
    });
    accessDataAllJob.forEach((item) => {
      if (item.type === "view") updatedAccess.all_jobs = item.is_assigned;
    });
    accessDataClients.forEach((item) => {
      if (item.type === "view") updatedAccess.all_clients = item.is_assigned;
    });
    accessDataStaff.forEach((item) => {
      if (item.type === "view") updatedAccess.staff = item.is_assigned;
    });

    setAccessData(updatedAccess);
  }, []);

  console.log("getAccessData", getAccessData);

  useEffect(() => {
    GetJobs();
    GetStatus();
  }, []);

  const GetStatus = async () => {
    setLoading(true);
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const GetJobs = async () => {
    const data = {
      req: { job_ids: location?.state?.job_ids },
      authToken: token,
    };
    await dispatch(Jobs(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setJobsData(res.data);
        } else {
          setJobsData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const HandleJobView = (row) => {
    navigate("/admin/job/logs", {
      state: {
        job_id: row.job_id,
        timesheet_job_id: row.timesheet_job_id,
        goto: "report",
      },
    });
  };

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
      name: "Job Priority",
      cell: (row) => {
        const v = row.job_priority || "-";
        const cap = v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
        return <div title={cap}>{cap}</div>;
      },
      selector: (row) => {
        if (!row.job_priority) return "-";
        return (
          row.job_priority.charAt(0).toUpperCase() +
          row.job_priority.slice(1).toLowerCase()
        );
      },
      sortable: true,
    },
    {
      name: "Client Name",
      cell: (row) => (
        <div title={row.client_trading_name || "-"}>
          {row.client_trading_name || "-"}
        </div>
      ),
      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name || "-"}>{row.job_type_name || "-"}</div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Status",
      selector: (row) => {
        const status = statusDataAll.find(
          (s) => Number(s.id) === Number(row.status_type),
        );
        return status ? status.name.toLowerCase() : "-";
      },
      sortable: true,
      cell: (row) => (
        <div>
          <select
            className="form-select form-control"
            value={row.status_type}
            onChange={(e) => handleStatusChange(e, row)}
            disabled={!(getAccessData.update === 1 || role === "SUPERADMIN")}
          >
            {statusDataAll.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
      ),
      width: "325px",
    },

    {
      name: "Client Contact Person",
      cell: (row) => (
        <div
          title={
            row.account_manager_officer_first_name +
              " " +
              row.account_manager_officer_last_name || "-"
          }
        >
          {row.account_manager_officer_first_name +
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
        <div
          title={
            row.outbooks_acount_manager_first_name +
              " " +
              row.outbooks_acount_manager_last_name || "-"
          }
        >
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
        <div title={row.allocated_name == null ? "-" : row.allocated_name}>
          {row.allocated_name == null ? "-" : row.allocated_name}
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
        row.total_hours_status == "1" && row.total_hours != null
          ? row.total_hours.split(":")[0] +
            "h " +
            row.total_hours.split(":")[1] +
            "m"
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
    {
      name: "Created By",
      cell: (row) => (
        <div title={row.job_created_by || "-"}>{row.job_created_by || "-"}</div>
      ),
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },

    {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>{row.created_at || "-"}</div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
  ];

  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { job_id: row.job_id, status_type: Number(Id) };
          const res = await dispatch(
            Update_Status({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetJobs();
          } else if (res.data === "W") {
            Swal.fire({
              title: "Warning",
              text: res.message,
              icon: "warning",
              confirmButtonText: "Ok",
              timer: 3000,
              timerProgressBar: true,
            });
          } else {
            Swal.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
            timerProgressBar: true,
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Status change was not performed",
          icon: "error",
          confirmButtonText: "Ok",
          timer: 1000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="container-fluid ">
      <div className="content-title mt-4">
        <div className="row">
          <div className="tab-title d-flex">
            <button
              type="button"
              className="btn p-0"
              onClick={() => {
                window.history.back();
              }}
            >
              <i className="pe-3 fa-regular fa-arrow-left-long  fs-4"></i>
            </button>
            <h3 className="mt-0">Job</h3>
          </div>
        </div>
      </div>
      <div className="report-data mt-4">
        <div className="row">
          <div className="col-md-12 mb-5">
            {/* <div className='job-filter-btn '>
              <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
              <button className='xl-sheet btn btn-info text-white fw-normal ms-2'><i className="fas fa-file-excel"></i></button>
            </div> */}
          </div>
        </div>
        <div className="datatable-wrapper mt-minus">
          <Datatable
            filter={true}
            columns={columns}
            data={jobsData && jobsData}
          />
        </div>
      </div>
    </div>
  );
};

export default JobStatus;
