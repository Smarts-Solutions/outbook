import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  CustomerDashboardData,
  CustomerActivityLog,
} from "../../ReduxStore/Slice/Customer/CustomerSlice";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Select from "react-select";
import { CircleAlert, Download } from "lucide-react";

const Dashboard = () => {
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const getActiveTab = sessionStorage.getItem("activDashborde");
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const [dashboard, setDashboard] = useState({
    client: { count: 0, ids: "" },
    job: { count: 0, ids: "" },
    pending_job: { count: 0, ids: "" },
    completed_job: { count: 0, ids: "" },
  });
  const [getActiviyLog, setActivityLog] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(getActiveTab || "this_week");
  const [activityRange, setActivityRange] = useState("this_week");
  const [selectedFromDate, setSelectedFromDate] = useState("");
  const [selectedToDate, setSelectedToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  const currentDate = new Date();
  const hours = currentDate.getHours();

  let greeting;
  if (hours < 12) {
    greeting = "Good Morning!";
  } else if (hours < 18) {
    greeting = "Good Afternoon!";
  } else {
    greeting = "Good Evening!";
  }

  console.log("role dashboard - ", role);

  const handleTabChange = (event) => {
    sessionStorage.setItem("activDashborde", event.target.value);
    setSelectedTab(event.target.value);
  };

  // Handle "Load More" functionality
  const loadMoreLogs = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    ActivityLogData(nextPage);
  };

  useEffect(() => {
    GetDashboardData();
  }, [selectedTab]);

  // ✅ FIXED: Custom date range logic
  useEffect(() => {
    // Only fetch if NOT custom OR if custom with both dates selected
    if (activityRange === "custom") {
      // Only fetch when BOTH dates are filled
      if (selectedFromDate && selectedToDate) {
        setPage(1);
        ActivityLogData(1);
      }
      // Don't call API if custom is selected but dates are empty
    } else {
      // For other ranges (this_week, last_month etc), fetch immediately
      setPage(1);
      ActivityLogData(1);
    }
  }, [activityRange, selectedFromDate, selectedToDate]);

  const GetDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const req = { staff_id: staffDetails.id, date_filter: selectedTab };
      const data = { req: req, authToken: token };

      const res = await dispatch(CustomerDashboardData(data)).unwrap();
      console.log("Customer Dashboard API Response:", res);

      if (res.status) {
        setDashboard(res.data);
      } else {
        setDashboard([]);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
      setError("Failed to load dashboard data");
      setDashboard([]);
    } finally {
      setLoading(false);
    }
  };


  const ActivityLogData = async (pageNo = 1) => {
    try {
      const req = {
        staff_id: staffDetails.id,
        filter_type: activityRange,
        page: pageNo,
      };

      if (activityRange === "custom") {
        req.from_date = selectedFromDate;
        req.to_date = selectedToDate;
      }

      const data = { req, authToken: token };

      const res = await dispatch(CustomerActivityLog(data)).unwrap();

      if (res.status) {
        if (pageNo === 1) {
          setActivityLog(res.data);
        } else {
          setActivityLog((prev) => [...prev, ...res.data]);
        }
        setHasMore(res.data.length === 50);
      } else {
        setActivityLog([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Activity Log Error:", error);
      setActivityLog([]);
      setHasMore(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const options = { month: "short", day: "numeric" };
    const monthDay = date.toLocaleDateString("en-US", options);
    const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };
    const time = date.toLocaleTimeString("en-US", timeOptions);
    return `${monthDay} (${time.toUpperCase()})`;
  };

  const exportAllActivityLog = async () => {
    try {
      setExporting(true);

      const req = {
        staff_id: staffDetails.id,
        filter_type: activityRange,
        export_all: true,
      };

      if (activityRange === "custom") {
        req.from_date = selectedFromDate;
        req.to_date = selectedToDate;
      }

      const data = { req, authToken: token };
      const res = await dispatch(CustomerActivityLog(data)).unwrap();

      if (res.status && Array.isArray(res.data) && res.data.length > 0) {
        const logs = Array.isArray(res.data) ? res.data : [];
        const exportList = [];

        // Support both flat log lists and grouped logs (type === "staff")
        if (logs.length > 0 && logs[0]?.date && Array.isArray(logs[0]?.allContain)) {
          logs.forEach((group) => {
            group.allContain.forEach((log) => {
              exportList.push({
                Date: group.date,
                "Created At": formatDate(log.created_at),
                "Log Message": log.log_message,
              });
            });
          });
        } else {
          exportList.push(
            ...logs.map((item) => ({
              "Staff Name": item.staff_name,
              "Log Message": item.log_message,
              "Created At": formatDate(item.created_at),
            })),
          );
        }

        const ws = XLSX.utils.json_to_sheet(exportList);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ActivityLog");
        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
        });
        const fileData = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        });
        const fileName = `Activity_Log_${activityRange}_${new Date()
          .toISOString()
          .slice(0, 10)}`;
        saveAs(fileData, `${fileName}.xlsx`);
      }
    } catch (error) {
      console.error("Export Activity Log Error:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleClick = async (type, data, heading) => {
    if (parseInt(data.count) === 0) {
      return;
    }
    const req = {
      staff_id: staffDetails.id,
      key: type,
      ids: data.ids,
      heading: heading,
    };
    navigate("/customer/dashboard/data", { state: { req: req } });
  };

  // Start Process SharePoint Refresh Process Start //
  // NOTE: This code is commented for security reasons
  // Move to environment variables before using in production

  // const [newAccessToken, setNewAccessToken] = useState("");
  // const refreshToken = async () => {


  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: process.env.REACT_APP_SHAREPOINT_TOKEN_URL,
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       console.log("Token refreshed successfully");
  //       setNewAccessToken(response.data.access_token);
  //     })
  //     .catch((error) => {
  //       console.error("Token refresh error:", error);
  //       setError("Error refreshing token");
  //     });
  // };

  // let site_ID = "";
  // let folder_path = "/Shared Documents/Job Management";
  // let drive_ID = "";
  // let folder_ID = "";
  // const [data, setData] = useState(null);

  // const accessToken = process.env.REACT_APP_SHAREPOINT_ACCESS_TOKEN;
  // const siteUrl = process.env.REACT_APP_SHAREPOINT_SITE_URL;

  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(siteUrl, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (response.data.id) {
  //       const parts = response.data.id.split(",");
  //       site_ID = parts[1];

  //       const driveUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives`;
  //       const driveResponse = await axios.get(driveUrl, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (driveResponse.data.value) {
  //         drive_ID = driveResponse.data.value[0].id;

  //         const folderUrl = `https://graph.microsoft.com/v1.0/drives/${drive_ID}/root/children`;
  //         const folderResponse = await axios.get(folderUrl, {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //             "Content-Type": "application/json",
  //           },
  //         });

  //         if (folderResponse.data.value) {
  //           const jobManagementObject = folderResponse.data.value.find(
  //             (item) => item.name === "JobManagement"
  //           );

  //           if (jobManagementObject) {
  //             folder_ID = jobManagementObject.id;
  //           }

  //           return {
  //             site_ID: site_ID,
  //             drive_ID: drive_ID,
  //             folder_ID: folder_ID,
  //           };
  //         }
  //       }
  //     }

  //     setData(response.data);
  //   } catch (err) {
  //     console.error("Fetch data error:", err);
  //     setError(err.message);
  //   }
  // };

  // const uploadImage = async (file) => {
  //   try {
  //     const val = await fetchData();
  //     let userName = "JohnDoe";
  //     let site_ID = val.site_ID;
  //     let drive_ID = val.drive_ID;
  //     let folder_ID = val.folder_ID;

  //     const uploadUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${folder_path}/${file.name}:/content`;

  //     const response = await axios.put(uploadUrl, file, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         "Content-Type": file.type,
  //       },
  //     });

  //     console.log("Image uploaded successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //   }
  // };

  // const createFolderIfNotExists = async (folderName) => {
  //   try {
  //     const val = await fetchData();
  //     let site_ID = val.site_ID;
  //     let drive_ID = val.drive_ID;
  //     let parentFolderId = val.folder_ID;

  //     const folderUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${parentFolderId}/children`;

  //     const response = await axios.get(folderUrl, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     const folderExists = response.data.value.some(
  //       (item) => item.name === folderName && item.folder
  //     );

  //     if (!folderExists) {
  //       const createFolderUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${parentFolderId}/children`;
  //       const folderData = {
  //         name: folderName,
  //         folder: {},
  //         "@microsoft.graph.conflictBehavior": "rename",
  //       };

  //       await axios.post(createFolderUrl, folderData, {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       console.log(`Folder '${folderName}' created successfully.`);
  //     } else {
  //       console.log(`Folder '${folderName}' already exists.`);
  //     }

  //     const folderResponse = await axios.get(folderUrl, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     const createdFolder = folderResponse.data.value.find(
  //       (item) => item.name === folderName
  //     );
  //     return createdFolder.id;
  //   } catch (error) {
  //     console.error("Error checking or creating folder:", error);
  //     throw error;
  //   }
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     uploadImage(file);
  //   } else {
  //     console.error("No file selected.");
  //   }
  // };

  // const deleteImage = async () => {
  //   try {
  //     const val = await fetchData();
  //     let fileName = "example.png";
  //     let site_ID = val.site_ID;
  //     let drive_ID = val.drive_ID;
  //     let folder_ID = val.folder_ID;

  //     const filePath = `${folder_path}/${fileName}`;
  //     const deleteUrl = `https://graph.microsoft.com/v1.0/sites/${site_ID}/drives/${drive_ID}/items/${folder_ID}:/${filePath}`;

  //     const response = await axios.delete(deleteUrl, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     console.log("Image deleted successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error deleting image:", error);
  //   }
  // };

  // const SharePointToken = async (token) => {
  //   if (token) {
  //     try {
  //       const decodedToken = JSON.parse(atob(token.split(".")[1]));
  //       const currentTime = Math.floor(Date.now() / 1000);

  //       if (decodedToken.exp && decodedToken.exp < currentTime) {
  //         console.log("Token Expired");
  //       } else {
  //         console.log("Token Valid");
  //       }
  //     } catch (error) {
  //       console.error("Token validation error:", error);
  //     }
  //   }
  // };

  // End Process SharePoint Refresh Process End //

  const selectFilterValue = async (e) => {
    let { name, value } = e.target;

    if (name === "fromDate") {
      setSelectedFromDate(value);
    } else if (name === "toDate") {
      setSelectedToDate(value);
    }
  };

  function formatNumberSafe(value) {
    if (value == null || value === "") return "";
    return Number(value).toLocaleString("en-IN");
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
                  <h2 className="page-title mt-1">{staffDetails.first_name} {staffDetails.last_name}</h2>
                </div>
                <div className="col-md-3">
                  <div className="d-flex justify-content-end">
                    <button
                      type="button"
                      className="btn btn-outline-info fw-bold"
                      onClick={exportAllActivityLog}
                      disabled={exporting || !getActiviyLog?.length}
                    >
                      {exporting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download size={16} /> Export All
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        )}

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
                      onChange={(e) => handleTabChange(e)}
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

                {/* SharePoint Controls - Uncomment to use */}
                {/* <div className="col-lg-4 col-md-6 col-sm-6">
                  <div className="form-group">
                    <button className="form-control" onClick={refreshToken}>Refresh Token</button>
                    {newAccessToken && <p>New Access Token: {newAccessToken}</p>}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                  </div>

                  <div>
                    <input className="form-control" type="file" onChange={handleFileChange} />
                  </div>

                  <div>
                    <button className="form-control" onClick={deleteImage}>Delete Image</button>
                  </div>
                </div> */}
              </div>

              <div className="tab-content mt-5">
                <div className="tab-pane show active">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="row justify-content-center">
                      <div
                        className="col-md-12 col-xl-4 col-lg-6"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  NO OF CLIENTS
                                </p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick(
                                    "client",
                                    dashboard.client,
                                    "Clients",
                                  )
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.client && dashboard.client.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/teamwork.png"
                                  alt="clients"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-12 col-xl-4 col-lg-6"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className=" mb-1">NO OF JOBS</p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick("job", dashboard.job, "Jobs")
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.job && dashboard.job.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/suitcase.png"
                                  alt="jobs"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-12 col-xl-4 col-lg-6"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  PENDING JOBS
                                </p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick(
                                    "pending_job",
                                    dashboard.pending_job,
                                    "Pending Jobs",
                                  )
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.pending_job &&
                                    dashboard.pending_job.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/pending.png"
                                  alt="pending"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-12 col-xl-4 col-lg-6"
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card report-card dashboard-card">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col-12">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  COMPLETED JOBS
                                </p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick(
                                    "completed_job",
                                    dashboard.completed_job,
                                    "Completed Jobs",
                                  )
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.completed_job &&
                                    dashboard.completed_job.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/time-management.png"
                                  alt="completed"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
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
                <div className="row dashboard-date-filter">

                  {/* ✅ Select Time Period – for ALL roles */}
                  <div className="col-lg-5 col-md-4 px-1">
                    <label>
                      <b>Time Period</b>
                    </label>
                    <select
                      className="form-select"
                      value={activityRange}
                      onChange={(e) => {
                        setActivityRange(e.target.value);
                        setSelectedFromDate("");
                        setSelectedToDate("");
                      }}
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
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* ✅ Custom Date – works for ALL roles */}
                {activityRange === "custom" && (
                  <div className="row dashboard-date-filter mt-2">
                    <div className="col-lg-6 col-md-6 px-1">
                      <label>
                        <b>From Date</b>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedFromDate}
                        name="fromDate"
                        onChange={selectFilterValue}
                        max={selectedToDate || undefined}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 px-1">
                      <label>
                        <b>To Date</b>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedToDate}
                        name="toDate"
                        onChange={selectFilterValue}
                        min={selectedFromDate || undefined}
                      />
                    </div>
                  </div>
                )}

                {/* ✅ Activity Logs – visible to ALL */}
                <div className="analytic-dash-activity" data-simplebar="init">
                  <div className="simplebar-mask1">
                    <div className="simplebar-content" style={{ padding: 0 }}>
                      <div className="activity">
                        {getActiviyLog && getActiviyLog.length > 0 ? (
                          getActiviyLog.map((item, index) => (
                            <div className="activity-info" key={index}>
                              <div className="icon-info-activity">
                                <CircleAlert size={14} />
                              </div>
                              <div className="activity-info-text">
                                <small>{formatDate(item?.created_at)}</small>
                                <p>{item?.log_message}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-data-found">
                            <img
                              src="/assets/images/No-data-amico.png"
                              alt="No data found"
                              style={{ maxWidth: "100%", height: "auto" }}
                            />
                            <p className="text-center">
                              {activityRange === "custom" &&
                                (!selectedFromDate || !selectedToDate)
                                ? "Please select both From Date and To Date to view activity logs"
                                : "No Activity Logs Found"}
                            </p>
                          </div>
                        )}

                        {hasMore && getActiviyLog.length > 0 && (
                          <div className="text-center mt-3">
                            <button
                              className="btn btn-info w-75"
                              onClick={loadMoreLogs}
                            >
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
  );
};

export default Dashboard;
