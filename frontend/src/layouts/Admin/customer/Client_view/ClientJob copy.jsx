import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Datatable from "../../../../Components/ExtraComponents/Datatable";
import { Get_All_Client } from "../../../../ReduxStore/Slice/Client/ClientSlice";
import { useNavigate, useLocation } from "react-router-dom";

const ClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const [customerData, setCustomerData] = useState([]);
  const [activeTab, setActiveTab] = useState("client");

  const tabs = [
    { id: "viewclient", label: "View Client" },
    { id: "NoOfJobs", label: "No.Of Jobs" },
    { id: "documents", label: "Documents" },
  ];

  const columns = [
    {
      name: "Client Name",
      cell: (row) => (
        <div>
          <a
            onClick={() => HandleClientView(row)}
            style={{ cursor: "pointer", color: "#26bdf0" }}
          >
            {row.client_name}
          </a>
        </div>
      ),
      selector: (row) => row.trading_name,
      sortable: true,
    },

    {
      name: "Client Code (cli+CustName+ClientName+UniqueNo)",
      selector: (row) => row.client_code,
      sortable: true,
    },
    {
      name: "Client Type",
      selector: (row) =>
        row.client_type_name == null ? "" : row.client_type_name,
      sortable: true,
    },
    { name: "Email Address", selector: (row) => row.email, sortable: true },
    { name: "Phone", selector: (row) => row.phone, sortable: true },
    {
      name: "Status",
      selector: (row) => (row.status == "1" ? "Active" : "Deactive"),
      sortable: true,
    },
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
  ];

  const HandleClientView = (row) => {
    navigate("/admin/client/profile", { state: row });
  };

  function handleEdit(row) {
    navigate("/admin/client/edit", { state: { row, id: location.state.id } });
  }

  function handleDelete(row) {
    console.log("Deleting row:", row);
  }

  const GetAllServiceData = async () => {
    const req = { action: "get", customer_id: location.state.id };
    const data = { req: req, authToken: token };
    await dispatch(Get_All_Client(data))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          setCustomerData(response.data);
        } else {
          setCustomerData(response.data);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };

  useEffect(() => {
    GetAllServiceData();
  }, []);

  const handleAddClient = () => {
    navigate("/admin/createjob", { state: { id: location.state.id } });
  };

 

  return (
    <div className="container-fluid">
     
        <div className="col-sm-12">
          <div className="page-title-box">
            <div className="row align-items-start">
              <div className="col-md-8">
                <ul
                  className="nav nav-pills rounded-tabs"
                  id="pills-tab"
                  role="tablist"
                >
                  {tabs.map((tab) => (
                    <li className="nav-item" role="presentation" key={tab.id}>
                      <button
                        className={`nav-link ${
                          activeTab === tab.id ? "active" : ""
                        }`}
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
              {activeTab == "NoOfJobs" && (
                <div className="col-md-4 col-auto">
                  <div
                    className="btn btn-info text-white float-end blue-btn"
                    onClick={handleAddClient}
                  >
                   
                    <i className="fa fa-plus" /> Create Job
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      
      <div className="tab-content" id="pills-tabContent">
         

        <div className="report-data">
          <div className="card-body">
            <div className="dastyle-profile">
              <div className="row">
                <div className="col-lg-4 align-self-center mb-3 mb-lg-0">
                  <div className="dastyle-profile-main">
                    <div className="dastyle-profile-main-pic">
                      <span className="dastyle-profile_main-pic-change">
                        <i className="ti-user"></i>
                      </span>
                    </div>
                    <div className="dastyle-profile_user-detail">
                      <h5 className="dastyle-user-name">Mr.Ajeet Agarwal</h5>
                      <p className="mb-0 dastyle-user-name-post">
                        Client Code:CLT-001
                      </p>
                    </div>
                  </div>
                </div>
               
                <div className="col-lg-4 ml-auto align-self-center">
                  <ul className="list-unstyled personal-detail mb-0">
                    <li className="">
                      <i className="fa-regular fa-phone me-2 text-secondary font-22 align-middle"></i>
                      <b>phone </b>:+91 9974426129
                    </li>
                    <li className="mt-2">
                      <i className="fa-regular fa-envelope text-secondary font-22 align-middle me-2"></i>
                      <b>Email </b>: ajeet@outbooks.uk
                    </li>
                  </ul>
                </div>
               
                <div className="col-lg-4 align-self-center">
                  <div className="row trading-details">
                    <div className="col-auto text-right border-right ">
                      <b>
                        <span className="">Trading Name</span>
                      </b>
                      <p className="">Outbooks Outsourcing Pvt Ltd</p>
                    </div>
                   
                    <div className="col-auto">
                      <b>
                        <span className="">Trading Address</span>
                      </b>
                      <p className="mb-0 ">
                        Suite 18, Winsor & Newton Building, Whitefriars Avenue,
                        Harrow HA3 5RN
                      </p>
                    </div>
                   
                  </div>
                  
                </div>
               
              </div>
              
            </div>
           
          </div>
        </div>

        <div className=" report-data mt-4">
          <div className="card-header border-bottom pb-3 row">
            <div className="col-8"><h4 className="card-title">Company Information</h4></div>
            <div className="col-4">
            <div className="float-end">
  <button
    type="button"
    className="btn btn-info text-white  "
  >
   
    <i className="fa-regular fa-pencil me-2" />
    Edit
  </button>
  <button
    type="button"
    className="rounded-0 btn btn-danger text-white float-end fw-bold ms-1"
  >
   
    <i className="fa-regular fa-trash me-2" />
    Delete
  </button>
 
</div>
</div>

            
          </div>
          
          <div className="card-body pt-3">
            <div className="row">
              <div className="col-lg-6">
                <ul className="list-unstyled faq-qa">
                  <li className="mb-4">
                    <h6 className="">Company Name</h6>
                    <p className="font-14  ml-3">
                      Outbooks Outsourcing Pvt Ltd
                    </p>
                  </li>
                  <li className="mb-4">
                    <h6 className="">Company Status</h6>
                    <p className="font-14  ml-3">Active</p>
                  </li>
                  <li className="mb-4">
                    <h6 className="">Registered Office Address</h6>
                    <p className="font-14  ml-3">
                      Suite 18, Winsor & Newton Building, Whitefriars Avenue,
                      Harrow HA3 5RN
                    </p>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul className="list-unstyled faq-qa">
                  <li className="mb-4">
                    <h6 className="">Entity Type</h6>
                    <p className="font-14  ml-3">Entity Type</p>
                  </li>
                  <li className="mb-4">
                    <h6 className="">Company Number</h6>
                    <p className="font-14  ml-3">06465146</p>
                  </li>
                  <li className="mb-4">
                    <h6 className="">6. What is Dastyle?</h6>
                    <p className="font-14  ml-3">
                      Anim pariatur cliche reprehenderit, enim eiusmod high life
                      accusamus terry richardson ad squid.
                    </p>
                  </li>
                </ul>
              </div>
             
            </div>
            
          </div>
         
        </div>

        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${
              activeTab == tab.id ? "show active" : ""
            }`}
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
