import { dataService } from "../services/dataService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Reports() {
  const now = new Date();

  /* ===== Helpers ===== */
  const yearsDiff = (dateStr) => {
    const d = new Date(dateStr);
    return (now - d) / (1000 * 60 * 60 * 24 * 365);
  };

  /* ===== Calculations ===== */
  const totalDevices = dataService.physicalDevices.length;

  const pmRecords = dataService.maintenanceRecords.filter(
    (r) => r.maintenance_type === "PM"
  );

  const cmRecords = dataService.maintenanceRecords.filter(
    (r) => r.maintenance_type === "CM"
  );

  const devicesUnderService = dataService.physicalDevices.filter((d) => {
    const records = dataService.maintenanceRecords
      .filter((r) => r.device_id === d.device_id)
      .sort(
        (a, b) =>
          new Date(b.maintenance_datetime) -
          new Date(a.maintenance_datetime)
      );

    if (records.length === 0) return false;
    return records[0].maintenance_type === "CM";
  }).length;

  const pmOverdue = dataService.physicalDevices.filter((d) => {
    const pm = dataService.maintenanceRecords
      .filter(
        (r) =>
          r.device_id === d.device_id &&
          r.maintenance_type === "PM"
      )
      .sort(
        (a, b) =>
          new Date(b.maintenance_datetime) -
          new Date(a.maintenance_datetime)
      );

    if (pm.length === 0) return true;
    return yearsDiff(pm[0].maintenance_datetime) > 1;
  }).length;

  const noMaintenance = dataService.physicalDevices.filter((d) => {
    const records = dataService.maintenanceRecords.filter(
      (r) => r.device_id === d.device_id
    );

    if (records.length === 0) return true;

    const last = records.sort(
      (a, b) =>
        new Date(b.maintenance_datetime) -
        new Date(a.maintenance_datetime)
    )[0];

    return yearsDiff(last.maintenance_datetime) > 2;
  }).length;

  const repeatedCM = dataService.physicalDevices.filter((d) => {
    const cmCount = dataService.maintenanceRecords.filter(
      (r) =>
        r.device_id === d.device_id &&
        r.maintenance_type === "CM"
    ).length;

    return cmCount >= 3;
  }).length;

  const highCostDevices = dataService.physicalDevices.filter((d) => {
    const totalCost = dataService.maintenanceRecords
      .filter((r) => r.device_id === d.device_id)
      .reduce((sum, r) => sum + (r.cost?.value || 0), 0);

    return totalCost >= 1000;
  }).length;

  /* ===== PDF Generator ===== */
  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Maintenance Report", 14, 15);

    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Metric", "Value"]],
      body: [
        ["Total Devices", totalDevices],
        ["Devices Under Service", devicesUnderService],
        ["PM Overdue", pmOverdue],
        ["Repeated CM", repeatedCM],
        ["No Maintenance", noMaintenance],
        ["High Cost Devices", highCostDevices],
      ],
    });

    doc.addPage();

    doc.setFontSize(14);
    doc.text("Maintenance Summary", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["Type", "Count"]],
      body: [
        ["PM Records", pmRecords.length],
        ["CM Records", cmRecords.length],
        [
          "CM / PM Ratio",
          pmRecords.length === 0
            ? "N/A"
            : (cmRecords.length / pmRecords.length).toFixed(2),
        ],
      ],
    });

    doc.save("maintenance_report.pdf");
  };

  return (
    <div className="page-container">
      <h2>Reports</h2>

      <button onClick={generatePDF}>
        Generate PDF Report
      </button>

      <div className="report-grid">
        <ReportBox title="Total Devices" value={totalDevices} />
        <ReportBox title="Under Service" value={devicesUnderService} />
        <ReportBox title="PM Overdue" value={pmOverdue} />
        <ReportBox title="Repeated CM" value={repeatedCM} />
        <ReportBox title="No Maintenance" value={noMaintenance} />
        <ReportBox title="High Cost Devices" value={highCostDevices} />
      </div>
    </div>
  );
}

/* ===== KPI Box ===== */
function ReportBox({ title, value }) {
  return (
    <div className="report-box">
      <div className="report-value">{value}</div>
      <div className="report-title">{title}</div>
    </div>
  );
}
