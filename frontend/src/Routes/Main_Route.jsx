import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "../layouts/Auth/Login";
import Admin_Route from "./Admin_Route";

const Main_Route = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staffDetails = JSON.parse(localStorage.getItem("staffDetails"));
  const role = JSON.parse(localStorage.getItem("role"));
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // Check if Staff details exist
    if (role == null || token == null || staffDetails == null) {
      navigate("/login");
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

    // Redirect based on user role and route prefix
    switch (role) {
      case "ADMIN":
        if (
          location.pathname === "/login" ||
          location.pathname === "/" ||
          !location.pathname.startsWith("/admin")
        ) {  
          navigate("/admin/dashboard");
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
        }
        break;
    }
  }, [navigate, location.pathname, role, staffDetails]);

  return (
    <div>
      <Routes>
        <Route path="/admin/*" element={role ? <Admin_Route /> : <Login />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default Main_Route;
