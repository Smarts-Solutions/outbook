import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { GetMissingLog, AddMissionLog, EditMissingLog ,UploadDocumentMissingLogAndQuery } from '../../../ReduxStore/Slice/Customer/CustomerSlice';
import { getProfile } from '../../../ReduxStore/Slice/Staff/staffSlice';
import sweatalert from 'sweetalert2';
import { convertDate, allowedTypes } from '../../../Utils/Comman_function';
import Swal from "sweetalert2";
import { fetchSiteAndDriveInfo, createFolderIfNotExists, uploadFileToFolder, SiteUrlFolderPath, deleteFileFromFolder ,deleteFolderFromFolder } from "../../../Utils/graphAPI";

const MissingLogs = ({ getAccessDataJob, goto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const fileInputRef = useRef(null);
  const role = JSON.parse(localStorage.getItem("role"));
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [addmissinglogs, setAddmissinglogs] = useState(false);
  const [showEditmissinglogsModal, setShowEditMissinglogsModal] = useState(false);
  const [viewmissinglogs, setViewmissinglogs] = useState(false);
  const [getMissingLogListData, setGetMissingLogListData] = useState([]);
  const [getProfileDetails, setGetProfileDetails] = useState([]);
  const [singleMissionData, setSingleMissionData] = useState([]);
  const [getEditData, setEditData] = useState([]);
  const [errors1, setErrors1] = useState({});
  const [draftStatus, setDraftStatus] = useState(0);


  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");



  const [missionLogAllInputData, setMissionAllInputLogData] = useState({
    missing_log: "1",
    missing_log_sent_on: new Date().toISOString().substr(0, 10),
    missing_log_prepared_date: null,
    missing_log_reviewed_by: null,
    missing_log_reviewed_date: null,
    missing_log_document: null,
    last_chaser: new Date().toISOString().substr(0, 10),
    status: "0",
    id: null
  });


  const resetForm = () => {
    setMissionAllInputLogData({
      ...missionLogAllInputData,
      missing_log: "1",
      missing_log_sent_on: new Date().toISOString().substr(0, 10),
      missing_log_prepared_date: null,
      missing_log_reviewed_date: null,
      missing_log_document: null,
      last_chaser: new Date().toISOString().substr(0, 10),
      status: "0",
      id: null
    });
  };

  useEffect(() => {

    if (getEditData && showEditmissinglogsModal) {
      setMissionAllInputLogData({
        ...missionLogAllInputData,
        missing_log: getEditData.missing_log,
        missing_log_sent_on: getEditData.missing_log_sent_on,
        missing_log_prepared_date: getEditData.missing_log_prepared_date,
        missing_log_reviewed_by: getProfileDetails?.first_name + " " + getProfileDetails?.last_name,
        missing_log_reviewed_date: getEditData.missing_log_reviewed_date,
        missing_log_document: getEditData.missing_log_document,
        last_chaser: getEditData.last_chaser,
        status: getEditData.status,
        id: getEditData.id
      });
    }
  }, [getEditData, showEditmissinglogsModal]);


  const fetchSiteDetails = async () => {
    const { siteUrl, folderPath, sharepoint_token } = await SiteUrlFolderPath();

    setSiteUrl(siteUrl);
    setFolderPath(folderPath);
    setSharepoint_token(sharepoint_token);
  };

  useEffect(() => {
    Profile()
    GetMissingLogDetails();
    fetchSiteDetails();
  }, []);

  const Profile = async (e) => {
    const req = { id: staffDetails.id }
    await dispatch(getProfile(req))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetProfileDetails(response.data)
          setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_reviewed_by: response.data.first_name + " " + response.data.last_name })
        }
        else {
          setGetProfileDetails([])
        }
      })
      .catch((error) => {
        return;
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'missing_log_document') {
      const files = e.target.files;
      var fileArray;
      if (files && typeof files[Symbol.iterator] === "function") {
        fileArray = Array.from(files);

        const validFiles = fileArray.filter((file) =>
          allowedTypes.includes(file.type)
        );

        if (validFiles.length !== fileArray.length) {

          sweatalert.fire({
            icon: "warning",
            title: "warning",
            text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed.",
          });
          e.target.value = "";
          return;
        }

        setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_document: fileArray });
      }
    }
    else {
      setMissionAllInputLogData({ ...missionLogAllInputData, [name]: value });
    }
  };

  const GetMissingLogDetails = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }

    await dispatch(GetMissingLog(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setDraftStatus(response.data.draft_process)
          setGetMissingLogListData(response.data.rows);
        }
        else {
          setGetMissingLogListData([]);
        }
      })
      .catch((err) => {
        return;
      })
  }

  const HandleMissionView = async (row) => {
    const req = { action: "getSingleView", id: row.id }
    const data = { req: req, authToken: token }
    await dispatch(GetMissingLog(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setSingleMissionData(response.data[0]);
        }
        else {
          setSingleMissionData([]);
        }
      })
      .catch((err) => {
        return;
      })
  }

  const handleSubmit = async (e) => {
    const req = { action: "add", job_id: location.state.job_id, missionDetails: missionLogAllInputData }
    const data = { req: req, authToken: token }

    await dispatch(AddMissionLog(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {

          if (missionLogAllInputData.missing_log_document != null) {
            setIsLoading(true);
            const invalidValues = [undefined, null, "", 0, "0"];
            let job_name = "JOB_DEMO"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
            }


            let missing_log = "missing_log"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              missing_log = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id + '_MISSING_LOG_'+response.data.insertId;
            }

            const uploadedFilesArray = [];
            const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];

            if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
              if (missionLogAllInputData.missing_log_document.length > 0) {
                // Fetch site and drive details
                const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);

                // Check if 'missing_log' folder exists, get its ID
                const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

               
                
                const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, missing_log, sharepoint_token);

                
                for (const file of missionLogAllInputData.missing_log_document) {
                  const uploadDataUrl = await uploadFileToFolder(site_ID, drive_ID, subfolderId, file, sharepoint_token);
                  const uploadedFileInfo = {
                    web_url: uploadDataUrl,
                    filename: file.lastModified + '-' + file.name,
                    originalname: file.name,
                    mimetype: file.type,
                    size: file.size
                  };
                  uploadedFilesArray.push(uploadedFileInfo);
                }
              }
            }

        
            const req = { action: "add", id: response.data.insertId, uploadedFiles: uploadedFilesArray , type: "missing_log" }
            const data = { req: req, authToken: token }

            await dispatch(UploadDocumentMissingLogAndQuery(data))
            .unwrap()
            .then((response) => {
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              return;
            })

          }
  
            setIsLoading(false);
            GetMissingLogDetails()
            setAddmissinglogs(false);
            resetForm();
            sweatalert.fire({
              icon: 'success',
              title: response.message,
              timerProgressBar: true,
              showConfirmButton: true,
              timer: 1500
            });

          }
          else {
            setIsLoading(false);
            sweatalert.fire({
              icon: 'error',
              title: response.message,
              timerProgressBar: true,
              showConfirmButton: true,
              timer: 1500
            });

          }
        })
      .catch((err) => {
        setIsLoading(false);
        return;
      })
  }

  const handleEditSubmit = async (e) => {

    const req = { action: "add", id: missionLogAllInputData.id, missionDetails: missionLogAllInputData }
    const data = { req: req, authToken: token }

    if (parseInt(missionLogAllInputData.missing_log) == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Change Missing Log to Yes',
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500
      });
      return
    }

    if (missionLogAllInputData.missing_log_reviewed_date == null || missionLogAllInputData.missing_log_reviewed_date == "") {
      Swal.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Missing Log Reviewed Date is Required',
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500
      });
      return
    }

    await dispatch(EditMissingLog(data))
      .unwrap()
      .then(async(response) => {
        if (response.status) {

          if (missionLogAllInputData.missing_log_document != null && missionLogAllInputData.missing_log_document != undefined) {
            setIsLoading(true);
            const invalidValues = [undefined, null, "", 0, "0"];
            let job_name = "JOB_DEMO"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
            }


            let missing_log = "missing_log"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              missing_log = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id + '_MISSING_LOG_'+missionLogAllInputData.id;
            }


            const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);

            const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

            const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, missing_log, sharepoint_token);

            await deleteFolderFromFolder(site_ID, drive_ID, subfolderId , sharepoint_token);


          
            const uploadedFilesArray = [];
            const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];

            if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
              if (missionLogAllInputData.missing_log_document.length > 0) {
                // Fetch site and drive details
                

                // Check if 'missing_log' folder exists, get its ID
                const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

              
                const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, missing_log, sharepoint_token);

                
                for (const file of missionLogAllInputData.missing_log_document) {
                  const uploadDataUrl = await uploadFileToFolder(site_ID, drive_ID, subfolderId, file, sharepoint_token);
                  const uploadedFileInfo = {
                    web_url: uploadDataUrl,
                    filename: file.lastModified + '-' + file.name,
                    originalname: file.name,
                    mimetype: file.type,
                    size: file.size
                  };
                  uploadedFilesArray.push(uploadedFileInfo);
                }
              }
            }

        
            const req = { action: "add", id: missionLogAllInputData.id, uploadedFiles: uploadedFilesArray , type: "missing_log" }
            const data = { req: req, authToken: token }

            await dispatch(UploadDocumentMissingLogAndQuery(data))
            .unwrap()
            .then((response) => {
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              return;
            })

          }

          setIsLoading(false);
          GetMissingLogDetails()
          setShowEditMissinglogsModal(false);
          resetForm();
          sweatalert.fire({
            icon: 'success',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          });

        }
        else {

          sweatalert.fire({
            icon: 'error',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          });

        }
      })
      .catch((err) => {
        return;
      })
  }



  const columns = [
    { name: 'Missing Log Title', selector: row => row.title, sortable: true },
    { name: 'Missing Log Sent On', selector: row => convertDate(row.missing_log_sent_on), reorder: false, sortable: true },
    { name: 'Missing Log Prepared Date', selector: row => convertDate(row.missing_log_prepared_date), reorder: false, sortable: true },
    { name: 'Missing Log Reviewed Date', selector: row => convertDate(row.missing_log_reviewed_date), reorder: false, sortable: true },
    { name: 'Last Chaser', selector: row => convertDate(row.last_chaser), reorder: false, sortable: true },
    { name: 'Status', selector: row => row.status == 1 ? "Completed" : "Incomplete", reorder: false, sortable: true },

    { name: 'File', selector: row => row.web_url != null ? 
      
      row.file_type.startsWith("image/") ? (

        <img
          src={row.web_url}
          alt="preview"
          style={{
            width: "50px",
            height: "50px",
          }}
        />
      ) : row.file_type === "application/pdf" ? (

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
      )
      
      : "", reorder: false, sortable: true },

    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="view-icon" onClick={() => { HandleMissionView(row); setViewmissinglogs(true) }}>
            <i className="fa fa-eye fs-6 text-warning" />
          </button>
          {
            row.status == 1 ? "" : goto != "report" && (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") ?
              <button className="edit-icon" onClick={() => {
                setShowEditMissinglogsModal(true);
                setEditData(row)
              }}>
                <i className="ti-pencil" />
              </button> : ""
          }
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

  return (
    <div className={isLoading ? "blur-container" : ""}>
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

    <div className=''>
      <div className='row'>
        <div className='col-md-8'>
          <div className='tab-title'>
            <h3>Missing Logs</h3>
          </div>
        </div>
        <div className='col-md-4'>
          <div>
            {
              draftStatus == 0 && goto != "report" && (getAccessDataJob.insert === 1 || role === "ADMIN" || role === "SUPERADMIN") ? <button type="button" className="btn btn-info text-white float-end" onClick={() => setAddmissinglogs(true)}>
                <i className="fa-regular fa-plus pe-1"></i> Add Missing Logs
              </button> : ""
            }
          </div>
        </div>
      </div>

      <div className='datatable-wrapper '>
        <Datatable filter={true} columns={columns} data={getMissingLogListData} />
      </div>

      <CommonModal
        isOpen={addmissinglogs}
        backdrop="static"
        size="lg"
        cancel_btn={false}
        btn_2="true"
        btn_name="Save"
        title="Add Missing Log"
        hideBtn={false}

        handleClose={() => {
          setAddmissinglogs(false);
          resetForm();
        }}
        Submit_Function={() => handleSubmit()}
      >
        <div className="row">

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log?
              </label>
              <select
                name="missing_log"
                id="missing_log"
                className={errors1["missing_log"] ? "error-field form-select mb-3 ismissinglog" : "form-select mb-3 ismissinglog"}
                autoFocus
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log}
              >
                <option value="1" selected >Yes</option>
                {/* <option value="0" selected>No</option> */}
              </select>
              {errors1["missing_log"] && (
                <div className="error-text">
                  {errors1["missing_log"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Sent On
              </label>
              <input
                type="date"
                className={errors1["missing_log_sent_on"] ? "error-field form-control" : "form-control"}

                placeholder=""
                id="missing_log_sent_on"
                name="missing_log_sent_on"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_sent_on}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors1["missing_log_sent_on"] && (
                <div className="error-text">
                  {errors1["missing_log_sent_on"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog1" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Prepared Date
              </label>
              <input
                type="date"

                className={errors1["missing_log_prepared_date"] ? "error-field form-control" : "form-control"}
                placeholder=""
                id="missing_log_prepared_date"
                name="missing_log_prepared_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_prepared_date}
              />
              {errors1["missing_log_prepared_date"] && (
                <div className="error-text">
                  {errors1["missing_log_prepared_date"]}
                </div>
              )}


            </div>
          </div>

          <div id="MissingLog4" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed By
              </label>
              <input
                type="text"
                defaultValue=""
                className={errors1["missing_log_reviewed_by"] ? "error-field form-control" : "form-control"}
                placeholder="Missing Log Reviewed By"
                id="missing_log_reviewed_by"
                name="missing_log_reviewed_by"
                disabled={true}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_by}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors1["missing_log_reviewed_by"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_by"]}
                </div>
              )}

            </div>
          </div>
          <div id="MissingLog5" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed Date
              </label>
              <input
                type="date"
                className={errors1["missing_log_reviewed_date"] ? "error-field form-control" : "form-control"}
                placeholder=""
                id="missing_log_reviewed_date"
                name="missing_log_reviewed_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_date}
              />
              {errors1["missing_log_reviewed_date"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_date"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog8" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Document
              </label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                id="missing_log_document"
                name="missing_log_document"
                onChange={(event) => { handleChange(event) }}
                className={errors1["missing_log_document"] ? "error-field custom-file-input form-control" : "custom-file-input form-control"}
              />
              {errors1["missing_log_document"] && (
                <div className="error-text">
                  {errors1["missing_log_document"]}
                </div>
              )}
            </div>
          </div>

          <div id="MissingLog9" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Last Chaser
              </label>
              <input
                type="date"
                className={errors1["last_chaser"] ? "error-field form-control" : "form-control"}

                placeholder=""
                id="last_chaser"
                name="last_chaser"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.last_chaser}
              />
              {errors1["last_chaser"] && (
                <div className="error-text">
                  {errors1["last_chaser"]}
                </div>
              )}
            </div>
          </div>

          <div id="MissingLog6" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Status
              </label>
              <div style={{ display: "flex" }}>
                <div>
                  <input
                    type="radio"
                    id="complete"
                    name="status"
                    value="1"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "1"}
                  />
                  &nbsp; <label htmlFor="complete">Complete</label>

                </div>
                &nbsp;
                <div style={{ marginLeft: 10 }}>
                  <input
                    type="radio"
                    id="incomplete"
                    name="status"
                    value="0"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "0"}
                  />
                  &nbsp; <label htmlFor="incomplete">Incomplete</label>

                </div>

              </div>
              {errors1["status"] && (
                <div className="error-text">
                  {errors1["status"]}
                </div>
              )}

            </div>
          </div>

        </div>


      </CommonModal>

      <CommonModal
        isOpen={showEditmissinglogsModal}
        backdrop="static"
        size="lg"
        cancel_btn={false}
        btn_2="true"
        btn_name="Save"
        title="Edit Missing Log"
        hideBtn={false}
        handleClose={() => {
          setShowEditMissinglogsModal(false);
          resetForm();
        }}
        Submit_Function={() => { handleEditSubmit(); }}
      >
        <div className="row">

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log?
              </label>
              <select
                name="missing_log"
                id="missing_log"
                className={errors1["missing_log"] ? "error-field form-select mb-3 ismissinglog" : "form-select mb-3 ismissinglog"}
                autoFocus
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log}
              >
                <option value="1" selected>Yes</option>
                {/* <option value="0">No</option> */}
              </select>
              {errors1["missing_log"] && (
                <div className="error-text">
                  {errors1["missing_log"]}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Sent On
              </label>
              <input
                type="date"
                className={errors1["missing_log_sent_on"] ? "error-field form-control" : "form-control"}

                placeholder=""
                id="missing_log_sent_on"
                name="missing_log_sent_on"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_sent_on}
              />
              {errors1["missing_log_sent_on"] && (
                <div className="error-text">
                  {errors1["missing_log_sent_on"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog1" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Prepared Date
              </label>
              <input
                type="date"
                className={errors1["missing_log_prepared_date"] ? "error-field form-control" : "form-control"}
                placeholder=""
                id="missing_log_prepared_date"
                name="missing_log_prepared_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_prepared_date}
              />
              {errors1["missing_log_prepared_date"] && (
                <div className="error-text">
                  {errors1["missing_log_prepared_date"]}
                </div>
              )}

            </div>
          </div>

          <div id="MissingLog4" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed By
              </label>
              <input
                type="text"
                defaultValue=""
                className={errors1["missing_log_reviewed_by"] ? "error-field form-control" : "form-control"}
                placeholder="Missing Log Reviewed By"
                id="missing_log_reviewed_by"
                name="missing_log_reviewed_by"
                disabled={true}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_by}

              />
              {errors1["missing_log_reviewed_by"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_by"]}
                </div>
              )}

            </div>
          </div>
          <div id="MissingLog5" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed Date
              </label>
              <input
                type="date"
                className={errors1["missing_log_reviewed_date"] ? "error-field form-control" : "form-control"}
                placeholder=""
                id="missing_log_reviewed_date"
                name="missing_log_reviewed_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_date}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors1["missing_log_reviewed_date"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_date"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog8" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Document
              </label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                id="missing_log_document"
                name="missing_log_document"
                onChange={(event) => { handleChange(event) }}
                className={errors1["missing_log_document"] ? "error-field custom-file-input form-control" : "custom-file-input form-control"}

              />
              {errors1["missing_log_document"] && (
                <div className="error-text">
                  {errors1["missing_log_document"]}
                </div>
              )}
            </div>
          </div>

          <div id="MissingLog9" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Last Chaser
              </label>
              <input
                type="date"
                className={errors1["last_chaser"] ? "error-field form-control" : "form-control"}

                placeholder=""
                id="last_chaser"
                name="last_chaser"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.last_chaser}
              />
              {errors1["last_chaser"] && (
                <div className="error-text">
                  {errors1["last_chaser"]}
                </div>
              )}
            </div>
          </div>



          <div id="MissingLog6" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Status
              </label>
              <div style={{ display: "flex" }}>
                <div>
                  <input
                    type="radio"
                    id="complete"
                    name="status"
                    value="1"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "1"}
                  />
                  &nbsp; <label htmlFor="complete">Complete</label>

                </div>
                &nbsp;
                <div style={{ marginLeft: 10 }}>
                  <input
                    type="radio"
                    id="incomplete"
                    name="status"
                    value="0"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "0"}
                  />
                  &nbsp; <label htmlFor="incomplete">Incomplete</label>

                </div>

              </div>
              {errors1["status"] && (
                <div className="error-text">
                  {errors1["status"]}
                </div>
              )}

            </div>
          </div>

        </div>


      </CommonModal>

      <CommonModal
        isOpen={viewmissinglogs}
        backdrop="static"
        size="md"
        title="View Missing Logs"
        hideBtn={true}
        handleClose={() => {
          setViewmissinglogs(false);
          // formik.resetForm();
        }}
        Submit_Function={() => handleSubmit()}
      >
        <div className="av">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Missing Log Sent On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{singleMissionData && singleMissionData?.missing_log_sent_on}</span>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Missing Paperwork Received On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{singleMissionData && singleMissionData?.missing_paperwork_received_on}</span>
            </div>
          </div> */}
          {/* <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Status
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">On Hold</span>
            </div>
          </div> */}
        </div>


      </CommonModal>
    </div>

    </div>
  );
}

export default MissingLogs;
