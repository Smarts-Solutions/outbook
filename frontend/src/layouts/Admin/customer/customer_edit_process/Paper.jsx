import React, { useContext, useRef, useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { ADD_PEPPER_WORKS } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import sweatalert from 'sweetalert2';
import { GET_CUSTOMER_DATA , DELETE_CUSTOMER_FILE } from '../../../../ReduxStore/Slice/Customer/CustomerSlice'

const Paper = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const fileInputRef = useRef(null);
    const location = useLocation();
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [fileState, setFileState] = useState([]);
    const [customerDetails, setCustomerDetails] = useState({
        loading: true,
        data: [],
    });

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        setFileState(event.currentTarget.files);
    };

    const GetCustomerData = async () => {
        const req = { customer_id: location.state.id, pageStatus: "4" }
        const data = { req: req, authToken: token }
        await dispatch(GET_CUSTOMER_DATA(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setCustomerDetails({
                        loading: false,
                        data: response.data
                    });
                }
                else {
                    setCustomerDetails({
                        loading: false,
                        data: []
                    });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        GetCustomerData();
    }, []);

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
                        navigate('/admin/customer');
                    })
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };


    // "action":"delete", 
    // "customer_id": 12,
    // "id" :1,
    // "file_name": "1722337175144-002.png"

    const removeItem = async (id) => {
        const req = { action: "delete", customer_id: location.state.id, id: id.customer_paper_work_id, file_name: id.file_name }
        const data = { req: req, authToken: token }

    
        console.log("data", req);
    

        await dispatch(DELETE_CUSTOMER_FILE(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    sweatalert.fire({
                        title: response.message,
                        icon: 'success',
                        timer: 3000,
                    }).then(() => {
                        GetCustomerData();
                    })
                }
            })
            .catch((error) => {
                console.log("Error", error);

            });
    }


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
                                <div className="card-body">
                                    <p className="text-muted">Upload Customer Specific Paperwork</p>
                                    <div className="dropzone dz-clickable">
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
                                                        className="btn-info text-white text-center blue-btn rounded"
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
                                            <h6>
                                                <p>Or Drag Files in here</p>
                                            </h6>
                                        </div>
                                    </div>
                                    <ul className="list-unstyled mb-0" id="dropzone-preview"></ul>
                                    <div className="container-fluid page-title-box">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div id="customerList">
                                                            <div className="row g-4 mb-3">
                                                                <div className="d-flex justify-content-end">
                                                                    <div className="pagination-wrap hstack gap-2">
                                                                        {/* Upload button moved to file input trigger */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="table-responsive table-card mt-3 mb-1">
                                                                <table
                                                                    className="table align-middle table-nowrap"
                                                                    id="customerTable"
                                                                >
                                                                    <thead className="table-light">
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
                                                                        {customerDetails.data.customer_paper_work && customerDetails.data.customer_paper_work.length > 0 ? (
                                                                            customerDetails.data.customer_paper_work.map((file, index) => (
                                                                                <tr key={file.customer_paper_work_id}>
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
                                                                                    <td className="file_name">{file.original_name}</td>
                                                                                    <td className="file_type">{file.file_type}</td>
                                                                                    <td className="size">{(file.file_size / (1024)).toFixed(2)} KB</td>
                                                                                    <td className="">
                                                                                        <div className="d-flex gap-2">
                                                                                            <div className="remove">
                                                                                                <button
                                                                                                    type="button"
                                                                                                    className="btn btn-sm btn-danger remove-item-btn"
                                                                                                    onClick={() => {
                                                                                                         removeItem(file);
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
                                                                                    No files found
                                                                                </td>
                                                                            </tr>
                                                                        )}
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
