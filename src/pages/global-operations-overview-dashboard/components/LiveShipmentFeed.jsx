import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const LiveShipmentFeed = ({ selectedShipment, onShipmentSelect, lastUpdate }) => {
  const [filter, setFilter] = useState('all');
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Mock live shipment updates
  const shipmentUpdates = [
    {
      id: 'update-001',
      shipmentId: 'SH-2024-001847',
      type: 'milestone',
      title: 'Container Loaded',
      description: 'Container MSKU-7834521 loaded onto MSC Gülsün at Shanghai Port',
      timestamp: new Date(Date.now() - 300000),
      status: 'success',
      location: 'Shanghai, China',
      icon: 'Package',
      priority: 'normal'
    },
    {
      id: 'update-002',
      shipmentId: 'SH-2024-001823',
      type: 'delay',
      title: 'Departure Delayed',
      description: 'Vessel departure delayed by 4 hours due to port congestion',
      timestamp: new Date(Date.now() - 450000),
      status: 'warning',
      location: 'Hamburg, Germany',
      icon: 'Clock',
      priority: 'high',
      impact: '4 hours delay expected'
    },
    {
      id: 'update-003',
      shipmentId: 'SH-2024-001756',
      type: 'arrival',
      title: 'Port Arrival',
      description: 'Ever Given arrived at New York Port - customs clearance initiated',
      timestamp: new Date(Date.now() - 600000),
      status: 'success',
      location: 'New York, USA',
      icon: 'MapPin',
      priority: 'normal'
    },
    {
      id: 'update-004',
      shipmentId: 'SH-2024-001892',
      type: 'alert',
      title: 'Weather Alert',
      description: 'Severe weather conditions detected on Pacific route - monitoring closely',
      timestamp: new Date(Date.now() - 900000),
      status: 'error',
      location: 'Pacific Ocean',
      icon: 'CloudRain',
      priority: 'critical',
      impact: 'Potential 12-24h delay'
    },
    {
      id: 'update-005',
      shipmentId: 'SH-2024-001634',
      type: 'milestone',
      title: 'Customs Cleared',
      description: 'All documentation approved - container ready for final delivery',
      timestamp: new Date(Date.now() - 1200000),
      status: 'success',
      location: 'Los Angeles, USA',
      icon: 'CheckCircle',
      priority: 'normal'
    },
    {
      id: 'update-006',
      shipmentId: 'SH-2024-001567',
      type: 'delay',
      title: 'Route Deviation',
      description: 'Vessel rerouted via Suez Canal due to Red Sea security concerns',
      timestamp: new Date(Date.now() - 1500000),
      status: 'warning',
      location: 'Mediterranean Sea',
      icon: 'Navigation',
      priority: 'high',
      impact: '3-5 days additional transit'
    },
    {
      id: 'update-007',
      shipmentId: 'SH-2024-001445',
      type: 'milestone',
      title: 'Loading Complete',
      description: '847 containers loaded successfully - vessel ready for departure',
      timestamp: new Date(Date.now() - 1800000),
      status: 'success',
      location: 'Singapore',
      icon: 'Truck',
      priority: 'normal'
    },
    {
      id: 'update-008',
      shipmentId: 'SH-2024-001398',
      type: 'alert',
      title: 'Port Strike Alert',
      description: 'Labor strike announced at Rotterdam Port - operations may be affected',
      timestamp: new Date(Date.now() - 2100000),
      status: 'error',
      location: 'Rotterdam, Netherlands',
      icon: 'AlertTriangle',
      priority: 'critical',
      impact: 'Potential service disruption'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Updates', icon: 'List' },
    { value: 'milestone', label: 'Milestones', icon: 'CheckCircle' },
    { value: 'delay', label: 'Delays', icon: 'Clock' },
    { value: 'alert', label: 'Alerts', icon: 'AlertTriangle' },
    { value: 'arrival', label: 'Arrivals', icon: 'MapPin' }
  ];

  const filteredUpdates = filter === 'all' 
    ? shipmentUpdates 
    : shipmentUpdates.filter(update => update.type === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'success': return 'bg-success-50 border-success-100';
      case 'warning': return 'bg-warning-50 border-warning-100';
      case 'error': return 'bg-error-50 border-error-100';
      default: return 'bg-surface-50 border-border';
    }
  };

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error w-2 h-2';
      case 'high': return 'bg-warning w-2 h-2';
      case 'normal': return 'bg-success w-1.5 h-1.5';
      default: return 'bg-text-tertiary w-1 h-1';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return timestamp.toLocaleDateString();
  };

  const handleUpdateSelect = (update) => {
    if (onShipmentSelect) {
      onShipmentSelect({
        id: update.shipmentId,
        type: 'shipment',
        name: update.title,
        status: update.status,
        location: update.location
      });
    }
  };

  return (
    <div className="card p-6 h-[600px] flex flex-col">
      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Live Shipment Feed</h2>
          <p className="text-sm text-text-secondary">Real-time updates and alerts</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Auto-scroll toggle */}
          <button
            onClick={() => setIsAutoScroll(!isAutoScroll)}
            className={`p-2 rounded-md transition-colors duration-150 ${
              isAutoScroll 
                ? 'bg-primary-50 text-primary' :'text-text-secondary hover:bg-surface-50'
            }`}
            title={isAutoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            <Icon name={isAutoScroll ? 'Pause' : 'Play'} size={16} />
          </button>
          
          {/* Last update indicator */}
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>Updated {formatTimestamp(lastUpdate)}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1 mb-4 overflow-x-auto">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-150
              ${filter === option.value 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-text-secondary hover:text-primary hover:bg-primary-50'
              }
            `}
          >
            <Icon name={option.icon} size={14} />
            <span>{option.label}</span>
            {option.value !== 'all' && (
              <span className={`
                px-1.5 py-0.5 rounded-full text-xs font-medium
                ${filter === option.value 
                  ? 'bg-white/20 text-white' :'bg-surface-100 text-text-tertiary'
                }
              `}>
                {shipmentUpdates.filter(u => u.type === option.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Updates List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {filteredUpdates.map((update) => (
          <div
            key={update.id}
            onClick={() => handleUpdateSelect(update)}
            className={`
              p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-sm
              ${getStatusBg(update.status)}
              ${selectedShipment?.id === update.shipmentId ? 'ring-2 ring-primary-500' : ''}
            `}
          >
            {/* Update Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  update.status === 'success' ? 'bg-success-100' :
                  update.status === 'warning'? 'bg-warning-100' : 'bg-error-100'
                }`}>
                  <Icon name={update.icon} size={16} className={getStatusColor(update.status)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-text-primary text-sm">{update.title}</h3>
                    <div className={`rounded-full ${getPriorityIndicator(update.priority)}`}></div>
                  </div>
                  <p className="text-xs text-text-secondary">{update.shipmentId}</p>
                </div>
              </div>
              <div className="text-xs text-text-tertiary">
                {formatTimestamp(update.timestamp)}
              </div>
            </div>

            {/* Update Description */}
            <p className="text-sm text-text-secondary mb-3 leading-relaxed">
              {update.description}
            </p>

            {/* Update Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-text-tertiary">
                <Icon name="MapPin" size={12} />
                <span>{update.location}</span>
              </div>
              
              {update.impact && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  update.priority === 'critical' ? 'bg-error-100 text-error-700' :
                  update.priority === 'high'? 'bg-warning-100 text-warning-700' : 'bg-primary-100 text-primary-700'
                }`}>
                  {update.impact}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Feed Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {shipmentUpdates.filter(u => u.type === 'milestone').length}
          </div>
          <div className="text-xs text-text-secondary">Milestones</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-warning">
            {shipmentUpdates.filter(u => u.type === 'delay').length}
          </div>
          <div className="text-xs text-text-secondary">Delays</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-error">
            {shipmentUpdates.filter(u => u.priority === 'critical').length}
          </div>
          <div className="text-xs text-text-secondary">Critical</div>
        </div>
      </div>
    </div>
  );
};

export default LiveShipmentFeed;