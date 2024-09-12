import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { QueryAction , AddQuery } from '../../../ReduxStore/Slice/Customer/CustomerSlice'
import sweatalert from 'sweetalert2';

const Queries = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [addquery, setAddquery] = useState(false);
  const [viewquery, setViewquery] = useState(false);
  const [AllQueryList, setAllQueryList] = useState([]);
  const [errors1, setErrors1] = useState({});
  const [singleQueryData, setSingleQueryData] = useState([]);

  console.log("singleQueryData", singleQueryData);
  const [AllQueryInputdata, setAllQueryInputdata] = useState({
    QueriesRemaining: "",
    QueryTitle: "",
    ReviewedBy: "",
    MissingQueriesPreparedDate: "",
    QuerySentDate: "",
    ResponseReceived: "",
    Response: "",
    FinalQueryResponseReceivedDate: "",
    QueryDocument: "",
  });

  const resetForm = () => {
    setAllQueryInputdata({
      ...AllQueryInputdata,
      QueriesRemaining: "",
      QueryTitle: "",
      ReviewedBy: "",
      MissingQueriesPreparedDate: "",
      QuerySentDate: "",
      ResponseReceived: "",
      Response: "",
      FinalQueryResponseReceivedDate: "",
      QueryDocument: "",
    });
  };


  useEffect(() => {
    GetQueryAllList();
  }, []);

  const GetQueryAllList = async () => {
    const req = { action: "get", job_id: 9 }
    const data = { req: req, authToken: token }
    await dispatch(QueryAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAllQueryList(response.data || [])
        }
        else {
          setAllQueryList([])
        }
      })
      .catch((error) => {
        console.log("error", error)
      })


  }

  const HandleQueryView = async (row) => {
    const req = { action: "getSingleView", id: row.id }
    const data = { req: req, authToken: token }
    await dispatch(QueryAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setSingleQueryData(response.data[0]);
        }
        else {
          setSingleQueryData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
 
  const HandleAddQuery = async()=>{
    if(!validateAllFields()){
      return;
    }
    const req = { action: "add", job_id: 9, data: AllQueryInputdata }
    const data = { req: req, authToken: token }

    await dispatch(AddQuery(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setAddquery(false)
          GetQueryAllList()
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
        console.log("error", error)
      })

  }
  const handleChange = (e) => {
    const { name, value } = e.target; 

    if (name === 'QueryDocument') {
      const files = e.target.files;
      var fileArray;
      if (files && typeof files[Symbol.iterator] === "function") {
        fileArray = Array.from(files);
        setAllQueryInputdata({ ...AllQueryInputdata, QueryDocument: fileArray });
      }
    }
    else {
      setAllQueryInputdata({ ...AllQueryInputdata, [name]: value });
    }
    validate(name, value);
  };

  const validate = (name, value) => {
    const newErrors = { ...errors1 };
    
    if (!value) {
      switch (name) {
        case "QueriesRemaining":
          newErrors.QueriesRemaining = "Queries Remaining is required";
          break;
        case "QueryTitle":
          newErrors.QueryTitle = "Query Title is required";
          break;
        case "ReviewedBy":
          newErrors.ReviewedBy = "Reviewed By is required";
          break;
        case "MissingQueriesPreparedDate":
          newErrors.MissingQueriesPreparedDate = "Missing Queries Prepared Date is required";
          break;
        case "QuerySentDate":
          newErrors.QuerySentDate = "Query Sent Date is required";
          break;
       
        case "ResponseReceived":
          newErrors.ResponseReceived = "Response Received is required";
          break;
        case "Response":
          newErrors.Response = "Response is required";
          break;
        case "FinalQueryResponseReceivedDate":
          newErrors.FinalQueryResponseReceivedDate = "Final Query Response Received Date is required";
          break;
        case "QueryDocument":
          newErrors.QueryDocument = "Query Document is required";
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
    for (const key in AllQueryInputdata) {
      if (!validate(key, AllQueryInputdata[key])) {
        isValid = false;
      }
    }
    return isValid;
  };


  const columns = [
    { name: 'Query Title', selector: row => row.query_title, sortable: true },
    { name: '	Query Sent Date', selector: row => row.query_sent_date, sortable: true },
    { name: 'Response Received', selector: row => row.response_received == 1 ? "YES" : "NO", sortable: true },
    { name: 'Response', selector: row => row.response, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() =>{HandleQueryView(row); setViewquery(true)}}>
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
            <h3>Queries</h3>
          </div>
        </div>
        <div className='col-md-4'>
          <div>
            <button type="button" className="btn btn-info text-white float-end " onClick={() => setAddquery(true)}>
              <i className="fa-regular fa-plus pe-1"></i> Add Query</button>
          </div>

        </div>
      </div>

      <div className='datatable-wrapper '>

        <Datatable
          filter={true}
          columns={columns} data={AllQueryList} />
      </div>

      <CommonModal
        isOpen={addquery}
        backdrop="static"
        size="lg"
        cancel_btn="true"
        btn_2="true"
        title="Queries (Last Query Sent on 20/03/2023)"
        hideBtn={false}
         btn_name="Save"
        handleClose={() => {
          setAddquery(false);
          resetForm();
          setErrors1({});
        }}
        Submit_Function={() => HandleAddQuery()}
        Submit_Cancel_Function={() => {setAddquery(false) ; resetForm(); setErrors1({});}} 
        >
        <div className="row">
          <div className="col-lg-6">
            <label htmlFor="firstNameinput" className="form-label">
              Queries Remaining?
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              name="QueriesRemaining"
              id="QueriesRemaining"
              style={{ color: "#8a8c8e !important" }}
              onChange={(e) => handleChange(e)}
              value={AllQueryInputdata.QueriesRemaining}
            >
              <option value="">Select</option>
              <option value="1">Yes</option>
              <option value="0" selected>No</option>
            </select>
            {errors1["QueriesRemaining"] && (
              <div className="error-text">
                {errors1["QueriesRemaining"]}
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">Query Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Query Title"
                id="QueryTitle"
                name="QueryTitle"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.QueryTitle}
              />
              {errors1["QueryTitle"] && (
                <div className="error-text">
                  {errors1["QueryTitle"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <label htmlFor="firstNameinput" className="form-label">Reviewed By</label>
            <select
              className="form-select "
              aria-label="Default select example"
              style={{ color: "#8a8c8e !important" }}
              name="ReviewedBy"
              id="ReviewedBy"
              onChange={(e) => handleChange(e)}
              value={AllQueryInputdata.ReviewedBy}
            >
              <option value="" selected="">Select</option>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
            {errors1["ReviewedBy"] && (
              <div className="error-text">
                {errors1["ReviewedBy"]}
              </div>
            )}
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Missing Queries Prepared Date
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="MissingQueriesPreparedDate"
                name="MissingQueriesPreparedDate"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.MissingQueriesPreparedDate}
              />
              {errors1["MissingQueriesPreparedDate"] && (
                <div className="error-text">
                  {errors1["MissingQueriesPreparedDate"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Query Sent Date
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""

                id="QuerySentDate"
                name="QuerySentDate"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.QuerySentDate}
              />
              {errors1["QuerySentDate"] && (
                <div className="error-text">
                  {errors1["QuerySentDate"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Response Received
              </label>
              <select 
                className="form-select"
                aria-label="Default select example"
                style={{ color: "#8a8c8e !important" }}
                name="ResponseReceived"
                id="ResponseReceived"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.ResponseReceived}
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
              {errors1["ResponseReceived"] && (
                <div className="error-text">
                  {errors1["ResponseReceived"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Response
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Response"
                id="Response"
                name="Response"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.Response}
              />
              {errors1["Response"] && (
                <div className="error-text">
                  {errors1["Response"]}
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Final Query Response Received Date
              </label>
              <input
                type="date"
                className="form-control"
                placeholder=""
                id="FinalQueryResponseReceivedDate"
                name="FinalQueryResponseReceivedDate"
                onChange={(e) => handleChange(e)}
                value={AllQueryInputdata.FinalQueryResponseReceivedDate}
              />
              {errors1["FinalQueryResponseReceivedDate"] && (
                <div className="error-text">
                  {errors1["FinalQueryResponseReceivedDate"]}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="firstNameinput" className="form-label">
                Query Document
              </label>
              <input
                type="file"
                multiple
                id="QueryDocument"
                name="QueryDocument"
                onChange={(event) => { handleChange(event) }}
                className="custom-file-input form-control"
              />
              {errors1["QueryDocument"] && (
                <div className="error-text">
                  {errors1["QueryDocument"]}
                </div>
              )}
            </div>
          </div>
        </div>

      </CommonModal>

      <CommonModal
        isOpen={viewquery}
        backdrop="static"
        size="md"
        title="Query"

        hideBtn={true}
        handleClose={() => {
          setViewquery(false);
          // formik.resetForm();
        }}>
        <div className="row">
          <div className="card col-md-12">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customername-field" className="form-label">
                    Query Sent Date{" "}
                  </label>
                </div>
                <div className="col-md-6">
                  <span className="text-muted">03/05/2023</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customername-field" className="form-label">
                    Response Received
                  </label>
                </div>
                <div className="col-md-6">
                  <span className="text-muted">Yes</span>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="customername-field" className="form-label">
                    Response
                  </label>
                </div>
                <div className="col-md-6">
                  <span className="text-muted">Response Text</span>
                </div>
              </div>
            </div>
          </div>
        </div>



      </CommonModal>
    </div>
  )
}

export default Queries