import React, { useState } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";


const Queries = () => {
  const [addquery, setAddquery] = useState(false);
  const [viewquery, setViewquery] = useState(false);

  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon"  onClick={() => setViewquery(true)}>
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
columns={columns} data={data} />
</div>

<CommonModal
        isOpen={addquery}
        backdrop="static"
        size="lg"
        cancel_btn="true"
        btn_2="true"
        title="Queries (Last Query Sent on 20/03/2023)
"
        hideBtn={true}
        handleClose={() => {
           setAddquery(false);
          // formik.resetForm();
        }}>
  <div className="row">
  <div className="col-lg-6">
    <label htmlFor="firstNameinput" className="form-label">
      Queries Remaining?
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
  <div className="col-lg-6">
    <div className="mb-3">
      <label htmlFor="firstNameinput" className="form-label">
        Query Title
      </label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter Query Title"
        id="firstNameinput"
      />
    </div>
  </div>
  <div className="col-lg-6">
    <label htmlFor="firstNameinput" className="form-label">
      Reviewed By
    </label>
    <select
      id="search-select"
      className="form-select mb-3"
      aria-label="Default select example"
      style={{ color: "#8a8c8e !important" }}
    >
      <option value="" selected="">
        Select
      </option>
      <option value="">No</option>
    </select>
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
        id="firstNameinput"
      />
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
        id="firstNameinput"
      />
    </div>
  </div>
  <div className="col-lg-6">
    <div className="mb-3">
      <label htmlFor="firstNameinput" className="form-label">
        Response Received
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
        Response
      </label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter Response"
        id="firstNameinput"
      />
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
        id="firstNameinput"
      />
    </div>
  </div>

  <div className="col-lg-6">
    <div className="mb-3">
      <label htmlFor="firstNameinput" className="form-label">
        Query Document
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