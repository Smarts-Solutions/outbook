import React, { useState } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";


const Drafts = () => {
  const [adddraft, setAdddraft] = useState(false);
  const [viewdraft, setViewdraft] = useState(false);

  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon"  onClick={() => setViewdraft(true)}>
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
                <h3>Drafts</h3>
            </div>
        </div>
        <div className='col-md-4'>
        <div>
            {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-info text-white float-end ms-2"> <i class="fa fa-plus pe-1"></i>  Add Timesheet</button> */}
            <button type="button" class="btn btn-info text-white float-end " onClick={() => setAdddraft(true)}>  
             <i class="fa-regular fa-plus pe-1"></i> Add Drafts</button>
             </div>    
        
        </div>
    </div>

      

        

  <div className='datatable-wrapper '>
   
<Datatable 
filter={true}
columns={columns} data={data} />
</div>

<CommonModal
        isOpen={adddraft}
        backdrop="static"
        size="md"
        cancel_btn="true"
        btn_2="true"
        title="Add Draft
"
        hideBtn={true}
        handleClose={() => {
           setAdddraft(false);
          // formik.resetForm();
        }}>
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
          id="firstNameinput"
        />
      </div>
    </div>
    <div className="col-lg-6">
      <div className="mb-3">
        <label htmlFor="firstNameinput" className="form-label">
          Feedback Received
        </label>
        <select
          id="search-select"
          className="form-select mb-3"
          aria-label="Default select example"
          style={{ color: "#8a8c8e !important" }}
        >
          <option value="">Yes</option>
          <option value="">No</option>
        </select>
      </div>
    </div>
    
    <div className="col-lg-6">
      <div className="mb-3">
        <label htmlFor="firstNameinput" className="form-label">
          Updated/Amendments
        </label>
        <select
          id="search-select"
          className="form-select mb-3"
          aria-label="Default select example"
          style={{ color: "#8a8c8e !important" }}
        >
          <option value="">Amendment</option>
          <option value="">Update</option>
          <option value="">Both</option>
          <option value="">None</option>
        </select>
      </div>
    </div>
    <div className="col-lg-6">
      <div className="mb-3">
        <label htmlFor="firstNameinput" className="form-label">
          Was It Complete
        </label>
        <select
          id="search-select"
          className="form-select DraftWasItComplete mb-3"
          aria-label="Default select example"
          style={{ color: "#8a8c8e !important" }}
        >
          <option value="" selected="">
            {" "}
            Yes
          </option>
          <option value="">No</option>
        </select>
      </div>
    </div>
    <div className="col-lg-12">
      <div className="mb-3">
        <label htmlFor="firstNameinput" className="form-label">
          Enter Feedback
        </label>
        <textarea
          type="text"
          rows={4}
          className="form-control"
          placeholder="Enter Feedback"
          id="firstNameinput"
          defaultValue={""}
        />
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
         
        hideBtn={true}
        handleClose={() => {
           setViewdraft(false);
          // formik.resetForm();
        }}>
<div className="av ">
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="customername-field" className="form-label">
        Draft Sent On
      </label>
    </div>
    <div className="col-md-6">
      <span className="text-muted">03/07/2023</span>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="customername-field" className="form-label">
        Final Draft Sent On
      </label>
    </div>
    <div className="col-md-6">
      <span className="text-muted"> 03/07/2023</span>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="customername-field" className="form-label">
        Feedback Received
      </label>
    </div>
    <div className="col-md-6">
      <span className="text-muted">Yes</span>
    </div>
  </div>
  <div className="row">
    <div className="col-md-6">
      <label htmlFor="customername-field" className="form-label">
        Feedback
      </label>
    </div>
    <div className="col-md-6">
      <span className="text-muted">This is Feedback from Job</span>
    </div>
  </div>
</div>




    </CommonModal>
</div>
  )
}

export default Drafts