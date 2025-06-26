import React, { useContext, useRef, useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import sweatalert from "sweetalert2";
import { ADD_PEPPER_WORKS, GET_CUSTOMER_DATA, DELETE_CUSTOMER_FILE } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";
import { fetchSiteAndDriveInfo, createFolderIfNotExists, uploadFileToFolder, SiteUrlFolderPath, deleteFileFromFolder } from "../../../../Utils/graphAPI";
import { allowedTypes } from "../../../../Utils/Comman_function";

const Paper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  // const sharepoint_token = JSON.parse(localStorage.getItem("sharepoint_token"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
  });


  const [fileState, setFileState] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [siteUrl, setSiteUrl] = useState("");
  const [sharepoint_token, setSharepoint_token] = useState("");
  const [folderPath, setFolderPath] = useState("");


  //console.log("sharepoint_token", sharepoint_token);

  const handleFileChange = async (event) => {
    //  let customer_name = "DEMO"
    //  if(customerDetails.data.customer != undefined){
    //    customer_name = customerDetails.data.customer.trading_name;
    //  }
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

    const validFiles = fileArray.filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length !== fileArray.length) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed.",
      });

      fileInputRef.current.value = "";
      return;
    }



    const existingFileNames = new Set(newFiles.map(file => file.name));
    const uniqueValidFiles = validFiles.filter(file => !existingFileNames.has(file.name));

    if (uniqueValidFiles.length === 0) {
      Swal.fire({
        icon: "error",
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
      //setPreviews((prevPreviews) => [...prevPreviews, ...previewData]);
    });


  };

  const GetCustomerData = async () => {
    const req = { customer_id: location.state.id, pageStatus: "4" };
    const data1 = { req: req, authToken: token };

    await dispatch(GET_CUSTOMER_DATA(data1))
      .unwrap()
      .then((response) => {
        console.log("response", response);
        if (response.status) {
          const existingFiles = response.data.customer_paper_work || [];
          console.log("existingFiles", existingFiles);
          setCustomerDetails({
            loading: false,
            data: response.data,
          });
          setFileState(existingFiles);
        } else {
          setCustomerDetails({
            loading: false,
            data: [],
          });
        }
      })
      .catch((error) => {
        return;
      });
  };
  const fetchSiteDetails = async () => {
    const { siteUrl, folderPath, sharepoint_token } = await SiteUrlFolderPath();

    setSiteUrl(siteUrl);
    setFolderPath(folderPath);
    setSharepoint_token(sharepoint_token);
  };

  useEffect(() => {
    GetCustomerData();
    fetchSiteDetails();
  }, []);

  const handleSubmit = async (values) => {
    let customer_name = "DEMO"
    if (customerDetails.data.customer != undefined) {
      //customer_name = customerDetails.data.customer.trading_name;
      customer_name = 'CUST' + customerDetails.data.customer.customer_id;
    }

    const uploadedFilesArray = [];
    const invalidTokens = ["", "sharepoint_token_not_found", "error", undefined, null];
    if (sharepoint_token && !invalidTokens.includes(sharepoint_token)) {
      if (newFiles.length > 0) {
        setIsLoading(true);
        const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);

        console.log("site_ID", site_ID);
        console.log("drive_ID", drive_ID);
        console.log("folder_ID", folder_ID);

        const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, customer_name, sharepoint_token);

        console.log("folderId", folderId);

        for (const file of newFiles) {
          const uploadDataUrl = await uploadFileToFolder(site_ID, drive_ID, folderId, file, sharepoint_token);

          console.log("uploadDataUrl", uploadDataUrl);

          

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

    const data1 = {
      req: { fileData: newFiles, customer_id: address, authToken: token, uploadedFiles: uploadedFilesArray },
    };
    
    
    

    await dispatch(ADD_PEPPER_WORKS(data1))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert
            .fire({
              title: response.message,
              icon: "success",
              timer: 3000,
            })
            .then(() => {
              navigate("/admin/customer");
            });
          setIsLoading(false);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error)
        return;
      });
  };

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

    let customer_name = "DEMO"
    if (customerDetails.data.customer != undefined) {
      // customer_name = customerDetails.data.customer.trading_name;
      customer_name = 'CUST' + customerDetails.data.customer.customer_id;
    }
    let fileName = file.name;
    if (type == 2) {
      fileName = file.original_name;
    }
    console.log("fileName", fileName);


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

              const response = await dispatch(DELETE_CUSTOMER_FILE(data)).unwrap();
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
                setFileState((prevFiles) =>
                  prevFiles.filter((data) => data.customer_paper_work_id !== file.customer_paper_work_id)
                );

                const { site_ID, drive_ID, folder_ID } = await fetchSiteAndDriveInfo(siteUrl, sharepoint_token);
                const folderId = await createFolderIfNotExists(site_ID, drive_ID, folder_ID, customer_name, sharepoint_token);
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

  const downloadFileFromSharePoint = async (sharePointFileUrl, accessToken, fileName) => {
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


  return (
    <div className={isLoading ? "blur-container" : ""}>
      {isLoading && (
        <div className="loader-overlay">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <Formik
        initialValues={{ files: [...fileState, ...newFiles] }}
        onSubmit={() => handleSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className={"details__wrapper"}>
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header step-header-blue">
                    <h4 className="card-title mb-0">
                      Edit Paperwork
                    </h4>
                  </div>
                  <div className="card-body">
                    <div className="card mb-0">
                      <div className="card-header card-header-light-blue">
                        <h4 className="card-title fs-16">
                          Upload Customer Specific Paperwork
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
                      </div>
                    </div>


                    <div className="container-fluid page-title-box">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="">
                            {/* <div className="card-header card-header-light-blue">
                                <h4 className="card-title fs-16">
                                  Preview Paperwork
                                </h4>
                                </div> */}
                            <div className="">
                              <div id="customerList">
                                <div className="row g-4 ">
                                  <div className="d-flex justify-content-end">
                                    <div className="pagination-wrap hstack gap-2"></div>
                                  </div>
                                </div>
                                <div className="table-responsive table-card mb-1">

                                  {newFiles.length > 0 && (
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
                                                {/* <td> <img
                                                  src={previews[index]}
                                                  alt="preview"

                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                  }}
                                                /></td> */}
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
                                                    ? `${(
                                                      file.size / 1024
                                                    ).toFixed(2)} KB`
                                                    : `${(
                                                      file.size /
                                                      (1024 * 1024)
                                                    ).toFixed(2)} MB`}
                                                </td>

                                                <td className="action">
                                                  <div className="">
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
                                                          setNewFiles(
                                                            updatedFiles
                                                          );
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
                                                          removeItem(file, 1);
                                                        }}
                                                      >
                                                        <i className="ti-trash text-danger" />
                                                      </button>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                      </tbody>
                                    </table>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-header card-header-light-blue">
                              <h4 className="card-title fs-16">
                                Uploaded Paperworks
                              </h4>
                            </div>
                            <div className="card-body">
                              <div className="table-responsive table-card mb-1">
                                <table
                                  className="table align-middle table-nowrap"
                                  id="customerTable"
                                >
                                  <thead className="table-light table-head-blue">
                                    <tr>
                                      {/* <th scope="col" style={{ width: 50 }}>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input new_input"
                                            type="checkbox"
                                            id="checkAll"
                                            defaultValue="option"
                                          />
                                        </div>
                                      </th> */}
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
                                    {fileState && fileState.length > 0 ? (
                                      Array.from(fileState).map(
                                        (file, index) => (
                                          <tr key={index}>
                                            {/* <th scope="row">
                                              <div className="form-check">
                                                <input
                                                  className="form-check-input new_input"
                                                  type="checkbox"
                                                  name="chk_child"
                                                  defaultValue={`option${
                                                    index + 1
                                                  }`}
                                                />
                                              </div>
                                            </th> */}
                                            {/* <td> <img
                                              src={file.web_url}
                                              alt="preview"

                                              style={{
                                                width: "50px",
                                                height: "50px",
                                              }}
                                            /></td> */}

                                            <td>
                                              {file.file_type.startsWith("image/") ? (

                                                <img
                                                  src={file.web_url}
                                                  alt="preview"
                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                  }}
                                                />
                                              ) : file.file_type === "application/pdf" ? (

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
                                              {file.original_name}
                                            </td>
                                            <td className="file_type">
                                              {file.file_type}
                                            </td>
                                            <td className="size">
                                              {file.file_size < 1024 * 1024
                                                ? `${(
                                                  file.file_size / 1024
                                                ).toFixed(2)} KB`
                                                : `${(
                                                  file.file_size /
                                                  (1024 * 1024)
                                                ).toFixed(2)} MB`}
                                            </td>

                                            <td className="action">
                                              <div className="d-flex gap-2">
                                                <div className="remove">
                                                  <button
                                                    className="delete-icon"
                                                    onClick={(e) =>
                                                      removeItem(file, 2)
                                                    }
                                                  >
                                                    <i className="ti-trash text-danger" />
                                                  </button>


                                                  <button className="download-icon" onClick={() => downloadFileFromSharePoint(file.web_url, sharepoint_token, file.original_name)}>
                                                    <i className="ti-download" />
                                                  </button>


                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                        )
                                      )
                                    ) : (
                                      <tr>
                                        <td colSpan="5" className="text-center">
                                          No files selected
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                          </div>
                          <div className="d-flex align-items-start gap-3 mt-4 justify-content-between">
                            <button
                              type="button"
                              className="btn btn-info text-decoration-none previestab"
                              onClick={prev}
                            >
                              <i className="pe-2 fa-regular fa-arrow-left-long"></i>  Previous
                            </button>
                            <Button
                              style={{ height: '41px' }}
                              className=" py-3 btn btn-outline-success  text-center d-flex align-items-center float-end"
                              type="submit"
                              onClick={(e) => handleSubmit(e)}
                            >
                              Save <i className="ps-2 fa-regular fa-arrow-right-long"></i>
                            </Button>
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
  );
};

export default Paper;
