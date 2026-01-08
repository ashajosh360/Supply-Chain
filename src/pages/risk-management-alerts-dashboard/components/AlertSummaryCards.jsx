import React from 'react';
import Icon from 'components/AppIcon';

const AlertSummaryCards = ({ summary }) => {
  const cards = [
    {
      title: 'Critical Alerts',
      value: summary.critical,
      icon: 'AlertTriangle',
      color: 'error',
      description: 'Requiring immediate action',
      trend: '+3 from yesterday'
    },
    {
      title: 'Weather Disruptions',
      value: summary.weather,
      icon: 'Cloud',
      color: 'warning',
      description: 'Active weather events',
      trend: '+2 new storms tracked'
    },
    {
      title: 'Port Congestion',
      value: summary.portCongestion,
      icon: 'Anchor',
      color: 'secondary',
      description: 'Ports with delays',
      trend: '-1 from last week'
    },
    {
      title: 'Predicted Delays',
      value: summary.predicted,
      icon: 'Clock',
      color: 'accent',
      description: 'AI-predicted issues',
      trend: '+5 new predictions'
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      error: {
        bg: 'bg-error-50',
        icon: 'bg-error text-white',
        text: 'text-error-700',
        border: 'border-error-200'
      },
      warning: {
        bg: 'bg-warning-50',
        icon: 'bg-warning text-white',
        text: 'text-warning-700',
        border: 'border-warning-200'
      },
      secondary: {
        bg: 'bg-secondary-50',
        icon: 'bg-secondary text-white',
        text: 'text-secondary-700',
        border: 'border-secondary-200'
      },
      accent: {
        bg: 'bg-accent-50',
        icon: 'bg-accent text-white',
        text: 'text-accent-700',
        border: 'border-accent-200'
      }
    };
    return colorMap[color] || colorMap.secondary;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const colors = getColorClasses(card.color);
        
        return (
          <div
            key={index}
            className={`card p-6 ${colors.bg} ${colors.border} border hover-lift transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${colors.icon} rounded-lg flex items-center justify-center`}>
                <Icon name={card.icon} size={24} />
              </div>
              
              {card.color === 'error' && card.value > 0 && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-error">URGENT</span>
                </div>
              )}
            </div>

            <div className="mb-3">
              <h3 className="text-sm font-medium text-text-secondary mb-1">
                {card.title}
              </h3>
              <div className="flex items-baseline space-x-2">
                <span className={`text-3xl font-bold ${colors.text}`}>
                  {card.value}
                </span>
                {card.value > 0 && card.color === 'error' && (
                  <Icon name="TrendingUp" size={16} className="text-error" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-text-secondary">
                {card.description}
              </p>
              <p className="text-xs font-medium text-text-primary">
                {card.trend}
              </p>
            </div>

            {/* Progress indicator for critical alerts */}
            {card.color === 'error' && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>Escalation Level</span>
                  <span>High</span>
                </div>
                <div className="w-full bg-error-100 rounded-full h-2">
                  <div className="bg-error h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AlertSummaryCards;