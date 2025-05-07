import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isLoginAuthCheckToken ,isLogOut} from "../../ReduxStore/Slice/Auth/authSlice";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const token = JSON.parse(localStorage.getItem("token"));
  const [isMenuEnlarged, setIsMenuEnlarged] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const toggleMenu = () => {
    setIsMenuEnlarged((prevState) => !prevState);
  };




  useEffect(() => {
    isLoginAuthCheck();
    ClearSession();
  }, []);

  useEffect(() => {

    if (isMenuEnlarged) {
      document.body.classList.add("enlarge-menu");
    } else {
      document.body.classList.remove("enlarge-menu");
    }

    return () => {
      document.body.classList.remove("enlarge-menu");
    };
  }, [isMenuEnlarged]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const isLoginAuthCheck = async (e) => {
    const req = { id: staffDetails.id, login_auth_token: token };
    await dispatch(isLoginAuthCheckToken(req))
      .unwrap()
      .then(async (response) => {
        if (response.status == false) {
          LogoutUser();
        }
      })
      .catch((error) => {
        return;
      });
  };

  const LogoutUser = async (e) => {
    localStorage.removeItem("staffDetails");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("currentStep");
    localStorage.removeItem("coustomerId");
    localStorage.removeItem("sharepoint_token");
    localStorage.removeItem("accessData");
    localStorage.removeItem("updatedShowTab");
    sessionStorage.clear();
    
    const req = { id: staffDetails.id};
    await dispatch(isLogOut(req))
      .unwrap()
      .then(async (response) => {
        navigate("/login");
      })
      .catch((error) => {
        navigate("/login");
      });

    navigate("/login");
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const ClearSession = async () => {
    var decoded = jwtDecode(token);


    if (decoded.exp * 1000 < new Date().getTime()) {
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_details");
      localStorage.clear();
      window.location.reload();
      // setTimeout(() => {
      //   navigate("/");
      // }, 1000);
    }
  };


  const clearSession = () => { 
    var decoded = jwtDecode(token); 
    if (decoded.exp * 1000 < new Date().getTime()) {

        localStorage.clear(); 
        window.location.reload();
    }
};

  return (
    <div>
      <div className="topbar">
        {/* Navbar */}

        <nav className="navbar-custom">
          <ul className="list-unstyled topbar-nav float-right mb-0">
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
                <Link className="dropdown-item" to={"/admin/profile"}>
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
                </Link>{" "}
                
                <div className="dropdown-divider mb-0" />
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => LogoutUser(e)}
                >
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
              <button
                className="nav-link button-menu-mobile"
                onClick={toggleMenu}
              >
                {isMenuEnlarged ? " " : " "}
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
            {/* <li>
              <p className="mb-0 page-subtitle">{formatTime(currentTime)}</p>
              <h2 className="header-page-title mt-1 mb-0">
                {formatDate(currentTime)}
              </h2>
            </li> */}
          </ul>
        </nav>
        {/* end navbar*/}
      </div>
    </div>
  );
};

export default Header;
