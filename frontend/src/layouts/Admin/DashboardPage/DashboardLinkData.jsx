import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import { linkedData } from '../../../ReduxStore/Slice/Dashboard/DashboardSlice'
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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


  const HandleJobView = (row) => {
    navigate("/admin/job/logs", { state: { job_id: row.job_id, goto: "report", } });
  }


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
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Client Name",

      selector: (row) => row.client_trading_name || "-",
      sortable: true,
    },
    {
      name: "Job Type",

      selector: (row) => row.job_type_name || "-",
      sortable: true,
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

  const columnsCustomer = [
   
    {
      name: "Trading Name",
      cell: (row) => (
        <div title={row.trading_name}  >
          {row.trading_name}
        </div>
      ),
      sortable: true,

    },
    {
      name: "Customer Code",
      cell: (row) => (
        <div title={row.customer_code}  >
          {row.customer_code}
        </div>
      ),
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
      name: "Account Manager",
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
      selector: (row) => row.client_name || "-",
      sortable: true,
    },

    {
      name: "Client Code",
      selector: (row) => row.client_code || "-",
      sortable: true,
    },
    {
      name: "Client Type",
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
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
      // width: "250px",
    },
    {
      name: "Phone",
      selector: (row) => row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - ",
      sortable: true,
      // width: "250px",
    },
    {
      name: "Role",
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
            {row.status === "1" ? "Active" : "Deactive"}
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
            <div className='row' >
              <div className='d-flex justify-content-between mb-5'>
                <div className='tab-title'>
                  <h3>{location?.state?.req?.heading}</h3>
                </div>
                <div className="btn btn-info text-white float-end blue-btn"
                  onClick={() => { window.history.back() }}
                >
                  <i className="fa fa-arrow-left pe-1" /> Back
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