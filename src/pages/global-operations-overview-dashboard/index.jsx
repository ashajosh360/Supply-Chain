import React, { useState, useEffect } from 'react';

import KPIMetricsCards from './components/KPIMetricsCards';
import InteractiveWorldMap from './components/InteractiveWorldMap';
import LiveShipmentFeed from './components/LiveShipmentFeed';
import ActiveShipmentsTable from './components/ActiveShipmentsTable';
import DashboardControls from './components/DashboardControls';

const GlobalOperationsOverviewDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, autoRefreshInterval * 1000);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  // Mock connection status simulation
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'connected'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setConnectionStatus(randomStatus);
    }, 45000);

    return () => clearInterval(statusInterval);
  }, []);

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
  };

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    setLastUpdate(new Date());
  };

  const handleRefreshIntervalChange = (interval) => {
    setAutoRefreshInterval(interval);
  };

  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header Controls */}
      <DashboardControls
        selectedTimeRange={selectedTimeRange}
        onTimeRangeChange={handleTimeRangeChange}
        autoRefreshInterval={autoRefreshInterval}
        onRefreshIntervalChange={handleRefreshIntervalChange}
        selectedTimezone={selectedTimezone}
        onTimezoneChange={handleTimezoneChange}
        connectionStatus={connectionStatus}
        lastUpdate={lastUpdate}
      />

      {/* Main Dashboard Content */}
      <div className="px-4 lg:px-6 py-6 space-y-6">
        {/* KPI Metrics Row */}
        <KPIMetricsCards timeRange={selectedTimeRange} />

        {/* Central Map and Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Interactive World Map */}
          <div className="xl:col-span-2">
            <InteractiveWorldMap
              selectedShipment={selectedShipment}
              onShipmentSelect={handleShipmentSelect}
              timeRange={selectedTimeRange}
            />
          </div>

          {/* Live Shipment Feed Sidebar */}
          <div className="xl:col-span-1">
            <LiveShipmentFeed
              selectedShipment={selectedShipment}
              onShipmentSelect={handleShipmentSelect}
              lastUpdate={lastUpdate}
            />
          </div>
        </div>

        {/* Active Shipments Table */}
        <ActiveShipmentsTable
          selectedShipment={selectedShipment}
          onShipmentSelect={handleShipmentSelect}
          timeRange={selectedTimeRange}
        />
      </div>
    </div>
  );
};

export default GlobalOperationsOverviewDashboard;