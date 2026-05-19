import React, { useEffect, useState, useRef, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable_1";
import { getAllCustomerDropDown, getCustomersJobs } from "../../../ReduxStore/Slice/Customer/CustomerSlice";

import { PersonRole } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { getAllCustomerUsers } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import Formicform from "../../../Components/ExtraComponents/Forms/Comman.form";

import { useFormik } from "formik";

import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import * as Yup from "yup";
import { Plus, Download, Trash2, AlertCircle, ArrowRightLeft, User, Clock } from "lucide-react";
import Select from "react-select";

import CommanModal from '../../../Components/ExtraComponents/Modals/CommanModal';

const CustomerUsers = () => {
  const customStyles = `
    .premium-modal .modal-content {
      border-radius: 16px;
      border: none;
      box-shadow: 0 10px 40px rgba(0,0,0,0.12);
    }
    .premium-modal .modal-header {
      border-bottom: 1px solid #f0f4f8;
      padding: 1.25rem 1.5rem;
      background: #ffffff;
    }
    .premium-modal .modal-title {
      font-weight: 700;
      color: #1a202c;
      font-size: 1.2rem;
      letter-spacing: -0.01em;
    }
    .job-assignment-wrapper {
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-top: 20px;
      overflow: hidden;
    }
    .job-assignment-header {
      padding: 15px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: #ffffff;
    }
    .job-assignment-scroll-area {
      max-height: 450px;
      overflow-y: auto;
      padding: 20px;
    }
    /* Custom Premium Scrollbar */
    .job-assignment-scroll-area::-webkit-scrollbar {
      width: 6px;
    }
    .job-assignment-scroll-area::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 10px;
    }
    .job-assignment-scroll-area::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .job-assignment-scroll-area::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 0;
      display: flex;
      align-items: center;
    }
    .section-title i {
      margin-right: 10px;
      color: #3b82f6;
      font-size: 1.1rem;
    }

    .custom-accordion .accordion-item {
      border: 1px solid #e2e8f0;
      border-radius: 8px !important;
      margin-bottom: 12px;
      background: #ffffff;
      overflow: hidden;
    }
    .custom-accordion .accordion-button {
      padding: 12px 18px;
      font-weight: 600;
      color: #475569;
      background: #ffffff;
      box-shadow: none;
      font-size: 0.9rem;
    }
    .custom-accordion .accordion-button:not(.collapsed) {
      background: #f1f5f9;
      color: #2563eb;
      border-bottom: 1px solid #e2e8f0;
    }
    
    .client-card {
      border: 1px solid #f1f5f9;
      border-radius: 6px;
      margin-bottom: 10px;
      background: #ffffff;
    }
    .client-header {
      padding: 8px 12px;
      background: #f8fafc;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .client-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .job-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 8px;
      padding: 12px;
    }
    .job-item {
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      transition: all 0.2s;
    }
    .job-item:hover {
      background: #eff6ff;
      border-color: #bfdbfe;
    }
    .job-item label {
      font-size: 0.8rem;
      margin-left: 8px;
      margin-bottom: 0;
      color: #64748b;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .select-all-link {
      font-size: 0.75rem;
      color: #3b82f6;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }
    .select-all-link:hover {
      text-decoration: underline;
    }

    /* Form Styles */
    .premium-modal .form-control, .premium-modal .form-select {
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      padding: 0.6rem 0.9rem;
      font-size: 0.875rem;
    }
    .premium-modal label {
      font-weight: 600;
      color: #475569;
      font-size: 0.85rem;
      margin-bottom: 6px;
    }

    /* Transfer Modal Specific Styles */
    .transfer-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      background: #ffffff;
      margin-bottom: 1.5rem;
    }
    .transfer-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #fef2f2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .transfer-alert {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .transfer-alert i {
      color: #d97706;
      margin-right: 0.75rem;
      margin-top: 0.25rem;
    }
    .user-info-box {
      background: #f8fafc;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      border: 1px solid #f1f5f9;
    }
    .assignment-badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-right: 0.5rem;
      margin-top: 0.5rem;
    }
    .badge-jobs { background: #eff6ff; color: #1d4ed8; }
    .badge-clients { background: #f0fdf4; color: #15803d; }
  `;



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
  const debounceTimer = useRef(null);

  const [allCustomers, setAllCustomers] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);

  // Transfer Logic States
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedUserForDeletion, setSelectedUserForDeletion] = useState(null);
  const [transferUserId, setTransferUserId] = useState("");
  const [allOtherUsers, setAllOtherUsers] = useState([]);
  const [isTransferring, setIsTransferring] = useState(false);




  // const [customerOptions, setCustomerOptions] = useState([]);
  // const [customerPage, setCustomerPage] = useState(1);
  // const [customerHasMore, setCustomerHasMore] = useState(true);
  // const [customerSearch, setCustomerSearch] = useState("");
  // const customerCache = useRef({});
  // const customerDebounce = useRef(null);

  // const GetAllCustomer = async ({ searchValue = "", pageNo = 1, append = false }) => {
  //   const cacheKey = `${searchValue}_${pageNo}`;
  //   if (customerCache.current[cacheKey]) {
  //     const cached = customerCache.current[cacheKey];
  //     setCustomerOptions(prev => {
  //       const combined = append ? [...prev, ...cached] : cached;
  //       return Array.from(
  //         new Map(combined.map(item => [item.value, item])).values()
  //       );
  //     });
  //     return;
  //   }

  //   const req = {
  //       action: "get_customers_filter",
  //       filters: 'all',
  //       pagination: {
  //         search: searchValue,
  //         page: pageNo,
  //         limit: 5
  //       }
  //     };

  //     const data = { req: req, authToken: token };

  //   const response = await dispatch(getAllCustomerDropDown(data)).unwrap();

  //   if (response.status) {
  //     const formatted = response.data.map((item) => ({
  //       value: item.id,
  //       label: item.trading_name
  //     }));

  //     customerCache.current[cacheKey] = formatted;
  //     setCustomerOptions(prev => {
  //       const combined = append ? [...prev, ...formatted] : formatted;
  //       return Array.from(
  //         new Map(combined.map(item => [item.value, item])).values()
  //       );
  //     });
  //     setCustomerHasMore(response.data.length === 5);
  //     setCustomerPage(pageNo);

  //   }

  // };

  // const handleCustomerSearch = (value) => {
  //   clearTimeout(customerDebounce.current);
  //   customerDebounce.current = setTimeout(() => {
  //     setCustomerSearch(value);
  //     setCustomerPage(1);
  //     GetAllCustomer({
  //       searchValue: value,
  //       pageNo: 1
  //     });
  //   }, 500);

  // };


  // const resetCustomerDropdown = () => {
  //   setCustomerHasMore(true);
  //   setCustomerPage(1);
  //   setCustomerSearch("");
  //   setCustomerOptions([]);
  //   customerCache.current = {};
  //   GetAllCustomer({
  //     searchValue: "",
  //     pageNo: 1
  //   });
  // };



  useEffect(() => {
    GetAllCustomer();
    FetchCustomersJobs();
    CustomerPersonRoleData();
  }, []);

  const FetchCustomersJobs = async () => {
    try {
      const response = await dispatch(getCustomersJobs({ req: {}, authToken: token })).unwrap();
      if (response.status) {
        setAllCustomers(response.data.customers);
        setAllClients(response.data.clients);
        setAllJobs(response.data.jobs);
      }
    } catch (error) {
      console.error("Error fetching customers/jobs:", error);
    }
  };



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
      width: "300px",
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

                {/* view Icon Button */}
                {/* <button className="view-icon rounded-pills border-primary" onClick={() => handleViewAllAccountManager(row)}>
                  <i className="ti-eye text-primary" />
                </button> */}

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
    // Check if the user has assignments
    const clientCount = row.selectedClients ? row.selectedClients.split(",").filter(x => x).length : 0;
    const jobCount = row.selectedJobs ? row.selectedJobs.split(",").filter(x => x).length : 0;
    const customerCount = row.allCustomerAccess ? row.allCustomerAccess.split(",").filter(x => x).length : 0;

    if (clientCount > 0 || jobCount > 0 || customerCount > 0) {
      setSelectedUserForDeletion({
        ...row,
        clientCount,
        jobCount,
        customerCount
      });
      fetchAllOtherUsers(row.id);
      setShowTransferModal(true);
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this customer user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          performDelete(row.id);
        }
      });
    }
  };

  const fetchAllOtherUsers = async (excludeId) => {
    // Fetch all users for transfer dropdown
    const req = { action: 'getCustomerUsers', staff_id: staffDetails.id, page: 1, limit: 1000 };
    const data = { req, authToken: token };
    try {
      const response = await dispatch(getAllCustomerUsers(data)).unwrap();
      if (response.status) {
        const others = response.data.data
          .filter(u => u.id !== excludeId)
          .map(u => ({
            value: u.id,
            label: `${u.first_name} ${u.last_name} (${u.email})`
          }));
        setAllOtherUsers(others);
      }
    } catch (error) {
      console.error('Error fetching other users:', error);
    }
  };

  const handleTransferAndDelete = async () => {
    if (!transferUserId) {
      Swal.fire({
        title: "Error",
        text: "Please select a user to transfer jobs and clients to.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "All assignments will be transferred, and this user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, transfer and delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsTransferring(true);
        try {
          const req = {
            customer_user_id: selectedUserForDeletion.id,
            replace_id: transferUserId,
            action: "deleteCustomerUsers",
          };
          const res = await dispatch(
            getAllCustomerUsers({ req, authToken: token }),
          ).unwrap();

          if (res.status) {
            Swal.fire({
              title: "Success",
              text:
                res.message ||
                "Assignments transferred and user deleted successfully.",
              icon: "success",
            }).then(() => {
              setShowTransferModal(false);
              setTransferUserId("");
              GetAllCustomerData(currentPage, pageSize, searchTerm);
            });
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
            text: "An error occurred during transfer and deletion.",
            icon: "error",
            confirmButtonText: "Ok",
          });
        } finally {
          setIsTransferring(false);
        }
      }
    });
  };

  const performDelete = async (userId) => {
    try {
      const req = { customer_user_id: userId, action: 'deleteCustomerUsers' };
      const res = await dispatch(getAllCustomerUsers({ req, authToken: token })).unwrap();

      if (res.status) {
        Swal.fire({
          title: "Success",
          text: res.message || "Customer user deleted successfully",
          icon: "success",
        }).then(() => {
          GetAllCustomerData(currentPage, pageSize, searchTerm);
        });
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
        text: "An error occurred while deleting the user.",
        icon: "error",
        confirmButtonText: "Ok",
      });
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
    setSearchTerm(term);
    setCurrentPage(1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      GetAllCustomerData(1, pageSize, term);
    }, 500);
  };


  const GetAllCustomerData = async (page = 1, limit = 10, term) => {
    const req = { action: 'getCustomerUsers', staff_id: staffDetails.id, page, limit, search: term };
    const data = { req, authToken: token };

    try {
      const response = await dispatch(getAllCustomerUsers(data)).unwrap();
      if (response.status) {

        setFilteredData(response.data.data);
        setTotalRecords(response.data.totalRecords);

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



  const handleExport = async () => {
    const req = { action: 'getCustomerUsers', staff_id: staffDetails.id, page: 1, limit: 100000, search: "" };
    const data = { req, authToken: token };
    const response = await dispatch(getAllCustomerUsers(data)).unwrap();
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
      "Full Name": item.first_name + " " + item.last_name,
      "Email": item.email,
      "Role": item.role_name,
      "Phone": item.phone_code + item.phone,
      "Created At": item.created_at,
      "Status": item.status == 1 ? "Active" : "Inactive",
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
      maxLength: 10,
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
      type: "select",
      name: "customer_contact_person_role_id",
      label: "Customer contact person role",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: personRoleDataAll?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }))
    },
    {
      type: "multiselect",
      name: "allCustomerAccess",
      label: "All Customer Access",
      label_size: 12,
      col_size: 6,
      disable: false,
      styles: {
        menuPortal: (base) => ({
          ...base,
          zIndex: 999,
        }),
      },
      menuPortalTarget: document.body,
      options: customerDataAll?.map((item) => ({
        value: item.id,
        label: item.trading_name,
      }))
    },



  ];


  const formik = useFormik({
    initialValues: {
      first_name: updatedata?.first_name || "",
      last_name: updatedata?.last_name || "",
      email: updatedata?.email || "",
      phone: updatedata?.phone || "",
      phone_code: updatedata?.phone_code || "+44",
      role: "1",
      status: updatedata?.status || "1",
      customer_contact_person_role_id: updatedata?.customer_contact_person_role_id || "",
      allCustomerAccess: updatedata?.allCustomerAccess
        ? updatedata.allCustomerAccess.split(",").filter(x => x).map(Number)
        : [],
      selectedClients: updatedata?.selectedClients
        ? updatedata.selectedClients.split(",").filter(x => x).map(Number)
        : [],
      selectedJobs: updatedata?.selectedJobs
        ? updatedata.selectedJobs.split(",").filter(x => x).map(Number)
        : [],
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
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
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
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        phone: values.phone,
        phone_code: values.phone_code,
        role_id: values.role,
        status: values.status,
        staff_to: values.staff_to,
        allCustomerAccess: values.allCustomerAccess,
        selectedClients: values.selectedClients,
        selectedJobs: values.selectedJobs,
        customer_contact_person_role_id: values.customer_contact_person_role_id,
        created_by: staffDetails.id,
        action: type === "edit" ? "updateCustomerUsers" : "addCustomerUsers",
        staff_id: staffDetails.id,
        customer_user_id: updatedata?.id,
      };

      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${type === "edit" ? "update" : "add"} this customer user?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Yes, ${type === "edit" ? "update" : "add"} it!`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const data = { req, authToken: token };
            const response = await dispatch(getAllCustomerUsers(data)).unwrap();

            if (response.status) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text:
                  response.message ||
                  `Customer user ${type === "edit" ? "updated" : "added"} successfully`,
              }).then(() => {
                setShowAddCustomerModal(false);
                formik.resetForm();
                GetAllCustomerData(1, pageSize, "");
                setType("");
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: response.message || "Failed to process request",
              });
            }
          } catch (error) {
            Swal.fire({
              title: "Error",
              text:
                error.message ||
                error ||
                "An error occurred while processing request",
              icon: "error",
            });
          }
        }
      });
    },
  });

  const isFirstRender = useRef(true);
  const prevCustomerAccess = useRef(formik.values.allCustomerAccess);

  useEffect(() => {
    // Reset initial load flag when modal closes
    if (!showAddCustomerModal) {
      isFirstRender.current = true;
      return;
    }

    // Initialize baseline on first open
    if (isFirstRender.current) {
      prevCustomerAccess.current = formik.values.allCustomerAccess;
      isFirstRender.current = false;
      return;
    }

    // Only auto-select for customers that were NOT in the initial list (genuinely newly added by user)
    const added = (formik.values.allCustomerAccess || []).filter(id =>
      !(prevCustomerAccess.current || []).includes(id) &&
      !(formik.initialValues.allCustomerAccess || []).includes(id)
    );

    const removed = (prevCustomerAccess.current || []).filter(id =>
      !(formik.values.allCustomerAccess || []).includes(id)
    );

    let newSelectedClients = [...(formik.values.selectedClients || [])];
    let newSelectedJobs = [...(formik.values.selectedJobs || [])];

    if (added.length > 0) {
      added.forEach(customerId => {
        const clients = allClients.filter(c => c.customer_id === customerId);
        clients.forEach(client => {
          if (!newSelectedClients.includes(client.id)) newSelectedClients.push(client.id);
          const jobs = allJobs.filter(j => j.client_id === client.id);
          jobs.forEach(job => {
            if (!newSelectedJobs.includes(job.id)) newSelectedJobs.push(job.id);
          });
        });
      });
      formik.setFieldValue("selectedClients", newSelectedClients);
      formik.setFieldValue("selectedJobs", newSelectedJobs);
    }

    if (removed.length > 0) {
      removed.forEach(customerId => {
        const clients = allClients.filter(c => c.customer_id === customerId);
        const clientIds = clients.map(c => c.id);
        newSelectedClients = newSelectedClients.filter(id => !clientIds.includes(id));

        const jobs = allJobs.filter(j => j.customer_id === customerId);
        const jobIds = jobs.map(j => j.id);
        newSelectedJobs = newSelectedJobs.filter(id => !jobIds.includes(id));
      });
      formik.setFieldValue("selectedClients", newSelectedClients);
      formik.setFieldValue("selectedJobs", newSelectedJobs);
    }
    prevCustomerAccess.current = formik.values.allCustomerAccess;
  }, [formik.values.allCustomerAccess, allClients, allJobs, showAddCustomerModal]);


  return (
    <div>
      <style>{customStyles}</style>
      <CommanModal
        isOpen={showAddCustomerModal}
        backdrop="static"
        size="xl"
        title={type === "edit" ? "Update Customer User" : "Add Customer User"}
        className="premium-modal"
        hideBtn={true}
        handleClose={() => {
          setShowAddCustomerModal(false);
          prevCustomerAccess.current = [];
          formik.resetForm();
        }}

      >
        <Formicform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name={type === "edit" ? "Update" : "Add"}
          closeBtn={(e) => {
            formik.resetForm();
            prevCustomerAccess.current = [];
            setShowAddCustomerModal(false);
          }}
          additional_field={
            formik.values.allCustomerAccess && formik.values.allCustomerAccess.length > 0 && (
              <div className="job-assignment-wrapper">
                <div className="job-assignment-header">
                  <h5 className="section-title">
                    <i className="ti-briefcase"></i> Assign Jobs for Selected Customers
                  </h5>
                </div>
                <div className="job-assignment-scroll-area">
                  <div className="accordion " id="customerAccordion">
                    {formik.values.allCustomerAccess.map((customerId) => {
                      const customer = allCustomers.find((c) => c.id === customerId);
                      if (!customer) return null;

                      const customerClients = allClients.filter((c) => c.customer_id === customerId);

                      return (
                        <div key={customerId} className="accordion-item">
                          <h2 className="accordion-header" id={`heading-${customerId}`}>
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse-${customerId}`}
                              aria-expanded="false"
                              aria-controls={`collapse-${customerId}`}
                            >
                              Customer: {customer.trading_name}
                            </button>
                          </h2>
                          <div
                            id={`collapse-${customerId}`}
                            className="accordion-collapse collapse"
                            aria-labelledby={`heading-${customerId}`}
                          >
                            <div className="accordion-body p-2">
                              {customerClients.length > 0 ? (
                                customerClients.map((client) => {
                                  const clientJobs = allJobs.filter((j) => j.client_id === client.id);
                                  const isAllSelected = clientJobs.length > 0 && clientJobs.every((j) => formik.values.selectedJobs?.includes(j.id));

                                  return (
                                    <div key={client.id} className="client-card">
                                      <div className="client-header">
                                        <div className="form-check m-0">
                                          <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`client-${client.id}`}
                                            checked={formik.values.selectedClients?.includes(client.id)}
                                            onChange={(e) => {
                                              let newSelectedClients = [...(formik.values.selectedClients || [])];
                                              let newSelectedJobs = [...(formik.values.selectedJobs || [])];
                                              const jobIds = clientJobs.map((j) => j.id);

                                              if (e.target.checked) {
                                                newSelectedClients.push(client.id);
                                                jobIds.forEach(id => {
                                                  if (!newSelectedJobs.includes(id)) newSelectedJobs.push(id);
                                                });
                                              } else {
                                                newSelectedClients = newSelectedClients.filter(id => id !== client.id);
                                                newSelectedJobs = newSelectedJobs.filter(id => !jobIds.includes(id));
                                              }
                                              formik.setFieldValue("selectedClients", newSelectedClients);
                                              formik.setFieldValue("selectedJobs", newSelectedJobs);
                                            }}
                                          />
                                          <label className="client-title ms-1 mb-0" htmlFor={`client-${client.id}`}>
                                            {client.trading_name}
                                          </label>
                                        </div>
                                        <span
                                          className="select-all-link"
                                          onClick={() => {
                                            const jobIds = clientJobs.map((j) => j.id);
                                            let newSelectedJobs = [...(formik.values.selectedJobs || [])];
                                            let newSelectedClients = [...(formik.values.selectedClients || [])];

                                            if (!isAllSelected) {
                                              jobIds.forEach((id) => {
                                                if (!newSelectedJobs.includes(id)) newSelectedJobs.push(id);
                                              });
                                              if (!newSelectedClients.includes(client.id)) newSelectedClients.push(client.id);
                                            } else {
                                              newSelectedJobs = newSelectedJobs.filter((id) => !jobIds.includes(id));
                                            }
                                            formik.setFieldValue("selectedJobs", newSelectedJobs);
                                            formik.setFieldValue("selectedClients", newSelectedClients);
                                          }}
                                        >
                                          {isAllSelected ? 'Deselect All' : 'Select All Jobs'}
                                        </span>
                                      </div>
                                      <div className="job-grid">
                                        {clientJobs.length > 0 ? (
                                          clientJobs.map((job) => (
                                            <div key={job.id} className="job-item">
                                              <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`job-${job.id}`}
                                                checked={formik.values.selectedJobs && formik.values.selectedJobs.includes(job.id)}
                                                onChange={(e) => {
                                                  let newSelectedJobs = [...(formik.values.selectedJobs || [])];
                                                  let newSelectedClients = [...(formik.values.selectedClients || [])];
                                                  if (e.target.checked) {
                                                    newSelectedJobs.push(job.id);
                                                    if (!newSelectedClients.includes(client.id)) newSelectedClients.push(client.id);
                                                  } else {
                                                    newSelectedJobs = newSelectedJobs.filter((id) => id !== job.id);
                                                  }
                                                  formik.setFieldValue("selectedJobs", newSelectedJobs);
                                                  formik.setFieldValue("selectedClients", newSelectedClients);
                                                }}
                                              />
                                              <label htmlFor={`job-${job.id}`} title={job.job_id}>
                                                {job.job_id}
                                              </label>
                                            </div>
                                          ))
                                        ) : (
                                          <div className="p-2 small text-muted">No jobs found</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-muted small p-2">No clients found</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          }
        />
      </CommanModal>

      <CommanModal
        isOpen={showTransferModal}
        backdrop="static"
        size="md"
        title="Transfer Assignments & Delete"
        className="premium-modal"
        hideBtn={true}
        handleClose={() => {
          setShowTransferModal(false);
          setTransferUserId("");
          setSelectedUserForDeletion(null);
        }}
      >
        <div className="p-2">
          <div className="transfer-alert">
            <AlertCircle size={20} className="me-2 text-warning" />
            <div>
              <p className="mb-1 fw-bold text-dark" style={{ fontSize: '0.95rem' }}>Important Action Required</p>
              <p className="mb-0 text-muted small">
                This user has active Customer, Job, and Client assignments. You must transfer these to another customer user before deletion.
              </p>
            </div>
          </div>

          <div className="transfer-card shadow-sm border-0 bg-light">
            <div className="d-flex align-items-center mb-3">
              <div className="transfer-icon-wrapper me-3">
                <Trash2 size={22} className="text-danger" />
              </div>
              <div>
                <h6 className="mb-0 fw-bold">User for Deletion</h6>
                <p className="text-muted small mb-0">{selectedUserForDeletion?.first_name} {selectedUserForDeletion?.last_name}</p>
              </div>
            </div>

            <div className="user-info-box mb-2">
              <div className="d-flex flex-wrap">
                <span className="assignment-badge bg-info text-white">
                  <User size={12} className="me-1" /> {selectedUserForDeletion?.customerCount || 0} Customers
                </span>
                <span className="assignment-badge badge-clients">
                  <User size={12} className="me-1" /> {selectedUserForDeletion?.clientCount || 0} Clients
                </span>
                <span className="assignment-badge badge-jobs">
                  <Clock size={12} className="me-1" /> {selectedUserForDeletion?.jobCount || 0} Jobs
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label d-flex align-items-center mb-2">
              <ArrowRightLeft size={16} className="me-2 text-primary" />
              Transfer all assignments to:
            </label>
            <Select
              options={allOtherUsers}
              value={allOtherUsers.find(opt => opt.value === transferUserId)}
              onChange={(selected) => setTransferUserId(selected?.value)}
              placeholder="Select replacement customer user..."
              className="premium-select"
              isSearchable
            />
          </div>

          <div className="d-flex gap-3 mt-4 pt-3 border-top">
            <button
              className="btn btn-danger w-100 py-2 fw-bold"
              onClick={handleTransferAndDelete}
              disabled={isTransferring || !transferUserId}
            >
              {isTransferring ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                "Transfer & Delete"
              )}
            </button>
            <button
              className="btn btn-outline-secondary w-100 py-2 fw-bold"
              onClick={() => setShowTransferModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
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
                  <Plus size={16} />
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
                          <div className="col-md-6">
                            <button
                              className="btn btn-outline-info fw-bold float-end border-3 "
                              onClick={handleExport}
                            >
                              <Download size={16} /> {" "}
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