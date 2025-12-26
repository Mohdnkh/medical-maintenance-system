import { useLocation } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;

    if (path === "/" || path === "/dashboard") return "Dashboard Overview";
    if (path.startsWith("/search")) return "Search Devices";
    if (path.startsWith("/devices/")) return "Device Details";
    if (path === "/devices") return "Devices";
    if (path.startsWith("/maintenance/new")) return "Add Maintenance";
    if (path.startsWith("/maintenance")) return "Maintenance";
    if (path === "/alerts") return "AI Alerts";
    if (path === "/reports") return "Reports";

    return "Medical Maintenance System";
  };

  return (
    <div className="topbar">
      <span>{getTitle()}</span>
    </div>
  );
}
