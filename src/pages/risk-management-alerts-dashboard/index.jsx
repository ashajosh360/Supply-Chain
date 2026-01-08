import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import AlertSummaryCards from './components/AlertSummaryCards';
import RiskMap from './components/RiskMap';
import AlertQueue from './components/AlertQueue';
import ExceptionTable from './components/ExceptionTable';
import FilterControls from './components/FilterControls';

const RiskManagementAlertsDashboard = () => {
  const [filters, setFilters] = useState({
    severity: 'all',
    category: 'all',
    timeframe: '24h',
    realTime: true
  });

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Mock data for alerts and risks
  const alertSummary = {
    critical: 12,
    weather: 8,
    portCongestion: 15,
    predicted: 23
  };

  const activeAlerts = [
    {
      id: 'ALERT-001',
      severity: 'critical',
      category: 'weather',
      title: 'Severe Storm Warning - Pacific Route',
      description: 'Category 4 typhoon affecting shipping lanes between Hong Kong and Los Angeles. Expected 72-hour disruption with 15-20 foot waves.',
      affectedShipments: 45,
      estimatedDelay: '48-72 hours',
      location: { lat: 25.0330, lng: 121.5654 },
      timestamp: new Date(Date.now() - 1800000),
      status: 'active',
      escalated: true,
      recommendedActions: ['Reroute via southern corridor', 'Delay departures from Hong Kong', 'Notify affected customers']
    },
    {
      id: 'ALERT-002',
      severity: 'high',
      category: 'port',
      title: 'Port Congestion - Rotterdam Terminal',
      description: 'Severe congestion at Rotterdam container terminal due to labor strike. Processing delays of 24-48 hours expected.',
      affectedShipments: 78,
      estimatedDelay: '24-48 hours',
      location: { lat: 51.9244, lng: 4.4777 },
      timestamp: new Date(Date.now() - 3600000),
      status: 'active',
      escalated: false,
      recommendedActions: ['Redirect to Amsterdam port', 'Arrange alternative transport', 'Update customer ETAs']
    },
    {
      id: 'ALERT-003',
      severity: 'medium',
      category: 'security',
      title: 'Security Alert - Suez Canal',
      description: 'Increased security measures at Suez Canal causing additional inspection delays. Average 6-hour processing time.',
      affectedShipments: 32,
      estimatedDelay: '4-8 hours',
      location: { lat: 30.0444, lng: 31.2357 },
      timestamp: new Date(Date.now() - 7200000),
      status: 'monitoring',
      escalated: false,
      recommendedActions: ['Prepare additional documentation', 'Coordinate with security teams', 'Monitor situation']
    },
    {
      id: 'ALERT-004',
      severity: 'high',
      category: 'mechanical',
      title: 'Vessel Engine Failure - MV Ocean Pioneer',
      description: 'Main engine failure on MV Ocean Pioneer carrying 156 containers. Vessel anchored 200nm from Singapore.',
      affectedShipments: 156,
      estimatedDelay: '72-96 hours',
      location: { lat: 1.3521, lng: 103.8198 },
      timestamp: new Date(Date.now() - 5400000),
      status: 'critical',
      escalated: true,
      recommendedActions: ['Arrange tugboat assistance', 'Prepare container transfer', 'Book alternative vessels']
    },
    {
      id: 'ALERT-005',
      severity: 'low',
      category: 'weather',
      title: 'Fog Advisory - English Channel',
      description: 'Dense fog conditions in English Channel reducing visibility to less than 500 meters. Minor delays expected.',
      affectedShipments: 12,
      estimatedDelay: '2-4 hours',
      location: { lat: 50.0755, lng: 1.0083 },
      timestamp: new Date(Date.now() - 1200000),
      status: 'monitoring',
      escalated: false,
      recommendedActions: ['Reduce vessel speed', 'Increase radar monitoring', 'Update ETA estimates']
    }
  ];

  const affectedShipments = [
    {
      id: 'SHIP-001',
      trackingNumber: 'MSK-789456123',
      vessel: 'MV Ocean Pioneer',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      currentLocation: 'Singapore Waters',
      alertId: 'ALERT-004',
      riskLevel: 'high',
      estimatedImpact: '72-96 hours delay',
      recommendedAction: 'Transfer to alternative vessel',
      eta: '2024-01-25',
      status: 'at-risk'
    },
    {
      id: 'SHIP-002',
      trackingNumber: 'COSCO-456789012',
      vessel: 'MV Pacific Star',
      origin: 'Hong Kong',
      destination: 'Long Beach, USA',
      currentLocation: 'Pacific Ocean',
      alertId: 'ALERT-001',
      riskLevel: 'critical',
      estimatedImpact: '48-72 hours delay',
      recommendedAction: 'Reroute via southern corridor',
      eta: '2024-01-28',
      status: 'rerouting'
    },
    {
      id: 'SHIP-003',
      trackingNumber: 'EVER-234567890',
      vessel: 'MV Atlantic Express',
      origin: 'Hamburg, Germany',
      destination: 'New York, USA',
      currentLocation: 'Rotterdam Port',
      alertId: 'ALERT-002',
      riskLevel: 'medium',
      estimatedImpact: '24-48 hours delay',
      recommendedAction: 'Wait for port clearance',
      eta: '2024-01-22',
      status: 'delayed'
    },
    {
      id: 'SHIP-004',
      trackingNumber: 'HAPAG-345678901',
      vessel: 'MV Mediterranean',
      origin: 'Dubai, UAE',
      destination: 'Rotterdam, Netherlands',
      currentLocation: 'Suez Canal',
      alertId: 'ALERT-003',
      riskLevel: 'low',
      estimatedImpact: '4-8 hours delay',
      recommendedAction: 'Comply with security procedures',
      eta: '2024-01-24',
      status: 'in-transit'
    }
  ];

  useEffect(() => {
    if (filters.realTime) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 300000); // Update every 5 minutes

      return () => clearInterval(interval);
    }
  }, [filters.realTime]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAlertSelect = (alert) => {
    setSelectedAlert(alert);
  };

  const handleAlertAcknowledge = (alertId) => {
    console.log('Acknowledging alert:', alertId);
  };

  const handleAlertEscalate = (alertId) => {
    console.log('Escalating alert:', alertId);
  };

  const handleExportReport = () => {
    const csvContent = [
      ['Alert ID', 'Severity', 'Category', 'Title', 'Affected Shipments', 'Status', 'Timestamp'],
      ...activeAlerts.map(alert => [
        alert.id,
        alert.severity,
        alert.category,
        alert.title,
        alert.affectedShipments,
        alert.status,
        alert.timestamp.toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `risk-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredAlerts = activeAlerts.filter(alert => {
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.category !== 'all' && alert.category !== filters.category) return false;
    
    const alertAge = Date.now() - alert.timestamp.getTime();
    const timeframeLimits = {
      '1h': 3600000,
      '6h': 21600000,
      '24h': 86400000,
      '7d': 604800000
    };
    
    if (filters.timeframe !== 'all' && alertAge > timeframeLimits[filters.timeframe]) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 lg:px-6 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Risk Management & Alerts Dashboard
              </h1>
              <p className="text-text-secondary">
                Proactive threat monitoring and exception management for global supply chain operations
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${filters.realTime ? 'bg-success animate-pulse' : 'bg-text-secondary'}`}></div>
                <span className="text-sm text-text-secondary">
                  {filters.realTime ? 'Live Updates' : 'Paused'}
                </span>
              </div>
              
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  audioEnabled 
                    ? 'bg-primary text-white' :'bg-surface-100 text-text-secondary hover:bg-surface-200'
                }`}
                title={`${audioEnabled ? 'Disable' : 'Enable'} audio alerts`}
              >
                <Icon name={audioEnabled ? "Volume2" : "VolumeX"} size={18} />
              </button>
              
              <button
                onClick={handleExportReport}
                className="btn-secondary px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
              >
                <Icon name="Download" size={16} />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          <FilterControls 
            filters={filters} 
            onFilterChange={handleFilterChange}
            alertCount={filteredAlerts.length}
          />
        </div>

        {/* Alert Summary Cards */}
        <AlertSummaryCards summary={alertSummary} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-16 gap-6 mb-6">
          {/* Risk Map */}
          <div className="xl:col-span-12">
            <RiskMap 
              alerts={filteredAlerts}
              selectedAlert={selectedAlert}
              onAlertSelect={handleAlertSelect}
            />
          </div>

          {/* Alert Queue */}
          <div className="xl:col-span-4">
            <AlertQueue 
              alerts={filteredAlerts}
              selectedAlert={selectedAlert}
              onAlertSelect={handleAlertSelect}
              onAcknowledge={handleAlertAcknowledge}
              onEscalate={handleAlertEscalate}
            />
          </div>
        </div>

        {/* Exception Table */}
        <ExceptionTable 
          shipments={affectedShipments}
          alerts={activeAlerts}
        />

        {/* Status Footer */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-surface-50 rounded-lg border border-border-light">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm text-text-secondary">
                {filteredAlerts.filter(a => a.severity === 'critical').length} critical alerts active
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Shield" size={16} />
            <span>Risk monitoring system operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskManagementAlertsDashboard;