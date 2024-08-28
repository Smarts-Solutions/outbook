import React, { useContext, useRef, useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import sweatalert from 'sweetalert2';
import { ADD_PEPPER_WORKS, GET_CUSTOMER_DATA } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';

const Paper = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const fileInputRef = useRef(null);
    const location = useLocation();
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [customerDetails, setCustomerDetails] = useState({ loading: true, data: [] });
    const [fileState, setFileState] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleFileChange = (event) => {
        const files = event.currentTarget.files;
        var fileArray
        if (files && typeof files[Symbol.iterator] === 'function') {
            fileArray = Array.from(files);
            setNewFiles(fileArray);
        } else {
            console.log("File input is not iterable or not correctly set.");
        }

        const previewArray = fileArray.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
            });
        });


        Promise.all(previewArray).then(previewData => {
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
                        data: []
                    });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    useEffect(() => {
        GetCustomerData();
    }, []);

    const handleSubmit = async (values) => {
        const data = new FormData();

        data.append('customer_id', address);

        const data1 = { req: { customer_id: address, fileData: newFiles }, authToken: token };
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
                    });
                }
            })
            .catch((error) => {
                console.log("Error", error);
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
                                    <h4 className="card-title mb-0">Upload Customer Specific Paperwork</h4>
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

                                    <div className="container-fluid page-title-box">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div id="customerList">
                                                            <div className="row g-4 ">
                                                                <div className="d-flex justify-content-end">
                                                                    <div className="pagination-wrap hstack gap-2"></div>
                                                                </div>
                                                            </div>
                                                            <div className="table-responsive table-card mb-1">





                                                                {newFiles.length > 0 && (
                                                                    <table className="table align-middle table-nowrap" id="customerTable">
                                                                        <thead className="table-light table-head-blue">
                                                                            <tr>

                                                                                <th className="" data-sort="file_name">File Name</th>
                                                                                <th className="" data-sort="file_type">File Type</th>
                                                                                <th className="" data-sort="size">Size</th>
                                                                                <th className="" data-sort="action">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="list form-check-all">
                                                                            {newFiles.length > 0 && (
                                                                                Array.from(newFiles).map((file, index) => (

                                                                                    <tr key={`new-${index}`}>
                                                                                        <td className="file_name">  <img src={previews[index]} alt="preview" style={{ width: "50px", height: "50px" }} /> </td>
                                                                                        <td className="file_name">{file.name}</td>
                                                                                        <td className="file_type">{file.type}</td>
                                                                                        <td className="size">
                                                                                            {file.size < 1024 * 1024
                                                                                                ? `${(file.size / 1024).toFixed(2)} KB`
                                                                                                : `${(file.size / (1024 * 1024)).toFixed(2)} MB`}
                                                                                        </td>

                                                                                        <td className="action">
                                                                                            <div className="d-flex gap-2">
                                                                                                <div className="remove">
                                                                                                    <a
                                                                                                        onClick={() => {
                                                                                                            const updatedFiles = newFiles.filter((_, idx) => idx !== index);
                                                                                                            setNewFiles(updatedFiles);
                                                                                                            setFieldValue("files", [...fileState, ...updatedFiles]);
                                                                                                            setPreviews(previews.filter((_, idx) => idx !== index));
                                                                                                        }}
                                                                                                    >
                                                                                                        <i className="ti-trash" />
                                                                                                    </a>
                                                                                                </div>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))
                                                                            )}

                                                                        </tbody>
                                                                    </table>
                                                                )}





                                                                <table className="table align-middle table-nowrap" id="customerTable">
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
                                                                            <th className="" data-sort="file_name">File Name</th>
                                                                            <th className="" data-sort="file_type">File Type</th>
                                                                            <th className="" data-sort="size">Size</th>
                                                                            <th className="" data-sort="action">Action</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="list form-check-all">
                                                                        {fileState && fileState.length > 0 ? (
                                                                            Array.from(fileState).map((file, index) => (
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
                                                                                    <td className="file_name">{file.file_name}</td>
                                                                                    <td className="file_type">{file.file_type}</td>
                                                                                    <td className="size">
                                                                                        {file.file_size < 1024 * 1024
                                                                                            ? `${(file.file_size / 1024).toFixed(2)} KB`
                                                                                            : `${(file.file_size / (1024 * 1024)).toFixed(2)} MB`}
                                                                                    </td>

                                                                                    <td className="action">
                                                                                        <div className="d-flex gap-2">
                                                                                            <div className="remove">
                                                                                                <a >
                                                                                                    <i className="ti-trash" />
                                                                                                </a>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan="5" className="text-center">No files selected</td>
                                                                            </tr>
                                                                        )}

                                                                    </tbody>
                                                                </table>






                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-start gap-3 mt-4 justify-content-between">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary text-decoration-none previestab"
                                                        onClick={prev}
                                                    >
                                                        Previous
                                                    </button>
                                                    <Button className="btn btn-info text-white text-center blue-btn float-end" type="submit" onClick={(e) => handleSubmit(e)}>
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
                </Form>
            )}
        </Formik>
    );
};

export default Paper;
