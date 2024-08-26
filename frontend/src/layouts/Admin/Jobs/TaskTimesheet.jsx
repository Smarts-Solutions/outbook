import React, { useState } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';
import CommonModal from '../../../Components/ExtraComponents/Modals/Modal';

const TaskTimesheet = () => {
  const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    // More data...
  ];
  
  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName, sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    
    {
      name: 'Actions',
      cell: row => (
          <div>
              <button className='edit-icon' > <i className="ti-pencil" /></button>
              <button className='delete-icon' > <i className="ti-trash" /></button>
          </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
  },
  ];

  // Correctly defined state
  const [addtimesheet, setAddtimesheet] = useState(false);

  return (
    <>
    <div className=''>
      <div className='row'>
        <div className='col-md-8'>
          <div className='tab-title'>
            <h3>Task Timesheet</h3>
          </div>
        </div>
        <div className='col-md-4'>
          <div>
            <button type="button" onClick={() => setAddtimesheet(true)} className="btn btn-info text-white float-end ms-2">
              <i className="fa fa-plus pe-1"></i> Job Timesheet
            </button>
            <button type="button" className="btn btn-info text-white float-end">
              <i className="fa-regular fa-plus pe-1"></i> Add
            </button>
          </div>
        </div>
      </div>

      <div className='datatable-wrapper'>
        <Datatable 
          filter={true}
          columns={columns} 
          data={data} 
        />
      </div>

      
    </div>
    {/* <CommonModal
    isOpen={addtimesheet}
    cancel_btn="Cancel"
    hideBtn={false}
    btn_name="Save"
    title="Add Timesheet"
    handleClose={() => setAddtimesheet(false)}
  >
    <div className="modal-body px-0">
      <div className="row w-100">
        <div className="col-10">
          <div className="search-box ms-2">
            <i className="ri-search-line search-icon" />
            <input
              type="text"
              className="form-control search"
              placeholder="Search Customer..."
            />
          </div>
        </div>
      </div>
    </div>
  </CommonModal> */}
  </>
  );
};

export default TaskTimesheet;
