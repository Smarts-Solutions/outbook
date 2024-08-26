import React from 'react'
import Datatable from '../../../Components/ExtraComponents/Datatable';

const data = [
    { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal',  ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
    
  ];
  
  
  const columns = [
    { name: 'Trading Name', selector: row => row.TradingName , sortable: true },
    { name: 'Customer Code', selector: row => row.Code, sortable: true },
    { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
    { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
    { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
    { name: 'Account Manager', selector: row => row.JobType, sortable: true },
  ]

const Queries = () => {
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
            {/* <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-info text-white float-end ms-2"> <i class="fa fa-plus pe-1"></i>  Add Timesheet</button> */}
            <button type="button" class="btn btn-info text-white float-end ">  
             <i class="fa-regular fa-plus pe-1"></i> Add Query</button>
             </div>    
        
        </div>
    </div>

      

        

  <div className='datatable-wrapper '>
   
<Datatable 
filter={true}
columns={columns} data={data} />
</div>
</div>
  )
}

export default Queries