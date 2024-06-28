import React from 'react'
import Datatable from '../../Components/ExtraComponents/Datatable';

const data = [
    { TradingName: 'Processor', },
    { TradingName: 'Reviewer', },
    { TradingName: 'Super Admin', },
    { TradingName: 'Managment', },
    { TradingName: 'Leadership', },
    { TradingName: 'Account Manager	', },


];


const columns = [
    { name: 'Role Name', selector: row => row.TradingName, sortable: true },



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

const columns1 = [
    { name: 'Service Name', selector: row => row.TradingName, sortable: true },



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

const columns2 = [
    { name: 'Status', selector: row => row.TradingName, sortable: true },



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
function handleEdit(row) {
    console.log('Editing row:', row);
}

function handleDelete(row) {
    console.log('Deleting row:', row);
}
const Setting = () => {
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
                                                    className="nav-link active"
                                                    id="this-week-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#this-week"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="this-week"
                                                    aria-selected="true"
                                                >
                                                    Staff Role
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="last-week-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#last-week"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="last-week"
                                                    aria-selected="false"
                                                >
                                                    Job Status
                                                </button>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <button
                                                    className="nav-link"
                                                    id="current-month-tab"
                                                    data-bs-toggle="pill"
                                                    data-bs-target="#current-month"
                                                    type="button"
                                                    role="tab"
                                                    aria-controls="current-month"
                                                    aria-selected="false"
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
                                    <button type="button"

                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal" className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Add Staff Role</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columns} data={data} />
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
                                    <h3 className='mt-0'>Job Status</h3>
                                </div>
                                <div>
                                    <button type="button"

                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal2" className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Add Status</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columns2} data={data} />
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
                                    <button type="button"

                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal3" className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Add Service</button>
                                </div>
                            </div>
                            <div className='datatable-wrapper'>


                                <Datatable
                                    filter={true}
                                    columns={columns1} data={data} />
                            </div>
                        </div>

                    </div>
                    {/* {/ Services end /} */}
                </div>


            </div>
            {/* {/ Add staff Modal start /} */}
            <>


                {/* {/ Modal1 /} */}
                <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    Add Staff Role
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                />
                            </div>
                            <div className="modal-body"><div className="data-table-extensions-filter">
                                <label htmlFor="filterDataTable" className="icon mb-2" >Role Name</label>
                                <input
                                    type="text"
                                    name="filterDataTable"
                                    className="filter-text form-control"
                                    placeholder="Role Name"
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
                                <button type="button" className="btn btn-info text-white" style={{ borderRadius: "4px" }}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
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
                                    name="filterDataTable"
                                    className="filter-text form-control"
                                    placeholder="Enter Status"
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
                                <button type="button" className="btn btn-info text-white" style={{ borderRadius: "4px" }}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
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
                                    name="filterDataTable"
                                    className="filter-text form-control"
                                    placeholder="Service Name"
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
                                <button type="button" className="btn btn-info text-white" style={{ borderRadius: "4px" }}>
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