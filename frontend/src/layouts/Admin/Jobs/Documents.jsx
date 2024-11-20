import React, { useState, useEffect } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { JobDocumentAction } from "../../../ReduxStore/Slice/Customer/CustomerSlice";


const Documents = ({ getAccessDataJob }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = JSON.parse(localStorage.getItem("token"));
  const role = JSON.parse(localStorage.getItem("role"));
  const [uploadfiles, setUploadfiles] = useState(false);
  const [jobDocumentListData, setJobDocumentListData] = useState([]);

  useEffect(() => {
    GetAllDocumentList();
  }, []);
  
  const GetAllDocumentList = async () => {
    const req = { action: "get", job_id: location.state.job_id }
    const data = { req: req, authToken: token }
    await dispatch(JobDocumentAction(data))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setJobDocumentListData(response.data || [])
        }
        else {
          setJobDocumentListData([])
        }
      })
      .catch((error) => {
        return;
      })
  }

  const convertKBToMb = (kb) => {
    return (kb / 1024).toFixed(2);
  }

  const columns = [
    { name: 'File Name', selector: row => row.file_name, reorder: false,sortable: true },
    { name: 'File Type', selector: row => row.file_type, reorder: false,sortable: true },
    { name: 'Size', selector: row => convertKBToMb(row.file_size) + "MB",reorder: false, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          {
            (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
              <button className="edit-icon"  >
                <i className="fa fa-pencil fs-6" />
              </button>
            )
          }
          {
            (getAccessDataJob.delete === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
              <button className="delete-icon"  >
                <i className="ti-trash fs-5 text-danger" />
              </button>
            )
          }

        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const handleChangeDocument = (e) => {
  }


  return (
    <div className=''>
      <div className='row'>
        <div className='col-md-7'>
          <div className='tab-title'>
            <h3>Document</h3>
          </div>
        </div>
        <div className='col-md-5'>
          <div>
            {
              (getAccessDataJob.delete === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-secondary  float-end ms-2"> <i className="ti-trash pe-1"></i>  Delete Selected</button>
              )}
            {
              (getAccessDataJob.update === 1 || role === "ADMIN" || role === "SUPERADMIN") && (
                <button type="button" className="btn btn-info text-white float-end ms-2"> <i className="fa-regular fa-plus pe-1"></i> Add Document</button>
              )}


          </div>

        </div>
      </div>

      <div className='datatable-wrapper '>

        <Datatable
          filter={true}
          columns={columns} data={jobDocumentListData && jobDocumentListData} />
      </div>



      {/* <div id="MissingLog8" className="col-lg-6">
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
          </div> */}


      <CommonModal
        isOpen={uploadfiles}
        backdrop="static"
        size="md"
        title="Upload Files"
        cancel_btn="true"
        hideBtn={true}
        handleClose={() => {
          setUploadfiles(false);
          // formik.resetForm();
        }}>
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="upload-box" style={{ height: 150 }}>
                  <div className="dz-message needsclick">
                    <input
                      type="file"
                      multiple
                      id="upload_document"
                      name="upload_document"
                      className="form-control"
                      onChange={(e) => handleChangeDocument(e)}></input>
                    <div
                      className="mb-3"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                    </div>
                    {/* <h6 className="text-center">
                      <p>Or Drag File in here</p>
                    </h6> */}
                  </div>
                </div>
                <ul className="list-unstyled mb-0" id="dropzone-preview"></ul>
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </div>
  )
}

export default Documents