import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { customerSubInternalApi } from "../../../ReduxStore/Slice/Settings/settingSlice";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import Modal from "../../../Components/ExtraComponents/Modals/Modal";
import sweatalert from "sweetalert2";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

const SubInternal = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    const location = useLocation();
    const dispatch = useDispatch();
    const [getSubInternalData, setSubInternalData] = useState([]);
    const [modalData, setModalData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);



    const customerSubInternalData = async (req) => {
        if (location?.state?.Id) {
            req = {
                ...req,
                internal_id: location?.state?.Id,
            };
        }
        const data = { req: req, authToken: token };
        await dispatch(customerSubInternalApi(data))
            .unwrap()
            .then(async (response) => {
                if (req.action == "add" || req.action == "update" || req.action == "delete") {
                    if(response.status) {
                    sweatalert.fire({
                        title: response.message,
                        icon: "success",
                        timer: 10000,
                    });
                    setTimeout(() => {
                        fetchApiData()
                    }, 1000);
                    }
                    else {
                        sweatalert.fire({
                            title: response.message,
                            icon: "error",
                            timer: 10000,
                        });
                    }
                } else {
                    if (response.status) {
                        setSubInternalData(response.data || []);
                    } else {
                        setSubInternalData({ loading: false, data: [] });
                    }
                }
            })
            .catch((error) => {
                return;
            });
    };

    useEffect(() => {
        fetchApiData();
    }, []);

    const fetchApiData = () => {
        const req = {
            action: "getAll",
            internal_id: location?.state?.Id,
        };
        customerSubInternalData(req);
    };

    const columnSubInternal = [
        {
            name: "Internal Task Name",
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
        },
        {
            name: "Actions",
            cell: (row) => (
                <> <div className="dropdown d-lg-none setting-drop-down">
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
                  <button className="edit-icon dropdown-item mb-3" onClick={() => handleEdit(row)}>
                        <i className="ti-pencil" />
                    </button>
                    <button className="delete-icon" onClick={() => handleDelete(row)}>
                        <i className="ti-trash text-danger" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-lg-flex d-none">
                    <button className="edit-icon" onClick={() => handleEdit(row)}>
                        <i className="ti-pencil" />
                    </button>
                    <button className="delete-icon" onClick={() => handleDelete(row)}>
                        <i className="ti-trash text-danger" />
                    </button>
                </div>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
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
        validation: {},
        onSubmit: async (values) => {
            let req = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                phone: values.phone,
                password: values.password,
                role_id: values.role,
                status: values.status,
            };
        },
    });

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setModalData((prevModalData) => ({
            ...prevModalData,
            fields: prevModalData.fields.map((field) =>
                field.name === name ? { ...field, value: value } : field
            ),
        }));
    };

    const handleAdd = (e) => {
        setModalData({
            ...modalData,
            fields: [
                {
                    type: "text",
                    name: "name",
                    label: " Internal Task",
                    placeholder: "Enter Internal Task",
                },
                // {
                //     type: "select",
                //     name: "status",
                //     label: "Status",
                //     placeholder: "Select Status",
                //     options: [
                //         { label: "Active", value: "1" },
                //         { label: "Deactive", value: "0" },
                //     ],
                // },
            ],
            title: " Internal Task",

        });

        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (data) => {
        setModalData({
            ...modalData,
            fields: [
                {
                    type: "text",
                    name: "name",
                    label: "Internal Task",
                    placeholder: "Enter Internal Task",
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
            title: " Internal Task",
            id: data?.id,
            internal_id: data.internal_id,
        });

        setIsEdit(true);
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalData.fields[0]?.value?.trim() == "" || modalData.fields[0].value == undefined) {
            sweatalert.fire({
                title: "Please enter " + modalData.fields[0].label,
                icon: "warning",
                timer: 2000,
            });
            return;
        }
        const req = { action: isEdit ? "update" : "add" };
        if (isEdit) {
            req.id = modalData?.id;
        }
        modalData.fields.map((field) => {
            req[field.name] = field.value;
            if (field.name == "status") {
                req.status = field.value || '1';
            }
        });
        customerSubInternalData(req);
        setModalData({});
        setIsModalOpen(false);
    };

    const handleDelete = (data) => {
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
                        id: data?.id,
                    };
                    customerSubInternalData(req);

                }
            });
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="card mt-4">
                    <div className="card-header align-items-center step-header-blue d-flex">
                        <button
                            type="button"
                            className="btn p-0"
                            onClick={() => {
                                sessionStorage.setItem('settingTab', location?.state?.settingTab);
                                window.history.back()}}
                        >
                            <i className="pe-3 fa-regular fa-arrow-left-long text-white fs-4"></i>
                        </button>
                        <h4 className="card-title"> Internal Task</h4>
                    </div>
                    <div className="card-body">
                        <div className="d-flex justify-content-end align-items-center">
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-info text-white float-end"
                                    onClick={(e) => handleAdd(e, "1")}
                                    style={{zIndex:"9"}}
                                >
                                    <i className="fa fa-plus" /> Add Internal Task
                                </button>
                            </div>
                        </div>
                        <div className="datatable-wrapper mt-minus">
                            <Datatable
                                filter={true}
                                columns={columnSubInternal}
                                data={getSubInternalData && getSubInternalData || []}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    modalId="exampleModal3"
                    title={isEdit ? "Edit " + modalData.title : "Add " + modalData.title}
                    fields={modalData.fields}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalData({});
                    }}
                    onSave={handleSave}
                    onChange={handleModalChange}
                    buttonName={
                        <>
                          <i className={`far ${isEdit ? 'fa-edit' : 'fa-save'}`}></i> {isEdit ? "Update" : "Save"}
                        </>
                      }
                    />
            )}
        </div>
    );
};

export default SubInternal;
