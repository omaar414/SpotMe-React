import React from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute/>}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  </Router>
);