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

  const [jobTypeData, setJobTypeData] = useState([]);
  const [showJobTabel, setShowJobTabel] = useState("");
  const [tasksGet, setTasksData] = useState([]);
  const [getCustomerService, setCustomerService] = useState({
    loading: true,
    data: [],
  });

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

  const ServicesUpdate = (value, type) => {
    if (type === 2) {
      setServices((prevServices) =>
        !prevServices.includes(value) ? [...prevServices, value] : prevServices
      );
    } else if (type === 1) {
      setServices(
        value.length === 0 ? [] : GetAllService.data.map((item) => item.id)
      );
    }
  };

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

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      setServices(GetAllService.data.map((item) => item.id));
    } else {
      setServices([]);
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
      alert("Please add at least one Service.");
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
      console.log("Error updating services", error);
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

  const getCheckListData = async (service_id, item) => {
    const req = { service_id: service_id, job_type_id: item.id };
    const data = { req, authToken: token };
    await dispatch(GETTASKDATA(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          if (response.data.length > 0) {
            setTasks((prev) => {
              const mergedTasks = [...prev, ...response.data];

              const uniqueTasks = mergedTasks.filter(
                (task, index, self) =>
                  index === self.findIndex((t) => t.id === task.id)
              );

              return uniqueTasks;
            });
          } else {
            setTasks((prev) => [...prev, ...response.data]);
          }
        }
      })
      .catch((error) => {
        console.log("Error fetching job types:", error);
      });
  };

  const TaskUpdate = async (e, id, serviceId) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const headers = rawData[0];
        const rows = rawData.slice(1);

        let result = [];
        let currentId = null;
        let currentChecklistName = null;
        let taskList = [];

        rows.forEach((row) => {
          const idValue = row[headers.indexOf("id")];
          const checklistName = row[headers.indexOf("Checklist Name")] || "";
          const taskName = row[headers.indexOf("Task Name")] || "";
          const budgetHours = row[headers.indexOf("Budget Hours")] || "";
          const budgetMinutes = row[headers.indexOf("Budget Minutes")] || "";

          if (idValue) {
            if (currentId !== null) {
              result.push({
                id: currentId,
                checklistName: currentChecklistName,
                Task: taskList,
              });
            }

            currentId = idValue;
            currentChecklistName = checklistName;
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
                      <th>Service Name</th>
                      <th width='100'></th>
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
                                onChange={(e) => {
                                  handleCheckboxChange(e, item);
                                }}
                              />
                            </div>
                          </th>

                          <td className="customer_name">

                          <>
  <div className="accordion" id="accordionExample">
    <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          {item.name}
        </button>
      </h2>
      <div
        id="collapseOne"
        className="accordion-collapse collapse "
        aria-labelledby="headingOne"
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body">
          <div className="pb-3">
          <input
                                                    type="file"
                                                 id="uploadButton"
                                                 className="form-control"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    // onChange={(e) =>
                                                    //   TaskUpdate(
                                                    //     e,
                                                    //     data1.id,
                                                    //     item.id
                                                    //   )
                                                    // }
                                                  />
          </div>
          <div className="accordion" id="sub-accordionExample">
            <div className="accordion-item">
              <h2 className="accordion-header" id="sub-headingOne">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#sub-collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  View Uploaded Data
                </button>
              </h2>
              <div
                id="sub-collapseOne"
                className="accordion-collapse collapse "
                aria-labelledby="sub-headingOne"
                data-bs-parent="#sub-accordionExample"
              >
                <div className="accordion-body">
                  <table className="table table-light table-head-blue">
                   <thead>
                    <th>Checklist Name</th>
                    <th>Tasks</th>
                    <th>Budgeted Hour</th>
                   </thead>
                   <tbody>
                    <td>
                      ffgf
                    </td>
                   </tbody>
                  </table>
                </div>
              </div>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  </div>
  
</>

                            <div className="customer-details d-flex align-items-center justify-content-between">
                              <div className="fs-18">{item.name}</div>{" "}
                              <div
                                className="customer-details d-flex align-items-center"
                                style={{ marginLeft: "10px" }}
                              >
                                {services.includes(item.id) && (
                                 
                                  <i
                                    className="fa-solid fa-chevron-down fs-6"
                                    onClick={(e) =>
                                      setShowJobTabel((pre) =>
                                        pre == item.id ? "" : item.id
                                      )
                                    }
                                  />
                                )}
</div>
                               </div>
                              
                               <div
                                  key={index}
                                  style={{
                                    marginTop:'10px',
                                    marginLeft: "-50px",
                                    
                                  }}
                                >
                                  <div
                                    className="accordion"
                                    id={`accordion-${index}`}
                                  >
                                    {showJobTabel === item.id &&
                                      jobTypeData &&
                                      jobTypeData
                                        .filter(
                                          (data) => data.service_id === item.id
                                        )
                                        .flatMap((data) =>
                                          data.data.map((data1, index) => (
                                            <div
                                              className="accordion-item"
                                              key={index}
                                            >
                                              <div
                                                className=" accordion-header w-100 px-2 py-2"
                                                id={`heading-${index}`}
                                                style={{
                                                  backgroundColor: "#ebf4f7",
                                                 
                                                }}
                                              >
                                                <div className="d-flex justify-content-between border-bottom">
                                                <div
                                                  className=""
                                                 
                                                >
                                                  {data1.type}
                                                </div>
                                                <div
                                                  className=" accordion-button w-auto collapsed"
                                                  data-bs-toggle="collapse"
                                                  data-bs-target={`#collapse-${index}`}
                                                  aria-expanded="false"
                                                  aria-controls={`collapse-${index}`}
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                ></div>
                                                </div>
                                                <div className="row">
                                              
                                                <div className="col-lg-12 pt-3 text-center">
  <label htmlFor="uploadButton" style={{ cursor: "pointer" }} className="btn btn-outline-info bg-white">
  <i className="fa-regular fa-cloud-arrow-up pe-2">
    
  </i>
   {/* FontAwesome icon */}
   Drop files here to upload
  </label>
  <input
    type="file"
    id="uploadButton"
    style={{
      display: "none", // Hides the actual file input
    }}
    onChange={(e) => TaskUpdate(e, data1.id, item.id)}
  />
</div>

                                                <div className="col-lg-6">
                                                  <input
                                                    type="file"
                                                 id="uploadButton"
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onChange={(e) =>
                                                      TaskUpdate(
                                                        e,
                                                        data1.id,
                                                        item.id
                                                      )
                                                    }
                                                  />
                                                </div>

                                              
                                              </div>
                                              </div>
                                              <div
                                                id={`collapse-${index}`}
                                                className="accordion-collapse collapse" // Keep accordion collapsed by default
                                                aria-labelledby={`heading-${index}`}
                                              >
                                                <div className="accordion-body ">
                                                  <table
                                                    style={{
                                                      width: "100%",
                                                      borderCollapse:
                                                        "collapse",
                                                    }}
                                                  >
                                                    <thead>
                                                      <tr
                                                        style={{
                                                          backgroundColor:
                                                            "#f2f2f2",
                                                          textAlign: "left",
                                                        }}
                                                      >
                                                        <th
                                                          style={{
                                                            padding: "10px",
                                                            border:
                                                              "1px solid #ddd",
                                                          }}
                                                        >
                                                          Checklist Name
                                                        </th>
                                                        <th
                                                          style={{
                                                            padding: "10px",
                                                            border:
                                                              "1px solid #ddd",
                                                          }}
                                                        >
                                                          Tasks
                                                        </th>
                                                        <th  style={{
                                                            padding: "10px",
                                                            border:
                                                              "1px solid #ddd",
                                                          }}>Budgeted Hour</th>
                                                      </tr>
                                                    </thead>
                                                    <tbody>
                                                      {tasksGet &&
                                                        tasksGet.map(
                                                          (TaskShow) => {
                                                            if (
                                                              data1.id ==
                                                                TaskShow.JobTypeId &&
                                                              item.id ==
                                                                TaskShow.serviceId
                                                            ) {
                                                            
                                                              return (
                                                                <tr>
                                                                  <td
                                                                    style={{
                                                                      padding:
                                                                        "8px",
                                                                      border:
                                                                        "1px solid #ddd",
                                                                    }}
                                                                  >
                                                                   {TaskShow.checklistName}
                                                                  </td>
                                                                  <td
                                                                    style={{
                                                                      padding:
                                                                        "8px",
                                                                      border:
                                                                        "1px solid #ddd",
                                                                    }}
                                                                  >
                                                                   {TaskShow && TaskShow.Task.map((TaskData)=>{
                                                                      return(
                                                                        <div>
                                                                          <div>{TaskData.TaskName}</div>
                                                                   
                                                                        </div>
                                                                      )
                                                                   })   }
                                                                  </td>
                                                                  <td style={{
                                                                      padding:
                                                                        "8px",
                                                                      border:
                                                                        "1px solid #ddd",
                                                                    }}>
                                                                  {TaskShow && TaskShow.Task.map((TaskData)=>{
                                                                      return(
                                                                        <div>
                                                                          <div>{TaskData.BudgetHour}</div>
                                                                   
                                                                        </div>
                                                                      )
                                                                   })   }
                                                                  </td>
                                                                </tr>
                                                              );
                                                            }
                                                          }
                                                        )}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                  </div>
                                </div>
                            
                          </td>
<td></td>
                          <td className="align-top">
                            <button
                              className="btn btn-sm tn btn-outline-info remove-item-btn"
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
            <div className="">
              <div className="row">
                <div className="col-9">
                  <div className="search-box ">
                    <i className="ri-search-line search-icon" />
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Search Manager..."
                      value={searchValue}
                      onClick={(e) => setSearchValue(e.target.value)}
                    />
                  </div>
                  {filteredData.length > 0 && (
                    <div className="search-results">
                      {filteredData.map((data, index) => (
                        <div
                          key={index}
                          className="search-result-item"
                          onClick={() => setSearchValue(data.first_name)}
                        >
                          {data.first_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-3">
                  <button
                    type="button"
                    className=" btn btn-outline-info add-btn  "
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
                                  key={`${managerIndex}-${accountManagerIndex}`}
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
                                      className="btn btn-sm  remove-item-btn"
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
