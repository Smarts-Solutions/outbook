import React from 'react'
import Datatable from '../../Components/ExtraComponents/Datatable';

const Access = () => {
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



        // {
        //     name: 'Actions',
        //     cell: row => (
        //         <div>
        //             <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
        //             <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },
    ];
    return (

        <div>
            <div className='container-fluid'>
                <div className='report-data mt-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='tab-title'>
                            <h3 className='mt-0'>Access</h3>
                        </div>
                        <div>
                            <button type="button"

                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal" className='btn btn-info text-white float-end'> <i className="fa fa-plus" /> Set Default
                                Access</button>
                        </div>
                    </div>
                    <div className='datatable-wrapper'>


                        <Datatable
                            filter={true}
                            columns={columns} data={data} />
                    </div>
                </div>
                {/* <!-- Button trigger modal --> */}


                {/* <!-- Modal --> */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Set Default Access</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div className="accordion" id="default-accordion-example">
                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingOne">
                                            <button
                                                className="accordion-button"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseOne"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                            >
                                                Processor
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseOne"
                                            className="accordion-collapse collapse show"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                            style={{}}
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                        defaultChecked=""
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            {/* <div class="mb-3">
                                                                              <div
                                                                                  class="form-check form-check-outline form-check-dark">
                                                                                  <input class="form-check-input"
                                                                                      type="checkbox"
                                                                                      id="formCheck1" checked="">
                                                                                  <label
                                                                                      class="form-check-label new_checkbox"
                                                                                      for="formCheck1">
                                                                                      Can Update Business Setup

                                                                                  </label>
                                                                              </div>
                                                                          </div> */}
                                                        </div>

                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">

                                                            <div className="mb-3"></div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Insert
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Update
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <div className="form-check form-check-outline form-check-dark">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="formCheck1"
                                                                    />
                                                                    <label
                                                                        className="form-check-label new_checkbox"
                                                                        htmlFor="formCheck1"
                                                                    >
                                                                        Can view
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseTwo"
                                                aria-expanded="false"
                                                aria-controls="collapseTwo"
                                            >
                                                Reviewer
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseTwo"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                            style={{}}
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3"></div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingThree">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                Super Admin
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseThree"
                                            className="accordion-collapse collapse "
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                              <div
                                                                                  class="form-check form-check-outline form-check-dark">
                                                                                  <input class="form-check-input"
                                                                                      type="checkbox"
                                                                                      id="formCheck1" checked="">
                                                                                  <label
                                                                                      class="form-check-label new_checkbox"
                                                                                      for="formCheck1">
                                                                                      Can Update Business Setup

                                                                                  </label>
                                                                              </div>
                                                                          </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>{" "}
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                              <div
                                                                                  class="form-check form-check-outline form-check-dark">
                                                                                  <input class="form-check-input"
                                                                                      type="checkbox"
                                                                                      id="formCheck1" checked="">
                                                                                  <label
                                                                                      class="form-check-label new_checkbox"
                                                                                      for="formCheck1">
                                                                                      Can Update Business Setup

                                                                                  </label>
                                                                              </div>
                                                                          </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                              <div
                                                                                  class="form-check form-check-outline form-check-dark">
                                                                                  <input class="form-check-input"
                                                                                      type="checkbox"
                                                                                      id="formCheck1" checked="">
                                                                                  <label
                                                                                      class="form-check-label new_checkbox"
                                                                                      for="formCheck1">
                                                                                      Can Update Business Setup

                                                                                  </label>
                                                                              </div>
                                                                          </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3"></div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingFive">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseFive"
                                                aria-expanded="false"
                                                aria-controls="collapseFive"
                                            >
                                                Managment
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseThree1"
                                            className="accordion-collapse collapse"
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                            style={{}}
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3"></div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingFour">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree1"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                Leadership
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFour1"
                                            className="accordion-collapse collapse "
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3"></div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="accordion-item mt-2">
                                        <h2 className="accordion-header" id="headingFive">
                                            <button
                                                className="accordion-button collapsed"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#collapseThree1"
                                                aria-expanded="false"
                                                aria-controls="collapseThree"
                                            >
                                                Account Manager
                                            </button>
                                        </h2>
                                        <div
                                            id="collapseFive1"
                                            className="accordion-collapse collapse "
                                            aria-labelledby="headingOne"
                                            data-bs-parent="#default-accordion-example"
                                        >
                                            <div className="accordion-body">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Customer
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Status
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Staff
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Client
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Job
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    {/* <div class="mb-3">
                                                                          <div
                                                                              class="form-check form-check-outline form-check-dark">
                                                                              <input class="form-check-input"
                                                                                  type="checkbox"
                                                                                  id="formCheck1" checked="">
                                                                              <label
                                                                                  class="form-check-label new_checkbox"
                                                                                  for="formCheck1">
                                                                                  Can Update Business Setup

                                                                              </label>
                                                                          </div>
                                                                      </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h4
                                                            className="card-title mb-3 flex-grow-1"
                                                            style={{ marginBottom: "20px !important" }}
                                                        >
                                                            Setting
                                                        </h4>
                                                        <div className="row">
                                                            <div className="col-md-7">
                                                                <div className="row">
                                                                    <div className="mb-3"></div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Insert
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Update
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can Delete
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <div className="form-check form-check-outline form-check-dark">
                                                                            <input
                                                                                className="form-check-input"
                                                                                type="checkbox"
                                                                                id="formCheck1"
                                                                                defaultChecked=""
                                                                            />
                                                                            <label
                                                                                className="form-check-label new_checkbox"
                                                                                htmlFor="formCheck1"
                                                                            >
                                                                                Can view
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Access
