import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dataService } from "../services/dataService";

export default function Search() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("ALL");
  const [center, setCenter] = useState("ALL");

  /* ====== تجهيز الداتا ====== */
  const families = useMemo(() => {
    return [...new Set(dataService.deviceModels.map(m => m.device_family))];
  }, []);

  const centers = useMemo(() => {
    return [...new Set(dataService.physicalDevices.map(d => d.center_name))];
  }, []);

  /* ====== Preview Results Count ====== */
  const previewCount = useMemo(() => {
    return dataService.physicalDevices.filter(d => {
      const q = query.toLowerCase();

      const matchQuery =
        d.model_name.toLowerCase().includes(q) ||
        d.center_name.toLowerCase().includes(q) ||
        d.serial_number.toLowerCase().includes(q);

      const matchFamily =
        family === "ALL" ||
        d.model_name.startsWith(family);

      const matchCenter =
        center === "ALL" ||
        d.center_name === center;

      return matchQuery && matchFamily && matchCenter;
    }).length;
  }, [query, family, center]);

  /* ====== Submit ====== */
  const handleSearch = () => {
    navigate(
      `/devices?q=${query}&family=${family}&center=${center}`
    );
  };

  return (
    <div className="page-container">
      <h2>Search Devices</h2>

      {/* ===== Search Box ===== */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by model, center, or serial number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button onClick={handleSearch}>Search</button>
      </div>

      {/* ===== Filters ===== */}
      <div className="search-filters">
        <select value={family} onChange={(e) => setFamily(e.target.value)}>
          <option value="ALL">All Device Families</option>
          {families.map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <select value={center} onChange={(e) => setCenter(e.target.value)}>
          <option value="ALL">All Centers</option>
          {centers.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ===== Preview ===== */}
      <div className="search-preview">
        {previewCount === 0 ? (
          <span>No devices match your search.</span>
        ) : (
          <span>
            {previewCount} device{previewCount > 1 ? "s" : ""} will be displayed.
          </span>
        )}
      </div>
    </div>
  );
}
