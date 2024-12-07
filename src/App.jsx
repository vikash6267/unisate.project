import './App.css';
import Home from './pages/Home';
import { Route, Routes, useNavigate } from "react-router-dom";
import MagicEden from './pages/MagicEden';
import Navbar from './component/Navbar';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import CombinedPage from './pages/CombinePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const storedData = localStorage.getItem("loginData");
    const currentPath = window.location.pathname; // Get the current path
    
    if (storedData) {
      const { email, password, expiry } = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      if (currentTime < expiry) {
        setIsLoggedIn(true);
        if (currentPath === "/login") {
          navigate("/"); // Redirect to home if already logged in
        }
      } else {
        localStorage.removeItem("loginData");
        setIsLoggedIn(false);
        if (currentPath !== "/login") {
          navigate("/login");
        }
      }
    } else {
      setIsLoggedIn(false);
      if (currentPath !== "/login") {
        navigate("/login");
      }
    }
  };
  

  const CheckLoginStatus = ({ children }) => {
    if (isLoggedIn) {
      return children;
    } else {
      return navigate("/login");
    }
  };

  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <CheckLoginStatus>
              <Home />
            </CheckLoginStatus>
          }
        />
        <Route
          path="/magic"
          element={
            <CheckLoginStatus>
              <MagicEden />
            </CheckLoginStatus>
          }
        />
        <Route
          path="/combine"
          element={
            <CheckLoginStatus>
              <CombinedPage />
            </CheckLoginStatus>
          }
        />

        <Route path="/login" element={<Login checkLoginStatus={checkLoginStatus} />} />
      </Routes>
    </div>
  );
}

export default App;
