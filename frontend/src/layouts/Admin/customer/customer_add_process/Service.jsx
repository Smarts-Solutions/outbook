import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Get_Service } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from "react-redux";
import CommanModal from '../../../../Components/ExtraComponents/Modals/CommanModal';
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';

const Service = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const [GetAllService, setAllService] = useState({
        loading: true,
        data: []
    });
    const [getModal, setModal] = useState(false);
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });

    const GetAllServiceData = async () => {
        const req = {
            action: "get"
        };
        const data = { req: req, authToken: token };
        await dispatch(Get_Service(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setAllService({ loading: false, data: response.data });
                } else {
                    setAllService({ loading: false, data: [] });
                }
            })
            .catch((error) => {
                console.log("Error", error);
                setAllService({ loading: false, data: [] });
            });
    }

    const fetchStaffData = async () => {
        try {
            const response = await dispatch(Staff({ req: { action: "getmanager" }, authToken: token })).unwrap();
            if (response.status) {
                setStaffDataAll({ loading: false, data: response.data });
            } else {
                setStaffDataAll({ loading: false, data: [] });
            }
        } catch (error) {
            console.error("Error fetching staff data", error);
            setStaffDataAll({ loading: false, data: [] });
        }
    };

    useEffect(() => {
        GetAllServiceData();
        fetchStaffData();
    }, []);

    return (
        <Formik
            initialValues={address}
            onSubmit={(values) => {
                setAddress(values);
                next();
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
                                            <th>Service Name</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="list form-check-all">
                                        {GetAllService.data.length > 0 ? (
                                            GetAllService.data.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input new_input"
                                                                type="checkbox"
                                                                defaultValue={`option${index + 1}`}
                                                            />
                                                        </div>
                                                    </th>
                                                    <td className="customer_name">{item.name}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <div className="remove">
                                                                <button
                                                                    className="btn btn-sm btn-success remove-item-btn"
                                                                    onClick={() => setModal(true)}
                                                                >
                                                                    <i className="ti-user" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center">No services available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <CommanModal
                        isOpen={getModal}
                        backdrop="static"
                        size="ms-5"
                        title="Add Account Manager"
                        hideBtn={true}
                        handleClose={() => setModal(false)}
                    >
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-10">
                                    <div className="search-box ms-2">
                                        <i className="ri-search-line search-icon" />
                                        <input
                                            type="text"
                                            className="form-control search"
                                            placeholder="Search Customer..."
                                        />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-success add-btn"
                                            data-bs-toggle="modal"
                                            id="create-btn"
                                            data-bs-target="#showModal123"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6" />
                                <div className="table-responsive  mt-3 mb-1">
                                    <table className="table align-middle table-nowrap" id="customerTable">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Account Name</th>
                                                <th className="tabel_left text-align-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list form-check-all">
                                            {staffDataAll.data.length > 0 ? (
                                                staffDataAll.data.map((data, index) => (
                                                    <tr className="tabel_new" key={index}>
                                                        <td>{data.first_name}</td>
                                                      
                                                        <td className="tabel_left">
                                                            <div className="gap-6">
                                                                <div className="remove">
                                                                    <a
                                                                        onClick={() => console.log('Remove item clicked')} // Add your handler here
                                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                                    >
                                                                        Remove
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="text-center">No staff available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </CommanModal>

                    <div className="form__item button__items d-flex justify-content-between">
                        <Button className="white-btn" type="default" onClick={prev}>
                            Back
                        </Button>
                        <Button className="btn btn-info text-white blue-btn" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default Service;
