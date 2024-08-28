import React, { useState } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";

const TaskTimesheet = () => {
  const data = [
    {
      TradingName: "W120",
      Code: "012_BlaK_T_1772",
      CustomerName: "The Black T",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Admin/Support Tasks",
      JobType: "Year End",
    },
    {
      TradingName: "W121",
      Code: "025_NesTea_1663",
      CustomerName: "Nestea",
      AccountManager: "Ajeet Aggarwal",
      ServiceType: "Onboarding/Setup",
      JobType: "Year End",
    },
    // More data...
  ];

  const columns = [
    {
      name: "Trading Name",
      selector: (row) => row.TradingName,
      sortable: true,
    },
    { name: "Customer Code", selector: (row) => row.Code, sortable: true },
    {
      name: "Customer Name",
      selector: (row) => row.CustomerName,
      sortable: true,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => setViewtimesheet(true)}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  // Correctly defined state
  const [addjobtimesheet, setAddjobtimesheet] = useState(false);
  const [addtask, setAddtask] = useState(false);
  const [viewtimesheet, setViewtimesheet] = useState(false);

  return (
    <>
      <div className="">
        <div className="row">
          <div className="col-md-8">
            <div className="tab-title">
              <h3>Task Timesheet</h3>
            </div>
          </div>
          <div className="col-md-4">
            <div>
              <button
                type="button"
                onClick={() => setAddjobtimesheet(true)}
                className="btn btn-info text-white float-end ms-2"
              >
                <i className="fa fa-plus pe-1"></i> Job Timesheet
              </button>
              <button
                type="button"
                onClick={() => setAddtask(true)}
                className="btn btn-info text-white float-end"
              >
                <i className="fa-regular fa-plus pe-1"></i> Add
              </button>
            </div>
          </div>
        </div>

        <div className="datatable-wrapper">
          <Datatable filter={true} columns={columns} data={data} />
        </div>
      </div>
      <CommonModal
        isOpen={addjobtimesheet}
        backdrop="static"
        size="ms-5"
        title="Add Timesheet"
        hideBtn={true}
        handleClose={() => {
          setAddjobtimesheet(false);
          // formik.resetForm();
        }}
      >
        <div className="row">
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Budgeted Hours</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hours"
                  defaultValue=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minutes"
                  defaultValue=""
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Tolal Hours</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hours"
                  defaultValue=""
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Minutes"
                  defaultValue=""
                />
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
              </select>
            </div>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={addtask}
        backdrop="static"
        size="lg"
        title="Add Task"
        hideBtn={true}
        handleClose={() => {
          setAddtask(false);
          // formik.resetForm();
        }}
      >
        <div className="row">
          <div className="col-lg-8">
            <div className="mb-3">
              <select className="form-select">
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
              </select>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="mb-3">
              <button className="btn btn-secondary">
                <i className="fa fa-plus pe-1"></i>Add Task
              </button>
            </div>
          </div>

          <div className="col-lg-6 ">
            <div id="customerList" className="card">
              <div className="table-responsive table-card">
                <table
                  className="table align-middle table-nowrap mb-0"
                  id="customerTable"
                >
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th className="" data-="status">
                        Task Name
                      </th>
                      <th className="" data-="status">
                        Budgeted Hour
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    <tr className="">
                      <td>Task 1 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td>Task 2 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td>Task 3 </td>
                      <td>10 hr</td>
                      <td>
                        <div className="add">
                          <button
                            className="btn btn-sm  add-item-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addRecordModal"
                          >
                            <i className="fa fa-plus text-success" />
                            {/* Change the icon class to your desired plus icon */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-6 ">
            <div id="customerList" className="card">
              <div className="table-responsive table-card ">
                <table
                  className="table align-middle table-nowrap mb-0"
                  id="customerTable"
                >
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th className="" data-="status">
                        Task Name
                      </th>
                      <th className="" data-="status">
                        Budgeted Hour
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    <tr className="">
                      <td>Task 1 </td>
                      <td>10 hr </td>
                      <td>
                        <div className="remove">
                          <button
                            className="btn "
                            data-bs-toggle="modal"
                            data-bs-target="#deleteRecordModal"
                          >
                            <i className="ti-trash text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>

      <CommonModal
        isOpen={viewtimesheet}
        backdrop="static"
        size="md"
        title="View Timesheet"
        cancel_btn='true'
        hideBtn={true}
        handleClose={() => {
          setViewtimesheet(false);
          // formik.resetForm();
        }}
      >
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Job Name
                  </label>
                </div>
                <div className="col-md-8">
                  <span className="text-muted">Year End Accounting</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Job ID
                  </label>
                </div>
                <div className="col-md-8">
                  <span className="text-muted">Job-001</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <label htmlFor="customername-field" className="form-label">
                    Message
                  </label>
                </div>
                <div className="col-md-8">
                  <span className="text-muted">
                    This Task is Completed on 31st March 2023 by Nirav Patel
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12 ">
            <div className="mb-4 mt-3">
              <div className="card">
                <div className="card-body">
                  <div className="col-lg-12">
                    <label htmlFor="firstNameinput" className="form-label">
                      Total Time
                    </label>

                    <div className="row">
                      <div className="col-md-6 pe-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={10}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                          />
                          <span className="input-group-text" id="basic-addon2">
                            Hours
                          </span>
                        </div>
                      </div>
                      <div className="col-md-6 ps-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder={10}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                          />
                          <span className="input-group-text" id="basic-addon2">
                            Minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="mt-3">
                      <label htmlFor="status-field" className="form-label">
                        Task Status
                      </label>
                      <select
                        className="form-control"
                        data-trigger=""
                        name="status-field"
                        id="status-field"
                      >
                        <option value="" selected="">
                          {" "}
                          Select Status
                        </option>
                        <option value="">To Be started</option>
                        <option value="">WIP</option>
                        <option value="">Missing Paperwork</option>
                        <option value="">Query Responses Awaited</option>
                        <option value="">To Be Reviewed</option>
                        <option value="">WIP - Amendment</option>
                        <option value="">WIP - Fixing Errors</option>
                        <option value="">Draft Sent for Approval</option>
                        <option value="">Filed With Companies House</option>
                        <option value="">
                          Filed With Companies House and HMRC
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default TaskTimesheet;
