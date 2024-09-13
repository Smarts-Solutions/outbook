import React from 'react'

const ForgetPassword = () => {
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
                      className="auth-logo"
                      style={{ height: 55 }}
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
                  <h1 className="">Forgot Password </h1>
                  <p>Enter your Email and instructions will be sent to you!</p>
                </div>
                <div className="card-body">
                  <div
                    className="form-horizontal auth-form my-4"
                    action=""
                  >
                    <div className="form-group mb-2">
                      <div className="input-group ">
                        <input
                          type="email"
                          className="form-control"
                          name="username"
                          id="username"
                          placeholder="Enter Email Id"
                          defaultValue=""
                        />
                      </div>
                    </div>
                    {/* <div className="form-group">
                      <div className="input-group ">
                        <input
                          type="password"
                          className="form-control"
                          name="password"
                          id="userpassword"
                          placeholder="Enter password"
                        />
                      </div>
                    </div> */}
                    <div className="form-group row my-2 text-center">
                      <div className="col-sm-12 ">
                        <a className="text-muted font-13 forget-btn" href="">
                          <i className="ti-lock pe-1" />
                          Back to Login
                        </a>
                      </div>
                    </div>
                    <div className="form-group mb-0 row text-center">
                      <div className="col-12 mt-2">
                        <button
                          className="w-100 btn btn-info fw-normal text-white "
                          type="button"
                        >
                          Continue <i className="fas fa-sign-in-alt ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                 
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  )
}

export default ForgetPassword