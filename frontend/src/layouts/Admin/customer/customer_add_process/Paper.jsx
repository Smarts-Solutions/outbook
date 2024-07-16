import React, { useContext } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";
const Paper = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next(); // Move to the next step after form submission
            }}
        >
            {({ handleSubmit }) => {
                return (

                    <div className={"details__wrapper"}>
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
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        id="btn1"
                                                        className="btn btn-outline-primary"
                                                        style={{
                                                            border: "1px solid #0E6E91",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}
                                                    >
                                                        <i className="ri-upload-cloud-fill" />
                                                        <span style={{ color: "#0E6E91" }}>Choose File</span>
                                                    </button>
                                                    {/* <i class="display-4 text-muted ri-upload-cloud-2-fill"></i> */}
                                                </div>
                                                <h6>
                                                    <p>Or Drag File in here</p>
                                                </h6>
                                            </div>
                                        </div>
                                        <ul className="list-unstyled mb-0" id="dropzone-preview"></ul>
                                        {/* end dropzon-preview */}
                                        <div className="container-fluid page-title-box">
                                            <div className="row">
                                                <div className="col-lg-12">
                                                    <div className="card">
                                                        {/* end card header */}
                                                        <div className="card-body">
                                                            <div id="customerList">
                                                                <div className="row g-4 mb-3">
                                                                    {/* <div class="col-sm">
                                                                                          <div class="d-flex justify-content-sm-end">
                                                                                              <button type="button" class="btn btn-success add-btn" data-bs-toggle="modal" id="create-btn" data-bs-target="#showModal"><i class="ri-add-line align-bottom me-1"></i> Add</button>
                                                                                              <button class="btn btn-soft-danger" onClick="deleteMultiple()"><i class="ri-delete-bin-2-line"></i></button>
                                                                                          </div>
                                                                                      </div> */}
                                                                    <div className="d-flex justify-content-end">
                                                                        <div className="pagination-wrap hstack gap-2">
                                                                            <button
                                                                                className="btn btn-soft-danger"
                                                                                onclick="deleteMultiple()"
                                                                            >
                                                                                <i className="ri-delete-bin-2-line" />
                                                                                Delete Select
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-success add-btn"
                                                                                data-bs-toggle="modal"
                                                                                id="create-btn"
                                                                                data-bs-target="#showModal"
                                                                            >
                                                                                <i className="ri-upload-cloud-fill" />
                                                                                Upload
                                                                            </button>
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
                                                                                <th className="" data-sort="customer_name">
                                                                                    File Name
                                                                                </th>
                                                                                <th className="" data-sort="customer_name">
                                                                                    File Type
                                                                                </th>
                                                                                <th className="" data-sort="customer_name">
                                                                                    Size
                                                                                </th>
                                                                                <th className="" data-sort="action">
                                                                                    Action
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="list form-check-all">
                                                                            <tr>
                                                                                <th scope="row">
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            className="form-check-input new_input"
                                                                                            type="checkbox"
                                                                                            name="chk_child"
                                                                                            defaultValue="option1"
                                                                                        />
                                                                                    </div>
                                                                                </th>
                                                                                <td className="customer_name">document1.docs</td>
                                                                                <td className="customer_name">DOCS</td>
                                                                                <td className="customer_name">1.2 MB</td>
                                                                                <td className="customer_name">
                                                                                    <div className="d-flex ">
                                                                                        <div className="d-flex gap-2">
                                                                                            <div className="edit">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#showModal12"
                                                                                                >
                                                                                                    <i className="ti-download" />
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="remove">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-danger remove-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#deleteRecordModal"
                                                                                                >
                                                                                                    <i className="ti-trash" />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th scope="row">
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            className="form-check-input new_input"
                                                                                            type="checkbox"
                                                                                            name="chk_child"
                                                                                            defaultValue="option1"
                                                                                        />
                                                                                    </div>
                                                                                </th>
                                                                                <td className="customer_name">Examplefile.png</td>
                                                                                <td className="customer_name">PNG</td>
                                                                                <td className="customer_name">3.2 MB</td>
                                                                                <td className="customer_name">
                                                                                    <div className="d-flex ">
                                                                                        <div className="d-flex gap-2">
                                                                                            <div className="edit">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#showModal12"
                                                                                                >
                                                                                                    <i className="ti-download" />
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="remove">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-danger remove-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#deleteRecordModal"
                                                                                                >
                                                                                                    <i className="ti-trash" />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <th scope="row">
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            className="form-check-input new_input"
                                                                                            type="checkbox"
                                                                                            name="chk_child"
                                                                                            defaultValue="option1"
                                                                                        />
                                                                                    </div>
                                                                                </th>
                                                                                <td className="customer_name">
                                                                                    Share_Certificate.pdf
                                                                                </td>
                                                                                <td className="customer_name">PDF</td>
                                                                                <td className="customer_name">5 MB</td>
                                                                                <td className="customer_name">
                                                                                    <div className="d-flex ">
                                                                                        <div className="d-flex gap-2">
                                                                                            <div className="edit">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-success edit-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#showModal12"
                                                                                                >
                                                                                                    <i className="ti-download" />
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="remove">
                                                                                                <button
                                                                                                    className="btn btn-sm btn-danger remove-item-btn"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#deleteRecordModal"
                                                                                                >
                                                                                                    <i className="ti-trash" />
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <div className="noresult" style={{ display: "none" }}>
                                                                        <div className="text-center">
                                                                            <lord-icon
                                                                                src="https://cdn.lordicon.com/msoeawqm.json"
                                                                                trigger="loop"
                                                                                colors="primary:#121331,secondary:#08a88a"
                                                                                style={{ width: 75, height: 75 }}
                                                                            />
                                                                            <h5 className="mt-2">Sorry! No Result Found</h5>
                                                                            <p className="text-muted mb-0">
                                                                                We've searched more than 150+ Orders We did not find
                                                                                any orders for you search.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="d-flex align-items-start gap-3 mt-4">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success text-decoration-none  previestab"
                                                                        data-previous="pills-gen-info-tab"
                                                                    >
                                                                        Previous
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-light "
                                                                        data-bs-dismiss="modal"
                                                                        style={{ marginLeft: "auto" }}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    {/* <button type="button" class="btn btn-success nexttab nexttab right "
                                                                                          data-nexttab="pills-success-tab" id="add-btn">Submit</button> */}
                                                                    <a
                                                                        href="Customer.html"
                                                                        className="btn btn-success nexttab nexttab right"
                                                                        style={{ backgroundColor: "#0E6E91", color: "#fff" }}
                                                                    >
                                                                        Save
                                                                    </a>
                                                                    {/* <button type="button"
                                                                                          class="btn btn-success btn-label right ms-auto nexttab nexttab"
                                                                                          data-nexttab="pills-success-tab">Next</button> */}
                                                                </div>
                                                                {/* <div class="d-flex justify-content-end">
                                                                                      <div class="pagination-wrap hstack gap-2">
                                                                                          <a class="page-item pagination-prev disabled" href="#">
                                                                                              Previous
                                                                                          </a>
                                                                                          <ul class="pagination listjs-pagination mb-0"></ul>
                                                                                          <a class="page-item pagination-next" style="background-color: #0E6E91;color: #fff;" href="#">
                                                                                              Submit
                                                                                          </a>
                                                                                      </div>
                                                                                  </div> */}
                                                            </div>
                                                        </div>
                                                        {/* end card */}
                                                    </div>
                                                    {/* end col */}
                                                </div>
                                                {/* end col */}
                                            </div>
                                        </div>
                                    </div>
                                    {/* end card body */}
                                </div>
                                {/* end card */}
                            </div>{" "}
                            {/* end col */}
                        </div>






                        <div className="form__item button__items d-flex justify-content-between">
                            <Button className="white-btn" type="default" onClick={prev}>
                                Back
                            </Button>
                            <Button className="btn btn-info text-white text-center blue-btn" onClick={handleSubmit}>
                                Next
                            </Button>
                        </div>



                    </div>

                );
            }}
        </Formik>
    );
};
export default Paper;

