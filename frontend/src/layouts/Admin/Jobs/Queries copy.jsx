import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { QueryAction, AddQuery, EditQuery, UploadDocumentMissingLogAndQuery } from '../../../ReduxStore/Slice/Customer/CustomerSlice'
import sweatalert from 'sweetalert2';
import { convertDate } from '../../../Utils/Comman_function';

import { fetchSiteAndDriveInfo, createFolderIfNotExists, uploadFileToFolder, SiteUrlFolderPath, deleteFileFromFolder ,deleteFolderFromFolder } from "../../../Utils/graphAPI";

const Queries = ({ getAccessDataJob, goto }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [addquery, setAddquery] = useState(false);
  const [viewquery, setViewquery] = useState(false);
  const [editViewquery, setEditViewquery] = useState(false);
  const [AllQueryList, setAllQueryList] = useState([]);
  const [errors1, setErrors1] = useState({});
  const [EditData, setEditData] = useState({});
  const [singleQueryData, setSingleQueryData] = useState([]);
  const [draftStatus, setDraftStatus] = useState(0);

  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");

  const [AllQueryInputdata, setAllQueryInputdata] = useState({
    QueriesRemaining: "0",
    ReviewedBy: '0',
    MissingQueriesPreparedDate: null,
    QuerySentDate: new Date().toISOString().substr(0, 10),
    ResponseReceived: '0',
    status: "0",
    id: null,
    FinalQueryResponseReceivedDate: null,
    QueryDocument: null,
    last_chaser: new Date().toISOString().substr(0, 10),
  });

  const resetForm = () => {
    setAllQueryInputdata({
      ...AllQueryInputdata,
      QueriesRemaining: "0",
      ReviewedBy: '0',
      MissingQueriesPreparedDate: null,
      QuerySentDate: new Date().toISOString().substr(0, 10),
      ResponseReceived: '0',
      status: "0",
      id: null,
      FinalQueryResponseReceivedDate: null,
      QueryDocument: null,
      last_chaser: new Date().toISOString().substr(0, 10),
    });
  };


  useEffect(() => {
    if (EditData && editViewquery) {
      setAllQueryInputdata({
        QueriesRemaining: EditData.queries_remaining,
        ReviewedBy: EditData.reviewed_by,
        MissingQueriesPreparedDate: EditData.missing_queries_prepared_date,
        QuerySentDate: EditData.query_sent_date,
        ResponseReceived: EditData.response_received,
        status: EditData.status,
        FinalQueryResponseReceivedDate: EditData.final_query_response_received_date,
        QueryDocument: EditData.query_document,
        id: EditData.id,
        last_chaser: EditData.last_chaser,
      });
    }
  }, [EditData, editViewquery]);


  const fetchSiteDetails = async () => {
    const { siteUrl, folderPath, sharepoint_token } = await SiteUrlFolderPath();

    setSiteUrl(siteUrl);
    setFolderPath(folderPath);
    setSharepoint_token(sharepoint_token);
  };

  useEffect(() => {
    GetQueryAllList();
    fetchSiteDetails()
  }, []);

  const GetQueryAllList = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }
    await dispatch(QueryAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setDraftStatus(response.data.draft_process)
          setAllQueryList(response.data.rows || [])
        }
        else {
          setAllQueryList([])
        }
      })
      .catch((error) => {
        return;
      })


  }

  const HandleQueryView = async (row) => {
    const req = { action: "getSingleView", id: row.id }
    const data = { req: req, authToken: token }
    await dispatch(QueryAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setSingleQueryData(response.data[0]);
        }
        else {
          setSingleQueryData([]);
        }
      })
      .catch((err) => {
        return;
      })
  }

  const HandleAddQuery = async () => {
    const req = { action: "add", job_id: location.state.job_id, data: AllQueryInputdata }
    const data = { req: req, authToken: token }

    await dispatch(AddQuery(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {

          if (AllQueryInputdata.QueryDocument != null) {
            setIsLoading(true);
            const invalidValues = [undefined, null, "", 0, "0"];
            let job_name = "JOB_DEMO"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
            }


            let query_log = "query_log"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              query_log = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id + '_QUERY_LOG_' + response.data.insertId;
            }

            const uploadedFilesArray = [];
            const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];

            if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
              if (AllQueryInputdata.QueryDocument.length > 0) {
                // Fetch site and drive details
                const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);

                // Check if 'query_log' folder exists, get its ID
                const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);



                const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, query_log, sharepoint_token);


                for (const file of AllQueryInputdata.QueryDocument) {
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


            const req = { action: "add", id: response.data.insertId, uploadedFiles: uploadedFilesArray, type: "query_log" }
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


          setAddquery(false)
          GetQueryAllList()
          resetForm()
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
      .catch((error) => {
        return;
      })

  }

  const HandleEditQuery = async () => {
    const req = { action: "add", data: AllQueryInputdata }
    const data = { req: req, authToken: token }

    if (parseInt(AllQueryInputdata.QueriesRemaining) == 0) {
      sweatalert.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Change Queries Remaining to Yes',
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500
      });
      return
    }

    if (AllQueryInputdata.FinalQueryResponseReceivedDate == null || AllQueryInputdata.FinalQueryResponseReceivedDate == "") {
      sweatalert.fire({
        icon: 'warning',
        title: 'Warning...',
        text: 'Change Final Query Response Reviewed Date is Required',
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500
      });
      return
    }


    await dispatch(EditQuery(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {


          if (AllQueryInputdata.QueryDocument != null && AllQueryInputdata.QueryDocument != undefined) {
            setIsLoading(true);
            const invalidValues = [undefined, null, "", 0, "0"];
            let job_name = "JOB_DEMO"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
            }


            let query_log = "query_log"
            if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
              query_log = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id + '_QUERY_LOG_' + AllQueryInputdata.id;
            }

            // Fetch site and drive details
            const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);

            const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

            const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, query_log, sharepoint_token);

            await deleteFolderFromFolder(site_ID, drive_ID, subfolderId, sharepoint_token);

            const uploadedFilesArray = [];
            const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];

            if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
              if (AllQueryInputdata.QueryDocument.length > 0) {


                // Check if 'query_log' folder exists, get its ID
                const missingLogFolderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

                const subfolderId = await createFolderIfNotExists(site_ID, drive_ID, missingLogFolderId, query_log, sharepoint_token);


                for (const file of AllQueryInputdata.QueryDocument) {
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


            const req = { action: "add", id: AllQueryInputdata.id, uploadedFiles: uploadedFilesArray, type: "query_log" }
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
          setEditViewquery(false)
          GetQueryAllList()
          resetForm()
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
      .catch((error) => {
        return;
      })

  }

  const handleChange = (e) => {
    const { name } = e.target;

    if (name === "QueryDocument") {
      const files = e.target.files;
      let fileArray;

      if (files && typeof files[Symbol.iterator] === "function") {
        fileArray = Array.from(files);

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
          // Show warning alert
          sweatalert.fire({
            icon: "warning",
            title: "Warning",
            text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed.",
          });


          e.target.value = "";
          return;
        } else {
          setAllQueryInputdata({
            ...AllQueryInputdata,
            QueryDocument: fileArray,
          });
        }
      }
    } else {
      setAllQueryInputdata({ ...AllQueryInputdata, [name]: e.target.value });
    }
  };

  const columns = [
    { name: 'Query Title', selector: row => row.title, reorder: false, sortable: true },
    { name: 'Query Sent Date', selector: row => convertDate(row.query_sent_date), reorder: false, sortable: true },
    { name: 'Missing Queries Prepared Date', selector: row => convertDate(row.missing_queries_prepared_date), reorder: false, sortable: true },
    { name: 'Final Query Response Received Date', selector: row => convertDate(row.final_query_response_received_date), reorder: false, sortable: true },
    { name: 'Last Chaser', selector: row => convertDate(row.last_chaser), reorder: false, sortable: true },
    { name: 'Status', selector: row => row.status == 1 ? "Complete" : "Incomplete", reorder: false, sortable: true },
    {
      name: 'File', selector: row => row.web_url != null ?

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

        : "", reorder: false, sortable: true
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button className="view-icon" onClick={() => { HandleQueryView(row); setViewquery(true) }}>
            <i className="fa fa-eye fs-6 text-warning" />
          </button>
          {
            row.status == 1 ? "" : goto != "report" && (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") ?
              <button className="edit-icon" onClick={() => { setEditViewquery(true); setEditData(row) }}>
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
              <h3>Queries</h3>
            </div>
          </div>
          <div className='col-md-4'>
            <div>
              {
                draftStatus == 0 && goto != "report" && (getAccessDataJob.insert === 1 || role === "ADMIN" || role === "SUPERADMIN") ?
                  <button type="button" className="btn btn-info text-white float-end " onClick={() => setAddquery(true)} >
                    <i className="fa-regular fa-plus pe-1"></i> Add Query</button>
                  :
                  ""
              }
            </div>

          </div>
        </div>

        <div className='datatable-wrapper '>

          <Datatable
            filter={true}
            columns={columns} data={AllQueryList} />
        </div>

        <CommonModal
          isOpen={addquery}
          backdrop="static"
          size="lg"
          cancel_btn="true"
          btn_2="true"
          title={`Queries ${AllQueryList?.length > 0 ? `(Last Query Sent on ${AllQueryList[0].query_sent_date})` : ""}`}
          hideBtn={false}
          btn_name="Save"
          handleClose={() => {
            setAddquery(false);
            resetForm();
            setErrors1({});
          }}
          Submit_Function={() => HandleAddQuery()}
          Submit_Cancel_Function={() => { setAddquery(false); resetForm(); setErrors1({}); }}
        >
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="firstNameinput" className="form-label">
                Queries Remaining?
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="QueriesRemaining"
                id="QueriesRemaining"
                autoFocus
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.QueriesRemaining}
              >
                <option value="">Select</option>
                <option value="1">Yes</option>                                                                                                                                        m
                <option value="0" selected>No</option>
              </select>
              {errors1["QueriesRemaining"] && (
                <div className="error-text">
                  {errors1["QueriesRemaining"]}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <label htmlFor="firstNameinput" className="form-label">Reviewed By</label>
              <select
                className="form-select "
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                name="ReviewedBy"
                id="ReviewedBy"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.ReviewedBy}
              >

                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors1["ReviewedBy"] && (
                <div className="error-text">
                  {errors1["ReviewedBy"]}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Missing Queries Prepared Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  id="MissingQueriesPreparedDate"
                  name="MissingQueriesPreparedDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.MissingQueriesPreparedDate}
                />
                {errors1["MissingQueriesPreparedDate"] && (
                  <div className="error-text">
                    {errors1["MissingQueriesPreparedDate"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Query Sent Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""

                  id="QuerySentDate"
                  name="QuerySentDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.QuerySentDate}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors1["QuerySentDate"] && (
                  <div className="error-text">
                    {errors1["QuerySentDate"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Response Received
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="ResponseReceived"
                  id="ResponseReceived"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.ResponseReceived}
                >

                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors1["ResponseReceived"] && (
                  <div className="error-text">
                    {errors1["ResponseReceived"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Final Query Response Received Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  id="FinalQueryResponseReceivedDate"
                  name="FinalQueryResponseReceivedDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.FinalQueryResponseReceivedDate}
                />
                {errors1["FinalQueryResponseReceivedDate"] && (
                  <div className="error-text">
                    {errors1["FinalQueryResponseReceivedDate"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Last Chaser
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""

                  id="last_chaser"
                  name="last_chaser"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.last_chaser}
                />
                {errors1["last_chaser"] && (
                  <div className="error-text">
                    {errors1["last_chaser"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Query Document
                </label>
                <input
                  type="file"
                  multiple
                  id="QueryDocument"
                  name="QueryDocument"
                  onChange={(event) => { handleChange(event) }}

                  className="custom-file-input form-control"
                />
                {errors1["QueryDocument"] && (
                  <div className="error-text">
                    {errors1["QueryDocument"]}
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
                      checked={AllQueryInputdata.status === "1"}
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
                      checked={AllQueryInputdata.status === "0"}
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
          isOpen={editViewquery}
          backdrop="static"
          size="lg"
          cancel_btn="true"
          btn_2="true"
          title={`Edit Queries ${AllQueryList?.length > 0 ? `(Last Query Sent on ${AllQueryList[0].query_sent_date})` : ""}`}
          hideBtn={false}
          btn_name="Save"
          handleClose={() => {
            setEditViewquery(false);
            resetForm();

          }}
          Submit_Function={() => HandleEditQuery()}
          Submit_Cancel_Function={() => { setEditViewquery(false); resetForm(); }}
        >
          <div className="row">
            <div className="col-lg-6">
              <label htmlFor="firstNameinput" className="form-label">
                Queries Remaining?
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="QueriesRemaining"
                id="QueriesRemaining"
                autoFocus
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.QueriesRemaining}
              >

                <option value="1">Yes</option>
                <option value="0" selected>No</option>
              </select>
              {errors1["QueriesRemaining"] && (
                <div className="error-text">
                  {errors1["QueriesRemaining"]}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <label htmlFor="firstNameinput" className="form-label">Reviewed By</label>
              <select
                className="form-select "
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                name="ReviewedBy"
                id="ReviewedBy"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.ReviewedBy}
              >

                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors1["ReviewedBy"] && (
                <div className="error-text">
                  {errors1["ReviewedBy"]}
                </div>
              )}
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Missing Queries Prepared Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  id="MissingQueriesPreparedDate"
                  name="MissingQueriesPreparedDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.MissingQueriesPreparedDate}
                />
                {errors1["MissingQueriesPreparedDate"] && (
                  <div className="error-text">
                    {errors1["MissingQueriesPreparedDate"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Query Sent Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""

                  id="QuerySentDate"
                  name="QuerySentDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.QuerySentDate}
                />
                {errors1["QuerySentDate"] && (
                  <div className="error-text">
                    {errors1["QuerySentDate"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Response Received
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="ResponseReceived"
                  id="ResponseReceived"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.ResponseReceived}
                >

                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors1["ResponseReceived"] && (
                  <div className="error-text">
                    {errors1["ResponseReceived"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Final Query Response Received Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  id="FinalQueryResponseReceivedDate"
                  name="FinalQueryResponseReceivedDate"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.FinalQueryResponseReceivedDate}
                />
                {errors1["FinalQueryResponseReceivedDate"] && (
                  <div className="error-text">
                    {errors1["FinalQueryResponseReceivedDate"]}
                  </div>
                )}
              </div>
            </div>



            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Last Chaser
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""

                  id="last_chaser"
                  name="last_chaser"
                  onChange={(e) => handleChange(e)}
                  value={AllQueryInputdata.last_chaser}
                />
                {errors1["last_chaser"] && (
                  <div className="error-text">
                    {errors1["last_chaser"]}
                  </div>
                )}
              </div>
            </div>




            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Query Document
                </label>
                <input
                  type="file"
                  multiple
                  id="QueryDocument"
                  name="QueryDocument"
                  onChange={(event) => { handleChange(event) }}
                  className="custom-file-input form-control"
                />
                {errors1["QueryDocument"] && (
                  <div className="error-text">
                    {errors1["QueryDocument"]}
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
                      checked={AllQueryInputdata.status === "1"}
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
                      checked={AllQueryInputdata.status === "0"}
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
          isOpen={viewquery}
          backdrop="static"
          size="md"
          title="Query"
          // btn_name="Close"
          hideBtn={true}
          cancel_btn="true"
          btn_2="true"
          handleClose={() => {
            setViewquery(false);
          }}
          Submit_Cancel_Function={() => { setViewquery(false); }}
          Submit_Function={() => setViewquery(false)}
        >
          <div className="row">
            <div className="card col-md-12">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="customername-field" className="form-label">
                      Query Sent Date{" "}
                    </label>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted">{singleQueryData && singleQueryData.query_sent_date}</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="customername-field" className="form-label">
                      Response Received
                    </label>
                  </div>
                  <div className="col-md-6">
                    <span className="text-muted">{singleQueryData && singleQueryData.response_received == 1 ? "Yes" : "No"}</span>
                  </div>
                </div>
                {/* <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customername-field" className="form-label">
                    Response
                  </label>
                </div>
                <div className="col-md-6">
                  <span className="text-muted">{singleQueryData && singleQueryData.response}</span>
                </div>
              </div> */}
              </div>
            </div>
          </div>



        </CommonModal>
      </div>

    </div>

  )
}

export default Queries