// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import ExercisesMenu from './pages/ExercisesMenu';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import './App.css';
import RestApiSimulator from './components/RestApiSimulator/RestApiSimulator';
import { AuthProvider } from './context/AuthContext';
import { SpinnerProvider } from './context/SpinnerContext';

function App() {
  return (
    <AuthProvider>
      <SpinnerProvider>
        <Router>
          <div className="app">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/exercises" element={<Exercises />} />
                <Route path="/exercises/:categoryId" element={<ExercisesMenu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/exercises/:categoryId/apisimulator/:exerciseId" element={<RestApiSimulator />} />
              </Routes>
            </div>
          </div>
        </Router>
      </SpinnerProvider>
    </AuthProvider>
  );
}

export default App;