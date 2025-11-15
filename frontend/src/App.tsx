import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Locais from './pages/Locais';
import Medidores from './pages/Medidores';
import Leituras from './pages/Leituras';
import Alertas from './pages/Alertas';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="locais" element={<Locais />} />
        <Route path="medidores" element={<Medidores />} />
        <Route path="leituras" element={<Leituras />} />
        <Route path="alertas" element={<Alertas />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
