import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { DraftAction , AddDraft } from '../../../ReduxStore/Slice/Customer/CustomerSlice'
import { useLocation } from "react-router-dom";
import sweatalert from 'sweetalert2';


const Drafts = () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const location = useLocation()
  const dispatch = useDispatch();
  const [adddraft, setAdddraft] = useState(false);
  const [viewdraft, setViewdraft] = useState(false);
  const [DraftListData, setDraftListData] = useState([]);
  const [errors, setErrors] = useState({});
  const [SingleDraftData, setSingleDraftData] = useState([]);
  const [AllDraftInputdata, setAllDraftInputdata] = useState({
    draft_sent_on: "",
    feedback_received: "",
    updated_amendments: "",
    final_draft_sent_on: "",
    was_it_complete: "",
    enter_feedback: "",
  });

  const resetForm = () => {
    setAllDraftInputdata({
      ...AllDraftInputdata,
      draft_sent_on: "",
      feedback_received: "",
      updated_amendments: "",
      final_draft_sent_on: "",
      was_it_complete: "",
      enter_feedback: "",

    });
  };


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
        return ;
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAllDraftInputdata({ ...AllDraftInputdata, [name]: value });
    validate(name, value);
  };

  const validate = (name, value) => {
    const newErrors = { ...errors };
    if (!value) {
      switch (name) {
        case "draft_sent_on":
          newErrors.draft_sent_on = "Draft Sent On is required";
          break;
        case "final_draft_sent_on":
          newErrors.final_draft_sent_on = "Final Draft Sent On is required";
          break;
        case "feedback_received":
          newErrors.feedback_received = "Feedback Received is required";
          break;
        case "updated_amendments":
          newErrors.updated_amendments = "Updated/Amendments is required";
          break;
        case "was_it_complete":
          newErrors.was_it_complete = "Was It Complete is required";
          break;
        case "enter_feedback":
          newErrors.enter_feedback = "Enter Feedback is required";
          break;
        default:
          break;
      }
    }
    else {
      delete newErrors[name];
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...newErrors,
      }));
    }
    return Object.keys(newErrors).length === 0;
  };


  const validateAllFields = () => {
    let isValid = true;
    for (const key in AllDraftInputdata) {
      if (!validate(key, AllDraftInputdata[key])) {
        isValid = false;
      }
    }
    return isValid;
  };

 
  const HandleSubmitDraft = async () => {
    if (!validateAllFields()) {
      return;
    }
    const req = {
      job_id: location.state.job_id,
      draft_sent_on: AllDraftInputdata.draft_sent_on,
      final_draft_sent_on: AllDraftInputdata.final_draft_sent_on,
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
        return ;
      })

  }


  const columns = [
    { name: 'Draft Sent On', selector: row => row.draft_sent_on, sortable: true },
    { name: 'Final Draft Sent On', selector: row => row.final_draft_sent_on, sortable: true },
    // { name: '	Status', selector: row => row.CustomerName, sortable: true },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => {HandleDraftView(row) ; setViewdraft(true)}}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  console.log("SingleDraftData" , SingleDraftData)

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
                  Was It Complete
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
                  <option value="">Select</option>
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
        btn_name="Save"
        cancel_btn="true"
        hideBtn={false}

      
        handleClose={() => {
          setViewdraft(false);
          // formik.resetForm();
        }}
        Submit_Cancel_Function={() => { setViewdraft(false);}}
        Submit_Function={() =>  setViewdraft(false)}

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
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Final Draft Sent On
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.final_draft_sent_on}</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="customername-field" className="form-label">
                Feedback Received
              </label>
            </div>
            <div className="col-md-6">
              <span className="text-muted">{SingleDraftData && SingleDraftData.feedback_received==1 ? "Yes" : "No"}</span>
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