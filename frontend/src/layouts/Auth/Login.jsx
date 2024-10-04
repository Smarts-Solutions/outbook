import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SignIn,
  LoginAuthToken,
  SignInWithAzure,
} from "../../ReduxStore/Slice/Auth/authSlice";
import { useDispatch } from "react-redux";
import { azureLogin } from "../AuthWithAzure/AuthProvider";
import { Email_regex, Mobile_regex } from "../../Utils/Common_regex";
import {
  PASSWORD_ERROR,
  INVALID_EMAIL_ERROR,
  EMPTY_EMAIL_ERROR,
} from "../../Utils/Common_Message";
import { RoleAccess } from "../../ReduxStore/Slice/Access/AccessSlice";
import sweatalert from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const handleSubmitLogin = async () => {
    if (Email == "") {
      setErrorEmail(EMPTY_EMAIL_ERROR);
      return;
    } else if (!Email_regex(Email)) {
      setErrorEmail(INVALID_EMAIL_ERROR);
      return;
    }

    if (password == "") {
      setErrorPassword(PASSWORD_ERROR);
      return;
    }

    const req = { email: Email, password: password };

    await dispatch(SignIn(req))
      .unwrap()
      .then(async (response) => {
        if (response.status) {
          accessDataFetch(response.data.staffDetails, response.data.token);
          localStorage.setItem(
            "staffDetails",
            JSON.stringify(response.data.staffDetails)
          );
          localStorage.setItem("token", JSON.stringify(response.data.token));
          localStorage.setItem(
            "role",
            JSON.stringify(response.data.staffDetails.role)
          );

          // sweet alert
          sweatalert.fire({
            title: "Login Successfully",
            icon: "success",
            timer: 1000,
            showConfirmButton: false,
            timerProgressBar: true,
          });


          const req_auth_token = {
            id: response.data.staffDetails.id,
            login_auth_token: response.data.token,
          };
          await dispatch(LoginAuthToken(req_auth_token))
            .unwrap()
            .then(async (response) => { })
            .catch((error) => {
              return;
            });
          setTimeout(() => {
            navigate("/admin/dashboard");
          }, 1000);

        } else {
          localStorage.removeItem("staffDetails");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          sessionStorage.clear();
          setErrorPassword(response.message);
        }
        //continue....
      })
      .catch((error) => {
        return;
      });
  };

  const handleAzureLogin = async () => {
    const accounts = await azureLogin();
    if (accounts.length > 0) {
      const req = { email: accounts[0].username };

      await dispatch(SignInWithAzure(req))
        .unwrap()
        .then(async (response) => {
          if (response.status) {
            localStorage.setItem(
              "staffDetails",
              JSON.stringify(response.data.staffDetails)
            );
            localStorage.setItem("token", JSON.stringify(response.data.token));
            localStorage.setItem(
              "role",
              JSON.stringify(response.data.staffDetails.role)
            );

            //Update Auth Token
            const req_auth_token = {
              id: response.data.staffDetails.id,
              login_auth_token: response.data.token,
            };
            await dispatch(LoginAuthToken(req_auth_token))
              .unwrap()
              .then(async (response) => { })
              .catch((error) => {
                return;
              });

            navigate("/admin/dashboard");
          } else {
            localStorage.removeItem("staffDetails");
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            sessionStorage.clear();
            setErrorPassword(response.message);
          }
        })
        .catch((error) => {
          return;
        });
    }
  };

  const accessDataFetch = async (data, token) => {
    try {
      console.log("data", data);
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
            timesheet: false
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
            }else if (item.permission_name === "timesheet") {
              const timesheetView = item.items.find(
                (item) => item.type === "view"
              );
              updatedShowTab.timesheet =
                timesheetView && timesheetView.is_assigned === 1;
            }
          });

          localStorage.setItem(
            "updatedShowTab",
            JSON.stringify(updatedShowTab)
          );
        });
      }
    } catch (error) {
      return;
    }
  };

  return (
    <div className="account-body accountbg">
      <div className="container">
        <div className="row  d-flex justify-content-center vh-100">
          <div className="col-8 col-md-9 align-self-center form-container">
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
              <div className="col-md-6">
                <div className="py-5 px-3">
                  <div className="card-header text-center">
                    <h1 className="">Sign In</h1>
                  </div>
                  <div className="card-body">
                    <div
                      className="form-horizontal auth-form my-4"
                      action="https://mannatthemes.com/dastyle/default/index.html"
                    >
                      <div className="form-group mb-2">
                        {/* <label htmlFor="username">Email</label> */}

                        <div className="input-group ">
                          <input
                            type="email"
                          
                            className={errorEmail ? "error-field form-control" : "form-control"}

                            name="username"
                            id="username"
                            placeholder="Enter Email Id"
                            onChange={(e) => setEmail(e.target.value)}
                            value={Email}
                          />
                        </div>
                        {errorEmail ? (
                          <span className="error-text">{errorEmail}</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group">
                        {/* <label htmlFor="userpassword">Password</label> */}
                        <div className="input-group ">
                          <input
                            type="password"
                            className={errorPassword ?  "error-field form-control" : "form-control"}

                            name="password"
                            id="userpassword"
                            placeholder="Enter password"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        {errorPassword ? (
                          <span className="error-text">{errorPassword}</span>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="form-group row my-2 text-center">
                        <div className="col-sm-12 ">
                          <a className="text-muted font-13 forget-btn" href="">
                            <i className="ti-lock pe-1" />
                            Forgot password?
                          </a>
                        </div>
                        {/*end col*/}
                      </div>
                      <div className="form-group mb-0 row text-center">
                        <div className="col-12 mt-2">
                          <button
                            className="w-100 btn btn-info fw-normal text-white "
                            type="button"
                            onClick={() => handleSubmitLogin()}
                          >
                            Sign In <i className="fas fa-sign-in-alt ml-1" />
                          </button>
                        </div>
                        {/*end col*/}
                      </div>
                    </div>
                    {/*end form*/}

                    <div className="account-social">
                      <h6 className="my-4">OR </h6>
                    </div>

                    <button
                      type="button"
                      className="btn d-block mx-auto btn-outline-info login-microsoft"
                      onClick={() => handleAzureLogin()}
                    >
                      <img
                        src="/assets/images/brand-logo/Microsoft_365.webp"
                        className="me-2"
                      ></img>{" "}
                      Login with Microsoft
                    </button>
                  </div>
                </div>
              </div>
              {/*end col*/}
            </div>
            {/*end row*/}
          </div>
          {/*end col*/}
        </div>
        {/*end row*/}
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
          <p>Enter your Personal details to use all of site features</p>
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

export default Login;
