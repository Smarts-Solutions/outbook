import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { ClientAction } from "../../../ReduxStore/Slice/Client/ClientSlice";
import { useNavigate, useLocation } from "react-router-dom";
import {
  JobAction,
  Update_Status,
  GET_CUSTOMER_DATA,
  DELETE_CUSTOMER_FILE,
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getList } from "../../../ReduxStore/Slice/Settings/settingSlice";
import sweatalert from "sweetalert2";
import Swal from "sweetalert2";

import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import {
  fetchSiteAndDriveInfo,
  createFolderIfNotExists,
  uploadFileToFolder,
  SiteUrlFolderPath,
  deleteFileFromFolder,
} from "../../../Utils/graphAPI";

const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState([]);
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);
  const [hararchyData, setHararchyData] = useState({
    customer: location.state,
  });

  // console.log("getJobDetails ", getJobDetails);


  const [searchQuery, setSearchQuery] = useState("");
  const [selectStatusIs, setStatusId] = useState("");
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [fileState, setFileState] = useState([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
  });
  const [getAccessDataClient, setAccessDataClient] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    client: 0,
    all_clients: 0,
  });
  const [getAccessDataJob, setAccessDataJob] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    job: 0,
    all_jobs: 0,
  });
  const [activeTab, setActiveTab] = useState("");
  const role = JSON.parse(localStorage.getItem("role"));

  const [getAccessDataCustomer, setAccessDataCustomer] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
    all_customers: 0,
  });

  const accessDataCustomer =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "customer"
    )?.items || [];

  const accessDataCustomerAll =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_customers"
    )?.items || [];

  const fetchSiteDetails = async () => {
    const { siteUrl, folderPath, sharepoint_token } = await SiteUrlFolderPath();
    setSiteUrl(siteUrl);
    setFolderPath(folderPath);
    setSharepoint_token(sharepoint_token);
  };

  useEffect(() => {
    if (accessDataCustomer.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataCustomer.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });

    accessDataCustomerAll.forEach((item) => {
      if (item.type === "view")
        updatedAccess.all_customers = item.is_assigned;
    });
    setAccessDataCustomer(updatedAccess);

    GetCustomerData();
    fetchSiteDetails();
  }, []);

  useEffect(() => {
    const retrievedData = sessionStorage.getItem("activeTab");
    const retrievedData1 = sessionStorage.getItem("activeTab1");
    if (retrievedData && retrievedData !== "clear") {
      setActiveTab(retrievedData);
      sessionStorage.setItem("activeTab1", "clear");
    } else if (retrievedData1 == "clear") {
      setActiveTab(retrievedData);
    } else {
      setActiveTab(
        (getAccessDataClient && (getAccessDataClient.client == 1 || getAccessDataClient.all_clients == 1)) ||

          role === "SUPERADMIN"
          ? "client"
          : (getAccessDataJob && (getAccessDataJob.job == 1 || getAccessDataJob.all_jobs == 1)) ||

            role === "SUPERADMIN"
            ? "job"
            : "documents"
      );
    }
  }, [getAccessDataJob, getAccessDataClient]);

  const initialTabs = [
    { id: "documents", label: "Documents", icon: "fa-solid fa-file" },
    { id: "status", label: "Status", icon: "fa-solid fa-info-circle" },
    { id: "checklist", label: "Checklist", icon: "fa-solid fa-check-square" },
  ];

  const [tabs, setTabs] = useState(initialTabs);

  const accessDataClient =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "client"
    )?.items || [];

  const accessDataClientAll =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_clients"
    )?.items || [];

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job"
    )?.items || [];

  const accessDataJobAll =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "all_jobs"
    )?.items || [];

  useEffect(() => {
    if (accessDataClient.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, client: 0, all_clients: 0 };
    accessDataClient.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.client = item.is_assigned;
    });

    accessDataClientAll.forEach((item) => {
      if (item.type === "view")
        updatedAccess.all_clients = item.is_assigned;
    });
    setAccessDataClient(updatedAccess);
  }, []);

  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, job: 0, all_jobs: 0 };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.job = item.is_assigned;
    });

    accessDataJobAll.forEach((item) => {
      if (item.type === "view")
        updatedAccess.all_jobs = item.is_assigned;
    });
    setAccessDataJob(updatedAccess);
  }, []);

  const SetTab = (e) => {
    setActiveTab(e);
  };

  useEffect(() => {
    GetStatus();
    if (activeTab !== "") {
      if (activeTab === "checklist") {
        getCheckListData();
      } else if (activeTab === "client") {
        GetAllClientData();
      } else if (activeTab === "job") {
        GetAllClientData();
        JobDetails();
      }
    }
  }, [activeTab]);

  useEffect(() => {
    if (getCheckList) {
      const filteredData = getCheckList.filter((item) =>
        Object.values(item).some((val) =>
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setCheckList1(filteredData);
    } else {
      setCheckList1([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    let tabsData = [];
    if (
      (getAccessDataClient && (getAccessDataClient.client == 1 || getAccessDataClient.all_clients == 1)) ||

      role === "SUPERADMIN"
    ) {
      tabsData.push({
        id: "client",
        label: "Client",
        icon: "fa-solid fa-user",
      });
    }
    if (
      (getAccessDataJob && (getAccessDataJob.job == 1 || getAccessDataJob.all_jobs == 1)) ||

      role === "SUPERADMIN"
    ) {
      tabsData.push({ id: "job", label: "Job", icon: "fa-solid fa-briefcase" });
    }
    setTabs([...tabsData, ...initialTabs]);
  }, [getAccessDataJob, getAccessDataClient, ClientData]);

  const ClientListColumns = [
    {
      name: "Client Name",
      cell: (row) => (
        <div>
          {(getAccessDataJob.job === 1 || getAccessDataJob.all_jobs == 1) ||

            role === "SUPERADMIN" ? (
            <a
              onClick={() => HandleClientView(row)}
              style={{ cursor: "pointer", color: "#26bdf0" }}
            >
              {row.client_name}
            </a>
          ) : (
            row.client_name
          )}
        </div>
      ),
      selector: (row) => row.client_name,
      sortable: true,
    },

    {
      name: "Client Code",
      cell: (row) => (
        <div title={row.client_code || "-"}>{row.client_code || "-"}</div>
      ),
      selector: (row) => row.client_code || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Client Type",
      selector: (row) =>
        row.client_type_name == null ? "-" : row.client_type_name,
      sortable: true,
      width: "150px",
      reorder: false,
    },

    {
      name: "Created By",
      cell: (row) => (
        <div title={row.client_created_by || "-"}>{row.client_created_by || "-"}</div>
      ),
      selector: (row) => row.client_created_by || "-",
      sortable: true,
      reorder: false,
    },

    {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>{row.created_at || "-"}</div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
      reorder: false,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Deactive"}
          </span>
        </div>
      ),
      sortable: true,
      width: "130px",
      reorder: false,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          {getAccessDataClient.update === 1 ||

            role === "SUPERADMIN" ? (
            <button
              className="edit-icon"
              onClick={() =>
                navigate("/admin/client/edit", {
                  state: { row, id: location.state.id, activeTab: activeTab },
                })
              }
            >
              <i className="ti-pencil" />
            </button>
          ) : null}
          {getAccessDataClient.delete === 1 ||

            role === "SUPERADMIN" ? (
            <>
              {row?.Delete_Status == null && (
                <button
                  className="delete-icon"
                  onClick={() => handleDelete(row, "client")}
                >
                  {" "}
                  <i className="ti-trash text-danger" />
                </button>
              )}
            </>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

  const JobColumns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleJobView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.job_code_id,
      sortable: true,
      reorder: false,
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
      reorder: false,
    },
    {
      name: "Job Type",
      cell: (row) => (
        <div title={row.job_type_name || "-"}>{row.job_type_name || "-"}</div>
      ),
      selector: (row) => row.job_type_name || "-",
      sortable: true,
      reorder: false,
    },
     {
      name: "Status",
      selector: (row) => {
        const status = statusDataAll.find((s) => Number(s.id) === Number(row.status_type));
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
            row.account_manager_officer_last_name || "-"
          }
        >
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
      reorder: false,
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
      reorder: false,
    },
    {
      name: "Outbook Account Manager",
      cell: (row) => (
        <div
          title={
            row.outbooks_acount_manager_first_name +
            " " +
            row.outbooks_acount_manager_last_name || "-"
          }
        >
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
      reorder: false,
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
      name: "Timesheet",
      cell: (row) => (
        <div
          title={
            row.total_hours_status == "1" && row.total_hours != null
              ? row.total_hours.split(":")[0] +
              "h " +
              row.total_hours.split(":")[1] +
              "m"
              : "-"
          }
        >
          {row.total_hours_status == "1" && row.total_hours != null
            ? row.total_hours.split(":")[0] +
            "h " +
            row.total_hours.split(":")[1] +
            "m"
            : "-"}
        </div>
      ),
      selector: (row) =>
        row.total_hours_status == "1" && row.total_hours != null
          ? row.total_hours.split(":")[0] +
          "h " +
          row.total_hours.split(":")[1] +
          "m"
          : "-",
      sortable: true,
      reorder: false,
    },
     {
      name: "Created By",
      cell: (row) => (
        <div title={row.job_created_by || "-"}>
          {row.job_created_by || "-"}
        </div>
      ),
      selector: (row) => row.job_created_by || "-",
      sortable: true,
    },

     {
      name: "Created At",
      cell: (row) => (
        <div title={row.created_at || "-"}>
          {row.created_at || "-"}
        </div>
      ),
      selector: (row) => row.created_at || "-",
      sortable: true,
    },
    {
      name: "Invoicing",
      selector: (row) => (row.invoiced == "1" ? "YES" : "NO"),
      sortable: true,
      sortFunction: (a, b) => {
        // Sort YES before NO
        const aVal = a.invoiced == "1" ? "YES" : "NO";
        const bVal = b.invoiced == "1" ? "YES" : "NO";
        return aVal.localeCompare(bVal);
      },

    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          {getAccessDataJob.update === 1 ||

            role === "SUPERADMIN" ? (
            <button
              className="edit-icon"
              onClick={() =>
                navigate("/admin/job/edit", {
                  state: {
                    job_id: row.job_id,
                    goto: "Customer",
                    activeTab: activeTab,
                    jab: row,
                  },
                })
              }
            >
              <i className="ti-pencil" />
            </button>
          ) : null}
          {row.timesheet_job_id == null ? (
            getAccessDataJob.delete === 1 ||

              role === "SUPERADMIN" ? (
              <button
                className="delete-icon"
                onClick={() => handleDelete(row, "job")}
              >
                <i className="ti-trash text-danger" />
              </button>
            ) : null
          ) : (
            ""
          )}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

  const DocumentListColumns = [
    {
      name: "File Image",
      cell: (row) => (
        <div>
          {row.file_type.startsWith("image/") ? (
            <img
              src={row.web_url}
              alt={row.original_name}
              style={{ width: "50px", height: "50px" }}
            />
          ) : row.file_type === "application/pdf" ? (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i
                className="fa fa-file-pdf"
                style={{ fontSize: "24px", color: "#FF0000" }}
              ></i>
              <span>PDF</span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i
                className="fa fa-file"
                style={{ fontSize: "24px", color: "#000" }}
              ></i>
              <span>{row.file_type}</span>
            </div>
          )}
        </div>
      ),
      selector: (row) => row.web_url,
      sortable: true,
      reorder: false,
    },

    {
      name: "File Name",
      cell: (row) => (
        <div title={row.original_name || "-"}>{row.original_name || "-"}</div>
      ),
      selector: (row) => row.original_name || "-",
      sortable: true,
      reorder: false,
    },

    {
      name: "File Type",
      cell: (row) => (
        <div title={row.file_type || "-"}>{row.file_type || "-"}</div>
      ),
      selector: (row) => row.file_type || "-",
      sortable: true,
      reorder: false,
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
      reorder: false,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="delete-icon" onClick={() => removeItem(row, 2)}>
            <i className="ti-trash text-danger" />
          </button>

          {/* <button className="download-icon" onClick={() => downloadFileFromSharePoint(row.web_url, sharepoint_token, row.original_name)}>
            <i className="ti-download" />
          </button> */}

          <a
            className="download-icon"
            href={row.web_url}
            target="_blank"
            rel="noopener noreferrer"
            download={row.original_name}

          >
            <i className="ti-download" />
          </a>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];



  const downloadFileFromSharePoint1 = async (sharePointFileUrl, accessToken, fileName) => {
    console.log("sharePointFileUrl", sharePointFileUrl);
    console.log("accessToken", accessToken);
    try {
      // Make a GET request to SharePoint to get the file as a blob
      const response = await fetch(sharePointFileUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      console.log("response", response);

      // Check if the response is OK
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Convert the response to a Blob (binary data)
      const fileBlob = await response.blob();

      // Create a URL for the Blob
      const fileURL = window.URL.createObjectURL(fileBlob);

      // Create a temporary <a> element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = fileName; // Provide a file name (optional)
      downloadLink.click(); // Trigger the download
      window.URL.revokeObjectURL(fileURL); // Clean up after the download
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };


  const downloadFileFromSharePoint = async (sharePointFileUrl, accessToken, fileName) => {
    const backendDownloadUrl = 'https://jobs.outbooks.com/backend/downloadSharepointFile';

    try {
      const response = await fetch(backendDownloadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${local_user_jwt_token}` 
        },
        body: JSON.stringify({
          fileUrl: sharePointFileUrl,
          sharepointToken: accessToken
        })
      });

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.statusText}`);
      }

      // 1. फ़ाइल डेटा को Blob के रूप में लें
      const fileBlob = await response.blob();

      // 2. फ़ाइल डाउनलोड करने के लिए a टैग का उपयोग करें
      const fileURL = window.URL.createObjectURL(fileBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = fileURL;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink); // DOM में जोड़ना ज़रूरी है
      downloadLink.click();
      document.body.removeChild(downloadLink); // Clean up
      window.URL.revokeObjectURL(fileURL);

    } catch (error) {
      console.error('Error downloading the file through backend:', error);
    }
  };



  const removeItem = async (file, type) => {
    if (type == 1) {
      return;
    }

    const invalidTokens = [
      "",
      "sharepoint_token_not_found",
      "error",
      undefined,
      null,
    ];
    if (invalidTokens.includes(sharepoint_token)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Unable to connect to SharePoint.",
      });
      return;
    }

    let customer_name = "DEMO";
    if (customerDetails.data.customer != undefined) {
      // customer_name = customerDetails.data.customer.trading_name;
      customer_name = "CUST" + customerDetails.data.customer.customer_id;
    }
    let fileName = file.name;
    if (type == 2) {
      fileName = file.original_name;
    }

    if (fileName != undefined) {
      const req = {
        action: "delete",
        customer_id: location.state.id,
        id: file.customer_paper_work_id,
        file_name: file.file_name,
      };
      const data = { req: req, authToken: token };

      sweatalert
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await dispatch(
                DELETE_CUSTOMER_FILE(data)
              ).unwrap();
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
                setFileState((prevFiles) =>
                  prevFiles.filter(
                    (data) =>
                      data.customer_paper_work_id !==
                      file.customer_paper_work_id
                  )
                );
                const { site_ID, drive_ID, folder_ID } =
                  await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
                const folderId = await createFolderIfNotExists(
                  site_ID,
                  drive_ID,
                  folder_ID,
                  customer_name,
                  sharepoint_token
                );
                const deleteFile = await deleteFileFromFolder(
                  site_ID,
                  drive_ID,
                  folderId,
                  fileName,
                  sharepoint_token
                );
                return;
              }
            } catch (error) {
              return;
            }
          }
        });
    } else {
      return;
    }
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
              Update_Status({ req, authToken: token })
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
              JobDetails();
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

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
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

  const CheckListColumns = [
    {
      name: "Checklist Name",
      cell: (row) => (
        <div>
          <a
            title={row.check_list_name}
          // onClick={() => HandleClientView(row)}
          // style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.check_list_name}
          </a>
        </div>
      ),
      selector: (row) => row.check_list_name,
      sortable: true,
    },

    {
      name: "Service Type",
      cell: (row) => <div title={row.service_name}>{row.service_name}</div>,
      selector: (row) => row.service_name,
      sortable: true,
    },
    {
      name: "Job Type",
      cell: (row) => <div title={row.job_type_type}>{row.job_type_type}</div>,
      selector: (row) => row.job_type_type,
      sortable: true,
      width: "200px",
    },
    {
      name: "Client Type",
      cell: (row) => (
        <div title={row.client_type_type}>{row.client_type_type}</div>
      ),
      selector: (row) => row.client_type_type,
      sortable: true,
      width: "200px",
    },
    {
      name: "Status",
      selector: (row) => (row.status == "1" ? "Active" : "Deactive"),
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          {getAccessDataCustomer.update === 1 ||

            role === "SUPERADMIN" ? (
            <button
              className="edit-icon"
              onClick={() =>
                navigate("/admin/edit/checklist", {
                  state: {
                    id: location.state.id,
                    checklist_id: row.checklists_id,
                    activeTab: activeTab,
                  },
                })
              }
            >
              <i className="ti-pencil" />
            </button>
          ) : null}
          {getAccessDataCustomer.delete === 1 ||

            role === "SUPERADMIN" ? (
            <button
              className="delete-icon"
              onClick={() => ChecklistDelete(row)}
            >
              <i className="ti-trash text-danger" />
            </button>
          ) : null}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const tabs1 = [
    {
      key: "client",
      title: "Clients",
      placeholder: "Search clients...",
      data: ClientData,
      columns: ClientListColumns,
    },
    {
      key: "job",
      title: "Jobs",
      placeholder: "Search jobs...",
      data: getJobDetails,
      columns: JobColumns,
    },
    {
      key: "documents",
      title: "Documents",
      placeholder: null,
      data: fileState,
      columns: DocumentListColumns,
    },
    {
      key: "status",
      title: "Status",
      placeholder: "Search Status...",
      data: [],
      columns: JobColumns,
    },
    {
      key: "checklist",
      title: "Checklist",
      placeholder: "Search...",
      data: getCheckList1,
      columns: CheckListColumns,
    },
  ];

  const JobDetails = async () => {
    const req = { action: "getByCustomer", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetJobDetails(response.data);
        } else {
          setGetJobDetails([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetCustomerData = async () => {
    const req = { customer_id: location?.state?.id, pageStatus: "4" };
    const data1 = { req: req, authToken: token };

    await dispatch(GET_CUSTOMER_DATA(data1))
      .unwrap()
      .then((response) => {
        if (response.status) {
          const existingFiles = response.data.customer_paper_work || [];
          setCustomerDetails({
            loading: false,
            data: response.data,
          });
          setFileState(existingFiles);
        } else {
          setFileState([]);
          setCustomerDetails({
            loading: true,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetAllClientData = async () => {
    const req = { action: "get", customer_id: location?.state?.id };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setClientData(response.data);
        } else {
          setClientData(response.data);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const getCheckListData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          if (response.data.length > 0) {
            let Array = [
              { id: 1, name: "Sole Trader" },
              { id: 2, name: "Company" },
              { id: 3, name: "Partnership" },
              { id: 4, name: "Individual" },
              { id: 5, name: "Charity Incorporated Organisation" },
              { id: 6, name: "Charity Unincorporated Association" },
              { id: 7, name: "Trust" },

            ];
            let data = response.data.map((item) => {
              return {
                ...item,
                check_list_name: item.check_list_name,
                service_name: item.service_name,
                job_type_type: item.job_type_type,
                // client_type_type: item.client_type_type,
                status: item.status,
                checklists_id: item.checklists_id,
                client_type_type: item.checklists_client_type_id
                  .split(",")
                  .map((id) => {
                    let matchedItem = Array.find(
                      (item) => item.id === Number(id)
                    );
                    return matchedItem ? matchedItem.name : null;
                  })
                  .filter((name) => name !== null)
                  .join(", "),
              };
            });

            setCheckList(data);
            setCheckList1(data);
          } else {
            setCheckList([]);
          }

          // setCheckList(response.data);
          // setCheckList1(response.data);
        } else {
          setCheckList([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const ChecklistDelete = async (row) => {
    const req = { action: "delete", checklist_id: row.checklists_id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
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
          getCheckListData();
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
  };

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
            ...(type === "job"
              ? { job_id: row.job_id }
              : { client_id: row.id }),
          };
          const data = { req: req, authToken: token };
          await dispatch(type == "job" ? JobAction(data) : ClientAction(data))
            .unwrap()
            .then(async (response) => {
              if (response.status) {
                sweatalert.fire({
                  title: type + " deleted successfully",
                  icon: "success",
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1500,
                });
                JobDetails();
                GetAllClientData();
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
        }
      });
  };

  const HandleClientView = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        client: row,
      };
      navigate("/admin/client/profile", {
        state: { Client_id: row.id, data: updatedData, activeTab: activeTab },
      });
      return updatedData;
    });
  };

  const HandleJobView = (row) => {
    setHararchyData((prevState) => {
      const updatedData = {
        ...prevState,
        job: row,
      };
      navigate("/admin/job/logs", {
        state: {
          job_id: row.job_id,
          timesheet_job_id: row?.timesheet_job_id,
          goto: "Customer",
          data: updatedData,
          activeTab: activeTab,
        },
      });
      return updatedData;
    });
  };

  return (
    <div className="container-fluid">
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start flex-md-row flex-column-reverse">
              <div className="col-md-6 col-lg-8">
                <ul
                  className="nav nav-pills rounded-tabs"
                  id="pills-tab"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
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
                        onClick={() => SetTab(tab.id)}
                      >
                        <i className={tab.icon}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6 col-lg-4 d-block col-sm-auto d-sm-flex justify-content-end ps-lg-0">
                {activeTab === "client" ||
                  activeTab === "checklist" ||
                  activeTab === "" ||
                  activeTab === "job" ? (
                  <>
                    <div
                      className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"
                      onClick={() => {
                        window.history.back();
                      }}
                    >
                      <i className="fa fa-arrow-left pe-1" /> Back
                    </div>
                    {(getAccessDataClient.insert === 1 ||

                      role === "SUPERADMIN") &&
                      activeTab === "client" ? (
                      <>
                        <div
                          className="btn btn-info text-white mt-2 mt-sm-0  blue-btn"
                          onClick={() =>
                            navigate("/admin/addclient", {
                              state: {
                                id: location.state.id,
                                activeTab: activeTab,
                              },
                            })
                          }
                        >
                          <i className="fa fa-plus pe-1" /> Add Client
                        </div>
                      </>
                    ) : ClientData?.length > 0 &&
                      (getAccessDataJob.insert == 1 ||

                        role === "SUPERADMIN") &&
                      activeTab === "job" ? (
                      <>
                        <div
                          className="btn btn-info text-white  blue-btn mt-2 mt-sm-0"
                          onClick={() =>
                            navigate("/admin/createjob", {
                              state: {
                                customer_id: location.state.id,
                                goto: "Customer",
                                activeTab: activeTab
                              },
                            })
                          }
                        >
                          <i className="fa fa-plus pe-1" /> Create Job
                        </div>
                      </>
                    ) : (getAccessDataCustomer.insert === 1 ||

                      role === "SUPERADMIN") &&
                      activeTab === "checklist" ? (
                      <>
                        <div
                          className="btn btn-info text-white  blue-btn mt-2 mt-sm-0"
                          onClick={() =>
                            navigate("/admin/create/checklist", {
                              state: {
                                id: location.state.id,
                                activeTab: activeTab,
                              },
                            })
                          }
                        >
                          <i className="fa fa-plus pe-1" /> Add Checklist
                        </div>
                      </>
                    ) : null}
                  </>
                ) :

                  activeTab === "documents" ? (
                    <>
                      <div
                        className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"
                        onClick={() => {
                          window.history.back();
                        }}
                      >
                        <i className="fa fa-arrow-left pe-1" /> Back
                      </div>
                    </>
                  ) :
                    activeTab === "status" ? (
                      <>
                        <div
                          className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"
                          onClick={() => {
                            window.history.back();
                          }}
                        >
                          <i className="fa fa-arrow-left pe-1" /> Back
                        </div>
                      </>
                    ) : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <Hierarchy
        show={["Customer", activeTab]}
        active={1}
        data={hararchyData}
        NumberOfActive={
          activeTab == "client"
            ? ClientData?.length
            : activeTab == "job"
              ? getJobDetails?.length
              : ""
        }
      />

      <div className="tab-content" id="pills-tabContent">
        {tabs1.map((tab) => (
          <div
            key={tab.key}
            className={`tab-pane fade ${activeTab == tab.key ? "show active" : ""
              }`}
            id={tab.key}
            role="tabpanel"
            aria-labelledby={`${tab.key}-tab`}
          >
            <div className="report-data mt-4">
              <div className="d-flex justify-content-between align-items-center">
                <div className="tab-title">
                  <h3 className="mt-0">{tab.title}</h3>
                </div>

                {/* {tab.placeholder && (
                  <div className="search-input">
                    <input
                      type="text"
                      className="form-control"
                      placeholder={tab.placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )} */}
              </div>

              <div className="datatable-wrapper">
                {tab.data && tab.data.length > 0 ? (
                  <Datatable
                    columns={tab.columns}
                    data={tab.data}
                    filter={true}
                  />
                ) : (
                  <div className="text-center">
                    <img
                      src="/assets/images/No-data-amico.png"
                      alt="No records available"
                      style={{
                        width: "250px",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                    <p>No data available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
