import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const RouteRankingTable = ({ routes, onRouteSelect }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'reliabilityScore', direction: 'desc' });

  const sortedRoutes = [...routes].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc'
    });
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return { icon: 'TrendingUp', color: 'text-success' };
      case 'declining': return { icon: 'TrendingDown', color: 'text-error' };
      default: return { icon: 'Minus', color: 'text-text-secondary' };
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-warning';
    return 'text-error';
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-success-50 text-success-700 border-success-100' };
    if (score >= 80) return { label: 'Good', color: 'bg-warning-50 text-warning-700 border-warning-100' };
    return { label: 'Needs Attention', color: 'bg-error-50 text-error-700 border-error-100' };
  };

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className={`flex items-center space-x-1 text-left font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 ${className}`}
    >
      <span>{label}</span>
      <Icon 
        name={sortConfig.key === sortKey 
          ? (sortConfig.direction === 'desc' ? 'ChevronDown' : 'ChevronUp')
          : 'ChevronsUpDown'
        } 
        size={14} 
      />
    </button>
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Route Performance Ranking</h3>
          <p className="text-sm text-text-secondary">
            Routes ranked by reliability score and efficiency
          </p>
        </div>
        <Icon name="Award" size={20} className="text-primary" />
      </div>

      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 pr-4">
                  <span className="text-sm font-medium text-text-secondary">Rank</span>
                </th>
                <th className="text-left py-3 pr-4">
                  <SortableHeader label="Route" sortKey="name" />
                </th>
                <th className="text-left py-3 pr-4">
                  <SortableHeader label="Score" sortKey="reliabilityScore" />
                </th>
                <th className="text-left py-3">
                  <SortableHeader label="Trend" sortKey="trend" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedRoutes.map((route, index) => {
                const trend = getTrendIcon(route.trend);
                const badge = getPerformanceBadge(route.reliabilityScore);
                
                return (
                  <tr 
                    key={route.id}
                    className="border-b border-border-light last:border-b-0 hover:bg-surface-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => onRouteSelect(route.id)}
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                            index === 1 ? 'bg-gray-100 text-gray-800' : 
                            index === 2 ? 'bg-orange-100 text-orange-800': 'bg-surface-100 text-text-secondary'}
                        `}>
                          {index + 1}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium text-text-primary text-sm">{route.name}</p>
                        <p className="text-xs text-text-secondary mt-1">
                          {route.totalShipments} shipments
                        </p>
                      </div>
                    </td>
                    
                    <td className="py-4 pr-4">
                      <div className="flex flex-col space-y-2">
                        <span className={`text-lg font-bold ${getPerformanceColor(route.reliabilityScore)}`}>
                          {route.reliabilityScore}%
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium border rounded-full ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </td>
                    
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Icon name={trend.icon} size={16} className={trend.color} />
                        <span className={`text-sm font-medium ${trend.color}`}>
                          {route.trend.charAt(0).toUpperCase() + route.trend.slice(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-success">
              {sortedRoutes.filter(r => r.reliabilityScore >= 90).length}
            </p>
            <p className="text-xs text-text-secondary">Excellent Routes</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary">
              {(sortedRoutes.reduce((sum, r) => sum + r.reliabilityScore, 0) / sortedRoutes.length).toFixed(1)}%
            </p>
            <p className="text-xs text-text-secondary">Average Score</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteRankingTable;