import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Role, StatusType, Service, PersonRole, ClientIndustry, Country } from '../../ReduxStore/Slice/Settings/settingSlice'
import Datatable from '../../Components/ExtraComponents/Datatable';
import Modal from '../../Components/ExtraComponents/Modals/Modal';
import sweatalert from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';


const Setting = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tabStatus = useRef('1');
    const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
    const [personRoleDataAll, setPersonRoleDataAll] = useState({ loading: true, data: [] });
    const [clientIndustryDataAll, setClientIndustryDataAll] = useState({ loading: true, data: [] });
    const [countryDataAll, setCountryDataAll] = useState({ loading: true, data: [] });
    const [addRoleName, setAddRoleName] = useState("");
    const [statusTypeDataAll, setStatusTypeDataAll] = useState({ loading: true, data: [] });
    const [addStatusType, setAddStatusType] = useState("");
    const [serviceDataAll, setServiceDataAll] = useState({ loading: true, data: [] });
    const [addService, setAddService] = useState("");
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [getShowTabId, setShowTabId] = useState("1");

    const [isEdit, setIsEdit] = useState(false);



    const roleData = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(Role(data))
            .unwrap()
            .then(async (response) => {

                if (req.action == "get") {
                    if (response.status) {
                        setRoleDataAll({ loading: false, data: response.data });
                    } else {
                        setRoleDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,
                        });
                        setTimeout(() => {
                            roleData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const statusTypeData = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(StatusType(data))
            .unwrap()
            .then(async (response) => {
                if (req.action == "get") {
                    if (response.status) {
                        setStatusTypeDataAll({ loading: false, data: response.data });
                    } else {
                        setStatusTypeDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,

                        });
                        setTimeout(() => {
                            statusTypeData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
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
                if (req.action == "get") {
                    if (response.status) {
                        setServiceDataAll({ loading: false, data: response.data });
                    } else {
                        setServiceDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,

                        });
                        setTimeout(() => {
                            serviceData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
                }


            })
            .catch((error) => {
                console.log("Error", error);
            });
    };
    const PersonRoleData = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(PersonRole(data))
            .unwrap()
            .then(async (response) => {
                if (req.action == "get") {
                    if (response.status) {
                        setPersonRoleDataAll({ loading: false, data: response.data });
                    } else {
                        setPersonRoleDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,
                        });
                        setTimeout(() => {
                            PersonRoleData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const ClientIndustryData = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(ClientIndustry(data))
            .unwrap()
            .then(async (response) => {
                if (req.action == "get") {
                    if (response.status) {
                        setClientIndustryDataAll({ loading: false, data: response.data });
                    } else {
                        setClientIndustryDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,
                        });
                        setTimeout(() => {
                            ClientIndustryData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const CountryData = async (req) => {
        const data = { req: req, authToken: token }
        await dispatch(Country(data))
            .unwrap()
            .then(async (response) => {
                if (req.action == "get") {
                    if (response.status) {
                        setCountryDataAll({ loading: false, data: response.data });
                    } else {
                        setCountryDataAll({ loading: false, data: [] });
                    }
                } else {
                    if (response.status) {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'success',
                            timer: 2000,
                        });
                        setTimeout(() => {
                            CountryData({ action: "get" });
                        }, 2000);
                    } else {
                        sweatalert.fire({
                            title: response.message,
                            icon: 'error',
                            timer: 2000,
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }



    useEffect(() => {
        fetchApiData(tabStatus.current);
    }, [tabStatus.current]);

    const handleTabChange = (newStatus) => {
        setShowTabId(newStatus);
        tabStatus.current = newStatus;
        fetchApiData(newStatus);
    };

    const fetchApiData = (status) => {
        const req = {
            "action": "get"
        }
        switch (status) {
            case '1':
                roleData(req);
                break;
            case '2':
                PersonRoleData(req);
                break;
            case '3':
                statusTypeData(req);
                break;
            case '4':
                serviceData(req);
                break;
            case '5':
                ClientIndustryData(req);
                break;
            case '6':
                CountryData(req);
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
                    <button className='edit-icon' onClick={() => handleEdit(row, '1')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '1')}> <i className="ti-trash" /></button>
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
                    <button className='edit-icon' onClick={() => handleEdit(row, '3')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '3')}> <i className="ti-trash" /></button>

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
                <div>
                    <button className='edit-icon' onClick={() => handleEdit(row, '4')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '4')}> <i className="ti-trash" /></button>
                    <button className='btn btn-primary' >Add Job Type</button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnPersonRole = [
        { name: 'Service Name', selector: row => row.name, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div >
                    <button className='edit-icon' onClick={() => handleEdit(row, '2')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '2')}> <i className="ti-trash" /></button>

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnClientIndustry = [
        { name: 'Client Industry', selector: row => row.business_type, sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div >
                    <button className='edit-icon' onClick={() => handleEdit(row, '5')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '5')}> <i className="ti-trash" /></button>

                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const columnCountry = [
        { name: 'Country Code', selector: row => '+' + row.code, sortable: true },
        { name: 'Country Name', selector: row => row.name, sortable: true },
        { name: 'Currency', selector: row => row.currency, sortable: true },
        { name: 'Currency Status', selector: row => row.status == 1 ? "Yes" : "No", sortable: true },
        {
            name: 'Actions',
            cell: row => (
                <div >
                    <button className='edit-icon' onClick={() => handleEdit(row, '6')}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row, '6')}> <i className="ti-trash" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];


    const handleModalChange = (e) => {
        // setModalData({ ...modalData, value: e.target.value });



        const { name, value } = e.target;
        setModalData(prevModalData => ({
            ...prevModalData,
            fields: prevModalData.fields.map(field =>
                field.name === name ? { ...field, value: value } : field
            )
        }));
    };

    const handleAdd = (e, tabStatus) => {
        if (tabStatus === '1') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "role_name", label: "Role Name", placeholder: "Role Name" }
                ],
                title: "Staff Role",
                tabStatus: tabStatus,
            });
        }
        else if (tabStatus === '2') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "name", label: "Role Name", placeholder: "Enter Contact Person Role" }
                ],
                title: " Contact Person Role",
                tabStatus: tabStatus,
            });
        }
        else if (tabStatus === '3') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "type", label: "Status Type", placeholder: "Enter Status Type" }
                ],
                title: "Status Type",
                tabStatus: tabStatus,
            });
        }
        else if (tabStatus === '4') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "name", label: "Service Name", placeholder: "Service Name" }
                ],
                title: "Service",
                tabStatus: tabStatus,
            });
        }

        else if (tabStatus === '5') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "business_type", label: "Business Type", placeholder: "Enter Business Type" }
                ],
                title: " Business Type",
                tabStatus: tabStatus,
            });
        }
        else if (tabStatus === '6') {
            setModalData({
                ...modalData,
                fields: [
                    { type: "text", name: "name", label: "Country Name", placeholder: "Enter Country Name" },
                    { type: "text", name: "code", label: "Country Code", placeholder: "Enter Country Code" },
                    { type: "text", name: "currency", label: "Currency", placeholder: "Enter Currency" },
                    { type: "select", name: "status", label: "Currency Status", placeholder: "Enter Currency Status", options: [{ label: "Active", value: "1" }, { label: "Deactive", value: "0" }] }
                ],
                title: " Country",
                tabStatus: tabStatus,
            });
        }
        // setModalData({});
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (data, tabStatus) => {

        if (tabStatus === '1') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "role_name",
                        label: "Role Name",
                        placeholder: "Role Name",
                        value: data.role_name
                    },
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Select Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: "Staff Role",
                tabStatus: tabStatus,
                id: data.id
            });

        }
        else if (tabStatus === '2') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "name",
                        label: "Role Name",
                        placeholder: "Service Name",
                        value: data.name
                    },
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Select Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: " Contact Person Role",
                tabStatus: tabStatus,
                id: data.id
            });
        }
        else if (tabStatus === '3') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "type",
                        label: "Status Name",
                        placeholder: "Status Type",
                        value: data.type
                    },
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Select Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: "Status Type",
                tabStatus: tabStatus,
                id: data.id
            });
        }
        else if (tabStatus === '4') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "name",
                        label: "Service Name",
                        placeholder: "Service Name",
                        value: data.name
                    },
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Select Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: "Service",
                tabStatus: tabStatus,
                id: data.id
            });
        }
        else if (tabStatus === '5') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "business_type",
                        label: "Business Type",
                        placeholder: "Enter Business Type",
                        value: data.business_type
                    },
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Enter Business Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: " Business Type",
                tabStatus: tabStatus,
                id: data.id
            });
        }
        else if (tabStatus === '6') {
            setModalData({
                ...modalData,
                fields: [
                    {
                        type: "text",
                        name: "name",
                        label: "Country",
                        placeholder: "Enter Country",
                        value: data.name
                    },
                    {
                        type: "text",
                        name: "name",
                        label: "Country Code",
                        placeholder: "Enter Country Code",
                        value: data.code
                    },
                    
                    {
                        type: "select",
                        name: "status",
                        label: "Status",
                        placeholder: "Select Status",
                        value: data.status === "1" ? "1" : "0",
                        options: [
                            { label: "Active", value: "1" },
                            { label: "Deactive", value: "0" }
                        ]
                    }
                ],
                title: "Service",
                tabStatus: tabStatus,
                id: data.id
            });
        }

        //setModalData(data);
        setIsEdit(true);
        setIsModalOpen(true);
    };



    const handleSave = (e) => {
        e.preventDefault();
        if (modalData.fields[0].value == "" || modalData.fields[0].value == undefined) {

            sweatalert.fire({
                title: "Please enter " + modalData.fields[0].label,
                icon: 'warning',
                timer: 2000,
            });
            // alert("Please enter " + modalData.fields[0].label);
            return;
        }
        const req = { action: isEdit ? 'update' : 'add' };
        if (isEdit) {
            req.id = modalData.id;
        }
        modalData.fields.map((field) => {
            req[field.name] = field.value;
            if (field.name == "status") {
                req.status = field.value;
            }
        });

        switch (modalData.tabStatus) {
            case '1':
                roleData(req);
                break;
            case '2':
                PersonRoleData(req);
                break;
            case '3':
                statusTypeData(req);
                break;
            case '4':
                serviceData(req);
                break;
            case '5':
                ClientIndustryData(req);
                break;
            case '6':
                CountryData(req);
                break;
            default:
                break;
        }
        setModalData({});
        setIsModalOpen(false);


    };

    const handleDelete = (data, tabStatus) => {

        const itemName = tabStatus == '1' ? data.role_name : tabStatus == '2' ? data.type : data.name;
        // Confirm deletion with the user

        sweatalert.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const req = {
                    action: 'delete',
                    id: data.id
                };
                switch (tabStatus) {
                    case '1':
                        roleData(req);
                        break;
                    case '2':
                        PersonRoleData(req);
                        break;
                    case '3':
                        statusTypeData(req);
                        break;
                    case '4':
                        serviceData(req);
                        break;
                    case '5':
                        ClientIndustryData(req);
                        break;
                    case '6':
                        CountryData(req);
                        break;
                    default:
                        console.log("Invalid tabStatus");
                        break;
                }
                sweatalert.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    };

    const tabsArr = [
        { id: "1", label: "Staff Role" },
        { id: "2", label: "Customer Contact Person Role" },
        { id: "3", label: "Status Type" },
        { id: "4", label: "Services" },
        { id: "5", label: "Client Industry" },
        { id: "6", label: "Country" }
    ]

    return (
        <div>
            <div className='container-fluid'>
                <div className="row ">
                    <div className="col-sm-12">
                        <div className="page-title-box">
                            <div className="row align-items-start">
                                <div className="col-md-12">
                                    <>
                                        <ul className="nav nav-pills  rounded-tabs" id="pills-tab" role="tablist">
                                            {tabsArr.map((tab, index) => (
                                                <li className="nav-item" role="presentation" key={index}>
                                                    <button
                                                        className={`nav-link ${tabStatus.current === tab.id ? 'active' : ''}`}
                                                        id={tab.id}
                                                        data-bs-toggle="pill"
                                                        type="button"
                                                        aria-controls={tab.id}
                                                        aria-selected={tabStatus.current === tab.id}
                                                        onClick={() => handleTabChange(tab.id)}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                </li>
                                            ))}
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

                    <div className={`tab-pane fade ${getShowTabId === '1' ? 'show active' : ''}`}>
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Staff Role</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '1')}> <i className="fa fa-plus" /> Add Staff Role</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>
                                <Datatable
                                    filter={true}
                                    columns={columnRoles}
                                    data={roleDataAll.data} />
                            </div>
                        </div>
                    </div>
                    {/* {/ Staff Role end /} */}

                    {/* {/ Customer Contact Person Role Start /} */}
                    <div className={`tab-pane fade ${getShowTabId === '2' ? 'show active' : ''}`}  >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Customer Contact Person Role</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '2')}> <i className="fa fa-plus" /> Customer Contact Person Role</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>
                                <Datatable
                                    filter={true}
                                    columns={columnPersonRole}
                                    data={personRoleDataAll.data} />
                            </div>
                        </div>
                    </div>

                    {/* {/ Customer Contact Person Role end /} */}



                    {/* {/ Job Status start /} */}
                    <div className={`tab-pane fade ${getShowTabId === '3' ? 'show active' : ''}`}>
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Status Type</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '3')}> <i className="fa fa-plus" /> Add Status</button>
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
                    <div className={`tab-pane fade ${getShowTabId === '4' ? 'show active' : ''}`} >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Services</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '4')}> <i className="fa fa-plus" /> Add Service</button>
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


                    {/* {/ Client Industry Start /} */}
                    <div className={`tab-pane fade ${getShowTabId === '5' ? 'show active' : ''}`} >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Client Industry</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '5')}> <i className="fa fa-plus" /> Add Client Industry</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>
                                <Datatable
                                    filter={true}
                                    columns={columnClientIndustry} data={clientIndustryDataAll.data} />
                            </div>
                        </div>
                    </div>
                    {/* {/ Client Industry end /} */}


                    {/* {/ Country Start /} */}
                    <div className={`tab-pane fade ${getShowTabId === '6' ? 'show active' : ''}`} >
                        <div className='report-data'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <div className='tab-title'>
                                    <h3 className='mt-0'>Country</h3>
                                </div>
                                <div>
                                    <button type="button" className='btn btn-info text-white float-end' onClick={(e) => handleAdd(e, '6')}> <i className="fa fa-plus" /> Add Country</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columnCountry} data={countryDataAll.data} />
                            </div>
                        </div>
                    </div>

                    {/* {/ Country end /} */}
                </div>


            </div>
            {/* {/ Add staff Modal start /} */}
            <>


                {/* {/ Modal1 /} */}
                {isModalOpen && (
                    <Modal
                        modalId="exampleModal3"
                        title={isEdit ? 'Edit ' + modalData.title : 'Add ' + modalData.title}
                        // fields={[
                        //     { type: modalData.type, name: modalData.name, label: modalData.label, placeholder: modalData.placeholder, value: modalData.value }
                        // ]}
                        fields={modalData.fields}
                        onClose={() => {
                            setIsModalOpen(false);
                            setModalData({});
                        }}
                        onSave={handleSave}
                        onChange={handleModalChange}
                        buttonName={isEdit ? 'Update' : 'Save'}
                    />
                )}
            </>
        </div>



    )
}

export default Setting