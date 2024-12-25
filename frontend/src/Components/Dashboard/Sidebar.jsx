import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const role = JSON.parse(localStorage.getItem("role"));
  const updatedShowTab = JSON.parse(localStorage.getItem("updatedShowTab"));

  const [activeLink, setActiveLink] = useState(location.pathname);
  const [menuState, setMenuState] = useState({
    dropdownOpen: {}, // Tracks which dropdown menus are open
  });

  // Update active link when location changes
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLinkClick = (e, linkPathname) => {
    e.preventDefault();
    setActiveLink(linkPathname);
    setMenuState({ dropdownOpen: {} }); // Close all dropdowns
    navigate(linkPathname);
  };

  const handleMenuClick = (e, linkPathname, isDropdown = false) => {
    e.preventDefault();
    if (isDropdown) {
      setMenuState((prevState) => ({
        ...prevState,
        dropdownOpen: {
          [linkPathname]: !prevState.dropdownOpen[linkPathname], // Toggle current dropdown
        },
      }));
    } else {
      setMenuState({ dropdownOpen: {} }); // Close all dropdowns
      setActiveLink(linkPathname);
      navigate(linkPathname);
    }
  };

  return (
    <div ref={menuRef}>
      <div className="left-sidenav">
        <div className="brand mt-4">
          <Link
            to="/admin/dashboard"
            aria-expanded="false"
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
          <div className="simplebar-wrapper">
            <div className="simplebar-content-wrapper">
              <div
                className="simplebar-content"
                style={{ padding: "0px 0px 70px" }}
              >
                <ul className="metismenu left-sidenav-menu mm-show">
                  <li
                    className={
                      activeLink === "/admin/dashboard" ? "active" : ""
                    }
                  >
                    <Link
                      to="/admin/dashboard"
                      aria-expanded="false"
                      onClick={(e) => handleLinkClick(e, "/admin/dashboard")}
                    >
                      <span className="sidebar-icons">
                        <i className="fa-regular fa-grid-2"></i>
                      </span>
                      <span>Dashboard</span>
                    </Link>
                  </li>

                  {((updatedShowTab && updatedShowTab.customer) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                    <li
                      className={
                        activeLink.startsWith("/admin/customer") ? "active" : ""
                      }
                    >
                      <Link
                        to="/admin/customer"
                        aria-expanded={
                          menuState.dropdownOpen["/admin/customer"]
                            ? "true"
                            : "false"
                        }
                        onClick={(e) =>
                          handleMenuClick(e, "/admin/customer", true)
                        }
                      >
                        <div>
                          <span className="sidebar-icons">
                            <i className="fas fa-users"></i>
                          </span>
                          <span className="pe-4 pe-lg-4">Customer</span>
                        </div>
                        <span className="chevron-icon">
                          <i
                            className={`fas ${
                              menuState.dropdownOpen["/admin/customer"]
                                ? "fa-chevron-down"
                                : "fa-chevron-right"
                            }`}
                          ></i>
                        </span>
                      </Link>
                      <ul
                        className={`nav-second-level ${
                          menuState.dropdownOpen["/admin/customer"]
                            ? "in"
                            : "mm-collapse"
                        }`}
                        aria-expanded={
                          menuState.dropdownOpen["/admin/customer"]
                            ? "true"
                            : "false"
                        }
                        style={{
                          height: menuState.dropdownOpen["/admin/customer"]
                            ? "auto"
                            : 0,
                        }}
                      >
                        <li
                          className={
                            activeLink === "/admin/customer" ? "active" : ""
                          }
                        >
                          <Link
                            to="/admin/customer"
                            onClick={(e) =>
                              handleMenuClick(e, "/admin/customer")
                            }
                          >
                            <i className="ti-control-record" />
                            Customer Detail
                          </Link>
                        </li>

                        <li
                          className={
                            activeLink === "/admin/ClientLists" ? "active" : ""
                          }
                        >
                          <Link
                            to="/admin/ClientLists"
                            onClick={(e) =>
                              handleMenuClick(e, "/admin/ClientLists")
                            }
                          >
                            <i className="ti-control-record" />
                            Client
                          </Link>
                        </li>
                        
                        <li
                          className={
                            activeLink === "/admin/client/profiles" ? "active" : ""
                          }
                        >
                          <Link
                            to="/admin/client/profiles"
                            onClick={(e) =>
                              handleMenuClick(e, "/admin/client/profiles")
                            }
                          >
                            <i className="ti-control-record" />
                            Job
                          </Link>
                        </li>
                       
                      </ul>
                    </li>
                  )}

                  {((updatedShowTab && updatedShowTab.status) ||
                    role === "ADMIN" ||
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
                    role === "ADMIN" ||
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

                  {(role === "ADMIN" || role === "SUPERADMIN") && (
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
                    role === "ADMIN" ||
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
                    role === "ADMIN" ||
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
                    role === "ADMIN" ||
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
