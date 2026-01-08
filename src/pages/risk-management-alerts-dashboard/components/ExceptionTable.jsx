import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ExceptionTable = ({ shipments, alerts }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'riskLevel', direction: 'desc' });
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectShipment = (shipmentId) => {
    setSelectedShipments(prev => 
      prev.includes(shipmentId)
        ? prev.filter(id => id !== shipmentId)
        : [...prev, shipmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedShipments.length === sortedShipments.length) {
      setSelectedShipments([]);
    } else {
      setSelectedShipments(sortedShipments.map(s => s.id));
    }
  };

  const sortedShipments = [...shipments].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (sortConfig.direction === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const paginatedShipments = sortedShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);

  const getRiskLevelColor = (level) => {
    const colors = {
      critical: 'bg-error-50 text-error-700 border-error-200',
      high: 'bg-warning-50 text-warning-700 border-warning-200',
      medium: 'bg-secondary-50 text-secondary-700 border-secondary-200',
      low: 'bg-success-50 text-success-700 border-success-200'
    };
    return colors[level] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      'at-risk': 'bg-error-50 text-error-700',
      'rerouting': 'bg-warning-50 text-warning-700',
      'delayed': 'bg-warning-50 text-warning-700',
      'in-transit': 'bg-success-50 text-success-700'
    };
    return colors[status] || colors['in-transit'];
  };

  const getAlertTitle = (alertId) => {
    const alert = alerts.find(a => a.id === alertId);
    return alert ? alert.title : 'Unknown Alert';
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on shipments:`, selectedShipments);
    setSelectedShipments([]);
  };

  const exportToCSV = () => {
    const headers = ['Tracking Number', 'Vessel', 'Origin', 'Destination', 'Risk Level', 'Status', 'ETA', 'Estimated Impact'];
    const csvData = [
      headers,
      ...sortedShipments.map(shipment => [
        shipment.trackingNumber,
        shipment.vessel,
        shipment.origin,
        shipment.destination,
        shipment.riskLevel,
        shipment.status,
        shipment.eta,
        shipment.estimatedImpact
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exception-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      {/* Table Header */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Exception Management</h3>
            <p className="text-sm text-text-secondary">
              Shipments affected by active alerts requiring attention
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedShipments.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary">
                  {selectedShipments.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction('reroute')}
                  className="px-3 py-1 text-sm font-medium text-warning bg-warning-50 hover:bg-warning-100 rounded transition-colors duration-150"
                >
                  Bulk Reroute
                </button>
                <button
                  onClick={() => handleBulkAction('notify')}
                  className="px-3 py-1 text-sm font-medium text-secondary bg-secondary-50 hover:bg-secondary-100 rounded transition-colors duration-150"
                >
                  Notify Customers
                </button>
              </div>
            )}
            
            <button
              onClick={exportToCSV}
              className="btn-secondary px-3 py-2 text-sm font-medium rounded flex items-center space-x-2"
            >
              <Icon name="Download" size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedShipments.length === sortedShipments.length && sortedShipments.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary-500"
                />
              </th>
              
              {[
                { key: 'trackingNumber', label: 'Tracking Number' },
                { key: 'vessel', label: 'Vessel' },
                { key: 'origin', label: 'Origin' },
                { key: 'destination', label: 'Destination' },
                { key: 'riskLevel', label: 'Risk Level' },
                { key: 'status', label: 'Status' },
                { key: 'eta', label: 'ETA' },
                { key: 'estimatedImpact', label: 'Impact' }
              ].map(column => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortConfig.key === column.key && (
                      <Icon 
                        name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                        size={14} 
                      />
                    )}
                  </div>
                </th>
              ))}
              
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          <tbody className="bg-surface divide-y divide-border">
            {paginatedShipments.map((shipment) => (
              <tr 
                key={shipment.id}
                className={`hover:bg-surface-50 transition-colors duration-150 ${
                  selectedShipments.includes(shipment.id) ? 'bg-primary-50' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedShipments.includes(shipment.id)}
                    onChange={() => handleSelectShipment(shipment.id)}
                    className="rounded border-border text-primary focus:ring-primary-500"
                  />
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text-primary font-mono">
                      {shipment.trackingNumber}
                    </span>
                    <span className="text-xs text-text-secondary">
                      Alert: {getAlertTitle(shipment.alertId)}
                    </span>
                  </div>
                </td>
                
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{shipment.vessel}</span>
                </td>
                
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{shipment.origin}</span>
                </td>
                
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{shipment.destination}</span>
                </td>
                
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getRiskLevelColor(shipment.riskLevel)}`}>
                    {shipment.riskLevel.toUpperCase()}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(shipment.status)}`}>
                    {shipment.status.replace('-', ' ').toUpperCase()}
                  </span>
                </td>
                
                <td className="px-4 py-4">
                  <span className="text-sm text-text-primary">{shipment.eta}</span>
                </td>
                
                <td className="px-4 py-4">
                  <span className="text-sm text-text-secondary">{shipment.estimatedImpact}</span>
                </td>
                
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 text-text-secondary hover:text-primary hover:bg-primary-50 rounded transition-colors duration-150"
                      title="View details"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button
                      className="p-1 text-text-secondary hover:text-warning hover:bg-warning-50 rounded transition-colors duration-150"
                      title="Reroute"
                    >
                      <Icon name="Route" size={16} />
                    </button>
                    <button
                      className="p-1 text-text-secondary hover:text-secondary hover:bg-secondary-50 rounded transition-colors duration-150"
                      title="Notify customer"
                    >
                      <Icon name="Bell" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedShipments.length)} of {sortedShipments.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-text-secondary bg-surface border border-border rounded hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm font-medium rounded transition-colors duration-150 ${
                      currentPage === page
                        ? 'bg-primary text-white' :'text-text-secondary bg-surface border border-border hover:bg-surface-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-text-secondary bg-surface border border-border rounded hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExceptionTable;