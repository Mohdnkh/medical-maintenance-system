import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Branding */}
      <div className="sidebar-brand">
        <img src={logo} alt="Masoud Logo" className="sidebar-logo" />
        <div className="sidebar-title">Masoud</div>
        <div className="sidebar-subtitle">Mindray Maintenance</div>
      </div>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="sidebar-link">
          📊 Dashboard
        </NavLink>

        <NavLink to="/search" className="sidebar-link">
          🔍 Search Devices
        </NavLink>

        <NavLink to="/maintenance" className="sidebar-link">
          🧑‍🔧 Maintenance
        </NavLink>

        <NavLink to="/alerts" className="sidebar-link">
          🤖 AI Alerts
        </NavLink>

        <NavLink to="/reports" className="sidebar-link">
          📊 Reports
        </NavLink>
      </nav>
    </aside>
  );
}
