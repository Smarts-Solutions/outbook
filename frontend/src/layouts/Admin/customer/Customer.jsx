import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Datatable from '../../../Components/ExtraComponents/Datatable';

const Customer = () => {
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
    <div className='container-fluid'>
      <div className="row ">
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-8">
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
              </div>
              <div className="col-md-4 col-auto">
                <Link to="/admin/addcustomer" className='btn btn-info text-white float-end blue-btn'> <i className="fa fa-plus" /> Add Customer</Link>
              </div>
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
  );
}

export default Customer;
