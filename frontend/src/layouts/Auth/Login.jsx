import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { SignIn } from '../../ReduxStore/Slice/Auth/authSlice'
import { useDispatch } from "react-redux";


import { Email_regex, Mobile_regex } from '../../Utils/Common_regex'
import { PASSWORD_ERROR, INVALID_EMAIL_ERROR, EMPTY_EMAIL_ERROR } from '../../Utils/Common_Message'

const Login = () => {
  const navigate= useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')




  const handleSubmitLogin = async () => {


  
    if (Email == '') {
      setErrorEmail(EMPTY_EMAIL_ERROR)
      return
    }
    else if (!Email_regex(Email)) {
      console.log(Email)
      setErrorEmail(INVALID_EMAIL_ERROR)
      return
    }

    if (password == '') {
      setErrorPassword(PASSWORD_ERROR)
      return
    }

    const req = { email: Email, password: password }


    
    
    await dispatch(SignIn(req))
    .unwrap()
    .then(async (response) => {
     // console.log("response", response.data.staffDetails);
      //console.log("token", response.data.token);
        
        if(response.status){
          localStorage.setItem("staffDetails", JSON.stringify(response.data.staffDetails));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          localStorage.setItem("role", JSON.stringify(response.data.staffDetails.role));
          navigate('/admin/dashboard');
        }else{
          setErrorPassword(response.msg)
        }
      //continue....
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }










  return (
   <div className="account-body accountbg">

<div className="container">
        <div className="row  d-flex justify-content-center vh-100">
          <div className="col-8 align-self-center form-container">
            <div className="row ">

              <div className='col-md-6 ps-0'>
              <div className="card-body p-0 auth-header-box h-100 d-flex align-items-center justify-content-center">
                    <div className="text-center p-3"><a className="logo logo-admin" href="/"><img src="assets/images/logo.png" alt="logo" style={{height:'55px'}} className="auth-logo" /></a>
                      <h4 className="mt-3 mb-1 font-weight-semibold text-white font-18">Let's Get Started
                        Outbooks</h4>
                    </div>
                  </div>
              </div>
              <div className='col-md-6'>
                <div className='py-5 px-3'>
                <div className='card-header text-center'>
                  <h1 className=''>Sign In</h1>

                </div>
              <div className="card-body">
                    <div className="form-horizontal auth-form my-4" action="https://mannatthemes.com/dastyle/default/index.html">
                      <div className="form-group mb-2">
                        {/* <label htmlFor="username">Email</label> */}
                        
                        <div className="input-group mb-2"><input type="email" className="form-control" name="username" id="username" placeholder="Enter Email Id"
                          onChange={(e) => setEmail(e.target.value)} value={Email} />
                        </div>
                        {errorEmail ?
                       <span style={{color:'red'}}>{errorEmail}</span> : ""
                        }



                      </div>
                      <div className="form-group">
                        {/* <label htmlFor="userpassword">Password</label> */}
                        <div className="input-group mb-2"><input type="password" className="form-control" name="password" id="userpassword" placeholder="Enter password"
                          onChange={(e) => setPassword(e.target.value)} /></div>
                        {errorPassword ?
                          <span style={{color:'red'}}>{errorPassword}</span> : ""
                        }
                      </div>
                      <div className="form-group row my-2 text-center">
                       
                        <div className="col-sm-12 "><a className="text-muted font-13 text-decoration-none" href=""><i className="ti-lock pe-1" />
                          Forgot password?</a></div>{/*end col*/}
                      </div>
                      <div className="form-group mb-0 row text-center">
                        <div className="col-12 mt-2"><button className="w-100 btn btn-info fw-normal text-white " type="button" onClick={() => handleSubmitLogin()}>Sign In <i className="fas fa-sign-in-alt ml-1" /></button></div>
                        {/*end col*/}
                      </div>
                    </div>{/*end form*/}

                    <div className="account-social">
                      <h6 className="my-4">OR </h6>
                    </div>

                    <button type="button" className="btn d-block mx-auto btn-outline-info login-microsoft">
                      <img src="/assets/images/brand-logo/Microsoft_365.webp" className='me-2' ></img> Login with Microsoft</button></div>
              </div>
             
            </div>{/*end col*/}
          </div>{/*end row*/}
        </div>{/*end col*/}
      </div>{/*end row*/}
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

  )
}

export default Login