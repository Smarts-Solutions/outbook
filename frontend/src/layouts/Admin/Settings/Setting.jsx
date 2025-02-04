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
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import Modal from "../../../Components/ExtraComponents/Modals/Modal";
import { useDispatch, useSelector } from "react-redux";
import sweatalert from "sweetalert2";
import ExportToExcel from '../../../Components/ExtraComponents/ExportToExcel';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
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
  const accessData = useSelector(
    (state) => state && state.AccessSlice && state.AccessSlice.RoleAccess.data
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
              (item) => item.type === "insert"
            );
            setShowSettingInsertTab(
              settingInsert && settingInsert.is_assigned == 1
            );
            const settingUpdate = item.items.find(
              (item) => item.type === "update"
            );
            setShowSettingUpdateTab(
              settingUpdate && settingUpdate.is_assigned == 1
            );
            const settingDelete = item.items.find(
              (item) => item.type === "delete"
            );
            setSettingDeleteTab(
              settingDelete && settingDelete.is_assigned == 1
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

  const [getAccessDataSetting, setAccessDataSetting] = useState({
    insert: 0,
    update: 0,
    delete: 0,
    view: 0,
  });

  const accessDataSetting =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "setting"
    )?.items || [];

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
              { id: 1, name: "SoleTrader" },
              { id: 2, name: "Company" },
              { id: 3, name: "Partnership" },
              { id: 4, name: "Individual" },
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
                      (item) => item.id === Number(id)
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
            {row.status === "1" ? "Active" : "Deactive"}
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
            <div className="d-flex">
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
                    {row.is_disable == 0 && (
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
                        <i className="fa fa-plus pe-1"></i>Add Job Type 
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
                {row.is_disable == 0 && (
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
                    <i className="fa fa-plus pe-1"></i>Add Job Type
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
            {row.status === "1" ? "Active" : "Deactive"}
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
              <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
                        <i className="fa fa-plus pe-1" />
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
                    <i className="fa fa-plus pe-1" />
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
      width: "15%",
    },

    {
      cell: (row) => <div title={row.service_name}>{row.service_name}</div>,
      name: "Service Type",
      selector: (row) => row.service_name,
      sortable: true,
      width: "20%",
    },
    {
      cell: (row) => <div title={row.job_type_type}>{row.job_type_type}</div>,
      name: "Job Type",
      selector: (row) => row.job_type_type,
      sortable: true,
      width: "15%",
    },
    {
      cell: (row) => (
        <div title={row.client_type_type}>{row.client_type_type}</div>
      ),
      name: "Client Type",
      selector: (row) => row.client_type_type,
      sortable: true,
      width: "15%",
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${row.status === "1" ? "text-success" : "text-danger"
              }`}
          >
            {row.status === "1" ? "Active" : "Deactive"}
          </span>
        </div>
      ),
      selector: (row) => row.status,
      sortable: true,
      width: "15%",
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
              <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
            </button>
            <div
              className="dropdown-menu custom-dropdown"
              aria-labelledby="dropdownMenuButton"
            >
              <div className="px-2">
                <button
                  className="view-icon dropdown-item w-auto mb-2"
                  onClick={() => {
                    setShowViewModal(true);
                    getTaskData(row);
                  }}
                >
                  <i className="ti-eye" />
                </button>

                {getAccessDataSetting.update === 1 ||
                  role === "ADMIN" ||
                  role === "SUPERADMIN" ? (
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
                {getAccessDataSetting.delete === 1 ||
                  role === "ADMIN" ||
                  role === "SUPERADMIN" ? (
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
            <button
              className="view-icon"
              onClick={() => {
                setShowViewModal(true);
                getTaskData(row);
              }}
            >
              <i className="ti-eye" />
            </button>

            {getAccessDataSetting.update === 1 ||
              role === "ADMIN" ||
              role === "SUPERADMIN" ? (
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
            {getAccessDataSetting.delete === 1 ||
              role === "ADMIN" ||
              role === "SUPERADMIN" ? (
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
      width: "20%",
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
            {row.status === "1" ? "Active" : "Deactive"}
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
                  <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
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
                        <i className="fa fa-plus pe-1" />
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
                    <i className="fa fa-plus pe-1" />
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

    // Log the updated HourMinut state for debugging
    console.log("Updated HourMinut State:", HourMinut);
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
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Role Name",
            placeholder: "Enter Contact Person Role",
          },
        ],
        title: " Contact Person Role",
        tabStatus: tabStatus,
      });
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
              { label: "Deactive", value: "0" },
            ],
          },
        ],
        title: "Staff Role",
        tabStatus: tabStatus,
        id: data.id,
      });
    } else if (tabStatus === "2") {
      setModalData({
        ...modalData,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Role Name",
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
              { label: "Deactive", value: "0" },
            ],
          },
        ],
        title: " Contact Person Role",
        tabStatus: tabStatus,
        id: data.id,
      });
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
              { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
          //     { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
              { label: "Deactive", value: "0" },
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
            id: data.id,
          };
          switch (tabStatus) {
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
        }
      });
  };

  const HandleAddCheckList = () => {
    navigate("/admin/setting/checklist", {
      state: { settingTab: tabStatus.current },
    });
  };

  const tabsArr = [
    { id: "1", label: "Staff Role", icon: "fas fa-user" },
    { id: "2", label: "Customer Contact Person Role", icon: "fas fa-phone" },
    { id: "3", label: "Status Type", icon: "fas fa-tasks" },
    { id: "4", label: "Services", icon: "fas fa-gear" },
    { id: "5", label: "Client Industry", icon: "fas fa-industry" },
    { id: "6", label: "Country", icon: "fas fa-globe" },
    { id: "7", label: "Incorporation", icon: "fas fa-file-alt" },
    { id: "8", label: "Source", icon: "fas fa-external-link-alt" },
    { id: "9", label: "Checklist", icon: "fas fa-check-square" },
    { id: "10", label: "Internal Job/Project", icon: "fas fa-lock" },
  ];

  return (
    <>
      <div>
        <div className="container-fluid">
          <div className="row ">
            <div className="col-sm-12">
              <div className="page-title-box">
                <div className="row align-items-start">
                  <div className="col-md-12">
                    <>
                      <ul
                        className="nav nav-pills  rounded-tabs"
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
                              <i className={`${tab.icon} me-2`}></i>
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
                        <i className="fa fa-plus" /> Add Staff Role
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={roleDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        role_name: data.role_name,
                        hourminute: data.hourminute,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };  

                    })
                    }
                    fileName={`Role Data`}
                  />
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

            <div className={`tab-pane fade ${getShowTabId === "2" ? "show active" : ""}`} >
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
                        <i className="fa fa-plus" /> Customer Contact Person
                        Role
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={personRoleDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`Customer Contact Person Role Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Status
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={statusTypeDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        type: data.type,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`Status Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Service
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={serviceDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };  

                    })
                    }
                    fileName={`Service Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Client Industry
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={clientIndustryDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        name: data.business_type,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };  

                    })
                    }
                    fileName={`Client Industry Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Country
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={countryDataAll?.data?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        code: data.code,
                        currency: data.currency,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`Country Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Incorporation{" "}
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={incorporationDataAll?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`Incorporation Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Customer Source
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={customerSourceDataDataAll?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`Customer Source Data`}
                  />
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
                        <i className="fa fa-plus" /> Add CheckList
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={getCheckList?.map((data) => {
                      return {
                        id: data.checklists_id,
                        name: data.checklist_name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      };

                    })
                    }
                    fileName={`CheckList Data`}
                  />
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
                        <i className="fa fa-plus" /> Add Internal Job/Project
                      </button>
                    </div>
                  )}
                  <ExportToExcel
                    className="btn btn-outline-info fw-bold float-end border-3 "
                    apiData={InternalAllData?.map((data) => {
                      return {
                        id: data.id,
                        name: data.name,
                        status: data.status == 1 ? "Active" : "Inactive",
                      } 
                    })

                    }
                    fileName={`Internal Job/Project Data`}
                  />
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
                    <i className="fa fa-edit"></i> Update
                  </>
                ) : (
                  <>
                    <i className="far fa-save pe-1"></i>
                    Save
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
        </>
      </div>
    </>
  );
};

export default Setting;
