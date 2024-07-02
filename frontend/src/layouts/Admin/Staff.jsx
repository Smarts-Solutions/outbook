import React, { useState } from 'react';
import Datatable from '../../Components/ExtraComponents/Datatable';
const Staff = () => {
    const tabs = [
        { id: 'this-week', label: 'This week' },
        { id: 'last-week', label: 'Last week' },
        { id: 'last-month', label: 'Last month' },
        { id: 'last-quarter', label: 'Last quarter' },
        { id: 'this-6-months', label: 'This 6 months' },
        { id: 'last-6-months', label: 'Last 6 months' },
        { id: 'this-year', label: 'This year' },
        { id: 'last-year', label: 'Last year' },
        { id: 'custom', label: 'Custom' },
      ];
    
      const thisWeekData = [
        { TradingName: 'W120', Code: '012_BlaK_T_1772', CustomerName: 'The Black T', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Admin/Support Tasks', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
        { TradingName: 'W121', Code: '025_NesTea_1663', CustomerName: 'Nestea', AccountManager: 'Ajeet Aggarwal', ServiceType: 'Onboarding/Setup', JobType: 'Year End' },
      ];
    
      const thisWeekColumns = [
        { name: 'Trading Name', selector: row => row.TradingName, sortable: true },
        { name: 'Customer Code', selector: row => row.Code, sortable: true },
        { name: 'Customer Name', selector: row => row.CustomerName, sortable: true },
        { name: 'Company Number', selector: row => row.AccountManager, sortable: true },
        { name: 'Service Type', selector: row => row.ServiceType, sortable: true },
        { name: 'Account Manager', selector: row => row.JobType, sortable: true },
        {
          name: 'Actions',
          cell: row => (
            <div>
              <button className='edit-icon' onClick={() => handleEdit(row)}> <i className="ti-pencil" /></button>
              <button className='delete-icon' onClick={() => handleDelete(row)}> <i className="ti-trash" /></button>
            </div>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];
    
      const tabData = {
        'this-week': { data: thisWeekData, columns: thisWeekColumns },
        'last-week': { data: [], columns: [] },
        'last-month': { data: [], columns: [] },
        'last-quarter': { data: [], columns: [] },
        'this-6-months': { data: [], columns: [] },
        'last-6-months': { data: [], columns: [] },
        'this-year': { data: [], columns: [] },
        'last-year': { data: [], columns: [] },
        'custom': { data: [], columns: [] },
      };
    
      const TabContent = ({ contentType }) => {
        const { data, columns } = tabData[contentType];
        return <Datatable columns={columns} data={data} filter={false} />;
      };
    
      const [activeTab, setActiveTab] = useState('this-week');
    
      function handleEdit(row) {
        console.log('Editing row:', row);
      }
    
      function handleDelete(row) {
        console.log('Deleting row:', row);
      }
    

    return (
        <div>
            <div className='container-fluid'>
                <div className='report-data mt-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className='tab-title'>
                            <h3 className='mt-0'>Manage Staff</h3>
                        </div>
                        <div>
                            <button type="button"

                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal" className='btn btn-info text-white float-end'> <i className="fa fa-plus" />Add Staff</button>
                        </div>
                    </div>
                    <div className="col-sm-12">
                        <div className="page-title-box">
                            <div className="row align-items-start">
                                <div className="col-md-8">
                                    <>
                                    <ul className="nav nav-pills rounded-tabs" id="pills-tab" role="tablist">
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
                      <button
                        className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
                        id={`${tab.id}-tab`}
                        data-bs-toggle="pill"
                        data-bs-target={`#${tab.id}`}
                        type="button"
                        role="tab"
                        aria-controls={tab.id}
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>

                                    </>

                                </div>



                            </div>

                        </div>

                    </div>
                    <div className="tab-content" id="pills-tabContent">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab === tab.id ? 'show active' : ''}`}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            <TabContent contentType={tab.id} />
          </div>
        ))}
      </div>

                </div>
                {/* <!-- Button trigger modal --> */}


                {/* <!-- Modal --> */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Add Staff</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <form className="tablelist-form">
                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="customername-field" className="form-label">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="customername-field"
                                                        className="form-control"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="email-field" className="form-label">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="email-field"
                                                        className="form-control"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="phone-field" className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone-field"
                                                        className="form-control"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="date-field" className="form-label">
                                                        Phone
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="date-field"
                                                        className="form-control"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="mb-3">
                                                    <label htmlFor="phone-field" className="form-label">
                                                        Password
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="phone-field"
                                                        className="form-control"
                                                        placeholder=""
                                                        required=""
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div>
                                                    <label htmlFor="status-field" className="form-label">
                                                        Role
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        data-trigger=""
                                                        name="status-field"
                                                        id="status-field"
                                                    >
                                                        <option value="Active">Processor</option>
                                                        <option value="Block">Reviewer</option>
                                                        <option value="Active">Super Admin</option>
                                                        <option value="Block">Managment</option>
                                                        <option value="Block">Leadership</option>
                                                        <option value="Block">Account Manager</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div>
                                                    <label htmlFor="status-field" className="form-label">
                                                        Status
                                                    </label>
                                                    <select
                                                        className="form-control"
                                                        data-trigger=""
                                                        name="status-field"
                                                        id="status-field"
                                                    >
                                                        <option value="Active">Active</option>
                                                        <option value="Block">Deactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </form>

                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Staff
