import React from 'react';
import Icon from 'components/AppIcon';

const AlertQueue = ({ alerts, selectedAlert, onAlertSelect, onAcknowledge, onEscalate }) => {
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const getSeverityColor = (severity) => {
    const colors = {
      critical: 'bg-error-50 text-error-700 border-error-200',
      high: 'bg-warning-50 text-warning-700 border-warning-200',
      medium: 'bg-secondary-50 text-secondary-700 border-secondary-200',
      low: 'bg-success-50 text-success-700 border-success-200'
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

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="card h-[600px] flex flex-col">
      {/* Queue Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-text-primary">Alert Queue</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {alerts.length} active
            </span>
            <button className="p-1 text-text-secondary hover:text-primary hover:bg-primary-50 rounded transition-colors duration-150">
              <Icon name="RefreshCw" size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Icon name="ArrowDown" size={12} />
          <span>Sorted by severity & time</span>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        {sortedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h4 className="text-lg font-medium text-text-primary mb-2">All Clear</h4>
            <p className="text-sm text-text-secondary">No active alerts matching your filters</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {sortedAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;
              
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark hover:bg-surface-50'
                  }`}
                  onClick={() => onAlertSelect(alert)}
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        alert.severity === 'critical' ? 'bg-error text-white' :
                        alert.severity === 'high' ? 'bg-warning text-white' :
                        alert.severity === 'medium'? 'bg-secondary text-white' : 'bg-success text-white'
                      }`}>
                        <Icon name={getCategoryIcon(alert.category)} size={12} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {alert.title}
                        </h4>
                      </div>
                    </div>

                    {alert.escalated && (
                      <div className="flex items-center space-x-1">
                        <Icon name="ArrowUp" size={12} className="text-error" />
                        <span className="text-xs font-medium text-error">ESC</span>
                      </div>
                    )}
                  </div>

                  {/* Severity Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    
                    <span className="text-xs text-text-secondary">
                      {getTimeAgo(alert.timestamp)}
                    </span>
                  </div>

                  {/* Alert Details */}
                  <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                    {alert.description}
                  </p>

                  {/* Metrics */}
                  <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
                    <span>{alert.affectedShipments} shipments</span>
                    <span>{alert.estimatedDelay}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAcknowledge(alert.id);
                      }}
                      className="flex-1 px-2 py-1 text-xs font-medium text-secondary bg-secondary-50 hover:bg-secondary-100 rounded transition-colors duration-150"
                    >
                      <Icon name="Check" size={12} className="inline mr-1" />
                      Acknowledge
                    </button>
                    
                    {!alert.escalated && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEscalate(alert.id);
                        }}
                        className="flex-1 px-2 py-1 text-xs font-medium text-warning bg-warning-50 hover:bg-warning-100 rounded transition-colors duration-150"
                      >
                        <Icon name="ArrowUp" size={12} className="inline mr-1" />
                        Escalate
                      </button>
                    )}
                  </div>

                  {/* Status Indicator */}
                  {alert.severity === 'critical' && (
                    <div className="mt-2 pt-2 border-t border-border-light">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-error">
                          Requires immediate attention
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Queue Footer */}
      <div className="p-3 border-t border-border bg-surface-50">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>
            {sortedAlerts.filter(a => a.severity === 'critical').length} critical alerts
          </span>
          <button className="text-primary hover:text-primary-700 font-medium">
            View All →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertQueue;