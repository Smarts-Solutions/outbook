import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import {
  CustomerList,
  GET_CUSTOMER_DATA,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import { Download, Eye } from "lucide-react";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";

const Customer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  
  const [filteredData, setFilteredData] = useState([]);
  const [filteredData1, setFilteredData1] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const debounceRef = useRef(null);

  const [showManagerModal, setShowManagerModal] = useState(false);
  const [managerList, setManagerList] = useState([]);

  useEffect(() => {
    GetAllCustomerData(1, pageSize, "");
  }, []);

  const columns = [
    {
      name: "Trading Name",
      cell: (row) => (
        <a
          onClick={() => HandleClientView(row)}
          style={{ cursor: "pointer", color: "#26bdf0", fontWeight: "bold" }}
          title={row.trading_name}
        >
          {row.trading_name}
        </a>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },
    {
      name: "Customer Code",
      selector: (row) => row.customer_code,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) =>
        row.customer_type === "1" ? "Sole Trader" : row.customer_type === "2" ? "Company" : "Partnership",
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) => row.account_manager_firstname + " " + row.account_manager_lastname,
      sortable: true,
    },
    {
      name: "Employee Id",
      selector: (row) => row.account_manager_employee_number,
      sortable: true,
    },
    {
      name: "Created by",
      selector: (row) => row.customer_created_by,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <span className={row.status == 1 ? "text-success" : "text-danger"}>
          {row.status == 1 ? "Active" : "Inactive"}
        </span>
      ),
      sortable: true,
    },
    {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex justify-content-start">
            <button
              className="view-icon rounded-pills border-primary"
              onClick={() => handleViewAllAccountManager(row)}
              title="View Account Managers"
            >
              <Eye size={16} className="text-primary" />
            </button>
          </div>
        ),
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
    },
  ];

  const handleViewAllAccountManager = async (customerId) => {
    try {
      const response = await dispatch(
        GET_CUSTOMER_DATA({
          req: { customer_id: customerId.id, action: "allAccountManager" },
          authToken: token,
        }),
      ).unwrap();
      if (response.status) {
        setManagerList(response?.data?.data);
        setShowManagerModal(true);
      } else {
        Swal.fire({
          title: "Info",
          text: "No account managers found for this customer.",
          icon: "info",
        });
      }
    } catch (error) {
        console.error("Error fetching account managers:", error);
    }
  };

  const HandleClientView = (row) => {
    if (row.form_process == "4") {
      navigate("/customer/client", { state: row });
    } else {
      Swal.fire({ title: "Form not completed", text: "Please complete the form", icon: "error" });
    }
  };

  const GetAllCustomerData = async (page = 1, limit = 10, term = "") => {
    setLoading(true);
    const req = { action: "get", staff_id: staffDetails.id, page, limit, search: term };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(CustomerList(data)).unwrap();
      if (response.status) {
        setFilteredData(response.data.data || []);
        setTotalRecords(response.data.pagination?.totalItems || 0);
      } else {
        setFilteredData([]);
        setTotalRecords(0);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setFilteredData([]);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const dataToFilter = Array.isArray(filteredData) ? filteredData : [];
    const StatusfilterData = dataToFilter.filter(
      (item) => String(item.status) === String(statusFilter) || statusFilter === "",
    );
    setFilteredData1(StatusfilterData);
  }, [filteredData, statusFilter]);

  const handlePageChange = (selected) => {
    const newPage = selected.selected + 1;
    setCurrentPage(newPage);
    GetAllCustomerData(newPage, pageSize, searchTerm);
  };

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
    GetAllCustomerData(1, newSize, searchTerm);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      GetAllCustomerData(1, pageSize, term);
    }, 500);
  };

  const handleExport = async () => {
    setLoading(true);
    const req = { action: "get", staff_id: staffDetails.id, page: 1, limit: 100000, search: "" };
    const res = await dispatch(CustomerList({ req, authToken: token })).unwrap();
    if (res.status && res.data.data.length > 0) {
      const exportData = res.data.data.map(item => ({
        "Trading Name": item.trading_name,
        "Customer Code": item.customer_code,
        "Type": item.customer_type === '1' ? "Sole Trader" : item.customer_type === '2' ? "Company" : item.customer_type === '3' ? "Partnership" : "-",
        "Account Manager": item.account_manager_firstname + " " + item.account_manager_lastname,
        "Employee Id": item.account_manager_employee_number,
        "Created by": item.customer_created_by,
        "Created At": item.created_at,
        "Status": item.status == 1 ? "Active" : "Inactive",
      }));
      downloadCSV(exportData, "Customer_Details.csv");
    } else {
      alert("No data to export!");
    }
    setLoading(false);
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

  return (
    <div className="container-fluid">
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
      <div className="content-title">
        <div className="row">
          <div className="col-md-6 col-sm-5">
            <div className="tab-title">
              <h3 className="mt-0">Customers</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="report-data mt-4">
        <div className="col-sm-12">
            <div className="page-title-box pt-0 pb-0">
                <div className="row align-items-start justify-content-end">
                    <div className="col-12">
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
                                    <select className="form-select form-control" onChange={(e) => setStatusFilter(e.target.value)}>
                                        <option value="">All Status</option>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>
                                <div className="col-md-6 text-end">
                                    {filteredData1 && filteredData1.length > 0 && (
                                        <button className="btn btn-outline-info fw-bold border-3 d-inline-flex align-items-center gap-2" onClick={handleExport}>
                                            <Download size={16} /> <span>Export Excel</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {loading && (
                                <div className="overlay">
                                    <div className="loader"></div>
                                </div>
                            )}

                            <Datatable columns={columns} data={filteredData1} />

                            <div className="d-flex justify-content-between align-items-center mt-3">
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
                                    forcePage={currentPage - 1}
                                />
                                <select className="perpage-select" value={pageSize} onChange={handlePageSizeChange}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
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
