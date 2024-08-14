import React, { useContext, useRef, useState } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { ADD_PEPPER_WORKS } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import sweatalert from 'sweetalert2';


const Paper = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const fileInputRef = useRef(null);
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fileState, setFileState] = useState([]);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        setFileState(event.currentTarget.files);
    };

    const handleSubmit = async () => {
        let data = new FormData();

        if (fileState && typeof fileState[Symbol.iterator] === 'function') {
            Array.from(fileState).forEach((file, index) => {
                data.append("files", file);
            });
        } else {
            console.error("fileState is not iterable or not correctly set.");
            return;
        }

        data.append('customer_id', address);

        const data1 = { req: data, authToken: token }
        await dispatch(ADD_PEPPER_WORKS(data1))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    sweatalert.fire({
                        title: response.message,
                        icon: 'success',
                        timer: 3000,
                    }).then(() => {
                        localStorage.removeItem("currentStep");
                        localStorage.removeItem("coustomerId");
                        navigate('/admin/customer');
                    })
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
                <Form className={"details__wrapper"}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-header step-header-blue">
                                <p className="fs-6 card-title">Upload Customer Specific Paperwork</p>

                                </div>
                                <div className="card-body">
                                    {/* <div className="dropzone dz-clickable">
                                        <div className="dz-message needsclick">
                                            <div
                                                className="mb-3"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    multiple
                                                    onChange={(event) => {
                                                        setFieldValue("files", event.currentTarget.files);
                                                        handleFileChange(event);
                                                    }}
                                                    style={{ display: "none" }}
                                                />
                                                <label htmlFor="fileInput">
                                                    <button
                                                        type="button"
                                                        id="btn1"
                                                        className="btn btn-outline-primary"
                                                        style={{
                                                            border: "1px solid #0E6E91",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                        onClick={handleUploadClick}
                                                    >
                                                        <i className="ri-upload-cloud-fill" />
                                                        <span style={{ color: "#0E6E91" }}>Choose Files</span>
                                                    </button>
                                                </label>
                                            </div>
                                            
                                        </div>
                                    </div> */}
                                    <div className="input-group">
  {/* Hello world */}
  <div className="custom-file w-100">

  <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    multiple
                                                    onChange={(event) => {
                                                        setFieldValue("files", event.currentTarget.files);
                                                        handleFileChange(event);
                                                    }}
                                                    className="custom-file-input form-control" id="inputGroupFile04"
                                                    
                                                />
{/*     
    <label className="custom-file-label" htmlFor="inputGroupFile04">
      Choose file
    </label> */}
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
                                                                    <div className="pagination-wrap hstack gap-2">
                                                                        {/* Upload button moved to file input trigger */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="table-responsive table-card  mb-1">
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
                                                                        <Field name="files">
                                                                            {({ field, form }) => {
                                                                                const { files } = form.values;
                                                                                return files.length > 0 ? (
                                                                                    Array.from(files).map((file, index) => (
                                                                                        <tr key={index}>
                                                                                            <th scope="row">
                                                                                                <div className="form-check">
                                                                                                    <input
                                                                                                        className="form-check-input new_input"
                                                                                                        type="checkbox"
                                                                                                        name="chk_child"
                                                                                                        defaultValue={`option${index + 1}`}
                                                                                                    />
                                                                                                </div>
                                                                                            </th>
                                                                                            <td className="file_name">{file.name}</td>
                                                                                            <td className="file_type">{file.type}</td>
                                                                                            <td className="size">{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                                                                                            <td className="action">
                                                                                                <div className="d-flex gap-2">
                                                                                                    <div className="remove">
                                                                                                        <button
                                                                                                            className="btn btn-sm fs-5 text-danger remove-item-btn"
                                                                                                            onClick={() => {
                                                                                                                const newFiles = Array.from(files);
                                                                                                                newFiles.splice(index, 1);
                                                                                                                form.setFieldValue("files", newFiles);
                                                                                                            }}
                                                                                                        >
                                                                                                            <i className="ti-trash" />
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="5" className="text-center">
                                                                                            No files selected
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            }}
                                                                        </Field>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                            <div className="d-flex align-items-start gap-3 mt-4">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success text-decoration-none previestab"
                                                                    onClick={prev}
                                                                >
                                                                    Previous
                                                                </button>
                                                                <Button className="btn btn-light" type="button" style={{ marginLeft: "auto" }}>
                                                                    Cancel
                                                                </Button>
                                                                <Button className="btn btn-info text-white text-center blue-btn" type="submit" onClick={() => handleSubmit()}>
                                                                    Save
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
