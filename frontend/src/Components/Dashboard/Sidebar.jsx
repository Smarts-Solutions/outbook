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
    },
  });

  console.log("updatedShowTab --- ", updatedShowTab);

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(location.pathname);

    // Check if we're on any customer-related page, and set the dropdown state accordingly
    if (location.pathname.startsWith("/admin/customer")) {
      setMenuState((prevState) => ({
        ...prevState,
        dropdownOpen: {
          ...prevState.dropdownOpen,
          "/admin/customer": true, // Keep the "Customer" dropdown open if we're on any customer-related page
        },
      }));
    } else if (location.pathname.startsWith("/admin/client")) {
      setMenuState((prevState) => ({
        ...prevState,
        dropdownOpen: {
          ...prevState.dropdownOpen,
          "/admin/client/profiles": true, // Keep the "Job" dropdown open if we're on any job-related page
        },
      }));
    } else if (location.pathname === "/admin/ClientLists") {
      setMenuState((prevState) => ({
        ...prevState,
        dropdownOpen: {
          ...prevState.dropdownOpen,
          "/admin/ClientLists": true, // Keep the "Client" dropdown open when on Client Lists page
        },
      }));
    } else {
      // Close the dropdowns if we're not on any customer or job-related page
      setMenuState((prevState) => ({
        ...prevState,
        dropdownOpen: {
          ...prevState.dropdownOpen,
          "/admin/customer": false,
          "/admin/client/profiles": false,
          "/admin/ClientLists": false, // Close Client dropdown as well
        },
      }));
    }
  }, [location]);


  // Handle link click and set the active tab
  const handleLinkClick = (e, linkPathname) => {
    e.preventDefault();
    setActiveLink(linkPathname); // Update the active link state
    navigate(linkPathname); // Navigate to the new link
  };

  // Handle dropdown menu click
  const handleMenuClick = (e, linkPathname) => {
    e.preventDefault();
    setMenuState((prevState) => ({
      ...prevState,
      dropdownOpen: {
        ...prevState.dropdownOpen,
        [linkPathname]: !prevState.dropdownOpen[linkPathname], // Toggle current dropdown
      },
    }));
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
                    <span>Staff</span>
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

            {((updatedShowTab && updatedShowTab.report) ||
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
                      {/* Report icon */}
                    </span>
                    <span>Report</span>
                  </Link>
                </li>
              )}

            {((updatedShowTab && updatedShowTab.timesheet) ||
              role === "SUPERADMIN") && (
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
                    <span>Setting</span>
                  </Link>
                </li>
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
