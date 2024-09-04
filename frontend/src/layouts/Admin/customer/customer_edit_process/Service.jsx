import React, { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { useDispatch } from "react-redux";

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
  const [getServiceData, setServiceData] = useState([]);
  const [jobTypeData, setJobTypeData] = useState([]);
  const [getCustomerService, setCustomerService] = useState({
    loading: true,
    data: [],
  });

  const [tasksGet, setTasksData] = useState([]);

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

    // Prepare the MatchData array
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

    // Filter out services that are not selected
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
      console.error("Error updating services", error);
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
return
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

  useEffect(() => {
    JobTypeDataAPi(services, 2);
  }, [services]);

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
        console.log("Error fetching job types:", error)
      });
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
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GetAllService.data.length > 0 ? (
                      GetAllService.data.map((item, index) => (
                        <tr key={index}>
                          <th scope="row">
                            <div className="form-check">
                              <input
                                className="form-check-input new_input new-checkbox"
                                type="checkbox"
                                checked={services.includes(item.id)}
                                onChange={(e) => {
                                  handleCheckboxChange(e, item);
                                  setServiceData(item);

                                  if (e.target.checked) {
                                    SetJobtype(true);
                                  }
                                }}
                              />
                            </div>
                          </th>

                          <td className="customer_name">
                            <div className="customer-details d-flex align-items-center">
                              <div>{item.name}</div>
                            </div>
                          </td>

                          <td>
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
                                    <div className="row py-2 align-items-center" key={taskIndex}>
                                      <div className="col-md-5">
                                        <input
                                          type="checkbox"
                                          onChange={(e) =>
                                            setTasksData((pre) => [
                                              ...pre,
                                              task,
                                            ])
                                          }
                                        />{" "}
                                        {task.name}
                                      </div>
                                      <div className="col-lg-7  ps-0">
  <label className="form-label">Budgeted Hours</label>
  <div className="input-group">
    <input
      type="number"
      className="form-control"
      placeholder="Hours"
      name="hours"
      defaultValue=""
    />
    <input
      type="number"
      className="form-control"
      placeholder="Minutes"
      name="minutes"
      min={0}
      max={59}
      defaultValue=""
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
              <Button className="btn btn-info" color="primary" onClick={(e)=>SetJobtype(false)}>
                Submit
              </Button>
            </div>
          </CommanModal>

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
