import { useParams } from "react-router-dom";
import { dataService } from "../services/dataService";
import { useState } from "react";

export default function AddMaintenance() {
  const { id } = useParams();
  const device = dataService.physicalDevices.find(
    (d) => String(d.device_id) === id
  );

  const [type, setType] = useState("PM");
  const [description, setDescription] = useState("");

  if (!device) return <p>Device not found</p>;

  const handleSubmit = () => {
    alert("Maintenance record saved (next step: persist)");
  };

  return (
    <div className="page-container">
      <h2>Add Maintenance</h2>

      <p><strong>Model:</strong> {device.model_name}</p>
      <p><strong>Center:</strong> {device.center_name}</p>

      <label>Maintenance Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="PM">PM</option>
        <option value="CM">CM</option>
      </select>

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
