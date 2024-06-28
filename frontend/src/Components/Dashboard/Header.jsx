import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { isLoginAuthCheckToken } from '../../ReduxStore/Slice/Auth/authSlice'


const Header = () => {
    const navigate= useNavigate();
    const dispatch = useDispatch();
    const staffDetails = JSON.parse(localStorage.getItem('staffDetails'));
    const role = JSON.parse(localStorage.getItem("role"));
    const token = JSON.parse(localStorage.getItem("token"));

    const [isMenuEnlarged, setIsMenuEnlarged] = useState(false);

    const toggleMenu = () => {
      setIsMenuEnlarged(prevState => !prevState);
    };

    const isLoginAuthCheck = async (e) => {
        const req = { id: staffDetails.id, login_auth_token: token }
        await dispatch(isLoginAuthCheckToken(req))
            .unwrap()
            .then(async (response) => {
                //console.log("response", response);
                if (response.status==false) {
                    LogoutUser()
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };
    
    useEffect(() => {
      
        isLoginAuthCheck();
    
      if (isMenuEnlarged) {
        document.body.classList.add('enlarge-menu');
      } else {
        document.body.classList.remove('enlarge-menu');
      }
      
      // Cleanup function to remove the class when the component unmounts
      return () => {
        document.body.classList.remove('enlarge-menu');
      };
    }, [isMenuEnlarged]);


    const LogoutUser = async (e) => {
        localStorage.removeItem("staffDetails");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };



    return (
        <div>
            <div className="topbar">
                {/* Navbar */}
             
                <nav className="navbar-custom">
                    <ul className="list-unstyled topbar-nav float-right mb-0">
                        <li className="dropdown hide-phone">
                        <div className="app-search-topbar">
                                    <form action="#" method="get">
                                        <input
                                            type="search"
                                            name="search"
                                            className="from-control top-search mb-0"
                                            placeholder="Search anything here..."
                                        />{" "}
                                        <button type="submit">
                                            <i className="ti-search" />
                                        </button>
                                    </form>
                                </div>
                          
                        </li>
                        <li className="dropdown notification-list">
                            <a
                                className="nav-link dropdown-toggle arrow-none waves-light waves-effect"
                                data-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-haspopup="false"
                                aria-expanded="false"
                            >
                                <i className="fa-solid fa-bell"></i>
                                <span className="badge  text-white text-bg-info badge-pill noti-icon-badge">
                                    2
                                </span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right dropdown-lg pt-0">
                                <h6 className="dropdown-item-text font-15 m-0 py-3 border-bottom d-flex justify-content-between align-items-center">
                                    Notifications{" "}
                                    <span className="badge badge-primary badge-pill">2</span>
                                </h6>
                                <div className="notification-menu" data-simplebar="init">
                                    <div className="simplebar-wrapper" style={{ margin: 0 }}>
                                        <div className="simplebar-height-auto-observer-wrapper">
                                            <div className="simplebar-height-auto-observer" />
                                        </div>
                                        <div className="simplebar-mask">
                                            <div
                                                className="simplebar-offset"
                                                style={{ right: 0, bottom: 0 }}
                                            >
                                                <div
                                                    className="simplebar-content-wrapper"
                                                    style={{ height: "auto", overflow: "hidden" }}
                                                >
                                                    <div className="simplebar-content" style={{ padding: 0 }}>
                                                        {/* item*/}{" "}
                                                        <a href="#" className="dropdown-item py-3">
                                                            <small className="float-right text-muted pl-2">
                                                                2 min ago
                                                            </small>
                                                            <div className="media">
                                                                <div className="avatar-md bg-soft-primary">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-shopping-cart align-self-center icon-xs"
                                                                    >
                                                                        <circle cx={9} cy={21} r={1} />
                                                                        <circle cx={20} cy={21} r={1} />
                                                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                                    </svg>
                                                                </div>
                                                                <div className="media-body align-self-center ml-2 text-truncate">
                                                                    <h6 className="my-0 font-weight-normal text-dark">
                                                                        Your order is placed
                                                                    </h6>
                                                                    <small className="text-muted mb-0">
                                                                        Dummy text of the printing and industry.
                                                                    </small>
                                                                </div>
                                                                {/*end media-body*/}
                                                            </div>
                                                            {/*end media*/}{" "}
                                                        </a>
                                                        {/*end-item*/}
                                                        {/* item*/}{" "}
                                                        <a href="#" className="dropdown-item py-3">
                                                            <small className="float-right text-muted pl-2">
                                                                10 min ago
                                                            </small>
                                                            <div className="media">
                                                                <div className="avatar-md bg-soft-primary">
                                                                    <img
                                                                        src="assets/images/users/profile.jpg"
                                                                        alt=""
                                                                        className="thumb-sm rounded-circle"
                                                                    />
                                                                </div>
                                                                <div className="media-body align-self-center ml-2 text-truncate">
                                                                    <h6 className="my-0 font-weight-normal text-dark">
                                                                        Meeting with designers
                                                                    </h6>
                                                                    <small className="text-muted mb-0">
                                                                        It is a long established fact that a reader.
                                                                    </small>
                                                                </div>
                                                                {/*end media-body*/}
                                                            </div>
                                                            {/*end media*/}{" "}
                                                        </a>
                                                        {/*end-item*/}
                                                        {/* item*/}{" "}
                                                        <a href="#" className="dropdown-item py-3">
                                                            <small className="float-right text-muted pl-2">
                                                                40 min ago
                                                            </small>
                                                            <div className="media">
                                                                <div className="avatar-md bg-soft-primary">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-users align-self-center icon-xs"
                                                                    >
                                                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                                        <circle cx={9} cy={7} r={4} />
                                                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                                                    </svg>
                                                                </div>
                                                                <div className="media-body align-self-center ml-2 text-truncate">
                                                                    <h6 className="my-0 font-weight-normal text-dark">
                                                                        UX 3 Task complete.
                                                                    </h6>
                                                                    <small className="text-muted mb-0">
                                                                        Dummy text of the printing.
                                                                    </small>
                                                                </div>
                                                                {/*end media-body*/}
                                                            </div>
                                                            {/*end media*/}{" "}
                                                        </a>
                                                        {/*end-item*/}
                                                        {/* item*/}{" "}
                                                        <a href="#" className="dropdown-item py-3">
                                                            <small className="float-right text-muted pl-2">
                                                                1 hr ago
                                                            </small>
                                                            <div className="media">
                                                                <div className="avatar-md bg-soft-primary">
                                                                    <img
                                                                        src="assets/images/users/profile.png"
                                                                        alt=""
                                                                        className="thumb-sm rounded-circle"
                                                                    />
                                                                </div>
                                                                <div className="media-body align-self-center ml-2 text-truncate">
                                                                    <h6 className="my-0 font-weight-normal text-dark">
                                                                        Your order is placed
                                                                    </h6>
                                                                    <small className="text-muted mb-0">
                                                                        It is a long established fact that a reader.
                                                                    </small>
                                                                </div>
                                                                {/*end media-body*/}
                                                            </div>
                                                            {/*end media*/}{" "}
                                                        </a>
                                                        {/*end-item*/}
                                                        {/* item*/}{" "}
                                                        <a href="#" className="dropdown-item py-3">
                                                            <small className="float-right text-muted pl-2">
                                                                2 hrs ago
                                                            </small>
                                                            <div className="media">
                                                                <div className="avatar-md bg-soft-primary">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width={24}
                                                                        height={24}
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeWidth={2}
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        className="feather feather-check-circle align-self-center icon-xs"
                                                                    >
                                                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                        <polyline points="22 4 12 14.01 9 11.01" />
                                                                    </svg>
                                                                </div>
                                                                <div className="media-body align-self-center ml-2 text-truncate">
                                                                    <h6 className="my-0 font-weight-normal text-dark">
                                                                        Payment Successfull
                                                                    </h6>
                                                                    <small className="text-muted mb-0">
                                                                        Dummy text of the printing.
                                                                    </small>
                                                                </div>
                                                                {/*end media-body*/}
                                                            </div>
                                                            {/*end media*/}{" "}
                                                        </a>
                                                        {/*end-item*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="simplebar-placeholder"
                                            style={{ width: 0, height: 0 }}
                                        />
                                    </div>
                                    <div
                                        className="simplebar-track simplebar-horizontal"
                                        style={{ visibility: "hidden" }}
                                    >
                                        <div
                                            className="simplebar-scrollbar"
                                            style={{ width: 0, display: "none" }}
                                        />
                                    </div>
                                    <div
                                        className="simplebar-track simplebar-vertical"
                                        style={{ visibility: "hidden" }}
                                    >
                                        <div
                                            className="simplebar-scrollbar"
                                            style={{ height: 0, display: "none" }}
                                        />
                                    </div>
                                </div>
                                {/* All*/}{" "}
                                <a
                                    href="#"
                                    className="dropdown-item text-center text-primary"
                                >
                                    View all <i className="fi-arrow-right" />
                                </a>
                            </div>
                        </li>
                        <li className="dropdown">
                            <a
                                className="nav-link dropdown-toggle waves-effect waves-light nav-user"
                                data-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-haspopup="false"
                                aria-expanded="false"
                            >
                                {/* <span className="ml-1 nav-user-name hidden-sm">Nick</span>{" "} */}
                                <img
                                    src="assets/images/users/profile.png"
                                    alt="profile-user"
                                    className="rounded-circle"
                                />
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-user align-self-center icon-xs icon-dual mr-1"
                                    >
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx={12} cy={7} r={4} />
                                    </svg>{" "}
                                    Profile
                                </a>{" "}
                                <a className="dropdown-item" href="#">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-settings align-self-center icon-xs icon-dual mr-1"
                                    >
                                        <circle cx={12} cy={12} r={3} />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>{" "}
                                    Settings
                                </a>
                                <div className="dropdown-divider mb-0" />
                                <a className="dropdown-item" href="#" onClick={(e) => LogoutUser(e)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="feather feather-power align-self-center icon-xs icon-dual mr-1"
                                    >
                                        <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                                        <line x1={12} y1={2} x2={12} y2={12} />
                                    </svg>{" "}
                                    Logout
                                </a>
                            </div>
                        </li>
                    </ul>
                    {/*end topbar-nav*/}
                    <ul className="list-unstyled topbar-nav mb-0">
                        <li>
                  <p className="mb-0 page-subtitle">11:00 AM</p>
                  <h2 className='header-page-title mt-1 mb-0'>23 May 2024</h2>

                </li>
                        <li>
                            <button className='nav-link button-menu-mobile' onClick={toggleMenu}>
                            {isMenuEnlarged ? ' ' : ' '} 
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="feather feather-menu align-self-center topbar-icon"
                                >
                                    <line x1={3} y1={12} x2={21} y2={12} />
                                    <line x1={3} y1={6} x2={21} y2={6} />
                                    <line x1={3} y1={18} x2={21} y2={18} />
                                </svg>
                            </button>
                        </li>
                      
                    </ul>
                </nav>
                {/* end navbar*/}
            </div>


        </div>
    )
}

export default Header
