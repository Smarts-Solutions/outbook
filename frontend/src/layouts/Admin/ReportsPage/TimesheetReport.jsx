import React, { useState, useEffect } from 'react';
import Datatable from '../../../Components/ExtraComponents/Datatable';




const TimesheetReport = () => {


  const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
  
  ];
  
  
  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName, sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
    { name: 'Account Manager', selector: row => row.JobType, sortable: true },
  ]

  return (
    <div>
          <div className='report-data'>
            <div className='row'>
              <div className='col-md-7'>
                <div className='tab-title'>
                  <h3>Timesheet Report</h3>
                </div>
                <div className='job-filter-btn '>
                  <button className='filter btn btn-info text-white fw-normal'><i className="fas fa-filter pe-2"></i>Filters</button>
                  <button className='xl-sheet btn btn-info text-white fw-normal'><i className="fas fa-file-excel"></i></button>
                </div>
              </div>
              <div className='col-md-5'>
                <div className='d-block float-end report-data py-2'>
                  <div><b>Amatis Training ltd</b></div>
                  <div><b>Timesheet: </b><a href="logs.html">Book-keeping Timesheet</a></div>
                  <div><b>Subject:</b> Weekly Book-keeping Timesheet</div>
                </div>
              </div>
            </div>



            <div className='datatable-wrapper mt-minus'>
              <Datatable
                filter={true}
                columns={columns} data={data} />
            </div>
          </div>
    </div>
  )
}

export default TimesheetReport