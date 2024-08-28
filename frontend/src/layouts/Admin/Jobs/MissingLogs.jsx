import React, { useState } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";

const MissingLogs = () => {
  const [addmissinglogs, setAddmissinglogs] = useState(false);
  const [viewmissinglogs, setViewmissinglogs] = useState(false);

  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon"  onClick={() => setViewmissinglogs(true)}>
            <i className="fa fa-eye fs-6 text-secondary" />
          </button>
        
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // other rows...
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
        <Datatable filter={true} columns={columns} data={data} />
      </div>

      <CommonModal
        isOpen={addmissinglogs}
        backdrop="static"
        size="lg"
        cancel_btn="true"
        btn_2="true"
        title="Add Missing Log"
        hideBtn={true}
        handleClose={() => {
           setAddmissinglogs(false);
          // formik.resetForm();
        }}>
    <div className="row">
  {/* <div class="col-lg-6">
                              <label for="firstNameinput"
                                          class="form-label">Expected Delivery Date
                                         </label>
                                         <input type="date" class="form-control mb-3" placeholder="DD-MM-YYYY" id="cleave-date">

                          </div>*/}
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
      >
        <option value="" selected="">
          
          Yes
        </option>
        <option value="">No</option>
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
      >
        <option value="" selected="">
          
          Yes
        </option>
        <option value="">No</option>
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
    />
  </div>
  <div id="MissingLog4" className="col-lg-6">
    <div className="mb-3">
      <label htmlFor="firstNameinput" className="form-label">
        Missing Log Reviewed By
      </label>
      <select
        id="search-select"
        className="form-select mb-3 ismissinglog"
        aria-label="Default select example"
        style={{ color: "#8a8c8e !important" }}
      >
        <option value="" selected="">
          
          Ajeet Agarwal
        </option>
        <option value="">Hemant Agarwal</option>
      </select>
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
            id="html"
            name="fav_language"
            defaultValue="HTML"
          />
          &nbsp; <label htmlFor="html">Complete</label>
        </div>
        &nbsp;
        <div style={{ marginLeft: 10 }}>
          <input
            type="radio"
            id="html"
            name="fav_language"
            defaultValue="HTML"
          />
          &nbsp; <label htmlFor="html">Incomplete</label>
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
      <span className="text-muted">03/07/2023</span>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="customername-field" className="form-label">
        Missing Paperwork Received On
      </label>
    </div>
    <div className="col-md-6">
      <span className="text-muted"> 03/07/2023</span>
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
