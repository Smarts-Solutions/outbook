import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { linkedData } from '../../../ReduxStore/Slice/Dashboard/DashboardSlice'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Update_Customer_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';
const JobStatus = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [allLinkedData, setAllLinkedData] = useState([]);


  useEffect(() => {
    GetLinkedData();
  }, []);

  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    client: 0,
  });

  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer"
    )?.items || [];

  const accessData1 =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client"
    )?.items || [];

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, client: 0 };
    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
    });
    accessData1.forEach((item) => {
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });

    setAccessData(updatedAccess);
  }, []);

  const GetLinkedData = async () => {
    const data = {
      req: {
        staff_id: location?.state?.req?.staff_id,
        key: location?.state?.req?.key,
        ids: location?.state?.req?.ids
      }, authToken: token
    };
    await dispatch(linkedData(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setAllLinkedData(res.data);
        }
        else {
          setAllLinkedData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const HandleClientView = (row) => {
    if (row.form_process == "4") {
      navigate("/admin/Clientlist", { state: row });
    } else {
      Swal.fire({
        title: "Form not completed",
        text: "Please complete the form",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };


  const handleChangeStatus = async (e, row) => {
    const newStatus = e.target.value;

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
          const req = { customer_id: row.id, status: newStatus };
          const res = await dispatch(Update_Customer_Status({ req, authToken: token })).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetLinkedData();
          } else {
            Swal.fire({
              title: "Error",
              text: res.message,
              icon: "error",
              confirmButtonText: "Ok",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: "An error occurred while updating the status.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Status change was not performed",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });
  };

  const JobColumns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div>
          {/* <a
            onClick={() => HandleJobView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          > */}
          {row.job_code_id}
          {/* </a> */}
        </div>
      ),
      selector: (row) => row.job_code_id,
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
        <div title={row.job_type_name || "-"}>
          {row.job_type_name || "-"}
        </div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
    },
    {
      name: "Client Contact Person",
      cell: (row) => (
        <div title={row.account_manager_officer_first_name +
          " " +
          row.account_manager_officer_last_name || "-"}>
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
    },
    {
      name: "Client Job Code",
      cell: (row) => (
        <div title={row.client_job_code || "-"}>
          {row.client_job_code || "-"}
        </div>
      ),
      selector: (row) => row.client_job_code || "-",
      sortable: true,
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
    },
    {
      name: "Allocated To",
      cell: (row) => (
        <div title={row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name}>
          {row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name}
        </div>
      ),

      selector: (row) =>
        row.allocated_first_name == null ? "-" : row.allocated_first_name + " " + row.allocated_last_name == null ? "-" : row.allocated_last_name,
      sortable: true,
    },
    {
      name: "Timesheet",
      cell: (row) => (
        <div title={row.total_hours_status == "1" && row.total_hours != null ?
          row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
          : "-"}>
          {row.total_hours_status == "1" && row.total_hours != null ?
            row.total_hours.split(":")[0] + "h " + row.total_hours.split(":")[1] + "m"
            : "-"}
        </div>
      ),

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

  const columnsCustomer = [
    {
      name: "Trading Name",
      cell: (row) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {(role === "ADMIN" || role === "SUPERADMIN") && row.status == 1 ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a>
          ) : (
            getAccessData.client == 1 && row.status == 1 ? <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a> : row.trading_name
          )}
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,

    },
    {
      name: "Customer Code",
      cell: (row) => (
        <div title={row.customer_code}  >
          {row.customer_code}
        </div>
      ),
      selector: (row) => row.customer_code,
      sortable: true,

    },

    {
      name: "Type",
      selector: (row) =>
        row.customer_type === '1'
          ? "Sole Trader"
          : row.customer_type === '2'
            ? "Company"
            : row.customer_type === '3'
              ? "Partnership"
              : "-",
      sortable: true,

    },
    {
      name: "Client Contact Person",
      selector: (row) => row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
      cell: row => (
        <div
          title={row.account_manager_firstname + " " + row.account_manager_lastname}
          className="data-table-cell"
          data-fulltext={row.account_manager_firstname + " " + row.account_manager_lastname}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {row.account_manager_firstname + " " + row.account_manager_lastname}
        </div>
      ),
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <div>
            {row.form_process === "4" ?
              <select
                className="form-select form-control"
                value={row.status}
                onChange={(e) => handleChangeStatus(e, row)}
              >
                <option value="0" className="text-danger">Inactive</option>
                <option value="1" className="text-success">Active</option>
              </select>
              : (
                <span className="text-warning">Inprogress</span>
              )}
          </div>
        </div>
      ),
      selector: (row) => row.status=="1" ? 1 : 0,
      sortable: true,
    },
  ];

  const ClientListColumns = [
    // {
    //   name: "Client Name",
    //   cell: (row) => (
    //     <div>
    //       {
    //         role === "ADMIN" || role === "SUPERADMIN" ? (
    //           <a
    //             // onClick={() => HandleClientView(row)}
    //             style={{ cursor: "pointer", color: "#26bdf0" }}
    //           >
    //             {row.client_name}
    //           </a>
    //         ) : row.client_name
    //       }

    //     </div>
    //   ),
    //   selector: (row) => row.trading_name,
    //   sortable: true,
    // },
    {
      name: "Client Name",
      cell: (row) => (
        <div title={row.client_name || "-"}>
          {row.client_name || "-"}
        </div>
      ),
      selector: (row) => row.client_name || "-",
      sortable: true,
    },

    {
      name: "Client Code",
      cell: (row) => (
        <div title={row.client_code || "-"}>
          {row.client_code || "-"}
        </div>
      ),
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Client Type",
      cell: (row) => (
        <div title={row.client_type_name == null ? "-" : row.client_type_name}>
          {row.client_type_name == null ? "-" : row.client_type_name}
        </div>
      ),
      selector: (row) =>
        row.client_type_name == null ? "-" : row.client_type_name,
      sortable: true,
      width: "150px",
    },
    {
      name: "Status",

      selector: (row) => (<div>
        <span
          className={` ${row.status === "1" ? "text-success" : "text-danger"
            }`}
        >
          {row.status === "1" ? "Active" : "Deactive"}
        </span>
      </div>),
      sortable: true,
      width: '130px'
    },

  ];

  const columnsStaff = [
    {
      name: "Full Name",
      cell: (row) => (
        <div title={row.first_name + " " + row.last_name}>
          {row.first_name + " " + row.last_name}
        </div>
      ),
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Email Address",
      cell: (row) => (
        <div title={row.email}>
          {row.email}
        </div>
      ),
      selector: (row) => row.email,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Phone",
      cell: (row) => (
        <div title={row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - "}>
          {row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - "}
        </div>
      ),
      selector: (row) => row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - ",
      sortable: true,
      // width: "250px",
    },
    {
      name: "Role",
      cell: (row) => (
        <div title={row.role_name}>
          {row.role_name}
        </div>
      ),
      selector: (row) => row.role_name,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      // width: "250px",
    },


  ]

  return (
    <div>
      <div className='report-data mt-5'>
        <div className='row '>
          <div className='col-md-12'>
            <div className='' >
              <div className=' row mb-5'>
                <div className='tab-title col-lg-6 '>
                  <h3>{location?.state?.req?.heading}</h3>
                </div>
                <div className='col-lg-6  d-flex justify-content-end'>
                  <div className="btn btn-info text-white blue-btn"
                    onClick={() => { window.history.back() }}
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </div>
                  {(role === "ADMIN" || role === "SUPERADMIN" || getAccessData.insert === 1) && location?.state?.req?.heading == "Customers" ? (
                    <div className="ms-2">
                      <Link
                        to="/admin/addcustomer"
                        className="btn btn-outline-info  fw-bold float-end border-3"
                      >
                        <i className="fa fa-plus" /> Add Customer
                      </Link>
                    </div>
                  ) : (
                    ""
                  )

                  }
                </div>

              </div>
            </div>


          </div>
        </div>
        <div className='datatable-wrapper mt-minus'>
          <Datatable
            filter={true}
            columns={location?.state?.req?.key == "client" ? ClientListColumns :
              location?.state?.req?.key == "customer" ? columnsCustomer :
                location?.state?.req?.key == "staff" ? columnsStaff :
                  JobColumns
            } data={allLinkedData && allLinkedData} />
        </div>
      </div>
    </div>
  )
}

export default JobStatus