import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";


const Timesheet = () => {

  const [addtask, setAddtask] = useState(false);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="content-title">
          <div className="row">
            <div className="col-md-8">
              <div className="tab-title">
                <h3 className="mt-0">Timesheet</h3>
              </div>
            </div>

          </div>
        </div>




        <div className='report-data mt-4'>
          <ul
            className="nav nav-pills mb-3 rounded-tabs"
            id="pills-tab"
            role="tablist"
          >
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
                This week
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
                Last week
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="this-month-tab"
                data-bs-toggle="pill"
                data-bs-target="#this-month"
                type="button"
                role="tab"
                aria-controls="this-month"
                aria-selected="false"
              >
                This Month
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="last-month-tab"
                data-bs-toggle="pill"
                data-bs-target="#last-month"
                type="button"
                role="tab"
                aria-controls="last-month"
                aria-selected="false"
              >
                Last month
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="last-quarter-tab"
                data-bs-toggle="pill"
                data-bs-target="#last-quarter"
                type="button"
                role="tab"
                aria-controls="last-quarter"
                aria-selected="false"
              >
                Last quarter
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="this-6-months-tab"
                data-bs-toggle="pill"
                data-bs-target="#this-6-months"
                type="button"
                role="tab"
                aria-controls="this-6-months"
                aria-selected="false"
              >
                This 6 months
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="last-6-months-tab"
                data-bs-toggle="pill"
                data-bs-target="#last-6-months"
                type="button"
                role="tab"
                aria-controls="last-6-months"
                aria-selected="false"
              >
                Last 6 months
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="this-year-tab"
                data-bs-toggle="pill"
                data-bs-target="#this-year"
                type="button"
                role="tab"
                aria-controls="this-year"
                aria-selected="false"
              >
                This year
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="last-year-tab"
                data-bs-toggle="pill"
                data-bs-target="#last-year"
                type="button"
                role="tab"
                aria-controls="last-year"
                aria-selected="false"
              >
                Last year
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="custom-tab"
                data-bs-toggle="pill"
                data-bs-target="#custom"
                type="button"
                role="tab"
                aria-controls="custom"
                aria-selected="false"
              >
                Custom
              </button>
            </li>
          </ul>
          <div className="tab-content mt-5" id="pills-tabContent">


            <div
              className="tab-pane fade show active"
              id="this-week"
              role="tabpanel"
              aria-labelledby="this-week-tab"
            >
              <div className="row">
                <div className="col-lg-12">



                  <div className="card-body">
                    <div id="customerList">
                      <div className="row">
                        {/* <div id="btncls" className="btncls">
                    <button id="prevButton">
                      <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                    </button>
                    <button id="nextButton">
                      <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    </button>
                  </div> */}



                        <div className="table-responsive table-card  mb-1">
                          <table className="timesheetTable table align-middle table-nowrap" id="customerTable">
                            <thead className="table-light table-head-blue">
                              <tr>
                                <th className="dropdwnCol2" data-field="phone">No</th>
                                <th className="" data-field="phone" width="8%">Task Type</th>
                                <th className="dropdwnCol7" data-field="phone">Customer</th>
                                <th className="dropdwnCol6" data-field="phone">Client</th>
                                <th className="dropdwnCol5" data-field="phone">Job</th>
                                <th className="dropdwnCol5" data-field="phone">Task</th>
                                <th className="dropdwnCol5" data-field="customer_name">Mon 12/02/2024</th>
                                <th className="dropdwnCol5" data-field="customer_name">Tue 13/02/2024</th>
                                <th className="dropdwnCol5" data-field="phone">Wed 14/02/2024</th>
                                <th className="dropdwnCol5" data-field="phone">Thu 15/02/2024</th>
                                <th className="dropdwnCol5" data-field="phone">Fri 16/02/2024</th>
                                <th className="dropdwnCol5" data-field="phone">Sat 17/02/2024</th>
                                <th className="dropdwnCol5" data-field="phone">Sun 18/02/2024</th>
                              </tr>
                            </thead>

                            <tbody className="list form-check-all">
                              <tr className="tabel_new">
                                <td>1</td>
                                <td>
                                  <select className="form-select">
                                    <option>Internal</option>
                                    <option selected>External</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Customer 1</option>
                                    <option value={1}>THE BLACK T COMPANY LTD</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Client 1</option>
                                    <option value={1}>MT LIMITED</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Job 1</option>
                                    <option value={1}>VAT</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Task 1</option>
                                    <option value={1}>Task 2</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={2}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={5}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={7}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={9}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={3}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={2}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    disabled
                                    readOnly
                                    defaultValue={5}
                                  />
                                </td>
                              </tr>
                              <tr className="tabel_new">
                                <td>2</td>
                                <td>
                                  <select className="form-select">
                                    <option>Internal</option>
                                    <option selected>External</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Customer 1</option>
                                    <option value={1}>THE BLACK T COMPANY LTD</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Client 1</option>
                                    <option value={1}>MT LIMITED</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Job 1</option>
                                    <option value={1}>VAT</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-select">
                                    <option selected>Task 1</option>
                                    <option value={1}>Task 2</option>
                                  </select>
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                                <td>
                                  <input
                                    className="form-control cursor-pointer"
                                    readOnly
                                    defaultValue=""
                                    onClick={() => setAddtask(true)}
                                  />
                                </td>
                              </tr>
                              <tr className="tabel_new">
                                {/* <td className="id" style={{ display: 'none' }}><a href="javascript:void(0);" className="fw-medium link-primary">#VZ2101</a></td> */}
                                <td>
                                  <button className="d-flex btn btn-info fw-normal px-2" >
                                    <i
                                      style={{
                                        display: "block",
                                        fontSize: 18,
                                        cursor: "pointer",
                                      }}
                                      className="ri-add-circle-fill"
                                    />
                                  </button>
                                </td>
                                <td colSpan={12}></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="last-week"
              role="tabpanel"
              aria-labelledby="last-week-tab"
            >
              <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className="text-dark mb-1 font-weight-semibold">
                            NO OF CUSTOMERS
                          </p>
                          <h3 className="mt-5">183</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className=" mb-1">NO OF JOBS</p>
                          <h3 className="mt-5">45</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className="text-dark mb-1 font-weight-semibold">
                            NO OF CLIENTS
                          </p>
                          <h3 className="mt-5">543</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className="text-dark mb-1 font-weight-semibold">
                            NO OF STAFF
                          </p>
                          <h3 className="mt-5">78</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className="text-dark mb-1 font-weight-semibold">
                            PENDING JOBS
                          </p>
                          <h3 className="mt-5">233</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="card report-card dashboard-card">
                    <div className="card-body">
                      <div className="row d-flex justify-content-center">
                        <div className="col">
                          <p className="text-dark mb-1 font-weight-semibold">
                            COMPLETED JOBS
                          </p>
                          <h3 className="mt-5">870</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="this-month"
              role="tabpanel"
              aria-labelledby="this-month-tab"
            >
              This month's content...
            </div>
            <div
              className="tab-pane fade"
              id="last-month"
              role="tabpanel"
              aria-labelledby="last-month-tab"
            >
              Last month's content...
            </div>
            <div
              className="tab-pane fade"
              id="last-quarter"
              role="tabpanel"
              aria-labelledby="last-quarter-tab"
            >
              Last quarter's content...
            </div>
            <div
              className="tab-pane fade"
              id="this-6-months"
              role="tabpanel"
              aria-labelledby="this-6-months-tab"
            >
              This 6 months' content...
            </div>
            <div
              className="tab-pane fade"
              id="last-6-months"
              role="tabpanel"
              aria-labelledby="last-6-months-tab"
            >
              Last 6 months' content...
            </div>
            <div
              className="tab-pane fade"
              id="this-year"
              role="tabpanel"
              aria-labelledby="this-year-tab"
            >
              This year's content...
            </div>
            <div
              className="tab-pane fade"
              id="last-year"
              role="tabpanel"
              aria-labelledby="last-year-tab"
            >
              Last year's content...
            </div>
            <div
              className="tab-pane fade"
              id="custom"
              role="tabpanel"
              aria-labelledby="custom-tab"
            >
              Custom content...
            </div>
          </div>
          <CommonModal
            isOpen={addtask}
            backdrop="static"
            size="lg"
            cancel_btn={false}
            btn_2="true"
            btn_name="Save"
            title="Task"
            hideBtn={false}

            handleClose={() => {
              setAddtask(false);

            }}

          >
            <div className="modal-body">
              <div className="row">

                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Task Type
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Internal"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Date
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Monday, 12th 2024"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Customer
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Customer 1"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Client
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Client 1"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Job
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Job 1"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="form-group">
                    <label htmlFor="customername-field" className="form-label">
                      Task
                    </label>
                    <input
                      className="form-control cursor-pointer"
                      disabled=""
                      readOnly=""
                      defaultValue="Task 1"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-3" id="modal-id" style={{ display: "none" }}>
                <label htmlFor="id-field" className="form-label">
                  ID
                </label>
                <input
                  type="text"
                  id="id-field"
                  className="form-control"
                  placeholder="ID"
                  readOnly=""
                />
              </div>
              <div className="mb-3">
                <label htmlFor="customername-field" className="form-label">
                  Hours
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Hours"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <span className="input-group-text" id="basic-addon2">
                    Hours
                  </span>
                </div>
              </div>
              <div className="col-lg-12">
                <label htmlFor="customername-field" className="form-label">
                  Remark
                </label>
                <input
                  className="form-control cursor-pointer"
                  placeholder="Remark"
                  defaultValue=""
                />
              </div>
            </div>



          </CommonModal>
        </div>
      </div>
    </div>


  );
};

export default Timesheet;
