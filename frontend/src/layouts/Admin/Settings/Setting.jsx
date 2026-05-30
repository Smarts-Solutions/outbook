import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Role,
  StatusType,
  Service,
  PersonRole,
  ClientIndustry,
  Country,
  IncorporationApi,
  customerSourceApi,
  getList,
  InternalApi,
  JobType,
  GETTASKDATA,
  CustomerContactPersonAccess
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import Modal from "../../../Components/ExtraComponents/Modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import sweatalert from "sweetalert2";
import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { GetStaffByRole } from "../../../ReduxStore/Slice/Auth/authSlice";
import {
  JobAction
} from "../../../ReduxStore/Slice/Customer/CustomerSlice";
import { use } from "react";
import Select from "react-select";
import {
  User,
  Phone,
  ListChecks,
  Settings,
  Factory,
  Globe,
  FileText,
  ExternalLink,
  SquareCheck,
  Lock,
  Plus,
  Pencil,
  Save,
  User2,
  MoreVertical,
  Trash,
  HandPlatter,
  BriefcaseBusiness,
  X,
  Clock,
  Timer
} from "lucide-react";

const Setting = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabStatus = useRef("1");
  const role = JSON.parse(localStorage.getItem("role"));
  const [showSettingInsertTab, setShowSettingInsertTab] = useState(true);
  const [showSettingUpdateTab, setShowSettingUpdateTab] = useState(true);
  const [showSettingDeleteTab, setSettingDeleteTab] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState({});
  const [deleteStatus, setDeleteStatus] = useState();
  const [StaffRoleDAta, setStaffRoleData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [allJobsData, setAllJobsData] = useState([]);
  const [deleteServiceModal, setDeleteServiceModal] = useState(false);
  const [deleteServiceInfo, setDeleteServiceInfo] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  const [jobTypeData, setJobTypeData] = useState([]);
  const [selectedJobType, setSelectedJobType] = useState(null);

  const [taskData, setTaskData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [errorsBudgetTimeTask, setErrorsBudgetTimeTask] = useState({});

  console.log("allJobsData -->> ", allJobsData);


  const accessData = useSelector(
    (state) => state && state.AccessSlice && state.AccessSlice.RoleAccess.data,
  );
  const [HourMinut, setHourMinut] = useState({ hours: "00", minutes: "00" });

  useEffect(() => {
    if (
      accessData &&
      accessData.length > 0 &&
      role !== "ADMIN" &&
      role !== "SUPERADMIN"
    ) {
      accessData &&
        accessData.map((item) => {
          if (item.permission_name === "setting") {
            const settingInsert = item.items.find(
              (item) => item.type === "insert",
            );
            setShowSettingInsertTab(
              settingInsert && settingInsert.is_assigned == 1,
            );
            const settingUpdate = item.items.find(
              (item) => item.type === "update",
            );
            setShowSettingUpdateTab(
              settingUpdate && settingUpdate.is_assigned == 1,
            );
            const settingDelete = item.items.find(
              (item) => item.type === "delete",
            );
            setSettingDeleteTab(
              settingDelete && settingDelete.is_assigned == 1,
            );
          }
        });
    }
  }, [accessData]);

  const token = JSON.parse(localStorage.getItem("token"));
  const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
  const [personRoleDataAll, setPersonRoleDataAll] = useState({
    loading: true,
    data: [],
  });
  const [clientIndustryDataAll, setClientIndustryDataAll] = useState({
    loading: true,
    data: [],
  });
  const [countryDataAll, setCountryDataAll] = useState({
    loading: true,
    data: [],
  });
  const [incorporationDataAll, setIncorporationDataAll] = useState([]);
  const [customerSourceDataDataAll, setCustomerSourceDataAll] = useState([]);
  const [InternalAllData, setInternalAllData] = useState([]);
  const [statusTypeDataAll, setStatusTypeDataAll] = useState({
    loading: true,
    data: [],
  });
  const [serviceDataAll, setServiceDataAll] = useState({
    loading: true,
    data: [],
  });
  const [modalData, setModalData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getShowTabId, setShowTabId] = useState("1");
  const [isEdit, setIsEdit] = useState(false);
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);
  const [replaceStatue, setReplaceStatue] = useState(null);
  const [deletePersonRoleStatus, setDeletePersonRoleStatus] = useState(null);
  const [assignedPersonUsers, setAssignedPersonUsers] = useState([]);
  const [replacePersonRole, setReplacePersonRole] = useState(null);
  const [isPersonRoleModalOpen, setIsPersonRoleModalOpen] = useState(false);
  const [personRoleModalData, setPersonRoleModalData] = useState({});
  const [personRoleCheckboxState, setPersonRoleCheckboxState] = useState([]);
  const [personRoleStructure, setPersonRoleStructure] = useState([]);
  const [loadingPersonRolePerms, setLoadingPersonRolePerms] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const [getAccessDataSetting, setAccessDataSetting] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
  });

  const accessDataSetting =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "setting",
    )?.items || [];


  const GetAllJobsName = async (serviceData) => {
    setSelectedService(null);
    setSelectedJobType(null);
    setSelectedTask(null);
    setSelectedTasks([]);

    setDeleteServiceInfo(serviceData.data);
    setLoading(true);
    const req = {
      action: "getJobsDeleteService",
      page: 1,
      limit: 100000,
      search: "",
      service_id: serviceData.id,
    };

    const data = { req, authToken: token };

    await dispatch(JobAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setDeleteServiceModal(true);
          setAllJobsData(response?.data || []);
        } else {
          setDeleteServiceModal(false);
          setAllJobsData([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const handleSelectChangeDeleteService = (selectedOption, rowIndex, type) => {
  //   setAllJobsData((prev) => {
  //     const updated = [...prev];

  //     if (type === "service") {
  //       updated[rowIndex] = {
  //         ...updated[rowIndex],
  //         service_id: selectedOption?.value || null,
  //         selectedService: selectedOption?.serviceData || null
  //       };
  //     }

  //     if (type === "jobType") {
  //       updated[rowIndex] = {
  //         ...updated[rowIndex],
  //         job_type_id: selectedOption?.value || null,
  //         selectedJobType: selectedOption?.jobTypeData || null
  //       };
  //     }

  //     if (type === "task") {
  //       updated[rowIndex] = {
  //         ...updated[rowIndex],
  //         task_id: selectedOption?.map((item) => item.value) || [],
  //         selectedTasks: selectedOption || []
  //       };
  //     }

  //     return updated;
  //   });
  // };



  const handleSelectChangeDeleteService = (selectedOption, rowIndex, type) => {
    setAllJobsData((prev) => {
      const updated = [...prev];
      const row = updated[rowIndex];

      if (type === "service") {
        const serviceId = selectedOption?.value || null;

        // Filter job types based on service
        const filteredJobTypes = row.jobTypes.filter(
          (jt) => jt.service_id === serviceId
        );

        updated[rowIndex] = {
          ...row,
          service_id: serviceId,
          selectedService: selectedOption?.serviceData || null,

          // RESET
          job_type_id: null,
          selectedJobType: null,
          task_id: [],
          selectedTasks: [],

          filteredJobTypes // optional: use in UI
        };
      }

      if (type === "jobType") {
        const jobTypeId = selectedOption?.value || null;

        // Filter tasks based on job type
        const filteredTasks = row.tasks.filter(
          (task) => task.job_type_id === jobTypeId
        );

        updated[rowIndex] = {
          ...row,
          job_type_id: jobTypeId,
          selectedJobType: selectedOption?.jobTypeData || null,

          // RESET TASKS
          task_id: [],
          selectedTasks: [],

          filteredTasks // optional
        };
      }

      if (type === "task") {
        updated[rowIndex] = {
          ...row,
          task_id: selectedOption?.map((item) => item.value) || [],
          selectedTasks: selectedOption || []
        };
      }

      return updated;
    });
  };

  const handleBudgetTimeDeleteService = (e, rowIndex, taskIndex, type) => {
    const { value } = e.target;
    const isValid = /^\d*$/.test(value);
    if (!isValid) return;

    setAllJobsData((prev) => {
      const updated = [...prev];
      const job = updated[rowIndex];
      const tasks = [...job.selectedTasks];
      const task = tasks[taskIndex];

      let [hour, minute] = (task?.budgeted_hour || "0:0").split(":");

      if (type === "hour") {
        hour = value;
      } else if (type === "minute") {
        if (value === "") {
          minute = "";
        } else {
          let numValue = Number(value);
          if (numValue > 59) numValue = 59;
          minute = numValue.toString();
        }
      }

      tasks[taskIndex] = {
        ...task,
        budgeted_hour: `${hour}:${minute}`,
      };

      updated[rowIndex] = {
        ...job,
        selectedTasks: tasks,
      };

      return updated;
    });
  };



  const getJobTypeSelectedService = async (serviceData) => {
    const req = { action: "get", service_id: serviceData.id };
    const data = { req: req, authToken: token };
    await dispatch(JobType(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setJobTypeData(response.data);
        } else {
          setJobTypeData([]);
        }
      })
      .catch((error) => {
        setJobTypeData([]);
        return;
      });
  }

  const getTaskSelectedJobType = async (jobTypeData) => {
    const req = { service_id: selectedService?.id, job_type_id: jobTypeData?.id };

    const data = { req: req, authToken: token };
    await dispatch(GETTASKDATA(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setTaskData(response.data);
        } else {
          setTaskData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };


  const handleBudgetTime = (e, index, type) => {
    const { value } = e.target;
    const isValid = /^\d*$/.test(value);
    if (!isValid) {
      return;
    }

    setSelectedTasks((prev) => {
      const updated = [...prev];
      const budgetedValue = updated[index]?.budgeted_hour || "0:0";
      let [hour, minute] = budgetedValue?.split(":");

      if (type === "hour") {
        hour = value;
      } else if (type === "minute") {
        if (value === "") {
          minute = "";
        } else {
          let numValue = Number(value);
          if (numValue > 59) numValue = 59;
          minute = numValue.toString();
        }
      }

      const newValue = `${hour}:${minute}`;

      updated[index] = {
        ...updated[index],
        budgeted_hour: newValue,
      };

      // ✅ Validation logic
      const h = Number(hour) || 0;
      const m = Number(minute) || 0;

      setErrorsBudgetTimeTask((prevErrors) => {
        const newErrors = { ...prevErrors };

        if (h === 0 && m === 0) {
          newErrors[updated[index].id] =
            "Please enter valid hours or minutes.";
        } else {
          delete newErrors[updated[index].id];
        }

        return newErrors;
      });

      return updated;
    });
  };

  const handleSubmitDeleteService = async () => {
    if (!allJobsData || allJobsData.length === 0) {
      sweatalert.fire({
        icon: "error",
        title: "No Jobs Found",
        text: "There are no jobs to update.",
        timer: 2000,
      });
      return;
    }

    // Validation
    for (let i = 0; i < allJobsData.length; i++) {
      const job = allJobsData[i];

      if (!job.service_id) {
        sweatalert.fire({
          icon: "error",
          title: "Missing Service",
          text: `Please select a Service for Job: ${job.job_code_id}`,
          timer: 2000,
        });
        return;
      }

      if (!job.job_type_id) {
        sweatalert.fire({
          icon: "error",
          title: "Missing Job Type",
          text: `Please select a Job Type for Job: ${job.job_code_id}`,
          timer: 2000,
        });
        return;
      }

      if (!job.selectedTasks || job.selectedTasks.length === 0) {
        sweatalert.fire({
          icon: "error",
          title: "Missing Tasks",
          text: `Please select at least one Task for Job: ${job.job_code_id}`,
          timer: 2000,
        });
        return;
      }

      // Validate budget hours for each task in the job
      for (let j = 0; j < job.selectedTasks.length; j++) {
        const task = job.selectedTasks[j];
        const budgeted_hour = task.budgeted_hour || "0:0";
        const [h, m] = budgeted_hour.split(":").map(val => parseInt(val) || 0);

        if (h === 0 && m === 0) {
          sweatalert.fire({
            icon: "error",
            title: "Invalid Budget Hour",
            text: `Please enter budget hours for task "${task.label}" in Job: ${job.job_code_id}. It is mandatory.`,
            timer: 3000,
          });
          return;
        }
      }
    }

    const payload = {
      delete_service_id: deleteServiceInfo?.id,
      jobs_data: allJobsData.map((job) => ({
        job_id: job.job_id,
        client_id: job.client_id,
        service_id: job.service_id,
        job_type_id: job.job_type_id,
        task_ids: job.selectedTasks.map((task) => task.value),
        tasks_budget_hours: job.selectedTasks.map((task) => ({
          task_id: task.value,
          budgeted_hour: task.budgeted_hour || "0:0"
        }))
      }))
    };

    //console.log("Payload", payload)

    // setLoading(true);
    const req = { action: "deletExistingJob", data: payload };
    await dispatch(Service({ req: req, authToken: token }))
      .unwrap()
      .then(async (response) => {
        setLoading(false);

        if (response.status) {
          setDeleteServiceModal(false);
          sweatalert.fire({
            title: response.message,
            icon: "success",
            timer: 2000,
          });
          setTimeout(() => {
            serviceData({ action: "getAll" });
          }, 2000);
        } else {
          sweatalert.fire({
            title: response.message,
            icon: "error",
            timer: 2000,
          });
        }

      })
      .catch((error) => {
        return;
      });
  };



  useEffect(() => {
    if (accessDataSetting.length === 0) return;
    const updatedAccess = { insert: 0, update: 0, delete: 0, view: 0 };
    accessDataSetting.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      if (item.type === "update") updatedAccess.update = item.is_assigned;
      if (item.type === "delete") updatedAccess.delete = item.is_assigned;
      if (item.type === "view") updatedAccess.view = item.is_assigned;
    });
    setAccessDataSetting(updatedAccess);
  }, []);

  useEffect(() => {
    const retrievedData = sessionStorage.getItem("settingTab");
    if (retrievedData) {
      setShowTabId(retrievedData);
      tabStatus.current = retrievedData;
    }
  }, []);

  const getCheckListData = async () => {
    const req = { action: "get", customer_id: 0 };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          if (response.data.length > 0) {
            let Array = [
              { id: 1, name: "Sole Trader" },
              { id: 2, name: "Company" },
              { id: 3, name: "Partnership" },
              { id: 4, name: "Individual" },
              { id: 5, name: "Charity Incorporated Organisation" },
              { id: 6, name: "Unincorporated Association" },
              { id: 7, name: "Trust" },
            ];
            let data = response.data.map((item) => {
              return {
                ...item,
                check_list_name: item.check_list_name,
                service_name: item.service_name,
                job_type_type: item.job_type_type,
                // client_type_type: item.client_type_type,
                status: item.status,
                checklists_id: item.checklists_id,
                client_type_type: item.checklists_client_type_id
                  .split(",")
                  .map((id) => {
                    let matchedItem = Array.find(
                      (item) => item.id === Number(id),
                    );
                    return matchedItem ? matchedItem.name : null;
                  })
                  .filter((name) => name !== null)
                  .join(", "),
              };
            });

            setCheckList(data);
            setCheckList1(data);
          } else {
            setCheckList([]);
          }
        } else {
          setCheckList([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const roleData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(Role(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setRoleDataAll({ loading: false, data: response.data });

          } else {
            setRoleDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              roleData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const statusTypeData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(StatusType(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setStatusTypeDataAll({ loading: false, data: response.data });
          } else {
            setStatusTypeDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              statusTypeData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const serviceData = async (req) => {

    // if (req.action == "delete") {
    //   console.log("serviceData called with req:", req);
    //   if (req.data.job_service_exists == true) {
    //     await GetAllJobsName(req);
    //     return; 
    //   }
    // }

    await dispatch(Service({ req: req, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setServiceDataAll({ loading: false, data: response.data });
          } else {
            setServiceDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              serviceData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const PersonRoleData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(PersonRole(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setPersonRoleDataAll({ loading: false, data: response.data });
          } else {
            setPersonRoleDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              PersonRoleData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const ClientIndustryData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(ClientIndustry(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setClientIndustryDataAll({ loading: false, data: response.data });
          } else {
            setClientIndustryDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              ClientIndustryData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const CountryData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(Country(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setCountryDataAll({ loading: false, data: response.data });
          } else {
            setCountryDataAll({ loading: false, data: [] });
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              CountryData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const incorporationData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(IncorporationApi(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setIncorporationDataAll(response.data);
          } else {
            setIncorporationDataAll([]);
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              incorporationData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const customerSourceData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(customerSourceApi(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setCustomerSourceDataAll(response.data);
          } else {
            setCustomerSourceDataAll([]);
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              customerSourceData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const InternalData = async (req) => {
    const data = { req: req, authToken: token };
    await dispatch(InternalApi(data))
      .unwrap()
      .then(async (response) => {
        if (req.action == "getAll") {
          if (response.status) {
            setInternalAllData(response.data);
          } else {
            setInternalAllData([]);
          }
        } else {
          if (response.status) {
            sweatalert.fire({
              title: response.message,
              icon: "success",
              timer: 2000,
            });
            setTimeout(() => {
              InternalData({ action: "getAll" });
            }, 2000);
          } else {
            sweatalert.fire({
              title: response.message,
              icon: "error",
              timer: 2000,
            });
          }
        }
      })
      .catch((error) => {
        return;
      });
  };

  const getTaskData = async (row) => {
    const req = { action: "getById", checklist_id: row.checklists_id };
    const data = { req: req, authToken: token };
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setViewData(response.data);
        } else {
          setViewData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    fetchApiData(tabStatus.current);
  }, [tabStatus.current]);

  const handleTabChange = (newStatus) => {
    setShowTabId(newStatus);
    tabStatus.current = newStatus;
    fetchApiData(newStatus);
  };

  const fetchApiData = (status) => {
    const req = {
      action: "getAll",
    };
    switch (status) {
      case "1":
        roleData(req);
        break;
      case "2":
        PersonRoleData(req);
        break;
      case "3":
        statusTypeData(req);
        break;
      case "4":
        serviceData(req);
        break;
      case "5":
        ClientIndustryData(req);
        break;
      case "6":
        CountryData(req);
        break;
      case "7":
        incorporationData(req);
        break;
      case "8":
        customerSourceData(req);
      case "9":
        getCheckListData();
        break;
      case "10":
        InternalData(req);
        break;
      default:
        break;
    }
  };

  const columnRoles = [
    {
      name: "Role Name",
      selector: (row) => row.role_name,
      sortable: true,
      width: "35%",
    },
    {
      name: "Hours",
      selector: (row) => row.hourminute?.split(":")[0],
      sortable: true,
      width: "20%",
    },
    {
      name: "Minutes",
      selector: (row) => row.hourminute?.split(":")[1],
      sortable: true,
      width: "20%",
    },

    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "15%",
    },

    ...(showSettingUpdateTab || showSettingDeleteTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <div className="d-flex justify-content-start w-100">
              {showSettingUpdateTab && (
                <button
                  className="edit-icon"
                  onClick={() => {
                    handleEdit(row, "1");
                    setHourMinut({
                      hours: row.hourminute?.split(":")[0],
                      minutes: row.hourminute?.split(":")[1],
                    });
                  }}
                >
                  {" "}
                  <i className="ti-pencil" />
                </button>
              )}

              {row?.is_disable == 0 && (
                <button
                  className="delete-icon"
                  onClick={() => setDeleteStatus(row)}
                >
                  <i className="ti-trash text-danger" />
                </button>
              )}
            </div>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "10%",
        },
      ]
      : []),
  ];

  const columnStatusType = [
    { name: "Status Name", selector: (row) => row.type, sortable: true },
    {
      name: "Status ",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "100px",
    },
    ...(showSettingUpdateTab || showSettingDeleteTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "3")}
                      >
                        {" "}
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon dropdown-item w-auto mb-2"
                        onClick={() => handleDelete(row, "3")}
                      >
                        {" "}
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {" "}
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "3")}
                  >
                    {" "}
                    <i className="ti-pencil" />
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "3")}
                  >
                    {" "}
                    <i className="ti-trash text-danger" />
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "20%",
        },
      ]
      : []),
  ];

  const columnService = [
    {
      name: "Service Name ",
      selector: (row) => row.name,
      sortable: true,
      width: "50%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },

    ...(showSettingUpdateTab || showSettingDeleteTab || showSettingInsertTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {row.is_disable == 0 && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "4")}
                      >
                        {" "}
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {row?.is_disable == 0 && row?.job_service_exists === null && (
                      <button
                        className="delete-icon dropdown-item w-auto mb-2"
                        onClick={() => handleDelete(row, "4")}
                      >
                        {" "}
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                    {showSettingInsertTab && (
                      <button
                        className="btn btn-sm btn-info text-white dropdown-item"
                        onClick={(e) => handleJobType(row)}
                      >
                        <Plus size={16} /> Add Job Type
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {row.is_disable == 0 && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "4")}
                  >
                    {" "}
                    <i className="ti-pencil" />
                  </button>
                )}
                {/* && row.job_service_exists === null */}
                {row?.is_disable == 0 && row?.job_service_exists === null && (

                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "4")}
                  >
                    {" "}
                    <i className="ti-trash text-danger" />
                  </button>
                )}
                {showSettingInsertTab && (
                  <button
                    className="btn btn-sm btn-info text-white ms-2"
                    onClick={(e) => handleJobType(row)}
                  >
                    <Plus size={16} /> Add Job Type
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "30%",
        },
      ]
      : []),
  ];

  const columnPersonRole = [
    { name: "Role Name", selector: (row) => row.name, sortable: true },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "100px",
    },
    ...(showSettingUpdateTab || showSettingDeleteTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item mb-2"
                        onClick={() => handleEdit(row, "2")}
                      >
                        {" "}
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon dropdown-item  w-auto mb-2"
                        onClick={() => handleDelete(row, "2")}
                      >
                        {" "}
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon  dropdown-item"
                    onClick={() => handleEdit(row, "2")}
                  >
                    {" "}
                    <i className="ti-pencil" />
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon dropdown-item"
                    onClick={() => handleDelete(row, "2")}
                  >
                    {" "}
                    <i className="ti-trash text-danger" />
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "20%",
        },
      ]
      : []),
  ];

  const columnClientIndustry = [
    {
      name: "Client Industry Name",
      selector: (row) => row.business_type,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "100px",
    },
    ...(showSettingUpdateTab || showSettingDeleteTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "5")}
                      >
                        {" "}
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon dropdown-item w-auto mb-2"
                        onClick={() => handleDelete(row, "5")}
                      >
                        {" "}
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "5")}
                  >
                    {" "}
                    <i className="ti-pencil" />
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "5")}
                  >
                    {" "}
                    <i className="ti-trash text-danger" />
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "20%",
        },
      ]
      : []),
  ];

  const columnCountry = [
    { name: "Country Code", selector: (row) => row.code, sortable: true },
    { name: "Country Name", selector: (row) => row.name, sortable: true },
    { name: "Currency", selector: (row) => row.currency, sortable: true },

    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "100px",
    },
    ...(showSettingUpdateTab || showSettingDeleteTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "6")}
                      >
                        {" "}
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon dropdown-item w-auto mb-2"
                        onClick={() => handleDelete(row, "6")}
                      >
                        {" "}
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "6")}
                  >
                    {" "}
                    <i className="ti-pencil" />
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "6")}
                  >
                    {" "}
                    <i className="ti-trash text-danger" />
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "20%",
        },
      ]
      : []),
  ];

  const columnincorporation = [
    {
      name: "Incorporation Name",
      selector: (row) => row.name,
      sortable: true,
      width: "50%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },

    {
      name: "Actions",
      cell: (row) => (
        <>
          <div className="dropdown d-lg-none setting-drop-down">
            <button
              className="btn"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <MoreVertical size={18} />
            </button>
            <div
              className="dropdown-menu custom-dropdown"
              aria-labelledby="dropdownMenuButton"
            >
              <div className="px-2">
                <div>
                  {showSettingUpdateTab && (
                    <button
                      className="edit-icon dropdown-item w-auto mb-2"
                      onClick={() => handleEdit(row, "7")}
                    >
                      <i className="ti-pencil" />
                    </button>
                  )}
                  {showSettingDeleteTab && (
                    <button
                      className="delete-icon dropdown-item w-auto "
                      onClick={() => handleDelete(row, "7")}
                    >
                      <i className="ti-trash text-danger" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="d-lg-flex d-none">
            {showSettingUpdateTab && (
              <button
                className="edit-icon "
                onClick={() => handleEdit(row, "7")}
              >
                <i className="ti-pencil" />
              </button>
            )}
            {showSettingDeleteTab && (
              <button
                className="delete-icon"
                onClick={() => handleDelete(row, "7")}
              >
                <i className="ti-trash text-danger" />
              </button>
            )}
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "20%",
    },
  ];

  const columnCustomerSource = [
    {
      name: "Source Name",
      selector: (row) => row.name,
      sortable: true,
      width: "40%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "20%",
    },

    ...(showSettingUpdateTab || showSettingDeleteTab || showSettingInsertTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "8")}
                      >
                        <i className="ti-pencil" />
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon btn-sm dropdown-item w-auto  mb-2"
                        onClick={() => handleDelete(row, "8")}
                      >
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                    {showSettingInsertTab && (
                      <button
                        className="btn btn-info btn-sm text-white ms-1 dropdown-item w-auto "
                        onClick={(e) => handleSubSource(row)}
                      >
                        <Plus size={16} />
                        Add Sub Source Type
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "8")}
                  >
                    <i className="ti-pencil" />
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "8")}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                )}
                {showSettingInsertTab && (
                  <button
                    className="btn btn-info btn-sm text-white ms-1"
                    onClick={(e) => handleSubSource(row)}
                  >
                    <Plus size={16} />
                    Add Sub Source Type
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "40%",
        },
      ]
      : []),
  ];

  const CheckListColumns = [
    {
      name: "Checklist Name",
      cell: (row) => (
        <div title={row.check_list_name}>{row.check_list_name}</div>
      ),
      selector: (row) => row.check_list_name,
      sortable: true,
      width: "12%",
    },
    {
      cell: (row) => <div title={row.work_flow_type == "3" ? "Processing Type" : "Reviewing Type"}>{row.work_flow_type == "3" ? "Processing Type" : "Reviewing Type"}</div>,
      name: "Work Flow Type",
      selector: (row) => row.work_flow_type,
      sortable: true,
      width: "12%",
    },
    {
      cell: (row) => <div title={row.customer_name || "All"}>{row.customer_name || "All"}</div>,
      name: "Customer Name",
      selector: (row) => row.customer_name || "All",
      sortable: true,
      width: "13%",
    },
    {
      cell: (row) => <div title={row.service_name || "All"}>{row.service_name || "All"}</div>,
      name: "Service Type",
      selector: (row) => row.service_name || "All",
      sortable: true,
      width: "13%",
    },
    {
      cell: (row) => <div title={row.job_type_type || "All"}>{row.job_type_type || "All"}</div>,
      name: "Job Type",
      selector: (row) => row.job_type_type || "All",
      sortable: true,
      width: "13%",
    },
    {
      cell: (row) => (
        <div title={row.client_type_type}>{row.client_type_type}</div>
      ),
      name: "Client Type",
      selector: (row) => row.client_type_type,
      sortable: true,
      width: "12%",
    },


    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      selector: (row) => row.status,
      sortable: true,
      width: "10%",
    },

    {
      name: "Actions",
      cell: (row) => (
        <>
          <div className="dropdown d-lg-none setting-drop-down">
            <button
              className="btn"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <MoreVertical size={18} />
            </button>
            <div
              className="dropdown-menu custom-dropdown"
              aria-labelledby="dropdownMenuButton"
            >
              <div className="px-2">
                {getAccessDataSetting.update === 1 || role === "SUPERADMIN" ? (
                  <button
                    className="edit-icon dropdown-item w-auto mb-2"
                    onClick={() =>
                      navigate("/admin/edit/setting/checklist", {
                        state: {
                          id: row.id,
                          checklist_id: row.checklists_id,
                          settingTab: tabStatus.current,
                        },
                      })
                    }
                  >
                    <i className="ti-pencil" />
                  </button>
                ) : null}
                {getAccessDataSetting.delete === 1 || role === "SUPERADMIN" ? (
                  <button
                    className="delete-icon dropdown-item w-auto mb-2"
                    onClick={() => ChecklistDelete(row)}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="d-lg-flex d-none">
            {getAccessDataSetting.update === 1 || role === "SUPERADMIN" ? (
              <button
                className="edit-icon"
                onClick={() =>
                  navigate("/admin/edit/setting/checklist", {
                    state: {
                      id: row.id,
                      checklist_id: row.checklists_id,
                      settingTab: tabStatus.current,
                    },
                  })
                }
              >
                <i className="ti-pencil" />
              </button>
            ) : null}
            {getAccessDataSetting.delete === 1 || role === "SUPERADMIN" ? (
              <button
                className="delete-icon"
                onClick={() => ChecklistDelete(row)}
              >
                <i className="ti-trash text-danger" />
              </button>
            ) : null}
          </div>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "15%",
    },
  ];

  const InternalColumns = [
    {
      name: "Internal Job/Project Name",
      cell: (row) => <div> {row.name}</div>,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      selector: (row) => row.status,
      sortable: true,
      width: "150px",
    },
    ...(showSettingUpdateTab || showSettingDeleteTab || showSettingInsertTab
      ? [
        {
          name: "Actions",
          cell: (row) => (
            <>
              <div className="dropdown d-lg-none setting-drop-down">
                <button
                  className="btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <MoreVertical size={18} />
                </button>
                <div
                  className="dropdown-menu custom-dropdown"
                  aria-labelledby="dropdownMenuButton"
                >
                  <div className="px-2">
                    {showSettingUpdateTab && (
                      <button
                        className="edit-icon dropdown-item w-auto mb-2"
                        onClick={() => handleEdit(row, "8")}
                      >
                        {" "}
                        <i className="ti-pencil" />{" "}
                      </button>
                    )}
                    {showSettingDeleteTab && (
                      <button
                        className="delete-icon dropdown-item w-auto mb-2"
                        onClick={() => handleDelete(row, "8")}
                      >
                        <i className="ti-trash text-danger" />
                      </button>
                    )}
                    {showSettingInsertTab && (
                      <button
                        className="btn btn-info btn-sm text-white dropdown-item"
                        onClick={(e) => handleTaskAdd(row)}
                      >
                        <Plus size={16} />
                        Add Internal Task
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                {showSettingUpdateTab && (
                  <button
                    className="edit-icon"
                    onClick={() => handleEdit(row, "10")}
                  >
                    {" "}
                    <i className="ti-pencil" />{" "}
                  </button>
                )}
                {showSettingDeleteTab && (
                  <button
                    className="delete-icon"
                    onClick={() => handleDelete(row, "10")}
                  >
                    <i className="ti-trash text-danger" />
                  </button>
                )}
                {showSettingInsertTab && (
                  <button
                    className="btn btn-info btn-sm text-white ms-1"
                    onClick={(e) => handleTaskAdd(row)}
                  >
                    <Plus size={16} />
                    Add Internal Task
                  </button>
                )}
              </div>
            </>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          width: "30%",
        },
      ]
      : []),

    ,
  ];

  const ChecklistDelete = async (row) => {
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "You want to delete this checklist!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const req = { action: "delete", checklist_id: row.checklists_id };
          const data = { req: req, authToken: token };
          await dispatch(getList(data))
            .unwrap()
            .then(async (response) => {
              if (response.status) {
                sweatalert.fire({
                  title: "Deleted",
                  icon: "success",
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1500,
                });
                getCheckListData();
              } else {
                sweatalert.fire({
                  title: "Failed",
                  icon: "error",
                  showCancelButton: false,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
              return;
            });
        }
      });
  };

  const handleJobType = (row) => {
    navigate("/admin/add/jobtype", {
      state: { Id: row.id, settingTab: tabStatus.current },
    });
  };

  const handleSubSource = (row) => {
    navigate("/admin/add/subSource", {
      state: { Id: row.id, settingTab: tabStatus.current },
    });
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    if (name === "hours" || name === "minutes") {
      if (name == "minutes" && value > 59) {
        e.target.value = 59;
      }

      setHourMinut((prev) => ({ ...prev, [name]: e.target.value }));
    }

    setModalData((prevModalData) => ({
      ...prevModalData,
      fields: prevModalData.fields.map((field) => {
        // Update hourminute value based on hours and minutes
        if (field.name === "hourminute") {
          const updatedHours =
            name === "hours" ? e.target.value : HourMinut.hours || "00";
          const updatedMinutes =
            name === "minutes" ? e.target.value : HourMinut.minutes || "00";

          return {
            ...field,
            value: `${updatedHours}:${updatedMinutes}`,
          };
        }

        // Update the specific field being changed
        return field.name === name ? { ...field, value: value } : field;
      }),
    }));


  };

  const handleTaskAdd = (row) => {
    navigate("/admin/subinternal", {
      state: { Id: row.id, settingTab: tabStatus.current },
    });
  };

  const handleAdd = (e, tabStatus) => {
    if (tabStatus === "1") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "role_name",
            label: "Role Name",
            placeholder: "Role Name",
          },
          {
            type: "hourminute1",
            name: "hourminute",
            label: "Weekly Timesheet Hours",
            placeholder: "Hour",
          },
        ],
        title: "Staff Role",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "2") {
      setIsEdit(false);
      setPersonRoleModalData({ name: "", status: "1" });
      setPersonRoleCheckboxState([]);
      setPersonRoleStructure([]);
      setLoadingPersonRolePerms(true);
      setIsPersonRoleModalOpen(true);
      setIsAccordionOpen(false);

      const req = { action: "get", role_id: 0 };
      const apiData = { req, authToken: token };

      dispatch(CustomerContactPersonAccess(apiData))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const filteredData = response.data.filter(item => item.permission_name !== "customer");
            setPersonRoleStructure(filteredData);
            
            const initialCheckboxes = [];
            filteredData.forEach((item) => {
              item.items.forEach((perm) => {
                if (perm.is_assigned === 1) {
                  initialCheckboxes.push({
                    permission_id: perm.id,
                    role_id: "",
                    is_assigned: true,
                    permission_name: item.permission_name,
                  });
                }
              });
            });
            setPersonRoleCheckboxState(initialCheckboxes);
          }
        })
        .catch((error) => {
          console.error("Error loading permissions:", error);
        })
        .finally(() => {
          setLoadingPersonRolePerms(false);
        });
      return;
    } else if (tabStatus === "3") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "type",
            label: "Status Type",
            placeholder: "Enter Status Type",
          },
        ],
        title: "Status Type",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "4") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Service Name",
            placeholder: "Service Name",
          },
        ],
        title: "Service",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "5") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "business_type",
            label: "Business Type",
            placeholder: "Enter Business Type",
          },
        ],
        title: " Business Type",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "6") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Country Name",
            placeholder: "Enter Country Name",
          },
          {
            type: "text",
            name: "code",
            label: "Country Code",
            placeholder: "Enter Country Code",
          },
          {
            type: "text",
            name: "currency",
            label: "Currency",
            placeholder: "Enter Currency",
          },
        ],
        title: " Country",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "7") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "Incorporation",
            label: "Incorporation",
            placeholder: "Enter Incorporation",
          },
        ],
        title: " Incorporation",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "8") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Source Name",
            placeholder: "Enter Source Name",
          },
        ],
        title: "Source",
        tabStatus: tabStatus,
      });
    } else if (tabStatus === "10") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Job/Project Name",
            placeholder: "Enter Job/Project Name",
          },
          ,
        ],
        title: "Job/Project",
        tabStatus: tabStatus,
      });
    }
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (data, tabStatus) => {
    if (tabStatus === "1") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "role_name",
            label: "Role Name",
            placeholder: "Role Name",
            value: data.role_name,
          },
          {
            type: "hourminute1",
            name: "hourminute",
            label: "Weekly Timesheet Hours",
            placeholder: "Hour",
            value: data.hourminute,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Staff Role",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "2") {
      setPersonRoleModalData(data);
      setPersonRoleCheckboxState([]);
      setPersonRoleStructure([]);
      setLoadingPersonRolePerms(true);
      setIsPersonRoleModalOpen(true);
      setIsAccordionOpen(false);

      const req = { action: "get", role_id: data.id };
      const apiData = { req, authToken: token };

      dispatch(CustomerContactPersonAccess(apiData))
        .unwrap()
        .then((response) => {
          if (response.status) {
            const filteredData = response.data.filter(item => item.permission_name !== "customer");
            setPersonRoleStructure(filteredData);
            
            const initialCheckboxes = [];
            filteredData.forEach((item) => {
              item.items.forEach((perm) => {
                if (perm.is_assigned === 1) {
                  initialCheckboxes.push({
                    permission_id: perm.id,
                    role_id: data.id,
                    is_assigned: true,
                    permission_name: item.permission_name,
                  });
                }
              });
            });
            setPersonRoleCheckboxState(initialCheckboxes);
          }
        })
        .catch((error) => {
          console.error("Error loading permissions:", error);
        })
        .finally(() => {
          setLoadingPersonRolePerms(false);
        });
      return;
    } else if (tabStatus === "3") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "type",
            label: "Status Name",
            placeholder: "Status Type",
            value: data.type,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Status Type",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "4") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Service Name",
            placeholder: "Service Name",
            value: data.name,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Service",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "5") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "business_type",
            label: "Business Type",
            placeholder: "Enter Business Type",
            value: data.business_type,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Enter Business Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: " Business Type",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "6") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Country",
            placeholder: "Enter Country",
            value: data.name,
          },
          {
            type: "text",
            name: "code",
            label: "Country Code",
            placeholder: "Enter Country Code",
            value: data.code,
          },
          {
            type: "text",
            name: "currency",
            label: "Currency",
            placeholder: "Enter Currency",
            value: data.currency,
          },
          // {
          //   type: "select",
          //   name: "status",
          //   label: "Currency Status",
          //   placeholder: "Enter Currency Status",
          //   options: [
          //     { label: "Active", value: "1" },
          //     { label: "Inactive", value: "0" },
          //   ],
          //   value: data.status === "1" ? "1" : "0",
          // },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Country Details",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "7") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Incorporation",
            placeholder: "Enter Incorporation Name",
            value: data.name,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Incorporation",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "8") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Source Name",
            placeholder: "Enter Source Name",
            value: data.name,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Customer Source",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "10") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Job Name",
            placeholder: "Enter job Name",
            value: data.name,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            placeholder: "Select Status",
            value: data.status === "1" ? "1" : "0",
            options: [
              { label: "Active", value: "1" },
              { label: "Inactive", value: "0" },
            ],
          },
        ],
        title: "Job",
        tabStatus: tabStatus,
        id: data.id,
      });
    }

    // setModalData(data);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    let err = [];
    modalData.fields.map((field) => {
      if (field?.value?.trim() == "" || field?.value == undefined) {
        err.push("Please enter " + field.label);
      }
    });

    if (err.length > 0) {
      sweatalert.fire({
        title: err[0],
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    const req = { action: isEdit ? "update" : "add" };
    if (isEdit) {
      req.id = modalData.id;
    }
    modalData.fields.map((field) => {
      req[field.name] = field.value;
      if (field.name == "status") {
        req.status = field.value || "1";
      }
    });

    switch (modalData.tabStatus) {
      case "1":
        roleData(req);
        break;
      case "2":
        PersonRoleData(req);
        break;
      case "3":
        statusTypeData(req);
        break;
      case "4":
        serviceData(req);
        break;
      case "5":
        ClientIndustryData(req);
        break;
      case "6":
        CountryData(req);
        break;
      case "7":
        incorporationData(req);
        break;
      case "8":
        customerSourceData(req);
        break;
      case "10":
        InternalData(req);
        break;
      default:
        break;
    }
    setModalData({});
    setIsModalOpen(false);
  };

  const handleSavePersonRoleWithPermissions = async () => {
    if (!personRoleModalData.name || personRoleModalData.name.trim() === "") {
      sweatalert.fire({
        title: "Role Name is required",
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Update the role name & status
      const actionType = personRoleModalData.id ? "update" : "add";
      const roleUpdateRes = await dispatch(
        PersonRole({
          req: {
            action: actionType,
            id: personRoleModalData.id,
            name: personRoleModalData.name,
            status: personRoleModalData.status || "1",
          },
          authToken: token,
        })
      ).unwrap();

      if (!roleUpdateRes.status) {
        sweatalert.fire({
          title: roleUpdateRes.message || "Failed to save role details",
          icon: "error",
          timer: 2000,
        });
        return;
      }

      const roleId = actionType === "add" ? roleUpdateRes.userId : personRoleModalData.id;

      // Ensure all permissions have the correct role_id
      const updatedPermissions = personRoleCheckboxState.map(p => ({
         ...p,
         role_id: roleId
      }));

      // 2. Update the permissions
      const permsUpdateRes = await dispatch(
        CustomerContactPersonAccess({
          req: {
            action: "update",
            permissions: updatedPermissions,
          },
          authToken: token,
        })
      ).unwrap();

      if (permsUpdateRes.status) {
        sweatalert.fire({
          title: "Success!",
          text: "Role and permissions updated successfully.",
          icon: "success",
          timer: 2000,
        });
        setIsPersonRoleModalOpen(false);
        setPersonRoleModalData({});
        setPersonRoleCheckboxState([]);
        setPersonRoleStructure([]);
        // Refresh the list
        PersonRoleData({ action: "getAll" });
      } else {
        sweatalert.fire({
          title: permsUpdateRes.message || "Failed to update permissions",
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error updating role and permissions:", error);
      sweatalert.fire({
        title: "An error occurred",
        text: "Could not save role and permissions.",
        icon: "error",
        timer: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (data, tabStatus) => {
    const itemName =
      tabStatus == "1"
        ? data.role_name
        : tabStatus == "2"
          ? data.type
          : data.name;

    sweatalert
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const req = {
            action: "delete",
            id: data.id
          };
          switch (tabStatus) {
            case "1":
              roleData(req);
              break;
            case "2":
              // First check if role is assigned to any user
              dispatch(PersonRole({ req: { action: "checkAssignment", id: data.id }, authToken: token }))
                .unwrap()
                .then((res) => {
                  if (res.status && res.data.length > 0) {
                    // It is assigned, open modal
                    setDeletePersonRoleStatus(data);
                    setAssignedPersonUsers(res.data);
                  } else {
                    // Not assigned, proceed with direct delete
                    PersonRoleData(req);
                  }
                });
              break;
            case "3":
              statusTypeData(req);
              break;
            case "4":
              req.data = data;
              serviceData(req);
              break;
            case "5":
              ClientIndustryData(req);
              break;
            case "6":
              CountryData(req);
              break;
            case "7":
              incorporationData(req);
              break;
            case "8":
              customerSourceData(req);
              break;
            case "10":
              InternalData(req);
              break;

            default:
              break;
          }
        }
      });
  };

  const HandleAddCheckList = () => {
    navigate("/admin/setting/checklist", {
      state: { settingTab: tabStatus.current },
    });
  };

  const tabsArr = [
    { id: "1", label: "Staff Role", icon: <User size={16} className="me-1" /> },

    {
      id: "2",
      label: "Customer Contact Person Role",
      icon: <Phone size={16} className="me-1" />,
    },

    {
      id: "3",
      label: "Status Type",
      icon: <ListChecks size={16} className="me-1" />,
    },

    {
      id: "4",
      label: "Services",
      icon: <Settings size={16} className="me-1" />,
    },

    {
      id: "5",
      label: "Client Industry",
      icon: <Factory size={16} className="me-1" />,
    },

    { id: "6", label: "Country", icon: <Globe size={16} className="me-1" /> },

    {
      id: "7",
      label: "Incorporation",
      icon: <FileText size={16} className="me-1" />,
    },

    {
      id: "8",
      label: "Source",
      icon: <ExternalLink size={16} className="me-1" />,
    },

    {
      id: "9",
      label: "Checklist",
      icon: <SquareCheck size={16} className="me-1" />,
    },

    {
      id: "10",
      label: "Internal Job/Project",
      icon: <Lock size={16} className="me-1" />,
    },
  ];

  useEffect(() => {
    GetStaffroleWise();
  }, [deleteStatus]);

  const GetStaffroleWise = async () => {
    try {
      const req = { action: "get", role_id: deleteStatus?.id };
      const data = { req: req, authToken: token };
      const res = await dispatch(GetStaffByRole(data)).unwrap();

      if (res.status) {
        setStaffRoleData(res.data.data);
      } else {
        setStaffRoleData([]);
      }
    } catch (error) {

    }
  };

  const roledeleteUpdatestaff = async () => {
    try {
      let data = {
        req: {
          action: "delete",
          id: deleteStatus?.id,
          replace_id: replaceStatue,
        },

        authToken: token,
      };
      const response = await dispatch(GetStaffByRole(data)).unwrap();
      if (response.status) {
        sweatalert.fire({
          title: response.message,
          // text: "Staff Role Deleted Successfully",
          icon: "success",
          timer: 2000,
        });
        GetStaffroleWise();
        setDeleteStatus("");
        setReplaceStatue("");
        setStaffRoleData([]);
        setTimeout(() => {
          roleData({ action: "getAll" });
        }, 2000);
      } else {
        sweatalert.fire({
          title: response.message,

          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) { }
  };

  const roleOptions = roleDataAll?.data
    ?.filter(
      (staff) =>
        staff.id !== deleteStatus?.id &&
        staff.role !== "ADMIN" &&
        staff.role !== "SUPERADMIN",
    )
    ?.sort((a, b) => a.role_name.localeCompare(b.role_name))
    ?.map((staff) => ({
      value: staff.id,
      label: staff.role_name,
    }));

  const handlePersonRoleReassignDelete = async () => {
    if (!replacePersonRole) {
      sweatalert.fire({
        title: "Please select a replacement role",
        icon: "warning",
        timer: 2000,
      });
      return;
    }

    try {
      const req = {
        action: "reassignAndDelete",
        id: deletePersonRoleStatus.id,
        replace_id: replacePersonRole,
        ip: "127.0.0.1",
        StaffUserId: JSON.parse(localStorage.getItem("userId"))
      };
      const data = { req: req, authToken: token };
      const res = await dispatch(PersonRole(data)).unwrap();

      if (res.status) {
        sweatalert.fire({
          title: res.message,
          icon: "success",
          timer: 2000,
        });
        setDeletePersonRoleStatus(null);
        setAssignedPersonUsers([]);
        setReplacePersonRole(null);
        setTimeout(() => {
          PersonRoleData({ action: "getAll" });
        }, 2000);
      } else {
        sweatalert.fire({
          title: res.message,
          icon: "error",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error in reassign and delete:", error);
    }
  };

  const personRoleOptions = personRoleDataAll?.data
    ?.filter((role) => role.id !== deletePersonRoleStatus?.id)
    ?.sort((a, b) => a.name.localeCompare(b.name))
    ?.map((role) => ({
      value: role.id,
      label: role.name,
    }));

  return (
    <>
      <div>
        <div className="container-fluid">
          {loading && (
            <div className="overlay">
              <div className="loader"></div>
            </div>
          )}
          <div className="row ">
            <div className="col-sm-12">
              <div className="page-title-box">
                <div className="row align-items-start">
                  <div className="col-md-12">
                    <>
                      <ul
                        className="nav nav-pills  rounded-tabs icon-fix"
                        id="pills-tab"
                        role="tablist"
                      >
                        {tabsArr.map((tab, index) => (
                          <li
                            className="nav-item"
                            role="presentation"
                            key={index}
                          >
                            <button
                              className={`nav-link ${tabStatus.current === tab.id ? "active" : ""
                                }`}
                              id={tab.id}
                              data-bs-toggle="pill"
                              type="button"
                              aria-controls={tab.id}
                              aria-selected={tabStatus.current === tab.id}
                              onClick={() => handleTabChange(tab.id)}
                            >
                              {tab.icon}
                              {tab.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${getShowTabId === "1" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className="col-lg-6 d-flex align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Staff Role</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "1")}
                      >
                        <Plus size={16} /> Add Staff Role
                      </button>
                    </div>
                  )}
                  {roleDataAll?.data && roleDataAll.data.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={roleDataAll.data.map((data) => ({
                        "Role Name": data.role_name,
                        "Hours": data.hourminute?.split(":")[0] || "0",
                        "Minutes": data.hourminute?.split(":")[1] || "0",
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName={`Role Data`}
                    />
                  )}
                </div>

                <div className=" col-lg-12 datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnRoles}
                    data={roleDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "2" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className=" col-lg-6 d-flex  align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Customer Contact Person Role</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "2")}
                      >
                        <Plus size={16} /> Customer Contact Person Role
                      </button>
                    </div>
                  )}
                  {personRoleDataAll?.data &&
                    personRoleDataAll.data.length > 0 && (
                      <ExportToExcel
                        className="btn btn-outline-info fw-bold float-end border-3 "
                        apiData={personRoleDataAll?.data?.map((data) => {
                          return {
                            "Role Name": data.name,
                            "Status": data.status == "1" ? "Active" : "Inactive",
                          };
                        })}
                        fileName={`Customer Contact Person Role Data`}
                      />
                    )}
                </div>
                <div className="datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnPersonRole}
                    data={personRoleDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "3" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className=" col-lg-6 d-flex  align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Job Status Name</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "3")}
                      >
                        <Plus size={16} /> Add Status
                      </button>
                    </div>
                  )}
                  {statusTypeDataAll?.data?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={statusTypeDataAll.data.map((data) => ({
                        "Status Name": data.type,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Status Data"
                    />
                  )}
                </div>
                <div className=" col-lg-12 datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnStatusType}
                    data={statusTypeDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "4" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className=" col-lg-6 d-lg-flex  align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Services</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "4")}
                      >
                        <Plus size={16} /> Add Service
                      </button>
                    </div>
                  )}
                  {serviceDataAll?.data?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={serviceDataAll.data.map((data) => ({
                        "Service Name": data.name,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Service Data"
                    />
                  )}
                </div>
                <div className=" col-lg-12 datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnService}
                    data={serviceDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "5" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className="col-lg-6 d-lg-flex align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Client Industry</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "5")}
                      >
                        <Plus size={16} /> Add Client Industry
                      </button>
                    </div>
                  )}
                  {clientIndustryDataAll?.data?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={clientIndustryDataAll.data.map((data) => ({
                        "Client Industry Name": data.business_type,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Client Industry Data"
                    />
                  )}
                </div>
                <div className="col-lg-12 datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnClientIndustry}
                    data={clientIndustryDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "6" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className="col-lg-6 d-lg-flex align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Country</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "6")}
                      >
                        <Plus size={16} /> Add Country
                      </button>
                    </div>
                  )}
                  {countryDataAll?.data?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={countryDataAll.data.map((data) => ({
                        "Country Code": data.code,
                        "Country Name": data.name,
                        "Currency": data.currency,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Country Data"
                    />
                  )}
                </div>
                <div className="col-lg-12 datatable-wrapper">
                  <Datatable
                    filter={true}
                    columns={columnCountry}
                    data={countryDataAll.data}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "7" ? "show active" : ""
                }`}
            >
              <div className="report-data row ">
                <div className="d-lg-flex col-lg-6 align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Incorporation</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "7")}
                      >
                        <Plus size={16} /> Add Incorporation{" "}
                      </button>
                    </div>
                  )}
                  {incorporationDataAll?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={incorporationDataAll.map((data) => ({
                        "Incorporation Name": data.name,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Incorporation Data"
                    />
                  )}
                </div>
                <div className="datatable-wrapper col-lg-12">
                  <Datatable
                    filter={true}
                    columns={columnincorporation}
                    data={incorporationDataAll}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "8" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className="d-lg-flex col-lg-6 align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">Customer Source</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "8")}
                      >
                        <Plus size={16} /> Add Customer Source
                      </button>
                    </div>
                  )}
                  {customerSourceDataDataAll?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={customerSourceDataDataAll.map((data) => ({
                        "Source Name": data.name,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Customer Source Data"
                    />
                  )}
                </div>
                <div className="datatable-wrapper col-lg-12">
                  <Datatable
                    filter={true}
                    columns={columnCustomerSource}
                    data={customerSourceDataDataAll}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "9" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className="d-lg-flex col-lg-6 align-items-center ">
                  <div className="tab-title">
                    <h3 className="mt-0">CheckList</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={() => HandleAddCheckList()}
                      >
                        <Plus size={16} /> Add CheckList
                      </button>
                    </div>
                  )}
                  {getCheckList?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={getCheckList.map((data) => ({
                        "Checklist Name": data.check_list_name,
                        "Work Flow Type": data.work_flow_type == "3" ? "Processing Type" : "Reviewing Type",
                        "Customer Name": data.customer_name || "All",
                        "Service Type": data.service_name || "All",
                        "Job Type": data.job_type_type || "All",
                        "Client Type": data.client_type_type,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="CheckList Data"
                    />
                  )}
                </div>
                <div className="datatable-wrapper col-lg-12">
                  <Datatable
                    filter={true}
                    columns={CheckListColumns}
                    data={getCheckList}
                  />
                </div>
              </div>
            </div>

            <div
              className={`tab-pane fade ${getShowTabId === "10" ? "show active" : ""
                }`}
            >
              <div className="report-data row">
                <div className=" col-lg-6 d-block d-lg-flex align-items-center">
                  <div className="tab-title">
                    <h3 className="mt-0">Internal Job/Project</h3>
                  </div>
                </div>
                <div className=" col-lg-6 d-flex justify-content-end align-items-center">
                  {!showSettingInsertTab ? null : (
                    <div className="mx-2">
                      <button
                        type="button"
                        className="btn btn-info text-white float-lg-end mt-3 mt-lg-0"
                        onClick={(e) => handleAdd(e, "10")}
                      >
                        <Plus size={16} /> Add Internal Job/Project
                      </button>
                    </div>
                  )}
                  {InternalAllData?.length > 0 && (
                    <ExportToExcel
                      className="btn btn-outline-info fw-bold float-end border-3"
                      apiData={InternalAllData.map((data) => ({
                        "Internal Job/Project Name": data.name,
                        "Status": data.status == "1" ? "Active" : "Inactive",
                      }))}
                      fileName="Internal Job/Project Data"
                    />
                  )}
                </div>
                <div className="datatable-wrapper col-lg-12">
                  <Datatable
                    filter={true}
                    columns={InternalColumns}
                    data={InternalAllData}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <>
          {isModalOpen && (
            <Modal
              modalId="exampleModal3"
              title={
                isEdit ? "Edit " + modalData.title : "Add " + modalData.title
              }
              fields={modalData.fields}
              onClose={() => {
                setIsModalOpen(false);
                setModalData({});
              }}
              onSave={handleSave}
              onChange={handleModalChange}
              buttonClass={isEdit ? "" : "btn btn-outline-success"}
              buttonName={
                isEdit ? (
                  <>
                    <Pencil size={16} /> Update
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save
                  </>
                )
              }
            />
          )}
          {showViewModal && (
            <CommonModal
              isOpen={showViewModal}
              backdrop="static"
              size="md"
              title="View Task"
              hideBtn={true}
              handleClose={() => {
                setShowViewModal(false);
              }}
              Submit_Function={() => setShowViewModal(false)}
            >
              <div className="av">
                <div className="">
                  <table className="table table-bordered ">
                    <thead className="table-light">
                      <tr>
                        <th> Check List Name</th>
                        <th>Task Name</th>
                        <th>Task Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{viewData && viewData?.check_list_name}</td>
                        <td>
                          {viewData &&
                            viewData.task
                              ?.map((task) => task.task_name)
                              .join(",  ")}
                        </td>
                        <td
                          className={
                            viewData && viewData?.status == 1
                              ? "text-success"
                              : "text-danger"
                          }
                        >
                          {viewData && viewData?.status == 1
                            ? "Active"
                            : "Inactive"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CommonModal>
          )}
          {isPersonRoleModalOpen && (
            <CommonModal
              isOpen={isPersonRoleModalOpen}
              backdrop="static"
              size="xl"
              title={personRoleModalData.id ? "Edit Customer Contact Person Role & Permissions" : "Add Customer Contact Person Role & Permissions"}
              hideBtn={true}
              handleClose={() => {
                setIsPersonRoleModalOpen(false);
                setPersonRoleModalData({});
                setPersonRoleCheckboxState([]);
                setPersonRoleStructure([]);
              }}
            >
              <div className="p-3">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={personRoleModalData?.name || ""}
                      onChange={(e) =>
                        setPersonRoleModalData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Status</label>
                    <select
                      className="form-select"
                      value={personRoleModalData?.status || "1"}
                      onChange={(e) =>
                        setPersonRoleModalData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="report-data mt-4">
                  <div className="tab-title">
                    <h3>Set Role Access</h3>
                  </div>
                  <div className="mt-3">
                    <div className="accordion" id="customer-access-accordion-modal">
                      <div className="accordion-item mt-2">
                        <h2 className="accordion-header" id="headingRoleAccess">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseRoleAccess"
                            aria-expanded="false"
                            aria-controls="collapseRoleAccess"
                          >
                            {personRoleModalData?.name || "Role Permissions"}
                          </button>
                        </h2>
                        <div 
                          id="collapseRoleAccess"
                          className="accordion-collapse collapse"
                          aria-labelledby="headingRoleAccess"
                          data-bs-parent="#customer-access-accordion-modal"
                        >
                          <div className="accordion-body">
                            {loadingPersonRolePerms ? (
                              <div className="text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                  <span className="visually-hidden">Loading...</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="d-flex justify-content-end mb-3 border-bottom pb-2">
                                  <div className="form-check form-check-outline form-check-dark">
                                    <input
                                      className="form-check-input new-checkbox"
                                      type="checkbox"
                                      id="global-select-all-person-role"
                                      checked={
                                        personRoleStructure.length > 0 &&
                                        personRoleStructure.every((section) =>
                                          section.items.every((item) =>
                                            personRoleCheckboxState.some(
                                              (p) =>
                                                p.role_id == personRoleModalData.id &&
                                                p.permission_id == item.id &&
                                                p.is_assigned
                                            )
                                          )
                                        )
                                      }
                                      onChange={(e) => {
                                        const checked = e.target.checked;
                                        setPersonRoleCheckboxState((prevState) => {
                                          let updatedState = prevState.filter(
                                            (item) => item.role_id != personRoleModalData.id
                                          );
                                          personRoleStructure.forEach((section) => {
                                            section.items.forEach((item) => {
                                              updatedState.push({
                                                permission_id: item.id,
                                                role_id: personRoleModalData.id,
                                                is_assigned: checked,
                                                permission_name: section.permission_name,
                                              });
                                            });
                                          });
                                          return updatedState;
                                        });
                                      }}
                                    />
                                    <label
                                      className="form-check-label new_checkbox mb-0 ms-2 fw-bold text-primary cursor-pointer"
                                      htmlFor="global-select-all-person-role"
                                    >
                                      Select All Permissions
                                    </label>
                                  </div>
                                </div>

                                <div className="row">
                                  {personRoleStructure
                                    ?.filter((section) => section.permission_name !== "report")
                                    ?.map((section, idx) => {
                                      const sectionPermissions = section.items.map((item) => item.id);
                                      const selectedSectionPermissions = personRoleCheckboxState.filter(
                                        (item) =>
                                          item.role_id == personRoleModalData.id &&
                                          sectionPermissions.some((pid) => pid == item.permission_id) &&
                                          item.is_assigned
                                      );
                                      const isAllSelected =
                                        sectionPermissions.length > 0 &&
                                        selectedSectionPermissions.length === sectionPermissions.length;

                                      const handleSelectAllSection = (event) => {
                                        const checked = event.target.checked;
                                        setPersonRoleCheckboxState((prevState) => {
                                          let updatedState = prevState.filter(
                                            (item) =>
                                              !(
                                                item.role_id == personRoleModalData.id &&
                                                sectionPermissions.some((pid) => pid == item.permission_id)
                                              )
                                          );

                                          section.items.forEach((item) => {
                                            updatedState.push({
                                              permission_id: item.id,
                                              role_id: personRoleModalData.id,
                                              is_assigned: checked,
                                              permission_name: section.permission_name,
                                            });
                                          });
                                          return updatedState;
                                        });
                                      };

                                      return (
                                        <div key={idx} className="col-lg-2 col-md-6 mb-3">
                                          <h4
                                            className="card-title fs-16 mb-2 flex-grow-1"
                                            style={{ textTransform: 'capitalize' }}
                                          >
                                            {section.permission_name && section.permission_name.replace(/_/g, " ")}
                                          </h4>
                                          <div className="mb-3 border-bottom pb-2">
                                            <div className="form-check form-check-outline form-check-dark">
                                              <input
                                                className="form-check-input new-checkbox me-2"
                                                type="checkbox"
                                                id={`select-all-${section.permission_name}`}
                                                checked={isAllSelected}
                                                onChange={handleSelectAllSection}
                                              />
                                              <label
                                                className="form-check-label new_checkbox mb-0 cursor-pointer"
                                                htmlFor={`select-all-${section.permission_name}`}
                                                style={{ fontSize: '12px', fontWeight: 'bold', color: '#007bff' }}
                                              >
                                                Select All
                                              </label>
                                            </div>
                                          </div>

                                          <div className="row">
                                            {section.items.map((item) => {
                                              const isChecked = personRoleCheckboxState.some(
                                                (p) =>
                                                  p.permission_id == item.id &&
                                                  p.role_id == personRoleModalData.id &&
                                                  p.is_assigned
                                              );

                                              const handleCheckboxChange = (event) => {
                                                const checked = event.target.checked;
                                                setPersonRoleCheckboxState((prevState) => {
                                                  let updatedState = prevState.filter(
                                                    (p) =>
                                                      !(
                                                        p.permission_id == item.id &&
                                                        p.role_id == personRoleModalData.id
                                                      )
                                                  );
                                                  updatedState.push({
                                                    permission_id: item.id,
                                                    role_id: personRoleModalData.id,
                                                    is_assigned: checked,
                                                    permission_name: section.permission_name,
                                                  });
                                                  return updatedState;
                                                });
                                              };

                                              return (
                                                <div className="mb-3" key={item.id}>
                                                  <div className="form-check form-check-outline form-check-dark">
                                                    <input
                                                      className="form-check-input new-checkbox me-2"
                                                      type="checkbox"
                                                      id={`perm-${item.id}-${personRoleModalData.id}`}
                                                      checked={isChecked}
                                                      onChange={handleCheckboxChange}
                                                    />
                                                    <label
                                                      className="form-check-label new_checkbox mb-0 text-capitalize cursor-pointer"
                                                      htmlFor={`perm-${item.id}-${personRoleModalData.id}`}
                                                    >
                                                      {item.type && item.type.replace(/_/g, " ")}
                                                    </label>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top pt-3">
                <button
                  type="button"
                  className="btn btn-secondary rounded-pill px-4"
                  onClick={() => {
                    setIsPersonRoleModalOpen(false);
                    setPersonRoleModalData({});
                    setPersonRoleCheckboxState([]);
                    setPersonRoleStructure([]);
                  }}
                >
                  <X size={16} className="me-1" /> Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleSavePersonRoleWithPermissions}
                  disabled={loadingPersonRolePerms}
                >
                  <Save size={16} className="me-1" /> Save changes
                </button>
              </div>
            </CommonModal>
          )}
        </>

        <CommonModal
          isOpen={deleteStatus}
          backdrop="static"
          size="md"
          title="Delete Role"
          hideBtn={true}
          handleClose={() => setDeleteStatus(false)}
        >
          <div className="">
            {/* Heading */}
            <div className="text-start mb-4 border-bottom pb-2">
              <h6 className=" fw-bold d-flex align-items-center ">
                <i className="bi bi-trash3 me-2"></i>
                Delete Role:{" "}
                <span className=" ms-2">{deleteStatus?.role_name}</span>
              </h6>
            </div>

            {StaffRoleDAta.length > 0 ? (
              <>
                {/* Replacement Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="staff-select"
                    className="form-label fw-semibold"
                  >
                    Select Role to Replace
                  </label>

                  <Select
                    options={roleOptions}
                    value={
                      roleOptions?.find((opt) => opt.value === replaceStatue) ||
                      null
                    }
                    onChange={(selected) => setReplaceStatue(selected?.value)}
                    isSearchable
                    placeholder="Choose Role"
                    className="shadow-sm"
                    classNamePrefix="select"
                    /* 🔥 IMPORTANT FIX */
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                {/* Staff List */}
                <div className="mb-4">
                  <label className=" form-label fw-semibold d-flex align-items-center">
                    <User2 size={16} /> Staff Assigned
                  </label>
                  <ul className="list-group mt-2">
                    {StaffRoleDAta.map((customer, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center rounded-pill"
                      >
                        <span className="text-dark">
                          {`${customer?.first_name} ${customer.last_name}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Buttons */}
                <div className="d-flex gap-2">
                  <button
                    disabled={!replaceStatue}
                    onClick={roledeleteUpdatestaff}
                    className="btn btn-secondary w-100"
                  >
                    Delete
                  </button>
                  <button
                    style={{
                      color: "#333547 ",
                      border: "2px solid #333547 ",
                    }}
                    onClick={() => setDeleteStatus(false)}
                    className="btn   rounded-pill    w-100"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <button
                  onClick={roledeleteUpdatestaff}
                  className="btn btn-danger w-100 rounded-pill"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteStatus(false)}
                  className="btn btn-info w-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </CommonModal>

        <CommonModal
          isOpen={deletePersonRoleStatus}
          backdrop="static"
          size="md"
          title="Delete Customer Role"
          hideBtn={true}
          handleClose={() => setDeletePersonRoleStatus(null)}
        >
          <div className="">
            <div className="text-start mb-4 border-bottom pb-2">
              <h6 className=" fw-bold d-flex align-items-center">
                <i className="bi bi-trash3 me-2"></i>
                Delete Contact  Person Role:{" "}
                <span className=" ms-2">{deletePersonRoleStatus?.name}</span>
              </h6>
            </div>

            {assignedPersonUsers.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Select Role to Replace
                  </label>
                  <Select
                    options={personRoleOptions}
                    value={
                      personRoleOptions?.find((opt) => opt.value === replacePersonRole) ||
                      null
                    }
                    onChange={(selected) => setReplacePersonRole(selected?.value)}
                    isSearchable
                    placeholder="Choose Role"
                    className="shadow-sm"
                    classNamePrefix="select"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                <div className="mb-4">
                  <label className=" form-label fw-semibold d-flex align-items-center">
                    <User2 size={16} className="me-1" /> Customer Users Assigned
                  </label>
                  {/* <ul className="list-group mt-2 gap-2">
                    {assignedPersonUsers.map((user, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center rounded-pill"
                      >
                        <span className="text-dark">
                          {`${user?.first_name} ${user.last_name}`}
                        </span>
                      </li>
                    ))}
                  </ul> */}
                  <ul
                    className="list-group mt-2 gap-2"
                    style={{
                      maxHeight: "220px",
                      overflowY: "auto",
                    }}
                  >
                    {assignedPersonUsers.map((user, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <span className="text-dark">
                          {`${user?.first_name} ${user.last_name}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="d-flex gap-2">
                  <button
                    disabled={!replacePersonRole}
                    onClick={handlePersonRoleReassignDelete}
                    className="swal2-confirm swal2-styled w-100"
                  >
                    Delete & Reassign
                  </button>
                  <button
                    onClick={() => setDeletePersonRoleStatus(null)}
                    className="swal2-cancel swal2-styled w-100"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </CommonModal>

        <CommonModal
          isOpen={deleteServiceModal}
          backdrop="static"
          size="xl"
          title="Delete Service"
          hideBtn={true}
          handleClose={() => {
            setDeleteServiceModal(false);
            setSelectedService(null);
          }}
        >
          <div className="modal-body">
            <div className="text-start mb-3">
              <h5 className="text-danger fw-bold">
                <Trash size={18} /> Delete Service {" "}
                <span className="text-dark">
                  {deleteServiceInfo?.name}
                </span>
              </h5>
            </div>

            {
              selectedTasks?.length > 0 && (
                <div className="mt-3">
                  <label className="fw-semibold mb-2">
                    Selected Tasks
                  </label>

                  <div className="table-responsive">
                    <table className="table table-bordered table-sm align-middle">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "60px" }}>#</th>
                          <th>Task Name</th>
                          <th style={{ width: "180px" }}>Budgeted Hour</th>
                        </tr>
                      </thead>

                      <tbody>
                        {selectedTasks?.map((task, index) => {
                          const budgeted_hour = task?.budgeted_hour !== undefined && task?.budgeted_hour !== null ? task.budgeted_hour : "0:0";
                          const [hours, minutes] = budgeted_hour.split(":");

                          const error = errorsBudgetTimeTask[task.value];

                          return (
                            <tr key={task?.value}>

                              <td>{index + 1}</td>

                              <td className="fw-semibold">
                                {task?.label}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-1 bg-white border rounded-2 px-2 py-1 shadow-sm" style={{ width: "fit-content", minHeight: "34px" }}>
                                  <Clock size={15} className="text-muted me-1" />
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-center fw-bold shadow-none border-0 p-0"
                                      value={hours}
                                      onChange={(e) => handleBudgetTime(e, index, "hour")}
                                      style={{ minWidth: "35px", width: "55px", fontSize: "14px" }}

                                    />
                                    <span className="text-muted small ms-1" style={{ fontSize: "12px" }}>h</span>
                                  </div>
                                  <div className="text-muted mx-1" style={{ fontSize: "12px" }}>:</div>
                                  <div className="d-flex align-items-center">
                                    <input
                                      type="text"
                                      className="form-control form-control-sm text-center fw-bold shadow-none border-0 p-0"
                                      value={minutes}
                                      onChange={(e) => handleBudgetTime(e, index, "minute")}
                                      style={{ width: "32px", fontSize: "14px" }}

                                    />
                                    <span className="text-muted small ms-1" style={{ fontSize: "12px" }}>m</span>
                                  </div>
                                </div>
                                {error && (
                                  <div className="error-text text-danger">
                                    {error}
                                  </div>
                                )}
                              </td>

                            </tr>
                          )
                        }

                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )
            }


            {allJobsData?.length > 0 && (
              <>

                <div className="table-responsive">
                  <table
                    className="table table-bordered table-sm align-middle w-100 table-equal"
                    style={{ tableLayout: "fixed" }}
                  > <thead className="table-light">
                      <tr>
                        <th className="col-id">#</th>
                        <th >Jobs Name</th>
                        <th >Service</th>
                        <th >Job Type</th>
                        <th >Task</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allJobsData?.map((item, index) => {
                        return (
                          <tr key={item?.job_id}>

                            <td>{index + 1}</td>

                            <td>
                              {item?.job_code_id}
                            </td>

                            <td>

                              <Select
                                isSearchable
                                className="shadow-sm select-service "
                                classNamePrefix="select"
                                placeholder="Choose Service"
                                options={item?.services
                                  ?.filter(
                                    (service, index, self) =>
                                      index === self.findIndex((s) => s.service_id === service.service_id)
                                  )
                                  ?.filter((service) => {
                                    return (
                                      service.service_id !== deleteServiceInfo?.id
                                    );
                                  })
                                  .map((service) => ({
                                    value: service?.service_id,
                                    label: `${service?.service_name}`,
                                    serviceData: service, // 👈 pura service object store
                                  }))}
                                value={
                                  item?.service_id
                                    ? {
                                      value: item?.service_id,
                                      label: item?.selectedService?.service_name
                                    }
                                    : null
                                }
                                onChange={(selectedOption) =>
                                  handleSelectChangeDeleteService(selectedOption, index, "service")
                                }
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />

                            </td>

                            <td>

                              <Select
                                isSearchable
                                className="shadow-sm select-service "
                                classNamePrefix="select"
                                placeholder="Choose Job Type"
                                options={item?.jobTypes
                                  ?.filter(
                                    // (type, index, self) =>
                                    //   index === self.findIndex((s) => s.job_type_id === type.job_type_id)
                                    (type) => type.service_id === item.service_id
                                  )

                                  ?.map((type) => ({
                                    value: type?.job_type_id,
                                    label: `${type?.job_type_name}`,
                                    jobTypeData: type, // 👈 pura job type object store
                                  }))}
                                value={
                                  item?.job_type_id
                                    ? {
                                      value: item?.job_type_id,
                                      label: item?.selectedJobType?.job_type_name
                                    }
                                    : null
                                }
                                onChange={(selectedOption) =>
                                  handleSelectChangeDeleteService(selectedOption, index, "jobType")
                                }
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            </td>

                            <td>

                              <Select
                                isMulti
                                isSearchable
                                className="shadow-sm select-service"
                                classNamePrefix="select"
                                placeholder="Choose Task"
                                options={item?.tasks
                                  ?.filter(
                                    // (task, index, self) =>
                                    //   index === self.findIndex((s) => s.task_id === task.task_id)
                                    (task) => task.job_type_id === item.job_type_id
                                  )
                                  ?.map((task) => ({
                                    value: task.task_id,
                                    label: task.task_name,
                                    ...task
                                  }))}

                                value={item?.selectedTasks || []}
                                onChange={(selectedOption) =>
                                  handleSelectChangeDeleteService(selectedOption, index, "task")
                                }

                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />

                              {item?.selectedTasks?.length > 0 && (
                                <div className="mt-2 p-2 rounded"
                                  style={{
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                    background: "#fff",
                                  }}>
                                  {item.selectedTasks.map((task, taskIndex) => {
                                    const budgeted_hour = task?.budgeted_hour !== undefined && task?.budgeted_hour !== null ? task.budgeted_hour : "0:0";
                                    const [hours, minutes] = budgeted_hour.split(":");
                                    return (
                                      <div key={task.value} className="d-flex align-items-center py-1 px-2 border-bottom last-child-border-0" style={{ minHeight: "38px" }}>
                                        <div
                                          style={{
                                            width: "6px",
                                            height: "6px",
                                            borderRadius: "50%",
                                            background: "#0d6efd",
                                            flexShrink: 0,
                                          }}
                                        />
                                        <span className="small ms-2 flex-grow-1 text-truncate fw-medium" title={task.label} style={{ fontSize: "12px" }}>
                                          {task.label}
                                        </span>
                                        <div className="d-flex align-items-center gap-1 bg-white border rounded-2 px-2 shadow-sm ms-auto" style={{ height: "30px" }}>
                                          <input
                                            type="text"
                                            className="form-control form-control-sm border-0 bg-transparent text-center p-0 fw-bold shadow-none"
                                            value={hours}
                                            onChange={(e) => handleBudgetTimeDeleteService(e, index, taskIndex, "hour")}
                                            style={{ minWidth: "32px", width: "50px", fontSize: "13px" }}

                                          />
                                          <span className="text-muted" style={{ fontSize: "11px" }}>h</span>
                                          <div className="text-muted mx-0" style={{ fontSize: "11px" }}>:</div>
                                          <input
                                            type="text"
                                            className="form-control form-control-sm border-0 bg-transparent text-center p-0 fw-bold shadow-none"
                                            value={minutes}
                                            onChange={(e) => handleBudgetTimeDeleteService(e, index, taskIndex, "minute")}
                                            style={{ width: "26px", fontSize: "13px" }}

                                          />
                                          <span className="text-muted" style={{ fontSize: "11px" }}>m</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}


                            </td>

                          </tr>
                        )
                      }

                      )}
                    </tbody>
                  </table>
                </div>
              </>

            )}


            <button
              onClick={() => {
                setDeleteServiceModal(false);
                setSelectedService(null);
                setSelectedJobType(null);
                setTaskData([]);
                setSelectedTask(null);
              }}
              className="btn btn-secondary"
            >
              <X size={16} /> Cancel
            </button>

            {allJobsData?.length > 0 && (
              <button
                onClick={handleSubmitDeleteService}
                className="btn btn-outline-success float-end px-4 fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                ) : (
                  <Save size={16} className="me-1" />
                )}
                Submit
              </button>
            )}

          </div>
        </CommonModal>


      </div>
    </>
  );
};

export default Setting;
