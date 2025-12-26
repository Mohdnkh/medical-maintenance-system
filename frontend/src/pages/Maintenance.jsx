import { useState, useMemo } from "react";
import { dataService } from "../services/dataService";

export default function Maintenance() {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [type, setType] = useState("PM");
  const [engineer, setEngineer] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("Working");

  /* ====== Device Options ====== */
  const deviceOptions = useMemo(() => {
    return dataService.physicalDevices.map(d => ({
      id: d.device_id,
      label: `${d.model_name} | ${d.center_name} | ${d.serial_number}`
    }));
  }, []);

  const selectedDevice = dataService.physicalDevices.find(
    d => String(d.device_id) === String(selectedDeviceId)
  );

  /* ====== Submit ====== */
  const handleSave = () => {
    if (!selectedDevice) {
      alert("Please select a device");
      return;
    }

    const record = {
      maintenance_id: Date.now(),
      device_id: selectedDevice.device_id,
      maintenance_type: type,
      maintenance_datetime: new Date().toISOString(),
      engineer_name: engineer || "UNKNOWN",
      description: notes,
      device_status_after: status
    };

    console.log("NEW MAINTENANCE RECORD:", record);

    alert("Maintenance record saved (simulation).");
  };

  return (
    <div className="page-container">
      <h2>Maintenance</h2>

      {/* ===== Device Selection ===== */}
      <label>Device</label>
      <select
        value={selectedDeviceId}
        onChange={(e) => setSelectedDeviceId(e.target.value)}
      >
        <option value="">Select device</option>
        {deviceOptions.map(d => (
          <option key={d.id} value={d.id}>
            {d.label}
          </option>
        ))}
      </select>

      {/* ===== Maintenance Type ===== */}
      <label>Maintenance Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="PM">Preventive (PM)</option>
        <option value="CM">Corrective (CM)</option>
      </select>

      {/* ===== Engineer ===== */}
      <label>Engineer</label>
      <select value={engineer} onChange={(e) => setEngineer(e.target.value)}>
        <option value="">Select engineer</option>
        {dataService.engineers.map(e => (
          <option key={e.engineer_id} value={e.name}>
            {e.name}
          </option>
        ))}
      </select>

      {/* ===== Notes ===== */}
      <label>Description / Notes</label>
      <textarea
        rows="4"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      {/* ===== Status ===== */}
      <label>Device Status After Maintenance</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Working">Working</option>
        <option value="Under Service">Under Service</option>
      </select>

      {/* ===== Preview ===== */}
      {selectedDevice && (
        <div className="maintenance-preview">
          <strong>Preview:</strong>
          <div>Device: {selectedDevice.model_name}</div>
          <div>Center: {selectedDevice.center_name}</div>
          <div>Type: {type}</div>
          <div>Engineer: {engineer || "UNKNOWN"}</div>
          <div>Status After: {status}</div>
        </div>
      )}

      <button onClick={handleSave}>Save Maintenance</button>
    </div>
  );
}
