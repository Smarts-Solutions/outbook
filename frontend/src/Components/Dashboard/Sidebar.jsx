import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const role = JSON.parse(localStorage.getItem("role"));
  
  
  const accessData = useSelector((state) => state && state.AccessSlice && state.AccessSlice.RoleAccess.data);
  
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [showSettingTab, setShowSettingTab] = useState(true);
  const [showCustomerTab, setShowCustomerTab] = useState(true);
  const [showStaffTab, setShowStaffTab] = useState(true);


  useEffect(() => {
    if (accessData && accessData.length > 0 && role !== "ADMIN" && role !== "SUPERADMIN") {
      accessData && accessData.map((item) => {

        if (item.permission_name === "setting") {
          const settingView = item.items.find((item) => item.type === "view");
          setShowSettingTab(settingView && settingView.is_assigned == 1);
        }

        if (item.permission_name === "customer") {
          const customerView = item.items.find((item) => item.type === "view");
          setShowCustomerTab(customerView && customerView.is_assigned==1);
        }

        if (item.permission_name === "staff") {
          const staffView = item.items.find((item) => item.type === "view");
          setShowStaffTab(staffView && staffView.is_assigned ==1);
          
        }

      });
    }
  }, [accessData]);



  useEffect(() => {
    const menuElement = menuRef.current;
    const links = menuElement.querySelectorAll(".left-sidenav a");

    links.forEach(link => {
      const linkPathname = new URL(link.href).pathname;
      if (linkPathname === activeLink) {
        link.classList.add("active");
        link.parentElement.classList.add("active");
        if (link.closest("ul")) link.closest("ul").classList.add("in", "mm-show");
        if (link.closest("ul") && link.closest("ul").parentElement) {
          link.closest("ul").parentElement.classList.add("mm-active", "active");
          if (link.closest("ul").parentElement.closest("ul")) {
            link.closest("ul").parentElement.closest("ul").classList.add("mm-show");
            if (link.closest("ul").parentElement.closest("ul").parentElement) {
              link.closest("ul").parentElement.closest("ul").parentElement.classList.add("mm-active");
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
    <div ref={menuRef}>
      <div className="left-sidenav">
        {/* LOGO */}
        <div className="brand">
          <a href="/dashboard/crm-index.html" className="logo">
            <span>
              <img
                src="/assets/images/logo.png"
                alt="logo-large"
                className="logo-lg logo-light"
              />
            </span>
          </a>
        </div>
        {/* End Logo */}
        <div className="menu-content h-100 mm-active" data-simplebar="init">
          <div className="simplebar-wrapper">
            <div className="simplebar-height-auto-observer-wrapper">
              <div className="simplebar-height-auto-observer" />
            </div>
            <div className="simplebar-mask">
              <div className="simplebar-offset" style={{ right: 0, bottom: 0 }}>
                <div className="simplebar-content-wrapper" style={{ height: "100%", overflow: "hidden scroll" }}>
                  <div className="simplebar-content" style={{ padding: "0px 0px 70px" }}>
                    <ul className="metismenu left-sidenav-menu mm-show">
                      
                      <li className={activeLink === '/dashboard' ? 'active' : ''}>
                        <Link
                          to="/admin/dashboard"
                          aria-expanded="false"
                          className={activeLink === '/admin/dashboard' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/dashboard')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/dashboard.png" alt="Dashboard" />
                          </span>
                          <span>Dashboard</span>
                        </Link>
                      </li>

                      {!showCustomerTab ? null : <li className={activeLink === '/admin/customer' ? 'active' : ''}>
                        <Link
                          to="/admin/customer"
                          aria-expanded="false"
                          className={activeLink === '/admin/customer' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/customer')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/customers.png" alt="Customer" />
                          </span>
                          <span>Customer</span>
                        </Link>
                      </li>}

                      <li className={activeLink === '/admin/status' ? 'active' : ''}>
                        <Link
                          to="/admin/status"
                          aria-expanded="false"
                          className={activeLink === '/admin/status' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/status')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/status.png" alt="Status" />
                          </span>
                          <span>Status</span>

                        </Link>
                      </li>

                      {!showStaffTab ? null : <li className={activeLink === '/admin/staff' ? 'active' : ''}>
                        <Link
                          to="/admin/staff"
                          aria-expanded="false"
                          className={activeLink === '/admin/staff' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/staff')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/staff.png" alt="Staff" />
                          </span>
                          <span>Staff</span>
                        </Link>
                      </li>}

                      <li className={activeLink === '/admin/access' ? 'active' : ''}>
                        <Link
                          to="/admin/access"
                          aria-expanded="false"
                          className={activeLink === '/admin/access' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/access')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/access.png" alt="Access" />
                          </span>
                          <span>Access</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/reports' ? 'active' : ''}>
                        <Link
                          to="/admin/reports"
                          aria-expanded="false"
                          className={activeLink === '/admin/reports' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/reports')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/reports.png" alt="Report" />
                          </span>
                          <span>Report</span>
                        </Link>
                      </li>

                      {!showSettingTab ? null : <li className={activeLink === '/admin/setting' ? 'active' : ''}>
                        <Link
                          to="/admin/setting"
                          aria-expanded="false"
                          className={activeLink === '/admin/setting' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/setting')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/setting.png" alt="Setting" />
                          </span>
                          <span>Setting</span>
                        </Link>
                      </li>}



                      {/* <li className={activeLink === '/dashboard' ? 'active' : ''}>
                        <Link
                          to="/admin/dashboard"
                          aria-expanded="false"
                          className={activeLink === '/admin/dashboard' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/dashboard')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/dashboard.png" alt="Dashboard" />
                          </span>
                          <span>Dashboard</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/customer' ? 'active' : ''}>
                        <Link
                          to="/admin/customer"
                          aria-expanded="false"
                          className={activeLink === '/admin/customer' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/customer')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/customers.png" alt="Customer" />
                          </span>
                          <span>Customer</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/status' ? 'active' : ''}>
                        <Link
                          to="/admin/status"
                          aria-expanded="false"
                          className={activeLink === '/admin/status' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/status')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/status.png" alt="Status" />
                          </span>
                          <span>Status</span>

                        </Link>
                      </li>

                      <li className={activeLink === '/admin/staff' ? 'active' : ''}>
                        <Link
                          to="/admin/staff"
                          aria-expanded="false"
                          className={activeLink === '/admin/staff' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/staff')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/staff.png" alt="Staff" />
                          </span>
                          <span>Staff</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/access' ? 'active' : ''}>
                        <Link
                          to="/admin/access"
                          aria-expanded="false"
                          className={activeLink === '/admin/access' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/access')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/access.png" alt="Access" />
                          </span>
                          <span>Access</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/reports' ? 'active' : ''}>
                        <Link
                          to="/admin/reports"
                          aria-expanded="false"
                          className={activeLink === '/admin/reports' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/reports')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/reports.png" alt="Report" />
                          </span>
                          <span>Report</span>
                        </Link>
                      </li>

                      <li className={activeLink === '/admin/setting' ? 'active' : ''}>
                        <Link
                          to="/admin/setting"
                          aria-expanded="false"
                          className={activeLink === '/admin/setting' ? 'active' : ''}
                          onClick={(e) => handleLinkClick(e, '/admin/setting')}
                        >
                          <span className="sidebar-icons">
                            <img src="/assets/images/sidebar-icons/setting.png" alt="Setting" />
                          </span>
                          <span>Setting</span>
                        </Link>
                      </li> */}


                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="simplebar-placeholder" style={{ width: "auto", height: 735 }} />
          </div>
          <div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}>
            <div className="simplebar-scrollbar" style={{ width: 0, display: "none" }} />
          </div>
          <div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}>
            <div className="simplebar-scrollbar" style={{ height: 151, transform: "translate3d(0px, 0px, 0px)", display: "block" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
