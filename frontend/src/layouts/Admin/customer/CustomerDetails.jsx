import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { Update_Customer_Status, deleteCustomer, GET_ALL_CUSTOMERS, GET_CUSTOMER_DATA } from "../../../ReduxStore/Slice/Customer/CustomerSlice";

import { getAllCustomerUsers } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Formicform from "../../../Components/ExtraComponents/Forms/Comman.form";
import Validation_Message from "../../../Utils/Validation_Message";
import { useFormik } from "formik";


import Swal from "sweetalert2";
import sweatalert from "sweetalert2";
import ReactPaginate from "react-paginate";
import * as Yup from "yup";



import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';

const CustomerUsers = () => {

  const convertDate = (date) => {
    if ([null, undefined, ''].includes(date)) {
      return "-";
    }
    if (date) {
      let newDate = new Date(date);
      let day = newDate.getDate();
      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return "-";
  }

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);




  const [customerData, setCustomerData] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerList, setManagerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("this-year");
  const role = JSON.parse(localStorage.getItem("role"));
  const [filteredData1, setFilteredData1] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    client: 0,
    all_clients: 0,
  });


  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer"
    )?.items || [];

  const accessData1 =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client"
    )?.items || [];

  const accessDataAllClients =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_clients"
    )?.items || [];




  useEffect(() => {
    GetAllCustomerData(1, pageSize, '');
  }, [activeTab]);

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, client: 0, all_clients: 0 };
    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
    });
    accessData1.forEach((item) => {
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });

    accessDataAllClients.forEach((item) => {
      if (item.type === "view") updatedAccess.all_clients = item.is_assigned;
    });

    setAccessData(updatedAccess);
  }, []);


  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.first_name,
      cell: (row) => (
        <div
          title={row.first_name}
        >
          {row.first_name + " " + row.last_name}
        </div>
      ),
      sortable: true,

    },
    {
      name: "Email Address",
      cell: (row) => <div title={row.email}>{row.email}</div>,
      selector: (row) => row.email,
      sortable: true,
      idth: "300px",
      reorder: false,
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
      width: "150px",
      reorder: false,
    },
    {
      name: "Phone",
      cell: (row) => (
        <div
          title={
            row.phone && row.phone_code
              ? row.phone_code + "-" + row.phone
              : " - "
          }
        >
          {row.phone && row.phone_code
            ? row.phone_code + "-" + row.phone
            : " - "}
        </div>
      ),
      selector: (row) =>
        row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - ",
      sortable: true,
      width: "150px",
      reorder: false,
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      cell: (row) => (
        <div
          title={row.created_at}
        >
          {convertDate(row.created_at)}
        </div>
      ),
      sortable: true,

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
      width: "100px",
      reorder: false,
    },


    {
      name: "Actions      ",
      cell: (row) => {
        const hasUpdateAccess = getAccessData.update === 1;
        const hasDeleteAccess = getAccessData.delete === 1;
        return (
          <div className="w-100">
            {(role === "SUPERADMIN") && row.status == 1 ? (

              <>
                <div className="d-flex justify-content-start">
                  <button className="edit-icon rounded-pills border-primary" onClick={() => handleEdit(row)}>
                    <i className="ti-pencil text-primary" />
                  </button>

                  {/*view Icon Button*/}
                  <button className="view-icon rounded-pills border-primary" onClick={() => handleViewAllAccountManager(row)}>
                    <i className="ti-eye text-primary" />
                  </button>

                  {(row.form_process != "4" || row.is_client == 0) && <button
                    className="delete-icon "
                    onClick={() => handleDelete(row)}
                  >
                    <i className="ti-trash text-danger " />
                  </button>}

                </div>
              </>
            ) : (
              <div className="d-flex justify-content-end">
                {hasUpdateAccess && row.status == 1 && (
                  <button className="edit-icon " onClick={() => handleEdit(row)}>
                    <i className="ti-pencil text-primary" />
                  </button>
                )}
                {hasDeleteAccess && (row.form_process != "4" || row.is_client == 0) && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row)}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                )}

              </div>
            )}
          </div>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '200px',

    },
  ];

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { customer_id: row.id };
          const res = await dispatch(deleteCustomer({ req, authToken: token })).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetAllCustomerData(1, pageSize, '');
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
            text: "An error occurred while deleting the customer.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Customer was not deleted",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    });

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
            GetAllCustomerData(1, pageSize, '');
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

  const handleViewAllAccountManager = async (customerId) => {
    try {
      const response = await dispatch(
        GET_CUSTOMER_DATA({
          req: { customer_id: customerId.id, action: 'allAccountManager' },
          authToken: token,
        })
      ).unwrap();
      if (response.status) {
        if (response.status == true) {
          setManagerList(response?.data?.data);
          setShowManagerModal(true);
        } else {
          Swal.fire({
            title: 'Info',
            text: 'No account managers found for this customer.',
            icon: 'info',
          });
        }
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch account managers.',
          icon: 'error',
        });
      }
    } catch (error) {
      return;
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1; // Pagination libraries use 0-based indexing.
    setCurrentPage(newPage);
    GetAllCustomerData(newPage, pageSize, ''); // Fetch data for the new page.
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page
    GetAllCustomerData(1, newSize, ''); // Fetch data with new page size
  };

  const handleSearchChange = (term) => {
    console.log("term ", term);
    setSearchTerm(term);
    setCurrentPage(1);
    GetAllCustomerData(1, pageSize, term);
  };

  const GetAllCustomerData = async (page = 1, limit = 10, term) => {

    // console.log("limit", limit)
    // console.log("page", page)
    const req = { action: 'getCustomerUsers', staff_id: staffDetails.id, page, limit, search: term };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(getAllCustomerUsers(data)).unwrap();
      if (response.status) {
        // const filteredData = response.data.data.filter((item) => {
        //   const itemDate = new Date(item.created_at);
        //   const { startDate, endDate } = getDateRange(selectedTab);
        //   return itemDate >= startDate && itemDate <= endDate;
        // });


        setFilteredData(response.data.data);
        setTotalRecords(response.data.pagination.totalItems);

      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };


  useEffect(() => {
    const StatusfilterData = filteredData.filter((item) => (item.status == statusFilter || statusFilter == ""))
    setFilteredData1(StatusfilterData);

  }, [filteredData, statusFilter]);



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




  const handleExport = async () => {
    ///const apiData = await GetAllCustomerData(1, 10000, searchTerm);
    const req = { action: 'get', staff_id: staffDetails.id, page: 1, limit: 100000, search: "" };
    const data = { req, authToken: token };
    const response = await dispatch(GET_ALL_CUSTOMERS(data)).unwrap();
    if (!response.status) {
      alert("No data to export!");
      return;
    }
    const apiData = response?.data?.data;

    if (!apiData || apiData.length === 0) {
      alert("No data to export!");
      return;
    }

    // export format
    const exportData = apiData?.map((item) => ({
      "Trading Name": item.trading_name,
      "Customer Code": item.customer_code,
      "Type":
        item.customer_type === "1"
          ? "Sole Trader"
          : item.customer_type === "2"
            ? "Company"
            : item.customer_type === "3"
              ? "Partnership"
              : "-",
      "Account Manager": item.account_manager_firstname + " " + item.account_manager_lastname,
      "Created by": item.customer_created_by,
      "Created At": item.created_at,
      "Status": item.status == 1 ? "Active" : "Deactive",
    }));

    downloadCSV(exportData, "Customer Details.csv");
  };
  const downloadCSV = (data, filename) => {
    const csvRows = [];

    // headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    // rows
    data.forEach((row) => {
      const values = headers.map((h) => `"${row[h] || ""}"`);
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    a.click();
  };

//////////////////////////////////////////////////

 const fields = [
    {
      type: "text6",
      name: "first_name",
      label: "First Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter First Name",
    },
    {
      type: "text6",
      name: "last_name",
      label: "Last Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Last Name",
    },

    {
      type: "select2",
      name: "phone_code",
      label: "Phone Code",
      options: [
        { label: "+44", value: "+44" },
        { label: "+91", value: "+91" },
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
    {
      type: "number1",
      name: "phone",
      label: "Phone",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Email",
    },
    // {
    //   type: "select1",
    //   name: "role",
    //   label: "Role",
    //   label_size: 12,
    //   col_size: 6,
    //   //disable: editStaff ? true : false,
    //   options:
    //     roleDataAll &&
    //     roleDataAll.data.map((data) => {
    //       if (formik.values.role_id == data.id) {
    //         return { label: data.role_name, value: data.id, selected: true };
    //       } else {
    //         return { label: data.role_name, value: data.id };
    //       }
    //     }),
    // },
    {
      type: "select1",
      name: "status",
      label: "Status",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
    // {
    //   type: "selectSearch",
    //   name: "staff_to",
    //   label: "Line Manager",
    //   label_size: 12,
    //   col_size: 6,
    //   disable: false,
    //   options: staffDataAll.data
    //     .filter((data) => (data.role !== "ADMIN" && data.role !== "SUPERADMIN" && data.id !== editStaffData.id))
    //     .map((data) => ({
    //       label: `${data.first_name} ${data.last_name}`,
    //       value: data.id,
    //     })),
    // },
    {
      type: "text6",
      name: "employee_number",
      label: "Employee ID",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Employee ID",
    },
  ];

  const formik = useFormik({
      initialValues: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        phone_code: "+44",
        role: "1",
        status: "1",
        staff_to: "",
        employee_number: "",
      },
      validationSchema: Yup.object({
        first_name: Yup.string()
          .trim(Validation_Message.FirstNameValidation)
          .required(Validation_Message.FirstNameValidation),
        last_name: Yup.string()
          .trim(Validation_Message.LastNameValidation)
          .required(Validation_Message.LastNameValidation),
        email: Yup.string()
          .trim(Validation_Message.EmailValidation)
          .email(Validation_Message.EmailValidation)
          .required(Validation_Message.EmailIsRequire),
        role: Yup.string()
          .trim(Validation_Message.RoleValidation)
          .required(Validation_Message.RoleValidation),
      //   status: Yup.string()
      //     .trim(Validation_Message.StatusValidation)
      //     .required(Validation_Message.StatusValidation),
      //   employee_number: Yup.string()
      //     .trim(Validation_Message.EmployeeNumberValidation)
      //     .required(Validation_Message.EmployeeNumberValidation)
       }),
  
      onSubmit: async (values) => {
        let req = {
          first_name: (values.first_name).trim(),
          last_name: values.last_name,
          email: values.email,
          phone: values.phone,
          phone_code: values.phone_code,
          role_id: values.role,
          status: values.status,
          employee_number: values.employee_number,
          staff_to: values.staff_to,
         // created_by: StaffUserId.id,
         // hourminute: `${budgetedHours.hours || "00"}:${budgetedHours.minutes || "00"}`,
        };

     alert("Submit function called");


        // if (editStaff) {
        //   req.id = editStaffData && editStaffData.id;
        // }
  
  
        // await dispatch(
        //   Staff({
        //     req: { action: editStaff ? "update" : "add", ...req },
        //     authToken: token,
        //   })
        // )
        //   .unwrap()
        //   .then(async (response) => {
        //     if (response.status) {
        //       sweatalert.fire({
        //         icon: "success",
        //         title: "Success",
        //         text: response.message,
        //         timer: 1500,
        //         timerProgressBar: true,
        //       });
        //       setTimeout(() => {
        //         setAddStaff(false);
        //         setEditStaff(false);
        //         setEditStaffData({});
        //         SetRefresh(!refresh);
        //         formik.resetForm();
        //         window.location.reload();
        //       }, 1500);
        //     } else {
        //       sweatalert.fire({
        //         icon: "error",
        //         title: "Oops...",
        //         text: response.message,
        //       });
        //     }
        //   })
  
        //   .catch((error) => {
        //     return;
        //   });
      },
    });



  return (
    <div>
    <CommanModal
        isOpen={showAddCustomerModal}
        backdrop="static"
        size="ms-7"
        title="Add Customer User"
        hideBtn={true}
        handleClose={() => {
          setShowAddCustomerModal(false);
          formik.resetForm();
        }}
      >
        <Formicform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add"
          closeBtn={(e) => {
            formik.resetForm();
            setShowAddCustomerModal(false);
          }}
        />
      </CommanModal>

      <div className="container-fluid">
        <div className="content-title">
          <div className="row">
            <div className="col-md-6 col-sm-5">
              <div className="tab-title">
                <h3 className="mt-0">Customers User Details</h3>
              </div>
            </div>
            {role === "SUPERADMIN" ? (
              <div className="col-md-6 col-sm-7">
                {/* <Link
                  to="/admin/addcustomer"
                  className="btn btn-outline-info  fw-bold float-sm-end mt-3 mt-sm-0  border-3"
                >
                  <i className="fa fa-plus" /> Add Customer User
                </Link> */}
                <button
                  className="btn btn-outline-info  fw-bold float-sm-end mt-3 mt-sm-0  border-3"
                  onClick={() => setShowAddCustomerModal(true)}
                >
                  <i className="fa fa-plus" />
                  Add Customer User
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>

        <div className="report-data mt-4">
          <div className="col-sm-12">
            <div className="page-title-box pt-0 pb-0">
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

                        <div className="row mb-3">
                          <div className="col-md-4">
                            <input
                              type="text"
                              placeholder="Search Customers"
                              className="form-control"
                              value={searchTerm}
                              onChange={(e) => handleSearchChange(e.target.value)}
                            />
                          </div>
                          <div className="col-md-2">
                            <select className="form-select form-control" onChange={(e) => setStatusFilter(e.target.value)} >
                              <option value="">All</option>
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </select>
                          </div>
                          <div className="col-md-2">
                            {/* <ExportToExcel
                              className="btn btn-outline-info fw-bold float-end border-3 "
                              apiData={exportData}
                              fileName={"Customer Details"}
                            /> */}


                            <button className="btn btn-outline-info fw-bold float-end border-3 " onClick={handleExport}>
                              Export Excel
                            </button>
                          </div>
                        </div>


                        <Datatable columns={columns} data={filteredData1} />

                        {/* Pagination Controls */}
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={Math.ceil(totalRecords / pageSize)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageChange}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                      <select className="perpage-select" value={pageSize} onChange={handlePageSizeChange}>

                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                      </select>
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

export default CustomerUsers;
