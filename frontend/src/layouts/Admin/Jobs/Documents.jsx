import React, { useState } from "react";
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from "../../../Components/ExtraComponents/Modals/CommanModal";


const Documents = () => {
  const [uploadfiles, setUploadfiles] = useState(false);


  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon"  >
            <i className="fa fa-pencil fs-6" />
          </button>
          <button className="delete-icon"  >
            <i className="ti-trash fs-5 text-danger" />
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
        <div className='col-md-7'>
            <div className='tab-title'>
                <h3>Document</h3>
            </div>
        </div>
        <div className='col-md-5'>
        <div>
             <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-info text-white float-end ms-2"> <i className="ti-trash pe-1"></i>  Delete Selected</button> 
            <button type="button" className="btn btn-info text-white float-end " onClick={() => setUploadfiles(true)}>  
             <i className="fa-regular fa-plus pe-1"></i> Upload Files</button>
             </div>    
        
        </div>
    </div>

      

        

  <div className='datatable-wrapper '>
   
<Datatable 
filter={true}
columns={columns} data={data} />
</div>



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
            <input type="file" className="form-control"></input>
            <div
              className="mb-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
        
           
            </div>
            <h6 className="text-center">
              <p>Or Drag File in here</p>
            </h6>
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