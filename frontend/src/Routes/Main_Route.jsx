import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "../layouts/Auth/Login";
import Login1 from "../layouts/Auth/Login1";
import { jwtDecode } from "jwt-decode";

import Admin_Route from "./Admin_Route";
import ForgetPassword from "../layouts/Auth/ForgetPassword";


// Coutomer Auth
import CustomerLogin from "../layouts/CustomerAuth/CustomerLogin";
import Customer_Route from "./Coustomer_Route";


const Main_Route = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // if (role == null || token == null || staffDetails == null) {
    //   navigate("/login");
    //   return;
    // }
    if (location.pathname.startsWith("/customer/login")) {
      const params = new URLSearchParams(location.search);
      const isExpirytoken = params.get("token");
      navigate("/customer/login", { state: { isExpirytoken: isExpirytoken } });
      return;
    }

    if (role == null || token == null || staffDetails == null) {
      if (location.pathname !== "/login1") {
        navigate("/login");
      }
      return;
    }


    if (location.pathname.startsWith("/updatepassword")) {
      navigate(location.pathname);
      return;
    }

    if (location.pathname === "/") {
      navigate("/login");
      return;
    }

    if (location.pathname === "/forget") {
      navigate("/forget");
      return;
    }
    switch (role) {
      case "ADMIN":
        if (
          location.pathname === "/login" ||
          location.pathname === "/" ||
          !location.pathname.startsWith("/admin")
        ) {
          navigate("/admin/dashboard");
          window.location.reload();
        }
        break;
      case "CUSTOMER":
        if (
          location.pathname === "/login" ||
          location.pathname === "/customer/login" ||
          location.pathname === "/" ||
          !location.pathname.startsWith("/customer")
        ) {
          navigate("/customer/dashboard");
          window.location.reload();
        }
        break;
      default:
        if (
          location.pathname === "/login" ||
          location.pathname === "/" ||
          !location.pathname.startsWith("/admin")
        ) {
          // navigate("/staff/dashboard");
          navigate("/admin/dashboard");
          window.location.reload();
        }
        break;
    }
  }, [navigate, location.pathname, role, staffDetails]);

  const ClearSession = async () => {
    if (token) {
      var decoded = jwtDecode(token);
      if (decoded.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem("user_role");
        localStorage.removeItem("user_details");
        localStorage.clear();
        // window.location.reload();
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }


  };

  useEffect(() => {
    ClearSession();
  }, []);

  console.log("role", role)

  return (
    <div>
      <Routes>
        <Route path="/admin/*" element={role ? <Admin_Route /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login1" element={<Login1 />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />

        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/customer/*" element={role === "CUSTOMER" ? <Customer_Route /> : <CustomerLogin />} />


      </Routes>
    </div>
  );
};


export default Main_Route;
