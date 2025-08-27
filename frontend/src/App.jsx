// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import PrivateRoute from "./components/PrivateRoute"; // auth wrapper

// New pages
import PortfolioDashboard from "./components/PortfolioDashboard";
import InvestmentProfile from "./components/InvestmentProfile";
import QuestionnaireForm from "./components/QuestionnaireForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PortfolioDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <InvestmentProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/questionnaire"
          element={
            <PrivateRoute>
              <QuestionnaireForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
