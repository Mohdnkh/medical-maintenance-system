import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { dataService } from "../services/dataService";

export default function Devices() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const q = (params.get("q") || "").toLowerCase();
  const family = params.get("family") || "ALL";
  const center = params.get("center") || "ALL";

  /* ===== Status Resolver ===== */
  const getDeviceStatus = (deviceId) => {
    const records = dataService.maintenanceRecords
      .filter(r => r.device_id === deviceId)
      .sort((a, b) =>
        new Date(b.maintenance_datetime) - new Date(a.maintenance_datetime)
      );

    if (records.length === 0) return "Unknown";

    const last = records[0].maintenance_type;
    return last === "CM" ? "Under Service" : "Working";
  };

  /* ===== Filtered Devices ===== */
  const devices = useMemo(() => {
    return dataService.physicalDevices.filter(d => {
      const matchQuery =
        d.model_name.toLowerCase().includes(q) ||
        d.center_name.toLowerCase().includes(q) ||
        d.serial_number.toLowerCase().includes(q);

      const matchFamily =
        family === "ALL" || d.model_name.startsWith(family);

      const matchCenter =
        center === "ALL" || d.center_name === center;

      return matchQuery && matchFamily && matchCenter;
    });
  }, [q, family, center]);

  return (
    <div className="page-container">
      <h2>Devices</h2>

      {devices.length === 0 ? (
        <p>No devices found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Center</th>
              <th>Serial</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {devices.map(d => {
              const status = getDeviceStatus(d.device_id);

              return (
                <tr key={d.device_id}>
                  <td>{d.model_name}</td>
                  <td>{d.center_name}</td>
                  <td>{d.serial_number}</td>
                  <td>
                    <span className={`status ${status.replace(" ", "-")}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => navigate(`/devices/${d.device_id}`)}>
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/maintenance?device=${d.device_id}`)
                      }
                    >
                      Maintenance
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
