import React from 'react';
import Icon from 'components/AppIcon';

const ShipmentTable = ({
  shipments,
  selectedShipments,
  onShipmentSelect,
  onBulkSelect,
  sortConfig,
  onSort,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onBulkSelect(shipments.map(s => s.id));
    } else {
      onBulkSelect([]);
    }
  };

  const handleSelectShipment = (shipmentId, e) => {
    e.stopPropagation();
    const newSelected = selectedShipments.includes(shipmentId)
      ? selectedShipments.filter(id => id !== shipmentId)
      : [...selectedShipments, shipmentId];
    onBulkSelect(newSelected);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Transit': return 'bg-secondary-50 text-secondary-700 border-secondary-100';
      case 'Delayed': return 'bg-warning-50 text-warning-700 border-warning-100';
      case 'At Port': return 'bg-primary-50 text-primary-700 border-primary-100';
      case 'Critical Delay': return 'bg-error-50 text-error-700 border-error-100';
      case 'Delivered': return 'bg-success-50 text-success-700 border-success-100';
      default: return 'bg-surface-50 text-text-secondary border-border';
    }
  };

  const getDelayColor = (delayStatus, delayHours) => {
    if (delayHours === 0) return 'text-success';
    if (delayStatus === 'critical') return 'text-error';
    if (delayStatus === 'delayed') return 'text-warning';
    return 'text-text-secondary';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <Icon name="ArrowUpDown" size={14} className="text-text-tertiary" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-primary" />
      : <Icon name="ArrowDown" size={14} className="text-primary" />;
  };

  const isAllSelected = shipments.length > 0 && shipments.every(s => selectedShipments.includes(s.id));
  const isIndeterminate = selectedShipments.length > 0 && !isAllSelected;

  return (
    <div className="overflow-hidden">
      {/* Table Header */}
      <div className="bg-surface-50 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm font-medium text-text-primary">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} shipments
            </p>
            {selectedShipments.length > 0 && (
              <p className="text-sm text-primary">
                {selectedShipments.length} selected
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-text-secondary">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="text-sm border border-border rounded px-2 py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50 border-b border-border">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={handleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary-500"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                onClick={() => onSort('trackingId')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tracking ID</span>
                  {getSortIcon('trackingId')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                onClick={() => onSort('customer')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  {getSortIcon('customer')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Route
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                onClick={() => onSort('currentStatus')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon('currentStatus')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                onClick={() => onSort('eta')}
              >
                <div className="flex items-center space-x-1">
                  <span>ETA</span>
                  {getSortIcon('eta')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Delay
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer hover:bg-surface-100 transition-colors duration-150"
                onClick={() => onSort('priority')}
              >
                <div className="flex items-center space-x-1">
                  <span>Priority</span>
                  {getSortIcon('priority')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                onClick={() => onShipmentSelect(shipment)}
                className="hover:bg-surface-50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedShipments.includes(shipment.id)}
                    onChange={(e) => handleSelectShipment(shipment.id, e)}
                    className="rounded border-border text-primary focus:ring-primary-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <Icon name="Package" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary font-mono">
                        {shipment.trackingId}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {shipment.carrier}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {shipment.customer}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {shipment.customerCode}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm">
                      <p className="text-text-primary">{shipment.origin}</p>
                      <div className="flex items-center space-x-1 text-text-secondary">
                        <Icon name="ArrowRight" size={12} />
                        <span className="text-xs">{shipment.destination}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(shipment.currentStatus)}`}>
                    {shipment.currentStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-text-primary font-medium">
                      {formatDate(shipment.eta)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {shipment.currentLocation.port}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium ${getDelayColor(shipment.delayStatus, shipment.delayHours)}`}>
                    {shipment.delayHours === 0 ? (
                      <div className="flex items-center space-x-1">
                        <Icon name="CheckCircle" size={14} />
                        <span>On Time</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>+{shipment.delayHours}h</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-medium ${getPriorityColor(shipment.priority)}`}>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        shipment.priority === 'high' ? 'bg-error' :
                        shipment.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}></div>
                      <span className="capitalize">{shipment.priority}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="text-text-primary font-medium">
                      {formatCurrency(shipment.value)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {shipment.containerCount} containers
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShipmentSelect(shipment);
                      }}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-150"
                      title="View details"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-150"
                      title="Share tracking"
                    >
                      <Icon name="Share2" size={16} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-text-secondary hover:text-primary transition-colors duration-150"
                      title="More options"
                    >
                      <Icon name="MoreHorizontal" size={16} />
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
        <div className="bg-surface border-t border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                <Icon name="ChevronLeft" size={16} />
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`
                        px-3 py-1 text-sm rounded transition-colors duration-150
                        ${currentPage === pageNum
                          ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-primary-50'
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-text-secondary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
              >
                <Icon name="ChevronRight" size={16} />
              </button>
            </div>
            
            <p className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipmentTable;