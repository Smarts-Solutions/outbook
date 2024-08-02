import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Datatable from '../../../../Components/ExtraComponents/Datatable';
import { GET_ALL_CUSTOMERS } from '../../../../ReduxStore/Slice/Customer/CustomerSlice';
import { useNavigate , useLocation } from 'react-router-dom';

const ClientList = () => {
  const navigate = useNavigate();
  const location  = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState('client');



  const tabs = [
    { id: 'client', label: 'Client' },
    { id: 'job', label: 'Job' },
    { id: 'documents', label: 'Documents' },
  ];

  const columns = [
    { name: 'Client Name', selector: row => row.trading_name, sortable: true },
    { name: 'Client Code (cli+CustName+ClientName+UniqueNo)', selector: row => row.customer_code, sortable: true },
    { name: 'Client Type', selector: row => row.company_name == null ? "" : row.company_name, sortable: true },
    { name: 'Client Account Manager', selector: row => row.company_number == null ? "" : row.company_number, sortable: true },
    { name: 'Email Address', selector: row => row.customer_type == 1 ? "Sole Trader" : row.customer_type == 2 ? "	Company" : row.customer_type == 3 ? "Partnership" : "-", sortable: true },
    { name: 'Phone', selector: row => row.staff_firstname + ' ' + row.staff_lastname, sortable: true },
    { name: 'Status', selector: row => row.staff_firstname + ' ' + row.staff_lastname, sortable: true },
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





  function handleEdit(row) {
    console.log('Editing row:', row.id);
    navigate('/admin/editcustomer', { state: row });
  }

  function handleDelete(row) {
    console.log('Deleting row:', row);
  }



  const GetAllServiceData = async () => {
    const req = { action: "get" };
    const data = { req: req, authToken: token };
    await dispatch(GET_ALL_CUSTOMERS(data))
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
                <Link to="/admin/addclient" className='btn btn-info text-white float-end blue-btn'> <i className="fa fa-plus" />Add Client</Link>
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
