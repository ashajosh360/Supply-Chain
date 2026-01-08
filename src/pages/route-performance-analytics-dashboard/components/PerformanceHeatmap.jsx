import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const PerformanceHeatmap = ({ data, onRouteClick }) => {
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];
  const weekKeys = ['week1', 'week2', 'week3', 'week4', 'week5'];

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'bg-success text-white';
    if (score >= 80) return 'bg-warning-500 text-white';
    if (score >= 70) return 'bg-accent text-white';
    return 'bg-error text-white';
  };

  const getPerformanceIntensity = (score) => {
    if (score >= 90) return 'bg-success';
    if (score >= 85) return 'bg-success opacity-80';
    if (score >= 80) return 'bg-warning-500';
    if (score >= 75) return 'bg-warning-500 opacity-80';
    if (score >= 70) return 'bg-accent';
    if (score >= 65) return 'bg-accent opacity-80';
    return 'bg-error';
  };

  const calculateWeeklyAverage = (weekKey) => {
    const total = data.reduce((sum, route) => sum + route[weekKey], 0);
    return (total / data.length).toFixed(1);
  };

  const calculateRouteAverage = (route) => {
    const total = weekKeys.reduce((sum, key) => sum + route[key], 0);
    return (total / weekKeys.length).toFixed(1);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Route Performance Heatmap</h3>
          <p className="text-sm text-text-secondary">
            Weekly performance scores across all routes (click routes to filter)
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-text-secondary">Performance:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-error rounded"></div>
              <span className="text-xs text-text-secondary">&lt;70%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-warning-500 rounded"></div>
              <span className="text-xs text-text-secondary">70-89%</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-success rounded"></div>
              <span className="text-xs text-text-secondary">90%+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            <div className="p-3 text-sm font-medium text-text-secondary">Route</div>
            {weeks.map((week, index) => (
              <div 
                key={week}
                className={`
                  p-3 text-center text-sm font-medium rounded-md cursor-pointer transition-colors duration-200
                  ${selectedWeek === index 
                    ? 'bg-primary text-white' :'bg-surface-50 text-text-secondary hover:bg-primary-50 hover:text-primary'
                  }
                `}
                onClick={() => setSelectedWeek(selectedWeek === index ? null : index)}
              >
                {week}
              </div>
            ))}
            <div className="p-3 text-center text-sm font-medium text-text-secondary">Avg</div>
          </div>

          {/* Data Rows */}
          <div className="space-y-2">
            {data.map((route, routeIndex) => (
              <div key={route.route} className="grid grid-cols-7 gap-2">
                {/* Route Name */}
                <div 
                  className="p-3 bg-surface-50 rounded-md cursor-pointer hover:bg-primary-50 transition-colors duration-200"
                  onClick={() => onRouteClick(route.route)}
                >
                  <p className="text-sm font-medium text-text-primary truncate">
                    {route.route.replace('-', ' → ')}
                  </p>
                </div>

                {/* Performance Cells */}
                {weekKeys.map((weekKey, weekIndex) => (
                  <div
                    key={weekKey}
                    className={`
                      p-3 rounded-md cursor-pointer transition-all duration-200 hover:scale-105
                      ${getPerformanceIntensity(route[weekKey])}
                      ${hoveredCell === `${routeIndex}-${weekIndex}` ? 'ring-2 ring-primary ring-offset-2' : ''}
                    `}
                    onMouseEnter={() => setHoveredCell(`${routeIndex}-${weekIndex}`)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => onRouteClick(route.route)}
                  >
                    <div className="text-center">
                      <p className="text-sm font-bold text-white">{route[weekKey]}%</p>
                    </div>
                  </div>
                ))}

                {/* Route Average */}
                <div className="p-3 bg-surface-100 rounded-md">
                  <p className="text-sm font-bold text-text-primary text-center">
                    {calculateRouteAverage(route)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Averages Row */}
          <div className="grid grid-cols-7 gap-2 mt-4 pt-4 border-t border-border-light">
            <div className="p-3 text-sm font-medium text-text-secondary">Weekly Avg</div>
            {weekKeys.map((weekKey, index) => (
              <div key={weekKey} className="p-3 bg-primary-50 rounded-md">
                <p className="text-sm font-bold text-primary text-center">
                  {calculateWeeklyAverage(weekKey)}%
                </p>
              </div>
            ))}
            <div className="p-3 bg-primary rounded-md">
              <p className="text-sm font-bold text-white text-center">
                {(data.reduce((sum, route) => sum + parseFloat(calculateRouteAverage(route)), 0) / data.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Insights */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <Icon name="TrendingUp" size={24} className="text-success mx-auto mb-2" />
            <p className="text-lg font-bold text-success">
              {data.filter(route => 
                weekKeys.every(key => route[key] >= 85)
              ).length}
            </p>
            <p className="text-sm text-success-700">Consistently High Performers</p>
          </div>
          
          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <Icon name="AlertTriangle" size={24} className="text-warning-700 mx-auto mb-2" />
            <p className="text-lg font-bold text-warning-700">
              {data.filter(route => 
                weekKeys.some(key => route[key] < 80)
              ).length}
            </p>
            <p className="text-sm text-warning-700">Routes Needing Attention</p>
          </div>
          
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <Icon name="BarChart3" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-lg font-bold text-primary">
              {Math.max(...data.map(route => 
                Math.max(...weekKeys.map(key => route[key]))
              ))}%
            </p>
            <p className="text-sm text-primary">Best Weekly Performance</p>
          </div>
        </div>
      </div>

      {/* Tooltip for hovered cell */}
      {hoveredCell && (
        <div className="fixed bottom-4 right-4 bg-surface border border-border rounded-lg shadow-lg p-3 z-tooltip">
          <p className="text-sm font-medium text-text-primary">Performance Details</p>
          <p className="text-xs text-text-secondary mt-1">
            Click to view route-specific analytics
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceHeatmap;