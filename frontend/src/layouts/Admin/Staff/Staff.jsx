import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Staff, Competency } from "../../../ReduxStore/Slice/Staff/staffSlice";
import { Role } from "../../../ReduxStore/Slice/Settings/settingSlice";
import { FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import sweatalert from "sweetalert2";
import Formicform from "../../../Components/ExtraComponents/Forms/Comman.form";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getDateRange } from "../../../Utils/Comman_function";
import Validation_Message from "../../../Utils/Validation_Message";

const StaffPage = () => {
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

  const [budgetedHours, setBudgetedHours] = useState({
    hours: "",
    minutes: "",
  });

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
  const [portfolio, setPortfolio] = useState(false);
  const [editStaff, setEditStaff] = useState(false);
  const [editStaffData, setEditStaffData] = useState(false);
  const [addCompetancy, SetCompetancy] = useState(false);
  const [refresh, SetRefresh] = useState(false);
  const [activeTab, setActiveTab] = useState("this-year");
  const [staffDataAll, setStaffDataAll] = useState({ loading: true, data: [] });
  const [serviceDataAll, setServiceDataAll] = useState({
    loading: true,
    data: [],
    staff_id: "",
  });
  const [roleDataAll, setRoleDataAll] = useState({ loading: true, data: [] });

  useEffect(() => {
    staffData();
    roleData();
  }, [refresh, activeTab]);

  const staffData = async () => {
    await dispatch(Staff({ req: { action: "get" }, authToken: token }))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          const filteredData = response.data.filter((item) => {
            const itemDate = new Date(item.created_at);
            const { startDate, endDate } = getDateRange(activeTab);
            return itemDate >= startDate && itemDate <= endDate;
          });

          setStaffDataAll({ loading: false, data: filteredData });
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
      selector: (row) => row.first_name + " " + row.last_name,
      sortable: true,
      width: "150px",
    },
    // {
    //   name: "Last Name",
    //   selector: (row) => row.last_name,
    //   sortable: true,
    //   width: "150px",
    // },
    {
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
      width: "auto",
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      width: "150px",
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
      sortable: true,
      width: "200px",
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
            {row.status === "1" ? "Active" : "Deactive"}
          </span>
        </div>
      ),
      width: "80px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {/* <button className='edit-icon' onClick={() => setIsModalOpen(true)}> <i className="ti-user" /></button> */}
          <button
            className="secondary-icon"
            onClick={() => {
              setPortfolio(true);
              GetAllCustomer();
            }}
          >
            <i className="ti-briefcase" />
          </button>
          {showStaffUpdateTab && (
            <button
              className="edit-icon"
              onClick={(e) => {
                setEditStaff(true);
                setEditStaffData(row);
              }}
            >
              {" "}
              <i className="ti-pencil" />
            </button>
          )}
          {showStaffInsertTab && (
            <button
              className="add-icon fs-6"
              onClick={(e) => {
                ServiceData(row);
                SetCompetancy(true);
              }}
            >
              <i className="fa fa-plus" /> Competency
            </button>
          )}

          <button className="view-icon fs-6">
            <i className="fa fa-eye" /> Logs
          </button>

          {/* {row.role === "ADMIN" || row.role === "SUPERADMIN"
            ? showStaffDeleteTab && (
                <button className="delete-icon" disabled>
                  <i className="ti-trash text-danger" />
                </button>
              )
            : showStaffDeleteTab && (
                <button
                  className="delete-icon"
                  onClick={(e) => DeleteStaff(row)}
                >
                  <i className="ti-trash text-danger" />
                </button>
              )} */}
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "400px",
    },
  ];

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
      status: "",
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required(Validation_Message.FirstNameValidation),
      last_name: Yup.string().required(Validation_Message.LastNameValidation),
      email: Yup.string()
        .email(Validation_Message.EmailValidation)
        .required(Validation_Message.EmailIsRequire),
      phone: Yup.string()
        .matches(/^[0-9]+$/, Validation_Message.PhoneValidation)
        .required(Validation_Message.PhoneIsRequire),
      password: editStaff
        ? Yup.string().min(8, Validation_Message.PasswordValidation)
        : Yup.string()
            .min(8, Validation_Message.PasswordValidation)
            .required(Validation_Message.PasswordIsRequire),
      role: Yup.string().required(Validation_Message.RoleValidation),
      status: Yup.string().required(Validation_Message.StatusValidation),
    }),

    onSubmit: async (values) => {
      let req = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        role_id: values.role,
        status: values.status,
        created_by: StaffUserId.id,
        hourminute: `${budgetedHours.hours || "00"}:${budgetedHours.minutes || "00"}`,
      };

      if (editStaff) {
        req.id = editStaffData && editStaffData.id;
      }



      // return
      await dispatch(
        Staff({
          req: { action: editStaff ? "update" : "add", ...req },
          authToken: token,
        })
      )
        .unwrap()
        .then(async (response) => {
          sweatalert
            .fire({
              icon: "success",
              title: "Success",
              text: response.message,
              timer: 2000,
            })
            .then(() => {
              if (response.status) {
                setAddStaff(false);
                setEditStaff(false);
                SetRefresh(!refresh);
                formik.resetForm();
                window.location.reload();
              } else {
                sweatalert.fire({
                  icon: "error",
                  title: "Oops...",
                  text: response.message,
                });
              }
            });
        })
        .catch((error) => {
          return;
        });
    },
  });

  const fields = [
    {
      type: "text",
      name: "first_name",
      label: "First Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter First Name",
    },
    {
      type: "text",
      name: "last_name",
      label: "Last Name",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Last Name",
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
      type: "text",
      name: "phone",
      label: "Phone",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Phone Number",
    },
    {
      type: "password",
      name: "password",
      label: "Password",
      label_size: 12,
      col_size: 6,
      disable: false,
      placeholder: "Enter Password",
      showWhen: (values) => !editStaff,
    },
    {
      type: "select",
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
      type: "select",
      name: "status",
      label: "Status",
      label_size: 12,
      col_size: 6,
      disable: false,
      options: [
        { label: "Active", value: "1" },
        { label: "Deactive", value: "0" },
      ],
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
          await dispatch(
            Staff({ req: { action: "delete", id: row.id }, authToken: token })
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
                SetRefresh(!refresh);
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
      formik.setFieldValue("phone", editStaffData.phone || "null");
      formik.setFieldValue("role", editStaffData.role_id || "null");
      formik.setFieldValue("status", editStaffData.status || "null");
    
      console.log(editStaffData.hourminute);
     if(editStaffData.hourminute){
      setBudgetedHours({
        hours: editStaffData.hourminute.split(":")[0],
        minutes: editStaffData.hourminute.split(":")[1],
      });
     }
    }
  }, [editStaffData]);

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
              <div className="col-md-6">
                {/* Dropdown for selecting tabs */}
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-end">
                  <div className="form-group w-50">
                    <select
                      className="form-control"
                      id="tabSelect"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.id} value={tab.id}>
                          {tab.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-25">
                    {showStaffInsertTab && (
                      <button
                        type="button"
                        className="btn btn-info text-white float-end"
                        onClick={() => setAddStaff(true)}
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
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab-pane fade ${
                activeTab === tab.id ? "show active" : ""
              }`}
              id={tab.id}
              role="tabpanel"
            >
              {/* Your Datatable component */}
              <Datatable
                columns={columns}
                data={staffDataAll.data}
                filter={true}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Add Staff */}
      <CommanModal
        isOpen={addStaff}
        backdrop="static"
        size="ms-5"
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
        />
      </CommanModal>
      {/* CLOSE Add Staff */}

      {/* Manage Portfolio */}
      <CommanModal
        isOpen={portfolio}
        cancel_btn="cancel"
        hideBtn={false}
        btn_name="Save"
        title="Manage Portfolio"
        handleClose={() => setPortfolio(false)}
        Submit_Function={() => {
          setPortfolio(false);
        }}
        Submit_Cancel_Function={() => {
          setPortfolio(false);
        }}
      >
        <div className="modal-body px-0">
          <div className="row w-100">
            <div className="col-9">
              <div className="search-box ms-2">
                <i className="ri-search-line search-icon" />
                <input
                  type="text"
                  className="form-control search"
                  placeholder="Search Customer..."
                />
              </div>
            </div>
            <div className="col-3">
              <div>
                <button
                  type="button"
                  className="btn btn-info add-btn"
                  data-bs-toggle="modal"
                  id="create-btn"
                  data-bs-target="#showModal123"
                >
                  <i className="fa fa-plus"></i> Add
                </button>
              </div>
            </div>
            <div className="col-md-6" />
            <div className="table-responsive  mt-3 mb-1">
              <table
                className="table align-middle table-nowrap"
                id="customerTable"
              >
                <thead className="table-light">
                  <tr>
                    <th className="" data-="customer_name">
                      Company Name
                    </th>

                    <th className="tabel_left" data-="action" width="80">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="list form-check-all">
                  {allCustomerData &&
                    allCustomerData.map((item, index) => (
                      <tr className="tabel_new" key={index}>
                        <td>{item.customer_name}</td>
                        <td className="tabel_left">
                          <div className=" gap-2">
                            <div className="remove">
                              <button
                                onclick="deleteRecordModalshow()"
                                className="text-decoration-none remove-item-btn delete-icon"
                              >
                                <i className="ti-trash text-danger "></i>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {/* <tr className="tabel_new">
                    <td>Outbooks Outsourcing Pvt Ltd</td>

                    <td className="tabel_left">
                      <div className=" gap-2">
                        <div className="remove">
                          <a
                            onclick="deleteRecordModalshow()"
                            className="text-decoration-none remove-item-btn"
                          >
                            <i className="ti-trash text-danger fs-5"></i>
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr> */}
                </tbody>
              </table>
              <div className="noresult" style={{ display: "none" }}>
                <div className="text-center">
                  <lord-icon
                    src="https://cdn.lordicon.com/msoeawqm.json"
                    trigger="loop"
                    colors="primary:#121331,secondary:#08a88a"
                    style={{ width: 75, height: 75 }}
                  />
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                  <p className="text-muted mb-0">
                    We've searched more than 150+ Orders We did not find any
                    orders for you search.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommanModal>
      {/* CLOSE Manage Portfolio */}

      {/* Edit Staff */}
      <CommanModal
        isOpen={editStaff}
        backdrop="static"
        size="ms-5"
        title="Edit Staff"
        hideBtn={true}
        handleClose={() => {
          setEditStaff(false);
          // formik.resetForm();
        }}
      >
        <Formicform
          fieldtype={fields.filter(
            (field) => !field.showWhen || field.showWhen(formik.values)
          )}
          formik={formik}
          btn_name="Update"
          closeBtn={(e) => setEditStaff(false)}
          additional_field={
            <div className="row">
            <div className="col-lg-8">
              <div className="mb-3">
                <label className="form-label">Budgeted Time</label>
                <div className="input-group">
                  {/* Hours Input */}
                  <div className="hours-div">
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

                  {/* Minutes Input */}
                  <div className="hours-div">
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
                        }else{
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
            </div>
            </div>
          }
        />
      </CommanModal>
      {/* CLOSE Edit Staff */}

      {/* Add Competancy */}
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
      {/* CLOSE Add Competancy */}

      {/* SET ACCESS */}
      {/* {isModalOpen && (
                <SetAccessModal isOpen={isModalOpen} onClose={closeModal} />
            )} */}
      {/* CLOSE SET ACCESS */}
    </div>
  );
};

export default StaffPage;
