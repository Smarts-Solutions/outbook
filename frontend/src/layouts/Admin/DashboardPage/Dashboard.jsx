import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DashboardData,
  ActivityLog,
} from "../../../ReduxStore/Slice/Dashboard/DashboardSlice";
import { Staff } from "../../../ReduxStore/Slice/Staff/staffSlice";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Select from "react-select";
import {Circle} from "lucide-react"

const Dashboard = () => {
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const getActiveTab = sessionStorage.getItem("activDashborde");
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("token"));
  const dispatch = useDispatch();

  const [dashboard, setDashboard] = useState([]);
  const [getActiviyLog, setActivityLog] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(getActiveTab || "this_week");
  const [activityRange, setActivityRange] = useState("this_week");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [staffOptions, setStaffOptions] = useState([]);
  const [staffPage, setStaffPage] = useState(1);
  const [staffHasMore, setStaffHasMore] = useState(true);
  const [staffSearch, setStaffSearch] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const staffCacheRef = useRef({});
  const staffDebounceTimeout = useRef(null);
  
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
  }, [activityRange, selectedStaff, selectedFromDate, selectedToDate]);

  const GetDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const req = { staff_id: staffDetails.id, date_filter: selectedTab };
      const data = { req: req, authToken: token };

      const res = await dispatch(DashboardData(data)).unwrap();

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

  const GetAllStaff = async ({ searchValue = "", pageNo = 1, append = false } = {}) => {
    if (staffLoading) return;

    const cacheKey = `${searchValue}_${pageNo}`;
    if (staffCacheRef.current[cacheKey]) {
      const cached = staffCacheRef.current[cacheKey];
      setStaffOptions((prev) => {
        const combined = append ? [...prev, ...cached] : cached;
        const unique = Array.from(
          new Map(combined.map((item) => [item.value, item])).values(),
        );
        return unique;
      });
      return;
    }

    setStaffLoading(true);

    try {
      const response = await dispatch(
        Staff({
          req: { action: "get", page: pageNo, limit: 20, search: searchValue },
          authToken: token,
        }),
      ).unwrap();

      if (response.status) {
        const formatted = response.data.data.map((val) => ({
          value: val.id,
          label: `${val.first_name} ${val.last_name}`,
        }));
        staffCacheRef.current[cacheKey] = formatted;
        setStaffOptions((prev) => {
          const combined = append ? [...prev, ...formatted] : formatted;
          const unique = Array.from(
            new Map(combined.map((item) => [item.value, item])).values(),
          );
          return unique;
        });
        setStaffHasMore(response.data.data.length === 20);
        setStaffPage(pageNo);
      } else {
        if (!append) setStaffOptions([]);
      }
    } catch (error) {
      console.error("Staff Error:", error);
      if (!append) setStaffOptions([]);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffSearch = (value) => {
    clearTimeout(staffDebounceTimeout.current);
    staffDebounceTimeout.current = setTimeout(() => {
      setStaffSearch(value);
      setStaffPage(1);
      GetAllStaff({ searchValue: value, pageNo: 1 });
    }, 500);
  };

  const ActivityLogData = async (pageNo = 1) => {
    try {
      const req = {
        staff_id: staffDetails.id,
        filter_type: activityRange,
        page: pageNo,
      };

      if (selectedStaff) {
        req.filter_staff_id = selectedStaff;
      }

      if (activityRange === "custom") {
        req.from_date = selectedFromDate;
        req.to_date = selectedToDate;
      }

      const data = { req, authToken: token };

      const res = await dispatch(ActivityLog(data)).unwrap();

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

      if (selectedStaff) {
        req.filter_staff_id = selectedStaff;
      }

      if (activityRange === "custom") {
        req.from_date = selectedFromDate;
        req.to_date = selectedToDate;
      }

      const data = { req, authToken: token };
      const res = await dispatch(ActivityLog(data)).unwrap();

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
    navigate("/admin/dashboard/data", { state: { req: req } });
  };

  const exportData = getActiviyLog?.map((item) => ({
    staff_name: item.staff_name,
    log_message: item.log_message,
    created_at: formatDate(item.created_at),
  }));

  const selectFilterValue = async (e) => {
    let { name, value } = e.target;

    if (name === "staff") {
      setSelectedStaff(value);
    } else if (name === "fromDate") {
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
                  <h2 className="page-title mt-1">{staffDetails.role_name}</h2>
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
                                  NO OF CUSTOMERS
                                </p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick(
                                    "customer",
                                    dashboard.customer,
                                    "Customers",
                                  )
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.customer &&
                                    dashboard.customer.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/users.png"
                                  alt="customers"
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
                        <div className="card report-card dashboard-card ">
                          <div className="card-body">
                            <div className="row d-flex justify-content-center">
                              <div className="col">
                                <p className="text-dark mb-1 font-weight-semibold">
                                  NO OF STAFF
                                </p>
                              </div>
                              <div
                                className="col-12 d-flex align-items-center justify-content-between"
                                onClick={() =>
                                  handleClick("staff", dashboard.staff, "Staff")
                                }
                              >
                                <h3 className="my-4">
                                  {formatNumberSafe(
                                    dashboard.staff && dashboard.staff.count,
                                  )}
                                </h3>
                                <img
                                  className="dashboad-img"
                                  src="/assets/images/dashboards/handshake.png"
                                  alt="staff"
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
                {["SUPERADMIN", "ADMIN", "MANAGEMENT"].includes(role) ? (
                  <>
                    <div className="row dashboard-date-filter">
                      <div className="col-lg-5 col-md-4 px-1">
                        <label>
                          <b>Select Staff</b>
                        </label>
                        <Select
                          id="tabSelect"
                          name="staff"
                          className="basic-multi-select"
                          options={[{ value: "", label: "-- Select --" }, ...staffOptions]}
                          value={[{ value: "", label: "-- Select --" }, ...staffOptions].find(
                            (obj) => Number(obj.value) === Number(selectedStaff)
                          )}
                          placeholder="-- Select --"
                          onChange={(selectedOption) => {
                            const e = {
                              target: {
                                name: "staff",
                                value: selectedOption ? selectedOption.value : "",
                              },
                            };
                            selectFilterValue(e);
                            if (!selectedOption || selectedOption.value === "") {
                              setStaffHasMore(true);
                              setStaffPage(1);
                              setStaffSearch("");
                              setStaffOptions([]);
                              staffCacheRef.current = {};
                            }
                          }}
                          onMenuOpen={() => {
                            if (staffOptions.length === 0) {
                              GetAllStaff({ searchValue: "", pageNo: 1 });
                            }
                          }}
                          onInputChange={(value) => handleStaffSearch(value)}
                          onMenuScrollToBottom={() => {
                            if (staffHasMore && !staffLoading) {
                              GetAllStaff({
                                searchValue: staffSearch,
                                pageNo: staffPage + 1,
                                append: true,
                              });
                            }
                          }}
                          classNamePrefix="react-select"
                          isSearchable
                          isLoading={staffLoading}
                        />
                      </div>

                      <div className="col-lg-5 col-md-4 px-1">
                        <label>
                          <b>Select Time Period</b>
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
                          <option value="last_six_month">Last 6 Months</option>
                          <option value="last_year">Last Year</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>

                      <div className="col-lg-4 col-md-4 px-1"></div>
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
                            onChange={(e) => selectFilterValue(e)}
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
                            onChange={(e) => selectFilterValue(e)}
                            min={selectedFromDate || undefined}
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : null}

                {/* ✅ Activity Logs – visible to ALL */}
                <div className="analytic-dash-activity" data-simplebar="init">
                  <div className="simplebar-mask1">
                    <div className="simplebar-content" style={{ padding: 0 }}>
                      <div className="activity">
                        {getActiviyLog && getActiviyLog.length > 0 ? (
                          getActiviyLog.map((item, index) => (
                            <div className="activity-info" key={index}>
                              <div className="icon-info-activity">
                               <Circle size={14} fill="#00afef"/>
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
