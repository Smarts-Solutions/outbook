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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatsAdd((prevStatsAdd) => ({
      ...prevStatsAdd,
      [name]: value,
    }));
  };

  const columns = [
    {
      name: "Status Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Created Date",
      selector: (row) => formatDate(row.created_at),
      sortable: true,
    },
    {
      name: "Last Update On",
      selector: (row) => formatDate(row.updated_at),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status_type,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row)}>
            <i className="ti-trash" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const formatDate = (date) => {
    return date ? fa_time(date) : "N/A";
  };

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
      console.log(response);
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

  const handleDelete = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = {
          req: {
            action: "delete",
            id: row.id,
          },
          authToken: token,
        };
        await dispatch(MasterStatusData(data))
          .unwrap()
          .then((response) => {
            if (response.status) {
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              GetStatus();
            }
          })
          .catch((error) => {
            console.log("Error", error);
          });
      }
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
        console.log("Error", error);
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
        console.log("Error", error);
      });
  };

  const createTask = async () => {
    if (!getStatsAdd.statusname || !getStatsAdd.statustype) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all required fields.",
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
          }).then(() => {
            setShowModal(false);
            GetStatus();
            setStatsAdd({
              statusname: "",
              statustype: "",
            });
            setEditItem(null);
          });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  useEffect(() => {
    GetStatus();
    statusTypeData();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="content-title">
          <div className="tab-title">
            <h3 className="mt-0">Status</h3>
          </div>
        </div>
        <div className="report-data mt-4 ">
          <div className="d-flex justify-content-end align-items-center">
            <div>
              <button
                type="button"
                className="btn btn-info text-white float-end ms-2"
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
              <button
                type="button"
                className="btn btn-info text-white float-end "
              >
                <i className="fa-regular fa-eye pe-1"></i> View Log
              </button>
            </div>
          </div>
          <div className="datatable-wrapper mt-minus">
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
          <div className="modal-body">
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
                  required
                  name="statusname"
                  value={getStatsAdd.statusname}
                  onChange={handleChange}
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
      </div>
    </div>
  );
};

export default Status;
