import React, { useContext } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Input } from "formik-antd";
import MultiStepFormContext from "./MultiStepFormContext";

const Service = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);

    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next(); // Move to the next step after form submission
            }}
        >
            {({ handleSubmit }) => (
                <div className="details__wrapper">
                    <div className="card pricing-box p-4 m-2 mt-0">
                        <h4 className="card-title mb-0" style={{ marginBottom: "20px !important" }}>
                            Select Services
                        </h4>
                        <div className="row">
                            <div className="table-responsive table-card mt-3 mb-1">
                                <table className="table align-middle table-nowrap" id="customerTable">
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
                                                Service Name
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
                                                        defaultChecked=""
                                                        className="form-check-input new_input"
                                                        type="checkbox"
                                                        defaultValue="option1"
                                                    />
                                                </div>
                                            </th>
                                            <td className="customer_name">YE Accounts/Stat Accounts</td>
                                            <td>
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">Corporation Tax Return</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">Management Accounts</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">Bookkeeping</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">VAT Return</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">Payroll</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            <td className="customer_name">Personal Tax Returns</td>
                                            <td className="customer_name">
                                                <div className="d-flex">
                                                    <div className="remove">
                                                        <a
                                                            className="btn btn-sm btn-success remove-item-btn"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#AddAccountManager"
                                                        >
                                                            <i className="ti-user" />
                                                        </a>
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
                                            We've searched more than 150+ Orders. We did not find any orders for your search.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form__item button__items d-flex justify-content-between">
                        <Button className="white-btn" type="default" onClick={prev}>
                            Back
                        </Button>
                        <Button  className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default Service;
