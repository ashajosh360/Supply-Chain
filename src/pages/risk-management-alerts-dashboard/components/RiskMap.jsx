import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RiskMap = ({ alerts, selectedAlert, onAlertSelect }) => {
  const [mapView, setMapView] = useState('global');
  const [showLayers, setShowLayers] = useState({
    weather: true,
    ports: true,
    security: true,
    mechanical: true
  });

  const getSeverityColor = (severity) => {
    const colors = {
      critical: '#dc2626',
      high: '#d97706',
      medium: '#3b82f6',
      low: '#059669'
    };
    return colors[severity] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      weather: 'Cloud',
      port: 'Anchor',
      security: 'Shield',
      mechanical: 'Settings'
    };
    return icons[category] || 'AlertTriangle';
  };

  const toggleLayer = (layer) => {
    setShowLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  const filteredAlerts = alerts.filter(alert => {
    const categoryKey = alert.category === 'port' ? 'ports' : alert.category;
    return showLayers[categoryKey];
  });

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Map Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Global Risk Map</h3>
          
          <div className="flex items-center space-x-2">
            <select
              value={mapView}
              onChange={(e) => setMapView(e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface"
            >
              <option value="global">Global View</option>
              <option value="pacific">Pacific Routes</option>
              <option value="atlantic">Atlantic Routes</option>
              <option value="mediterranean">Mediterranean</option>
            </select>
            
            <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
              <Icon name="Maximize2" size={16} />
            </button>
          </div>
        </div>

        {/* Layer Controls */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(showLayers).map(([layer, isVisible]) => {
            const layerConfig = {
              weather: { icon: 'Cloud', label: 'Weather', color: 'text-warning' },
              ports: { icon: 'Anchor', label: 'Ports', color: 'text-secondary' },
              security: { icon: 'Shield', label: 'Security', color: 'text-error' },
              mechanical: { icon: 'Settings', label: 'Mechanical', color: 'text-accent' }
            };
            
            const config = layerConfig[layer];
            
            return (
              <button
                key={layer}
                onClick={() => toggleLayer(layer)}
                className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-all duration-150 ${
                  isVisible 
                    ? `bg-primary-50 ${config.color} border border-primary-200` 
                    : 'bg-surface-100 text-text-secondary hover:bg-surface-200'
                }`}
              >
                <Icon name={config.icon} size={14} />
                <span>{config.label}</span>
                {isVisible && (
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-surface-50">
        {/* Mock World Map with Google Maps iframe */}
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Global Risk Map"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=25.0330,121.5654&z=2&output=embed"
          className="w-full h-full"
        />

        {/* Alert Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          {filteredAlerts.map((alert, index) => {
            const isSelected = selectedAlert?.id === alert.id;
            
            return (
              <div
                key={alert.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `${20 + (index * 15)}%`,
                  top: `${30 + (index * 10)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <button
                  onClick={() => onAlertSelect(alert)}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-white shadow-lg scale-125' 
                      : 'border-white/50 hover:scale-110'
                  }`}
                  style={{ backgroundColor: getSeverityColor(alert.severity) }}
                  title={alert.title}
                >
                  <Icon 
                    name={getCategoryIcon(alert.category)} 
                    size={16} 
                    color="white" 
                  />
                  
                  {/* Pulse animation for critical alerts */}
                  {alert.severity === 'critical' && (
                    <div 
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ backgroundColor: getSeverityColor(alert.severity) }}
                    />
                  )}
                </button>

                {/* Alert tooltip */}
                {isSelected && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg p-3 z-10">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-text-primary text-sm">
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        alert.severity === 'critical' ? 'bg-error-50 text-error-700' :
                        alert.severity === 'high' ? 'bg-warning-50 text-warning-700' :
                        alert.severity === 'medium'? 'bg-secondary-50 text-secondary-700' : 'bg-success-50 text-success-700'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-xs text-text-secondary mb-2">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">
                        {alert.affectedShipments} shipments affected
                      </span>
                      <span className="text-text-secondary">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-surface border border-border rounded-lg p-3 shadow-sm">
          <h4 className="text-sm font-medium text-text-primary mb-2">Risk Levels</h4>
          <div className="space-y-1">
            {[
              { severity: 'critical', label: 'Critical', color: '#dc2626' },
              { severity: 'high', label: 'High', color: '#d97706' },
              { severity: 'medium', label: 'Medium', color: '#3b82f6' },
              { severity: 'low', label: 'Low', color: '#059669' }
            ].map(item => (
              <div key={item.severity} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150">
            <Icon name="Plus" size={16} />
          </button>
          <button className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150">
            <Icon name="Minus" size={16} />
          </button>
          <button className="w-8 h-8 bg-surface border border-border rounded flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary-50 transition-colors duration-150">
            <Icon name="RotateCcw" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskMap;