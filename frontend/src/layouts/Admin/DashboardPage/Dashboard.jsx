import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardData,
  ActivityLog,
} from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [visibleLogs, setVisibleLogs] = useState(4); // Initially show 5 logs

  // Handle "Load More" functionality
  const loadMoreLogs = () => {
    setVisibleLogs((prev) => prev + 4); // Show 5 more logs each time
  };
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const getActiveTab = sessionStorage.getItem('activDashborde');
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();
  const [dashboard, setDashboard] = useState([]);
  const [getActiviyLog, setActivityLog] = useState([]);

  const currentDate = new Date();
  const [selectedTab, setSelectedTab] = useState(getActiveTab || "this_week");

  const handleTabChange = (event) => {
    sessionStorage.setItem('activDashborde', event.target.value);
    setSelectedTab(event.target.value);
  };

  const hours = currentDate.getHours();

  let greeting;
  if (hours < 12) {
    greeting = "Good Morning!";
  } else if (hours < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  useEffect(() => {
    GetDashboardData();
  }, [selectedTab]);

  useEffect(() => {
    ActivityLogData();
  }, []);

  const GetDashboardData = async () => {
    const req = { staff_id: staffDetails.id ,date_filter:selectedTab};
    const data = { req: req, authToken: token };
    await dispatch(DashboardData(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setDashboard(res.data);
        } else {
          setDashboard([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ActivityLogData = async () => {
    const req = { staff_id: staffDetails.id };
    const data = { req: req, authToken: token };
    await dispatch(ActivityLog(data))
      .unwrap()
      .then((res) => {
        if (res.status) {
          setActivityLog(res.data);
        } else {
          setActivityLog([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { month: "short", day: "numeric" };
    const monthDay = date.toLocaleDateString("en-US", options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const time = date.toLocaleTimeString("en-US", timeOptions);
    return `${monthDay} (${time.toUpperCase()})`;
  };


  const handleClick = async(type , data , heading) => {
    if(parseInt(data.count) === 0){
      return;
    }
    const req  = {staff_id : staffDetails.id , key : type , ids : data.ids, heading : heading}
    navigate("/admin/dashboard/data", { state: { req: req } });
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="page-title-box">
              <div className="row">
                <div className="col">
                  <p className="mb-0 page-subtitle">{greeting}</p>
                  <h2 className="page-title mt-1">{staffDetails.role_name}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-8">
            <>
              <div className="row">
                <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="form-group"> 
                    <select
                      className="form-select"
                      id="tabSelect"
                      value={selectedTab}
                      onChange={(e)=>handleTabChange(e)}
                    >
                      <option value="this_week">This Week</option>
                      <option value="last_week">Last Week</option>
                      <option value="this_month">This Month</option>
                      <option value="last_month">Last Month</option>
                      <option value="this_quarter">This Quarter</option>
                      <option value="last_quarter">Last Quarter</option>
                      <option value="this_six_month">This 6 Months</option>
                      <option value="last_six_month">Last 6 Months</option>
                      <option value="this_year">This Year</option>
                      <option value="last_year">Last Year</option>
                    </select>
                  </div>
                </div>
               
              </div>
              <div className="tab-content mt-5">
             
                   <div className="tab-pane show active">
                    <div className="row justify-content-center">
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  NO OF CUSTOMERS
                                </p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between" 
                              onClick={()=>handleClick("customer" , dashboard.customer , "Customers")}
                              >
                                <h3 className="my-4">{dashboard.customer && dashboard.customer.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/users.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  NO OF CLIENTS
                                </p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between"
                               onClick={()=>handleClick("client" , dashboard.client , "Clients")}
                              
                              >
                                <h3 className="my-4">{dashboard.client && dashboard.client.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/teamwork.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> 
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card ">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  NO OF STAFF
                                </p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between"
                                onClick={()=>handleClick("staff" , dashboard.staff , "Staff")}
                              >
                                <h3 className="my-4">{dashboard.staff && dashboard.staff.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/handshake.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className=" mb-1">NO OF JOBS</p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between"
                                onClick={()=>handleClick("job" , dashboard.job , "Jobs")}
                              >
                                <h3 className="my-4">{dashboard.job && dashboard.job.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/suitcase.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> 
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  PENDING JOBS
                                </p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between"
                                onClick={()=>handleClick("pending_job" , dashboard.pending_job , "Pending Jobs")}
                              >
                                <h3 className="my-4">{dashboard.pending_job && dashboard.pending_job.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/pending.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 col-xl-4 col-lg-6" style={{cursor: 'pointer'}}>
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  COMPLETED JOBS
                                </p>
                              </div>
                              <div className="col-12 d-flex align-items-center justify-content-between" 
                                onClick={()=>handleClick("completed_job" , dashboard.completed_job , "Completed Jobs")}
                              
                              >
                                <h3 className="my-4">{dashboard.completed_job && dashboard.completed_job.count}</h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/time-management.png"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </>
          </div>
          <div className="col-lg-4 col-md-4 mt-2">
            <div className="card activity-card">
              <div className="card-header border-bottom-0">
                <div className="row align-items-center">
                  <div className="col">
                    <h4 className="card-title">Activity</h4>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="analytic-dash-activity" data-simplebar="init">
                  <div className="simplebar-mask1">
                    <div className="">
                      <div className="simplebar-content" style={{ padding: 0 }}>
                        <div className="activity">
                          {/* Conditional Rendering */}
                          <div>
      {getActiviyLog && getActiviyLog.length > 0 ? (
        getActiviyLog.slice(0, visibleLogs).map((item, index) => {
          return (
            <div className="activity-info" key={index}>
              <div className="icon-info-activity">
                <i className="fa-solid fa-circle"></i>
              </div>
              <div className="activity-info-text">
                <div className="">
                  <small className="">{formatDate(item?.created_at)}</small>
                  <p className="">{item?.log_message}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-data-found">
          <img
            src="/assets/images/No-data-amico.png"
            alt="No data found"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p className="text-center">No Activity Logs Found</p>
        </div>
      )}

      {/* Show "Load More" button if there are more logs */}
      {getActiviyLog && getActiviyLog.length > visibleLogs && (
        <div className="load-more-btn-container text-center">
          <button className="btn btn-info w-75" onClick={loadMoreLogs}>
            Load More

          </button>
        </div>
      )}
    </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
