import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Role, StatusType, Service } from '../../ReduxStore/Slice/Settings/settingSlice'
import Datatable from '../../Components/ExtraComponents/Datatable';
import CommonModal from '../../Components/ExtraComponents/Modal';


const Setting = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tabStatus = useRef(1);
    const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
    const [addRoleName, setAddRoleName] = useState("");
    const [statusTypeDataAll, setStatusTypeDataAll] = useState({ loading: true, data: [] });
    const [addStatusType, setAddStatusType] = useState("");
    const [serviceDataAll, setServiceDataAll] = useState({ loading: true, data: [] });
    const [addService, setAddService] = useState("");

    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);



    const roleData = async (req) => {
        console.log("req", req.action);

        await dispatch(Role({ req: req, authToken: token }))
            .unwrap()
            .then(async (response) => {
                console.log("response", response);

                if (req.action == "get") {
                    if (response.status) {
                        setRoleDataAll({ loading: false, data: response.data });
                    } else {
                        setRoleDataAll({ loading: false, data: [] });
                    }
                }



            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const statusTypeData = async (req) => {

        await dispatch(StatusType({ req: req, authToken: token }))
            .unwrap()
            .then(async (response) => {
                console.log("response", response);
                if (response.status) {
                    setStatusTypeDataAll({ loading: false, data: response.data });
                } else {
                    setStatusTypeDataAll({ loading: false, data: [] });
                }


            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const serviceData = async (req) => {

        await dispatch(Service({ req: req, authToken: token }))
            .unwrap()
            .then(async (response) => {
                console.log("response", response);
                if (response.status) {
                    setServiceDataAll({ loading: false, data: response.data });
                } else {
                    setServiceDataAll({ loading: false, data: [] });
                }


            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    useEffect(() => {
        ;
        fetchApiData(tabStatus.current);
    }, []);

    const handleTabChange = (newStatus) => {
        tabStatus.current = newStatus;
        fetchApiData(newStatus);
    };

    const fetchApiData = (status) => {
        const req = {
            "action": "get"
        }
        switch (status) {
            case 1:
                roleData(req);
                break;
            case 2:
                statusTypeData(req);
                break;
            case 3:
                serviceData(req);
                break;
            default:
                break;
        }

    }

    const columnRoles = [
        { name: 'Role Name', selector: row => row.role_name, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnStatusType = [
        { name: 'Status', selector: row => row.type, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div >
                    <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
                    <button className='edit-icon' onClick={() => handleDelete(row)}><i className="ti-plus" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnService = [
        { name: 'Service Name', selector: row => row.name, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div >
                    <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
                    <button className='edit-icon' onClick={() => handleDelete(row)}><i className="ti-plus" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    function OnchangeSelectvalue(e, tabStatus) {
        if (tabStatus === 1) {
            if (e.target.name === "role_name") {
                setAddRoleName(e.target.value);
            }
        }
        else if (tabStatus === 2) {
            if (e.target.name === "type") {
                setAddStatusType(e.target.value);
            }
        }
        else if (tabStatus === 3) {
            if (e.target.name === "name") {
                setAddService(e.target.value);
            }
        }
    }

    // function handleAdd(e, tabStatus) {
    //     if (tabStatus === 1) {
    //         if (addRoleName === "") {
    //             alert("Please enter Role Name");
    //             return;
    //         }
    //         const req = {
    //             "action": "add",
    //             "role_name": addRoleName
    //         }
    //         roleData(req);
    //     }
    //     else if (tabStatus === 2) {
    //         if (addStatusType === "") {
    //             alert("Please enter Status");
    //             return;
    //         }
    //         const req = {
    //             "action": "add",
    //             "type": addStatusType
    //         }
    //         statusTypeData(req);

    //     }
    //     else if (tabStatus === 3) {
    //         if (addService === "") {
    //             alert("Please enter Service Name");
    //             return;
    //         }
    //         const req = {
    //             "action": "add",
    //             "name": addService
    //         }
    //         serviceData(req);
    //     }
    // }

    // function handleEdit(row) {
    //     console.log('Editing row:', row);
    // }

    // function handleDelete(row) {
    //     console.log('Deleting row:', row);
    // }

    const handleAdd = (e,tabStatus) => {
        setModalData({});
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (data) => {
        setModalData(data);
        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const req = { action: isEdit ? 'edit' : 'add' };
        formData.forEach((value, key) => {
            req[key] = value;
        });

        switch (tabStatus.current) {
            case 1:
                roleData(req);
                break;
            case 2:
                statusTypeData(req);
                break;
            case 3:
                serviceData(req);
                break;
            default:
                break;
        }
        setIsModalOpen(false);
    };

    const handleDelete = (data) => {
        // Implement delete functionality here
    };



    return (
        <div>
            <div className='container-fluid'>
                <div className="row ">
                    <div className="col-sm-12">
                        <div className="page-title-box">
                            <div className="row align-items-start">
                                <div className="col-md-8">
                                    <>
                                        <ul className="nav nav-pills  rounded-tabs" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${tabStatus.current === 1 ? 'active' : ''}`}
                                                    id="this-week-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#this-week"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="this-week"
                                                    aria-selected={tabStatus.current === 1}
                                                    onClick={() => handleTabChange(1)}
                                                >
                                                    Staff Role
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${tabStatus.current === 2 ? 'active' : ''}`}
                                                    id="last-week-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#last-week"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="last-week"
                                                    aria-selected={tabStatus.current === 2}
                                                    onClick={() => handleTabChange(2)}
                                                >
                                                    Status Type
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className={`nav-link ${tabStatus.current === 3 ? 'active' : ''}`}
                                                    id="current-month-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#current-month"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="current-month"
                                                    aria-selected={tabStatus.current === 3}
                                                    onClick={() => handleTabChange(3)}
                                                >
                                                    Services
                                                </button>
                                            </li>

                                        </ul>

                                    </>

                                </div>

                                {/* <div className="col-md-4  col-auto ">
                                    <button type="button"

                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal" className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Add Customer</button>
                                </div> */}

                            </div>

                        </div>

                    </div>

                </div>
                <div className="tab-content" id="pills-tabContent">
                    {/* {/ Staff Role Start /} */}
                    <div
                        className="tab-pane fade show active"
                        id="this-week"
                        role="tabpanel"
                        aria-labelledby="this-week-tab"
                    >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Staff Role</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e)=>handleAdd(e,1)}> <i className="fa fa-plus" /> Add Staff Role</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columnRoles} data={roleDataAll.data} />
                            </div>
                        </div>
                    </div>
                    {/* {/ Staff Role end /} */}

                    {/* {/ Job Status start /} */}
                    <div
                        className="tab-pane fade"
                        id="last-week"
                        role="tabpanel"
                        aria-labelledby="last-week-tab"
                    >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Status Type</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e)=>handleAdd(e,2)}> <i className="fa fa-plus" /> Add Status</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columnStatusType} data={statusTypeDataAll.data} />
                            </div>
                        </div>
                    </div>
                    {/* {/ Job Status end /} */}

                    {/* {/ Services Start /} */}
                    <div
                        className="tab-pane fade"
                        id="current-month"
                        role="tabpanel"
                        aria-labelledby="current-month-tab"
                    >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Services</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e)=>handleAdd(e,3)}> <i className="fa fa-plus" /> Add Service</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columnService} data={serviceDataAll.data} />
                            </div>
                        </div>

                    </div>
                    {/* {/ Services end /} */}
                </div>


            </div>
            {/* {/ Add staff Modal start /} */}
            <>


                {/* {/ Modal1 /} */}
                {isModalOpen && (
                    <CommonModal
                        modalId="exampleModal3"
                        title={isEdit ? 'Edit Service' : 'Add Service'}
                        fields={[
                            { type: 'text', name: 'name', label: 'Service Name', placeholder: 'Service Name', value: modalData.name }
                        ]}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                    //   onChange={handleModalChange}
                    />
                )}
            </>
            {/* {/ Add staff Modal end /} */}

            {/* {/ status Modal start /} */}
            <>


                {/* {/ Modal1 /} */}
                <div
                    className="modal fade"
                    id="exampleModal2"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add Status
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body"><div className="data-table-extensions-filter">
                                <label htmlFor="filterDataTable" className="icon mb-2" >Status</label>
                                <input
                                    type="text"
                                    name="type"
                                    className="filter-text form-control"
                                    placeholder="Enter Status"
                                    onChange={(e) => OnchangeSelectvalue(e, 2)}
                                />
                            </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-info text-white" style={{ borderRadius: "4px" }} onClick={(e) => handleAdd(e, 2)}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            {/* {/ status Modal end /} */}
            {/* {/ status Modal end /} */}

            {/* {/ Services Modal start /} */}
            <>
                <div
                    className="modal fade"
                    id="exampleModal3"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add Service
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body"><div className="data-table-extensions-filter">
                                <label htmlFor="filterDataTable" className="icon mb-2" >Service Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="filter-text form-control"
                                    placeholder="Service Name"
                                    onChange={(e) => OnchangeSelectvalue(e, 3)}
                                />
                            </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-info text-white" style={{ borderRadius: "4px" }} onClick={(e) => handleAdd(e, 3)}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        </div>



    )
}

export default Setting