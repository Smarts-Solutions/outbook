import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import MultiStepFormContext from "./MultiStepFormContext";
import { useDispatch } from "react-redux";
import CommanModal from "../../../../Components/ExtraComponents/Modals/CommanModal";
import { Staff } from "../../../../ReduxStore/Slice/Staff/staffSlice";
import {
  ADD_SERVICES_CUSTOMERS,
  Get_Service,
} from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import {
  JobType,
  GETTASKDATA,
} from "../../../../ReduxStore/Slice/Settings/settingSlice";
import Swal from "sweetalert2";

const Service = () => {
  const { address, setAddress, next, prev } = useContext(MultiStepFormContext);
  const token = JSON.parse(localStorage.getItem("token"));
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
  const [jobTypeData, setJobTypeData] = useState([]);
  const [getServiceData, setServiceData] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tasksGet, setTasksData] = useState([]);

  useEffect(() => {
    GetAllServiceData();
    fetchStaffData();
  }, []);

  useEffect(() => {
    JobTypeDataAPi(services, 2);
  }, [services]);

  useEffect(() => {
    if (searchValue.trim() !== "") {
      setFilteredData(
        staffDataAll.data.filter((data) =>
          data.first_name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    } else {
      setFilteredData([]);
    }
  }, [searchValue, staffDataAll]);

  const GetAllServiceData = async () => {
    const req = { action: "get" };
    const data = { req: req, authToken: token };
    await dispatch(Get_Service(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllService({ loading: false, data: response.data });
        } else {
          setAllService({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        setAllService({ loading: false, data: [] });
      });
  };

  const fetchStaffData = async () => {
    try {
      const response = await dispatch(
        Staff({ req: { action: "getmanager" }, authToken: token })
      ).unwrap();
      if (response.status) {
        setStaffDataAll({ loading: false, data: response.data });
      } else {
        setStaffDataAll({ loading: false, data: [] });
      }
    } catch (error) {
      console.error("Error fetching staff data", error);
      setStaffDataAll({ loading: false, data: [] });
    }
  };

  const ServicesUpdate = (value, type) => {
    if (type === 2) {
      setServices((prevServices) => {
        if (!prevServices.includes(value)) {
          return [...prevServices, value];
        }
        return prevServices;
      });
    } else if (type === 1) {
      if (value.length === 0) {
        setServices([]);
      } else {
        setServices(GetAllService.data.map((item) => item.id));
      }
    }
  };

  const handleCheckboxChange = (e, item, type) => {
    if (e) {
      ServicesUpdate(item.id, type);
    } else {
      setServices((prevServices) =>
        prevServices.filter((service) => service !== item.id)
      );
    }
  };

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      ServicesUpdate(GetAllService.data, 1);
    } else {
      ServicesUpdate([], 1);
    }
  };

  const AddManager = () => {
    const trimmedValue = searchValue.trim();
    if (trimmedValue === "") {
      return;
    }

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
            !existingService.account_manager_id.some(
              (manager) => manager.id === matchingData.id
            )
          ) {
            existingService.account_manager_id.push(matchingData);
          }

          updatedManagers[existingServiceIndex] = existingService;
          return updatedManagers;
        } else {
          return [
            ...prevManager,
            { service_id: tempServices, account_manager_id: [matchingData] },
          ];
        }
      });
    }
    setSearchValue("");
  };

  const removeManager = (id, serviceId) => {
    setManager((prevManager) =>
      prevManager
        .map((manager) => {
          if (manager.service_id === serviceId) {
            return {
              ...manager,
              account_manager_id: manager.account_manager_id.filter(
                (accountManager) => accountManager.id !== id
              ),
            };
          }
          return manager;
        })
        .filter((manager) => manager.account_manager_id.length > 0)
    );
  };

  const AddServiceId = (id) => {
    setTempServices(id);
  };

  const handleSubmit = async (values) => {
    
    if (services.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Please select services"
      });

      return;
    }

    // Create MatchData
    let MatchData = services.map((service_id) => {
      let managerData = getManager.find(
        (item) => item.service_id === service_id
      );
      return {
        service_id: service_id,
        account_manager_id: managerData
          ? managerData.account_manager_id.map((manager) => manager.id)
          : [],
      };
    });


    let TaskGet = [];
    if (tasksGet.length > 0) {
      TaskGet = tasksGet.map(({ hours, minutes, ...task }) => ({
        ...task,
        budgeted_hours: `${hours}:${minutes}`,
      }));
    }
    // Create request object
    var req = {
      customer_id: address,
      pageStatus: "2",
      services: MatchData,
      Task:TaskGet
    };


    // Send request
    const data = { req: req, authToken: token };
    await dispatch(ADD_SERVICES_CUSTOMERS(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          next(response.data);
        } else {
          // Handle error if needed
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
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



  return (
    <Formik initialValues={address} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <div className="details__wrapper">
          <div className="card report-data pricing-box p-0">
            <div className="card-header step-header-blue">
              <h4
                className="card-title mb-0"
                style={{ marginBottom: "20px !important" }}
              >
                Select Services
              </h4>
            </div>
            <div className="row card-body pt-0">
              <div className="table-responsive table-card mt-3 mb-1">
                <table
                  className="table align-middle table-nowrap"
                  id="customerTable"
                >
                  <thead className="table-light table-head-blue">
                    <tr>
                      <th scope="col" style={{ width: 50 }}>
                        <div className="form-check">
                          <input
                            className="form-check-input new_input new-checkbox"
                            type="checkbox"
                            id="checkAll"
                            onChange={handleSelectAllChange}
                            checked={
                              services.length === GetAllService.data.length &&
                              GetAllService.data.length > 0
                            }
                          />
                        </div>
                      </th>
                      <th>Service Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list form-check-all">
                    {GetAllService.data.length > 0 ? (
                      GetAllService.data.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <div className="form-check">
                              <input
                                className="form-check-input new_input new-checkbox"
                                type="checkbox"
                                onChange={(e) => {
                                  handleCheckboxChange(
                                    e.target.checked,
                                    item,
                                    2
                                  );


                                  setServiceData(item);

                                  if (e.target.checked) {
                                    SetJobtype(true);
                                  }
                                }}
                                checked={services.includes(item.id)}
                              />
                            </div>
                          </th>
                          <td className="customer_name">{item.name}</td>
                          <td>
                            <div className="d-flex">
                              <div className="remove">
                                <button
                                  className="btn btn-sm tn btn-outline-info remove-item-btn"
                                  onClick={() => {
                                    setModal(true);
                                    AddServiceId(item.id);
                                  }}
                                >
                                  Assign Account Manager{" "}
                                  <i className="fa fa-user" />
                                </button>
                              </div>
                            </div>
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
            isOpen={jobtype}
            backdrop="static"
            size="lg"
            title="Job Type"
            hideBtn={true}
            handleClose={() => SetJobtype(false)}
          >
            <table className="table align-middle table-nowrap">
              {jobTypeData.map((data) => {
                if (data.service_id === getServiceData.id) {
                  return data.data.map((item, index) => (
                    <React.Fragment key={index}>
                      <thead className="table-light table-head-blue">
                        <tr>
                          <td className="p-0">
                            <div className="form-group mb-0">
                              <div className="checkbox">
                                <label
                                  data-toggle="collapse"
                                  data-target={`#collapse${index}`}
                                  aria-expanded="false"
                                  aria-controls={`collapse${index}`}
                                  className="accordion-button fs-16 fw-bold py-2"
                                >
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      getCheckListData(getServiceData.id, item)
                                    }
                                  />{" "}
                                  {item.type}
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-0">
                            <div
                              id={`collapse${index}`}
                              aria-expanded="false"
                              className="collapse p-2"
                            >
                              {tasks && tasks.length > 0 ? (
                                tasks
                                  .filter(
                                    (task) =>
                                      task.job_type_id === item.id &&
                                      task.service_id === getServiceData.id
                                  )
                                  .map((task, taskIndex) => (
                                    <div
                                      className="row py-2 align-items-center"
                                      key={taskIndex}
                                    >
                                      <div className="col-md-5">
                                        <input
                                          type="checkbox"
                                          onChange={(e) => {
                                            if (e.target.checked) {
                                              setTasksData((pre) => [
                                                ...pre,
                                                {
                                                  ...task,
                                                  hours: "",
                                                  minutes: "",
                                                },
                                              ]);
                                            } else {
                                              setTasksData((pre) =>
                                                pre.filter(
                                                  (t) => t.id !== task.id
                                                )
                                              );
                                            }
                                          }}
                                        />{" "}
                                        {task.name}
                                      </div>
                                      <div className="col-lg-7 ps-0">
                                        <label className="form-label">
                                          Budgeted Hours
                                        </label>
                                        <div className="input-group">
                                          <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Hours"
                                            name="hours"
                                            min={0}
                                            value={
                                              tasksGet.find(
                                                (t) => t.id === task.id
                                              )?.hours || ""
                                            }
                                            onChange={(e) => {
                                              const hours = e.target.value;
                                              setTasksData((pre) =>
                                                pre.map((t) =>
                                                  t.id === task.id
                                                    ? { ...t, hours }
                                                    : t
                                                )
                                              );
                                            }}
                                          />
                                          <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Minutes"
                                            name="minutes"
                                            min={0}
                                            max={59}
                                            value={
                                              tasksGet.find(
                                                (t) => t.id === task.id
                                              )?.minutes || ""
                                            }
                                            onChange={(e) => {
                                              const minutes = e.target.value;
                                              setTasksData((pre) =>
                                                pre.map((t) =>
                                                  t.id === task.id
                                                    ? { ...t, minutes }
                                                    : t
                                                )
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))
                              ) : (
                                <p>No tasks available.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </React.Fragment>
                  ));
                }
                return null;
              })}
            </table>

            <div className="d-flex justify-content-end">
              <Button
                className="btn btn-info"
                color="primary"
                onClick={(e) => SetJobtype(false)}
              >
                Submit
              </Button>
            </div>
          </CommanModal>
          <CommanModal
            isOpen={getModal}
            backdrop="static"
            size="ms"
            title="Add Account Manager"
            hideBtn={true}
            handleClose={() => setModal(false)}
          >
            <div className="py-2">
              <div className="row">
                <div className="col-9">
                  <div className="search-box">
                    <i className="ri-search-line search-icon" />
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Search Manager..."
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
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

                <div className="col-3 ps-0">
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary add-btn"
                      id="create-btn"
                      onClick={AddManager}
                    >
                      <i className="pe-2 fa fa-plus"></i>
                      Add
                    </button>
                  </div>
                </div>
                <div className="col-md-6" />
                <div className="table-responsive mt-3 mb-1">
                  <table
                    className="table align-middle table-nowrap"
                    id="customerTable"
                  >
                    <thead className="table-light table-head-blue">
                      <tr>
                        <th>Account Name</th>
                        <th className="tabel_left text-align-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="list form-check-all">
                      {getManager.length > 0 ? (
                        getManager
                          .filter(
                            (manager) => manager.service_id === tempServices
                          )
                          .map((manager, managerIndex) =>
                            manager.account_manager_id.map(
                              (accountManager, accountManagerIndex) => (
                                <tr
                                  className="tabel_new"
                                  key={`${managerIndex}-${accountManagerIndex}`}
                                >
                                  <td>{accountManager.first_name}</td>
                                  <td className="tabel_left">
                                    <div className="gap-6">
                                      <div className="remove">
                                        <a
                                          onClick={() =>
                                            removeManager(
                                              accountManager.id,
                                              manager.service_id
                                            )
                                          }
                                          className="btn btn-sm text-danger fs-5 remove-item-btn"
                                        >
                                          <i className="ti-trash"></i>
                                        </a>
                                      </div>
                                    </div>
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
