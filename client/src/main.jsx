import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home   from './pages/Home';
import Chat   from './pages/Chat';
import Report from './pages/Report';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/"       element={<Home />}   />
        <Route path="/chat"   element={<Chat />}   />
        <Route path="/report" element={<Report />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
