import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Search from "./pages/Search";
import Devices from "./pages/Devices";
import DeviceDetails from "./pages/DeviceDetails";
import Maintenance from "./pages/Maintenance";
import AddMaintenance from "./pages/AddMaintenance";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          {/* Dashboard – Default */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Core Flow */}
          <Route path="/search" element={<Search />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:id" element={<DeviceDetails />} />

          {/* Maintenance */}
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/maintenance/new/:id" element={<AddMaintenance />} />

          {/* Intelligence */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
