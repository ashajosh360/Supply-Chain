import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import MetricsStrip from './components/MetricsStrip';
import RouteSelector from './components/RouteSelector';
import PerformanceChart from './components/PerformanceChart';
import RouteRankingTable from './components/RouteRankingTable';
import PerformanceHeatmap from './components/PerformanceHeatmap';

const RoutePerformanceAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [selectedRoutes, setSelectedRoutes] = useState(['ASIA-US-WEST', 'EUROPE-US-EAST']);
  const [selectedCarriers, setSelectedCarriers] = useState(['all']);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for route performance analytics
  const routeData = [
    {
      id: 'ASIA-US-WEST',
      name: 'Asia to US West Coast',
      avgTransitTime: 14.2,
      reliabilityScore: 87.5,
      costPerMile: 2.45,
      delayFrequency: 12.3,
      totalShipments: 1247,
      onTimeDelivery: 87.7,
      trend: 'improving'
    },
    {
      id: 'EUROPE-US-EAST',
      name: 'Europe to US East Coast',
      avgTransitTime: 11.8,
      reliabilityScore: 92.1,
      costPerMile: 2.12,
      delayFrequency: 7.9,
      totalShipments: 892,
      onTimeDelivery: 92.1,
      trend: 'stable'
    },
    {
      id: 'ASIA-EUROPE',
      name: 'Asia to Europe',
      avgTransitTime: 18.5,
      reliabilityScore: 84.3,
      costPerMile: 1.98,
      delayFrequency: 15.7,
      totalShipments: 634,
      onTimeDelivery: 84.3,
      trend: 'declining'
    },
    {
      id: 'INTRA-ASIA',
      name: 'Intra-Asia Routes',
      avgTransitTime: 8.3,
      reliabilityScore: 89.6,
      costPerMile: 3.21,
      delayFrequency: 10.4,
      totalShipments: 2156,
      onTimeDelivery: 89.6,
      trend: 'improving'
    }
  ];

  const carrierOptions = [
    { id: 'all', name: 'All Carriers' },
    { id: 'maersk', name: 'Maersk Line' },
    { id: 'msc', name: 'MSC' },
    { id: 'cosco', name: 'COSCO Shipping' },
    { id: 'cma-cgm', name: 'CMA CGM' },
    { id: 'hapag-lloyd', name: 'Hapag-Lloyd' }
  ];

  const chartData = [
    { month: 'Jan', transitTime: 14.8, delays: 15, reliability: 85.2 },
    { month: 'Feb', transitTime: 15.2, delays: 18, reliability: 83.7 },
    { month: 'Mar', transitTime: 14.1, delays: 12, reliability: 88.1 },
    { month: 'Apr', transitTime: 13.9, delays: 10, reliability: 89.5 },
    { month: 'May', transitTime: 14.3, delays: 14, reliability: 86.8 },
    { month: 'Jun', transitTime: 14.0, delays: 11, reliability: 88.9 },
    { month: 'Jul', transitTime: 13.7, delays: 9, reliability: 90.3 },
    { month: 'Aug', transitTime: 14.2, delays: 13, reliability: 87.5 },
    { month: 'Sep', transitTime: 13.8, delays: 8, reliability: 91.2 },
    { month: 'Oct', transitTime: 14.1, delays: 12, reliability: 88.7 },
    { month: 'Nov', transitTime: 14.5, delays: 16, reliability: 85.9 },
    { month: 'Dec', transitTime: 14.2, delays: 12, reliability: 87.5 }
  ];

  const heatmapData = [
    { route: 'ASIA-US-WEST', week1: 85, week2: 88, week3: 87, week4: 89, week5: 86 },
    { route: 'EUROPE-US-EAST', week1: 92, week2: 91, week3: 93, week4: 92, week5: 94 },
    { route: 'ASIA-EUROPE', week1: 82, week2: 84, week3: 83, week4: 85, week5: 84 },
    { route: 'INTRA-ASIA', week1: 88, week2: 90, week3: 89, week4: 91, week5: 90 },
    { route: 'US-LATIN-AMERICA', week1: 79, week2: 81, week3: 80, week4: 82, week5: 81 },
    { route: 'MIDDLE-EAST-ASIA', week1: 86, week2: 87, week3: 85, week4: 88, week5: 87 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Route', 'Avg Transit Time', 'Reliability Score', 'Cost Per Mile', 'Delay Frequency'],
      ...routeData.map(route => [
        route.name,
        route.avgTransitTime,
        route.reliabilityScore,
        route.costPerMile,
        route.delayFrequency
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-performance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Route Performance Analytics</h1>
              <p className="text-text-secondary">
                Comprehensive route analysis and optimization insights for global shipping operations
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-200 disabled:opacity-50"
              >
                <Icon 
                  name="RefreshCw" 
                  size={16} 
                  className={isRefreshing ? 'animate-spin' : ''} 
                />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              
              <button
                onClick={handleExportReport}
                className="flex items-center space-x-2 btn-primary px-4 py-2 rounded-lg"
              >
                <Icon name="Download" size={16} />
                <span className="text-sm font-medium">Export Report</span>
              </button>
            </div>
          </div>

          {/* Route Selector */}
          <RouteSelector
            routes={routeData}
            carriers={carrierOptions}
            selectedRoutes={selectedRoutes}
            selectedCarriers={selectedCarriers}
            dateRange={dateRange}
            onRouteChange={setSelectedRoutes}
            onCarrierChange={setSelectedCarriers}
            onDateRangeChange={setDateRange}
          />
        </div>

        {/* Metrics Strip */}
        <MetricsStrip 
          routeData={routeData}
          selectedRoutes={selectedRoutes}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
          {/* Performance Chart - 8 columns */}
          <div className="xl:col-span-8">
            <PerformanceChart 
              data={chartData}
              selectedRoutes={selectedRoutes}
            />
          </div>

          {/* Route Ranking Table - 4 columns */}
          <div className="xl:col-span-4">
            <RouteRankingTable 
              routes={routeData}
              onRouteSelect={(routeId) => {
                if (!selectedRoutes.includes(routeId)) {
                  setSelectedRoutes([...selectedRoutes, routeId]);
                }
              }}
            />
          </div>
        </div>

        {/* Performance Heatmap */}
        <PerformanceHeatmap 
          data={heatmapData}
          onRouteClick={(routeId) => {
            if (!selectedRoutes.includes(routeId)) {
              setSelectedRoutes([...selectedRoutes, routeId]);
            }
          }}
        />

        {/* Quick Navigation */}
        <div className="mt-8 p-6 bg-surface border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/global-operations-overview-dashboard')}
              className="flex items-center space-x-3 p-4 bg-surface-50 hover:bg-primary-50 border border-border-light rounded-lg transition-colors duration-200"
            >
              <Icon name="Globe" size={20} className="text-primary" />
              <div className="text-left">
                <p className="font-medium text-text-primary">Operations Overview</p>
                <p className="text-sm text-text-secondary">Global shipment monitoring</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/risk-management-alerts-dashboard')}
              className="flex items-center space-x-3 p-4 bg-surface-50 hover:bg-primary-50 border border-border-light rounded-lg transition-colors duration-200"
            >
              <Icon name="AlertTriangle" size={20} className="text-accent" />
              <div className="text-left">
                <p className="font-medium text-text-primary">Risk Management</p>
                <p className="text-sm text-text-secondary">Alerts and disruptions</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/shipment-tracking-details-dashboard')}
              className="flex items-center space-x-3 p-4 bg-surface-50 hover:bg-primary-50 border border-border-light rounded-lg transition-colors duration-200"
            >
              <Icon name="Package" size={20} className="text-secondary" />
              <div className="text-left">
                <p className="font-medium text-text-primary">Shipment Tracking</p>
                <p className="text-sm text-text-secondary">Detailed tracking info</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutePerformanceAnalyticsDashboard;