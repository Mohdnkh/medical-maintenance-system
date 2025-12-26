import { dataService } from "../services/dataService";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const devices = dataService.physicalDevices;
  const records = dataService.maintenanceRecords;

  const pmCount = records.filter(r => r.maintenance_type === "PM").length;
  const cmCount = records.filter(r => r.maintenance_type === "CM").length;

  const working = devices.filter(d => {
    const r = records
      .filter(x => x.device_id === d.device_id)
      .sort((a, b) => new Date(b.maintenance_datetime) - new Date(a.maintenance_datetime));
    return r.length && r[0].maintenance_type !== "CM";
  }).length;

  const underService = devices.length - working;

  /* Charts */
  const maintenanceChart = {
    labels: ["PM", "CM"],
    datasets: [
      {
        label: "Maintenance Count",
        data: [pmCount, cmCount],
      },
    ],
  };

  const statusChart = {
    labels: ["Working", "Under Service"],
    datasets: [
      {
        data: [working, underService],
      },
    ],
  };

  return (
    <div className="page-container">
      <h2>Dashboard</h2>

      {/* KPIs */}
      <div className="report-grid">
        <KPI title="Total Devices" value={devices.length} />
        <KPI title="Working" value={working} />
        <KPI title="Under Service" value={underService} />
        <KPI title="PM Records" value={pmCount} />
        <KPI title="CM Records" value={cmCount} />
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-box">
          <h4>Maintenance Distribution</h4>
          <Bar data={maintenanceChart} />
        </div>

        <div className="chart-box">
          <h4>Device Status</h4>
          <Doughnut data={statusChart} />
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="report-box">
      <div className="report-value">{value}</div>
      <div className="report-title">{title}</div>
    </div>
  );
}
