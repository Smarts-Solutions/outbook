import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import {
  Update_Customer_Status,
  deleteCustomer,
  GET_ALL_CUSTOMERS,
  GET_CUSTOMER_DATA,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [customerData, setCustomerData] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerList, setManagerList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState("this-year");
  const role = JSON.parse(localStorage.getItem("role"));
  const [filteredData1, setFilteredData1] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [getAccessData, setAccessData] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    client: 0,
    all_clients: 0,
  });

  const [loading, setLoading] = useState(false);

  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer",
    )?.items || [];

  const accessData1 =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client",
    )?.items || [];

  const accessDataAllClients =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_clients",
    )?.items || [];

  useEffect(() => {
    GetAllCustomerData(1, pageSize, "");
  }, [activeTab]);

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = {
      insert: 0,
      update: 0,
      delete: 0,
      client: 0,
      all_clients: 0,
    };
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
      name: "Trading Name",

      cell: (row) => (
        <div
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {role === "SUPERADMIN" && row.status == 1 ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a>
          ) : (getAccessData.client == 1 || getAccessData.all_clients) &&
            row.status == 1 ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
              title={row.trading_name}
            >
              {row.trading_name}
            </a>
          ) : (
            row.trading_name
          )}
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },
    {
      name: "Customer Code",
      selector: (row) => row.customer_code,
      cell: (row) => <div title={row.customer_code}>{row.customer_code}</div>,
      sortable: true,
    },

    {
      name: "Type",
      selector: (row) =>
        row.customer_type === "1"
          ? "Sole Trader"
          : row.customer_type === "2"
            ? "Company"
            : row.customer_type === "3"
              ? "Partnership"
              : "-",
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) =>
        row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
      cell: (row) => (
        <div
          title={
            row.account_manager_firstname + " " + row.account_manager_lastname
          }
          className="data-table-cell"
          data-fulltext={
            row.account_manager_firstname + " " + row.account_manager_lastname
          }
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {row.account_manager_firstname + " " + row.account_manager_lastname}
        </div>
      ),
    },

    {
      name: "Created by",
      selector: (row) => row.customer_created_by,
      cell: (row) => (
        <div title={row.customer_created_by}>{row.customer_created_by}</div>
      ),
      sortable: true,
    },

    {
      name: "Created At",
      selector: (row) => row.created_at,
      cell: (row) => <div title={row.created_at}>{row.created_at}</div>,
      sortable: true,
    },

    {
      name: "Status",
      selector: (row) => row.form_process,
      cell: (row) => (
        <div>
          <div>
            {row.form_process === "4" ? (
              <select
                className="form-select form-control"
                value={row.status}
                onChange={(e) => handleChangeStatus(e, row)}
              >
                <option value="0" className="text-danger">
                  Deactive
                </option>
                <option value="1" className="text-success">
                  Active
                </option>
              </select>
            ) : (
              <span className="text-warning">Inprogress</span>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },

    {
      name: "Actions      ",
      cell: (row) => {
        const hasUpdateAccess = getAccessData.update === 1;
        const hasDeleteAccess = getAccessData.delete === 1;
        return (
          <div className="w-100">
            {role === "SUPERADMIN" && row.status == 1 ? (
              <>
                <div className="d-flex justify-content-start">
                  <button
                    className="edit-icon rounded-pills border-primary"
                    onClick={() => handleEdit(row)}
                  >
                    <i className="ti-pencil text-primary" />
                  </button>

                  {/*view Icon Button*/}
                  <button
                    className="view-icon rounded-pills border-primary"
                    onClick={() => handleViewAllAccountManager(row)}
                  >
                    <i className="ti-eye text-primary" />
                  </button>

                  {(row.form_process != "4" || row.is_client == 0) && (
                    <button
                      className="delete-icon "
                      onClick={() => handleDelete(row)}
                    >
                      <i className="ti-trash text-danger " />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="d-flex justify-content-end">
                {hasUpdateAccess && row.status == 1 && (
                  <button
                    className="edit-icon "
                    onClick={() => handleEdit(row)}
                  >
                    <i className="ti-pencil text-primary" />
                  </button>
                )}
                {hasDeleteAccess &&
                  (row.form_process != "4" || row.is_client == 0) && (
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
      width: "200px",
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
          const res = await dispatch(
            deleteCustomer({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetAllCustomerData(1, pageSize, "");
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
          const res = await dispatch(
            Update_Customer_Status({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });
            GetAllCustomerData(1, pageSize, "");
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
          req: { customer_id: customerId.id, action: "allAccountManager" },
          authToken: token,
        }),
      ).unwrap();
      if (response.status) {
        if (response.status == true) {
          setManagerList(response?.data?.data);
          setShowManagerModal(true);
        } else {
          Swal.fire({
            title: "Info",
            text: "No account managers found for this customer.",
            icon: "info",
          });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to fetch account managers.",
          icon: "error",
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
    GetAllCustomerData(newPage, pageSize, ""); // Fetch data for the new page.
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1); // Reset to the first page
    GetAllCustomerData(1, newSize, ""); // Fetch data with new page size
  };

  const handleSearchChange = (term) => {
    console.log("term ", term);
    setSearchTerm(term);
    setCurrentPage(1);
    GetAllCustomerData(1, pageSize, term);
  };

  const GetAllCustomerData = async (page = 1, limit = 10, term) => {
    setLoading(true);
    console.log("limit", limit);
    console.log("page", page);
    const req = {
      action: "get",
      staff_id: staffDetails.id,
      page,
      limit,
      search: term,
    };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(GET_ALL_CUSTOMERS(data)).unwrap();
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
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false); // 🔥 loader OFF (success ya error dono me)
    }
  };

  useEffect(() => {
    const StatusfilterData = filteredData.filter(
      (item) => item.status == statusFilter || statusFilter == "",
    );
    setFilteredData1(StatusfilterData);
  }, [filteredData, statusFilter]);

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

  // const exportData = filteredData.map((item) => ({
  //   "Trading Name": item.trading_name,
  //   "Customer Code": item.customer_code,
  //   "Type": item.customer_type === '1' ? "Sole Trader" : item.customer_type === '2' ? "Company" : item.customer_type === '3' ? "Partnership" : "-",
  //   "Account Manager": item.account_manager_firstname + " " + item.account_manager_lastname,
  //   "Created by": item.customer_created_by,
  //   "Created At": item.created_at,
  //   "Status": item.status == 1 ? "Active" : "Deactive",
  // }));

  const handleExport = async () => {
    ///const apiData = await GetAllCustomerData(1, 10000, searchTerm);
    setLoading(true);
    const req = {
      action: "get",
      staff_id: staffDetails.id,
      page: 1,
      limit: 100000,
      search: "",
    };
    const data = { req, authToken: token };
    const response = await dispatch(GET_ALL_CUSTOMERS(data)).unwrap();
    if (!response.status) {
      alert("No data to export!");
      setLoading(false);
      return;
    }
    const apiData = response?.data?.data;

    if (!apiData || apiData.length === 0) {
      alert("No data to export!");
      setLoading(false);
      return;
    }

    // export format
    const exportData = apiData?.map((item) => ({
      "Trading Name": item.trading_name,
      "Customer Code": item.customer_code,
      Type:
        item.customer_type === "1"
          ? "Sole Trader"
          : item.customer_type === "2"
            ? "Company"
            : item.customer_type === "3"
              ? "Partnership"
              : "-",
      "Account Manager":
        item.account_manager_firstname + " " + item.account_manager_lastname,
      "Created by": item.customer_created_by,
      "Created At": item.created_at,
      Status: item.status == 1 ? "Active" : "Deactive",
    }));

    setLoading(false);

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

  return (
    <div>
      <CommanModal
        isOpen={showManagerModal}
        handleClose={() => {
          setShowManagerModal(false);
          setManagerList([]);
        }}
        hideBtn={true}
        title="Individual Service Account Managers"
      >
        <div>
          {managerList && managerList?.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Service Name</th>
                    <th>Account Managers</th>
                  </tr>
                </thead>
                <tbody>
                  {managerList?.map((value, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{value.service_name}</td>
                      <td>
                        {value?.account_managers
                          ?.map((item) => item?.account_manager_name)
                          ?.join(" , ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-3 text-muted">
              No account managers found.
            </div>
          )}
        </div>
      </CommanModal>
      <div className="container-fluid">
        <div className="content-title">
          <div className="row">
            <div className="col-md-6 col-sm-5">
              <div className="tab-title">
                <h3 className="mt-0">Customers</h3>
              </div>
            </div>
            {role === "SUPERADMIN" ? (
              <div className="col-md-6 col-sm-7">
                <Link
                  to="/admin/addcustomer"
                  className="btn btn-outline-info  fw-bold float-sm-end mt-3 mt-sm-0  border-3"
                >
                  <i className="fa fa-plus" /> Add Customer
                </Link>
              </div>
            ) : (
              getAccessData.insert === 1 && (
                <div className="col-md-6 col-sm-7">
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
            <div className="page-title-box pt-0 pb-0">
              <div className="row align-items-start justify-content-end">
                <div className="col-4">
                  <div className="form-group mb-2 mt-1 pe-3 pt-5"></div>
                </div>

                <div className="col-12">
                  {/* Tab content */}
                  <div
                    className="tab-content mt-minus-60"
                    id="pills-tabContent"
                  >
                    <div className="card-datatable">
                      <div className="card-datatable">
                        <div className="row mb-3">
                          <div className="col-md-4">
                            <input
                              type="text"
                              placeholder="Search Customers"
                              className="form-control"
                              value={searchTerm}
                              onChange={(e) =>
                                handleSearchChange(e.target.value)
                              }
                            />
                          </div>
                          <div className="col-md-2">
                            <select
                              className="form-select form-control"
                              onChange={(e) => setStatusFilter(e.target.value)}
                            >
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

                            <button
                              className="btn btn-outline-info fw-bold float-end border-3 "
                              onClick={handleExport}
                            >
                              Export Excel
                            </button>
                          </div>
                        </div>
                        {/* <div className="overlay">
                         <div className="loader"></div>
                          </div> */}

                        {loading && (
                          <div className="overlay">
                            <div className="loader"></div>
                          </div>
                        )}

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
                      <select
                        className="perpage-select"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={500}>500</option>
                        {/* <option value={100000}>All</option> */}
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

export default Customer;
