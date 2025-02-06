import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Staff, Competency } from "../../../ReduxStore/Slice/Staff/staffSlice";
import { Role } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { ActivityLog } from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import { FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import sweatalert from "sweetalert2";
import Formicform from "../../../Components/ExtraComponents/Forms/Comman.form";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";
import Validation_Message from "../../../Utils/Validation_Message";
import { FaBriefcase, FaPencilAlt, FaPlus, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { staffPortfolio, DELETESTAFF } from "../../../Services/Staff/staff";
const StaffPage = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const StaffUserId = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const accessData = useSelector(
    (state) => state && state.AccessSlice && state.AccessSlice.RoleAccess.data
  );
  const [showStaffInsertTab, setShowStaffInsertTab] = useState(true);
  const [showStaffUpdateTab, setShowStaffUpdateTab] = useState(true);
  const [showStaffDeleteTab, setStaffDeleteTab] = useState(true);
  const [allCustomerData, setAllCustomerData] = useState([]);
  const [deleteStaff, setDeleteStaff] = useState();

  const [budgetedHours, setBudgetedHours] = useState({
    hours: "",
    minutes: "",
  });
  const [selectedStaff, setSelectedStaff] = useState(null);

  const handleDeleteClick = async () => {
    let data = {
      delete_id: deleteStaff,
      update_staff: selectedStaff,
    };
    const res = await DELETESTAFF(data);
    console.log(res);
    if (res?.status) {
      await dispatch(
        Staff({ req: { action: "delete", id: deleteStaff }, authToken: token })
      )
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            sweatalert.fire({
              icon: "success",
              title: "Success",
              text: response.message,
              timer: 2000,
            });
            setSelectedStaff(null);
            SetRefresh(!refresh);
            setDeleteStaff(false)

          } else {
            sweatalert.fire({
              icon: "error",
              title: "Oops...",
              text: response.message,
            });
            setDeleteStaff(false)
          }
        })
        .catch((error) => {
          return;
        });

    } else {
      sweatalert.fire({
        icon: "error",
        title: "Oops...",
        text: res.message,
      });
      setDeleteStaff("");
    }
  };

  useEffect(() => {
    if (
      accessData &&
      accessData.length > 0 &&
      role !== "ADMIN" &&
      role !== "SUPERADMIN"
    ) {
      accessData &&
        accessData.map((item) => {
          if (item.permission_name === "staff") {
            const staffInsert = item.items.find(
              (item) => item.type === "insert"
            );
            setShowStaffInsertTab(staffInsert && staffInsert.is_assigned == 1);
            const staffUpdate = item.items.find(
              (item) => item.type === "update"
            );
            setShowStaffUpdateTab(staffUpdate && staffUpdate.is_assigned == 1);
            const staffDelete = item.items.find(
              (item) => item.type === "delete"
            );
            setStaffDeleteTab(staffDelete && staffDelete.is_assigned == 1);
          }
        });
    }
  }, [accessData]);

  const dispatch = useDispatch();
  const [addStaff, setAddStaff] = useState(false);
  const [portfolio, setPortfolio] = useState();
  const [editStaff, setEditStaff] = useState(false);
  const [editShowModel, setEditShowModel] = useState(false);
  const [editStaffData, setEditStaffData] = useState({});
  const [addCompetancy, SetCompetancy] = useState(false);
  const [staffViewLog, SetStaffViewLog] = useState(false);
  const [getActiviyLog, setActivityLog] = useState([]);
  const [refresh, SetRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("this-year");
  const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
  const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });
  const [AddCustomer, setAddCustomer] = useState([]);
  const [serviceDataAll, setServiceDataAll] = useState({
    loading: true,
    data: [],
    staff_id: "",
  });

  useEffect(() => {
    staffData();
    roleData();
  }, [refresh, activeTab]);

  const staffData = async () => {
    await dispatch(Staff({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setStaffDataAll({ loading: false, data: response.data });
        } else {
          setStaffDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetAllCustomer = async () => {
    await dispatch(
      Staff({
        req: { action: "portfolio", staff_id: StaffUserId.id },
        authToken: token,
      })
    )
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setAllCustomerData(response.data);
        } else {
          setAllCustomerData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const ServiceData = async (row) => {
    try {
      const response = await dispatch(
        Competency({
          req: { action: "get", staff_id: row.id },
          authToken: token,
        })
      ).unwrap();
      if (response.status) {
        var data = response.data.map((item) => {
          return { ...item, status: item.status === 1 ? true : false };
        });
        setServiceDataAll({ loading: false, data: data, staff_id: row.id });
      } else {
        setServiceDataAll({ loading: false, data: [], staff_id: row.id });
      }
    } catch (error) {
      return;
    }
  };

  const ViewLogs = async (row) => {
    try {
      const req = { staff_id: row.id };
      const data = { req: req, authToken: token };
      await dispatch(ActivityLog(data))
        .unwrap()
        .then((res) => {
          if (res.status) {
            setActivityLog(res.data);
          } else {
            setActivityLog([]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      return;
    }
  };

  const roleData = async (req) => {
    await dispatch(Role({ req: { action: "staffRole" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setRoleDataAll({ loading: false, data: response.data });
        } else {
          setRoleDataAll({ loading: false, data: [] });
        }
      })
      .catch((error) => {
        return;
      });
  };

  const tabs = [
    { id: "this-week", label: "This week" },
    { id: "last-week", label: "Last week" },
    { id: "this-month", label: "This month" },
    { id: "last-month", label: "Last month" },
    { id: "last-quarter", label: "Last quarter" },
    { id: "this-6-months", label: "This 6 months" },
    { id: "last-6-months", label: "Last 6 months" },
    { id: "this-year", label: "This year" },
    { id: "last-year", label: "Last year" },
  ];

  const columns = [
    {
      name: "Full Name",
      cell: (row) => (
        <div title={row.first_name + " " + row.last_name}>
          {row.first_name + " " + row.last_name}
        </div>
      ),
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      width: "300px",
      reorder: false,
    },
    {
      cell: (row) => <div title={row.email}>{row.email}</div>,
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
      idth: "300px",
      reorder: false,
    },
    {
      name: "Phone",
      cell: (row) => (
        <div
          title={
            row.phone && row.phone_code
              ? row.phone_code + "-" + row.phone
              : " - "
          }
        >
          {row.phone && row.phone_code
            ? row.phone_code + "-" + row.phone
            : " - "}
        </div>
      ),
      selector: (row) =>
        row.phone && row.phone_code ? row.phone_code + "-" + row.phone : " - ",
      sortable: true,
      width: "150px",
      reorder: false,
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
      width: "200px",
      reorder: false,
    },
    {
      name: "Status",
      cell: (row) => (
        <div>
          <span
            className={` ${
              row.status === "1" ? "text-success" : "text-danger"
            }`}
          >
            {row.status === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      width: "100px",
      reorder: false,
    },
    {
      name: "Actions",
      cell: (row) => {
        return (
          <>
            <div className="px-2">
              {row?.is_disable == 0 && (
                <button
                  className="delete-icon dropdown-item  w-auto mb-2"
                  onClick={() => setDeleteStaff(row?.id)}
                >
                  {" "}
                  <i className="ti-trash text-danger" />
                </button>
              )}
            </div>
            <div className="dropdown">
              <button
                className="btn "
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
                <a
                  className="dropdown-item"
                  onClick={() => {
                    GetAllStaffPortfolio(row);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaPencilAlt /> Portfolio
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    setEditShowModel(true);
                    setEditStaff(true);
                    setEditStaffData(row);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaBriefcase /> Edit
                </a>
                <a
                  className="dropdown-item"
                  onClick={() => {
                    ServiceData(row);
                    SetCompetancy(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <FaPlus /> Competency
                </a>
                {/* <a className="dropdown-item" style={{ cursor: 'pointer' }} onClick={() => { ViewLogs(row); SetStaffViewLog(true) }} > */}
                <a
                  className="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/admin/staff/viewlogs`, { state: { row: row } })
                  }
                >
                  <FaEye /> Logs
                </a>
              </div>
            </div>
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: false,
    },
  ];

  const GetAllStaffPortfolio = async (row) => {
    try {
      const response = await staffPortfolio({
        req: {
          action: "get",
          staff_id: row.id,
        },
        authToken: token,
      });
      if (response?.status && Array.isArray(response.data)) {
        setAddCustomer(
          response.data.map((item) => ({
            value: item.customer_id,
            label: item.trading_name,
          }))
        );
        setPortfolio(row);
        GetAllCustomer();
      } else {
        console.warn("Invalid response format:", response);
      }
    } catch (error) {
      console.error("Error fetching staff portfolio:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      phone_code: "+44",
      // password: "",
      role: "3",
      status: "1",
      staff_to: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .trim(Validation_Message.FirstNameValidation)
        .required(Validation_Message.FirstNameValidation),
      last_name: Yup.string()
        .trim(Validation_Message.LastNameValidation)
        .required(Validation_Message.LastNameValidation),
      email: Yup.string()
        .trim(Validation_Message.EmailValidation)
        .email(Validation_Message.EmailValidation)
        .required(Validation_Message.EmailIsRequire),
      role: Yup.string()
        .trim(Validation_Message.RoleValidation)
        .required(Validation_Message.RoleValidation),
      status: Yup.string()
        .trim(Validation_Message.StatusValidation)
        .required(Validation_Message.StatusValidation),
    }),

    onSubmit: async (values) => {
      let req = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        phone_code: values.phone_code,
        role_id: values.role,
        status: values.status,
        staff_to: values.staff_to,
        created_by: StaffUserId.id,
        hourminute: `${budgetedHours.hours || "00"}:${
          budgetedHours.minutes || "00"
        }`,
      };
      if (editStaff) {
        req.id = editStaffData && editStaffData.id;
      }

      await dispatch(
        Staff({
          req: { action: editStaff ? "update" : "add", ...req },
          authToken: token,
        })
      )
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            sweatalert.fire({
              icon: "success",
              title: "Success",
              text: response.message,
              timer: 1500,
              timerProgressBar: true,
            });
            setTimeout(() => {
              setAddStaff(false);
              setEditStaff(false);
              setEditStaffData({});
              SetRefresh(!refresh);
              formik.resetForm();
              window.location.reload();
            }, 1500);
          } else {
            sweatalert.fire({
              icon: "error",
              title: "Oops...",
              text: response.message,
            });
          }
        })

        .catch((error) => {
          return;
        });
    },
  });

  const fields = [
    {
      type: "text5",
      name: "first_name",
      label: "First Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter First Name",
    },
    {
      type: "text5",
      name: "last_name",
      label: "Last Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Last Name",
    },

    {
      type: "select2",
      name: "phone_code",
      label: "Phone Code",
      options: [
        { label: "+44", value: "+44" },
        { label: "+91", value: "+91" },
      ],
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
    {
      type: "number1",
      name: "phone",
      label: "Phone",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
    {
      type: "email",
      name: "email",
      label: "Email",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Email",
    },
    {
      type: "select1",
      name: "role",
      label: "Role",
      label_size: 12,
      col_size: 6,
      disable: false,
      options:
        roleDataAll &&
        roleDataAll.data.map((data) => {
          if (formik.values.role_id == data.id) {
            return { label: data.role_name, value: data.id, selected: true };
          } else {
            return { label: data.role_name, value: data.id };
          }
        }),
    },
    {
      type: "select1",
      name: "status",
      label: "Status",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: [
        { label: "Active", value: "1" },
        { label: "Inactive", value: "0" },
      ],
    },
    {
      type: "select",
      name: "staff_to",
      label: "Line Manager",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: staffDataAll.data
        .filter((data) => data.role !== "ADMIN")
        .map((data) => ({
          label: `${data.first_name} ${data.last_name}`,
          value: data.id,
        })),
    },
  ];

  const DeleteStaff = async (row) => {
    sweatalert
      .fire({
        title: "Are you sure?",
        text: "You will not be able to recover this record!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          // await dispatch(
          //   Staff({ req: { action: "delete", id: row.id }, authToken: token })
          // )
          //   .unwrap()
          //   .then(async (response) => {
          //     if (response.status) {
          //       sweatalert.fire({
          //         icon: "success",
          //         title: "Success",
          //         text: response.message,
          //         timer: 2000,
          //       });
          //       SetRefresh(!refresh);
          //     } else {
          //       sweatalert.fire({
          //         icon: "error",
          //         title: "Oops...",
          //         text: response.message,
          //       });
          //     }
          //   })
          //   .catch((error) => {
          //     return;
          //   });
        }
      });
  };

  const handleCheckboxChange = (event, id) => {
    const { checked } = event.target;

    setServiceDataAll((prevState) => ({
      ...prevState,
      data: prevState.data.map((item) =>
        item.service_id === id ? { ...item, status: checked } : item
      ),
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await dispatch(
        Competency({
          req: {
            action: "update",
            staff_id: serviceDataAll.staff_id,
            service: serviceDataAll.data,
          },
          authToken: token,
        })
      ).unwrap();

      if (response.status) {
        sweatalert.fire({
          icon: "success",
          title: "Success",
          text: response.message,
          timer: 2000,
        });
        SetCompetancy(false);
        SetRefresh(!refresh);
      } else {
        sweatalert.fire({
          icon: "error",
          title: "Oops...",
          text: response.message,
        });
      }
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    if (editStaffData && editStaffData) {
      formik.setFieldValue("first_name", editStaffData.first_name || "null");
      formik.setFieldValue("last_name", editStaffData.last_name || "null");
      formik.setFieldValue("email", editStaffData.email || "null");
      formik.setFieldValue("phone", editStaffData.phone || null);
      formik.setFieldValue("role", editStaffData.role_id || "null");
      formik.setFieldValue("status", editStaffData.status || "null");
      formik.setFieldValue("phone_code", editStaffData.phone_code || null);
      if (editStaffData.hourminute) {
        setBudgetedHours({
          hours: editStaffData.hourminute.split(":")[0],
          minutes: editStaffData.hourminute.split(":")[1],
        });
      }
    }
  }, [editStaffData]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { month: "short", day: "numeric" };
    const monthDay = date.toLocaleDateString("en-US", options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const time = date.toLocaleTimeString("en-US", timeOptions);
    return `${monthDay} (${time.toUpperCase()})`;
  };

  const exportData = staffDataAll.data.map((item) => ({
    "First Name": item.first_name,
    "Last Name": item.last_name,
    Email: item.email,
    Phone: item.phone,
    Role: item.role_name,
    Status: item.status === "1" ? "Active" : "Inactive",
  }));

  const colourOptions = [
    { value: "ocean", label: "Ocean" },
    { value: "blue", label: "Blue" },
    { value: "purple", label: "Purple" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
  ];

  const handleAddCustomer = (e) => {
    setAddCustomer(e);
  };

  const HandleChangeStaffPortfolio = async () => {
    try {
      const response = await staffPortfolio({
        req: {
          action: "update",
          staff_id: portfolio?.id,
          customer_id: AddCustomer.map((item) => item.value),
        },
        authToken: token,
      });
      if (response.status) {
        sweatalert.fire({
          icon: "success",
          title: "Success",
          text: response.message,
          timer: 2000,
        });
        SetRefresh(!refresh);
        setPortfolio(false);
      }
    } catch (error) {
      return;
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="content-title">
          <div className="tab-title">
            <h3 className="mt-0">Manage Staff</h3>
          </div>
        </div>
      </div>
      <div className="report-data mt-4">
        <div className="col-sm-12">
          <div className="page-title-box pt-0">
            <div className="row align-items-start">
              <div className="col-md-6"></div>
              <div className="col-md-4">
                <div className="d-flex justify-content-end mb-4">
                  <div className="">
                    {showStaffInsertTab && (
                      <button
                        type="button"
                        className="btn btn-info text-white ms-1"
                        onClick={() => {
                          setAddStaff(true);
                          setEditShowModel(false);
                          formik.resetForm();
                        }}
                      >
                        <i className="fa fa-plus" /> Add Staff
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-content mt-minus-90" id="pills-tabContent">
          <div className="d-flex justify-content-end">
            <ExportToExcel
              className="btn btn-outline-info fw-bold float-end border-3 "
              apiData={exportData}
              fileName={`Staff Details`}
            />
          </div>

          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${
                activeTab === tab.id ? "show active" : ""
              }`}
              id={tab.id}
              role="tabpanel"
            >
              <Datatable
                columns={columns}
                data={staffDataAll.data}
                filter={true}
              />
            </div>
          ))}
        </div>
      </div>
      <CommanModal
        isOpen={addStaff}
        backdrop="static"
        size="ms-7"
        title="Add Staff"
        hideBtn={true}
        handleClose={() => {
          setAddStaff(false);
          formik.resetForm();
        }}
      >
        <Formicform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Add"
          closeBtn={(e) => {
            formik.resetForm();
            setAddStaff(false);
          }}
        />
      </CommanModal>

      <CommanModal
        isOpen={portfolio}
        cancel_btn="cancel"
        hideBtn={false}
        btn_name="Save"
        title="Manage Portfolio"
        handleClose={() => setPortfolio()}
        Submit_Function={() => {
          // setPortfolio(false);
          HandleChangeStaffPortfolio();
        }}
        Submit_Cancel_Function={() => {
          setPortfolio(false);
        }}
      >
        <div className="modal-body px-0">
          <div className="row w-100">
            <div className="col-12">
              <Select
                name="colors"
                className="basic-multi-select"
                classNamePrefix="select"
                value={AddCustomer}
                options={allCustomerData.map((item) => ({
                  value: item.id,
                  label: item.customer_name,
                }))}
                onChange={handleAddCustomer}
                isMulti
              />
            </div>
          </div>
        </div>
      </CommanModal>

      <CommanModal
        isOpen={editStaff}
        backdrop="static"
        size="ms-5"
        title="Edit Staff"
        hideBtn={true}
        handleClose={() => {
          setEditStaff(false);
          formik.resetForm();
          setEditStaffData({});
        }}
      >
        <Formicform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Update"
          closeBtn={(e) => {
            formik.resetForm();
            setEditStaff(false);
            setEditStaffData({});
          }}
          additional_field={
            <div className="row mt-2 ">
              <label className="form-label">Weekly Timesheet Hours</label>
              <div className="input-group row">
                {/* Hours Input */}
                <div className="hours-div col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Hours"
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "" || Number(value) >= 0) {
                        setBudgetedHours({
                          ...budgetedHours,
                          hours: value,
                        });
                      }
                    }}
                    value={budgetedHours?.hours || ""}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    H
                  </span>
                </div>
                <div className="hours-div col-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Minutes"
                    onChange={(e) => {
                      const value = e.target.value;

                      if (
                        value === "" ||
                        (Number(value) >= 0 && Number(value) <= 59)
                      ) {
                        setBudgetedHours({
                          ...budgetedHours,
                          minutes: value,
                        });
                      } else {
                        setBudgetedHours({
                          ...budgetedHours,
                          minutes: "59",
                        });
                      }
                    }}
                    value={budgetedHours?.minutes || ""}
                  />
                  <span className="input-group-text" id="basic-addon2">
                    M
                  </span>
                </div>
              </div>
            </div>
          }
        />
      </CommanModal>

      <CommanModal
        isOpen={addCompetancy}
        backdrop="static"
        size="ms-5"
        title="Add Competency"
        hideBtn={true}
        handleClose={() => SetCompetancy(false)}
      >
        <FormGroup>
          <Row>
            {serviceDataAll.data.map((item, index) => (
              <Col key={item.id} md={index < 6 ? 6 : 6}>
                <div className="form-check">
                  <Label className="form-check-label">
                    <Input
                      type="checkbox"
                      name={item.service_name}
                      defaultChecked={item.status}
                      onChange={(e) => handleCheckboxChange(e, item.service_id)}
                      className="form-check-input new-checkbox me-2 mt-1"
                    />
                    {item.service_name}
                  </Label>
                </div>
              </Col>
            ))}
          </Row>
        </FormGroup>
        <div className="d-flex justify-content-end">
          <Button
            className="btn btn-outline-success"
            color="primary"
            onClick={handleUpdate}
          >
            <i className="far fa-save pe-1"></i>
            Update
          </Button>
        </div>
      </CommanModal>

      <CommanModal
        isOpen={staffViewLog}
        backdrop="static"
        size="ms-5"
        title="View Logs"
        hideBtn={true}
        handleClose={() => SetStaffViewLog(false)}
      >
        <FormGroup>
          <Row>
            <div className="card-body">
              <div className="analytic-dash-activity" data-simplebar="init">
                <div className="simplebar-mask1">
                  <div className="">
                    <div className="simplebar-content" style={{ padding: 0 }}>
                      <div className="activity">
                        {/* Conditional Rendering */}
                        {getActiviyLog && getActiviyLog.length > 0 ? (
                          getActiviyLog.map((item, index) => {
                            return (
                              <div className="activity-info" key={index}>
                                <div className="icon-info-activity">
                                  <i className="fa-solid fa-circle"></i>
                                </div>
                                <div className="activity-info-text">
                                  <div className="">
                                    <small className="">
                                      {formatDate(item?.created_at)}
                                    </small>
                                    <p className="">{item?.log_message}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="no-data-found">
                            <p className="text-center">
                              No Activity Logs Found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </FormGroup>
      </CommanModal>

      <CommanModal
        isOpen={deleteStaff}
        backdrop="static"
        size="ms-5"
        title="Delete Staff"
        hideBtn={true}
        handleClose={() => setDeleteStaff(false)}
      >
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="staff-select" className="form-label">
              Select Staff to Delete:
            </label>
            <select
  id="staff-select"
  value={selectedStaff || ""}
  onChange={(e) => setSelectedStaff(e.target.value)}
  className="form-select"
>
  <option value="" disabled>
    Choose Staff
  </option>
  {staffDataAll?.data
    ?.filter((staff) => staff.id !== deleteStaff && staff.id !== 1 && staff.id !== 2)
    .map((staff) => (
      <option key={staff.id} value={staff.id}>
        {staff.first_name}
      </option>
    ))}
</select>

          </div>

          {selectedStaff && (
            <button
              onClick={handleDeleteClick}
              className="btn btn-danger w-100 mt-3"
            >
              Delete
            </button>
          )}

          <button
            onClick={() => setDeleteStaff(false)}
            className="btn btn-secondary w-100 mt-2"
          >
            Cancel
          </button>
        </div>
      </CommanModal>
    </div>
  );
};

export default StaffPage;
