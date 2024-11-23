import React, { useContext, useRef, useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import sweatalert from "sweetalert2";
import {  ADD_PEPPER_WORKS,  GET_CUSTOMER_DATA,   DELETE_CUSTOMER_FILE} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import Swal from "sweetalert2";

const Paper = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    loading: true,
    data: [],
  });
  const [fileState, setFileState] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (event) => {
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
     
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Only PDFs, DOCS, PNG, JPG, and JPEG are allowed.",
      });
      return;
    }

    setNewFiles(validFiles);

    const previewArray = validFiles.map((file) => {
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

  const GetCustomerData = async () => {
    const req = { customer_id: location.state.id, pageStatus: "4" };
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

  useEffect(() => {
    GetCustomerData();
  }, []);

  const handleSubmit = async (values) => {

    const data1 = {
      req: { fileData: newFiles, customer_id: address, authToken: token },
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
        }
      })
      .catch((error) => {
          console.log(error)
        return;
      });
  };

  const removeItem = async (file) => {
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
            }
          } catch (error) {
            return;
          }
        }
      });
  };
  

  return (
    <Formik
      initialValues={{ files: [...fileState, ...newFiles] }}
      onSubmit={handleSubmit}
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
                                              <td>        <img
                                                  src={previews[index]}
                                                  alt="preview"

                                                  style={{
                                                    width: "50px",
                                                    height: "50px",
                                                  }}
                                                /></td>
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
                                      <th scope="col" style={{ width: 50 }}>
                                        <div className="form-check">
                                          <input
                                            className="form-check-input new_input"
                                            type="checkbox"
                                            id="checkAll"
                                            defaultValue="option"
                                          />
                                        </div>
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
                                            <th scope="row">
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
                                            </th>
                                            <td className="file_name">
                                              {file.file_name}
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
                                                      removeItem(file)
                                                    }
                                                  >
                                                    <i className="ti-trash text-danger" />
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
                          style={{height:'41px'}}
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
  );
};

export default Paper;
