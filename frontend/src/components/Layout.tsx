import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Droplets, 
  LayoutDashboard, 
  MapPin, 
  Activity, 
  BarChart3,
  Bell,
  LogOut 
} from 'lucide-react';
import '../styles/Layout.css';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Droplets size={32} />
          <h2>Water System</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/locais" className="nav-item">
            <MapPin size={20} />
            <span>Locais</span>
          </NavLink>
          <NavLink to="/medidores" className="nav-item">
            <Activity size={20} />
            <span>Medidores</span>
          </NavLink>
          <NavLink to="/leituras" className="nav-item">
            <BarChart3 size={20} />
            <span>Leituras</span>
          </NavLink>
          <NavLink to="/alertas" className="nav-item">
            <Bell size={20} />
            <span>Alertas</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.nome.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.nome}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="btn btn-secondary logout-btn">
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
