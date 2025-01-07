import React, { useState, useRef, useEffect } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { JobDocumentAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import sweatalert from "sweetalert2";
import Swal from "sweetalert2";
import { fetchSiteAndDriveInfo, createFolderIfNotExists, uploadFileToFolder, SiteUrlFolderPath, deleteFileFromFolder } from "../../../Utils/graphAPI";


const Documents = ({ getAccessDataJob }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [uploadfiles, setUploadfiles] = useState(false);
  const [jobDocumentListData, setJobDocumentListData] = useState([]);

  const [fileState, setFileState] = useState([]);
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
    GetAllDocumentList();
    fetchSiteDetails();
  }, []);


  const GetAllDocumentList = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }
    await dispatch(JobDocumentAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setJobDocumentListData(response.data || [])
        }
        else {
          setJobDocumentListData([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const convertKBToMb = (kb) => {
    return (kb / 1024).toFixed(2);
  }

  const columns = [
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
    { name: 'File Name', selector: row => row.original_name, reorder: false, sortable: true },
    { name: 'File Type', selector: row => row.file_type, reorder: false, sortable: true },
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
        <div>
          {
            (getAccessDataJob.delete === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
              <button className="delete-icon" onClick={() => removeItem(row, 2)}>
                <i className="ti-trash fs-5 text-danger" />
              </button>
            )
          }

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const closeModelUploadDocument = async (e) => {
    setUploadfiles(false);
  }

  const handleChangeDocument = async (e) => {

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


    const files = e.target.files;

    // const files = event.currentTarget.files;
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

  }

  const uploadDocumentFun = async (e) => {

    const invalidValues = [undefined, null, "", 0, "0"];
    let job_name = "JOB_DEMO"
    if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
      job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
    }

    const uploadedFilesArray = [];

    if (newFiles.length > 0) {

      const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
      if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {

        setIsLoading(true);
        const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
        const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);

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

        const req = { action: "add", job_id: location.state.job_id, fileData: newFiles, uploadedFiles: uploadedFilesArray }
        const data = { req: req, authToken: token }
        await dispatch(JobDocumentAction(data))
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
                  setNewFiles([]);
                  setFileState([]);
                  setPreviews([]);
                  GetAllDocumentList();
                  setUploadfiles(false);
                  setIsLoading(false);
                });
              setUploadfiles(false);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            setIsLoading(false);
            setUploadfiles(false);
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
    setUploadfiles(false);
  }

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
    let job_name = "JOB_DEMO"
    if (!invalidValues.includes(location.state.data.client.id) && !invalidValues.includes(location.state.data.customer.id) && !invalidValues.includes(location.state.data.job.job_id)) {
      job_name = 'CUST' + location.state.data.customer.id + '_CLIENT' + location.state.data.client.id + '_JOB' + location.state.data.job.job_id;
    }


    let fileName = file.name;
    if (type == 2) {
      fileName = file.original_name;
    }

    if (fileName != undefined) {
      const req = { action: "delete", job_id: location.state.job_id, id: file.id, file_name: file.file_name }
      const data = { req: req, authToken: token }
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
              const response = await dispatch(JobDocumentAction(data)).unwrap();
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
                GetAllDocumentList();
                setJobDocumentListData((prevFiles) =>
                  prevFiles.filter((data) => data.id !== file.id)
                );
                const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
                const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, job_name, sharepoint_token);
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
          <div className='col-md-5 col-lg-5 col-sm-3'>
            <div className='tab-title'>
              <h3>Document</h3>
            </div>
          </div>
          <div className='col-md-7 col-lg-7 col-sm-9 mt-3 mt-sm-0'>
            <div>
              {/* {
              (getAccessDataJob.delete === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-secondary  float-sm-end ms-sm-2"> <i className="ti-trash pe-1"></i>  Delete Selected</button>
              )} */}
              {
                (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                  <button type="button" className="btn btn-info text-white float-sm-end ms-2" onClick={() => setUploadfiles(true)}> <i className="fa-regular fa-plus pe-1"></i> Add Document</button>
                )}


            </div>

          </div>
        </div>

        <div className='datatable-wrapper '>

          <Datatable
            filter={true}
            columns={columns} data={jobDocumentListData && jobDocumentListData} />
        </div>

        <CommonModal
          isOpen={uploadfiles}
          backdrop="static"
          size="md"
          title="Upload Files"
          cancel_btn={true}
          hideBtn={false}
          btn_name="Upload"
          handleClose={() => {
            closeModelUploadDocument();
            // formik.resetForm();
          }}
          Submit_Function={() => {
            uploadDocumentFun(false);
          }}
          Submit_Cancel_Function={() => {
            closeModelUploadDocument();
          }}

        >
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="upload-box" style={{ height: 150 }}>
                    <div className="dz-message needsclick">
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        id="upload_document"
                        name="upload_document"
                        className="form-control"
                        onChange={(e) => handleChangeDocument(e)}></input>
                      <div
                        className="mb-3"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                      </div>
                      {/* <h6 className="text-center">
                      <p>Or Drag File in here</p>
                    </h6> */}
                    </div>
                  </div>
                  <ul className="list-unstyled mb-0" id="dropzone-preview"></ul>
                  {
                    newFiles.length > 0 ?
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
                                                <td className="file_name">
                                                  {" "}
                                                  <img
                                                    src={previews[index]}
                                                    alt="preview"
                                                    style={{
                                                      width: "50px",
                                                      height: "50px",
                                                    }}
                                                  />{" "}
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
                                                          setPreviews(
                                                            previews.filter(
                                                              (_, idx) =>
                                                                idx !== index
                                                            )
                                                          );
                                                          removeItem(file, 1);
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
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      : ""
                  }
                </div>
              </div>
            </div>
          </div>
        </CommonModal>
      </div>
    </div>
  )
}

export default Documents