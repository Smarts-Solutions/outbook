import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Staff } from '../../ReduxStore/Slice/Staff/staffSlice';
import Datatable from '../../Components/ExtraComponents/Datatable';
import CommonModal from '../../Components/ExtraComponents/Modals/Modal';
import SetAccessModal from '../../Components/ExtraComponents/Modals/AccessModal';

import sweatalert from 'sweetalert2';


const StaffPage = () => {

    const token = JSON.parse(localStorage.getItem("token"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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

    useEffect(() => {
        staffData()
    }, []);

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
        {
            name: 'Status',
            cell: row => (<div><span className={`badge ${row.status === '1' ? 'bg-success' : 'bg-danger'}`}>{row.status === '1' ? 'Active' : 'Deactive'}</span></div>),
            width: '100px',
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <button className='edit-icon' onClick={() => openModal()}> <i className="ti-user" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-briefcase" /></button>
                    <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
                    <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
                    <button className='edit-icon' ><i className="ti-plus" /></button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: '200px',
        },
    ];

   
    const [activeTab, setActiveTab] = useState('this-week');

    function handleEdit(row) {
        console.log('Editing row:', row);
    }

    function handleDelete(row) {
        console.log('Deleting row:', row);
    }

    return (
        <div>
            <div className='container-fluid'>
                <div className='report-data mt-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='tab-title'>
                            <h3 className='mt-0'>Manage Staff</h3>
                        </div>
                        <div>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn-info text-white float-end'>
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




            {isModalOpen &&(
            <SetAccessModal isOpen={isModalOpen} onClose={closeModal} />
            )}
        </div>
    );
}

export default StaffPage;
