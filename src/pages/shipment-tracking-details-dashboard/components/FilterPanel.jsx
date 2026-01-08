import React from 'react';
import Icon from 'components/AppIcon';

const FilterPanel = ({ filters, onFiltersChange, shipments }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      carrier: 'all',
      dateRange: 'all',
      priority: 'all',
      delayStatus: 'all'
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value !== 'all').length;
  };

  // Extract unique values for filter options
  const statusOptions = [...new Set(shipments.map(s => s.statusCode))];
  const carrierOptions = [...new Set(shipments.map(s => s.carrierCode))];
  const priorityOptions = [...new Set(shipments.map(s => s.priority))];

  const statusLabels = {
    'IT': 'In Transit',
    'DL': 'Delayed',
    'AP': 'At Port',
    'CD': 'Critical Delay',
    'DV': 'Delivered'
  };

  const delayStatusLabels = {
    'on-time': 'On Time',
    'delayed': 'Delayed',
    'critical': 'Critical Delay'
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="mt-4 bg-surface border border-border rounded-lg p-4 animate-slide-down">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={18} className="text-primary" />
          <h3 className="text-sm font-medium text-text-primary">Advanced Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-text-secondary hover:text-primary transition-colors duration-150"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Shipment Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {statusLabels[status] || status}
              </option>
            ))}
          </select>
        </div>

        {/* Carrier Filter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Carrier
          </label>
          <select
            value={filters.carrier}
            onChange={(e) => handleFilterChange('carrier', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Carriers</option>
            {carrierOptions.map(carrier => (
              <option key={carrier} value={carrier}>
                {carrier}
              </option>
            ))}
          </select>
        </div>

        {/* Delay Status Filter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Delay Status
          </label>
          <select
            value={filters.delayStatus}
            onChange={(e) => handleFilterChange('delayStatus', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Delays</option>
            <option value="on-time">On Time</option>
            <option value="delayed">Delayed</option>
            <option value="critical">Critical Delay</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            {priorityOptions.map(priority => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-2">
            Date Range
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Dates</option>
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Chips */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-medium text-text-secondary mb-2">Quick Filters:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('delayStatus', 'critical')}
            className={`
              px-3 py-1 text-xs rounded-full border transition-colors duration-150
              ${filters.delayStatus === 'critical' ?'bg-error text-white border-error' :'bg-error-50 text-error-700 border-error-100 hover:bg-error-100'
              }
            `}
          >
            Critical Delays
          </button>
          <button
            onClick={() => handleFilterChange('status', 'IT')}
            className={`
              px-3 py-1 text-xs rounded-full border transition-colors duration-150
              ${filters.status === 'IT' ?'bg-secondary text-white border-secondary' :'bg-secondary-50 text-secondary-600 border-secondary-100 hover:bg-secondary-100'
              }
            `}
          >
            In Transit
          </button>
          <button
            onClick={() => handleFilterChange('priority', 'high')}
            className={`
              px-3 py-1 text-xs rounded-full border transition-colors duration-150
              ${filters.priority === 'high' ?'bg-accent text-white border-accent' :'bg-accent-50 text-accent-700 border-accent-100 hover:bg-accent-100'
              }
            `}
          >
            High Priority
          </button>
          <button
            onClick={() => handleFilterChange('dateRange', '7')}
            className={`
              px-3 py-1 text-xs rounded-full border transition-colors duration-150
              ${filters.dateRange === '7' ?'bg-primary text-white border-primary' :'bg-primary-50 text-primary-700 border-primary-100 hover:bg-primary-100'
              }
            `}
          >
            Recent
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;