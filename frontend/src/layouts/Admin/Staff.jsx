import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Staff, Service } from '../../ReduxStore/Slice/Staff/staffSlice';
import { Role } from '../../ReduxStore/Slice/Settings/settingSlice';

import Datatable from '../../Components/ExtraComponents/Datatable';
import CommanModal from '../../Components/ExtraComponents/Modals/CommanModal';
import SetAccessModal from '../../Components/ExtraComponents/Modals/AccessModal';
import sweatalert from 'sweetalert2';
import Formicform from '../../Components/ExtraComponents/Forms/Formicform';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Validation_Message from '../../Utils/Validation_Message';


const StaffPage = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const [isModalOpen, setIsModalOpen] = useState(false);
    const [addStaff, setAddStaff] = useState(false);
    const [portfolio, setPortfolio] = useState(false);
    const [editStaff, setEditStaff] = useState(false);
    const [editStaffData, setEditStaffData] = useState(false);
    const [addCompetancy, SetCompetancy] = useState(false);
    const [refresh, SetRefresh] = useState(false);

    const [activeTab, setActiveTab] = useState('this-week');
    const [modalData, setModalData] = useState({ fields: [] });
    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const [serviceDataAll, setServiceDataAll] = useState({ loading: true, data: [] });
    const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });

    // const closeModal = () => setIsModalOpen(false);

    const staffData = async () => {
        await dispatch(Staff({ req: { "action": "get" }, authToken: token }))
            .unwrap()
            .then(async (response) => {
                if (response.status) {
                    setStaffDataAll({ loading: false, data: response.data });
                } else {
                    setStaffDataAll({ loading: false, data: [] });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const ServiceData = async () => {
        await dispatch(Service({ req: { "action": "get" }, authToken: token }))
            .unwrap()
            .then(async (response) => {
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

    const roleData = async (req) => {
        await dispatch(Role({ req: { "action": "staffRole" }, authToken: token }))
            .unwrap()
            .then(async (response) => {

                if (response.status) {
                    setRoleDataAll({ loading: false, data: response.data });
                } else {
                    setRoleDataAll({ loading: false, data: [] });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };


    const tabs = [
        { id: 'this-week', label: 'This week' },
        { id: 'last-week', label: 'Last week' },
        { id: 'last-month', label: 'Last month' },
        { id: 'last-quarter', label: 'Last quarter' },
        { id: 'this-6-months', label: 'This 6 months' },
        { id: 'last-6-months', label: 'Last 6 months' },
        { id: 'this-year', label: 'This year' },
        { id: 'last-year', label: 'Last year' },
        { id: 'custom', label: 'Custom' },
    ];

    const columns = [
        { name: 'First Name', selector: row => row.first_name, sortable: true, width: '150px' },
        { name: 'Last Name', selector: row => row.last_name, sortable: true, width: '150px' },
        { name: 'Email Address', selector: row => row.email, sortable: true, width: '200px' },
        { name: 'Phone', selector: row => row.phone, sortable: true, width: '150px' },
        { name: 'Role', selector: row => row.role, sortable: true, width: '150px' },
        { name: 'Status', cell: row => (<div><span className={`badge ${row.status === '1' ? 'bg-success' : 'bg-danger'}`}>{row.status === '1' ? 'Active' : 'Deactive'}</span></div>), width: '80px', },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    {/* <button className='edit-icon' onClick={() => setIsModalOpen(true)}> <i className="ti-user" /></button> */}
                    <button className='delete-icon' onClick={() => setPortfolio(true)}> <i className="ti-briefcase" /></button>
                    <button className='edit-icon' onClick={(e) => { setEditStaff(true); setEditStaffData(row); }}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={(e) => SetCompetancy(true)}>Add Competency</button>
                    <button className='delete-icon'>Log Logs</button>
                    <button className='delete-icon' onClick={(e) => DeleteStaff(row)}> <i className="ti-trash" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '400px',
        },
    ];

    const formik = useFormik({
        initialValues: {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
            status: ""
        },
        validationSchema: Yup.object({
            first_name: Yup.string().required(Validation_Message.FirstNameValidation),
            last_name: Yup.string().required(Validation_Message.LastNameValidation),
            email: Yup.string().email(Validation_Message.EmailValidation).required(Validation_Message.EmailIsRequire),
            phone: Yup.string().matches(/^[0-9]+$/, Validation_Message.PhoneValidation).required(Validation_Message.PhoneIsRequire),
            password: editStaff ? Yup.string().min(8, Validation_Message.PasswordValidation) : Yup.string().min(8, Validation_Message.PasswordValidation).required(Validation_Message.PasswordIsRequire),
            role: Yup.string().required(Validation_Message.RoleValidation),
            status: Yup.string().required(Validation_Message.StatusValidation)
        }),

        onSubmit: async (values) => {
            let req = {
                "first_name": values.first_name,
                "last_name": values.last_name,
                "email": values.email,
                "phone": values.phone,
                "password": values.password,
                "role_id": values.role,
                "status": values.status
            }
            console.log("add", req)
            if (editStaff) {
                req.id = editStaffData && editStaffData.id
            }


            // return
            await dispatch(Staff({ req: { "action": editStaff ? "update" : "add", ...req }, authToken: token }))
                .unwrap()
                .then(async (response) => {
                    if (response.status) {
                        sweatalert.fire({
                            icon: 'success',
                            title: 'Success',
                            text: response.message,
                            timer: 2000,
                        })
                        setAddStaff(false);
                        setEditStaff(false);
                        SetRefresh(!refresh);
                        formik.resetForm();
                    } else {
                        sweatalert.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.message,
                        })
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        }
    });

    const fields = [

        { type: "text", name: "first_name", label: "First Name", label_size: 12, col_size: 6, disable: false, placeholder: "Enter First Name" },
        { type: "text", name: "last_name", label: "Last Name", label_size: 12, col_size: 6, disable: false, placeholder: "Enter Last Name" },
        { type: "email", name: "email", label: "Email", label_size: 12, col_size: 6, disable: false, placeholder: "Enter Email" },
        { type: "text", name: "phone", label: "Phone", label_size: 12, col_size: 6, disable: false, placeholder: "Enter Phone Number" },
        { type: "password", name: "password", label: "Password", label_size: 12, col_size: 6, disable: false, placeholder: "Enter Password", showWhen: values => !editStaff },
        {
            type: "select", name: "role", label: "Role", label_size: 12, col_size: 3, disable: false,
            options: roleDataAll && roleDataAll.data.map((data) => {

                if (formik.values.role_id == data.id) {
                    return { label: data.role_name, value: data.id, selected: true };
                } else {
                    return { label: data.role_name, value: data.id };
                }
            }),
        },
        {
            type: "select", name: "status", label: "Status", label_size: 12, col_size: 3, disable: false,
            options: [
                { label: "Active", value: "1" },
                { label: "Deactive", value: "0" }
            ]
        }
    ];


    const DeleteStaff = async (row) => {
        sweatalert.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await dispatch(Staff({ req: { "action": "delete", "id": row.id }, authToken: token }))
                    .unwrap()
                    .then(async (response) => {
                        if (response.status) {
                            sweatalert.fire({
                                icon: 'success',
                                title: 'Success',
                                text: response.message,
                                timer: 2000,
                            })
                            SetRefresh(!refresh);
                        } else {
                            sweatalert.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: response.message,
                            })
                        }
                    })
                    .catch((error) => {
                        console.log("Error", error);
                    });
            }
        })
    }



    useEffect(() => {
        staffData()
        ServiceData()
        roleData()
    }, [refresh]);


    useEffect(() => {

        if (editStaffData && editStaffData) {
            formik.setFieldValue('first_name', editStaffData.first_name || 'null');
            formik.setFieldValue('last_name', editStaffData.last_name || 'null');
            formik.setFieldValue('email', editStaffData.email || 'null');
            formik.setFieldValue('phone', editStaffData.phone || 'null');
            formik.setFieldValue('role', editStaffData.role_id || 'null');
            formik.setFieldValue('status', editStaffData.status || 'null');

        }

    }, [editStaffData]);

    return (
        <div>
            <div className='container-fluid'>
                <div className='report-data mt-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='tab-title'>
                            <h3 className='mt-0'>Manage Staff</h3>
                        </div>
                        <div>
                            <button type="button" className='btn btn-info text-white float-end' onClick={() => setAddStaff(true)}>
                                <i className="fa fa-plus" /> Add Staff
                            </button>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="page-title-box">
                            <div className="row align-items-start">
                                <div className="col-md-8">
                                    <>
                                        <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
                                            {tabs.map((tab) => (
                                                <li className="nav-item" role="presentation" key={tab.id}>
                                                    <button
                                                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                                                        id={`${tab.id}-tab`}
                                                        data-bs-toggle="pill"
                                                        data-bs-target={`#${tab.id}`}
                                                        type="button"
                                                        role="tab"
                                                        aria-controls={tab.id}
                                                        aria-selected={activeTab === tab.id}
                                                        onClick={() => setActiveTab(tab.id)}
                                                    >
                                                        {tab.label}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content" id="pills-tabContent">
                        <Datatable columns={columns} data={staffDataAll.data} filter={true} />
                    </div>
                </div>
            </div>




            {/* Add Staff */}
            <CommanModal
                isOpen={addStaff}
                backdrop="static"
                size="ms-5"
                title="Add Staff"
                hideBtn={true}
                handleClose={() => { setAddStaff(false); formik.resetForm(); }}
            >
                <Formicform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Add"
                />
            </CommanModal>
            {/* CLOSE Add Staff */}


            {/* Manage Portfolio */}
            <CommanModal
                isOpen={portfolio}
                cancel_btn="cancel"
                hideBtn={false}
                btn_name="Save"
                title="Manage Portfolio"

                handleClose={() => setPortfolio(false)}
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
                                        <th className="" data-="customer_name">
                                            Company Name
                                        </th>
                                        {/* <th class="" data-="customer_name">Access</th> */}
                                        <th className="tabel_left" data-="action">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="list form-check-all">
                                    <tr className="tabel_new">
                                        {/* <td class="id" style="display:none;"><a href="javascript:void(0);" class="fw-medium link-primary">#VZ2101</a></td> */}
                                        <td>Outbooks Outsourcing Pvt Ltd</td>
                                        {/* <td>VAT Return</td> */}
                                        <td className="tabel_left">
                                            <div className=" gap-2">
                                                <div className="remove">
                                                    <a
                                                        onclick="deleteRecordModalshow()"
                                                        className="btn btn-sm btn-danger remove-item-btn"
                                                    >
                                                        Remove
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
                                        We've searched more than 150+ Orders We did not find any orders for
                                        you search.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </CommanModal>
            {/* CLOSE Manage Portfolio */}


            {/* Edit Staff */}
            <CommanModal
                isOpen={editStaff}
                backdrop="static"
                size="ms-5"
                title="Edit Staff"
                hideBtn={true}
                handleClose={() => { setEditStaff(false); formik.resetForm(); }}
            >
                <Formicform fieldtype={fields.filter(field => !field.showWhen || field.showWhen(formik.values))} formik={formik} btn_name="Update"
                />
            </CommanModal>
            {/* CLOSE Edit Staff */}

            {/* Add Competancy */}
            <CommanModal
                isOpen={addCompetancy}
                backdrop="static"
                size="ms-5"
                title="Add Competancy"
                hideBtn={true}
                handleClose={() => SetCompetancy(false)}
            >
                <Formicform fieldtype={serviceDataAll && serviceDataAll.data.map((data) => {
                    return { type: "checkbox", name: data.id, label: data.name, label_size: 12, col_size: 6, disable: false }
                })} formik={formik} btn_name="Update"
                />
            </CommanModal>
            {/* CLOSE Add Competancy */}



            {/* SET ACCESS */}
            {/* {isModalOpen && (
                <SetAccessModal isOpen={isModalOpen} onClose={closeModal} />
            )} */}
            {/* CLOSE SET ACCESS */}


        </div>
    );
};

export default StaffPage;
