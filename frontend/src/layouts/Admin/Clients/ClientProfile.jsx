import React, { useEffect, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import { JobAction, Update_Status } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { ClientAction, addClientDocument, deleteClientFile } from "../../../ReduxStore/Slice/Client/ClientSlice";
import sweatalert from "sweetalert2";
import Swal from "sweetalert2";
import Hierarchy from "../../../Components/ExtraComponents/Hierarchy";
import { MasterStatusData } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { fetchSiteAndDriveInfo, createFolderIfNotExists, uploadFileToFolder, SiteUrlFolderPath, deleteFileFromFolder } from "../../../Utils/graphAPI";

const ClientList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const fileInputRef = useRef(null);
  const [customerData, setCustomerData] = useState([]);

  const [activeTab, setActiveTab] = useState("NoOfJobs");
  const [getClientDetails, setClientDetails] = useState({ loading: true, data: [], });
  const [informationData, informationSetData] = useState([]);
  const [clientInformationData, setClientInformationData] = useState([]);
  const [companyDetails, setCompanyDetails] = useState([]);
  const [hararchyData, setHararchyData] = useState(location.state.data);
  const [statusDataAll, setStatusDataAll] = useState([])
  const [selectStatusIs, setStatusId] = useState('')
  const [getAccessDataJob, setAccessDataJob] = useState({ insert: 0, update: 0, delete: 0, view: 0, });
  const [fileState, setFileState] = useState([]);

  const [fileStateClient, setFileStateClient] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");

  const fetchSiteDetails = async () => {
    const { siteUrl, folderPath, sharepoint_token } = await SiteUrlFolderPath();
    setSiteUrl(siteUrl);
    setFolderPath(folderPath);
    setSharepoint_token(sharepoint_token);
  };

  useEffect(() => {
    GetAllJobList();
    GetClientDetails();
    GetStatus();
    fetchSiteDetails();
  }, []);

  const accessDataJob =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "job"
    )?.items || [];


  useEffect(() => {
    if (accessDataJob.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataJob.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    setAccessDataJob(updatedAccess);
  }, []);

  const GetClientDetails = async () => {
    const req = { action: "getByid", client_id: location.state.Client_id };
    const data = { req: req, authToken: token };
    await dispatch(ClientAction(data))
      .unwrap()
      .then((response) => {
        console.log("response-client ", response.data.client_documents);
        if (response.status) {
          setClientDetails({
            loading: false,
            data: response.data,
          });
          informationSetData(response.data.client);
          setClientInformationData(response.data.contact_details[0]);
          setCompanyDetails(response.data.company_details);

          if (response.data.client_documents.length > 0) {
            setFileStateClient(response.data.client_documents)
          }
        } else {
          setClientDetails({
            loading: false,
            data: [],
          });
          setFileStateClient([])
        }
      })
      .catch((error) => {
        return;
      });
  };

  const tabs = [
    { id: "NoOfJobs", label: "No. Of Jobs", icon: "fa-solid fa-briefcase" },
    { id: "view client", label: "View Client", icon: "fa-solid fa-user" },
    { id: "documents", label: "Documents", icon: "fa-solid fa-file" },
  ];

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

  const handleStatusChange = (e, row) => {
    const Id = e.target.value;
    sweatalert.fire({
      title: "Are you sure?",
      text: "Do you want to change the status?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const req = { job_id: row.job_id, status_type: Number(Id) };
          const res = await dispatch(Update_Status({ req, authToken: token })).unwrap();

          if (res.status) {
            sweatalert.fire({
              title: "Success",
              text: res.message,
              icon: "success",
              timer: 1000,
              showConfirmButton: false,
            });

            setStatusId(Id);
            GetAllJobList();
          } else if (res.data === "W") {
            sweatalert.fire({
              title: "Warning",
              text: res.message,
              icon: "warning",
              confirmButtonText: "Ok",
              timer: 1000,
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
      cell: (row) => (
        <div title={row.job_code_id}>
          {
            getAccessDataJob.view == 1 || role === "ADMIN" || role === "SUPERADMIN" ? (
              <a onClick={() => HandleJob(row)} style={{ cursor: "pointer", color: "#26bdf0" }}>
                {row.job_code_id}
              </a>
            ) : <a>{row.job_code_id}</a>
          }
        </div>
      ),
      selector: (row) => row.trading_name,
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
      cell: (row) => (
        <div title={row.job_type_name}>
          {row.job_type_name}
        </div>
      ),
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <div>
            <select
              className="form-select form-control"
              value={row.status_type}
              onChange={(e) => handleStatusChange(e, row)}
              disabled={getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN" ? false : true}
            >
              {statusDataAll.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ),
      sortable: true,
      width: "325px"
    },

    {
      name: "Client Contact Person",
      cell: (row) => (
        <div title={row.account_manager_officer_first_name +
          " " +
          row.account_manager_officer_last_name}>
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
    // {
    //   name: "Client",
    //   cell: (row) => (
    //     <div title={row.client_trading_name}>
    //       {row.client_trading_name}
    //     </div>
    //   ),
    //   selector: (row) => row.client_trading_name,
    //   sortable: true,
    // },
    {
      name: "Outbook Account Manager",
      cell: (row) => (
        <div title={row.outbooks_acount_manager_first_name +
          " " + row.outbooks_acount_manager_last_name}>
          {row.outbooks_acount_manager_first_name +
            " " + row.outbooks_acount_manager_last_name}
        </div>
      ),
      selector: (row) =>
        row.outbooks_acount_manager_first_name +
        " " +
        row.outbooks_acount_manager_last_name,
      sortable: true,
      width: "325px"
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
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          {(getAccessDataJob.update == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
            <button className="edit-icon" onClick={() => handleEdit(row)}>
              <i className="ti-pencil" />
            </button>
          )}
          {
            row.timesheet_job_id == null ?
              (getAccessDataJob.delete == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                <button className="delete-icon" onClick={() => handleDelete(row, 'job')}>
                  <i className="ti-trash text-danger" />
                </button>
              )
              : ""}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleFileChange = (event) => {
    const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
    if (invalidTokens.includes(sharepoint_token)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Unable to connect to SharePoint.",
      });
      fileInputRef.current.value = "";
      return;
    }

    const files = event.currentTarget.files;
    var fileArray;

    if (files && typeof files[Symbol.iterator] === "function") {
      fileArray = Array.from(files);
    } else {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpg",
      "image/jpeg",
    ];

    const validFiles = fileArray.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== fileArray.length) {

      sweatalert.fire({
        icon: "error",
        title: "Oops...",
        text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed.",
      });
      fileInputRef.current.value = "";
      return;
    }

    //setNewFiles(validFiles);
    const existingFileNames = new Set(newFiles.map(file => file.name));
    const uniqueValidFiles = validFiles.filter(file => !existingFileNames.has(file.name));

    if (uniqueValidFiles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Files with the same name already exist.",
      });
      return;
    }
    const updatedNewFiles = [...newFiles, ...uniqueValidFiles];
    setNewFiles(updatedNewFiles);

    const previewArray = updatedNewFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
      });
    });

    Promise.all(previewArray).then((previewData) => {
      setPreviews(previewData);
    });
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileState([]);
    setNewFiles([]);
    setPreviews([]);
  };

  const handleSubmit = async (values) => {
    const invalidValues = [undefined, null, "", 0, "0"];
    let client_name = "CLIENT_DEMO"
    if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id)) {
      client_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id;
    }

    const uploadedFilesArray = [];

    if (newFiles.length > 0) {

      const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
      if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {

        setIsLoading(true);
        const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
        const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, client_name, sharepoint_token);

        for (const file of newFiles) {
          const uploadDataUrl = await uploadFileToFolder(site_ID, drive_ID, folderId, file, sharepoint_token);
          const uploadedFileInfo = {
            web_url: uploadDataUrl,
            filename: file.lastModified + '-' + file.name,
            originalname: file.name,
            mimetype: file.type,
            size: file.size
          };
          uploadedFilesArray.push(uploadedFileInfo);
        }
        const req = { fileData: newFiles, client_id: location.state.data.client.id, authToken: token, uploadedFiles: uploadedFilesArray }
        await dispatch(addClientDocument(req))
          .unwrap()
          .then((response) => {
            if (response.status) {
              sweatalert
                .fire({
                  title: response.message,
                  icon: "success",
                  timer: 3000,
                })
                .then(() => {
                  // navigate("/admin/client/profile");
                  resetFileInput();
                  setNewFiles([]);
                  setFileState([]);
                  setPreviews([]);
                  GetClientDetails();
                  setIsLoading(false);
                });
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            return;
          });

      }

    } else {
      sweatalert.fire({
        icon: "warning",
        title: "Oops...",
        text: "Please select a file to upload.",
      });
      return;
    }



  };

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
        <div title={row.original_name || "-"}>
          {row.original_name || "-"}
        </div>
      ),
      selector: (row) => row.original_name || "-",
      sortable: true,
      reorder: false,
    },

    {
      name: "File Type",
      cell: (row) => (
        <div title={row.file_type || "-"}>
          {row.file_type || "-"}
        </div>
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
            ? `${(
              row.file_size / 1024
            ).toFixed(2)} KB`
            : `${(
              row.file_size /
              (1024 * 1024)
            ).toFixed(2)} MB` || "-"}
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

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },


  ];

  const removeItem = async (file, type) => {
    if (type == 1) {
      return;
    }

    const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
    if (invalidTokens.includes(sharepoint_token)) {
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: "Unable to connect to SharePoint.",
      });
      return;
    }

    const invalidValues = [undefined, null, "", 0, "0"];
    let client_name = "CLIENT_DEMO"
    if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id)) {
      client_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id;
    }
    let fileName = file.name;
    if (type == 2) {
      fileName = file.original_name;
    }


    if (fileName != undefined) {

      const req = {
        action: "delete",
        client_id: location.state.data.client.id,
        id: file.client_documents_id,
        file_name: file.file_name,
        authToken: token
      };
      console.log("req", req);

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
              const response = await dispatch(deleteClientFile(req)).unwrap();
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
                GetClientDetails();
                setFileStateClient((prevFiles) =>
                  prevFiles.filter((data) => data.client_documents_id !== file.client_documents_id)
                );
                const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
                const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, client_name, sharepoint_token);
                const deleteFile = await deleteFileFromFolder(site_ID, drive_ID, folderId, fileName, sharepoint_token);
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

  const HandleJob = (row) => {
    setHararchyData(prevState => {
      const updatedData = {
        ...prevState,
        job: row
      };
      navigate("/admin/job/logs", { state: { job_id: row?.job_id, timesheet_job_id: row?.timesheet_job_id, data: updatedData, goto: "client", activeTab: location?.state?.activeTab } });
      return updatedData;
    });
  };

  function handleEdit(row) {
    navigate("/admin/job/edit", { state: { job_id: row.job_id, goto: "client", activeTab: location?.state?.activeTab } });
  }

  const handleDelete = async (row, type) => {
    const req = { action: "delete", ...(type === "job" ? { job_id: row.job_id } : { client_id: row.id }) };
    const data = { req: req, authToken: token };
    await dispatch(type == 'job' ? JobAction(data) : ClientAction(data))
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

          type === "job" ? GetAllJobList() : GetClientDetails();

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

  const GetAllJobList = async () => {
    const req = { action: "getByClient", client_id: location.state.Client_id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerData(response.data);
        } else {
          setCustomerData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const handleCreateJob = (row) => {
    if (getClientDetails?.data?.client?.customer_id) {
      navigate("/admin/createjob", {
        state: { customer_id: getClientDetails?.data?.client?.customer_id, clientName: location?.state?.data?.client, goto: "client", activeTab: location?.state?.activeTab },
      });
    }
  };
  return (

    <div className={isLoading ? "blur-container" : ""}>
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="container-fluid">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start flex-md-row flex-column-reverse justify-content-between">
              <div className=" col-md-6 col-lg-8">
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
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <i className={tab.icon}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {activeTab == "NoOfJobs" && (
                <>
                  <div className="col-md-6 col-lg-4 d-block col-sm-auto d-sm-flex justify-content-end ps-lg-0">
                    <button
                      type="button"
                      className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"

                      onClick={() => {
                        sessionStorage.setItem('activeTab', location.state.activeTab);
                        window.history.back()
                      }
                      }
                    >
                      <i className="fa fa-arrow-left pe-1" /> Back
                    </button>
                    {
                      (getAccessDataJob.insert == 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                        <div className="btn btn-info text-white  blue-btn mt-2 mt-sm-0" onClick={handleCreateJob}   >
                          <i className="fa fa-plus pe-1" /> Create Job
                        </div>
                      )
                    }

                  </div>
                </>
              )}

              {activeTab === "view client" && (
                <div className="col-md-4 col-auto">
                  <button
                    type="button"
                    className="btn btn-info text-white float-end blue-btn me-2"
                    onClick={() => {
                      sessionStorage.setItem('activeTab', location.state.activeTab);
                      window.history.back()
                    }
                    }
                  >
                    <i className="fa fa-arrow-left pe-1" /> Back
                  </button>
                </div>
              )}

              {activeTab == "documents" && (
                <>
                  <div className="col-md-6 col-lg-4 d-block col-sm-auto d-sm-flex justify-content-end ps-lg-0">
                    <button
                      type="button"
                      className="btn btn-info text-white float-sm-end blue-btn me-2 mt-2 mt-sm-0"

                      onClick={() => {
                        sessionStorage.setItem('activeTab', location.state.activeTab);
                        window.history.back()
                      }
                      }
                    >
                      <i className="fa fa-arrow-left pe-1" /> Back
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Hierarchy show={["Customer", "Client", activeTab == 'NoOfJobs' ? 'No. Of Jobs' : activeTab]} active={2} data={hararchyData} NumberOfActive={activeTab == 'NoOfJobs' ? customerData.length : ""} />

        </div>

        <div className="mt-4">
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

                      <div className="datatable-wrapper ">
                        {customerData && customerData && (
                          <Datatable
                            columns={columns}
                            data={customerData}
                            filter={true}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="alljob"
                      role="tabpanel"
                      aria-labelledby="alljob-tab"
                    >
                    </div>
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
                            <i className="fa-regular fa-phone me-2 text-secondary font-22 align-middle"></i>
                            <b>Phone : </b>
                            {clientInformationData &&
                              clientInformationData.phone &&
                              clientInformationData.phone_code +
                              " " +
                              clientInformationData.phone || 'NA'}

                          </li>
                          <li className="mt-2">
                            <i className="fa-regular fa-envelope text-secondary font-22 align-middle me-2"></i>
                            <b>Email : </b>{" "}
                            {clientInformationData && clientInformationData.email || 'NA'}
                          </li>
                        </ul>
                      </div>

                      <div className=" col-md-4 col-sm-6 col-lg-4 align-self-center mt-2 mt-sm-0">
                        <ul className="list-unstyled personal-detail mb-0">
                          <li className="row">
                            <div className="col-md-12">
                              <b>Trading Name :</b> {informationData && informationData.trading_name || 'NA'}</div>

                          </li>
                          <li className="mt-2 row">
                            <div className="col-md-12">
                              <b>Trading Address :</b>  {informationData && informationData.trading_address || 'NA'}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {
                informationData.client_type == 4 ? "" :
                  <div className=" report-data mt-4">
                    <div className="card-header border-bottom pb-3 row">
                      <div className="col-8">
                        <h4 className="card-title">
                          {informationData && informationData.client_type == 1
                            ? "Sole Trader"
                            : informationData.client_type == 2
                              ? "Company" : informationData.client_type == 3 ? "Partnership" : ""

                          }
                        </h4>
                      </div>
                      {/* <div className="col-4">
                <div className="float-end">
                  <button type="button" className="btn btn-info text-white " onClick={(e) => ClientEdit(informationData.id)}>
                    <i className="fa-regular fa-pencil me-2" />
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-0 btn btn-danger text-white float-end fw-bold ms-1"
                  >
                    <i className="fa-regular fa-trash me-2" />
                    Delete
                  </button>
                </div>
              </div> */}
                    </div>

                    {informationData.client_type == 1 ? (
                      <div className="card-body pt-3">
                        <div className="row">
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4">
                                <b>Trading Name :</b> {informationData.trading_name || 'NA'}

                                {/* <p className="font-14  ml-3">
                            {informationData.trading_name}
                          </p> */}
                              </li>
                              <li className="mb-4">
                                <b className="">VAT Registered : </b>{informationData.vat_registered == 0 ? "No" : "Yes"}
                                {/* <p className="font-14  ml-3">
                            {" "}
                            
                          </p> */}
                              </li>
                              <li className="mb-4">
                                <b className="">Website : </b>{informationData.website || 'NA'}
                                {/* <p className="font-14  ml-3">
                            
                          </p> */}
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4">
                                <b className="">Trading Address :</b> {informationData.trading_address || 'NA'}
                                {/* <p className="font-14  ml-3">
                            {" "}
                            {informationData.trading_address}
                          </p> */}
                              </li>
                              <li className="mb-4">
                                <b className="">VAT Number :</b>  {informationData.vat_number || 'NA'}
                                {/* <p className="font-14  ml-3">
                            {" "}
                            {informationData.vat_number}
                          </p> */}
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
                                <b className="">Company Name : </b> {companyDetails.company_name || "NA"}

                              </li>
                              <li className="mb-4">
                                <b className="">Company Status :</b>  {companyDetails.company_status || "NA"}

                              </li>
                              <li className="mb-4">
                                <b className="">Registered Office Address :</b>  {companyDetails.registered_office_address || "NA"}

                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4">
                                <b className="">Entity Type :</b> {companyDetails.entity_type || "NA"}

                              </li>
                              <li className="mb-4">
                                <b className="">Company Number :</b> {companyDetails.company_number || "NA"}

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
                                <b className="">Trading Name :</b> {informationData && informationData.trading_name || "NA"}
                                <p className="font-14  ml-3">

                                </p>
                              </li>
                              <li className="mb-4">
                                <b className="">VAT Registered :</b> {informationData &&
                                  informationData.vat_registered == "0"
                                  ? "No"
                                  : "Yes"}

                              </li>
                              <li className="mb-4">
                                <b className="">Website :</b> {informationData && informationData.website || "NA"}

                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <ul className="list-unstyled faq-qa">
                              <li className="mb-4">
                                <b className="">Trading Address :</b> {informationData && informationData.trading_address || "NA"}
                              </li>
                              <li className="mb-4">
                                <b className="">VAT Number :</b> {informationData && informationData.vat_number || "NA"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
              }

            </div>
          )}

          {activeTab == "documents" && (
            <div
              className={`tab-pane fade ${activeTab == "documents" ? "show active" : ""
                }`}
              id={"documents"}
              role="tabpanel"
              aria-labelledby={`documents-tab`}
            >
              <div className="">

                <div className="report-data mt-4 ">
                  <Formik
                    initialValues={{ files: [] }}
                    // onSubmit={(values) => {
                    // }}
                    onSubmit={(values, { resetForm }) => {
                      console.log("Uploaded files:", values.files);
                      resetForm(); // Reset Formik form state
                      resetFileInput(); // Reset file input
                    }}
                  >
                    {({ setFieldValue }) => (
                      <Form className="details__wrapper">
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="card">
                              <div className="card-header step-header-blue">
                                <h4 className="card-title mb-0">
                                  Upload Client Documents
                                </h4>
                              </div>
                              <div className="card-body">
                                <div className="input-group">
                                  <div className="custom-file w-100">
                                    <input
                                      type="file"
                                      ref={fileInputRef}
                                      multiple
                                      onChange={(event) => {
                                        handleFileChange(event);
                                        setFieldValue("files", [...fileState, ...newFiles]);

                                      }}
                                      className="custom-file-input form-control"
                                      id="inputGroupFile04"
                                    />
                                  </div>
                                </div>

                                <ul className="list-unstyled mb-0" id="dropzone-preview"></ul>
                                <div className="container-fluid page-title-box">
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div className="card">
                                        <div className="card-body pt-0">
                                          <div id="customerList">
                                            <div className="row g-4 mb-3">
                                              <div className="d-flex justify-content-end">
                                                <div className="pagination-wrap hstack gap-2"></div>
                                              </div>
                                            </div>
                                            <div className="table-responsive table-card mb-1">
                                              <table
                                                className="table align-middle table-nowrap"
                                                id="customerTable"
                                              >
                                                <thead className="table-light table-head-blue">
                                                  <tr>
                                                    <th className="" data-sort="file_name">
                                                      File Image
                                                    </th>
                                                    <th className="" data-sort="file_name">
                                                      File Name
                                                    </th>
                                                    <th className="" data-sort="file_type">
                                                      File Type
                                                    </th>
                                                    <th className="" data-sort="size">
                                                      Size
                                                    </th>
                                                    <th className="" data-sort="action">
                                                      Action
                                                    </th>
                                                  </tr>
                                                </thead>
                                                <tbody className="list form-check-all">
                                                  {newFiles.length > 0 &&
                                                    Array.from(newFiles).map(
                                                      (file, index) => (
                                                        <tr key={`new-${index}`}>
                                                          {/* <td className="file_name">
                                                            {" "}
                                                            <img
                                                              src={previews[index]}
                                                              alt="preview"
                                                              style={{
                                                                width: "50px",
                                                                height: "50px",
                                                              }}
                                                            />{" "}
                                                          </td> */}
                                                          <td>
                                                            {file.type.startsWith("image/") ? (

                                                              <img
                                                                src={previews[index]}
                                                                alt="preview"
                                                                style={{
                                                                  width: "50px",
                                                                  height: "50px",
                                                                }}
                                                              />
                                                            ) : file.type === "application/pdf" ? (

                                                              <i
                                                                className="fa fa-file-pdf"
                                                                style={{
                                                                  fontSize: "24px",
                                                                  color: "#FF0000",
                                                                }}
                                                              ></i>
                                                            ) : (

                                                              <i
                                                                className="fa fa-file"
                                                                style={{
                                                                  fontSize: "24px",
                                                                  color: "#000",
                                                                }}
                                                              ></i>
                                                            )}
                                                          </td>
                                                          <td className="file_name">
                                                            {file.name}
                                                          </td>
                                                          <td className="file_type">
                                                            {file.type}
                                                          </td>
                                                          <td className="size">
                                                            {file.size < 1024 * 1024
                                                              ? `${(file.size / 1024).toFixed(
                                                                2
                                                              )} KB`
                                                              : `${(
                                                                file.size /
                                                                (1024 * 1024)
                                                              ).toFixed(2)} MB`}
                                                          </td>

                                                          <td className="action">
                                                            <div className="d-flex gap-2">
                                                              <div className="remove">
                                                                <button
                                                                  className="delete-icon"

                                                                  onClick={() => {
                                                                    fileInputRef.current.value = "";
                                                                    const updatedFiles =
                                                                      newFiles.filter(
                                                                        (_, idx) =>
                                                                          idx !== index
                                                                      );
                                                                    setNewFiles(updatedFiles);
                                                                    setFieldValue("files", [
                                                                      ...fileState,
                                                                      ...updatedFiles,
                                                                    ]);
                                                                    setPreviews(
                                                                      previews.filter(
                                                                        (_, idx) =>
                                                                          idx !== index
                                                                      )
                                                                    );
                                                                  }}
                                                                >
                                                                  <i className="ti-trash text-danger " />
                                                                </button>
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                </tbody>
                                              </table>
                                            </div>
                                            <div className="d-flex align-items-start justify-content-between gap-3 mt-4">


                                              <Button style={{ height: '40px' }}
                                                className="btn btn-outline-success text-center  d-flex align-items-center"
                                                type="submit"
                                                onClick={(e) => handleSubmit(e)}
                                              >
                                                Save{" "}
                                                <i className="ps-2 fa-regular fa-arrow-right-long"></i>
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>

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
                          Documents
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

                      <div className="datatable-wrapper ">
                        {fileStateClient && fileStateClient && (
                          <Datatable
                            columns={DocumentListColumns}
                            data={fileStateClient}
                            filter={true}
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="alldocuments"
                      role="tabpanel"
                      aria-labelledby="alldocuments-tab"
                    >
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
