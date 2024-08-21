import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import { Get_Service, GET_CUSTOMER_DATA, Edit_Customer, ADD_SERVICES_CUSTOMERS } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import MultiStepFormContext from "./MultiStepFormContext";
import CommanModal from '../../../../Components/ExtraComponents/Modals/CommanModal';
import { Staff } from '../../../../ReduxStore/Slice/Staff/staffSlice';
import { useLocation } from "react-router-dom";

const Service = () => {
    const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
    const token = JSON.parse(localStorage.getItem("token"));
    const location = useLocation();
    const dispatch = useDispatch();
    const [GetAllService, setAllService] = useState({ loading: true, data: [] });
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const [getModal, setModal] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [getManager, setManager] = useState([]);
    const [services, setServices] = useState([]);
    const [tempServices, setTempServices] = useState("");
    const [getCustomerService, setCustomerService] = useState({ loading: true, data: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(GET_CUSTOMER_DATA({ req: { customer_id: location.state.id, pageStatus: "2" }, authToken: token })).unwrap()
                        .then(response => setCustomerService({ loading: false, data: response.data })),
                    dispatch(Get_Service({ req: { action: "get" }, authToken: token })).unwrap()
                        .then(response => setAllService({ loading: false, data: response.data })),
                    dispatch(Staff({ req: { action: "getmanager" }, authToken: token })).unwrap()
                        .then(response => setStaffDataAll({ loading: false, data: response.data }))
                ]);
            } catch (error) {
                console.error("Error fetching data", error);
                setAllService({ loading: false, data: [] });
                setStaffDataAll({ loading: false, data: [] });
            }
        };

        fetchData();
    }, [dispatch, location.state.id, token]);

    useEffect(() => {
        if (getCustomerService.data.services) {
            setServices(getCustomerService.data.services.map(service => service.service_id));

            setManager(getCustomerService.data.services.map(service => ({
                service_id: service.service_id,
                account_manager_ids: service.account_manager_ids
                    ? service.account_manager_ids.map(id => staffDataAll.data.find(staff => staff.id === id))
                    : []
            })));
        }
    }, [getCustomerService.data, staffDataAll.data]);

    useEffect(() => {
        if (searchValue.trim()) {
            setFilteredData(staffDataAll.data.filter(data =>
                data.first_name.toLowerCase().includes(searchValue.toLowerCase())
            ));
        } else {
            setFilteredData([]);
        }
    }, [searchValue, staffDataAll.data]);

    const ServicesUpdate = (value, type) => {
        if (type === 2) {
            setServices(prevServices => !prevServices.includes(value) ? [...prevServices, value] : prevServices);
        } else if (type === 1) {
            setServices(value.length === 0 ? [] : GetAllService.data.map(item => item.id));
        }
    };

    const handleCheckboxChange = (e, item) => {
        if (e.target.checked) {
            setServices(prevServices => !prevServices.includes(item.id)
                ? [...prevServices, item.id]
                : prevServices
            );
        } else {
            setServices(prevServices => prevServices.filter(service => service !== item.id));
        }
    };

    const handleSelectAllChange = (e) => {
        if (e.target.checked) {
            setServices(GetAllService.data.map(item => item.id));
        } else {
            setServices([]);
        }
    };

    const AddManager = () => {
        const trimmedValue = searchValue.trim();
        if (!trimmedValue) return;

        const matchingData = staffDataAll.data.find(data => data.first_name === trimmedValue);

        if (matchingData) {
            setManager(prevManager => {
                const existingServiceIndex = prevManager.findIndex(manager => manager.service_id === tempServices);

                if (existingServiceIndex > -1) {
                    const updatedManagers = [...prevManager];
                    const existingService = updatedManagers[existingServiceIndex];

                    if (!existingService.account_manager_ids.some(manager => manager.id === matchingData.id)) {
                        existingService.account_manager_ids.push(matchingData);
                    }

                    updatedManagers[existingServiceIndex] = existingService;
                    return updatedManagers;
                } else {
                    return [...prevManager, { service_id: tempServices, account_manager_ids: [matchingData] }];
                }
            });
        }

        setSearchValue("");
    };

    const removeManager = (id, serviceId) => {
        setManager(prevManager => prevManager
            .map(manager => manager.service_id === serviceId ? {
                ...manager,
                account_manager_ids: manager.account_manager_ids.filter(accountManager => accountManager.id !== id)
            } : manager)
            .filter(manager => manager.account_manager_ids.length > 0)
        );
    };

    const handleSubmit = async (values) => {
        if (services.length === 0) {
            alert("Please add at least one Service.");
            return;
        }

        // Prepare the MatchData array
        const MatchData = GetAllService.data.map(service => {
            const managerData = getManager.find(item => item.service_id === service.id);

            return {
                service_id: service.id,
                account_manager_ids: managerData
                    ? managerData.account_manager_ids.map(manager => manager.id)
                    : []
            };
        });

        // Filter out services that are not selected
        const filteredMatchData = MatchData.filter(item => services.includes(item.service_id));

        const req = {
            customer_id: address,
            pageStatus: "2",
            services: filteredMatchData
        };


        try {
            const response = await dispatch(Edit_Customer({ req, authToken: token })).unwrap();
            if (response.status) {
                
                next(response.data);
            }
        } catch (error) {
            console.error("Error updating services", error);
        }
    };

    return (
        <Formik
            initialValues={address}
            onSubmit={handleSubmit}
        >
            {({ handleSubmit }) => (
                <div className="details__wrapper">
                    <div className="card pricing-box p-4 m-2 mt-0">
                        <h4 className="card-title mb-0">Select Services</h4>
                        <div className="row">
                            <div className="table-responsive table-card mt-3 mb-1">
                                <table className="table align-middle table-nowrap">
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
                                    <tbody>
                                        {GetAllService.data.length > 0 ? (
                                            GetAllService.data.map((item, index) => (
                                                <tr key={index}>
                                                    <th scope="row">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input new_input"
                                                                type="checkbox"
                                                                onChange={(e) => handleCheckboxChange(e, item)}
                                                                checked={services.includes(item.id)}
                                                            />
                                                        </div>
                                                    </th>
                                                    <td className="customer_name">{item.name}</td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <button
                                                                className="btn btn-sm btn-success remove-item-btn"
                                                                onClick={() => { setModal(true); setTempServices(item.id); }}
                                                            >
                                                                <i className="ti-user" />
                                                            </button>
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
                                    <button
                                        type="button"
                                        className="btn btn-success add-btn"
                                        onClick={AddManager}
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="table-responsive mt-3 mb-1">
                                    <table className="table align-middle table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Account Name</th>
                                                <th className="text-align-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getManager.length > 0 ? (
                                                getManager
                                                    .filter(manager => manager.service_id === tempServices)
                                                    .flatMap((manager, managerIndex) =>
                                                        manager.account_manager_ids.map((accountManager, accountManagerIndex) => (
                                                            <tr key={`${managerIndex}-${accountManagerIndex}`}>
                                                                <td>{accountManager.first_name}</td>
                                                                <td className="text-align-right">
                                                                    <button
                                                                        onClick={() => removeManager(accountManager.id, manager.service_id)}
                                                                        className="btn btn-sm  remove-item-btn"
                                                                    >
                                                                        <i className="ti-trash text-danger fs-5"></i>
                                                                    </button>
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
