import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceChart = ({ data, selectedRoutes }) => {
  const [chartView, setChartView] = useState('combined');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartViews = [
    { id: 'combined', label: 'Combined View', icon: 'BarChart3' },
    { id: 'transit', label: 'Transit Time', icon: 'Clock' },
    { id: 'reliability', label: 'Reliability', icon: 'Target' },
    { id: 'delays', label: 'Delays', icon: 'AlertCircle' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg shadow-lg p-4">
          <p className="font-medium text-text-primary mb-2">{`Month: ${label}`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-text-primary">
                {entry.name}: {entry.value}
                {entry.dataKey === 'transitTime' && ' days'}
                {entry.dataKey === 'reliability' && '%'}
                {entry.dataKey === 'delays' && ' incidents'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (chartView) {
      case 'transit':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="transitTime" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Transit Time (days)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'reliability':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="reliability" 
                fill="#059669" 
                name="Reliability Score (%)"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'delays':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="delays" 
                fill="#ea580c" 
                name="Delay Incidents"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#6b7280" />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                yAxisId="right"
                dataKey="delays" 
                fill="#ea580c" 
                name="Delay Incidents"
                radius={[2, 2, 0, 0]}
                opacity={0.7}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="transitTime" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Transit Time (days)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="reliability" 
                stroke="#059669" 
                strokeWidth={3}
                name="Reliability Score (%)"
                dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Performance Trends</h3>
          <p className="text-sm text-text-secondary">
            Transit time and reliability analysis over time
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          {chartViews.map((view) => (
            <button
              key={view.id}
              onClick={() => setChartView(view.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${chartView === view.id 
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                }
              `}
            >
              <Icon name={view.icon} size={16} />
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        {renderChart()}
        
        {/* Chart Overlay Info */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 bg-surface border border-border rounded-lg p-3 shadow-lg">
            <p className="text-sm font-medium text-text-primary">Data Point Details</p>
            <p className="text-xs text-text-secondary mt-1">
              Click on data points for detailed analysis
            </p>
          </div>
        )}
      </div>

      {/* Chart Summary */}
      <div className="mt-6 pt-6 border-t border-border-light">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">14.2</p>
            <p className="text-sm text-text-secondary">Avg Transit Time (days)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">87.5%</p>
            <p className="text-sm text-text-secondary">Avg Reliability Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">12</p>
            <p className="text-sm text-text-secondary">Avg Monthly Delays</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;