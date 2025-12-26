import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Masoud Logo" className="logo" />
        <div className="brand-text">
          <div className="brand-name">Masoud</div>
          <div className="brand-subtitle">Mindray Maintenance</div>
        </div>
      </div>

      <nav className="header-nav">
        <NavLink to="/" className="nav-link">
          Search
        </NavLink>
        <NavLink to="/reports" className="nav-link">
          Reports
        </NavLink>
      </nav>
    </header>
  );
}
