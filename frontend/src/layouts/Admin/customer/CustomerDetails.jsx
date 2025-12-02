import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { Update_Customer_Status, deleteCustomer, GET_ALL_CUSTOMERS, GET_CUSTOMER_DATA, getAllCustomerDropDown } from "../../../ReduxStore/Slice/Customer/CustomerSlice";

import { PersonRole } from "../../../ReduxStore/Slice/Settings/settingSlice";
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

  const [type, setType] = useState("add")
  const [updatedata, setUpdatedata] = useState("")




  const [personRoleDataAll, setPersonRoleDataAll] = useState([]);

  const [customerDataAll, setCustomerDataAll] = useState([]);
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
    GetAllCustomer();
    CustomerPersonRoleData();
  }, []);




  const CustomerPersonRoleData = async () => {
    const req = {
      action: "get",
    };
    const data = { req: req, authToken: token };
    await dispatch(PersonRole(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setPersonRoleDataAll({ loading: false, data: response.data });
        } else {
          setPersonRoleDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
  };

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
      name: "Actions",
      cell: (row) => {
        return (
          <div className="w-100">

            <>
              <div className="d-flex justify-content-start">
                <button className="edit-icon rounded-pills border-primary"
                  onClick={() => {
                    setType("edit");
                    setUpdatedata(row);
                    setShowAddCustomerModal(true);
                  }}
                >
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
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    GetAllCustomerData(newPage, pageSize, '');
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    GetAllCustomerData(1, newSize, '');
  };

  const handleSearchChange = (term) => {
    console.log("term ", term);
    setSearchTerm(term);
    setCurrentPage(1);
    GetAllCustomerData(1, pageSize, term);
  };




  const GetAllCustomerData = async (page = 1, limit = 10, term) => {
    const req = { action: 'getCustomerUsers', staff_id: staffDetails.id, page, limit, search: term };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(getAllCustomerUsers(data)).unwrap();
      if (response.status) {

        setFilteredData(response.data.data);
        setTotalRecords(response.data.pagination.totalItems);

      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

  const GetAllCustomer = async () => {
    const req = { action: "get_dropdown" };
    const data = { req: req, authToken: token };
    await dispatch(getAllCustomerDropDown(data)).unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerDataAll(response.data);
        } else {
          setCustomerDataAll(response.data);
        }
      })
      .catch((error) => {
        return;
      });
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




  const handleExport = async () => {
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


    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));


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
    {
      type: "multiselect",
      name: "allCustomerAccess",
      label: "All Customer Access",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: customerDataAll?.map((item) => ({
        value: item.id,
        label: item.trading_name,
      }))
    },
    {
      type: "select",
      name: "customer_contact_person_role_id",
      label: "Customer Role",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: personRoleDataAll?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    },

  ];


  const formik = useFormik({
    initialValues: {
      first_name: updatedata?.first_name || "",
      last_name: updatedata?.first_name || "",
      email: updatedata?.email || "",
      phone: updatedata?.phone || "",
      phone_code: updatedata?.phone_code || "+44",
      role: "1",
      status: updatedata?.status || "1",
      customer_contact_person_role_id: updatedata?.customer_contact_person_role_id || null,
      allCustomerAccess: updatedata?.allCustomerAccess
        ? updatedata.allCustomerAccess.split(",").map(Number)
        : [] || [],


    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      first_name: Yup.string()
        .trim()
        .required("First name is required"),
      last_name: Yup.string()
        .trim()
        .required("Last name is required"),
      phone: Yup.string()
        .trim()
        .required("phone is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      allCustomerAccess: Yup.array()
        .min(1, "Please select at least one customer")
        .required("Customer access is required"),
      customer_contact_person_role_id: Yup.string()
        .trim()
        .required("Please select customer role"),
    }),

    onSubmit: async (values) => {

      let req = {
        first_name: (values.first_name).trim(),
        last_name: (values.last_name).trim(),
        email: (values.email).trim(),
        phone: values.phone,
        phone_code: values.phone_code,
        role_id: values.role,
        status: values.status,
        staff_to: values.staff_to,
        allCustomerAccess: values.allCustomerAccess,
        customer_contact_person_role_id: values.customer_contact_person_role_id,
        created_by: staffDetails.id,
        action: type === "edit" ? "updateCustomerUsers" : "addCustomerUsers",
        staff_id: staffDetails.id,
        customer_user_id: updatedata?.id

      };

      try {
        const data = { req, authToken: token };
        const response = await dispatch(getAllCustomerUsers(data)).unwrap();

        if (response.status) {
          sweatalert.fire({
            icon: "success",
            title: "Success",
            text: response.message || "Customer user added successfully",
            timer: 1500,
            timerProgressBar: true,
          });

          setTimeout(() => {
            setShowAddCustomerModal(false);
            formik.resetForm();
            GetAllCustomerData(1, pageSize, '');
          }, 1500);

          setType("")
        } else {
          sweatalert.fire({
            icon: "error",
            title: "Error",
            text: response.message || "Failed to add customer user",
          });
        }
      } catch (error) {
        sweatalert.fire({
          icon: "error",
          title: "Error",
          text: error.message || "An error occurred while adding customer user",
        });
      }
    },
  });





  return (
    <div>
      <CommanModal
        isOpen={showAddCustomerModal}
        backdrop="static"
        size="ms-7"
        title={type === "edit" ? "Edit Customer User" : "Add Customer User"}
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
          btn_name={type === "edit" ? "Edit Customer User" : "Add Customer User"}
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
                <button
                  className="btn btn-outline-info  fw-bold float-sm-end mt-3 mt-sm-0  border-3"
                  onClick={() => { setShowAddCustomerModal(true); setType("add"); setUpdatedata("") }}
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

                            <button className="btn btn-outline-info fw-bold float-end border-3 " onClick={handleExport}>
                              Export Excel
                            </button>
                          </div>
                        </div>


                        <Datatable columns={columns} data={filteredData1} />


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