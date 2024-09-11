import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { GetMissingLog } from '../../../ReduxStore/Slice/Customer/CustomerSlice';
import { getProfile } from '../../../ReduxStore/Slice/Staff/staffSlice';

const MissingLogs = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const [addmissinglogs, setAddmissinglogs] = useState(false);
  const [viewmissinglogs, setViewmissinglogs] = useState(false);
  const [getMissingLogListData, setGetMissingLogListData] = useState([]);
  const [getProfileDetails, setGetProfileDetails] = useState([]);
  const [singleMissionData, setSingleMissionData] = useState([]);

  const [missionLogAllInputData, setMissionAllInputLogData] = useState({
    missing_log: "",
    missing_paperwork: "",
    missing_log_sent_on: "",
    missing_log_prepared_date: "",
    missing_log_title: "",
    missing_log_reviewed_by: "",
    missing_log_reviewed_date: "",
    missing_paperwork_received_on: "",
    missing_log_document: "",
    status: "",
  });


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


  const GetMissingLogDetails = async () => {
    const req = { action: "get", job_id: 9 }
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


  const columns = [
    { name: 'Missing Log Sent On', selector: row => row.missing_log_sent_on, sortable: true },
    { name: 'Missing Log Title', selector: row => row.missing_log_title, sortable: true },
    { name: 'Missing Paperwork Received On', selector: row => row.missing_paperwork_received_on, sortable: true },
    { name: 'status', selector: row => row.status == 1 ? "Completed" : "Incomplete", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() =>{ HandleMissionView(row); setViewmissinglogs(true)}}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];



  console.log("singleMissionData", singleMissionData && singleMissionData);


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
        cancel_btn="true"
        btn_2="true"
        btn_name="Save"
        title="Add Missing Log"
        hideBtn={false}
        handleClose={() => {
          setAddmissinglogs(false);

        }}>
        <div className="row">

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log?
              </label>
              <select
                id="search-select"
                className="form-select mb-3 ismissinglog"
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log: e.target.value }) }}
                value={missionLogAllInputData.missing_log}
              >
                <option value="1" selected>Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div id="MissingLog2" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Paperwork?
              </label>
              <select
                id="search-select"
                className="form-select mb-3"
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_paperwork: e.target.value }) }}
                value={missionLogAllInputData.missing_paperwork}
              >
                <option value="1" selected>Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>
          <div id="MissingLog" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Sent On
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="firstNameinput"
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_sent_on: e.target.value }) }}
                value={missionLogAllInputData.missing_log_sent_on}
              />
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
                id="firstNameinput"
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_prepared_date: e.target.value }) }}
                value={missionLogAllInputData.missing_log_prepared_date}
              />
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
              id="firstNameinput"
              onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_title: e.target.value }) }}
              value={missionLogAllInputData.missing_log_title
              }
            />
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
                id="firstNameinput"
                disabled={true}
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_reviewed_by: e.target.value }) }}
                value={missionLogAllInputData.missing_log_reviewed_by}
              />

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
                id="firstNameinput"
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_reviewed_date: e.target.value }) }}
                value={missionLogAllInputData.missing_log_reviewed_date}
              />
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
                id="EndleaveDate"
                placeholder="Last Name"
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_paperwork_received_on: e.target.value }) }}
                value={missionLogAllInputData.missing_paperwork_received_on}
              />
            </div>
          </div>

          <div id="MissingLog8" className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Log Document
              </label>
              <input
                type="file"
                className="form-control"
                data-provider="flatpickr"
                id="EndleaveDate"
                placeholder="Last Name"
                onChange={(e) => { setMissionAllInputLogData({ ...missionLogAllInputData, missing_log_document: e.target.value }) }}
                value={missionLogAllInputData.missing_log_document}
              />
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
                    value="1"  // Send 1 for Complete
                    onChange={(e) => {
                      setMissionAllInputLogData({
                        ...missionLogAllInputData,
                        status: e.target.value
                      });
                    }}
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
                    value="0"  // Send 0 for Incomplete
                    onChange={(e) => {
                      setMissionAllInputLogData({
                        ...missionLogAllInputData,
                        status: e.target.value
                      });
                    }}
                    checked={missionLogAllInputData.status === "0"}
                  />
                  &nbsp; <label htmlFor="incomplete">Incomplete</label>
                </div>
              </div>


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
        }}>
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
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Status
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">On Hold</span>
            </div>
          </div>
        </div>


      </CommonModal>
    </div>
  );
}

export default MissingLogs;
