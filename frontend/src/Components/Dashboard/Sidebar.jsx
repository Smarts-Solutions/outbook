import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = JSON.parse(localStorage.getItem("role"));
  const updatedShowTab = JSON.parse(localStorage.getItem("updatedShowTab"));
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [menuState, setMenuState] = useState({
    dropdownOpen: {
      "/admin/customer": false, // Initially set the "Customer" dropdown to be closed or open based on current location
      "/admin/client/profiles": false, // For "Job" dropdown
      "/admin/ClientLists": false, // For "Client" dropdown
      "/admin/reports": false, // For "Reports" dropdown
      "admin/timesheetReports": false, // For "Time Sheet Reports" dropdown
      "/admin/job/customreport": false, // For "Custom Job Report" dropdown
    },
  });



  useEffect(() => {
    setActiveLink(location.pathname);

    setMenuState(prev => {
      // default: all closed
      const allKeys = {
        "/admin/customer": false,
        "/admin/client/profiles": false,
        "/admin/ClientLists": false,
        "/admin/reports": false,
        "/admin/timesheetReports": false,
        "/admin/job/customreport": false,
      };

      // open correct parent based on current route
      // if (location.pathname.startsWith("/admin/customer")) {
      //   allKeys["/admin/customer"] = true;
      // } 
      
       if (
        location.pathname.startsWith("/admin/reports") ||
        location.pathname.startsWith("/admin/timesheetReports") ||
        location.pathname.startsWith("/admin/job/customreport")
      ) {
        // any report-related path -> open the Reports parent
        allKeys["/admin/reports"] = true;
      } 
      
      else if(
        location.pathname.startsWith("/admin/customer") ||
        location.pathname.startsWith("/admin/ClientLists") ||
        location.pathname.startsWith("/admin/client/profiles")
        ){
        allKeys["/admin/customer"] = true;
      }

      return {
        ...prev,
        dropdownOpen: allKeys,
      };
    });
  }, [location]);


  const handleLinkClick = (e, linkPathname) => {
    if (e) e.preventDefault();
    setActiveLink(linkPathname);

    // Decide which parent should be open after navigation
    const reportPaths = ["/admin/reports", "/admin/timesheetReports", "/admin/job/customreport"];
    const customerPaths = ["/admin/customer", "/admin/ClientLists", "/admin/client"];

    setMenuState(prev => {
      const newDropdown = Object.keys(prev.dropdownOpen || {}).reduce((acc, k) => {
        acc[k] = false;
        return acc;
      }, {});

      if (reportPaths.some(p => linkPathname.startsWith(p))) {
        newDropdown["/admin/reports"] = true;
      } else if (linkPathname.startsWith("/admin/customer") || linkPathname.startsWith("/admin/client") || linkPathname === "/admin/ClientLists") {
        newDropdown["/admin/customer"] = true;
      }

      return { ...prev, dropdownOpen: newDropdown };
    });

    navigate(linkPathname);
  };


  const handleMenuClick = (e, key) => {
    if (e) e.preventDefault();
    setMenuState(prev => {
      // close all known keys then toggle requested key
      const newDropdown = Object.keys(prev.dropdownOpen || {}).reduce((acc, k) => {
        acc[k] = false;
        return acc;
      }, {});
      newDropdown[key] = !prev.dropdownOpen[key];
      return { ...prev, dropdownOpen: newDropdown };
    });
  };


  return (
    <div onClick={() => { sessionStorage.clear(); localStorage.removeItem('newCustomerId'); }}>
      <div className="left-sidenav">
        <div className="brand mt-4">
          <Link
            to="/admin/dashboard"
            onClick={(e) => handleLinkClick(e, "/admin/dashboard")}
          >
            <span className="sidebar-icons">
              <img
                src="/assets/images/logo.png"
                alt="logo-large"
                className="logo-lg logo-light"
              />
            </span>
          </Link>
        </div>
        <div className="menu-content h-100 mm-active" data-simplebar="init">
          <ul className="metismenu left-sidenav-menu mm-show">
            {/* Dashboard Link */}
            <li className={activeLink === "/admin/dashboard" ? "active" : ""}>
              <Link
                to="/admin/dashboard"
                onClick={(e) => handleLinkClick(e, "/admin/dashboard")}
              >
                <span className="sidebar-icons">
                  <i className="fa-regular fa-grid-2"></i>
                </span>
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Customer Dropdown */}
            <li
              className={
                activeLink.startsWith("/admin/customer") ||
                  activeLink.startsWith("/admin/ClientLists") ||
                  activeLink.startsWith("/admin/client/profiles")
                  ? "active"
                  : ""
              }
            >

              {((updatedShowTab && updatedShowTab.customer) ||
                (updatedShowTab && updatedShowTab.client) ||
                (updatedShowTab && updatedShowTab.job) ||
                (updatedShowTab && updatedShowTab.all_customers) ||
                (updatedShowTab && updatedShowTab.all_clients) ||
                (updatedShowTab && updatedShowTab.all_jobs) ||
                role === "SUPERADMIN") && (
                  <Link
                    to="/admin/customer"
                    onClick={(e) => handleMenuClick(e, "/admin/customer")}
                  >
                    <div>
                      <span className="sidebar-icons">
                        <i className="fas fa-users"></i>
                      </span>
                      <span className="pe-4 pe-lg-4">Customer</span>
                    </div>
                    <span className="chevron-icon">
                      <i
                        className={`fas ${menuState.dropdownOpen["/admin/customer"]
                          ? "fa-chevron-down"
                          : "fa-chevron-right"
                          }`}
                      ></i>
                    </span>
                  </Link>
                )}


              <ul
                className={`nav-second-level ${menuState.dropdownOpen["/admin/customer"] ? "in" : "mm-collapse"
                  }`}
                aria-expanded={
                  menuState.dropdownOpen["/admin/customer"] ? "true" : "false"
                }
              >
                <li className={activeLink === "/admin/customer" ? "active" : ""}>
                  {((updatedShowTab && updatedShowTab.customer) ||
                    (updatedShowTab && updatedShowTab.all_customers) ||
                    role === "SUPERADMIN") && (
                      <Link
                        to="/admin/customer"
                        onClick={(e) => handleLinkClick(e, "/admin/customer")}
                      >
                        {/* <i className="ti-control-record" /> */}
                        <i className="fa-solid fa-users-line"></i>
                        Customers
                      </Link>
                    )}

                </li>

                <li
                  className={activeLink === "/admin/ClientLists" ? "active" : ""}
                >

                  {((updatedShowTab && updatedShowTab.client) ||
                    (updatedShowTab && updatedShowTab.all_clients) ||
                    role === "SUPERADMIN") && (
                      <Link
                        to="/admin/ClientLists"
                        onClick={(e) => handleLinkClick(e, "/admin/ClientLists")}
                      >
                        <i className="fa-solid fa-user"></i>
                        {/* <i className="ti-control-record" /> */}
                        Clients
                      </Link>

                    )}
                </li>

                <li
                  className={activeLink === "/admin/client/profiles" ? "active" : ""}
                >

                  {((updatedShowTab && updatedShowTab.job) ||
                    (updatedShowTab && updatedShowTab.all_jobs) ||
                    role === "SUPERADMIN") && (

                      <Link
                        to="/admin/client/profiles"
                        onClick={(e) => handleLinkClick(e, "/admin/client/profiles")}
                      >
                        <i className="fa-solid fa-briefcase"></i>
                        {/* <i className="ti-control-record" /> */}
                        Jobs
                      </Link>
                    )}

                </li>
              </ul>
            </li>


            {((updatedShowTab && updatedShowTab.status) ||
              role === "SUPERADMIN") && (
                <li
                  className={activeLink === "/admin/status" ? "active" : ""}
                >
                  <Link
                    to="/admin/status"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/status")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-chart-pie"></i>
                    </span>
                    <span>Status</span>
                  </Link>
                </li>
              )}

            {((updatedShowTab && updatedShowTab.staff) ||
              role === "SUPERADMIN") && (
                <li
                  className={activeLink === "/admin/staff" ? "active" : ""}
                >
                  <Link
                    to="/admin/staff"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/staff")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-user-friends"></i>
                    </span>
                    <span>Staffs</span>
                  </Link>
                </li>
              )}

            {(role === "SUPERADMIN") && (
              <li
                className={activeLink === "/admin/access" ? "active" : ""}
              >
                <Link
                  to="/admin/access"
                  aria-expanded="false"
                  onClick={(e) => handleLinkClick(e, "/admin/access")}
                >
                  <span className="sidebar-icons">
                    <i className="fas fa-shield-alt"></i>{" "}
                    {/* Access icon */}
                  </span>
                  <span>Access</span>
                </Link>
              </li>
            )}



            {/* {((updatedShowTab && updatedShowTab.report) ||
              role === "SUPERADMIN") && (
                <li
                  className={
                    activeLink === "/admin/reports" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/reports"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/reports")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-file-alt"></i>{" "}

                    </span>
                    <span>Reports</span>
                  </Link>
                </li>
              )}

            {
              ["SUPERADMIN", "ADMIN"].includes(role) ?
                <li
                  className={
                    activeLink === "/admin/timesheetReports" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/timesheetReports"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/timesheetReports")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-clock"></i>{" "}

                    </span>
                    <span>Time Sheet Reports</span>
                  </Link>
                </li>
                : ""
            } */}

            {/* Customer Dropdown */}
            <li
              className={
                activeLink.startsWith("/admin/reports") ||
                  activeLink.startsWith("/admin/timesheetReports") ||
                  activeLink.startsWith("/admin/job/customreport")
                  ? "active"
                  : ""
              }
            >

              {((updatedShowTab && updatedShowTab.report) || role === "SUPERADMIN") && (
                <a
                  href="#"
                  onClick={(e) => handleMenuClick(e, "/admin/reports")}
                  className="sidebar-parent"
                >
                  <div>
                    <span className="sidebar-icons">
                      <i className="fas fa-users"></i>
                    </span>
                    <span className="pe-4 pe-lg-4">Reports</span>
                  </div>
                  <span className="chevron-icon">
                    <i
                      className={`fas ${menuState.dropdownOpen["/admin/reports"]
                        ? "fa-chevron-down"
                        : "fa-chevron-right"
                        }`}
                    ></i>
                  </span>
                </a>
              )}


              <ul
                className={`nav-second-level ${menuState.dropdownOpen["/admin/reports"] ? "in" : "mm-collapse"
                  }`}
                aria-expanded={
                  menuState.dropdownOpen["/admin/reports"] ? "true" : "false"
                }
              >
                <li
                  className={
                    activeLink === "/admin/reports" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/reports"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/reports")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-file-alt"></i>{" "}

                    </span>
                    <span>Standard</span>
                  </Link>
                </li>




                <li
                  className={
                    activeLink === "/admin/timesheetReports" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/timesheetReports"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/timesheetReports")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-clock"></i>{" "}
                    </span>
                    <span>Custom TimeSheet</span>
                  </Link>
                </li>


                <li
                  className={
                    activeLink === "/admin/job/customreport" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/job/customreport"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/job/customreport")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-clock"></i>{" "}

                    </span>
                    <span>Custom Job</span>
                  </Link>
                </li>

              </ul>
            </li>

            {/* {((updatedShowTab && updatedShowTab.report) || role === "SUPERADMIN") && (
              <li className={activeLink.startsWith("/admin/reports") ? "active" : ""}>
                <Link
                  to="/admin/reports"
                  onClick={(e) => handleMenuClick(e, "/admin/reports")}
                >
                  <div>
                    <span className="sidebar-icons">
                      <i className="fas fa-file-alt"></i>
                    </span>
                    <span className="pe-4 pe-lg-4">Reports</span>
                  </div>
                  <span className="chevron-icon">
                    <i
                      className={`fas ${menuState.dropdownOpen["/admin/reports"] ? "fa-chevron-down" : "fa-chevron-right"}`}
                    ></i>
                  </span>
                </Link>
                <ul
                  className={`nav-second-level ${menuState.dropdownOpen["/admin/reports"] ? "in" : "mm-collapse"}`}
                  aria-expanded={menuState.dropdownOpen["/admin/reports"] ? "true" : "false"}
                >

                
                  <li
                    className={
                      activeLink === "/admin/reports" ? "active" : ""
                    }
                  >
                    <Link
                      to="/admin/reports"
                      aria-expanded="false"
                      onClick={(e) => handleLinkClick(e, "/admin/reports")}
                    >
                      <span className="sidebar-icons">
                        <i className="fas fa-file-alt"></i>{" "}
                      
                      </span>
                      <span>Standard</span>
                    </Link>
                  </li>


                  
            
                  <li
                    className={
                      activeLink === "/admin/timesheetReports" ? "active" : ""
                    }
                  >
                    <Link
                      to="/admin/timesheetReports"
                      aria-expanded="false"
                      onClick={(e) => handleLinkClick(e, "/admin/timesheetReports")}
                    >
                      <span className="sidebar-icons">
                        <i className="fas fa-clock"></i>{" "}
                      </span>
                      <span>Custom TimeSheet</span>
                    </Link>
                  </li>


                  <li
                    className={
                      activeLink === "/admin/job/customreport" ? "active" : ""
                    }
                  >
                    <Link
                      to="/admin/job/customreport"
                      aria-expanded="false"
                      onClick={(e) => handleLinkClick(e, "/admin/job/customreport")}
                    >
                      <span className="sidebar-icons">
                        <i className="fas fa-clock"></i>{" "}

                      </span>
                      <span>Custom Job</span>
                    </Link>
                  </li>

                </ul>
              </li>
            )} */}




            {((updatedShowTab && updatedShowTab.timesheet) ||
              role === "SUPERADMIN") && (
                <>
                  <li
                    className={
                      activeLink === "/admin/timesheet" ? "active" : ""
                    }
                  >
                    <Link
                      to="/admin/timesheet"
                      aria-expanded="false"
                      onClick={(e) => handleLinkClick(e, "/admin/timesheet")}
                    >
                      <span className="sidebar-icons">
                        <i className="fas fa-clock"></i>{" "}
                        {/* Time Sheet icon */}
                      </span>
                      <span>Time Sheet</span>
                    </Link>
                  </li>

                </>
              )}


            {((updatedShowTab && updatedShowTab.setting) ||
              role === "SUPERADMIN") && (
                <li
                  className={
                    activeLink === "/admin/setting" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/setting"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/setting")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-cog"></i> {/* Setting icon */}
                    </span>
                    <span>Settings</span>
                  </Link>
                </li>
              )}


            {/* Coustomer users*/}
            {(
              role === "SUPERADMIN") && (
                <li
                  className={
                    activeLink === "/admin/cust_details" ? "active" : ""
                  }
                >
                  <Link
                    to="/admin/cust_details"
                    aria-expanded="false"
                    onClick={(e) => handleLinkClick(e, "/admin/cust_details")}
                  >
                    <span className="sidebar-icons">
                      <i className="fas fa-user-cog"></i> {/* Customer Details icon */}
                    </span>
                    <span>Customer Details</span>
                  </Link>
                </li>
              )}


          </ul>
        </div>
      </div >
    </div >
  );
};

export default Sidebar;
