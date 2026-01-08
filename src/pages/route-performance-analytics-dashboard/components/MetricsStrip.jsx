import React from 'react';
import Icon from 'components/AppIcon';

const MetricsStrip = ({ routeData, selectedRoutes }) => {
  // Calculate aggregated metrics for selected routes
  const selectedRouteData = routeData.filter(route => selectedRoutes.includes(route.id));
  
  const calculateMetrics = () => {
    if (selectedRouteData.length === 0) return null;
    
    const totalShipments = selectedRouteData.reduce((sum, route) => sum + route.totalShipments, 0);
    const weightedAvgTransitTime = selectedRouteData.reduce((sum, route) => 
      sum + (route.avgTransitTime * route.totalShipments), 0) / totalShipments;
    const weightedReliabilityScore = selectedRouteData.reduce((sum, route) => 
      sum + (route.reliabilityScore * route.totalShipments), 0) / totalShipments;
    const weightedCostPerMile = selectedRouteData.reduce((sum, route) => 
      sum + (route.costPerMile * route.totalShipments), 0) / totalShipments;
    const weightedDelayFrequency = selectedRouteData.reduce((sum, route) => 
      sum + (route.delayFrequency * route.totalShipments), 0) / totalShipments;

    return {
      avgTransitTime: weightedAvgTransitTime,
      reliabilityScore: weightedReliabilityScore,
      costPerMile: weightedCostPerMile,
      delayFrequency: weightedDelayFrequency
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      title: 'Average Transit Time',
      value: metrics ? `${metrics.avgTransitTime.toFixed(1)} days` : 'N/A',
      change: '+0.3 days',
      changeType: 'negative',
      icon: 'Clock',
      description: 'Weighted average across selected routes'
    },
    {
      title: 'Route Reliability Score',
      value: metrics ? `${metrics.reliabilityScore.toFixed(1)}%` : 'N/A',
      change: '+2.1%',
      changeType: 'positive',
      icon: 'Target',
      description: 'On-time delivery performance'
    },
    {
      title: 'Cost Per Mile',
      value: metrics ? `$${metrics.costPerMile.toFixed(2)}` : 'N/A',
      change: '-$0.05',
      changeType: 'positive',
      icon: 'DollarSign',
      description: 'Average operational cost efficiency'
    },
    {
      title: 'Delay Frequency',
      value: metrics ? `${metrics.delayFrequency.toFixed(1)}%` : 'N/A',
      change: '-1.2%',
      changeType: 'positive',
      icon: 'AlertCircle',
      description: 'Percentage of shipments with delays'
    }
  ];

  const getChangeColor = (changeType) => {
    return changeType === 'positive' ? 'text-success' : 'text-error';
  };

  const getChangeIcon = (changeType) => {
    return changeType === 'positive' ? 'TrendingUp' : 'TrendingDown';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metricCards.map((metric, index) => (
        <div key={index} className="bg-surface border border-border rounded-lg p-6 hover-lift">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name={metric.icon} size={24} className="text-primary" />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
              <Icon name={getChangeIcon(metric.changeType)} size={16} />
              <span className="text-sm font-medium">{metric.change}</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h3 className="text-2xl font-bold text-text-primary mb-1">{metric.value}</h3>
            <p className="text-sm font-medium text-text-primary">{metric.title}</p>
          </div>
          
          <p className="text-xs text-text-secondary">{metric.description}</p>
          
          {/* Period comparison indicator */}
          <div className="mt-3 pt-3 border-t border-border-light">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">vs. last period</span>
              <span className={`font-medium ${getChangeColor(metric.changeType)}`}>
                {metric.changeType === 'positive' ? 'Improved' : 'Declined'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;