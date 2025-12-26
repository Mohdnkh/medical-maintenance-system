import centersData from "../data/canonical/centers.json";
import deviceModelsData from "../data/canonical/device_models.json";
import engineersData from "../data/canonical/engineers.json";
import maintenanceData from "../data/canonical/maintenance_records.json";
import physicalDevicesData from "../data/canonical/physical_devices.json";

export const dataService = {
  centers: centersData.centers,
  deviceModels: deviceModelsData.device_models,
  engineers: engineersData.engineers,
  maintenanceRecords: maintenanceData.maintenance_records,
  physicalDevices: physicalDevicesData.physical_devices,
};
