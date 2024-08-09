import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Datatable from '../../../../Components/ExtraComponents/Datatable';
import {Get_All_Client } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { useNavigate , useLocation } from 'react-router-dom';
import CreateJob from '../Client_view/ClientJobs/CreateJob';

const ClientList = () => {
  const navigate = useNavigate();
  const location  = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState('client');

 
 
   
  const tabs = [
    { id: 'viewclient', label: 'View Client' },
    { id: 'NoOfJobs', label: 'No.Of Jobs' },
    { id: 'documents', label: 'Documents' },
  ];

  const columns = [
    {
      name: 'Client Name',
      cell: row => (
        <div>
        <a onClick={() => HandleClientView(row)} style={{ cursor: 'pointer', color: '#26bdf0' }}>{row.client_name}</a>
      </div>
      ),
      selector: row => row.trading_name,
      sortable: true
    },
     
    { name: 'Client Code (cli+CustName+ClientName+UniqueNo)', selector: row => row.client_code, sortable: true },
    { name: 'Client Type', selector: row => row.client_type_name == null ? "" : row.client_type_name, sortable: true },
    { name: 'Email Address', selector: row => row.email, sortable: true },
    { name: 'Phone', selector: row => row.phone , sortable: true },
    { name: 'Status', selector: row => row.status=='1' ? "Active" : "Deactive" , sortable: true },
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

  const HandleClientView = (row) => {
    navigate('/admin/client/profile', { state: row });
  }

  function handleEdit(row) {

    navigate('/admin/client/edit', { state: { row, id: location.state.id } });
}

  function handleDelete(row) {
    console.log('Deleting row:', row);
  }
 
  console.log("location",location.state); 

 

  const GetAllServiceData = async () => {
    const req = { action: "get" ,customer_id:location.state.id};
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Client(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerData(response.data)
        } else {
          setCustomerData(response.data)

        }
      })
      .catch((error) => {
        console.log("Error", error);

      });
  }

  useEffect(() => {
    GetAllServiceData()
  }, []);


  console.log("location.state :", location.state)
  const handleCreateJob = () => {
    navigate('/admin/createjob' , {state : {details : location.state}});
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
              {
                activeTab == 'NoOfJobs' &&
              <div className="col-md-4 col-auto">
                <div  className='btn btn-info text-white float-end blue-btn' onClick={handleCreateJob}> <i className="fa fa-plus" /> Create Job</div>
              </div>

              }
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">

        {console.log("activeTab", activeTab)}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${activeTab == tab.id ? 'show active' : ''}`}
            id={tab.id}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            {customerData && customerData && (
              <Datatable columns={columns} data={customerData} filter={false} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
