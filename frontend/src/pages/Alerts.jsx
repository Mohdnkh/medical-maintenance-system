import { useNavigate } from "react-router-dom";
import { dataService } from "../services/dataService";

export default function Alerts() {
  const navigate = useNavigate();
  const now = new Date();

  /* ===== Helpers ===== */
  const yearsDiff = (dateStr) => {
    const d = new Date(dateStr);
    return (now - d) / (1000 * 60 * 60 * 24 * 365);
  };

  /* ===== Alerts Engine ===== */

  // 1️⃣ PM Overdue
  const pmOverdue = dataService.physicalDevices.filter((device) => {
    const records = dataService.maintenanceRecords
      .filter(
        (r) =>
          r.device_id === device.device_id &&
          r.maintenance_type === "PM"
      )
      .sort(
        (a, b) =>
          new Date(b.maintenance_datetime) -
          new Date(a.maintenance_datetime)
      );

    if (records.length === 0) return true;
    return yearsDiff(records[0].maintenance_datetime) > 1;
  });

  // 2️⃣ Repeated CM
  const repeatedCM = dataService.physicalDevices.filter((device) => {
    const cmCount = dataService.maintenanceRecords.filter(
      (r) =>
        r.device_id === device.device_id &&
        r.maintenance_type === "CM"
    ).length;

    return cmCount >= 3;
  });

  // 3️⃣ Long Time No Maintenance
  const noMaintenance = dataService.physicalDevices.filter((device) => {
    const records = dataService.maintenanceRecords.filter(
      (r) => r.device_id === device.device_id
    );

    if (records.length === 0) return true;

    const last = records.sort(
      (a, b) =>
        new Date(b.maintenance_datetime) -
        new Date(a.maintenance_datetime)
    )[0];

    return yearsDiff(last.maintenance_datetime) > 2;
  });

  // 4️⃣ High Cost
  const highCost = dataService.physicalDevices.filter((device) => {
    const totalCost = dataService.maintenanceRecords
      .filter((r) => r.device_id === device.device_id)
      .reduce((sum, r) => sum + (r.cost?.value || 0), 0);

    return totalCost >= 1000;
  });

  return (
    <div className="page-container">
      <h2>AI Alerts</h2>

      <AlertBlock
        title="PM Overdue"
        description="Devices with overdue preventive maintenance."
        devices={pmOverdue}
        navigate={navigate}
      />

      <AlertBlock
        title="Repeated Corrective Maintenance"
        description="Devices with frequent corrective maintenance."
        devices={repeatedCM}
        navigate={navigate}
      />

      <AlertBlock
        title="No Maintenance for Long Time"
        description="Devices without maintenance for more than 2 years."
        devices={noMaintenance}
        navigate={navigate}
      />

      <AlertBlock
        title="High Maintenance Cost"
        description="Devices with high accumulated maintenance cost."
        devices={highCost}
        navigate={navigate}
      />
    </div>
  );
}

/* ===== Reusable Alert Block ===== */
function AlertBlock({ title, description, devices, navigate }) {
  return (
    <div className="alert-block">
      <h3>{title}</h3>
      <p>{description}</p>

      {devices.length === 0 ? (
        <p className="ok-text">No alerts 🎉</p>
      ) : (
        <ul className="alert-list">
          {devices.map((d) => (
            <li key={d.device_id} className="alert-item">
              <span
                className="alert-device"
                onClick={() => navigate(`/devices/${d.device_id}`)}
              >
                {d.model_name} – {d.center_name}
              </span>

              <button
                className="alert-action"
                onClick={() =>
                  navigate(`/maintenance?device=${d.device_id}`)
                }
              >
                Create Maintenance
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
