import { useParams } from "react-router-dom";
import { dataService } from "../services/dataService";

export default function DeviceDetails() {
  const { id } = useParams();

  const device = dataService.physicalDevices.find(
    (d) => String(d.device_id) === id
  );

  if (!device) {
    return <p>Device not found</p>;
  }

  const records = dataService.maintenanceRecords.filter(
    (m) => m.device_id === device.device_id
  );

  return (
    <div className="page-container">
      <h2>Device Details</h2>

      <p><strong>Model:</strong> {device.model_name}</p>
      <p><strong>Center:</strong> {device.center_name}</p>
      <p><strong>Serial:</strong> {device.serial_number}</p>

      <h3>Maintenance History</h3>

      {records.length === 0 ? (
        <p>No maintenance records.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Engineer</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.maintenance_id}>
                <td>{r.maintenance_datetime}</td>
                <td>{r.maintenance_type}</td>
                <td>{r.engineer_name}</td>
                <td>{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
