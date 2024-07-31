import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { Get_Service } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from "react-redux";
import CommanModal from '../../../../Components/ExtraComponents/Modals/CommanModal';
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';
import { ADD_SERVICES_CUSTOMERS } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';


const Service = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const [GetAllService, setAllService] = useState({ loading: true, data: [] });
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const [getModal, setModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [getManager, setManager] = useState([]);
    const [services, setServices] = useState([]);
    const [tempServices, setTempServices] = useState("");



    const GetAllServiceData = async () => {
        const req = { action: "get" };
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

    const ServicesUpdate = (value, type) => {
        if (type === 2) {
            setServices(prevServices => {
                if (!prevServices.includes(value)) {
                    return [...prevServices, value];
                }
                return prevServices;
            });
        } else if (type === 1) {
            if (value.length === 0) {
                setServices([]);
            } else {
                setServices(GetAllService.data.map(item => item.id));
            }
        }
    }

    const handleCheckboxChange = (e, item, type) => {
        if (e) {
            ServicesUpdate(item.id, type);
        } else {
            setServices(prevServices => prevServices.filter(service => service !== item.id));
        }
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            ServicesUpdate(GetAllService.data, 1);
        } else {
            ServicesUpdate([], 1);
        }
    };

    useEffect(() => {
        GetAllServiceData();
        fetchStaffData();
    }, []);

    useEffect(() => {
        if (searchValue.trim() !== "") {
            setFilteredData(
                staffDataAll.data.filter(data =>
                    data.first_name.toLowerCase().includes(searchValue.toLowerCase())
                )
            );
        } else {
            setFilteredData([]);
        }
    }, [searchValue, staffDataAll]);

    const AddManager = () => {
        const trimmedValue = searchValue.trim();
        if (trimmedValue === "") {
            return;
        }

        const matchingData = staffDataAll.data.find(data => data.first_name === trimmedValue);


        if (matchingData) {
            setManager(prevManager => {
                const existingServiceIndex = prevManager.findIndex(manager => manager.service_id === tempServices);

                if (existingServiceIndex > -1) {
                    const updatedManagers = [...prevManager];
                    const existingService = updatedManagers[existingServiceIndex];

                    if (!existingService.account_manager_id.some(manager => manager.id === matchingData.id)) {
                        existingService.account_manager_id.push(matchingData);
                    }

                    updatedManagers[existingServiceIndex] = existingService;
                    return updatedManagers;
                } else {
                    return [...prevManager, { service_id: tempServices, account_manager_id: [matchingData] }];
                }
            });
        }
        setSearchValue("");
    };

    const removeManager = (id, serviceId) => {
        setManager(prevManager =>
            prevManager.map(manager => {
                if (manager.service_id === serviceId) {
                    return {
                        ...manager,
                        account_manager_id: manager.account_manager_id.filter(accountManager => accountManager.id !== id)
                    };
                }
                return manager;
            }).filter(manager => manager.account_manager_id.length > 0)
        );
    };

    const AddServiceId = (id) => {
        setTempServices(id);
    }

    const handleSubmit = async (values) => {
        if (getManager.length === 0) {
            alert("Please add at least one account manager.");
            return;
        }


        const MatchData = getManager
            .filter(item => services.includes(item.service_id))
            .map(item => ({
                service_id: item.service_id,
                account_manager_id: item.account_manager_id.map(manager => manager.id),
            }));

        var req = {
            "customer_id": address,
            "pageStatus": "2",
            services: MatchData
        }


        const data = { req: req, authToken: token }
        await dispatch(ADD_SERVICES_CUSTOMERS(data))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    next(response.data)
                } else {

                }
            })
            .catch((error) => {
                console.log("Error", error);
            });


    };




    return (
        <Formik
            initialValues={address}
            onSubmit={handleSubmit}
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
                                                        onChange={handleSelectAllChange}
                                                        checked={services.length === GetAllService.data.length && GetAllService.data.length > 0}
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
                                                                onChange={(e) => handleCheckboxChange(e.target.checked, item, 2)}
                                                                checked={services.includes(item.id)}
                                                            />
                                                        </div>
                                                    </th>
                                                    <td className="customer_name">{item.name}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <div className="remove">
                                                                <button
                                                                    className="btn btn-sm btn-success remove-item-btn"
                                                                    onClick={() => { setModal(true); AddServiceId(item.id) }}
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
                                            placeholder="Search Manager..."
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                        />
                                    </div>
                                    {filteredData.length > 0 && (
                                        <div className="search-results">
                                            {filteredData.map((data, index) => (
                                                <div
                                                    key={index}
                                                    className="search-result-item"
                                                    onClick={() => setSearchValue(data.first_name)}
                                                >
                                                    {data.first_name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="col-2">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-success add-btn"
                                            id="create-btn"
                                            onClick={AddManager}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6" />
                                <div className="table-responsive mt-3 mb-1">
                                    <table className="table align-middle table-nowrap" id="customerTable">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Account Name</th>
                                                <th className="tabel_left text-align-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="list form-check-all">
                                            {getManager.length > 0 ? (
                                                getManager
                                                    .filter(manager => manager.service_id === tempServices)
                                                    .map((manager, managerIndex) =>
                                                        manager.account_manager_id.map((accountManager, accountManagerIndex) => (
                                                            <tr className="tabel_new" key={`${managerIndex}-${accountManagerIndex}`}>
                                                                <td>{accountManager.first_name}</td>
                                                                <td className="tabel_left">
                                                                    <div className="gap-6">
                                                                        <div className="remove">
                                                                            <a
                                                                                onClick={() => removeManager(accountManager.id, manager.service_id)}
                                                                                className="btn btn-sm btn-danger remove-item-btn"
                                                                            >
                                                                                Remove
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )
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
                        <Button className="btn btn-info text-white blue-btn" type="submit" onClick={handleSubmit}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </Formik>
    );
};

export default Service;
