import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import {
  Get_Service,
  GET_CUSTOMER_DATA,
  Edit_Customer,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import MultiStepFormContext from "./MultiStepFormContext";
import CommanModal from "../../../../Components/ExtraComponents/Modals/CommanModal";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import { useLocation } from "react-router-dom";
import {
  JobType,
  GETTASKDATA,
} from "../../../../ReduxStore/Slice/Settings/settingSlice";
import Swal from "sweetalert2";

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
  const [jobtype, SetJobtype] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [fileName, setFileName] = useState("No file selected");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [showJobTabel, setShowJobTabel] = useState("");
  const [tasksGet, setTasksData] = useState([]);
  const [getCustomerService, setCustomerService] = useState({
    loading: true,
    data: [],
  });
  const [uploadMessage, uploadSetMessage] = useState("");
  const [uploadMessage1, uploadSetMessage1] = useState([]);

  useEffect(() => {
    JobTypeDataAPi(services, 2);
  }, [services]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(
            GET_CUSTOMER_DATA({
              req: { customer_id: location.state.id, pageStatus: "2" },
              authToken: token,
            })
          )
            .unwrap()
            .then((response) =>
              setCustomerService({ loading: false, data: response.data })
            ),
          dispatch(Get_Service({ req: { action: "get" }, authToken: token }))
            .unwrap()
            .then((response) =>
              setAllService({ loading: false, data: response.data })
            ),
          dispatch(Staff({ req: { action: "getmanager" }, authToken: token }))
            .unwrap()
            .then((response) =>
              setStaffDataAll({ loading: false, data: response.data })
            ),
        ]);
      } catch (error) {
        setAllService({ loading: false, data: [] });
        setStaffDataAll({ loading: false, data: [] });
      }
    };

    fetchData();
  }, [dispatch, location.state.id, token]);

  useEffect(() => {
    if (getCustomerService.data.services) {
      setServices(
        getCustomerService.data.services.map((service) => service.service_id)
      );

      setManager(
        getCustomerService.data.services.map((service) => ({
          service_id: service.service_id,
          account_manager_ids: service.account_manager_ids
            ? service.account_manager_ids.map((id) =>
                staffDataAll.data.find((staff) => staff.id === id)
              )
            : [],
        }))
      );
    }
  }, [getCustomerService.data, staffDataAll.data]);

  useEffect(() => {
    if (searchValue.trim()) {
      setFilteredData(
        staffDataAll.data.filter((data) =>
          data.first_name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setFilteredData([]);
    }
  }, [searchValue, staffDataAll.data]);

  const handleCheckboxChange = (e, item) => {
    if (e.target.checked) {
      JobTypeDataAPi(item, 1);
      setServices((prevServices) =>
        !prevServices.includes(item.id)
          ? [...prevServices, item.id]
          : prevServices
      );
    } else {
      setServices((prevServices) =>
        prevServices.filter((service) => service !== item.id)
      );
    }
  };

  const AddManager = () => {
    const trimmedValue = searchValue.trim();
    if (!trimmedValue) return;

    const matchingData = staffDataAll.data.find(
      (data) => data.first_name === trimmedValue
    );

    if (matchingData) {
      setManager((prevManager) => {
        const existingServiceIndex = prevManager.findIndex(
          (manager) => manager.service_id === tempServices
        );

        if (existingServiceIndex > -1) {
          const updatedManagers = [...prevManager];
          const existingService = updatedManagers[existingServiceIndex];

          if (
            !existingService.account_manager_ids.some(
              (manager) => manager.id === matchingData.id
            )
          ) {
            existingService.account_manager_ids.push(matchingData);
          }

          updatedManagers[existingServiceIndex] = existingService;
          return updatedManagers;
        } else {
          return [
            ...prevManager,
            { service_id: tempServices, account_manager_ids: [matchingData] },
          ];
        }
      });
    }

    setSearchValue("");
  };

  const removeManager = (id, serviceId) => {
    setManager((prevManager) =>
      prevManager
        .map((manager) =>
          manager.service_id === serviceId
            ? {
                ...manager,
                account_manager_ids: manager.account_manager_ids.filter(
                  (accountManager) => accountManager.id !== id
                ),
              }
            : manager
        )
        .filter((manager) => manager.account_manager_ids.length > 0)
    );
  };

  const handleSubmit = async (values) => {
    if (services.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select at least one service",
      });
      return;
    }

    const MatchData = GetAllService.data.map((service) => {
      const managerData = getManager.find(
        (item) => item.service_id === service.id
      );

      return {
        service_id: service.id,
        account_manager_ids: managerData
          ? managerData.account_manager_ids.map((manager) => manager.id)
          : [],
      };
    });

    const filteredMatchData = MatchData.filter((item) =>
      services.includes(item.service_id)
    );

    const req = {
      customer_id: address,
      pageStatus: "2",
      services: filteredMatchData,
      Task: tasksGet,
    };

    try {
      const response = await dispatch(
        Edit_Customer({ req, authToken: token })
      ).unwrap();
      if (response.status) {
        next(response.data);
      }
    } catch (error) {
      return;
    }
  };

  const JobTypeDataAPi = async (req, id) => {
    const fetchJobTypeData = async (service_id) => {
      const data = {
        req: { action: "get", service_id },
        authToken: token,
      };

      try {
        const response = await dispatch(JobType(data)).unwrap();

        if (response.status && response.data.length > 0) {
          setJobTypeData((prev) => {
            const exists = prev.some((item) => item.service_id === service_id);

            if (!exists) {
              return [...prev, { service_id: service_id, data: response.data }];
            }
            return prev;
          });
        }
      } catch (error) {
        return;
      }
    };

    if (id === 2) {
      for (const item of req) {
        await fetchJobTypeData(item);
      }
    } else {
      await fetchJobTypeData(req.id);
    }
  };

  const TaskUpdate = async (e, id, serviceId) => {


    if (e.target.files.length > 0) {
      // ONLY xlsx file is allowed
      if (!e.target.files[0].name.endsWith(".xlsx")) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please upload an xlsx file.",
        });
        return;
      }

      uploadSetMessage(
        "File " + e.target.files[0].name + " has been uploaded successfully."
      );

      uploadSetMessage1((prevMessages) => [
        ...prevMessages,
        {
          name:
            "File " +
            e.target.files[0].name +
            " has been uploaded successfully.",
          jobId: id,
          serviceId: serviceId,
        },
      ]);

      let file = e.target.files[0]; 
      setFileName(file.name);
      if (file) {
        let reader = new FileReader();

        reader.onload = (event) => {
          let data = new Uint8Array(event.target.result);
          let workbook = XLSX.read(data, { type: "array" });

          let sheetName = workbook.SheetNames[0];
          let worksheet = workbook.Sheets[sheetName];

          let rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          let headers = rawData[0];
          let rows = rawData.slice(1);

          let result = [];
          let currentId = null;
          let currentChecklistName = null;
          let taskList = []; 
          rows.forEach((row, i) => {
            let idValue = i + 1;
            let taskName = row[headers.indexOf("Task Name")] || "";
            let budgetHours = row[headers.indexOf("Budget Hours")] || "00";
            let budgetMinutes = row[headers.indexOf("Budget Minutes")] || "00";

            if (budgetMinutes > 59) {
              let hours = Math.floor(budgetMinutes / 60);
              let minutes = budgetMinutes % 60;
              budgetHours = parseInt(budgetHours) + hours;
              budgetMinutes = minutes;
            }

            if (idValue) {
              if (currentId !== null) {
                result.push({
                  id: currentId,
                  checklistName: currentChecklistName,
                  Task: taskList,
                });
              }

              currentId = idValue;
              currentChecklistName = file.name.split(".")[0];
              taskList = [];
            }

            if (taskName) {
              taskList.push({
                TaskName: taskName,
                BudgetHour: budgetHours + ":" + budgetMinutes,
              });
            }
          });

          // Push the last item
          if (currentId !== null) {
            result.push({
              id: currentId,
              checklistName: currentChecklistName,
              Task: taskList,
            });
          }
          setTasksData((prev) => [
            ...prev,
            ...result.map((item) => ({
              ...item,
              JobTypeId: id,
              serviceId: serviceId,
            })),
          ]);
        };

        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
      }
    }
  };

  const handleDelete = (id) => {

    
    setTasksData((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDownload = () => {
    const fileUrl = "/Task.xlsx";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "Task.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleClearFile = () => {
    setFileName("No file selected");

    document.getElementById("uploadButton").value = null;
    setTasksData([]);
    uploadSetMessage("");
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };
 

  return (
    <Formik initialValues={address} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <div className="details__wrapper">
          <div className="card pricing-box m-2 mt-0">
            <div className="card-header step-header-blue">
              <h4 className="card-title mb-0">Select Services</h4>
            </div>
            <div className="row card-body">
              <div className="table-responsive table-card mb-1">
                <table className="table align-middle table-nowrap">
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th scope="col" style={{ width: 50 }}>
                        <div className="form-check"></div>
                      </th>
                      <th style={{ width: "70%" }}>Service Name</th>
                      {/* <th width="100"></th> */}
                      <th className="">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GetAllService.data.length > 0 ? (
                      GetAllService.data.map((item, index) => (
                        <tr key={index}>
                          <th scope="row" className="align-top">
                            <div className="form-check">
                              <input
                                className="form-check-input new_input new-checkbox"
                                type="checkbox"
                                checked={services.includes(item.id)}
                                onChange={(e) => handleCheckboxChange(e, item)}
                              />
                            </div>
                          </th>

                          <td className="customer_name">
                            {/* Main Accordion */}
                            <div
                              className="accordion"
                              id={`accordionExample${index}`}
                            >
                              <div className="accordion-item">
                                <h2
                                  className="accordion-header"
                                  id={`heading-${index}`}
                                >
                                  <button
                                    className="accordion-button collapsed fw-bold"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#collapse-${index}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse-${index}`}
                                  >
                                    {item.name}
                                  </button>
                                </h2>
                                <div
                                  id={`collapse-${index}`}
                                  className="accordion-collapse collapse"
                                  aria-labelledby={`heading-${index}`}
                                  data-bs-parent={`#accordionExample${index}`}
                                >
                                  {services.includes(item.id) && (
                                    <div className="accordion-body">
                                      <div
                                        className="accordion"
                                        id="sub-accordionExample"
                                      >
                                        {services.includes(item.id) &&
                                          jobTypeData &&
                                          jobTypeData
                                            .filter(
                                              (data) =>
                                                data.service_id === item.id
                                            )
                                            .flatMap((data, subIndex) =>
                                              data.data.map(
                                                (data1, jobIndex) => (
                                                  <div
                                                    className="accordion-item"
                                                    key={jobIndex}
                                                  >
                                                    <h2
                                                      className="accordion-header"
                                                      id={`sub-headingOne${jobIndex}`}
                                                    >
                                                      <button
                                                        className="accordion-button collapsed"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#sub-collapseOne${jobIndex}`}
                                                        aria-expanded="true"
                                                        aria-controls="collapseOne"
                                                      >
                                                        {data1.type}
                                                      </button>
                                                    </h2>
                                                    <div
                                                      id={`sub-collapseOne${jobIndex}`}
                                                      className="accordion-collapse collapse "
                                                      aria-labelledby={`sub-headingOne${jobIndex}`}
                                                      data-bs-parent="#sub-accordionExample"
                                                    >
                                                      <div className="accordion-body">
                                                        <div className="pb-3">
                                                          <div className="row align-items-center">
                                                            {/* Upload File Button */}
                                                            <div className="col-auto">
                                                              <label
                                                                htmlFor="uploadButton"
                                                                className=""
                                                              >
                                                                {/* <i className="fas fa-upload me-2"></i>
                                                                Upload File */}
                                                                <input
                                                                  type="file"
                                                                  id="uploadButton"
                                                                  className="form-control"
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onChange={(
                                                                    e
                                                                  ) =>
                                                                    TaskUpdate(
                                                                      e,
                                                                      data1.id,
                                                                      item.id
                                                                    )
                                                                  }
                                                                />
                                                              </label>
                                                            </div>

                                                            {/* File Name Display and Clear Icon */}
                                                            {/* <div className="col-auto d-flex align-items-center">
                                                              <span className="form-text me-2">
                                                                {fileName}
                                                              </span>
                                                              {fileName !==
                                                                "No file selected" && (
                                                                <i
                                                                  className="fas fa-trash text-danger"
                                                                  style={{
                                                                    cursor:
                                                                      "pointer",
                                                                  }}
                                                                  onClick={
                                                                    handleClearFile
                                                                  }
                                                                  title="Clear file"
                                                                ></i>
                                                              )}
                                                            </div> */}

                                                            {/* Download Button */}
                                                            <div className="col-auto ms-auto">
                                                              <button
                                                                onClick={
                                                                  handleDownload
                                                                }
                                                                className="btn btn-outline-info"
                                                              >
                                                                <i className="fas fa-download me-2"></i>
                                                                Download Sample
                                                                File
                                                              </button>
                                                            </div>
                                                          </div>
                                                          {/* <span
                                                            className="form-text"
                                                            style={{
                                                              color: "green",
                                                            }}
                                                          >
                                                            {uploadMessage}
                                                          </span> */}
                                                        </div>
  <div className="table-responsive">
                                                          {tasksGet &&
                                                            tasksGet.filter(
                                                              (TaskShow) =>
                                                                data1.id ===
                                                                  TaskShow.JobTypeId &&
                                                                item.id ===
                                                                  TaskShow.serviceId
                                                            ).length > 0 && (
                                                              <table className="table table-bordered">
                                                                <thead className="table-head-blue">
                                                                  <tr>
                                                                    <th
                                                                      colSpan="3"
                                                                      className="fs-6 text-center card-header step-header-blue"
                                                                    >
                                                                      Checklist
                                                                      Name:{" "}
                                                                      {
                                                                        tasksGet.find(
                                                                          (
                                                                            TaskShow
                                                                          ) =>
                                                                            data1.id ===
                                                                              TaskShow.JobTypeId &&
                                                                            item.id ===
                                                                              TaskShow.serviceId
                                                                        )
                                                                          .checklistName
                                                                      }
                                                                    </th>
                                                                  </tr>
                                                                  <tr>
                                                                    <th className="text-center">
                                                                      Tasks
                                                                    </th>
                                                                    <th className="text-center">
                                                                      Budgeted
                                                                      Hour
                                                                    </th>
                                                                    <th className="text-center">
                                                                      Action
                                                                    </th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {tasksGet.map(
                                                                    (
                                                                      TaskShow
                                                                    ) => {
                                                                      if (
                                                                        data1.id ===
                                                                          TaskShow.JobTypeId &&
                                                                        item.id ===
                                                                          TaskShow.serviceId
                                                                      ) {
                                                                        return (
                                                                          <tr
                                                                            key={
                                                                              TaskShow.id
                                                                            }
                                                                          >
                                                                            <td>
                                                                              {TaskShow.Task.map(
                                                                                (
                                                                                  TaskData
                                                                                ) => (
                                                                                  <div
                                                                                    key={
                                                                                      TaskData.id
                                                                                    }
                                                                                    className="mb-2"
                                                                                  >
                                                                                    <input
                                                                                      type="text"
                                                                                      className="form-control"
                                                                                      value={
                                                                                        TaskData.TaskName
                                                                                      }
                                                                                      disabled
                                                                                    />
                                                                                  </div>
                                                                                )
                                                                              )}
                                                                            </td>
                                                                            <td>
                                                                              {TaskShow.Task.map(
                                                                                (
                                                                                  TaskData
                                                                                ) => (
                                                                                  <div
                                                                                    key={
                                                                                      TaskData.id
                                                                                    }
                                                                                    className="mb-2"
                                                                                  >
                                                                                    <div className="input-group">
                                                                                      <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={
                                                                                          TaskData.BudgetHour.split(
                                                                                            ":"
                                                                                          )[0]
                                                                                        }
                                                                                        disabled
                                                                                      />
                                                                                      <span className="input-group-text">
                                                                                        Hours
                                                                                      </span>
                                                                                      <input
                                                                                        type="text"
                                                                                        className="form-control"
                                                                                        value={
                                                                                          TaskData.BudgetHour.split(
                                                                                            ":"
                                                                                          )[1]
                                                                                        }
                                                                                        disabled
                                                                                      />
                                                                                      <span className="input-group-text">
                                                                                        Minutes
                                                                                      </span>
                                                                                    </div>
                                                                                  </div>
                                                                                )
                                                                              )}
                                                                            </td>
                                                                            <td>
                                                                              <button
                                                                                className="btn btn-sm btn-outline-danger rounded-circle"
                                                                                onClick={() =>
                                                                                  handleDelete(
                                                                                    TaskShow.id
                                                                                  )
                                                                                }
                                                                              >
                                                                                <i className=" ti-trash"></i>
                                                                              </button>
                                                                            </td>
                                                                          </tr>
                                                                        );
                                                                      }
                                                                      return null;
                                                                    }
                                                                  )}
                                                                </tbody>
                                                              </table>
                                                            )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )
                                            )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="align-top">
                            <button
                              className="btn btn-sm btn-outline-info remove-item-btn"
                              onClick={() => {
                                setModal(true);
                                setTempServices(item.id);
                              }}
                            >
                              Assign Account Manager{" "}
                              <i className="fa fa-user" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
                          No services available
                        </td>
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
            <div className="row">
              <div className="col-9">
                <div className="search-box">
                  <i className="ri-search-line search-icon" />
                  <input
                    type="text"
                    className="form-control search"
                    placeholder="Search Manager..."
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                </div>

                <div className="search-results">
                  {searchValue.trim() === "" ? (
                    <div className="no-results">
                      <p>No search value entered</p>
                    </div>
                  ) : (
                    staffDataAll.data
                      .filter((data) =>
                        data.first_name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      .map((data, index) => (
                        <div
                          key={data.id || index}
                          className="search-result-item"
                          onClick={() => setSearchValue(data.first_name)}
                        >
                          {data.first_name}
                        </div>
                      ))
                  )}
                </div>
              </div>

              <div className="col-3">
                <button
                  type="button"
                  className="btn btn-outline-info add-btn"
                  onClick={AddManager}
                >
                  Add
                  <i className="ps-2 ti-plus"></i>
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
                        .filter(
                          (manager) => manager.service_id === tempServices
                        )
                        .flatMap((manager, managerIndex) =>
                          manager.account_manager_ids.map(
                            (accountManager, accountManagerIndex) => (
                              <tr
                                key={`${managerIndex}-${accountManagerIndex}`} // Ensure unique key for each row
                              >
                                <td>{accountManager.first_name}</td>
                                <td className="text-align-right">
                                  <button
                                    onClick={() =>
                                      removeManager(
                                        accountManager.id,
                                        manager.service_id
                                      )
                                    }
                                    className="btn btn-sm remove-item-btn"
                                  >
                                    <i className="ti-trash text-danger fs-5"></i>
                                  </button>
                                </td>
                              </tr>
                            )
                          )
                        )
                    ) : (
                      <tr>
                        <td colSpan="2" className="text-center">
                          No staff available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CommanModal>

          <div className="form__item button__items d-flex justify-content-between">
            <Button className="btn btn-secondary" type="default" onClick={prev}>
              <i className="pe-2 fa-regular fa-arrow-left-long"></i> Previous
            </Button>
            <Button
              className="btn btn-info text-white blue-btn"
              type="submit"
              onClick={handleSubmit}
            >
              Next <i className="ps-2 fa-regular fa-arrow-right-long"></i>
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Service;

// const ServicesUpdate = (value, type) => {
//   if (type === 2) {
//     setServices((prevServices) =>
//       !prevServices.includes(value) ? [...prevServices, value] : prevServices
//     );
//   } else if (type === 1) {
//     setServices(
//       value.length === 0 ? [] : GetAllService.data.map((item) => item.id)
//     );
//   }
// };

// const handleSelectAllChange = (e) => {
//   if (e.target.checked) {
//     setServices(GetAllService.data.map((item) => item.id));
//   } else {
//     setServices([]);
//   }
// };

// const getCheckListData = async (service_id, item) => {
//   const req = { service_id: service_id, job_type_id: item.id };
//   const data = { req, authToken: token };
//   await dispatch(GETTASKDATA(data))
//     .unwrap()
//     .then((response) => {
//       if (response.status) {
//         if (response.data.length > 0) {
//           setTasks((prev) => {
//             const mergedTasks = [...prev, ...response.data];

//             const uniqueTasks = mergedTasks.filter(
//               (task, index, self) =>
//                 index === self.findIndex((t) => t.id === task.id)
//             );

//             return uniqueTasks;
//           });
//         } else {
//           setTasks((prev) => [...prev, ...response.data]);
//         }
//       }
//     })
//     .catch((error) => {
//       return;
//     });
// };
