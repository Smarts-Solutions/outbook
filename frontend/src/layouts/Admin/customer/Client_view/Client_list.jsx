import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Datatable from '../../../../Components/ExtraComponents/Datatable';
import { Get_All_Client } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Get_All_Job_List } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [ClientData, setClientData] = useState([]);
  const [activeTab, setActiveTab] = useState('client');
  const [getJobDetails, setGetJobDetails] = useState({ loading: false, data: [] });

  const tabs = [
    { id: 'client', label: 'Client' },
    { id: 'job', label: 'Job' },
    { id: 'documents', label: 'Documents' },
  ];




  const JobDetails = async () => {
    const req = { action: "getByCustomer", customer_id: location.state.id }
    const data = { req: req, authToken: token }
    await dispatch(Get_All_Job_List(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setGetJobDetails({
            loading: true,
            data: response.data
          })
        }
        else {
          setGetJobDetails({
            loading: true,
            data: []
          })
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
  useEffect(() => {
    JobDetails()
  }, []);



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
    { name: 'Phone', selector: row => row.phone, sortable: true },
    { name: 'Status', selector: row => row.status == '1' ? "Active" : "Deactive", sortable: true },
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

  const JobColumns = [
    {
      name: "Job ID (CustName+ClientName+UniqueNo)",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.job_code_id}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Job Type",
      selector: (row) => row.job_type_name,
      sortable: true,
    },
    {
      name: "Account Manager",
      selector: (row) => row.account_manager_officer_first_name + " " + row.account_manager_officer_last_name,
      sortable: true,
    },
    { name: "Client Job Code", selector: (row) => row.client_job_code, sortable: true },
    { name: "Outbooks Acount Manager", selector: (row) => row.outbooks_acount_manager_first_name + " " + row.outbooks_acount_manager_last_name, sortable: true },
    { name: "Allocated To", selector: (row) => row.allocated_first_name + " " + row.allocated_last_name, sortable: true },

    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button className="edit-icon" onClick={() => handleEdit(row)}>
            <i className="ti-pencil" />
          </button>
          <button className="delete-icon" onClick={() => handleDelete(row)}>

            <i className="ti-trash" />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];;

  const HandleClientView = (row) => {
    navigate('/admin/client/profile', { state: { row, customer_id: location.state } });
  }

  function handleEdit(row) {

    navigate('/admin/client/edit', { state: { row, id: location.state.id } });
  }

  function handleDelete(row) {
    console.log('Deleting row:', row);
  }


  const GetAllServiceData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Client(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setClientData(response.data)
        } else {
          setClientData(response.data)

        }
      })
      .catch((error) => {
        console.log("Error", error);

      });
  }

  useEffect(() => {
    GetAllServiceData()
  }, []);


  const handleAddClient = () => {
    navigate('/admin/addclient', { state: { id: location.state.id } });
  }


  const handleAddJob = () => {
    // navigate('/admin/createjob', { state: { id: location.state.id } });
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
                  <div className='btn btn-info text-white float-end blue-btn' onClick={activeTab == "client" ? handleAddClient : handleAddJob}> <i className="fa fa-plus" />{activeTab == "client" ? " Add Client" : " Create Job"}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">


        {activeTab == "client" && (
          <div
            className={`tab-pane fade ${activeTab == "client" ? 'show active' : ''}`}
            id={'client'}
            role="tabpanel"
            aria-labelledby={`client-tab`}
          >
            {ClientData && ClientData && (
              <Datatable columns={columns} data={ClientData} filter={false} />
            )}
          </div>
        )}

        {activeTab == "job" && (
          <div
            className={`tab-pane fade ${activeTab == "job" ? 'show active' : ''}`}
            id={'job'}
            role="tabpanel"
            aria-labelledby={`job-tab`}
          >
            {getJobDetails && getJobDetails && (
              <Datatable columns={JobColumns} data={getJobDetails.data} filter={false} />
            )}
          </div>
        )}

        {activeTab == "documents" && (
          <div
            className={`tab-pane fade ${activeTab == "documents" ? 'show active' : ''}`}
            id={'documents'}
            role="tabpanel"
            aria-labelledby={`documents-tab`}
          >
            {/* {ClientData && ClientData && (
              <Datatable columns={columns} data={ClientData} filter={false} />
            )} */}
          </div>
        )}

      </div>
    </div>
  );
};

export default ClientList;
