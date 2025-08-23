import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import * as XLSX from "xlsx";
import {
  Get_Service,
  GET_CUSTOMER_DATA,
  Edit_Customer,
  ADD_SERVICES_CUSTOMERS,
  getcustomerschecklistApi
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
import Select from 'react-select';

const Service = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const token = JSON.parse(localStorage.getItem("token"));
  const newCustomerId = localStorage.getItem("newCustomerId");
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
  const [fileName, setFileName] = useState("No file selected");
  const [jobTypeData, setJobTypeData] = useState([]);
  const [tasksGet, setTasksData] = useState([]);
  const [getCustomerService, setCustomerService] = useState({ loading: true, data: [] });
  const [uploadMessage, uploadSetMessage] = useState("");
  const [tasksGet1, setTasksData1] = useState([]);
  const [tasksGetRemove, setTasksDataRemove] = useState([]);
  const [selectManager, setSelectManager] = useState([]);
  
  useEffect(() => {
    JobTypeDataAPi(services, 2);
  }, [services]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(GET_CUSTOMER_DATA({ req: { customer_id: newCustomerId, pageStatus: "2" }, authToken: token}))
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
  }, [dispatch, token]);


  console.log(" staffDataAll.data",  staffDataAll.data);
  useEffect(() => {
    if (getCustomerService.data.services) {
      setServices(
        getCustomerService.data.services.map((service) => service.service_id)
      );

      setManager(
        getCustomerService.data.services.map((service) => ({
          service_id: service.service_id,
          account_manager_ids: service.account_manager_ids
            ? service.account_manager_ids.map((id) => {
                // Find the staff object matching the id
                const staff = staffDataAll.data.find((staff) => staff.id === id);
                // Return the staff object or handle missing staff
                return staff ? { value: staff.id, label: staff.first_name+' '+staff.last_name } : null; 
              }).filter(Boolean) 
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




    const ExistJobService = getCustomerService?.data?.services?.find((ser) => ser?.service_id === item?.id) || null



    if (ExistJobService != null && ExistJobService?.job_exist != null) {
      Swal.fire({
        icon: 'warning',
        title: "This service has been assigned to job, cannot remove it",
        timerProgressBar: true,
        showConfirmButton: true,
        timer: 1500
      });
      e.target.checked = true
      return
    }


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
    setModal(false)
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

    const MatchData = services.map((service) => {
      const managerData = getManager.find((item) => item.service_id == service);
   

      return {
        service_id: service,
        account_manager_ids: managerData
          ? managerData.account_manager_ids.map((manager) => manager.value)
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

  const handleDelete1 = (id) => {

    if (tasksGet1.length > 0) {
      tasksGet1.map((task) => {
        if (task.id === id) {
          setTasksDataRemove(prev => [...prev, task]);
        }
      })

    }
    setTasksData1((prev) => prev.filter((task) => task.id !== id));
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

  const getCheckListData = async (service_id, item) => {
    const req = { service_id: service_id, job_type_id: item.id, customer_id: address };
    const data = { req, authToken: token };
    await dispatch(getcustomerschecklistApi(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.data.length > 0) {

            setTasksData1((prev) => {
              const mergedTasks = [...prev, ...response.data];

              const uniqueTasks = mergedTasks.filter(
                (task, index, self) =>
                  index === self.findIndex((t) => t.id === task.id)
              );

              return uniqueTasks;
            });
          } else {
            setTasksData1((prev) => [...prev, ...response.data]);
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const TaskUpdate = async (e, id, serviceId) => {

    if (tasksGet.length > 0) {
      setTasksData((prev) =>
        prev.filter(
          (task) => !tasksGet.some((item) => item.JobTypeId === id && item.serviceId === serviceId && task.JobTypeId === id && task.serviceId === serviceId)
        )
      );
    }



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

          rows.forEach((row) => {
            let idValue = row[headers.indexOf("id")];
            let taskName = row[headers.indexOf("Task Name")] || "";
            let budgetHours = row[headers.indexOf("Budgeted Hours")] || "00";
            let budgetMinutes = row[headers.indexOf("Budgeted Minutes")] || "00";

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
    const fileUrl = "/Checklist.xlsx";

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", "Checklist.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSelect = (selected) => {
    setSelectManager(selected);
    setManager((prevManager) => {
      const existingIndex = prevManager.findIndex(
        (item) => item.service_id === tempServices
      );

      if (existingIndex !== -1) {
        const updatedManager = [...prevManager];
        updatedManager[existingIndex].account_manager_ids = selected;
        return updatedManager;
      } else {
        if (selected.length > 0) {
          return [
            ...prevManager,
            { service_id: tempServices, account_manager_ids: selected },
          ];
        }
        return prevManager;
      }
    });

  }

  console.log("getManager", getManager);
  console.log("tempServices", tempServices);
  return (
    <Formik initialValues={address} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <div className="details__wrapper service__wrapper">
          <div className="card pricing-box m-2 mt-0">
            <div className="card-header step-header-blue">
              <h4 className="card-title mb-0">Select Services</h4>
            </div>
            <div className="row card-body">
              <div className="table-responsive table-card mb-1">
                <table className="table align-middle table-nowrap">
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th scope="col" >
                        <div className="form-check"></div>
                      </th>
                      <th>Service Name</th>
                      {/* <th width="100"></th> */}
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GetAllService.data.length > 0 ? (
                      GetAllService.data.map((item, index) => (
                        <tr key={index}>
                          <th scope="row" className="align-top">
                            <div className="form-check">
                              <input
                                className="form-check-input new_input new-checkbox mt-3"
                                type="checkbox"
                                checked={services.includes(item.id)}
                                onChange={(e) => handleCheckboxChange(e, item)}
                              />
                            </div>
                          </th>

                          <td className="customer_name">
                            <div className="accordion-div">
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
                                    className="accordion-button collapsed fw-bold bg-transparant"
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
                                      <div className="accordion" id="sub-accordionExample">
                                        {services.includes(item.id) &&
                                          jobTypeData &&
                                          jobTypeData
                                            .filter((data) => data.service_id === item.id)
                                            .flatMap((data, subIndex) =>
                                              data.data.map((data1, jobIndex) => (
                                                <div className="accordion-item" key={`${item.id}_${data1.id}_${jobIndex}`}>
                                                  <h2 className="accordion-header" id={`sub-headingOne${item.id}_${data1.id}_${jobIndex}`} onClick={() => getCheckListData(item.id, data1)}>
                                                    <button
                                                      className="accordion-button  collapsed"
                                                      type="button"
                                                      data-bs-toggle="collapse"
                                                      data-bs-target={`#sub-collapseOne${item.id}_${data1.id}_${jobIndex}`}
                                                      aria-expanded="false"
                                                      aria-controls={`sub-collapseOne${item.id}_${data1.id}_${jobIndex}`}
                                                    >
                                                      {data1.type}
                                                    </button>
                                                  </h2>
                                                  <div
                                                    id={`sub-collapseOne${item.id}_${data1.id}_${jobIndex}`}
                                                    className="accordion-collapse collapse"
                                                    aria-labelledby={`sub-headingOne${item.id}_${data1.id}_${jobIndex}`}
                                                    data-bs-parent="#sub-accordionExample"
                                                  >
                                                    <div className="accordion-body">
                                                      <div className="pb-3">
                                                        <div className="row align-items-center justify-content-lg-between">
                                                          {/* Upload File Button */}
                                                          <div className="col-md-auto">
                                                            <input
                                                              type="file"
                                                              id="uploadButton"
                                                              className="form-control"
                                                              style={{ cursor: "pointer" }}
                                                              onChange={(e) => {
                                                                TaskUpdate(e, data1.id, item.id);
                                                              }}
                                                            />
                                                          </div>
                                                          <div className="col-md-auto float-lg-end ms-0 ">
                                                            <button onClick={handleDownload} className="btn btn-outline-info mt-2 mt-xxl-0">
                                                              <i className="fas fa-download me-2"></i>
                                                              Download Sample File
                                                            </button>
                                                          </div>
                                                        </div>
                                                        <div className="table-responsive">
                                                          {[...tasksGet1, ...tasksGet].filter(
                                                            (TaskShow) =>
                                                              data1.id === TaskShow.JobTypeId || TaskShow.job_type_id && item.id === TaskShow.serviceId || TaskShow.service_id
                                                          )
                                                            .length > 0 && (
                                                              <table className="table table-bordered mt-4">
                                                                <thead className="table-head-blue">
                                                                  <tr>
                                                                    <th colSpan="3" className="fs-6 text-center card-header step-header-blue">
                                                                      Checklist Name:{" "}
                                                                      {
                                                                        tasksGet.find(
                                                                          (TaskShow) =>
                                                                            data1.id === TaskShow.JobTypeId && item.id === TaskShow.serviceId
                                                                        )?.checklistName
                                                                      }
                                                                    </th>
                                                                  </tr>
                                                                  <tr>
                                                                    <th className="text-center">Tasks</th>
                                                                    <th className="text-center" width="250">Budgeted Time</th>
                                                                    <th className="text-center">Action</th>
                                                                  </tr>
                                                                </thead>
                                                                <tbody>
                                                                  {tasksGet.map((TaskShow) => {



                                                                    if (
                                                                      data1.id == TaskShow.JobTypeId &&
                                                                      item.id == TaskShow.serviceId
                                                                    ) {
                                                                      return (
                                                                        <tr key={TaskShow.id}>
                                                                          <td>
                                                                            {TaskShow.Task.map((TaskData) => (
                                                                              <div key={TaskData.id} className="mb-2">
                                                                                <input
                                                                                  type="text"
                                                                                  className="form-control"
                                                                                  value={TaskData.TaskName}
                                                                                  disabled
                                                                                />
                                                                              </div>
                                                                            ))}
                                                                          </td>
                                                                          <td>
                                                                            {TaskShow.Task.map((TaskData) => (
                                                                              <div key={TaskData.id} className="mb-2">

                                                                                <div className="input-group">
                                                                                  <div className="hours-div">
                                                                                    <input
                                                                                      type="text"
                                                                                      className="form-control"
                                                                                      value={TaskData.BudgetHour.split(":")[0]}
                                                                                      disabled
                                                                                    />
                                                                                    <span className="input-group-text">H</span>
                                                                                  </div>
                                                                                  <div className="hours-div">
                                                                                    <input
                                                                                      type="text"
                                                                                      className="form-control"
                                                                                      value={TaskData.BudgetHour.split(":")[1]}
                                                                                      disabled
                                                                                    />
                                                                                    <span className="input-group-text">M</span>
                                                                                  </div>
                                                                                </div>
                                                                              </div>
                                                                            ))}
                                                                          </td>
                                                                          <td className="text-center">
                                                                            <button
                                                                              className=" delete-icon"
                                                                              onClick={() => handleDelete(TaskShow.id)}
                                                                            >
                                                                              <i className="ti-trash text-danger"></i>
                                                                            </button>
                                                                          </td>
                                                                        </tr>
                                                                      );
                                                                    }
                                                                    return null;
                                                                  })}
                                                                  {tasksGet1.map(
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
                                                                                      <div className="hours-div">
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
                                                                                          H
                                                                                        </span>
                                                                                      </div>
                                                                                      <div className="hours-div">
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
                                                                                          M
                                                                                        </span>
                                                                                      </div>
                                                                                    </div>
                                                                                  </div>
                                                                                )
                                                                              )}
                                                                            </td>
                                                                            <td className="text-center">
                                                                              <button
                                                                                className="delete-icon"
                                                                                onClick={() =>
                                                                                  handleDelete1(
                                                                                    TaskShow.id
                                                                                  )
                                                                                }
                                                                              >
                                                                                <i className=" ti-trash text-danger"></i>
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
                                                </div>
                                              ))
                                            )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            </div>
                          </td>

                          <td className="align-top text-end">
                            <button
                              className="btn  btn-info remove-item-btn mt-3"
                              disabled={!services.includes(item.id)}
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
              <div className="col-12">
                <Select
               
                  options={staffDataAll.data.map((data) => ({
                    value: data.id,
                    label: data.first_name+" "+data.last_name,
                  }))}  
                  isMulti
                  Clearable={false}
                  className="basic-multi-select table-select"
                  style={{ border: 'none' }}
                  value={
                    getManager &&
                    getManager.find((item) => item.service_id == tempServices)?.account_manager_ids || []
                  }
                  onChange={(selected) => handleSelect(selected)}
                  placeholder="Select options"
                />
              </div>

              <div className="col-lg-12 mt-4 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-info add-btn "
                  onClick={AddManager}
                >
                  Save
                </button>
              </div>
            </div>
          </CommanModal>

          <div className="form__item button__items d-flex justify-content-between">
            <Button className="btn btn-info" type="default" onClick={prev}>
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
