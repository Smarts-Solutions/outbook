import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { DraftAction, AddDraft, EditDraft } from '../../../ReduxStore/Slice/Customer/CustomerSlice'
import { useLocation } from "react-router-dom";
import sweatalert from 'sweetalert2';
import { all } from "axios";

const Drafts = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const location = useLocation()
  const dispatch = useDispatch();
  const [adddraft, setAdddraft] = useState(false);
  const [viewdraft, setViewdraft] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [DraftListData, setDraftListData] = useState([]);
  const [errors, setErrors] = useState({});
  const [SingleDraftData, setSingleDraftData] = useState([]);
  const [EditData, setEditData] = useState([]);
  const [AllDraftInputdata, setAllDraftInputdata] = useState({
    draft_sent_on: new Date().toISOString().substr(0, 10),
    feedback_received: '0',
    updated_amendments: '1',
    final_draft_sent_on: new Date().toISOString().substr(0, 10),
    was_it_complete: '0',
    enter_feedback: null,
    id: null
  });



  const resetForm = () => {
    setAllDraftInputdata({
      ...AllDraftInputdata,
      draft_sent_on: new Date().toISOString().substr(0, 10),
      feedback_received: '0',
      updated_amendments: '1',
      final_draft_sent_on: new Date().toISOString().substr(0, 10),
      was_it_complete: '0',
      enter_feedback: null,
      id: null

    });
  };

  useEffect(() => {
    if (EditData && showEditModal) {
      setAllDraftInputdata({
        ...AllDraftInputdata,
        draft_sent_on: EditData.draft_sent_on,
        feedback_received: EditData.feedback_received,
        updated_amendments: EditData.updated_amendment,
        final_draft_sent_on: EditData.final_draft_sent_on == null ? new Date().toISOString().substr(0, 10) : EditData.final_draft_sent_on,
        was_it_complete: EditData.was_it_complete,
        enter_feedback: EditData.feedback,
        id: EditData.id
      });
    }
  }, [EditData, showEditModal]);

  useEffect(() => {
    GetAllDraftList();
  }, []);

  const GetAllDraftList = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }
    await dispatch(DraftAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setDraftListData(response.data || [])
        }
        else {
          setDraftListData([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const HandleDraftView = async (row) => {
    const req = { action: "getSingleView", id: row.id }
    const data = { req: req, authToken: token }
    await dispatch(DraftAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setSingleDraftData(response.data[0]);
        }
        else {
          setSingleDraftData([]);
        }
      })
      .catch((err) => {
        return;
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllDraftInputdata({ ...AllDraftInputdata, [name]: value });

  };

  const HandleSubmitDraft = async () => {
    const req = {
      job_id: location.state.job_id,
      draft_sent_on: AllDraftInputdata.draft_sent_on,
      final_draft_sent_on: AllDraftInputdata.was_it_complete == 0 ? null : AllDraftInputdata.final_draft_sent_on,
      feedback_received: AllDraftInputdata.feedback_received,
      updated_amendment: AllDraftInputdata.updated_amendments,
      feedback: AllDraftInputdata.enter_feedback,
      was_it_complete: AllDraftInputdata.was_it_complete,

    }
    const data = { req: req, authToken: token }
    await dispatch(AddDraft(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAdddraft(false)
          GetAllDraftList()
          resetForm()
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
      .catch((error) => {
        return;
      })

  }

  const HandleSubmitEditDraft = async () => {
    const req = {
      id: AllDraftInputdata.id,
      draft_sent_on: AllDraftInputdata.draft_sent_on,
      final_draft_sent_on: AllDraftInputdata.was_it_complete == 0 ? null : AllDraftInputdata.final_draft_sent_on,
      feedback_received: AllDraftInputdata.feedback_received,
      updated_amendment: AllDraftInputdata.updated_amendments,
      feedback: AllDraftInputdata.enter_feedback,
      was_it_complete: AllDraftInputdata.was_it_complete,

    }
    const data = { req: req, authToken: token }
    await dispatch(EditDraft(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setShowEditModal(false)
          GetAllDraftList()
          resetForm()
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
      .catch((error) => {
        return;
      })

  }

  const columns = [
    { name: 'Draft Title', selector: row => row.title, sortable: true },
    { name: 'Draft Sent On', selector: row => row.draft_sent_on, sortable: true },
    { name: 'Final Draft Sent On', selector: row => row.final_draft_sent_on, sortable: true },

    { name: 'Feedback Received', selector: row => row.feedback_received == 1 ? "Yes" : "No", sortable: true },
    { name: 'Updated/Amendments', selector: row => row.updated_amendment == 1 ? "Amendment" : row.updated_amendment == 2 ? "Update" : row.updated_amendment == 3 ? "Both" : "None", sortable: true },
    { name: 'Was Draft Completed', selector: row => row.was_it_complete == 1 ? "Yes" : "No", sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="view-icon" onClick={() => { HandleDraftView(row); setViewdraft(true) }}>
            <i className="fa fa-eye fs-6 text-warning" />
          </button>
          <button className="edit-icon" onClick={() => { setShowEditModal(true); setEditData(row) }}>
            <i className="ti-pencil" />
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
            <h3>Drafts</h3>
          </div>
        </div>
        <div className='col-md-4'>
          <div>
            <button type="button" className="btn btn-info text-white float-end " onClick={() => setAdddraft(true)}>
              <i className="fa-regular fa-plus pe-1"></i> Add Drafts</button>
          </div>

        </div>
      </div>
      <div className='datatable-wrapper '>

        <Datatable
          filter={true}
          columns={columns} data={DraftListData && DraftListData} />
      </div>

      <CommonModal
        isOpen={adddraft}
        backdrop="static"
        size="lg"
        cancel_btn="true"
        btn_2="true"
        title="Add Draft"
        btn_name="Save"
        hideBtn={false}
        handleClose={() => {
          setAdddraft(false);
          resetForm();
          setErrors({});

        }}
        Submit_Function={() => HandleSubmitDraft()}
        Submit_Cancel_Function={() => { setAdddraft(false); resetForm(); setErrors({}); }}
      >
        <>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Draft Sent On
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  name="draft_sent_on"
                  id="draft_sent_on"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.draft_sent_on}
                />
                {errors["draft_sent_on"] && (
                  <div className="error-text">
                    {errors["draft_sent_on"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Feedback Received
                </label>
                <select

                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="feedback_received"
                  id="feedback_received"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.feedback_received}
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors["feedback_received"] && (
                  <div className="error-text">
                    {errors["feedback_received"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Updated/Amendments
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="updated_amendments"
                  id="updated_amendments"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.updated_amendments}
                >
                  <option value="" selected>Select</option>
                  <option value="1">Amendment</option>
                  <option value="2">Update</option>
                  <option value="3">Both</option>
                  <option value="4">None</option>
                </select>
                {errors["updated_amendments"] && (
                  <div className="error-text">
                    {errors["updated_amendments"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                Was Draft Completed
                </label>
                <select

                  className="form-select DraftWasItComplete"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="was_it_complete"
                  id="was_it_complete"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.was_it_complete}
                >
                  <option value="1">Yes</option>
                  <option value="0" selected>No</option>
                </select>
                {errors["was_it_complete"] && (
                  <div className="error-text">
                    {errors["was_it_complete"]}
                  </div>
                )}
              </div>
            </div>

            {AllDraftInputdata?.was_it_complete == 1 ? <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Final Draft Sent On
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  name="final_draft_sent_on"
                  id="final_draft_sent_on"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.final_draft_sent_on}
                />
                {errors["final_draft_sent_on"] && (
                  <div className="error-text">
                    {errors["final_draft_sent_on"]}
                  </div>
                )}
              </div>
            </div> : ""}


            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Enter Feedback
                </label>
                <textarea
                  type="text"
                  rows={4}
                  className="form-control"
                  placeholder="Enter Feedback"
                  name="enter_feedback"
                  id="enter_feedback"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.enter_feedback}
                  defaultValue={""}
                />
                {errors["enter_feedback"] && (
                  <div className="error-text">
                    {errors["enter_feedback"]}
                  </div>
                )}
              </div>
            </div>


          </div>
        </>

      </CommonModal>

      <CommonModal
        isOpen={showEditModal}
        backdrop="static"
        size="lg"
        cancel_btn="true"
        btn_2="true"
        title="Edit Draft"
        btn_name="Save"
        hideBtn={false}
        handleClose={() => {
          setShowEditModal(false);
          resetForm();

        }}
        Submit_Function={() => HandleSubmitEditDraft()}
        Submit_Cancel_Function={() => { setShowEditModal(false); resetForm(); }}
      >
        <>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Draft Sent On
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  name="draft_sent_on"
                  id="draft_sent_on"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.draft_sent_on}
                />
                {errors["draft_sent_on"] && (
                  <div className="error-text">
                    {errors["draft_sent_on"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Feedback Received
                </label>
                <select

                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="feedback_received"
                  id="feedback_received"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.feedback_received}
                >
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors["feedback_received"] && (
                  <div className="error-text">
                    {errors["feedback_received"]}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Updated/Amendments
                </label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="updated_amendments"
                  id="updated_amendments"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.updated_amendments}
                >

                  <option value="1">Amendment</option>
                  <option value="2">Update</option>
                  <option value="3">Both</option>
                  <option value="4">None</option>
                </select>
                {errors["updated_amendments"] && (
                  <div className="error-text">
                    {errors["updated_amendments"]}
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Was Draft Completed
                </label>
                <select
                  className="form-select DraftWasItComplete"
                  aria-label="Default select example"
                  style={{ color: "#8a8c8e !important" }}
                  name="was_it_complete"
                  id="was_it_complete"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.was_it_complete}
                >

                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                {errors["was_it_complete"] && (
                  <div className="error-text">
                    {errors["was_it_complete"]}
                  </div>
                )}
              </div>
            </div>

            {AllDraftInputdata?.was_it_complete == 1 ? <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Final Draft Sent On
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder=""
                  name="final_draft_sent_on"
                  id="final_draft_sent_on"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.final_draft_sent_on}
                />
                {errors["final_draft_sent_on"] && (
                  <div className="error-text">
                    {errors["final_draft_sent_on"]}
                  </div>
                )}
              </div>
            </div> : ""}

            <div className="col-lg-6">
              <div className="mb-3">
                <label htmlFor="firstNameinput" className="form-label">
                  Enter Feedback
                </label>
                <textarea
                  type="text"
                  rows={4}
                  className="form-control"
                  placeholder="Enter Feedback"
                  name="enter_feedback"
                  id="enter_feedback"
                  onChange={(e) => handleInputChange(e)}
                  value={AllDraftInputdata.enter_feedback}
                  defaultValue={""}
                />
                {errors["enter_feedback"] && (
                  <div className="error-text">
                    {errors["enter_feedback"]}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>

      </CommonModal>

      <CommonModal
        isOpen={viewdraft}
        backdrop="static"
        size="md"
        title="Draft"
        // btn_name="Save"
        cancel_btn="true"
        hideBtn={true}
        handleClose={() => {
          setViewdraft(false);
        }}
        Submit_Cancel_Function={() => { setViewdraft(false); }}
        Submit_Function={() => setViewdraft(false)}

      >
        <div className="av ">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Draft Sent On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.draft_sent_on}</span>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Final Draft Sent On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.final_draft_sent_on}</span>
            </div>
          </div> */}
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Feedback Received
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.feedback_received == 1 ? "Yes" : "No"}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Feedback
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.feedback}</span>
            </div>
          </div>
        </div>

      </CommonModal>
    </div>
  )
}

export default Drafts