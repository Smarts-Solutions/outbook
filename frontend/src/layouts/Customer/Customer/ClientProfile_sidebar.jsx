import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import {
  CustomerJobAction,
  updateCustomerJobStatus,
  GetCustomerDropdown,
  CustomerClientList,
  CustomerClientAction,
  CustomerJobList,
  getCustomerMasterStatus,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import sweatalert from "sweetalert2";
import Swal from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import { Save, Plus, ArrowLeft, Pencil, X, ExternalLink, RotateCcw, Clock, AlertCircle, Info, CheckCircle2, PlayCircle, FileText, File, Phone, Mail, Download, Briefcase, User, ArrowRight } from "lucide-react";
import { Formik, Field, Form } from "formik";
import {
  fetchSiteAndDriveInfo,
  createFolderIfNotExists,
  uploadFileToFolder,
  SiteUrlFolderPath,
  deleteFileFromFolder,
} from "../../../Utils/graphAPI";
import { allowedTypes } from "../../../Utils/Comman_function";
import { Button } from "antd";

import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";

const CustomerClientProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

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
  const fileInputRef = useRef(null);

  const [fileState, setFileState] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");

  const [fileStateClient, setFileStateClient] = useState([]);

  useEffect(() => {
    GetAllCustomer();
    GetStatus();
    fetchSiteDetails();

    if (location.state && location.state.Client_id) {
      const { Client_id, data, customer_id } = location.state;
      const effectiveCustomerId = customer_id || (data && data.customer ? data.customer.id : cust_id_sidebar);
      
      setClientDetailSingle({ 
        id: Client_id, 
        client_name: data?.client?.client_name || data?.client?.trading_name || cli_id_sidebar_name || "" 
      });

      if (effectiveCustomerId) {
        setCustomerDetails({
          id: effectiveCustomerId,
          trading_name: data?.customer?.trading_name || cust_id_sidebar_name || ""
        });
      }

      setHararchyData(data || { 
        customer: { id: effectiveCustomerId, trading_name: cust_id_sidebar_name || "" },
        client: { id: Client_id, client_name: "" }
      });

      GetClientDetails(Client_id);
      GetAllJobList(Client_id);
    } else if (cust_id_sidebar && cli_id_sidebar) {
      setClientDetailSingle({ id: cli_id_sidebar, client_name: cli_id_sidebar_name || "" });
      setCustomerDetails({ id: cust_id_sidebar, trading_name: cust_id_sidebar_name || "" });
      setHararchyData({
        customer: { id: cust_id_sidebar, trading_name: cust_id_sidebar_name },
        client: { id: cli_id_sidebar, client_name: cli_id_sidebar_name },
      });
      GetClientDetails(cli_id_sidebar);
      GetAllJobList(cli_id_sidebar);
    } else if (cust_id_sidebar) {
      setCustomerDetails({ id: cust_id_sidebar, trading_name: cust_id_sidebar_name });
      setHararchyData({
        customer: { id: cust_id_sidebar, trading_name: cust_id_sidebar_name },
        client: { id: "", client_name: "" },
      });
      GetAllClientData(cust_id_sidebar, cust_id_sidebar_name);
    }
  }, []);

  const fetchSiteDetails = async () => {
    const data = await SiteUrlFolderPath();
    setSiteUrl(data.siteUrl);
    setSharepoint_token(data.sharepoint_token);
    setFolderPath(data.folderPath);
  };

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
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab === "client" ? "view client" : (location.state?.activeTab || "NoOfJobs")
  );
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
  const [getAccessDataJob, setAccessDataJob] = useState({
    insert: ["CUSTOMER", "SUPERADMIN"].includes(role?.toString().toUpperCase()) ? 1 : 0,
    update: ["CUSTOMER", "SUPERADMIN"].includes(role?.toString().toUpperCase()) ? 1 : 0,
    delete: ["CUSTOMER", "SUPERADMIN"].includes(role?.toString().toUpperCase()) ? 1 : 0,
    view: ["CUSTOMER", "SUPERADMIN"].includes(role?.toString().toUpperCase()) ? 1 : 0,
    all_jobs: ["CUSTOMER", "SUPERADMIN"].includes(role?.toString().toUpperCase()) ? 1 : 0,
  });

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job",
    )?.items || [];

  const accessDataJobAll =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_jobs",
    )?.items || [];

  useEffect(() => {
    const userRole = role?.toString().toUpperCase();
    if (userRole === "CUSTOMER" || userRole === "SUPERADMIN") {
      setAccessDataJob({
        insert: 1,
        update: 1,
        delete: 1,
        view: 1,
        all_jobs: 1,
      });
      return;
    }
    if (accessDataJob.length === 0) return;
    const updatedAccess = {
      insert: 0,
      update: 0,
      delete: 0,
      view: 0,
      all_jobs: 0,
    };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });

    accessDataJobAll.forEach((item) => {
      if (item.type === "view") updatedAccess.all_jobs = item.is_assigned;
    });

    setAccessDataJob(updatedAccess);
  }, [role]);

  const handleCreateJob = () => {
    navigate("/createjob", {
      state: {
        customer_id: customerDetails.id || hararchyData.customer.id,
        client_id: clientDetailSingle.id || hararchyData.client.id,
        client_name: clientDetailSingle.client_name || hararchyData.client.client_name,
        customer_name: customerDetails.trading_name || hararchyData.customer.trading_name,
        backPath: "/customer/client/profile"
      }
    });
  };

  const GetClientDetails = async (client_id) => {
    setLoading(true);
    const req = { action: "getByid", client_id: client_id, staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(CustomerClientAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setClientDetails({
            loading: false,
            data: response.data,
          });
          if (response.data.client_documents && response.data.client_documents.length > 0) {
            setFileStateClient(response.data.client_documents);
          }
          const client = response.data.client;
          informationSetData(client);
          
          // Smart mapping for different client types
          const contact = response.data.contact_details?.[0] || 
                          response.data.member_details?.[0] || 
                          response.data.beneficiaries_details?.[0] || 
                          {};
          setClientInformationData(contact);
          setCompanyDetails(response.data.company_details || []);
        } else {
          setClientDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const DocumentListColumns = [
    {
      name: "File Image",
      cell: (row) => (
        <div>
          {row.file_type?.startsWith("image/") ? (
            <img
              src={row.web_url}
              alt={row.original_name}
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          ) : row.file_type === "application/pdf" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <FileText size={20} color="#FF0000" />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <File size={20} color="#000" />
            </div>
          )}
        </div>
      ),
      selector: (row) => row.web_url,
      sortable: true,
    },
    {
      name: "File Name",
      cell: (row) => <div title={row.original_name || "-"}>{row.original_name || "-"}</div>,
      selector: (row) => row.original_name || "-",
      sortable: true,
    },
    {
      name: "File Type",
      cell: (row) => <div title={row.file_type || "-"}>{row.file_type || "-"}</div>,
      selector: (row) => row.file_type || "-",
      sortable: true,
    },
    {
      name: "File Size",
      cell: (row) => (
        <div title={row.file_size || "-"}>
          {row.file_size < 1024 * 1024
            ? `${(row.file_size / 1024).toFixed(2)} KB`
            : `${(row.file_size / (1024 * 1024)).toFixed(2)} MB` || "-"}
        </div>
      ),
      selector: (row) => row.file_size || "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="delete-icon me-2" onClick={() => removeItem(row, 2)}>
            <i className="ti-trash text-danger" />
          </button>
          <button
            className="download-icon"
            onClick={() =>
              downloadFileFromSharePoint(
                row.web_url,
                sharepoint_token,
                row.original_name,
              )
            }
          >
            <i className="ti-download text-primary" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const downloadFileFromSharePoint = async (sharePointFileUrl, accessToken, fileName) => {
    try {
      const response = await fetch(sharePointFileUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const fileBlob = await response.blob();
      const fileURL = window.URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = fileURL;
      downloadLink.download = fileName;
      downloadLink.click();
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.error("Error downloading the file:", error);
    }
  };

  const handleFileChange = (event) => {
    const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
    if (invalidTokens.includes(sharepoint_token)) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Unable to connect to SharePoint." });
      fileInputRef.current.value = "";
      return;
    }
    const files = event.currentTarget.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length !== fileArray.length) {
      sweatalert.fire({ icon: "error", title: "Oops...", text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed." });
      fileInputRef.current.value = "";
      return;
    }
    const existingFileNames = new Set(newFiles.map((file) => file.name));
    const uniqueValidFiles = validFiles.filter((file) => !existingFileNames.has(file.name));
    if (uniqueValidFiles.length === 0) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Files with the same name already exist." });
      return;
    }
    const updatedNewFiles = [...newFiles, ...uniqueValidFiles];
    setNewFiles(updatedNewFiles);
    const previewArray = updatedNewFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => { reader.onload = () => resolve(reader.result); });
    });
    Promise.all(previewArray).then((previewData) => { setPreviews(previewData); });
  };

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    setFileState([]);
    setNewFiles([]);
    setPreviews([]);
  };

  const handleDocumentSubmit = async (values) => {
    const invalidValues = [undefined, null, "", 0, "0"];
    let client_name = "CLIENT_DEMO";
    if (!invalidValues.includes(clientDetailSingle.id) && !invalidValues.includes(customerDetails.id)) {
      client_name = "CUST" + customerDetails.id + "_CLIENT" + clientDetailSingle.id;
    }

    const uploadedFilesArray = [];
    if (newFiles.length > 0) {
      const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
      if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
        setLoading(true);
        const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
        const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, client_name, sharepoint_token);

        for (const file of newFiles) {
          const uploadDataUrl = await uploadFileToFolder(site_ID, drive_ID, folderId, file, sharepoint_token);
          const uploadedFileInfo = {
            web_url: uploadDataUrl,
            filename: file.lastModified + "-" + file.name,
            originalname: file.name,
            mimetype: file.type,
            size: file.size,
          };
          uploadedFilesArray.push(uploadedFileInfo);
        }
        const req = {
          action: "addClientDocument",
          client_id: clientDetailSingle.id,
          uploadedFiles: uploadedFilesArray,
        };
        await dispatch(CustomerClientAction({ req, authToken: token }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              sweatalert.fire({ title: response.message, icon: "success", timer: 3000 }).then(() => {
                resetFileInput();
                GetClientDetails(clientDetailSingle.id);
                setLoading(false);
              });
            }
          })
          .catch(() => { setLoading(false); });
      }
    } else {
      sweatalert.fire({ icon: "warning", title: "Oops...", text: "Please select a file to upload." });
    }
  };

  const removeItem = async (file, type) => {
    if (type == 1) return;
    const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
    if (invalidTokens.includes(sharepoint_token)) {
      Swal.fire({ icon: "warning", title: "Oops...", text: "Unable to connect to SharePoint." });
      return;
    }

    sweatalert.fire({
      title: "Are you sure?",
      text: "You want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const req = { action: "deleteClientFile", doc_id: file.id || file.client_documents_id };
        await dispatch(CustomerClientAction({ req, authToken: token }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              sweatalert.fire({ title: "Deleted", icon: "success", timer: 1500, showConfirmButton: false });
              GetClientDetails(clientDetailSingle.id);
            }
          });
      }
    });
  };

  const tabs = [
    { id: "NoOfJobs", label: "No. Of Jobs", icon: <Briefcase size={16} /> },
    ...(clientDetailSingle.id !== "" || cli_id_sidebar !== ""
      ? [
          { id: "view client", label: "View Client", icon: <User size={16} /> },
          { id: "documents", label: "Documents", icon: <File size={16} /> }
        ]
      : []),
  ];

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(getCustomerMasterStatus(data))
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
            const req = { job_id: row.job_id, status_type: Number(Id) };
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
      name: "Job Code",
      cell: (row) => (
        <div title={row.job_id}>
          {getAccessDataJob.view == 1 ||
            getAccessDataJob.all_jobs == 1 ||
            role === "SUPERADMIN" ? (
            <a
              onClick={() => HandleJob(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.job_id}
            </a>
          ) : (
            <a>{row.job_id}</a>
          )}
        </div>
      ),
      selector: (row) => row.job_id,
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
            disabled={!(getAccessDataJob.update === 1 || role === "SUPERADMIN")}
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
            row.account_manager_officer_last_name
          }
        >
          {row.account_manager_officer_first_name +
            " " +
            row.account_manager_officer_last_name}
        </div>
      ),
      selector: (row) =>
        row.account_manager_officer_first_name +
        " " +
        row.account_manager_officer_last_name,
      sortable: true,
    },
    {
      name: "Outbook Account Manager",
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
      name: "Employee ID",
      selector: (row) => row.account_manager_employee_number,
      cell: (row) => (
        <div title={row.account_manager_employee_number}>
          {row.account_manager_employee_number}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Allocated To",
      selector: (row) =>
        row.allocated_id != null
          ? row.allocated_first_name + " " + row.allocated_last_name
          : "",
      sortable: true,
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
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          {(getAccessDataJob.update == 1 || role === "SUPERADMIN") && (
            <>
              <button className="edit-icon" onClick={() => handleEdit(row)}>
                <i className="ti-pencil" />
              </button>

              <button className="copy-icon" onClick={() => copyRow(row)}>
                <i className="ti-files"></i>
              </button>
            </>
          )}
          {row.timesheet_job_id == null
            ? (getAccessDataJob.delete == 1 || role === "SUPERADMIN") && (
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
      allowOverflow: true,
      button: true,
    },
  ];

  const HandleJob = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
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

                GetAllJobList(clientDetailSingle.id);
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
    if(row?.has_client_job_task === 0){
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
          GetAllJobListByCustomer(customerDetails.id, 1, pageSize, "");
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

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    setCurrentPage(newPage);
    if (clientDetailSingle.id) {
      GetAllJobList(clientDetailSingle.id, newPage, pageSize, searchTerm);
    } else {
      GetAllJobListByCustomer(customerDetails.id, newPage, pageSize, searchTerm);
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



  const selectCustomerId = (id, name) => {
    if (id && id != "") {
      sessionStorage.setItem("cust_id_sidebar", id);
      sessionStorage.setItem("cust_id_sidebar_name", name);
      setCustomerData([]);
      setCustomerDetails({ id: id, trading_name: name });
      setHararchyData({
        customer: { id: id, trading_name: name },
        client: { id: "", client_name: "" },
      });
      setClientDetailSingle({ id: "", client_name: "" });
      setActiveTab("NoOfJobs");
      GetAllClientData(id, name);
    } else {
      GetAllJobListByCustomer("", 1, pageSize, "");
      setClientData([]);
      setCustomerDetails({ id: "", trading_name: "" });
      setHararchyData({
        customer: { id: "", trading_name: "" },
        client: { id: "", client_name: "" },
      });
      setClientDetails({ loading: false, data: [] });
      informationSetData([]);
      setClientInformationData([]);
      setCompanyDetails([]);
    }
  };

  const selectClientId = (id, name) => {
    if (id != "") {
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
      GetAllJobListByCustomer(customerDetails.id, 1, pageSize, searchTerm);
      setCurrentPage(1);
      setActiveTab("NoOfJobs");
    }
  };

  const customerOptions = [
    { value: "", label: "All" },
    ...(customerDataAll || [])
      .filter((val) => Number(val.status) === 1 && Number(val.form_process) === 4)
      .map((val) => ({
        value: val.id,
        label: val.trading_name,
      })),
  ];

  const selectedOption =
    customerDetails.id === ""
      ? { value: "", label: "All" }
      : customerOptions.find((opt) => Number(opt.value) === Number(customerDetails.id));

  const clientOptions = [
    { value: "", label: "All" },
    ...(clientData || []).map((client) => ({
      value: client.id,
      label: client.client_name,
    })),
  ];

  const selectedOptionClient =
    clientDetailSingle.id === ""
      ? { value: "", label: "All" }
      : clientOptions.find((opt) => Number(opt.value) === Number(clientDetailSingle.id));

  const handleExport = async () => {
    setLoading(true);
    const req = {
      action: "getByCustomer",
      customer_id: customerDetails.id || "",
      page: 1,
      limit: 100000,
      search: "",
    };
    const data = { req, authToken: token };
    const response = await dispatch(CustomerJobList(data)).unwrap();
    if (!response.status || !response.data || response.data.length === 0) {
      alert("No data to export!");
      setLoading(false);
      return;
    }
    const exportData = response.data.map((item) => ({
      "Job Code Id": item.job_code_id || "-",
      "Job Priority": item.job_priority || "-",
      "Client Trading Name": item.client_trading_name || "-",
      "Job Type Name": item.job_type_name || "-",
      "Client Contact Person":
        item.account_manager_officer_first_name && item.account_manager_officer_last_name
          ? item.account_manager_officer_first_name + " " + item.account_manager_officer_last_name
          : "-",
      "Outbooks Account Manager":
        item.outbooks_acount_manager_first_name + " " + item.outbooks_acount_manager_last_name || "-",
      "Employee ID": item.account_manager_employee_number || "-",
      "Allocated To":
        item.allocated_id != null ? item.allocated_first_name + " " + item.allocated_last_name : "-",
      Invoiced: item.invoiced == "1" ? "YES" : "NO",
      "Created By": item.job_created_by || "-",
      "Created At": item.created_at || "-",
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
      <div className="col-sm-12">
        <div className="page-title-box">
          <div className="row align-items-start flex-md-row flex-column-reverse justify-content-between">
            <div className=" col-md-6 col-lg-8">
              <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
                {tabs.map((tab) => (
                  <li className="nav-item" role="presentation" key={tab.id}>
                    <button
                      className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                      id={`${tab.id}-tab`}
                      type="button"
                      role="tab"
                      aria-controls={tab.id}
                      aria-selected={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6 col-lg-4 d-block col-sm-auto d-sm-flex justify-content-end ps-lg-0">
              <button
                type="button"
                className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"
                onClick={() => {
                  window.history.back();
                }}
              >
                <ArrowLeft size={16} /> Back
              </button>

            </div>
          </div>
        </div>

        <Hierarchy
          show={["Customer", "Client", activeTab == "NoOfJobs" ? "No. Of Jobs" : activeTab]}
          active={2}
          data={hararchyData}
          NumberOfActive={activeTab == "NoOfJobs" ? totalRecords : ""}
        />
      </div>

      {!clientDetailSingle.id && (
        <div className="content-title mt-3">
          <div className="row">
            <div className="form-group col-md-4 mb-0">
              <label className="form-label mb-2">Customer</label>
              <Select
                className="basic-multi-select"
                options={customerOptions}
                value={selectedOption}
                onChange={(selected) => {
                  const selectedCustomer = customerDataAll.find((customer) => customer.id == selected.value);
                  selectCustomerId(selected.value, selectedCustomer?.trading_name);
                }}
                classNamePrefix="react-select"
                isSearchable
                placeholder="All"
              />
            </div>

            {customerDetails.id != "" && (
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
                  <Select
                    className="basic-multi-select"
                    classNamePrefix="react-select"
                    isSearchable
                    options={clientOptions}
                    value={selectedOptionClient}
                    onChange={(selected) => {
                      if (selected.value === "") {
                        selectClientId("", "");
                      } else {
                        const selectedClient = clientData.find((client) => client.id == selected.value);
                        selectClientId(selected.value, selectedClient?.client_name);
                      }
                    }}
                    placeholder="Select Client"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

        <div className="mt-2">
          {activeTab == "NoOfJobs" && (
            <div className={`tab-pane fade show active`} id={"NoOfJobs"} role="tabpanel">
              <div className="report-data mt-4 ">
                <div className="d-flex justify-content-between align-items-center">
                  <ul className="nav nav-tabs border-0 mb-3" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" type="button" role="tab">
                        Assigned Jobs
                      </button>
                    </li>
                  </ul>
                  {customerData && customerData.length > 0 && (
                    <div className="col-md-2">
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
                <div className="tab-content">
                  <div className="tab-pane fade active show">
                    <div className="col-md-3 mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                      />
                    </div>
                    <div className="datatable-wrapper ">
                      {jobLoading && (
                        <div className="overlay"><div className="loader"></div></div>
                      )}
                      {customerData && customerData.length > 0 && (
                        <>
                          <Datatable columns={columns} data={customerData} filter={false} pagination={false} />
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
                            {[5, 10, 20, 50, 100, 500].map(v => <option key={v} value={v}>{v}</option>)}
                          </select>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab == "view client" && clientInformationData && (
            <div className="tab-content">
              <div className="report-data">
                <div className="card-body">
                  <div className="dastyle-profile">
                    <div className="row">
                      <div className="col-md-4 align-self-center mb-3 mb-lg-0">
                        <div className="dastyle-profile-main">
                          <div className="dastyle-profile-main-pic">
                            <span className="dastyle-profile_main-pic-change">
                              <i className="ti-user"></i>
                            </span>
                          </div>
                          <div className="dastyle-profile_user-detail">
                            <h5 className="dastyle-user-name">
                              {getClientDetails?.data?.client?.client_type == 5 ||
                              getClientDetails?.data?.client?.client_type == 6
                                ? getClientDetails?.data?.member_details?.[0]
                                    .first_name +
                                  " " +
                                  getClientDetails?.data?.member_details?.[0]
                                    .last_name
                                : getClientDetails?.data?.client?.client_type == 7
                                ? getClientDetails?.data
                                    ?.beneficiaries_details?.[0].first_name +
                                  " " +
                                  getClientDetails?.data
                                    ?.beneficiaries_details?.[0].last_name
                                : clientInformationData.first_name +
                                  " " +
                                  clientInformationData.last_name}
                            </h5>
                            <p className="mb-0 dastyle-user-name-post">
                              Client Code: {informationData.client_code}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 ml-auto align-self-center">
                        <ul className="list-unstyled personal-detail mb-0">
                          <li>
                            <Phone size={22} className="me-2 text-secondary align-middle" />
                            <b>Phone : </b>
                            {getClientDetails?.data?.client?.client_type == 5 ||
                            getClientDetails?.data?.client?.client_type == 6
                              ? getClientDetails?.data?.member_details?.[0]
                                  .phone_code +
                                " " +
                                getClientDetails?.data?.member_details?.[0]
                                  .phone || "NA"
                              : getClientDetails?.data?.client?.client_type == 7
                              ? getClientDetails?.data
                                  ?.beneficiaries_details?.[0].phone_code +
                                " " +
                                getClientDetails?.data
                                  ?.beneficiaries_details?.[0].phone || "NA"
                              : clientInformationData.phone_code +
                                " " +
                                clientInformationData.phone || "NA"}
                          </li>
                          <li className="mt-2">
                            <Mail size={22} className="text-secondary align-middle me-2" />
                            <b>Email : </b>{" "}
                            {getClientDetails?.data?.client?.client_type == 5 ||
                            getClientDetails?.data?.client?.client_type == 6
                              ? getClientDetails?.data?.member_details?.[0]
                                  .email || "NA"
                              : getClientDetails?.data?.client?.client_type == 7
                              ? getClientDetails?.data
                                  ?.beneficiaries_details?.[0].email || "NA"
                              : clientInformationData.email || "NA"}
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-4 align-self-center mt-2 mt-sm-0">
                        <ul className="list-unstyled personal-detail mb-0">
                          <li><b>Trading Name :</b> {informationData.trading_name || "NA"}</li>
                          <li className="mt-2"><b>Trading Address :</b> {informationData.trading_address || "NA"}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="text-end mt-3">
                      <button 
                        className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                        onClick={() => navigate("/customer/client/edit", { 
                          state: { 
                            row: informationData, 
                            id: customerDetails.id, 
                            activeTab: activeTab 
                          } 
                        })}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {informationData.client_type != 4 && (
                <div className="report-data mt-4">
                  <div className="card-header border-bottom pb-3 row">
                    <div className="col-8">
                      <h4 className="card-title">
                        {informationData && informationData.client_type == 1
                          ? "Sole Trader"
                          : informationData.client_type == 2
                            ? "Company"
                            : informationData.client_type == 3
                              ? "Partnership"
                              : getClientDetails?.data?.client?.client_type == 5
                                ? "Charity Incorporated Organisation Information"
                                : getClientDetails?.data?.client?.client_type == 6
                                  ? "Charity Unincorporated Association Information"
                                  : getClientDetails?.data?.client?.client_type == 7
                                    ? "Trust"
                                    : ""}
                      </h4>
                    </div>
                  </div>
                  <div className="card-body pt-3">
                    <div className="row">
                      {informationData.client_type == 1 || informationData.client_type == 3 ? (
                        <>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Trading Name :</b> {informationData.trading_name || "NA"}</li>
                              <li className="mb-4"><b>VAT Registered :</b> {informationData.vat_registered == 0 ? "No" : "Yes"}</li>
                              <li className="mb-4"><b>Website :</b> {informationData.website || "NA"}</li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Trading Address :</b> {informationData.trading_address || "NA"}</li>
                              <li className="mb-4"><b>VAT Number :</b> {informationData.vat_number || "NA"}</li>
                            </ul>
                          </div>
                        </>
                      ) : informationData.client_type == 2 ? (
                        <>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Company Name : </b> {companyDetails.company_name || "NA"}</li>
                              <li className="mb-4"><b>Company Status :</b> {companyDetails.company_status || "NA"}</li>
                              <li className="mb-4"><b>Registered Office Address :</b> {companyDetails.registered_office_address || "NA"}</li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Entity Type :</b> {companyDetails.entity_type || "NA"}</li>
                              <li className="mb-4"><b>Company Number :</b> {companyDetails.company_number || "NA"}</li>
                            </ul>
                          </div>
                        </>
                      ) : [5, 6].includes(getClientDetails?.data?.client?.client_type) ? (
                        <>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Charity Name :</b> {getClientDetails?.data?.charity_details?.[0]?.charity_name || "NA"}</li>
                              <li className="mb-4"><b>Charity Number :</b> {getClientDetails?.data?.charity_details?.[0]?.charity_number || "NA"}</li>
                              <li className="mb-4"><b>Charity Status :</b> {getClientDetails?.data?.charity_details?.[0]?.charity_status || "NA"}</li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Accounting Reference Date :</b> {getClientDetails?.data?.charity_details?.[0]?.accounting_reference_date || "NA"}</li>
                            </ul>
                          </div>
                        </>
                      ) : getClientDetails?.data?.client?.client_type == 7 ? (
                        <>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Trust Name :</b> {getClientDetails?.data?.trust_details?.[0]?.trust_name || "NA"}</li>
                              <li className="mb-4"><b>Trust Type :</b> {getClientDetails?.data?.trust_details?.[0]?.trust_type || "NA"}</li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4"><b>Date of Establishment :</b> {getClientDetails?.data?.trust_details?.[0]?.date_of_establishment || "NA"}</li>
                            </ul>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab == "documents" && (
            <div className="tab-pane fade show active">
              <div className="report-data mt-4">
                <div className="card-header border-bottom pb-3 mb-3">
                  <h4 className="card-title">Client Documents</h4>
                </div>
                <div className="card-body">
                  <Formik initialValues={{ files: [] }} onSubmit={handleDocumentSubmit}>
                    {({ setFieldValue }) => (
                      <Form>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label">Upload Documents</label>
                              <div className="input-group">
                                <input
                                  type="file"
                                  className="form-control"
                                  multiple
                                  ref={fileInputRef}
                                  onChange={(e) => handleFileChange(e)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {newFiles.length > 0 && (
                          <div className="table-responsive mt-3">
                            <table className="table table-bordered mb-0">
                              <thead>
                                <tr>
                                  <th>Preview</th>
                                  <th>File Name</th>
                                  <th>Type</th>
                                  <th>Size</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {newFiles.map((file, index) => (
                                  <tr key={index}>
                                    <td>
                                      {file.type.startsWith("image/") ? (
                                        <img src={previews[index]} alt="preview" style={{ width: "40px", height: "40px" }} />
                                      ) : file.type === "application/pdf" ? (
                                        <FileText size={24} color="#FF0000" />
                                      ) : (
                                        <File size={24} color="#000" />
                                      )}
                                    </td>
                                    <td>{file.name}</td>
                                    <td>{file.type}</td>
                                    <td>
                                      {file.size < 1024 * 1024
                                        ? `${(file.size / 1024).toFixed(2)} KB`
                                        : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                          const updatedFiles = newFiles.filter((_, idx) => idx !== index);
                                          setNewFiles(updatedFiles);
                                          setPreviews(previews.filter((_, idx) => idx !== index));
                                        }}
                                      >
                                        <X size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="mt-3">
                              <Button type="primary" onClick={handleDocumentSubmit} className="btn btn-primary d-inline-flex align-items-center gap-2">
                                Save <ArrowRight size={16} />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
                <div className="datatable-wrapper mt-4">
                  <Datatable
                    columns={DocumentListColumns}
                    data={fileStateClient}
                    filter={true}
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
  );
};

export default CustomerClientProfile;
