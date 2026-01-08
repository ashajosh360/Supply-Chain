import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RouteSelector = ({ 
  routes, 
  carriers, 
  selectedRoutes, 
  selectedCarriers, 
  dateRange, 
  onRouteChange, 
  onCarrierChange, 
  onDateRangeChange 
}) => {
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false);
  const [isCarrierDropdownOpen, setIsCarrierDropdownOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleRouteToggle = (routeId) => {
    if (selectedRoutes.includes(routeId)) {
      onRouteChange(selectedRoutes.filter(id => id !== routeId));
    } else {
      onRouteChange([...selectedRoutes, routeId]);
    }
  };

  const handleCarrierToggle = (carrierId) => {
    if (carrierId === 'all') {
      onCarrierChange(['all']);
    } else {
      const newSelection = selectedCarriers.includes(carrierId)
        ? selectedCarriers.filter(id => id !== carrierId)
        : [...selectedCarriers.filter(id => id !== 'all'), carrierId];
      
      onCarrierChange(newSelection.length === 0 ? ['all'] : newSelection);
    }
  };

  const formatDateRange = () => {
    const start = dateRange.start.toLocaleDateString();
    const end = dateRange.end.toLocaleDateString();
    return `${start} - ${end}`;
  };

  const presetRanges = [
    {
      label: 'Last 30 Days',
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last 90 Days',
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last 6 Months',
      start: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    {
      label: 'Last Year',
      start: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
        {/* Route Selector */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Select Routes ({selectedRoutes.length} selected)
          </label>
          <button
            onClick={() => setIsRouteDropdownOpen(!isRouteDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-200"
          >
            <span className="text-sm text-text-primary">
              {selectedRoutes.length === 0 
                ? 'Select routes...' 
                : `${selectedRoutes.length} route${selectedRoutes.length > 1 ? 's' : ''} selected`
              }
            </span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${isRouteDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isRouteDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-dropdown max-h-64 overflow-y-auto">
              <div className="p-2">
                {routes.map((route) => (
                  <label
                    key={route.id}
                    className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoutes.includes(route.id)}
                      onChange={() => handleRouteToggle(route.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{route.name}</p>
                      <p className="text-xs text-text-secondary">
                        {route.totalShipments} shipments • {route.reliabilityScore}% reliability
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Carrier Filter */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Carrier Filter
          </label>
          <button
            onClick={() => setIsCarrierDropdownOpen(!isCarrierDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-200"
          >
            <span className="text-sm text-text-primary">
              {selectedCarriers.includes('all') 
                ? 'All Carriers' 
                : `${selectedCarriers.length} carrier${selectedCarriers.length > 1 ? 's' : ''}`
              }
            </span>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`transition-transform duration-200 ${isCarrierDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isCarrierDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-dropdown">
              <div className="p-2">
                {carriers.map((carrier) => (
                  <label
                    key={carrier.id}
                    className="flex items-center space-x-3 p-3 hover:bg-surface-50 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCarriers.includes(carrier.id)}
                      onChange={() => handleCarrierToggle(carrier.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-text-primary">{carrier.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Range Picker */}
        <div className="relative flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Date Range
          </label>
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-200"
          >
            <span className="text-sm text-text-primary">{formatDateRange()}</span>
            <Icon name="Calendar" size={16} />
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-lg z-dropdown">
              <div className="p-4">
                <h4 className="text-sm font-medium text-text-primary mb-3">Quick Ranges</h4>
                <div className="space-y-2">
                  {presetRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        onDateRangeChange({ start: range.start, end: range.end });
                        setIsDatePickerOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-surface-50 rounded-md transition-colors duration-200"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Start Date</label>
                      <input
                        type="date"
                        value={dateRange.start.toISOString().split('T')[0]}
                        onChange={(e) => onDateRangeChange({
                          ...dateRange,
                          start: new Date(e.target.value)
                        })}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">End Date</label>
                      <input
                        type="date"
                        value={dateRange.end.toISOString().split('T')[0]}
                        onChange={(e) => onDateRangeChange({
                          ...dateRange,
                          end: new Date(e.target.value)
                        })}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteSelector;