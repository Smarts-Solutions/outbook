import React, { useContext, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { ADD_PEPPER_WORKS } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import sweatalert from "sweetalert2";

const Paper = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const fileInputRef = useRef(null);
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fileState, setFileState] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (event) => {
    const files = event.currentTarget.files;
    var fileArray;
    if (files && typeof files[Symbol.iterator] === "function") {
      fileArray = Array.from(files);
      setNewFiles(fileArray);
    } else {
      console.log("File input is not iterable or not correctly set.");
    }

    const previewArray = fileArray.map((file) => {
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

  const handleSubmit = async (values) => {

    const data1 = {
      req: { fileData: newFiles, customer_id: address, authToken: token },
    };

    await dispatch(ADD_PEPPER_WORKS(data1))
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
              navigate("/admin/customer");
            });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  return (
    <Formik
      initialValues={{ ...address, files: [] }}
      onSubmit={(values) => {
        handleSubmit(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form className="details__wrapper">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header step-header-blue">
                  <h4 className="card-title mb-0">
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
                                                  <a
                                                    onClick={() => {
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
                                                    <i className="ti-trash" />
                                                  </a>
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
                                <button
                                  type="button"
                                  className="btn btn-secondary text-decoration-none previestab"
                                  onClick={prev}
                                >
                                  <i className="pe-2 fa-regular fa-arrow-left-long"></i>{" "}
                                  Previous
                                </button>

                                <Button
                                  className="btn btn-info text-white text-center blue-btn"
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
  );
};

export default Paper;
