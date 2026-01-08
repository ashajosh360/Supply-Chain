import React from 'react';
import Icon from 'components/AppIcon';

const FilterControls = ({ filters, onFilterChange, alertCount }) => {
  const severityOptions = [
    { value: 'all', label: 'All Severities', color: 'text-text-secondary' },
    { value: 'critical', label: 'Critical', color: 'text-error' },
    { value: 'high', label: 'High', color: 'text-warning' },
    { value: 'medium', label: 'Medium', color: 'text-secondary' },
    { value: 'low', label: 'Low', color: 'text-success' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories', icon: 'Filter' },
    { value: 'weather', label: 'Weather', icon: 'Cloud' },
    { value: 'port', label: 'Port Congestion', icon: 'Anchor' },
    { value: 'security', label: 'Security', icon: 'Shield' },
    { value: 'mechanical', label: 'Mechanical', icon: 'Settings' }
  ];

  const timeframeOptions = [
    { value: '1h', label: 'Last Hour' },
    { value: '6h', label: 'Last 6 Hours' },
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Severity Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-text-primary">Severity:</label>
            <select
              value={filters.severity}
              onChange={(e) => onFilterChange({ severity: e.target.value })}
              className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-text-primary">Category:</label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange({ category: e.target.value })}
              className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Timeframe Filter */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-text-primary">Timeframe:</label>
            <select
              value={filters.timeframe}
              onChange={(e) => onFilterChange({ timeframe: e.target.value })}
              className="px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface"
            >
              {timeframeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Toggle & Alert Count */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-text-primary">Real-time:</label>
            <button
              onClick={() => onFilterChange({ realTime: !filters.realTime })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                filters.realTime ? 'bg-primary' : 'bg-surface-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  filters.realTime ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-md">
            <Icon name="AlertTriangle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              {alertCount} {alertCount === 1 ? 'Alert' : 'Alerts'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.severity !== 'all' || filters.category !== 'all' || filters.timeframe !== '24h') && (
        <div className="mt-4 pt-4 border-t border-border-light">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">Active filters:</span>
            <div className="flex flex-wrap gap-2">
              {filters.severity !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-error-50 text-error-700">
                  Severity: {severityOptions.find(o => o.value === filters.severity)?.label}
                  <button
                    onClick={() => onFilterChange({ severity: 'all' })}
                    className="ml-1 hover:text-error-900"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {filters.category !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary-50 text-secondary-700">
                  Category: {categoryOptions.find(o => o.value === filters.category)?.label}
                  <button
                    onClick={() => onFilterChange({ category: 'all' })}
                    className="ml-1 hover:text-secondary-900"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {filters.timeframe !== '24h' && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-warning-50 text-warning-700">
                  Time: {timeframeOptions.find(o => o.value === filters.timeframe)?.label}
                  <button
                    onClick={() => onFilterChange({ timeframe: '24h' })}
                    className="ml-1 hover:text-warning-900"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;