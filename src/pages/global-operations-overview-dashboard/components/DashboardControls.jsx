import React, { useState, useRef, useEffect } from 'react';
import Icon from 'components/AppIcon';

const DashboardControls = ({
  selectedTimeRange,
  onTimeRangeChange,
  autoRefreshInterval,
  onRefreshIntervalChange,
  selectedTimezone,
  onTimezoneChange,
  connectionStatus,
  lastUpdate
}) => {
  const [isTimeRangeOpen, setIsTimeRangeOpen] = useState(false);
  const [isRefreshOpen, setIsRefreshOpen] = useState(false);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  
  const timeRangeRef = useRef(null);
  const refreshRef = useRef(null);
  const timezoneRef = useRef(null);

  const timeRangeOptions = [
    { value: 'today', label: 'Today', icon: 'Calendar' },
    { value: 'last7days', label: 'Last 7 Days', icon: 'CalendarDays' },
    { value: 'last30days', label: 'Last 30 Days', icon: 'CalendarRange' },
    { value: 'custom', label: 'Custom Range', icon: 'CalendarSearch' }
  ];

  const refreshIntervals = [
    { value: 15, label: '15 seconds', icon: 'Timer' },
    { value: 30, label: '30 seconds', icon: 'Timer' },
    { value: 60, label: '1 minute', icon: 'Clock' },
    { value: 300, label: '5 minutes', icon: 'Clock' }
  ];

  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)', offset: '+00:00' },
    { value: 'EST', label: 'EST (Eastern Standard Time)', offset: '-05:00' },
    { value: 'PST', label: 'PST (Pacific Standard Time)', offset: '-08:00' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)', offset: '+00:00' },
    { value: 'CET', label: 'CET (Central European Time)', offset: '+01:00' },
    { value: 'JST', label: 'JST (Japan Standard Time)', offset: '+09:00' },
    { value: 'AEST', label: 'AEST (Australian Eastern Time)', offset: '+10:00' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeRangeRef.current && !timeRangeRef.current.contains(event.target)) {
        setIsTimeRangeOpen(false);
      }
      if (refreshRef.current && !refreshRef.current.contains(event.target)) {
        setIsRefreshOpen(false);
      }
      if (timezoneRef.current && !timezoneRef.current.contains(event.target)) {
        setIsTimezoneOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'WifiOff';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  const formatLastUpdate = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: selectedTimezone === 'UTC' ? 'UTC' : undefined,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-surface border-b border-border px-4 lg:px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Title and Status */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Global Operations Overview</h1>
            <p className="text-sm text-text-secondary">Real-time logistics command center</p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-3 px-3 py-2 bg-surface-50 rounded-lg border border-border-light">
            <Icon 
              name={getStatusIcon()} 
              size={16} 
              className={`${getStatusColor()} ${connectionStatus === 'connecting' ? 'animate-pulse' : ''}`}
            />
            <div className="text-xs">
              <div className={`font-medium ${getStatusColor()}`}>
                {connectionStatus === 'connected' ? 'Live Data' : connectionStatus}
              </div>
              <div className="text-text-secondary">
                Updated {formatLastUpdate(lastUpdate)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Current Time Display */}
          <div className="flex items-center space-x-2 px-3 py-2 bg-primary-50 rounded-lg border border-primary-100">
            <Icon name="Clock" size={16} className="text-primary" />
            <div className="text-sm">
              <div className="font-medium text-primary">{getCurrentTime()}</div>
              <div className="text-xs text-primary-600">{selectedTimezone}</div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="relative" ref={timeRangeRef}>
            <button
              onClick={() => setIsTimeRangeOpen(!isTimeRangeOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-150"
            >
              <Icon name="Calendar" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {timeRangeOptions.find(opt => opt.value === selectedTimeRange)?.label}
              </span>
              <Icon name="ChevronDown" size={14} className={`text-text-secondary transition-transform duration-200 ${isTimeRangeOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTimeRangeOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-dropdown animate-slide-down">
                <div className="py-2">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onTimeRangeChange(option.value);
                        setIsTimeRangeOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors duration-150
                        ${selectedTimeRange === option.value 
                          ? 'bg-primary-50 text-primary font-medium' :'text-text-primary hover:bg-surface-50'
                        }
                      `}
                    >
                      <Icon name={option.icon} size={16} />
                      <span>{option.label}</span>
                      {selectedTimeRange === option.value && (
                        <Icon name="Check" size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Auto Refresh Selector */}
          <div className="relative" ref={refreshRef}>
            <button
              onClick={() => setIsRefreshOpen(!isRefreshOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-150"
            >
              <Icon name="RotateCcw" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">
                {refreshIntervals.find(int => int.value === autoRefreshInterval)?.label}
              </span>
              <Icon name="ChevronDown" size={14} className={`text-text-secondary transition-transform duration-200 ${isRefreshOpen ? 'rotate-180' : ''}`} />
            </button>

            {isRefreshOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-lg shadow-lg z-dropdown animate-slide-down">
                <div className="py-2">
                  {refreshIntervals.map((interval) => (
                    <button
                      key={interval.value}
                      onClick={() => {
                        onRefreshIntervalChange(interval.value);
                        setIsRefreshOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors duration-150
                        ${autoRefreshInterval === interval.value 
                          ? 'bg-primary-50 text-primary font-medium' :'text-text-primary hover:bg-surface-50'
                        }
                      `}
                    >
                      <Icon name={interval.icon} size={16} />
                      <span>{interval.label}</span>
                      {autoRefreshInterval === interval.value && (
                        <Icon name="Check" size={16} className="ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Timezone Selector */}
          <div className="relative" ref={timezoneRef}>
            <button
              onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-surface-50 transition-colors duration-150"
            >
              <Icon name="Globe" size={16} className="text-text-secondary" />
              <span className="text-sm font-medium text-text-primary">{selectedTimezone}</span>
              <Icon name="ChevronDown" size={14} className={`text-text-secondary transition-transform duration-200 ${isTimezoneOpen ? 'rotate-180' : ''}`} />
            </button>

            {isTimezoneOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-lg shadow-lg z-dropdown animate-slide-down max-h-64 overflow-y-auto">
                <div className="py-2">
                  {timezones.map((timezone) => (
                    <button
                      key={timezone.value}
                      onClick={() => {
                        onTimezoneChange(timezone.value);
                        setIsTimezoneOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm transition-colors duration-150
                        ${selectedTimezone === timezone.value 
                          ? 'bg-primary-50 text-primary font-medium' :'text-text-primary hover:bg-surface-50'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span>{timezone.label}</span>
                        <span className="text-xs text-text-secondary">{timezone.offset}</span>
                      </div>
                      {selectedTimezone === timezone.value && (
                        <Icon name="Check" size={16} className="float-right mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;