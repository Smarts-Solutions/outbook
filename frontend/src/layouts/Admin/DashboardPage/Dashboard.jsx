import React from "react";

const Dashboard = () => {
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));

  const currentDate = new Date();

  // Get the current time in "10:35 AM" format
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const currentTime = currentDate.toLocaleTimeString("en-US", options);

  // Extract the time part
  const hours = currentDate.getHours();
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  let greeting;
  if (hours < 12) {
    greeting = "Good Morning!";
  } else if (hours < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  // Array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = monthNames[currentDate.getMonth()]; // Get month name
  const year = currentDate.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  return (
    <div>
      <div className="container-fluid">
        {/* Page-Title */}
        <div className="row">
          <div className="col-sm-12">
            <div className="page-title-box">
              <div className="row">
                <div className="col">
                  <p className="mb-0 page-subtitle">{greeting}</p>
                  <h2 className="page-title mt-1">{staffDetails.role_name}</h2>
                </div>

                {/* <div className="col-auto align-self-center">
                  <p className="mb-0 page-subtitle text-end">{currentTime}</p>
                  <h2 className="page-title mt-1">{formattedDate}</h2>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 col-md-8">
            <>
              <ul
                className="nav nav-pills mb-3 rounded-tabs"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="this-week-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-week"
                    type="button"
                    role="tab"
                    aria-controls="this-week"
                    aria-selected="true"
                  >
                    This week
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-week-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-week"
                    type="button"
                    role="tab"
                    aria-controls="last-week"
                    aria-selected="false"
                  >
                    Last week
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="this-month-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-month"
                    type="button"
                    role="tab"
                    aria-controls="this-month"
                    aria-selected="false"
                  >
                    This Month
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-month-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-month"
                    type="button"
                    role="tab"
                    aria-controls="last-month"
                    aria-selected="false"
                  >
                    Last month
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-quarter-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-quarter"
                    type="button"
                    role="tab"
                    aria-controls="last-quarter"
                    aria-selected="false"
                  >
                    Last quarter
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="this-6-months-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-6-months"
                    type="button"
                    role="tab"
                    aria-controls="this-6-months"
                    aria-selected="false"
                  >
                    This 6 months
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-6-months-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-6-months"
                    type="button"
                    role="tab"
                    aria-controls="last-6-months"
                    aria-selected="false"
                  >
                    Last 6 months
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="this-year-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#this-year"
                    type="button"
                    role="tab"
                    aria-controls="this-year"
                    aria-selected="false"
                  >
                    This year
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="last-year-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#last-year"
                    type="button"
                    role="tab"
                    aria-controls="last-year"
                    aria-selected="false"
                  >
                    Last year
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link"
                    id="custom-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#custom"
                    type="button"
                    role="tab"
                    aria-controls="custom"
                    aria-selected="false"
                  >
                    Custom
                  </button>
                </li>
              </ul>
              <div className="tab-content mt-5" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="this-week"
                  role="tabpanel"
                  aria-labelledby="this-week-tab"
                >
                  <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CUSTOMERS
                              </p>
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">183</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>

                          {/* <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">NO OF CUSTOMERS</p>
                            
                              <h3 className="mt-5">183</h3>
                              <i className='ti-user'></i>
                            </div>

                          </div> */}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className=" mb-1">NO OF JOBS</p>
                              {/* <h3 className="mt-5">45</h3> */}
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">45</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CLIENTS
                              </p>
                              {/* <h3 className="mt-5">543</h3> */}
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">183</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4 ">
                      <div className="card report-card ">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF STAFF
                              </p>
                              {/* <h3 className="mt-5">78</h3> */}
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">78</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                PENDING JOBS
                              </p>
                              {/* <h3 className="mt-5">233</h3> */}
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">183</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col-12">
                              <p className="text-dark mb-1 font-weight-semibold">
                                COMPLETED JOBS
                              </p>
                              {/* <h3 className="mt-5">870</h3> */}
                            </div>
                            <div className="col-12 d-flex align-items-center justify-content-between">
                              <h3 className="my-4">183</h3>
                              <div className="report-main-icon bg-light-alt">
                                <i className="ti-user"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="last-week"
                  role="tabpanel"
                  aria-labelledby="last-week-tab"
                >
                  <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CUSTOMERS
                              </p>
                              <h3 className="mt-5">183</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className=" mb-1">NO OF JOBS</p>
                              <h3 className="mt-5">45</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF CLIENTS
                              </p>
                              <h3 className="mt-5">543</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                NO OF STAFF
                              </p>
                              <h3 className="mt-5">78</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                PENDING JOBS
                              </p>
                              <h3 className="mt-5">233</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <div className="card report-card">
                        <div className="card-body">
                          <div className="row d-flex justify-content-center">
                            <div className="col">
                              <p className="text-dark mb-1 font-weight-semibold">
                                COMPLETED JOBS
                              </p>
                              <h3 className="mt-5">870</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="this-month"
                  role="tabpanel"
                  aria-labelledby="this-month-tab"
                >
                  This month's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-month"
                  role="tabpanel"
                  aria-labelledby="last-month-tab"
                >
                  Last month's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-quarter"
                  role="tabpanel"
                  aria-labelledby="last-quarter-tab"
                >
                  Last quarter's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="this-6-months"
                  role="tabpanel"
                  aria-labelledby="this-6-months-tab"
                >
                  This 6 months' content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-6-months"
                  role="tabpanel"
                  aria-labelledby="last-6-months-tab"
                >
                  Last 6 months' content...
                </div>
                <div
                  className="tab-pane fade"
                  id="this-year"
                  role="tabpanel"
                  aria-labelledby="this-year-tab"
                >
                  This year's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="last-year"
                  role="tabpanel"
                  aria-labelledby="last-year-tab"
                >
                  Last year's content...
                </div>
                <div
                  className="tab-pane fade"
                  id="custom"
                  role="tabpanel"
                  aria-labelledby="custom-tab"
                >
                  Custom content...
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
          </div>
        </div>
      </div>
      {/* container */}
    </div>
  );
};

export default Dashboard;
