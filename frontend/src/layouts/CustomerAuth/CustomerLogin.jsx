import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  SignIn,
  LoginAuthToken,
} from "../../ReduxStore/Slice/Auth/authSlice";
import { SIGN_IN_CUSTOMER, UPDATE_CUSTOMER_PASSWORD } from "../../Services/CustomerUser/customerUserService";
import { useDispatch } from "react-redux";
import { azureLogin } from "../AuthWithAzure/AuthProvider";
import { Email_regex, Mobile_regex } from "../../Utils/Common_regex";
import { base_url } from "../../Utils/Config";
import {
  PASSWORD_ERROR,
  INVALID_EMAIL_ERROR,
  EMPTY_EMAIL_ERROR,
} from "../../Utils/Common_Message";
import { RoleAccess } from "../../ReduxStore/Slice/Access/AccessSlice";
import sweatalert from "sweetalert2";
import { ArrowRight, Eye, EyeOff, LogIn } from "lucide-react";

const CustomerLogin = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const [isFlipped, setIsFlipped] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [customerUserId, setCustomerUserId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let isExpirytoken = location?.state?.isExpirytoken;




  const handleSubmitLogin = async () => {
    if (Email == "") {
      setErrorEmail(EMPTY_EMAIL_ERROR);
      return;
    } else if (!Email_regex(Email)) {
      setErrorEmail(INVALID_EMAIL_ERROR);
      return;
    } else {
      setErrorEmail("");
    }

    if (password == "") {
      setErrorPassword(PASSWORD_ERROR);
      return;
    }

    const req = { email: Email, password: password, isExpirytoken: isExpirytoken };
    const response = await SIGN_IN_CUSTOMER(req);

    if (response.status) {
      if (response.step === "CHANGE_PASSWORD") {
        setCustomerUserId(response.customer_user_id);
        setIsFlipped(true);
      } else {
        // Normal Login Success
        localStorage.setItem("staffDetails", JSON.stringify(response.customer));
        localStorage.setItem("token", JSON.stringify(response.token)); // Wait, backend returned Success but no token?
        localStorage.setItem("role", JSON.stringify("CUSTOMER"));
        
        // I should check if backend returns token. In customerAuthController.js it returns customer but token is in cookie.
        // But frontend expects token in localStorage for many things.
        
        sweatalert.fire({
          title: "Login Successfully",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        
        navigate("/customer/dashboard");
      }
    } else {
      sweatalert.fire({
        title: response.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      })
      return
    }

    // await dispatch(SignIn(req))
    //   .unwrap()
    //   .then(async (response) => {
    //     if (response.status) {
    //       await accessDataFetch(response.data.staffDetails, response.data.token);
    //       localStorage.setItem(
    //         "staffDetails",
    //         JSON.stringify(response.data.staffDetails)
    //       );
    //       localStorage.setItem("token", JSON.stringify(response.data.token));
    //       localStorage.setItem("sharepoint_token", JSON.stringify(response.data.sharepoint_token));
    //       localStorage.setItem(
    //         "role",
    //         JSON.stringify(response.data.staffDetails.role)
    //       );

    //       // sweet alert
    //       sweatalert.fire({
    //         title: "Login Successfully",
    //         icon: "success",
    //         timer: 1000,
    //         showConfirmButton: false,
    //         timerProgressBar: true,
    //       });


    //       const req_auth_token = {
    //         id: response.data.staffDetails.id,
    //         login_auth_token: response.data.token,
    //       };
    //       await dispatch(LoginAuthToken(req_auth_token))
    //         .unwrap()
    //         .then(async (response) => { })
    //         .catch((error) => {
    //           return;
    //         });
    //       setTimeout(() => {
    //         navigate("/admin/dashboard");
    //         window.location.reload();
    //       }, 1000);

    //     } else {
    //       localStorage.removeItem("staffDetails");
    //       localStorage.removeItem("token");
    //       localStorage.removeItem("role");
    //       localStorage.removeItem("accessData");
    //       localStorage.removeItem("updatedShowTab");
    //       sessionStorage.clear();
    //       sweatalert.fire({
    //         title: response.message,
    //         icon: "error",
    //         timer: 1000,
    //         showConfirmButton: true,
    //         timerProgressBar: true,
    //       });
    //     }
    //     //continue....
    //   })
    //   .catch((error) => {
    //     return;
    //   });
  };


  const accessDataFetch = async (data, token) => {
    try {
      const response = await dispatch(
        RoleAccess({
          req: { role_id: data.role_id, StaffUserId: data.id, action: "get" },
          authToken: token,
        })
      ).unwrap();

      if (response.data) {

        localStorage.setItem("accessData", JSON.stringify(response.data));

        response.data.forEach((item) => {
          const updatedShowTab = {
            setting: false,
            customer: false,
            staff: false,
            status: false,
            report: false,
            timesheet: false,
            job: false,
            client: false,
            all_customers: false,
            all_clients: false,
            all_jobs: false,

          };

          response.data.forEach((item) => {
            if (item.permission_name === "setting") {
              const settingView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.setting =
                settingView && settingView.is_assigned === 1;
            } else if (item.permission_name === "customer") {
              const customerView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.customer =
                customerView && customerView.is_assigned === 1;
            } else if (item.permission_name === "staff") {
              const staffView = item.items.find((item) => item.type === "view");
              updatedShowTab.staff = staffView && staffView.is_assigned === 1;
            } else if (item.permission_name === "status") {
              const statusView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.status =
                statusView && statusView.is_assigned === 1;
            } else if (item.permission_name === "timesheet") {
              const timesheetView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.timesheet =
                timesheetView && timesheetView.is_assigned === 1;
            }
            else if (item.permission_name === "job") {
              const jobView = item.items.find((item) => item.type === "view");
              updatedShowTab.job = jobView && jobView.is_assigned === 1;
            } else if (item.permission_name === "client") {
              const clientView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.client =
                clientView && clientView.is_assigned === 1;
            }
            else if (item.permission_name === "report") {
              const reportView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.report =
                reportView && reportView.is_assigned === 1;
            }

            else if (item.permission_name === "all_customers") {
              const allCustomerView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.all_customers =
                allCustomerView && allCustomerView.is_assigned === 1;
            }
            else if (item.permission_name === "all_clients") {
              const allClientView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.all_clients =
                allClientView && allClientView.is_assigned === 1;
            }
            else if (item.permission_name === "all_jobs") {
              const allJobsView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.all_jobs =
                allJobsView && allJobsView.is_assigned === 1;
            }
          });

          localStorage.setItem("updatedShowTab", JSON.stringify(updatedShowTab));
        });
      }
    } catch (error) {
      return;
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitLogin();
    }
  }

  const handleKeyPress1 = (e) => {
    if (e.key === 'Enter') {
      handleUpdatePassword();
    }
  }

  const handleUpdatePassword = async (e) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setErrorNewPassword(
        "Password must contain 1 uppercase, 1 lowercase, 1 number and 1 special character"
      );
      return;
    }
    if (!confirmPassword) {
      setErrorConfirmPassword("Please confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match");
      return;
    }

    const req = { customer_user_id: customerUserId, newPassword: newPassword };
    const response = await UPDATE_CUSTOMER_PASSWORD(req);

    if (response.status) {
      localStorage.setItem("staffDetails", JSON.stringify(response.customer));
      localStorage.setItem("token", JSON.stringify(response.token));
      localStorage.setItem("role", JSON.stringify("CUSTOMER"));

      sweatalert.fire({
        title: "Password updated successfully",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      navigate("/customer/dashboard");
    } else {
      sweatalert.fire({
        title: response.message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="account-body accountbg" style={{ textTransform: "none" }}>
      <div className="container">
        <div className="row  d-flex justify-content-center vh-100">

          {/*  Login  with Email and Password*/}
          <div className="col-10 col-md-12 col-lg-9 align-self-center form-container">
            <div className="row ">
              <div className="col-md-6 ps-0">
                <div className="card-body p-0 auth-header-box h-100 d-flex align-items-center justify-content-center">
                  <div className="text-center p-3">
                    <a className="logo logo-admin" href="/">
                      <img
                        src="assets/images/logo.png"
                        alt="logo"
                        style={{ height: "55px" }}
                        className="auth-logo"
                      />
                    </a>
                    <h4 className="mt-3 mb-1 font-weight-semibold text-white font-18">
                      Let's Get Started Outbooks
                    </h4>
                  </div>
                </div>
              </div>


              {
                !isFlipped ?
                  <div className="col-md-6">
                    <div className="py-5 px-3">
                      <div className="card-header text-center">
                        <h1 className="">Customer Login</h1>
                      </div>
                      <div className="card-body">
                        <div
                          className="form-horizontal auth-form my-4"
                          action="https://mannatthemes.com/dastyle/default/index.html"
                        >
                          <div className="form-group mb-2">


                            <div className="input-group ">
                              <input
                                type="email"
                                className={errorEmail ? "error-field form-control" : "form-control"}
                                name="username"
                                id="username"
                                placeholder="Enter Email Id"
                                onChange={(e) => setEmail(e.target.value)}
                                value={Email}
                                onKeyPress={handleKeyPress}
                              />
                            </div>
                            {errorEmail ? (
                              <span className="error-text">{errorEmail}</span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="form-group">

                            <div className="position-relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                className={errorPassword ? "error-field form-control" : "form-control"}
                                name="password"
                                id="userpassword"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ paddingRight: "40px" }}
                              />
                              <span
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                  position: "absolute",
                                  right: "15px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  zIndex: 10,
                                  color: "#6c757d",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                            {password == "" ? (
                              <span className="error-text"> {errorPassword}</span>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="form-group row my-2 text-center">
                            <div className="col-sm-12 ">

                            </div>

                          </div>
                          <div className="form-group mb-0 row text-center">
                            <div className="col-12 mt-2">
                              <button
                                className="w-100 btn btn-info fw-normal text-white "
                                type="button"
                                onClick={() => handleSubmitLogin()}
                                onKeyPress={handleKeyPress}
                              >
                                Sign In <ArrowRight size={16} className="ms-1" />
                              </button>
                            </div>
                            {/* <div className="col-12 mt-3">
                              <button
                                className="w-100 btn btn-outline-info fw-normal"
                                type="button"
                                onClick={() => navigate("/login")}
                              >
                                Login as Staff <LogIn size={18} className="ms-1 mt-1" />
                              </button>
                            </div> */}
                          </div>
                        </div>


                      </div>
                    </div>
                  </div>
                  :

                  <div className={`col-md-6`}>
                    <div className="py-5 px-3">
                      <div className="card-header text-center">
                        <h4>Set Your New Password</h4>
                        <p className="text-muted">For security reasons, please create a new password before continuing.</p>
                      </div>
                      <div className="card-body">
                        <div
                          className="form-horizontal auth-form my-4"
                          action="https://mannatthemes.com/dastyle/default/index.html"
                        >
                          <div className="form-group mb-2">


                            <div className="position-relative">
                              <input
                                type={showNewPassword ? "text" : "password"}
                                name="new_password"
                                id="new_password"
                                placeholder="New Password"
                                onChange={(e) => {
                                  setNewPassword(e.target.value);
                                  setErrorNewPassword("");
                                }}
                                value={newPassword}
                                onKeyPress={handleKeyPress1}
                                className={errorNewPassword ? "error-field form-control" : "form-control"}
                                style={{ paddingRight: "40px" }}
                              />
                              <span
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{
                                  position: "absolute",
                                  right: "15px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  zIndex: 10,
                                  color: "#6c757d",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                            {errorNewPassword && (
                              <span className="error-text">{errorNewPassword}</span>
                            )}
                          </div>
                          <div className="form-group">

                            <div className="position-relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                id="confirm_password"
                                placeholder="Confirm Password"
                                onChange={(e) => {
                                  setConfirmPassword(e.target.value);
                                  setErrorConfirmPassword("");
                                }}
                                value={confirmPassword}
                                onKeyPress={handleKeyPress1}
                                className={errorConfirmPassword ? "error-field form-control" : "form-control"}
                                style={{ paddingRight: "40px" }}
                              />
                              <span
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{
                                  position: "absolute",
                                  right: "15px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                  zIndex: 10,
                                  color: "#6c757d",
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </span>
                            </div>
                            {errorConfirmPassword && (
                              <span className="error-text">{errorConfirmPassword}</span>
                            )}
                          </div>
                          <div className="form-group row my-2 text-center">
                            <div className="col-sm-12 ">

                            </div>

                          </div>
                          <div className="form-group mb-0 row text-center">
                            <div className="col-12 mt-2">
                              <button
                                className="w-100 btn btn-info fw-normal text-white "
                                type="button"
                                onClick={() => handleUpdatePassword()}
                                onKeyPress={handleKeyPress1}
                              >
                                Update Password <ArrowRight size={16} className="ms-1" />
                              </button>
                            </div>

                          </div>
                        </div>


                      </div>
                    </div>
                  </div>

              }




            </div>

          </div>



        </div>
      </div>
      {/* <div className="container" id="container">
    <div className="form-container sign-up">
      <form>
        <h1>Create Account</h1>
        <div className="social-icons">
          <a href="#" className="icons"><i className="fa-brands fa-google-plus-g" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-facebook-f" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-github" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-linkedin-in" /></a>
        </div>
        <span>or use your email to registration</span>
        <input type="text" placeholder="Name" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Sign Up</button>
      </form>
    </div>
    <div className="form-container sign-in">
      <form>
        <h1>Sign In</h1>
        <div className="social-icons">
          <a href="#" className="icons"><i className="fa-brands fa-google-plus-g" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-facebook-f" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-github" /></a>
          <a href="#" className="icons"><i className="fa-brands fa-linkedin-in" /></a>
        </div>
        <span>or use your email/password</span>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <a href="#">Forget your Password?</a>
        <button className='btn btn-info text-white fw-normal'>Sign In</button>
      </form>
    </div>
    <div className="toggle-container">
      <div className="toggle row align-items-center mx-auto">
        <div className="toggle-panel col-md-6">
          <h1>Welcome Back!</h1>
          <p>Enter your Personal details to use all_of site features</p>
          <button className="hidden" id="login">Sign In</button>
        </div>
        <div className="toggle-panel  col-md-6">
        <img src="assets/images/outbooks-logo-wide.svg" alt="logo" className="auth-logo" />
          <p>Let's Get Started
          Outbooks</p>
          
        </div>
      </div>
    </div>
  </div> */}

    </div>
  );
};

export default CustomerLogin;
