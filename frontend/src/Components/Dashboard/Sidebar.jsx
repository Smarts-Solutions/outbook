import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Sidebar = () => { 
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const role = JSON.parse(localStorage.getItem("role"));
  const updatedShowTab = JSON.parse(localStorage.getItem("updatedShowTab"));

  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    const menuElement = menuRef.current;
    const links = menuElement.querySelectorAll(".left-sidenav a");

    links.forEach((link) => {
      const linkPathname = new URL(link.href).pathname;
      if (linkPathname === activeLink) {
        link.classList.add("active");
        link.parentElement.classList.add("active");
        if (link.closest("ul"))
          link.closest("ul").classList.add("in", "mm-show");
        if (link.closest("ul") && link.closest("ul").parentElement) {
          link.closest("ul").parentElement.classList.add("mm-active", "active");
          if (link.closest("ul").parentElement.closest("ul")) {
            link
              .closest("ul")
              .parentElement.closest("ul")
              .classList.add("mm-show");
            if (link.closest("ul").parentElement.closest("ul").parentElement) {
              link
                .closest("ul")
                .parentElement.closest("ul")
                .parentElement.classList.add("mm-active");
            }
          }
        }
      } else {
        link.classList.remove("active");
        link.parentElement.classList.remove("active");
      }
    });
  }, [activeLink]);

  
  const handleLinkClick = (e, linkPathname) => {
    e.preventDefault();
    setActiveLink(linkPathname);
    navigate(linkPathname);
  };

  return (
    <div ref={menuRef} onClick={()=>{sessionStorage.clear() ;  localStorage.removeItem('newCustomerId');}}>
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
                  <li className={activeLink === "/admin/dashboard" ? "active" : ""}>
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
                      <li className={activeLink === "/admin/customer" ? "active" : ""}>
                        <Link
                          to="/admin/customer"
                          aria-expanded="false"
                          onClick={(e) => handleLinkClick(e, "/admin/customer")}
                        >
                          <span className="sidebar-icons">
                            <i className="fas fa-users"></i> {/* Customer icon */}
                          </span>
                          <span>Customer</span>
                        </Link>
                      </li>
                    )}

                  {((updatedShowTab && updatedShowTab.status) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                      <li className={activeLink === "/admin/status" ? "active" : ""}>
                        <Link
                          to="/admin/status"
                          aria-expanded="false"
                          onClick={(e) => handleLinkClick(e, "/admin/status")}
                        >
                          <span className="sidebar-icons">
                            <i className="fas fa-chart-pie"></i> {/* Status icon */}
                          </span>
                          <span>Status</span>
                        </Link>
                      </li>
                    )}

                  {((updatedShowTab && updatedShowTab.staff) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                      <li className={activeLink === "/admin/staff" ? "active" : ""}>
                        <Link
                          to="/admin/staff"
                          aria-expanded="false"
                          onClick={(e) => handleLinkClick(e, "/admin/staff")}
                        >
                          <span className="sidebar-icons">
                            <i className="fas fa-user-friends"></i> {/* Staff icon */}
                          </span>
                          <span>Staff</span>
                        </Link>
                      </li>
                    )}

                  {(role === "ADMIN" || role === "SUPERADMIN") && (
                    <li className={activeLink === "/admin/access" ? "active" : ""}>
                      <Link
                        to="/admin/access"
                        aria-expanded="false"
                        onClick={(e) => handleLinkClick(e, "/admin/access")}
                      >
                        <span className="sidebar-icons">
                          <i className="fas fa-shield-alt"></i> {/* Access icon */}
                        </span>
                        <span>Access</span>
                      </Link>
                    </li>
                  )}

                  {
                  ((updatedShowTab && updatedShowTab.report) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                      <li className={activeLink === "/admin/reports" ? "active" : ""}>
                        <Link
                          to="/admin/reports"
                          aria-expanded="false"
                          onClick={(e) => handleLinkClick(e, "/admin/reports")}
                        >
                          <span className="sidebar-icons">
                            <i className="fas fa-file-alt"></i> {/* Report icon */}
                          </span>
                          <span>Report</span>
                        </Link>
                      </li>
                    )
                    }

                    {((updatedShowTab && updatedShowTab.timesheet) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                      <li className={activeLink === "/admin/timesheet" ? "active" : ""}>
                        <Link
                          to="/admin/timesheet"
                          aria-expanded="false"
                          onClick={(e) => handleLinkClick(e, "/admin/timesheet")}
                        >
                          <span className="sidebar-icons">
                            <i className="fas fa-clock"></i> {/* Time Sheet icon */}
                          </span>
                          <span>Time Sheet</span>
                        </Link>
                      </li>
                    )}
                  {((updatedShowTab && updatedShowTab.setting) ||
                    role === "ADMIN" ||
                    role === "SUPERADMIN") && (
                      <li className={activeLink === "/admin/setting" ? "active" : ""}>
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
