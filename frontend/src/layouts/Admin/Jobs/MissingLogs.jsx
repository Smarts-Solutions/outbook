import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { GetMissingLog, AddMissionLog } from '../../../ReduxStore/Slice/Customer/CustomerSlice';
import { getProfile } from '../../../ReduxStore/Slice/Staff/staffSlice';
import sweatalert from 'sweetalert2';
import { AddMissionLogErros } from '../../../Utils/Common_Message';

const MissingLogs = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [addmissinglogs, setAddmissinglogs] = useState(false);
  const [viewmissinglogs, setViewmissinglogs] = useState(false);
  const [getMissingLogListData, setGetMissingLogListData] = useState([]);
  const [getProfileDetails, setGetProfileDetails] = useState([]);
  const [singleMissionData, setSingleMissionData] = useState([]);
  const [errors1, setErrors1] = useState({});


  const [missionLogAllInputData, setMissionAllInputLogData] = useState({
    missing_log: "1",
    missing_paperwork: "1",
    missing_log_sent_on: "",
    missing_log_prepared_date: "",
    missing_log_title: "",
    missing_log_reviewed_by: "",
    missing_log_reviewed_date: "",
    missing_paperwork_received_on: "",
    missing_log_document: "",
    status: "",
  });

  const resetForm = () => {
    setMissionAllInputLogData({
      ...missionLogAllInputData,
      missing_log: "1",
      missing_paperwork: "1",
      missing_log_sent_on: "",
      missing_log_prepared_date: "",
      missing_log_title: "",
      missing_log_reviewed_date: "",
      missing_paperwork_received_on: "",
      missing_log_document: "",
      status: "",
    });
  };


  useEffect(() => {
    Profile()
    GetMissingLogDetails();
  }, []);


  const Profile = async (e) => {
    const req = { id: staffDetails.id }
    await dispatch(getProfile(req))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetProfileDetails(response.data)
          setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_reviewed_by: response.data.first_name + " " + response.data.last_name })
        }
        else {
          setGetProfileDetails([])
        }

      })
      .catch((error) => {
        console.log("Error", error);
      });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'missing_log_document') {
      const files = e.target.files;
      var fileArray;
      if (files && typeof files[Symbol.iterator] === "function") {
        fileArray = Array.from(files);
        setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_document: fileArray });
      }
    }
    else {
      setMissionAllInputLogData({ ...missionLogAllInputData, [name]: value });
    }
    validate(name, value);
  };


  const validate = (name, value) => {
    const newErrors = { ...errors1 };
    if (!value) {
      switch (name) {
        case "missing_log":
          newErrors[name] = AddMissionLogErros.missing_log;
          break;
        case "missing_paperwork":
          newErrors[name] = AddMissionLogErros.missing_paperwork;
          break;
        case "missing_log_sent_on":
          newErrors[name] = AddMissionLogErros.missing_log_sent_on;
          break;
        case "missing_log_prepared_date":
          newErrors[name] = AddMissionLogErros.missing_log_prepared_date;
          break;
        case "missing_log_title":
          newErrors[name] = AddMissionLogErros.missing_log_title;
          break;
        case "missing_log_reviewed_by":
          newErrors[name] = AddMissionLogErros.missing_log_reviewed_by;
          break;
        case "missing_log_reviewed_date":
          newErrors[name] = AddMissionLogErros.missing_log_reviewed_date;
          break;
        case "missing_paperwork_received_on":
          newErrors[name] = AddMissionLogErros.missing_paperwork_received_on;
          break;
        case "missing_log_document":
          newErrors[name] = AddMissionLogErros.missing_log_document;
          break;
        case "status":
          newErrors[name] = AddMissionLogErros.status;
          break;
        default:
          break;
      }
    }
    else {
      delete newErrors[name];
      setErrors1((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors1((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0;
  };

  const validateAllFields = () => {
    let isValid = true;
    for (const key in missionLogAllInputData) {
      if (!validate(key, missionLogAllInputData[key])) {
        isValid = false;
      }
    }
    return isValid;
  };



  const GetMissingLogDetails = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }

    await dispatch(GetMissingLog(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setGetMissingLogListData(response.data);
        }
        else {
          setGetMissingLogListData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const HandleMissionView = async (row) => {
    const req = { action: "getSingleView", id: row.id }
    const data = { req: req, authToken: token }
    await dispatch(GetMissingLog(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setSingleMissionData(response.data[0]);
        }
        else {
          setSingleMissionData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleSubmit = async (e) => {
    if (!validateAllFields()) {
      return;
    }
    const req = { action: "add", job_id: location.state.job_id, missionDetails: missionLogAllInputData }
    const data = { req: req, authToken: token }
    await dispatch(AddMissionLog(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          GetMissingLogDetails()
          setAddmissinglogs(false);
          resetForm();
          sweatalert.fire({
            icon: 'success',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          });

        }
        else {
          sweatalert.fire({
            icon: 'error',
            title: response.message,
            timerProgressBar: true,
            showConfirmButton: true,
            timer: 1500
          });

        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const columns = [
    { name: 'Missing Log Sent On', selector: row => row.missing_log_sent_on, sortable: true },
    { name: 'Missing Log Title', selector: row => row.missing_log_title, sortable: true },
    { name: 'Missing Paperwork Received On', selector: row => row.missing_paperwork_received_on, sortable: true },
    { name: 'status', selector: row => row.status == 1 ? "Completed" : "Incomplete", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => { HandleMissionView(row); setViewmissinglogs(true) }}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className=''>
      <div className='row'>
        <div className='col-md-8'>
          <div className='tab-title'>
            <h3>Missing Logs</h3>
          </div>
        </div>
        <div className='col-md-4'>
          <div>
            <button type="button" className="btn btn-info text-white float-end" onClick={() => setAddmissinglogs(true)}>
              <i className="fa-regular fa-plus pe-1"></i> Add Missing Logs
            </button>
          </div>
        </div>
      </div>

      <div className='datatable-wrapper '>
        <Datatable filter={true} columns={columns} data={getMissingLogListData} />
      </div>

      <CommonModal
        isOpen={addmissinglogs}
        backdrop="static"
        size="lg"
        cancel_btn={false}
        btn_2="true"
        btn_name="Save"
        title="Add Missing Log"
        hideBtn={false}

        handleClose={() => {
          setAddmissinglogs(false);
          resetForm();
        }}
        Submit_Function={() => handleSubmit()}
      >
        <div className="row">

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log?
              </label>
              <select
                name="missing_log"
                id="missing_log"
                className="form-select mb-3 ismissinglog"
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log}
              >
                <option value="1" selected>Yes</option>
                <option value="0">No</option>
              </select>
              {errors1["missing_log"] && (
                <div className="error-text">
                  {errors1["missing_log"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog2" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Paperwork?
              </label>
              <select
                id="missing_paperwork"
                name="missing_paperwork"
                className="form-select mb-3"
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_paperwork}
              >
                <option value="1" selected>Yes</option>
                <option value="0">No</option>
              </select>
              {errors1["missing_paperwork"] && (
                <div className="error-text">
                  {errors1["missing_paperwork"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Sent On
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="missing_log_sent_on"
                name="missing_log_sent_on"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_sent_on}
              />
              {errors1["missing_log_sent_on"] && (
                <div className="error-text">
                  {errors1["missing_log_sent_on"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog1" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Prepared Date
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="missing_log_prepared_date"
                name="missing_log_prepared_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_prepared_date}
              />
              {errors1["missing_log_prepared_date"] && (
                <div className="error-text">
                  {errors1["missing_log_prepared_date"]}
                </div>
              )}


            </div>
          </div>
          <div id="MissingLog3" className="mb-3 col-lg-6">
            <label htmlFor="firstNameinput" className="form-label">
              Missing Log Title
            </label>
            <input
              type="text"
              defaultValue=""
              className="form-control"
              placeholder="Missing Log Title"
              id="missing_log_title"
              name="missing_log_title"

              onChange={(e) => handleChange(e)}
              value={missionLogAllInputData.missing_log_title
              }
            />
            {errors1["missing_log_title"] && (
              <div className="error-text">
                {errors1["missing_log_title"]}
              </div>
            )}
          </div>
          <div id="MissingLog4" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed By
              </label>
              <input
                type="text"
                defaultValue=""
                className="form-control"
                placeholder="Missing Log Reviewed By"
                id="missing_log_reviewed_by"
                name="missing_log_reviewed_by"
                disabled={true}
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_by}
              />
              {errors1["missing_log_reviewed_by"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_by"]}
                </div>
              )}

            </div>
          </div>
          <div id="MissingLog5" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Reviewed Date
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="missing_log_reviewed_date"
                name="missing_log_reviewed_date"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_log_reviewed_date}
              />
              {errors1["missing_log_reviewed_date"] && (
                <div className="error-text">
                  {errors1["missing_log_reviewed_date"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog7" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Paperwork Received On
              </label>
              <input
                type="date"
                className="form-control"
                data-provider="flatpickr"
                id="missing_paperwork_received_on"
                name="missing_paperwork_received_on"
                placeholder="Last Name"
                onChange={(e) => handleChange(e)}
                value={missionLogAllInputData.missing_paperwork_received_on}
              />
              {errors1["missing_paperwork_received_on"] && (
                <div className="error-text">
                  {errors1["missing_paperwork_received_on"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog8" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Document
              </label>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                id="missing_log_document"
                name="missing_log_document"
                onChange={(event) => { handleChange(event) }}
                className="custom-file-input form-control"
              />
              {errors1["missing_log_document"] && (
                <div className="error-text">
                  {errors1["missing_log_document"]}
                </div>
              )}
            </div>
          </div>
          <div id="MissingLog6" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Status
              </label>
              <div style={{ display: "flex" }}>
                <div>
                  <input
                    type="radio"
                    id="complete"
                    name="status"
                    value="1"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "1"}
                  />
                  &nbsp; <label htmlFor="complete">Complete</label>

                </div>
                &nbsp;
                <div style={{ marginLeft: 10 }}>
                  <input
                    type="radio"
                    id="incomplete"
                    name="status"
                    value="0"
                    onChange={(e) => handleChange(e)}
                    checked={missionLogAllInputData.status === "0"}
                  />
                  &nbsp; <label htmlFor="incomplete">Incomplete</label>

                </div>

              </div>
              {errors1["status"] && (
                <div className="error-text">
                  {errors1["status"]}
                </div>
              )}

            </div>
          </div>

        </div>


      </CommonModal>

      <CommonModal
        isOpen={viewmissinglogs}
        backdrop="static"
        size="md"
        title="View Missing Logs"
        hideBtn={true}
        handleClose={() => {
          setViewmissinglogs(false);
          // formik.resetForm();
        }}
        Submit_Function={() => handleSubmit()}
      >
        <div className="av">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Missing Log Sent On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{singleMissionData && singleMissionData?.missing_log_sent_on}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Missing Paperwork Received On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{singleMissionData && singleMissionData?.missing_paperwork_received_on}</span>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Status
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">On Hold</span>
            </div>
          </div> */}
        </div>


      </CommonModal>
    </div>
  );
}

export default MissingLogs;
