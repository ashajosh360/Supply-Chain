import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ShipmentDetailPanel = ({ shipment, onClose }) => {
  const [activeTab, setActiveTab] = useState('timeline');

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Transit': return 'bg-secondary-50 text-secondary-700 border-secondary-100';
      case 'Delayed': return 'bg-warning-50 text-warning-700 border-warning-100';
      case 'At Port': return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'Critical Delay': return 'bg-error-50 text-error-700 border-error-100';
      case 'Delivered': return 'bg-success-50 text-success-700 border-success-100';
      default: return 'bg-surface-50 text-text-secondary border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-error-50 text-error-700 border-error-100';
      case 'medium': return 'bg-warning-50 text-warning-700 border-warning-100';
      case 'low': return 'bg-success-50 text-success-700 border-success-100';
      default: return 'bg-surface-50 text-text-secondary border-border';
    }
  };

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: 'Clock' },
    { id: 'location', label: 'Location', icon: 'MapPin' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'details', label: 'Details', icon: 'Info' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg shadow-lg animate-slide-down">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Package" size={24} className="text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary font-mono">
                {shipment.trackingId}
              </h2>
              <p className="text-sm text-text-secondary">
                {shipment.customer} • {shipment.carrier}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(shipment.currentStatus)}`}>
              {shipment.currentStatus}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(shipment.priority)}`}>
              {shipment.priority.charAt(0).toUpperCase() + shipment.priority.slice(1)} Priority
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
            <Icon name="Share2" size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
            <Icon name="Download" size={18} />
          </button>
          <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150">
            <Icon name="Bell" size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>

      {/* Quick Info */}
      <div className="p-6 bg-surface-50 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Origin</p>
            <p className="text-sm font-medium text-text-primary">{shipment.origin}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Destination</p>
            <p className="text-sm font-medium text-text-primary">{shipment.destination}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">ETA</p>
            <p className="text-sm font-medium text-text-primary">{formatDate(shipment.eta)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-1">Current Location</p>
            <p className="text-sm font-medium text-text-primary">{shipment.currentLocation.port}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 py-4 text-sm font-medium border-b-2 transition-colors duration-150
                ${activeTab === tab.id
                  ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border-dark'
                }
              `}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">Shipment Timeline</h3>
            <div className="relative">
              {shipment.milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex items-start space-x-4 pb-8">
                  {/* Timeline line */}
                  {index < shipment.milestones.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-border"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${milestone.completed 
                      ? milestone.current 
                        ? 'bg-primary border-primary text-white' :'bg-success border-success text-white' :'bg-surface border-border text-text-secondary'
                    }
                  `}>
                    {milestone.completed ? (
                      milestone.current ? (
                        <Icon name="Truck" size={16} />
                      ) : (
                        <Icon name="Check" size={16} />
                      )
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${
                        milestone.completed ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {milestone.status}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {formatDate(milestone.date)}
                      </p>
                    </div>
                    {milestone.current && (
                      <p className="text-xs text-primary mt-1">Current Status</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'location' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">Current Location</h3>
            
            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">Current Position</p>
                  <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="MapPin" size={16} className="text-primary" />
                      <p className="text-sm font-medium text-text-primary">
                        {shipment.currentLocation.port}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {shipment.currentLocation.country}
                    </p>
                    <p className="text-xs text-text-secondary font-mono mt-1">
                      {shipment.currentLocation.lat}°N, {shipment.currentLocation.lng}°E
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-2">Vessel Information</p>
                  <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon name="Ship" size={16} className="text-primary" />
                      <p className="text-sm font-medium text-text-primary">
                        {shipment.vessel}
                      </p>
                    </div>
                    <p className="text-xs text-text-secondary">
                      {shipment.carrier} ({shipment.carrierCode})
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mini Map */}
              <div>
                <p className="text-sm font-medium text-text-secondary mb-2">Location Map</p>
                <div className="bg-surface-50 rounded-lg border border-border-light overflow-hidden" style={{ height: '300px' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    loading="lazy"
                    title={shipment.currentLocation.port}
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${shipment.currentLocation.lat},${shipment.currentLocation.lng}&z=10&output=embed`}>
                  </iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-primary">Shipment Documents</h3>
              <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 transition-colors duration-200">
                <Icon name="Upload" size={16} />
                <span>Upload Document</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shipment.documents.map((doc) => (
                <div key={doc.id} className="bg-surface-50 rounded-lg p-4 border border-border-light hover:border-border-dark transition-colors duration-150">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Icon name="FileText" size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {doc.type} • Uploaded {formatDate(doc.uploadDate)}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-150">
                          View
                        </button>
                        <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-150">
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-text-primary">Shipment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipment Information */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-3">Shipment Information</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Container Type:</span>
                      <span className="text-sm font-medium text-text-primary">{shipment.containerType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Container Count:</span>
                      <span className="text-sm font-medium text-text-primary">{shipment.containerCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Total Weight:</span>
                      <span className="text-sm font-medium text-text-primary">{shipment.weight.toLocaleString()} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Dimensions:</span>
                      <span className="text-sm font-medium text-text-primary">{shipment.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Shipment Value:</span>
                      <span className="text-sm font-medium text-text-primary">{formatCurrency(shipment.value)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline Information */}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-3">Timeline Information</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Departure:</span>
                      <span className="text-sm font-medium text-text-primary">{formatDate(shipment.actualDeparture)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Estimated Arrival:</span>
                      <span className="text-sm font-medium text-text-primary">{formatDate(shipment.estimatedArrival)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-text-secondary">Delay Hours:</span>
                      <span className={`text-sm font-medium ${
                        shipment.delayHours === 0 ? 'text-success' : 
                        shipment.delayHours > 48 ? 'text-error' : 'text-warning'
                      }`}>
                        {shipment.delayHours === 0 ? 'On Time' : `+${shipment.delayHours}h`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Special Notes */}
            <div>
              <p className="text-sm font-medium text-text-secondary mb-3">Special Notes</p>
              <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
                <p className="text-sm text-text-primary whitespace-pre-line">
                  {shipment.notes}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentDetailPanel;