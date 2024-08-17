import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Datatable from '../../../../Components/ExtraComponents/Datatable';
import { Get_All_Client } from '../../../../ReduxStore/Slice/Client/ClientSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { Get_All_Job_List } from "../../../../ReduxStore/Slice/Customer/CustomerSlice";
import { getList } from '../../../../ReduxStore/Slice/Settings/settingSlice';
import sweatalert from 'sweetalert2';


const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [ClientData, setClientData] = useState([]);
  const [getJobDetails, setGetJobDetails] = useState({ loading: false, data: [] });
  const [getCheckList, setCheckList] = useState([]);
  const [getCheckList1, setCheckList1] = useState([]);

  const getActiveTav = localStorage.getItem('Clientlist')
  const [activeTab, setActiveTab] = useState(location.state && location.state.route && location.state.route ==  "Checklist" ? "checklist"  : location.state.route ==  "job" ? "job":'client');
  const [searchQuery, setSearchQuery] = useState('');




  const SetTab = (e) => {
    setActiveTab(e)
  }

  let tabs = [
    { id: 'client', label: 'Client' },
    ...(ClientData && ClientData.length > 0 ? [{ id: 'job', label: 'Job' }] : []),
    { id: 'documents', label: 'Documents' },
    { id: 'status', label: 'Status' },
    { id: 'checklist', label: 'Checklist' },
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
          <button className="edit-icon" onClick={() => handleJobEdit(row)}>
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
  ];

  const CheckListColumns = [
    {
      name: 'Checklist Name',
      cell: row => (
        <div>
          <a onClick={() => HandleClientView(row)} style={{ cursor: 'pointer', color: '#26bdf0' }}>{row.check_list_name}</a>
        </div>
      ),
      selector: row => row.trading_name,
      sortable: true
    },

    { name: 'Service Type', selector: row => row.service_name, sortable: true },
    { name: 'Job Type', selector: row => row.job_type_type, sortable: true },
    { name: 'Client Type', selector: row => row.client_type_type, sortable: true },
    { name: 'Status', selector: row => row.status == '1' ? "Active" : "Deactive", sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button className='edit-icon' onClick={() => EditChecklist(row)}> <i className="ti-pencil" /></button>
          <button className='delete-icon' onClick={() => ChecklistDelete(row)}> <i className="ti-trash" /></button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];




  const GetAllClientData = async () => {
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
    getCheckListData()
    GetAllClientData()
    JobDetails()
  }, []);

  const getCheckListData = async () => {
    const req = { action: "get", customer_id: location.state.id }
    const data = { req: req, authToken: token }
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCheckList(response.data)
          setCheckList1(response.data)
        }
        else {
          setCheckList([])
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  const ChecklistDelete = async (row) => {

    const req = { action: "delete", checklist_id: row.checklists_id }
    const data = { req: req, authToken: token }
    await dispatch(getList(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          sweatalert.fire({
            title: 'Deleted',
            icon: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500
          })
          getCheckListData()

        }
        else {
          sweatalert.fire({
            title: 'Failed',
            icon: 'error',
            showCancelButton: false,
            showConfirmButton: false,
            timer: 1500
          })

        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }




  const HandleClientView = (row) => { navigate('/admin/client/profile', { state: { row, customer_id: location.state } }); }
  const handleAddClient = () => { navigate('/admin/addclient', { state: { id: location.state.id } }); }
  const handleAddJob = () => { navigate('/admin/createjob', { state: { details: location.state, goto: "Customer" } }); }
  function handleEdit(row) { navigate('/admin/client/edit', { state: { row, id: location.state.id } }); }
  function handleJobEdit(row) { navigate("/admin/job/edit", { state: { details: location.state, row: row, goto: "Customer" } }); }
  function handleDelete(row) { console.log('Deleting row:', row); }

  const handleClick = () => { navigate('/admin/create/checklist', { state: { id: location.state.id } }); }
  const EditChecklist = (row) => { navigate('/admin/edit/checklist', { state: { id: location.state.id ,checklist_id: row.checklists_id} }); }



  useEffect(() => {
    if (getCheckList) {
      const filteredData = getCheckList.filter(item =>
        Object.values(item).some(val =>
          val.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setCheckList1(filteredData);
    } else {
      setCheckList1([]);
    }
  }, [searchQuery])




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
                        onClick={() => SetTab(tab.id)}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-4 col-auto">
                {activeTab === "client" || activeTab === "checklist" || activeTab === ""  || activeTab === "job" ? (
                  <div
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={
                      activeTab === "client"
                        ? handleAddClient
                        : activeTab === "checklist"
                          ? handleClick
                          : handleAddJob
                    }
                  >
                    <i className="fa fa-plus" />
                    {activeTab === "client" ? "Add Client" : activeTab === "checklist" ? "Add Checklist" : "Create Job"}
                  </div>
                ) : null}
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
            <div className='container-fluid'>
              <div className='report-data mt-4 '>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='tab-title'>
                    <h3 className='mt-0'>Clients
                    </h3>
                  </div>
                </div>
                <div className='datatable-wrapper '>
                  {ClientData && ClientData && (
                    <Datatable columns={columns} data={ClientData} filter={false} />
                  )}
                </div>
              </div>



            </div>

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
            <div className='container-fluid'>

              <div className='report-data mt-4 '>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='tab-title'>
                    <h3 className='mt-0'>Documents
                    </h3>
                  </div>

                </div>
                <div className='datatable-wrapper '>

                  {ClientData && ClientData && (
                    <Datatable columns={columns} data={ClientData} filter={false} />
                  )}
                </div>
              </div>



            </div>
          </div>
        )}
        {activeTab == "status" && (
          <div
            className={`tab-pane fade ${activeTab == "status" ? 'show active' : ''}`}
            id={'statuses'}
            role="tabpanel"

          >
            {getJobDetails && getJobDetails && (
              <Datatable columns={JobColumns} data={getJobDetails.data} filter={false} />
            )}

          </div>
        )}
        {activeTab == "checklist" && (
          <div
            className={`tab-pane fade ${activeTab == "checklist" ? 'show active' : ''}`}
            id={'checklist'}
            role="tabpanel"
          >
            <div className='container-fluid'>
              <div className='report-data mt-4'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='tab-title'>
                    <h3 className='mt-0'>Checklist</h3>
                  </div>
                </div>

                <div className='d-flex justify-content-end mb-3'>
                  <input
                    type="text"
                    className="form-control w-25 me-2"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className='datatable-wrapper'>

                  {ClientData && ClientData && (
                    <Datatable columns={CheckListColumns} data={getCheckList1} filter={false} />
                  )}
                </div>
              </div>
            </div>
          </div>

        )}




      </div>
    </div>
  );
};

export default ClientList;
