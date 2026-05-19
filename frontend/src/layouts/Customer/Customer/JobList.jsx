import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import {
  CustomerJobList,
  updateCustomerJobStatus,
  GetCustomerDropdown,
  CustomerClientList,
  getCustomerMasterStatus,
  CustomerJobAction,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";

import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAccess } from "../../../Utils/CustomerAccessContext";
import sweatalert from "sweetalert2";
import Swal from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Download, Plus, Briefcase, User, Phone, Mail } from "lucide-react";

import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";
const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { hasAccess, hasAnyJobAccess, selectedCustomer, loading: accessLoading } = useCustomerAccess();

  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const cust_id_sidebar = sessionStorage.getItem("cust_id_sidebar");
  const cli_id_sidebar = sessionStorage.getItem("cli_id_sidebar");

  const cust_id_sidebar_name = sessionStorage.getItem("cust_id_sidebar_name");
  const cli_id_sidebar_name = sessionStorage.getItem("cli_id_sidebar_name");

  const [customerDataAll, setCustomerDataAll] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    id: cust_id_sidebar || "",
    trading_name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [jobLoading, setJobLoading] = useState(false);
  const debounceRef = useRef(null);

  // Removed permission-based redirect as requested
  // useEffect(() => {
  //   if (!accessLoading && !hasAccess("job", "view") && role !== "SUPERADMIN") {
  //     navigate("/customer/dashboard");
  //   }
  // }, [hasAccess, role, navigate, accessLoading]);

  useEffect(() => {
    GetAllCustomer();
    GetStatus();
  }, []);

  useEffect(() => {
    const id = selectedCustomer.value === "All" ? "" : selectedCustomer.value;
    const name = selectedCustomer.label === "All" ? "" : selectedCustomer.label;

    setCustomerDetails({ id: id, trading_name: selectedCustomer.label });

    if (id) {
      GetAllClientData(id, selectedCustomer.label);
    } else {
      GetAllJobListByCustomer("", 1, pageSize, searchTerm);
      setClientData([]);
      setClientDetailSingle({ id: "", client_name: "" });
      setHararchyData({
        customer: { id: id, trading_name: name },
        client: { id: "", client_name: "" },
      });
    }
  }, [selectedCustomer, pageSize]);



  const getAllClientData1 = async (
    customer_id,
    customer_name,
    client_id,
    client_name,
  ) => {
    const req = { staff_id: staffDetails.id, customer_id: customer_id };
    const data = { req: req, authToken: token };
    await dispatch(CustomerClientList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setClientData(response.data);
          GetClientDetails(client_id);
          GetAllJobList(client_id);
          setClientDetailSingle({ id: client_id, client_name: client_name });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetAllCustomer = async () => {
    const req = { staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(GetCustomerDropdown(data))
      .unwrap()
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

  const [clientData, setClientData] = useState([]);
  const [clientDetailSingle, setClientDetailSingle] = useState({
    id: cli_id_sidebar || "",
    client_name: "",
  });

  const GetAllClientData = async (id, name) => {
    const req = {
      staff_id: staffDetails.id,
      customer_id: id,
      page: 1,
      limit: 100000,
      search: "",
    };
    const data = { req: req, authToken: token };
    await dispatch(CustomerClientList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setClientData(response.data);
          sessionStorage.removeItem("cli_id_sidebar");
          setClientDetailSingle({ id: "", client_name: "" });
          setHararchyData({
            customer: { id: id, trading_name: name },
            client: { id: "", client_name: "" },
          });
          GetAllJobListByCustomer(id, 1, pageSize, searchTerm);
          setActiveTab("NoOfJobs");
        } else {
          setClientData([]);
          setClientDetailSingle({ id: "", client_name: "" });
        }
      })
      .catch((error) => {
        return;
      });
  };


  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState("NoOfJobs");
  const [getClientDetails, setClientDetails] = useState({
    loading: true,
    data: [],
  });
  const [informationData, informationSetData] = useState([]);
  const [clientInformationData, setClientInformationData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [hararchyData, setHararchyData] = useState({
    customer: {},
    client: {},
    job: {},
  });
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [selectStatusIs, setStatusId] = useState("");


  const GetClientDetails = async (client_id) => {
    const req = { action: "getByid", client_id: client_id, staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(CustomerClientList(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientDetails({
            loading: false,
            data: response.data,
          });
          informationSetData(response.data.client);
          setClientInformationData(response.data.contact_details[0]);
          setCompanyDetails(response.data.company_details);
        } else {
          setClientDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const tabs = [
    { id: "NoOfJobs", label: "No. Of Jobs", icon: <Briefcase size={16} /> },
    ...(clientDetailSingle.id !== "" && hasAccess("client_overview", "view")
      ? [{ id: "view client", label: "View Client", icon: <User size={16} /> }]
      : []),
  ];

  const GetStatus = async () => {
    await dispatch(getCustomerMasterStatus({ req: { action: "get" }, authToken: token }))
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
      });
  };

  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "Do you want to change the status?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "No, cancel",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const req = { job_id: row.job_id, status_type: Number(Id), staff_id: staffDetails.id };
            const res = await dispatch(
              updateCustomerJobStatus({ req, authToken: token }),
            ).unwrap();

            if (res.status) {
              sweatalert.fire({
                title: "Success",
                text: res.message,
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
              });

              setStatusId(Id);

              if (clientDetailSingle.id) {
                GetAllJobList(
                  clientDetailSingle.id,
                  currentPage,
                  pageSize,
                  searchTerm,
                );
              } else {
                GetAllJobListByCustomer(
                  customerDetails.id || "",
                  currentPage,
                  pageSize,
                  searchTerm,
                );
              }
            } else if (res.data === "W") {
              sweatalert.fire({
                title: "Warning",
                text: res.message,
                icon: "warning",
                confirmButtonText: "Ok",
                timer: 3000,
                timerProgressBar: true,
              });
            } else {
              sweatalert.fire({
                title: "Error",
                text: res.message,
                icon: "error",
                confirmButtonText: "Ok",
                timer: 1000,
                timerProgressBar: true,
              });
            }
          } catch (error) {
            sweatalert.fire({
              title: "Error",
              text: "An error occurred while updating the status.",
              icon: "error",
              confirmButtonText: "Ok",
              timer: 1000,
              timerProgressBar: true,
            });
          }
        } else if (result.dismiss === sweatalert.DismissReason.cancel) {
          sweatalert.fire({
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

  const columns = [
    {
      name: "Job ID",
      cell: (row) => {
        return hasAnyJobAccess() ? (
          <div title={row.job_code_id}>
            <a
              onClick={() => HandleJob(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.job_code_id}
            </a>
          </div>
        ) : (
          <div title={row.job_code_id}>{row.job_code_id}</div>
        );
      },
      selector: (row) => row.job_code_id,
      sortable: true,
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
      cell: (row) => <div title={row.job_type_name}>{row.job_type_name}</div>,
      selector: (row) => row.job_type_name,
      sortable: true,
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
            disabled={!(hasAccess("job", "status_update") || role === "SUPERADMIN")}
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
      name: "Outbooks Account Manager",
      cell: (row) => (
        <div
          title={
            row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name
          }
        >
          {row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name}
        </div>
      ),
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name,
      sortable: true,
      width: "325px",
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
      sortFunction: (a, b) => {
        const aVal = a.invoiced == "1" ? "YES" : "NO";
        const bVal = b.invoiced == "1" ? "YES" : "NO";
        return aVal.localeCompare(bVal);
      },
    },
    ...((hasAccess("job", "update") || hasAccess("job", "copy") || hasAccess("job", "delete") || role === "SUPERADMIN") ? [
      {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex">
            {(hasAccess("job", "update") || role === "SUPERADMIN") && (
              <button className="edit-icon" onClick={() => handleEdit(row)}>
                <i className="ti-pencil" />
              </button>
            )}

            {(hasAccess("job", "copy") || role === "SUPERADMIN") && (
              <button className="copy-icon" onClick={() => copyRow(row)}>
                <i className="ti-files"></i>
              </button>
            )}

            {row.timesheet_job_id == null
              ? (hasAccess("job", "delete") || role === "SUPERADMIN") && (
                <button
                  className="delete-icon"
                  onClick={() => handleDelete(row, "job")}
                >
                  <i className="ti-trash text-danger" />
                </button>
              )
              : ""}
          </div>
        ),
        width: "180px",
        ignoreRowClick: true,
      }
    ] : []),
  ];

  const HandleJob = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        customer: {
          id: prevState?.customer?.id || row.customer_id,
          trading_name: prevState?.customer?.trading_name || row.customer_name || row.customer_trading_name
        },
        client: {
          id: prevState?.client?.id || row.client_id,
          client_name: prevState?.client?.client_name || row.client_trading_name || row.client_name
        },
        job: row,
      };
      navigate("/customer/job/logs", {
        state: {
          job_id: row?.job_id,
          timesheet_job_id: row?.timesheet_job_id,
          data: updatedData,
          goto: "client",
          activeTab: location?.state?.activeTab,
        },
      });
      return updatedData;
    });
  };

  function handleEdit(row) {
    navigate("/customer/job/edit", {
      state: {
        job_id: row.job_id,
        goto: "client",
        activeTab: location?.state?.activeTab,
      },
    });
  }

  const handleDelete = async (row, type) => {
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "Do you want to delete this " + type + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const req = {
            action: "delete",
            staff_id: staffDetails.id,
            ...(type === "job" ? { job_id: row.job_id } : { client_id: row.id }),
          };
          const data = { req: req, authToken: token };
          await dispatch(CustomerJobAction(data))
            .unwrap()
            .then(async (response) => {
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted",
                  icon: "success",
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1500,
                });

                type === "job"
                  ? GetAllJobList(clientDetailSingle.id)
                  : GetClientDetails(clientDetailSingle.id);
              } else {
                sweatalert.fire({
                  title: "Failed",
                  icon: "error",
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
              return;
            });

        } else if (result.dismiss === sweatalert.DismissReason.cancel) {
          sweatalert.fire({
            title: "Cancelled",
            text: type + " was not deleted",
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
            timerProgressBar: true,
          });
          return;
        }
      });
  };

  const copyRow = async (row) => {


    if (row?.has_client_job_task === 0) {
      sweatalert.fire({
        title: "warning",
        icon: "warning",
        showCloseButton: true,
        showCancelButton: false,
        showConfirmButton: false,
        confirmButtonText: "Ok",
        timerProgressBar: true,
        text: "Please add task first",
        timer: 1500,
      });
      return
    }

    sweatalert
      .fire({
        title: "Are you sure?",
        text: "You want to copy this job ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      })
      .then(async (result) => {
        if (result.isConfirmed) {


          if (!['', undefined, null, 0].includes(row.reviewer_id) || !['', undefined, null, 0].includes(row.allocated_id)) {
            sweatalert
              .fire({
                title: "Are you sure?",
                text: "While copying this job, do you want to include the Processor, Reviewer, and Checklist details ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                showCancelButton: true,
                showCloseButton: true,
                // allowOutsideClick: false
              })
              .then(async (result) => {
                if (result.isConfirmed) {
                  copyJobRequest(row, true);
                  return
                }
                else if (result.dismiss === Swal.DismissReason.cancel) {
                  copyJobRequest(row, false);
                  return;
                }
                else if (result.dismiss === Swal.DismissReason.close) {
                  return;
                }
                else {
                  return;
                }
              });
          } else {
            copyJobRequest(row, true);
            return;
          }


        } else {
          return;
        }
      });
  };

  const copyJobRequest = async (row, field = true) => {

    const req = {
      action: "copy_job",
      row: row,
      field: field,
      staff_id: staffDetails.id
    };
    const data = { req: req, authToken: token };
    await dispatch(CustomerJobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: "Job copied successfully",
            icon: "success",
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500,
          });
          GetAllJobListByCustomer("", 1, pageSize, "");

        } else {
          sweatalert.fire({
            title: "Failed",
            icon: "error",
            showCancelButton: false,
            showConfirmButton: false,
            message: response.message,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        return;
      });

  }

  const GetAllJobList = async (
    client_id,
    page = currentPage,
    limit = pageSize,
    search = searchTerm,
  ) => {
    setJobLoading(true);

    const req = {
      action: "getByClient",
      client_id,
      staff_id: staffDetails.id,
      page,
      limit,
      search,
    };

    const data = { req, authToken: token };

    await dispatch(CustomerJobList(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setCustomerData(response.data || []);
          setTotalRecords(response.pagination?.total || 0);
        } else {
          setCustomerData([]);
          setTotalRecords(0);
        }
      })
      .finally(() => {
        setJobLoading(false);
      });
  };

  const GetAllJobListByCustomer = async (
    customer_id,
    page = currentPage,
    limit = pageSize,
    search = searchTerm,
  ) => {
    setJobLoading(true);

    const req = {
      action: "getByCustomer",
      customer_id,
      staff_id: staffDetails.id,
      page,
      limit,
      search,
    };

    const data = { req: req, authToken: token };

    await dispatch(CustomerJobList(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setCustomerData(response.data || []);
          setTotalRecords(response.pagination?.total || 0);
        } else {
          setCustomerData([]);
          setTotalRecords(0);
        }
      })
      .finally(() => {
        setJobLoading(false);
      });
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);

    if (clientDetailSingle.id) {
      GetAllJobList(clientDetailSingle.id, newPage, pageSize, searchTerm);
    } else {
      GetAllJobListByCustomer(
        customerDetails.id,
        newPage,
        pageSize,
        searchTerm,
      );
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);

    if (clientDetailSingle.id) {
      GetAllJobList(clientDetailSingle.id, 1, newSize, searchTerm);
    } else {
      GetAllJobListByCustomer(customerDetails.id, 1, newSize, searchTerm);
    }
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (clientDetailSingle.id) {
        GetAllJobList(clientDetailSingle.id, 1, pageSize, value);
      } else {
        GetAllJobListByCustomer(customerDetails.id, 1, pageSize, value);
      }
    }, 500);
  };

  const handleCreateJob = (row) => {
    if (getClientDetails?.data?.client?.customer_id) {
      navigate("/customer/createjob", {
        state: {
          customer_id: getClientDetails?.data?.client?.customer_id,
          clientName: clientDetailSingle,
          goto: "client",
          activeTab: "client",
        },
      });
    }
  };

  const selectCustomerId = (id, name) => {
    setCustomerDetails({ id: id, trading_name: name || "" });
    setHararchyData({
      customer: { id: id, trading_name: name || "" },
      client: { id: "", client_name: "" },
    });
    setCurrentPage(1);
    if (id) {
      GetAllClientData(id, name);
    } else {
      GetAllJobListByCustomer("", 1, pageSize, searchTerm);
      setClientData([]);
      setClientDetailSingle({ id: "", client_name: "" });
    }
  };

  const selectClientId = (id, name) => {
    if (id != "") {
      // Specific client selected
      sessionStorage.setItem("cli_id_sidebar", id);
      sessionStorage.setItem("cli_id_sidebar_name", name);
      GetAllJobList(id);
      GetClientDetails(id);
      setClientDetailSingle({ id: id, client_name: name });
      setHararchyData({
        customer: customerDetails,
        client: { id: id, client_name: name },
      });
      setActiveTab("NoOfJobs");
    } else {
      // CHANGED: "All" selected - customer ki saari jobs dikhao
      sessionStorage.removeItem("cli_id_sidebar");
      setClientDetailSingle({ id: "", client_name: "" });
      setHararchyData({
        customer: customerDetails,
        client: { id: "", client_name: "" },
      });
      setClientDetails({ loading: false, data: [] });
      informationSetData([]);
      setClientInformationData([]);
      setCompanyDetails([]);
      // CHANGED: Customer ki saari jobs fetch karo
      GetAllJobListByCustomer(customerDetails.id, 1, pageSize, searchTerm);
      setCurrentPage(1);
      setActiveTab("NoOfJobs");
    }
  };

  const exportData = customerData.map((item) => ({
    "Job Code Id": item.job_code_id,
    "Job Priority": item.job_priority,
    "Client Trading Name": item.client_trading_name,
    "Job Type Name": item.job_type_name,
    "Account Manager":
      item.account_manager_officer_first_name +
      " " +
      item.account_manager_officer_last_name,
    "Outbooks Account Manager":
      item.outbooks_acount_manager_first_name +
      " " +
      item.outbooks_acount_manager_last_name,
    Invoiced: item.invoiced == "1" ? "YES" : "NO",
    Status: item.status,
  }));

  const customerOptions = [
    { value: "", label: "All" },
    ...(customerDataAll || [])
      .filter(
        (val) => Number(val.status) === 1 && Number(val.form_process) === 4,
      )
      .map((val) => ({
        value: val.id,
        label: val.trading_name,
      })),
  ];

  const selectedOption =
    customerDetails.id === ""
      ? { value: "", label: "All" }
      : customerOptions.find(
        (opt) => Number(opt.value) === Number(customerDetails.id),
      );

  // CHANGED: Client options mein "All" option sabse pehle add kiya
  const clientOptions = [
    { value: "", label: "All" },
    ...(clientData || []).map((client) => ({
      value: client.id,
      label: client.client_name,
    })),
  ];

  // CHANGED: "All" select hone par selectedOptionClient = { value: "", label: "All" }
  const selectedOptionClient =
    clientDetailSingle.id === ""
      ? { value: "", label: "All" }
      : clientOptions.find(
        (opt) => Number(opt.value) === Number(clientDetailSingle.id),
      );

  const handleExport = async () => {
    setLoading(true);
    const req = {
      action: "getByCustomer",
      customer_id: customerDetails.id || "",
      page: 1,
      limit: 100000,
      search: "",
    };

    const data = { req: req, authToken: token };
    const response = await dispatch(CustomerJobList(data)).unwrap();
    if (!response.status) {
      alert("No data to export!");
      setLoading(false);
      return;
    }
    const apiData = response?.data;

    if (!apiData || apiData.length === 0) {
      alert("No data to export!");
      setLoading(false);
      return;
    }

    const exportData = apiData?.map((item) => ({
      "Job Code Id": item.job_code_id || "-",
      "Job Priority": item.job_priority || "-",
      "Client Trading Name": item.client_trading_name || "-",
      "Job Type Name": item.job_type_name || "-",
      "Outbooks Account Manager":
        item.outbooks_acount_manager_first_name +
        " " +
        item.outbooks_acount_manager_last_name || "-",
      Invoiced: item.invoiced == "1" ? "YES" : "NO" || "-",
      Status: item.status || "-",
    }));

    setLoading(false);

    downloadCSV(exportData, "Job Details.csv");
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
      {loading && (
        <div className="overlay">
          <div className="loader"></div>
        </div>
      )}
      <div className="content-title">
        <div className="row">
          {selectedCustomer.value === "All" && (hasAccess("customer", "view") || role === "SUPERADMIN") && (
            <div className="form-group col-md-4 mb-0">
              <label className="form-label mb-2">Customer</label>
              <Select
                id="tabSelect"
                name="staff_id"
                className="basic-multi-select"
                options={customerOptions}
                value={selectedOption}
                onChange={(selected) => {
                  const selectedCustomerRow = customerDataAll.find(
                    (customer) => customer.id == selected.value,
                  );
                  selectCustomerId(
                    selected.value,
                    selectedCustomerRow?.trading_name,
                  );
                }}
                classNamePrefix="react-select"
                isSearchable
                placeholder="All"
              />
            </div>
          )}

          {(customerDetails.id != "" || selectedCustomer.value !== "All") && (
            <>
              {(hasAccess("client", "view") || role === "SUPERADMIN") && (
                <div className="form-group col-md-4 mb-0">
                  <label className="form-label mb-2">Client</label>
                  {clientData.length == 0 ? (
                    <input
                      type="text"
                      className="form-select"
                      disabled
                      value={"The customer's client is not available."}
                    />
                  ) : (
                    // CHANGED: "All" option add kiya, aur value="" ho to "All" show karo
                    <Select
                      id="tabSelect"
                      name="staff_id"
                      className="basic-multi-select"
                      classNamePrefix="react-select"
                      isSearchable
                      options={clientOptions}
                      value={selectedOptionClient}
                      onChange={(selected) => {
                        if (selected.value === "") {
                          // "All" selected
                          selectClientId("", "");
                        } else {
                          const selectedClient = clientData.find(
                            (client) => client.id == selected.value,
                          );
                          selectClientId(
                            selected.value,
                            selectedClient?.client_name,
                          );
                        }
                      }}
                      placeholder="Select Client"
                    />
                  )}
                </div>
              )}

              <div className="page-title-box pt-2 ps-3">
                <div className="row align-items-start flex-md-row flex-column-reverse justify-content-between">
                  <div className=" col-md-6 col-lg-8">
                    <ul
                      className="nav nav-pills rounded-tabs"
                      id="pills-tab"
                      role="tablist"
                    >
                      {tabs.map((tab) => (
                        <li
                          className="nav-item"
                          role="presentation"
                          key={tab.id}
                        >
                          <button
                            className={`nav-link ${activeTab === tab.id ? "active" : ""
                              }`}
                            id={`${tab.id}-tab`}
                            data-bs-toggle="pill"
                            data-bs-target={`#${tab.id}`}
                            type="button"
                            role="tab"
                            aria-controls={tab.id}
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                          >
                            {tab.icon}{" "} {tab.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activeTab == "NoOfJobs" && (
                    <>
                      <div className="col-md-6 col-lg-4 d-block col-sm-auto d-sm-flex justify-content-end ps-lg-0">
                        {(hasAccess("job", "add") || role === "SUPERADMIN") && clientDetailSingle.id != "" && (
                          <div
                            className="btn btn-info text-white blue-btn mt-2 mt-sm-0"
                            onClick={handleCreateJob}
                          >
                            <Plus size={16} /> Create Job
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {activeTab === "view client" && (
                    <div className="col-md-4 col-auto"></div>
                  )}
                </div>
              </div>

              <Hierarchy
                show={[
                  "Customer",
                  "Client",
                  activeTab == "NoOfJobs" ? "No. Of Jobs" : activeTab,
                ]}
                active={2}
                data={hararchyData}
                NumberOfActive={activeTab == "NoOfJobs" ? totalRecords : ""}
              />
            </>
          )}
        </div>

        <div className="mt-2">
          {activeTab == "NoOfJobs" && (
            <div
              className={`tab-pane fade ${activeTab == "NoOfJobs" ? "show active" : ""
                }`}
              id={"NoOfJobs"}
              role="tabpanel"
              aria-labelledby={`NoOfJobs-tab`}
            >
              <div className="">
                <div className="report-data mt-4 ">
                  <div className="d-flex justify-content-between align-items-center">
                    <ul className="nav nav-tabs border-0 mb-3" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active"
                          id="assignedjob-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#assignedjob"
                          type="button"
                          role="tab"
                          aria-controls="assignedjob"
                          aria-selected="true"
                          tabIndex={-1}
                        >
                          Assigned Jobs
                        </button>
                      </li>
                    </ul>


                  </div>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade active show"
                      id="assignedjob"
                      role="tabpanel"
                      aria-labelledby="assignedjob-tab"
                    >
                      <div className="row d-flex justify-content-between align-items-center">
                        <div className="col-md-3 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">

                          {(hasAccess("job", "export") || role === "SUPERADMIN") && (
                            <div className="col-md-4">
                              <button
                                className="btn btn-outline-info fw-bold float-end border-3 d-inline-flex align-items-center gap-2 lh-1"
                                onClick={handleExport}
                              >
                                <Download size={16} />

                                <span>Export Excel</span>
                              </button>
                            </div>
                          )}


                        </div>


                      </div>

                      <div className="datatable-wrapper ">
                        {jobLoading && (
                          <div className="overlay">
                            <div className="loader"></div>
                          </div>
                        )}

                        <Datatable
                          columns={columns}
                          data={customerData}
                          filter={false}
                          pagination={false}
                        />

                        {customerData && customerData.length > 0 && (
                          <>
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
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="alljob"
                      role="tabpanel"
                      aria-labelledby="alljob-tab"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab == "view client" && clientInformationData && (
            <div className="tab-content" id="pills-tabContent">
              <div className="report-data">
                <div className="card-body">
                  <div className="dastyle-profile">
                    <div className="row">
                      <div className="col-md-4 col-sm-12 col-lg-4 align-self-center mb-3 mb-lg-0">
                        <div className="dastyle-profile-main">
                          <div className="dastyle-profile-main-pic">
                            <span className="dastyle-profile_main-pic-change">
                              <i className="ti-user"></i>
                            </span>
                          </div>
                          <div className="dastyle-profile_user-detail">
                            <h5 className="dastyle-user-name">
                              {clientInformationData.first_name +
                                " " +
                                clientInformationData.last_name}
                            </h5>
                            <p className="mb-0 dastyle-user-name-post">
                              Client Code: {informationData.client_code}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 col-sm-6 col-lg-4 ml-auto align-self-center">
                        <ul className="list-unstyled personal-detail mb-0">
                          <li className="">
                            <Phone
                              size={22}
                              className="me-2 text-secondary align-middle"
                            />
                            <b>Phone : </b>
                            {(clientInformationData &&
                              clientInformationData.phone &&
                              clientInformationData.phone_code +
                              " " +
                              clientInformationData.phone) ||
                              "NA"}
                          </li>
                          <li className="mt-2">
                            <Mail
                              size={22}
                              className="text-secondary align-middle me-2"
                            />
                            <b>Email : </b>{" "}
                            {(clientInformationData &&
                              clientInformationData.email) ||
                              "NA"}
                          </li>
                        </ul>
                      </div>

                      <div className=" col-md-4 col-sm-6 col-lg-4 align-self-center mt-2 mt-sm-0">
                        <ul className="list-unstyled personal-detail mb-0">
                          <li className="row">
                            <div className="col-md-12">
                              <b>Trading Name :</b>{" "}
                              {(informationData &&
                                informationData.trading_name) ||
                                "NA"}
                            </div>
                          </li>
                          <li className="mt-2 row">
                            <div className="col-md-12">
                              <b>Trading Address :</b>{" "}
                              {(informationData &&
                                informationData.trading_address) ||
                                "NA"}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {informationData.client_type == 4 ? (
                ""
              ) : (
                <div className=" report-data mt-4">
                  <div className="card-header border-bottom pb-3 row">
                    <div className="col-8">
                      <h4 className="card-title">
                        {informationData && informationData.client_type == 1
                          ? "Sole Trader"
                          : informationData.client_type == 2
                            ? "Company"
                            : informationData.client_type == 3
                              ? "Partnership"
                              : ""}
                      </h4>
                    </div>
                  </div>

                  {informationData.client_type == 1 ? (
                    <div className="card-body pt-3">
                      <div className="row">
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b>Trading Name :</b>{" "}
                              {informationData.trading_name || "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">VAT Registered : </b>
                              {informationData.vat_registered == 0
                                ? "No"
                                : "Yes"}
                            </li>
                            <li className="mb-4">
                              <b className="">Website : </b>
                              {informationData.website || "NA"}
                            </li>
                          </ul>
                        </div>
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b className="">Trading Address :</b>{" "}
                              {informationData.trading_address || "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">VAT Number :</b>{" "}
                              {informationData.vat_number || "NA"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : informationData.client_type == 2 ? (
                    <div className="card-body pt-3">
                      <div className="row">
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b className="">Company Name : </b>{" "}
                              {companyDetails.company_name || "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">Company Status :</b>{" "}
                              {companyDetails.company_status || "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">Registered Office Address :</b>{" "}
                              {companyDetails.registered_office_address || "NA"}
                            </li>
                          </ul>
                        </div>
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b className="">Entity Type :</b>{" "}
                              {companyDetails.entity_type || "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">Company Number :</b>{" "}
                              {companyDetails.company_number || "NA"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : informationData.client_type == 3 ? (
                    <div className="card-body pt-3">
                      <div className="row">
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b className="">Trading Name :</b>{" "}
                              {(informationData &&
                                informationData.trading_name) ||
                                "NA"}
                              <p className="font-14  ml-3"></p>
                            </li>
                            <li className="mb-4">
                              <b className="">VAT Registered :</b>{" "}
                              {informationData &&
                                informationData.vat_registered == "0"
                                ? "No"
                                : "Yes"}
                            </li>
                            <li className="mb-4">
                              <b className="">Website :</b>{" "}
                              {(informationData && informationData.website) ||
                                "NA"}
                            </li>
                          </ul>
                        </div>
                        <div className="col-lg-6">
                          <ul className="list-unstyled faq-qa">
                            <li className="mb-4">
                              <b className="">Trading Address :</b>{" "}
                              {(informationData &&
                                informationData.trading_address) ||
                                "NA"}
                            </li>
                            <li className="mb-4">
                              <b className="">VAT Number :</b>{" "}
                              {(informationData &&
                                informationData.vat_number) ||
                                "NA"}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
