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

const JobTimeline = () => {
  return (
    <div className=''>
    <div className='row'>
        <div className='col-md-8'>
            <div className='tab-title'>
                <h3>Job Timeline</h3>
            </div>
        </div>
       
    </div>

      

        

    <div className="col-lg-12  mt-2">
    <div className="my-3 col-md-7">
  <label className="form-label">Status</label>
 <select className='form-select '>
  <option value="volvo">All</option>
 </select>
</div>

                <div className="analytic-dash-activity" data-simplebar="init">
                  <div className="simplebar-mask1">
                    <div className="">
                      <div className="simplebar-content" style={{ padding: 0 }}>
                        <div className="activity">
                          <div className="activity-info">
                            <div className="icon-info-activity">
                              <i className="fa-solid fa-circle"></i>
                            </div>
                            <div className="activity-info-text">
                              <div className="">
                                <small className="">Aug 17(12:07 AM)</small>
                                <p className="">
                                  Sabby created new package Testing AA
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="activity-info">
                            <div className="icon-info-activity">
                              <i className="fa-solid fa-circle"></i>
                            </div>
                            <div className="activity-info-text">
                              <div className="">
                                <small className="">Aug 17(12:07 AM)</small>
                                <p className="">
                                  Sabby created new package Testing AA
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="activity-info">
                            <div className="icon-info-activity">
                              <i className="fa-solid fa-circle"></i>
                            </div>
                            <div className="activity-info-text">
                              <div className="">
                                <small className="">Aug 17(12:07 AM)</small>
                                <p className="">
                                  Sabby created new package Testing AA
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="activity-info">
                            <div className="icon-info-activity">
                              <i className="fa-solid fa-circle"></i>
                            </div>
                            <div className="activity-info-text">
                              <div className="">
                                <small className="">Aug 17(12:07 AM)</small>
                                <p className="">
                                  Sabby created new package Testing AA
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="activity-info">
                            <div className="icon-info-activity">
                              <i className="fa-solid fa-circle"></i>
                            </div>
                            <div className="activity-info-text">
                              <div className="">
                                <small className="">Aug 17(12:07 AM)</small>
                                <p className="">
                                  Sabby created new package Testing AA
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/*end activity*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            
</div>
  )
}

export default JobTimeline