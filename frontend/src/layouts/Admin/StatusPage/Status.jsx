import React, { useState, useEffect } from "react";
import Datatable from "../../../Components/ExtraComponents/Datatable";
import {
  MasterStatusData,
  StatusType,
} from "../../../ReduxStore/Slice/Settings/settingSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { fa_time } from "../../../Utils/Date_formet";
import CommanModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { convertDate } from "../../../Utils/Comman_function";

import ExportToExcel from "../../../Components/ExtraComponents/ExportToExcel";
import { use } from "react";

import { JobAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";

const Status = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [statusTypeDataAll, setStatusTypeDataAll] = useState([]);
  const [statusDataAll, setStatusDataAll] = useState([]);
  const [getStatsAdd, setStatsAdd] = useState({
    statusname: "",
    statustype: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [getAccessData, setAccessData] = useState({ insert: 0 });
  const role = JSON.parse(localStorage.getItem("role"));
  const [DeleteStatus, setDeleteStatus] = useState(false);
  const [replaceStatue, setReplaceStatue] = useState(null);
  const [JobData, setJobData] = useState([]);

  const accessData =
    JSON.parse(localStorage.getItem("accessData") || "[]").find(
      (item) => item.permission_name === "status"
    )?.items || [];

  useEffect(() => {
    if (accessData.length === 0) return;
    const updatedAccess = { insert: 0 };
    accessData.forEach((item) => {
      if (item.type === "insert") updatedAccess.insert = item.is_assigned;
      setAccessData(updatedAccess);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatsAdd((prevStatsAdd) => ({
      ...prevStatsAdd,
      [name]: value,
    }));
  };
  const rows = [
    { id: 1, status_type: "completed" },
    { id: 2, status_type: "pending" },
    { id: 3, status_type: "hold" },
    { id: 4, status_type: "rejected" },
  ];

  // Function to determine the CSS class based on status_type
  const getStatusClass = (status_type) => {
    switch (status_type) {
      case "completed":
        return "text-success";
      case "pending":
        return "text-warning";
      case "hold":
        return "text-primary";
      case "rejected":
        return "text-danger";
      default:
        return "";
    }
  };

  const columns = [
    {
      name: "Detailed Status",
      selector: (row) => row.name,
      cell: (row) => <div title={row.name}>{row.name}</div>,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => convertDate(row.created_at),
      sortable: true,
    },
    {
      name: "Last Update On",
      selector: (row) => convertDate(row.updated_at),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status_type,
      cell: (row) => (
        <span className={getStatusClass(row.status_type)}>
          {row.status_type}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex justify-content-end">
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            <i className="ti-pencil" />
          </button>
          {/* {row.is_disable=="0" && <button className="delete-icon" onClick={() => handleDelete(row)}>  */}
          {row.is_disable == "0" && (
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
    },
  ];

  const handleEdit = async (row) => {
    // Set the item to be edited
    setEditItem(row);
    setStatsAdd({
      statusname: row.name, // Adjust field names as needed
      statustype: row.status_type, // Adjust field names as needed
    });

    // Show the modal
    setShowModal(true);
  };

  const handleEdit1 = async (row) => {
    // Validation before making API request
    if (!getStatsAdd.statusname || !getStatsAdd.statustype) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Status name and type are required.",
      });
      return;
    }
    try {
      const data = {
        req: {
          action: "update",
          id: editItem.id,
          name: getStatsAdd.statusname,
          status_type_id: getStatsAdd.statustype,
        },
        authToken: token,
      };

      const response = await dispatch(MasterStatusData(data)).unwrap();

      if (response.status) {
        Swal.fire({
          title: "Updated!",
          text: "Status has been successfully updated.",
          icon: "success",
        }).then(() => {
          setShowModal(false);

          GetStatus();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: response.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the status.",
      });
    }
  };

  const handleDelete = async (row) => {

    const data = {
      req: {
        action: "delete",
        id: DeleteStatus.id,
        replace_id: replaceStatue,
      },
      authToken: token,
    };
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
          GetStatus();
          setDeleteStatus(false);
          setReplaceStatue(null);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const GetStatus = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusDataAll(response.data);
        } else {
          setStatusDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const statusTypeData = async () => {
    const data = { req: { action: "get" }, authToken: token };
    await dispatch(StatusType(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setStatusTypeDataAll(response.data);
        } else {
          setStatusTypeDataAll([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  const createTask = async () => {
    if (!getStatsAdd.statusname?.trim() || !getStatsAdd.statustype?.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    const data = {
      req: {
        action: editItem ? "update" : "add",
        id: editItem ? editItem.id : undefined,
        name: getStatsAdd.statusname,
        status_type_id: getStatsAdd.statustype,
      },
      authToken: token,
    };

    await dispatch(MasterStatusData(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          Swal.fire({
            title: editItem ? "Updated!" : "Created!",
            text: editItem
              ? "Your status has been updated."
              : "Your status has been created.",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            setShowModal(false);
            GetStatus();
            setStatsAdd({
              statusname: "",
              statustype: "",
            });
            setEditItem(null);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Failed !",
            text: response.message,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    GetStatus();
    statusTypeData();
  }, []);

  const exportData = statusDataAll.map((item) => ({
    "Status Name": item.name,
    "Status Type": item.status_type,
    "Created Date": convertDate(item.created_at),
    "Last Update On": convertDate(item.updated_at),
  }));

  const JobDetails = async () => {
    const req = { action: "getByStatus", status_id: DeleteStatus?.id };
    const data = { req: req, authToken: token };
    await dispatch(JobAction(data))
      .unwrap()
      .then(async (response) => {

        console.log("JobData -- ", response);
        if (response.status) {
          setJobData(response.data);
        } else {
          setJobData([]);
        }
      })
      .catch((error) => {
        return;
      });
  };

  useEffect(() => {
    if (DeleteStatus?.id) {
      JobDetails();
    }
  }, [DeleteStatus]);

  return (
    <div>
      <div className="container-fluid">
        <div className="content-title">
          <div className="tab-title">
            <div className="row">
              <div className="col-12 col-sm-6">
                <h3 className="mt-0">Status</h3>
              </div>
              <div className="col-12 col-sm-6">
                <div className="d-block d-flex justify-content-sm-end align-items-center mt-3 mt-sm-0">
                  <div>
                    {getAccessData.insert === 1 ||
                      role === "ADMIN" ||
                      role === "SUPERADMIN" ? (
                      <button
                        type="button"
                        className="btn btn-info text-white float-md-end  "
                        onClick={() => {
                          setShowModal(true);
                          setEditItem(null);
                          setStatsAdd({
                            statusname: "",
                            statustype: "",
                          });
                        }}
                      >
                        <i className="fa fa-plus pe-1" /> Add Status
                      </button>
                    ) : (
                      <div className="mt-5"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="report-data mt-4 ">
          <div className="d-flex justify-content-end">
            <ExportToExcel
              className="btn btn-outline-info fw-bold float-end border-3 "
              apiData={exportData}
              fileName={`Stauts`}
            />
          </div>

          <div className="datatable-wrapper  ">
            <Datatable filter={true} columns={columns} data={statusDataAll} />
          </div>
        </div>

        <CommanModal
          isOpen={showModal}
          backdrop="static"
          size="ms-5"
          title={editItem ? "Edit Status" : "Add Status"}
          hideBtn={false}
          handleClose={() => {
            setShowModal(false);
          }}
          cancel_btn={true}
          btn_name="Save"
          Submit_Function={editItem ? handleEdit1 : createTask}
          Submit_Cancel_Function={() => {
            setShowModal(false);
          }}
        >
          <div className="">
            <form className="tablelist-form">
              <div className="mb-3">
                <label htmlFor="customername-field" className="form-label">
                  Status Name
                </label>
                <input
                  type="text"
                  id="customername-field"
                  className="form-control"
                  placeholder="Enter Status Name"
                  autoFocus
                  required
                  name="statusname"
                  value={getStatsAdd.statusname}
                  onChange={handleChange}
                  maxLength={50}
                />
              </div>
              <div className="col-lg-12">
                <div className="mb-3">
                  <label htmlFor="VAT_dropdown1" className="form-label">
                    Status Type
                  </label>
                  <select
                    id="VAT_dropdown1"
                    className="form-select mb-3"
                    name="statustype"
                    value={getStatsAdd.statustype}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Select a status
                    </option>
                    {statusTypeDataAll &&
                      statusTypeDataAll.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.type}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </form>
          </div>
        </CommanModal>

        <CommanModal
          isOpen={DeleteStatus}
          backdrop="static"
          size="ms-5"
          title="Delete Status"
          hideBtn={true}
          handleClose={() => setDeleteStatus(false)}
        >
          <div className="modal-body">
            <div className="text-start mb-3">
              <h5 className="text-danger fw-bold">
                <i className="bi bi-trash3"></i> Delete Status:{" "}
                <span className="text-dark">{DeleteStatus?.name}</span>
              </h5>
            </div>


            {
              JobData.length > 0 ?

                <>
                  <div className="mb-3">
                    <label htmlFor="staff-select" className="form-label">
                      Select Status to Replace:
                    </label>
                    <select
                      id="staff-select"
                      value={replaceStatue || ""}
                      onChange={(e) => setReplaceStatue(e.target.value)}
                      className="form-select"
                      
                    >
                      <option value="" disabled>
                        Choose Status
                      </option>
                      {statusDataAll
                        .filter((staff) => staff.id !== DeleteStatus?.id)
                        .map((staff) => (
                          <option key={staff.id} value={staff.id}>
                            {staff.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {replaceStatue && (
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger w-100 mt-3"
                    >
                      Delete
                    </button>
                  )}

                  <button
                    onClick={() => setDeleteStatus(false)}
                    className="btn btn-secondary w-100 mt-2"
                  >
                    Cancel
                  </button>

                  {JobData.length > 0 && (
                    <div className="mb-4">
                      <h6 className="fw-bold text-primary">
                        <i className="bi bi-people"></i> Job Assigned:
                      </h6>
                      <ul className="list-group">
                        <label className="">Job ID</label>
                        {JobData.map((customer) => (
                          <li
                            key={customer.job_id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            {/* <span className="text-dark">Customer : {customer?.customer_name} , Client : {customer?.client_name} , Job Code : {customer?.job_code_id}</span> */}
                            <div className="pop-boxx1 d-flex justify-content-between align-items-center"><span>{customer?.customer_name}</span> <span>{customer?.client_name}</span> <span>{customer?.job_code_id}</span></div>

                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                </>
                :

                <>
                  <button
                    onClick={handleDelete}
                    className="btn btn-danger w-100 mt-3"
                  >
                    Delete
                  </button>
                </>


            }








          </div>
        </CommanModal>
      </div>
    </div>
  );
};

export default Status;
