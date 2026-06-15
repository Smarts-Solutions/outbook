import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { isLoginAuthCheckToken, isLogOut, signOutCustomer } from "../../ReduxStore/Slice/Auth/authSlice";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Select from "react-select";
import { useCustomerAccess } from "../../Utils/CustomerAccessContext";
import { UPDATE_ROLE } from "../../Services/Auth/authService";


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const other_role_id = JSON.parse(localStorage.getItem("other_role_id"));
  const token = JSON.parse(localStorage.getItem("token"));
  const [isMenuEnlarged, setIsMenuEnlarged] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const toggleMenu = () => {
    setIsMenuEnlarged((prevState) => !prevState);
  };


  const role = JSON.parse(localStorage.getItem("role"));
  const { assignedCustomers, selectedCustomer, setSelectedCustomer } = useCustomerAccess();




  const handleRoleSwitch = async (e) => {
    const req = { current_role_id: Number(staffDetails.role_id), update_role_id: Number(e.target.value), staff_id: staffDetails.id, email: staffDetails.email };
    const response = await UPDATE_ROLE({ req, authToken: token });
    
    if(response.status){
     localStorage.setItem("staffDetails",JSON.stringify(response.data.staffDetails));
     localStorage.setItem("role",JSON.stringify(response.data.staffDetails.role));
     localStorage.setItem("other_role_id", JSON.stringify(response.data.other_role_id));
     window.location.reload();
    }
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
    localStorage.removeItem("other_role_id");
    sessionStorage.clear();

    const req = { id: staffDetails.id };
    if (role?.toString().toUpperCase() === "CUSTOMER") {
      await dispatch(signOutCustomer(token))
        .unwrap()
        .then(async (response) => {
          navigate("/customer-login");
        })
        .catch((error) => {
          navigate("/customer-login");
        });
    } else {
      await dispatch(isLogOut(req))
        .unwrap()
        .then(async (response) => {
          navigate("/login");
        })
        .catch((error) => {
          navigate("/login");
        });
    }

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
                <Link
                  className="dropdown-item"
                  to={role?.toString().toUpperCase() === "CUSTOMER" ? "/customer/profile" : "/admin/profile"}
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

            <div className="header-select d-flex">
              <select
                className="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                onChange={(e) => { handleRoleSwitch(e) }}
                value={staffDetails.role_id}
              >
                <option value={staffDetails.role_id}>{staffDetails.role_name}</option>
                <option value={other_role_id.other_role_id}>{other_role_id.role_name}</option>
              </select>

            </div>


            {role?.toString().toUpperCase() === "CUSTOMER" && (
              // <li className="hide-phone app-search">
              //   <div className="d-flex align-items-center">
              //     {/* <label className="mb-0 mr-2 text-dark font-weight-semibold">Customer</label> */}
              //     <div style={{ width: "250px" }}>
              //       <Select
              //         options={assignedCustomers}
              //         value={selectedCustomer}
              //         onChange={(selectedOption) => setSelectedCustomer(selectedOption)}
              //         placeholder="Select Customer"
              //         isSearchable={true}
              //         className="basic-single"
              //         classNamePrefix="select"
              //         styles={{
              //           control: (base, state) => ({
              //             ...base,
              //             borderRadius: "30px",
              //             height: "42px",
              //             minHeight: "42px",
              //             border: state.isFocused ? "1.5px solid #007bff" : "1px solid #e0e6ed",
              //             boxShadow: state.isFocused ? "0 0 0 4px rgba(0, 123, 255, 0.1)" : "none",
              //             backgroundColor: "#fff",
              //             paddingLeft: "8px",
              //             fontSize: "14px",
              //             fontWeight: "500",
              //             transition: "all 0.2s ease",
              //             "&:hover": {
              //               border: "1.5px solid #007bff",
              //             },
              //           }),
              //           valueContainer: (base) => ({
              //             ...base,
              //             padding: "0 12px",
              //           }),
              //           menu: (base) => ({
              //             ...base,
              //             borderRadius: "12px",
              //             marginTop: "8px",
              //             boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              //             border: "1px solid #f1f4f8",
              //             overflow: "hidden",
              //             zIndex: 9999,
              //           }),
              //           option: (base, { isFocused, isSelected }) => ({
              //             ...base,
              //             backgroundColor: isSelected ? "#007bff" : isFocused ? "#f8faff" : "#fff",
              //             color: isSelected ? "#fff" : "#495057",
              //             padding: "10px 15px",
              //             fontSize: "14px",
              //             cursor: "pointer",
              //             "&:active": {
              //               backgroundColor: "#007bff",
              //               color: "#fff",
              //             },
              //           }),
              //           placeholder: (base) => ({
              //             ...base,
              //             color: "#adb5bd",
              //           }),
              //           singleValue: (base) => ({
              //             ...base,
              //             color: "#2c3e50",
              //           }),
              //         }}
              //       />
              //     </div>
              //   </div>
              // </li>
              // @dropdown
              <li className="hide-phone app-search">
                <div className="d-flex align-items-center">
                  <div style={{ width: "260px" }}>
                    <Select
                      options={assignedCustomers}
                      value={selectedCustomer}
                      onChange={(selectedOption) => setSelectedCustomer(selectedOption)}
                      placeholder="🔍 Search Customer..."
                      isSearchable={true}
                      className="basic-single"
                      classNamePrefix="select"
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "12px",
                          height: "45px",
                          minHeight: "45px",
                          border: state.isFocused
                            ? "1.5px solid #4f46e5"
                            : "1px solid #4f46e5",
                          boxShadow: state.isFocused
                            ? "0 0 0 3px rgba(79, 70, 229, 0.15)"
                            : "0 4px 12px rgba(0,0,0,0.05)",
                          background: "linear-gradient(135deg, #ffffff, #f9fafb)",
                          paddingLeft: "6px",
                          fontSize: "14px",
                          fontWeight: "500",
                          transition: "all 0.25s ease",
                          cursor: "pointer",
                          "&:hover": {
                            border: "1.5px solid #6366f1",
                          },
                        }),

                        valueContainer: (base) => ({
                          ...base,
                          padding: "0 14px",
                        }),

                        menu: (base) => ({
                          ...base,
                          borderRadius: "14px",
                          marginTop: "10px",
                          boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
                          border: "1px solid #eef2f7",
                          overflow: "hidden",
                          zIndex: 9999,
                          backdropFilter: "blur(10px)",
                        }),

                        // 🔥 THIS PART ADDED
                        menuList: (base) => ({
                          ...base,
                          maxHeight: "220px",
                          overflowY: "auto",
                          overflowX: "hidden",
                        }),

                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          background: isSelected
                            ? "linear-gradient(135deg, #4f46e5, #6366f1)"
                            : isFocused
                              ? "#eef2ff"
                              : "#fff",
                          color: isSelected ? "#fff" : "#374151",
                          padding: "12px 16px",
                          fontSize: "14px",
                          borderRadius: "8px",
                          margin: "4px 8px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }),

                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af",
                          fontWeight: "400",
                        }),

                        singleValue: (base) => ({
                          ...base,
                          color: "#111827",
                          fontWeight: "600",
                        }),

                        dropdownIndicator: (base, state) => ({
                          ...base,
                          color: state.isFocused ? "#4f46e5" : "#9ca3af",
                          transition: "all 0.3s ease",
                          transform: state.selectProps.menuIsOpen
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }),

                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                      }}
                    />
                  </div>
                </div>
              </li>
              // @dropdown
            )}
          </ul>
        </nav>
        {/* end navbar*/}
      </div>
    </div>
  );
};

export default Header;
