import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { GET_ALL_CUSTOMERS } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { Update_Customer_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getDateRange } from "../../../Utils/Comman_function";
import Swal from "sweetalert2";

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [customerData, setCustomerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("this-year");
  const role = JSON.parse(localStorage.getItem("role"));

  const [searchTerm, setSearchTerm] = useState("");
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
    GetAllCustomerData();
  }, [activeTab]);

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


  const columns = [
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
          {( role === "SUPERADMIN") && row.status == 1 ? (
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
      selector: (row) => row.customer_code,
      cell: (row) => (
        <div
          title={row.customer_code}
        >
          {row.customer_code}
        </div>
      ),
      sortable: true,

    },
    // {
    //   name: "Company Name",
    //   cell: (row) => (
    //     <div
    //       style={{
    //         overflow: "hidden",
    //         textOverflow: "ellipsis",
    //         whiteSpace: "nowrap",
    //         maxWidth: "200px",
    //       }}
    //     >
    //       <a title={row.company_name}>{row.company_name}</a>
    //     </div>
    //   ),
    //   sortable: true,
    //   width: "250px",
    // },
    // {
    //   name: "Company Number",
    //   selector: (row) => (row.company_number == null ? "" : row.company_number),
    //   sortable: true,
    //   width: "200px",
    // },
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
    {
      name: "Status",
      selector: (row) => row.form_process,
      cell: (row) => (
        <div>
          <div>
            {row.form_process === "4" ?
              <select
                className="form-select form-control"
                value={row.status}
                onChange={(e) => handleChangeStatus(e, row)}
              >
                <option value="0" className="text-danger">Deactive</option>
                <option value="1" className="text-success">Active</option>
              </select>
              : (
                <span className="text-warning">Inprogress</span>
              )}


          </div>
        </div>
      ),
      sortable: true,

    },

    // {
    //   name: "Progress",
    //   cell: (row) => (
    //     <div>
    //       {row.form_process === "4" ? (
    //         <span className="text-success">Complete</span>
    //       ) : (
    //         <span className="text-danger">Pending</span>
    //       )}
    //     </div>
    //   ),
    //   sortable: true,
    //   width: "120px",
    // },
    {
      name: "Actions",
      cell: (row) => {
        const hasUpdateAccess = getAccessData.update === 1;
        const hasDeleteAccess = getAccessData.delete === 1;
        return (
          <div style={{ textAlign: "center" }}>
            {( role === "SUPERADMIN") && row.status == 1 ? (
              <>
                <button className="edit-icon rounded-pills border-primary" onClick={() => handleEdit(row)}>
                  <i className="ti-pencil text-primary" />
                </button>
                {/* <button
                  className="delete-icon "
                  onClick={() => handleDelete(row)}
                >
                  <i className="ti-trash text-danger " />
                </button> */}
              </>
            ) : (
              <>
                {hasUpdateAccess && row.status == 1 && (
                  <button className="edit-icon " onClick={() => handleEdit(row)}>
                    <i className="ti-pencil text-primary" />
                  </button>
                )}
                {/* {hasDeleteAccess && row.status==1 &&  (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row)}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                )} */}
              </>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,

    },
  ];

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
            GetAllCustomerData();
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

  const [selectedTab, setSelectedTab] = useState('this-year');

  const tabs = [
    { id: 'this-week', label: 'This Week' },
    { id: 'last-week', label: 'Last Week' },
    { id: 'this-month', label: 'This Month' },
    { id: 'last-month', label: 'Last Month' },
    { id: 'last-quarter', label: 'Last Quarter' },
    { id: 'this-6-months', label: 'This 6 Months' },
    { id: 'last-6-months', label: 'Last 6 Months' },
    { id: 'this-year', label: 'This Year' },
    { id: 'last-year', label: 'Last Year' },
    { id: 'custom', label: 'Custom' }
  ];

  useEffect(() => {
    GetAllCustomerData();
  }, []);

  useEffect(() => {
    GetAllCustomerData();
  }, [selectedTab]);

  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const GetAllCustomerData = async () => {
    const req = { action: 'get', staff_id: staffDetails.id };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(GET_ALL_CUSTOMERS(data)).unwrap();

      if (response.status) {
        const filteredData = response.data.filter((item) => {
          const itemDate = new Date(item.created_at);
          const { startDate, endDate } = getDateRange(selectedTab);
          return itemDate >= startDate && itemDate <= endDate;
        });

        setFilteredData(filteredData);
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };


  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    const filtered = customerData.filter((item) => {
      return (
        item.trading_name?.toLowerCase().includes(searchValue) ||
        item.customer_code?.toLowerCase().includes(searchValue) ||
        item.company_name?.toLowerCase().includes(searchValue) ||
        item.company_number?.toLowerCase().includes(searchValue) ||
        (item.account_manager_firstname + " " + item.account_manager_lastname)
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
    setFilteredData(filtered);
  };

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

  const handleEdit = (row) => {
    navigate("/admin/editcustomer", { state: row });
  };

  return (
    <div className="container-fluid">
      <div className="content-title">
        <div className="row">
          <div className="col-md-8">
            <div className="tab-title">
              <h3 className="mt-0">Customers</h3>
            </div>
          </div>
          { role === "SUPERADMIN" ? (
            <div className="col-md-4">
              <Link
                to="/admin/addcustomer"
                className="btn btn-outline-info  fw-bold float-end border-3"
              >
                <i className="fa fa-plus" /> Add Customer
              </Link>
            </div>
          ) : (
            getAccessData.insert === 1 && (
              <div className="col-md-4">
                <Link
                  to="/admin/addcustomer"
                  className="btn btn-outline-info fw-bold float-end border-3"
                >
                  <i className="fa fa-plus" /> Add Customer
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="col-sm-12">
          <div className="page-title-box pt-0">
            <div className="row align-items-start justify-content-end">
              <div className="col-4">
                <div className="form-group mb-2 mt-1 pe-3 pt-5">
                 
                </div>
              </div>

              <div className="col-12">


                {/* Tab content */}
                <div className="tab-content mt-minus-60" id="pills-tabContent">
                  <div className="card-datatable">
                    <div className="card-datatable">
                      <Datatable columns={columns} data={filteredData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;
