import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { Trash2 } from "lucide-react";

const Timesheet = () => {
  const [addtask, setAddtask] = useState(false);
  const [timeSheetRows, setTimeSheetRows] = useState([
    {
      TaskType: "",
      Customer: "",
      Client: "",
      Job: "",
      Task: "",
      Mon: "",
      Tue: "",
      Wed: "",
      Thu: "",
      Fri: "",
      Sat: "",
      Sun: "",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState("this-week");

  // Function to handle dropdown change
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };
  const handleAddNewSheet = () => {
    const newSheetRow = {
      TaskType: "",
      Customer: "",
      Client: "",
      Job: "",
      Task: "",
      Mon: "",
      Tue: "",
      Wed: "",
      Thu: "",
      Fri: "",
      Sat: "",
      Sun: "",
    };
    setTimeSheetRows((prevRows) => [...prevRows, newSheetRow]);
  };

  const handleDeleteRow = (index) => {
    const newSheetRows = [...timeSheetRows];
    newSheetRows.splice(index, 1);
    setTimeSheetRows(newSheetRows);
  };

  const [openRows, setOpenRows] = useState([]); // Track which rows are open

  // Function to toggle rows open/close
  const toggleRow = (index) => {
    if (openRows.includes(index)) {
      setOpenRows(openRows.filter((i) => i !== index)); // Close if open
    } else {
      setOpenRows([...openRows, index]); // Open if closed
    }
  };
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
        <div className="report-data mt-4">
          <div className="col-md-4">
        <div className="form-group">
                    {/* <label htmlFor="tabSelect">Filter:</label> */}
                    <select
                      className="form-control"
                      id="tabSelect"
                      value={selectedTab}
                      onChange={handleTabChange}
                    >
                      <option >Select Options</option>
                      <option value="this-week">This Week</option>
                      <option value="last-week">Last Week</option>
                      <option value="this-month">This Month</option>
                      <option value="last-month">Last Month</option>
                      <option value="last-quarter">Last Quarter</option>
                      <option value="this-6-months">This 6 Months</option>
                      <option value="last-6-months">Last 6 Months</option>
                      <option value="this-year">This Year</option>
                      <option value="last-year">Last Year</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  </div>

                   {/* Tabs Content */}
              <div className="tab-content mt-5">
                {/* Render content based on selected tab */}
                {selectedTab === "this-week" && (
                  <div className="tab-pane show active">
                     <div id="customerList">
                      <div className="row">
                       
                        <div className="table-responsive table-card  mb-1">
                          <table
                            className="timesheetTable table align-middle table-nowrap"
                            id="customerTable"
                          >
                            <thead className="table-light table-head-blue">
                              <tr>
                                <th className="dropdwnCol2" data-field="phone">
                                  No
                                </th>
                                <th className="" data-field="phone" >
                                  Task Type
                                </th>
                                <th className="dropdwnCol7" data-field="phone">
                                  Customer
                                </th>
                                <th className="dropdwnCol6" data-field="phone">
                                  Client
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Job
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Task
                                </th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="customer_name"
                                >
                                  Mon 12/02/2024
                                </th>
                                <th
                                  className="dropdwnCol5"
                                  data-field="customer_name"
                                >
                                  Tue 13/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Wed 14/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Thu 15/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Fri 16/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Sat 17/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Sun 18/02/2024
                                </th>
                                <th className="dropdwnCol5" data-field="phone">
                                  Action
                                </th>
                              </tr>
                            </thead>

                            <tbody className="list form-check-all">
                              {timeSheetRows?.map((item, index) => (
                                <tr className="tabel_new">
                                  <td>{index + 1}</td>
                                  <td >
                                    <select className="form-select form-control" style={{width:'100px'}}>
                                      <option>Internal</option>
                                      <option selected>External</option>
                                    </select>
                                  </td>
                                  <td >
                                    <select className="form-select" style={{width:'150px'}}>
                                      <option selected>Customer 1</option>
                                      <option value={1}>
                                        THE BLACK T COMPANY LTD
                                      </option>
                                    </select>
                                  </td>
                                  <td>
                                    <select className="form-select" style={{width:'150px'}}>
                                      <option selected>Client 1</option>
                                      <option value={1}>MT LIMITED</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select className="form-select" style={{width:'120px'}}>
                                      <option selected>Job 1</option>
                                      <option value={1}>VAT</option>
                                    </select>
                                  </td>
                                  <td>
                                    <select className="form-select" style={{width:'120px'}}>
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

                                  <td className="d-flex">
                                  <button
                                      className="edit-icon"
                                     
                                    >
                                      <i className="fa fa-pencil text-primary  "></i>
                                    </button>
                                    <button
                                      className="delete-icon"
                                      onClick={() => handleDeleteRow(index)}
                                    >
                                      <i className="ti-trash text-danger  "></i>
                                    </button>
                                    {/* <Trash2 className="delete-icon" /> */}
                                   
                                  </td>
                                </tr>
                              ))}
                              <tr className="tabel_new">
                                <td>
                                  <button
                                    className="d-flex btn btn-info fw-normal px-2"
                                    onClick={handleAddNewSheet}
                                  >
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
                )}

                {selectedTab === "last-week" && (
                   <div>This Last week content...</div>
                )}

                {selectedTab === "this-month" && (
                  <div>This month's content...</div>
                )}
                {selectedTab === "last-month" && (
                  <div>Last month's content...</div>
                )}
                {selectedTab === "last-quarter" && (
                  <div>Last quarter's content...</div>
                )}
                {selectedTab === "this-6-months" && (
                  <div>This 6 months' content...</div>
                )}
                {selectedTab === "last-6-months" && (
                  <div>Last 6 months' content...</div>
                )}
                {selectedTab === "this-year" && (
                  <div>This year's content...</div>
                )}
                {selectedTab === "last-year" && (
                  <div>Last year's content...</div>
                )}
                {selectedTab === "custom" && <div>Custom content...</div>}
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-info">
                  <i className="fa fa-check"></i> save
                </button>
                <button className="btn btn-outline-success ms-3">
                  <i className="far fa-save"></i> submit
                </button>
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
             
             
              <div className="col-lg-12">
                <label htmlFor="customername-field" className="form-label">
                  Remark
                </label>
                <textarea
                  className="form-control cursor-pointer"
                  placeholder="Remark"
                  defaultValue=""
                />
              </div>
            </div>
            </div>
          </CommonModal>
        </div>
      </div>
    </div>
  );
};

export default Timesheet;
