import React from 'react';
import Icon from 'components/AppIcon';

const KPIMetricsCards = ({ timeRange }) => {
  const kpiData = [
    {
      id: 'total-shipments',
      title: 'Total Shipments In-Transit',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: 'Package',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary',
      sparklineData: [45, 52, 48, 61, 58, 67, 72, 69, 75, 78, 82, 85],
      subtitle: 'Active shipments worldwide',
      trend: 'up'
    },
    {
      id: 'on-time-delivery',
      title: 'On-Time Delivery Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Clock',
      iconBg: 'bg-success-100',
      iconColor: 'text-success',
      sparklineData: [88, 89, 91, 90, 92, 93, 91, 94, 95, 93, 94, 94],
      subtitle: 'Meeting scheduled ETAs',
      trend: 'up',
      threshold: { value: 90, status: 'good' }
    },
    {
      id: 'avg-transit-time',
      title: 'Average Transit Time',
      value: '14.6 days',
      change: '-0.8 days',
      changeType: 'positive',
      icon: 'Timer',
      iconBg: 'bg-secondary-100',
      iconColor: 'text-secondary',
      sparklineData: [16, 15.8, 15.5, 15.2, 14.9, 14.7, 14.8, 14.6, 14.5, 14.7, 14.6, 14.6],
      subtitle: 'Port to port delivery',
      trend: 'down'
    },
    {
      id: 'critical-delays',
      title: 'Critical Delays (&gt;48h)',
      value: '23',
      change: '+5',
      changeType: 'negative',
      icon: 'AlertTriangle',
      iconBg: 'bg-error-100',
      iconColor: 'text-error',
      sparklineData: [15, 18, 16, 20, 22, 19, 21, 25, 23, 26, 24, 23],
      subtitle: 'Requiring immediate attention',
      trend: 'up',
      threshold: { value: 30, status: 'warning' }
    }
  ];

  const renderSparkline = (data, trend, color) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="ml-auto">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
          className="opacity-80"
        />
      </svg>
    );
  };

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiData.map((kpi) => (
        <div key={kpi.id} className="card p-6 hover-lift">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${kpi.iconBg} rounded-lg flex items-center justify-center`}>
              <Icon name={kpi.icon} size={24} className={kpi.iconColor} />
            </div>
            {kpi.threshold && (
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                kpi.threshold.status === 'good' ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
              }`}>
                Target: {kpi.threshold.value}{kpi.id === 'on-time-delivery' ? '%' : ''}
              </div>
            )}
          </div>

          {/* Title and Subtitle */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-text-secondary mb-1">{kpi.title}</h3>
            <p className="text-xs text-text-tertiary">{kpi.subtitle}</p>
          </div>

          {/* Value and Change */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-text-primary mb-1">{kpi.value}</div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                <Icon name={getChangeIcon(kpi.changeType)} size={14} />
                <span>{kpi.change}</span>
                <span className="text-text-tertiary text-xs">vs last period</span>
              </div>
            </div>
            {renderSparkline(
              kpi.sparklineData, 
              kpi.trend, 
              kpi.changeType === 'positive' ? '#059669' : '#dc2626'
            )}
          </div>

          {/* Time Range Context */}
          <div className="text-xs text-text-tertiary border-t border-border-light pt-3">
            Data for: {timeRange === 'today' ? 'Today' : timeRange === 'last7days' ? 'Last 7 days' : 'Last 30 days'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIMetricsCards;