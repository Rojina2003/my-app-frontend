import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, userId: null  }); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = localStorage.getItem("userId"); 
      setAuth({ token, userId }); 
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/users/login", { email, password });
      
      const { token, user } = res.data;
      setAuth({ token, userId: user.id });
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    setAuth({ token: null, userId: null });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
