import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const InteractiveWorldMap = ({ selectedShipment, onShipmentSelect, timeRange }) => {
  const [mapView, setMapView] = useState('routes');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState('normal');

  // Mock shipping routes data
  const shippingRoutes = [
    {
      id: 'route-001',
      name: 'Trans-Pacific Express',
      origin: { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
      destination: { name: 'Los Angeles, USA', lat: 34.0522, lng: -118.2437 },
      status: 'active',
      shipments: 45,
      avgDelay: '2.3 hours',
      congestionLevel: 'low',
      color: '#059669'
    },
    {
      id: 'route-002',
      name: 'Atlantic Bridge',
      origin: { name: 'Hamburg, Germany', lat: 53.5511, lng: 9.9937 },
      destination: { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
      status: 'delayed',
      shipments: 32,
      avgDelay: '18.5 hours',
      congestionLevel: 'medium',
      color: '#d97706'
    },
    {
      id: 'route-003',
      name: 'Mediterranean Corridor',
      origin: { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734 },
      destination: { name: 'Istanbul, Turkey', lat: 41.0082, lng: 28.9784 },
      status: 'critical',
      shipments: 18,
      avgDelay: '52.1 hours',
      congestionLevel: 'high',
      color: '#dc2626'
    },
    {
      id: 'route-004',
      name: 'Asia-Europe Express',
      origin: { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
      destination: { name: 'Rotterdam, Netherlands', lat: 51.9244, lng: 4.4777 },
      status: 'active',
      shipments: 67,
      avgDelay: '1.2 hours',
      congestionLevel: 'low',
      color: '#059669'
    },
    {
      id: 'route-005',
      name: 'Pacific Gateway',
      origin: { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
      destination: { name: 'Seattle, USA', lat: 47.6062, lng: -122.3321 },
      status: 'active',
      shipments: 29,
      avgDelay: '4.7 hours',
      congestionLevel: 'low',
      color: '#059669'
    }
  ];

  // Mock port congestion data
  const portCongestion = [
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737, level: 'low', waitTime: '2.3 hours', vessels: 23 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, level: 'high', waitTime: '18.5 hours', vessels: 67 },
    { name: 'Hamburg', lat: 53.5511, lng: 9.9937, level: 'medium', waitTime: '8.2 hours', vessels: 34 },
    { name: 'Singapore', lat: 1.3521, lng: 103.8198, level: 'low', waitTime: '1.8 hours', vessels: 19 },
    { name: 'Rotterdam', lat: 51.9244, lng: 4.4777, level: 'medium', waitTime: '12.1 hours', vessels: 45 }
  ];

  // Mock vessel positions
  const vesselPositions = [
    { id: 'vessel-001', name: 'MSC Gülsün', lat: 25.2048, lng: 55.2708, status: 'in-transit', route: 'route-001' },
    { id: 'vessel-002', name: 'Ever Given', lat: 40.7589, lng: -73.9851, status: 'docked', route: 'route-002' },
    { id: 'vessel-003', name: 'OOCL Hong Kong', lat: 35.6762, lng: 139.6503, status: 'loading', route: 'route-005' },
    { id: 'vessel-004', name: 'Madrid Maersk', lat: 51.9244, lng: 4.4777, status: 'unloading', route: 'route-004' }
  ];

  const mapViewOptions = [
    { value: 'routes', label: 'Shipping Routes', icon: 'Route' },
    { value: 'congestion', label: 'Port Congestion', icon: 'AlertCircle' },
    { value: 'vessels', label: 'Live Vessels', icon: 'Ship' }
  ];

  const getCongestionColor = (level) => {
    switch (level) {
      case 'low': return '#059669';
      case 'medium': return '#d97706';
      case 'high': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'delayed': return '#d97706';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const handleRouteSelect = (route) => {
    setSelectedRoute(route);
    if (onShipmentSelect) {
      onShipmentSelect({
        id: route.id,
        type: 'route',
        name: route.name,
        status: route.status
      });
    }
  };

  return (
    <div className="card p-6 h-[600px] flex flex-col">
      {/* Map Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Global Shipping Operations</h2>
          <p className="text-sm text-text-secondary">Real-time route and vessel tracking</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Map View Selector */}
          <div className="flex items-center space-x-1 bg-surface-50 rounded-lg p-1">
            {mapViewOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setMapView(option.value)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150
                  ${mapView === option.value 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-text-secondary hover:text-primary hover:bg-surface'
                  }
                `}
              >
                <Icon name={option.icon} size={16} />
                <span className="hidden lg:inline">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Animation Speed Control */}
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-text-secondary" />
            <select
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(e.target.value)}
              className="text-sm border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-surface-50 rounded-lg border border-border overflow-hidden">
        {/* Google Maps Iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Global Shipping Operations Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=25.2048,55.2708&z=2&output=embed"
          className="absolute inset-0"
        />

        {/* Map Overlay Controls */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-surface/90 backdrop-blur-sm rounded-lg p-3 border border-border shadow-sm">
            <div className="text-xs font-medium text-text-primary mb-2">Legend</div>
            {mapView === 'routes' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-xs text-text-secondary">Active Routes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-xs text-text-secondary">Delayed Routes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-xs text-text-secondary">Critical Delays</span>
                </div>
              </div>
            )}
            {mapView === 'congestion' && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full"></div>
                  <span className="text-xs text-text-secondary">Low Congestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-xs text-text-secondary">Medium Congestion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-xs text-text-secondary">High Congestion</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Route Information Panel */}
        {selectedRoute && (
          <div className="absolute bottom-4 left-4 right-4 bg-surface/95 backdrop-blur-sm rounded-lg p-4 border border-border shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-text-primary">{selectedRoute.name}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRoute.status === 'active' ? 'bg-success-50 text-success-700' :
                    selectedRoute.status === 'delayed'? 'bg-warning-50 text-warning-700' : 'bg-error-50 text-error-700'
                  }`}>
                    {selectedRoute.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-text-secondary">Origin</div>
                    <div className="font-medium text-text-primary">{selectedRoute.origin.name}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Destination</div>
                    <div className="font-medium text-text-primary">{selectedRoute.destination.name}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Active Shipments</div>
                    <div className="font-medium text-text-primary">{selectedRoute.shipments}</div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Avg Delay</div>
                    <div className="font-medium text-text-primary">{selectedRoute.avgDelay}</div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedRoute(null)}
                className="p-1 text-text-secondary hover:text-text-primary"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {mapView === 'routes' ? shippingRoutes.length : 
             mapView === 'congestion' ? portCongestion.length : 
             vesselPositions.length}
          </div>
          <div className="text-xs text-text-secondary">
            {mapView === 'routes' ? 'Active Routes' : 
             mapView === 'congestion'? 'Major Ports' : 'Tracked Vessels'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {mapView === 'routes' ? '191' : 
             mapView === 'congestion'? '2.3h' : '847'}
          </div>
          <div className="text-xs text-text-secondary">
            {mapView === 'routes' ? 'Total Shipments' : 
             mapView === 'congestion'? 'Avg Wait Time' : 'Total Containers'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {mapView === 'routes' ? '94.2%' : 
             mapView === 'congestion'? '12' : '23'}
          </div>
          <div className="text-xs text-text-secondary">
            {mapView === 'routes' ? 'On-Time Rate' : 
             mapView === 'congestion'? 'Congested Ports' : 'In Transit'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWorldMap;