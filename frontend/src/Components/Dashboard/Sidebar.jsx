import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (e, linkPathname) => {
    e.preventDefault();
    setActiveLink(linkPathname);
    navigate(linkPathname);
  };

  return (
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
        <ul className="metismenu left-sidenav-menu mm-show">
          <li className={activeLink === '/admin/dashboard' ? 'active' : ''}>
            <Link
              to="/admin/dashboard"
              onClick={(e) => handleLinkClick(e, '/admin/dashboard')}
            >
              <span className="sidebar-icons">
                <img src="/assets/images/sidebar-icons/dashboard.png" alt="Dashboard" />
              </span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={activeLink === '/admin/customer/customer' ? 'active' : ''}>
            <Link
              to="/admin/customer/customer"
              onClick={(e) => handleLinkClick(e, '/admin/customer/customer')}
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
              onClick={(e) => handleLinkClick(e, '/admin/setting')}
            >
              <span className="sidebar-icons">
                <img src="/assets/images/sidebar-icons/setting.png" alt="Setting" />
              </span>
              <span>Setting</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
