import React, { useState, useMemo } from 'react';
import Icon from 'components/AppIcon';

const ActiveShipmentsTable = ({ selectedShipment, onShipmentSelect, timeRange }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'eta', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock active shipments data
  const activeShipments = [
    {
      id: 'SH-2024-001847',
      trackingId: 'MSKU-7834521',
      route: 'Shanghai → Los Angeles',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      vessel: 'MSC Gülsün',
      eta: new Date('2024-12-28T14:30:00'),
      status: 'in-transit',
      progress: 65,
      delay: 0,
      priority: 'high',
      containerCount: 1,
      lastUpdate: new Date(Date.now() - 300000)
    },
    {
      id: 'SH-2024-001823',
      trackingId: 'HMMU-9876543',
      route: 'Hamburg → New York',
      origin: 'Hamburg, Germany',
      destination: 'New York, USA',
      vessel: 'Ever Given',
      eta: new Date('2024-12-30T09:15:00'),
      status: 'delayed',
      progress: 45,
      delay: 18.5,
      priority: 'critical',
      containerCount: 3,
      lastUpdate: new Date(Date.now() - 450000)
    },
    {
      id: 'SH-2024-001756',
      trackingId: 'NYKU-4567890',
      route: 'New York → Hamburg',
      origin: 'New York, USA',
      destination: 'Hamburg, Germany',
      vessel: 'Madrid Maersk',
      eta: new Date('2024-12-29T16:45:00'),
      status: 'on-time',
      progress: 78,
      delay: 0,
      priority: 'normal',
      containerCount: 2,
      lastUpdate: new Date(Date.now() - 600000)
    },
    {
      id: 'SH-2024-001892',
      trackingId: 'SGPU-1234567',
      route: 'Singapore → Rotterdam',
      origin: 'Singapore',
      destination: 'Rotterdam, Netherlands',
      vessel: 'OOCL Hong Kong',
      eta: new Date('2025-01-02T11:20:00'),
      status: 'weather-delay',
      progress: 32,
      delay: 24,
      priority: 'high',
      containerCount: 4,
      lastUpdate: new Date(Date.now() - 900000)
    },
    {
      id: 'SH-2024-001634',
      trackingId: 'LACU-8901234',
      route: 'Los Angeles → Tokyo',
      origin: 'Los Angeles, USA',
      destination: 'Tokyo, Japan',
      vessel: 'CMA CGM Marco Polo',
      eta: new Date('2024-12-31T08:30:00'),
      status: 'customs',
      progress: 85,
      delay: 0,
      priority: 'normal',
      containerCount: 1,
      lastUpdate: new Date(Date.now() - 1200000)
    },
    {
      id: 'SH-2024-001567',
      trackingId: 'MEDU-5678901',
      route: 'Barcelona → Istanbul',
      origin: 'Barcelona, Spain',
      destination: 'Istanbul, Turkey',
      vessel: 'MSC Mediterranean',
      eta: new Date('2025-01-03T13:45:00'),
      status: 'critical-delay',
      progress: 25,
      delay: 52.1,
      priority: 'critical',
      containerCount: 2,
      lastUpdate: new Date(Date.now() - 1500000)
    },
    {
      id: 'SH-2024-001445',
      trackingId: 'SGRU-2345678',
      route: 'Singapore → Los Angeles',
      origin: 'Singapore',
      destination: 'Los Angeles, USA',
      vessel: 'Evergreen Ever Ace',
      eta: new Date('2025-01-01T19:15:00'),
      status: 'loading',
      progress: 5,
      delay: 0,
      priority: 'normal',
      containerCount: 6,
      lastUpdate: new Date(Date.now() - 1800000)
    },
    {
      id: 'SH-2024-001398',
      trackingId: 'ROTU-3456789',
      route: 'Rotterdam → Shanghai',
      origin: 'Rotterdam, Netherlands',
      destination: 'Shanghai, China',
      vessel: 'COSCO Shipping Universe',
      eta: new Date('2025-01-04T07:00:00'),
      status: 'port-congestion',
      progress: 12,
      delay: 8.2,
      priority: 'high',
      containerCount: 3,
      lastUpdate: new Date(Date.now() - 2100000)
    }
  ];

  const statusConfig = {
    'in-transit': { label: 'In Transit', color: 'text-primary', bg: 'bg-primary-50', icon: 'Ship' },
    'delayed': { label: 'Delayed', color: 'text-warning', bg: 'bg-warning-50', icon: 'Clock' },
    'on-time': { label: 'On Time', color: 'text-success', bg: 'bg-success-50', icon: 'CheckCircle' },
    'weather-delay': { label: 'Weather Delay', color: 'text-error', bg: 'bg-error-50', icon: 'CloudRain' },
    'customs': { label: 'Customs', color: 'text-secondary', bg: 'bg-secondary-50', icon: 'FileText' },
    'critical-delay': { label: 'Critical Delay', color: 'text-error', bg: 'bg-error-50', icon: 'AlertTriangle' },
    'loading': { label: 'Loading', color: 'text-accent', bg: 'bg-accent-50', icon: 'Package' },
    'port-congestion': { label: 'Port Congestion', color: 'text-warning', bg: 'bg-warning-50', icon: 'AlertCircle' }
  };

  const priorityConfig = {
    'normal': { label: 'Normal', color: 'text-text-secondary', indicator: 'bg-text-tertiary' },
    'high': { label: 'High', color: 'text-warning', indicator: 'bg-warning' },
    'critical': { label: 'Critical', color: 'text-error', indicator: 'bg-error' }
  };

  // Filter and search logic
  const filteredShipments = useMemo(() => {
    return activeShipments.filter(shipment => {
      const matchesSearch = searchQuery === '' || 
        shipment.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.vessel.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [searchQuery]);

  // Sorting logic
  const sortedShipments = useMemo(() => {
    const sorted = [...filteredShipments].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'eta' || sortConfig.key === 'lastUpdate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredShipments, sortConfig]);

  // Pagination logic
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedShipments.slice(startIndex, startIndex + pageSize);
  }, [sortedShipments, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedShipments.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleShipmentSelect = (shipment) => {
    if (onShipmentSelect) {
      onShipmentSelect({
        id: shipment.id,
        type: 'shipment',
        name: shipment.trackingId,
        status: shipment.status,
        route: shipment.route
      });
    }
  };

  const formatETA = (eta) => {
    return eta.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLastUpdate = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="card p-6">
      {/* Table Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">Active Shipments</h2>
          <p className="text-sm text-text-secondary">
            {sortedShipments.length} shipments • Updated {formatLastUpdate(new Date())}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Page Size Selector */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('trackingId')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Tracking ID</span>
                  <Icon name={getSortIcon('trackingId')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('route')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Route</span>
                  <Icon name={getSortIcon('route')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('vessel')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Vessel</span>
                  <Icon name={getSortIcon('vessel')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('eta')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>ETA</span>
                  <Icon name={getSortIcon('eta')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Status</span>
                  <Icon name={getSortIcon('status')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('progress')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Progress</span>
                  <Icon name={getSortIcon('progress')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">
                <button
                  onClick={() => handleSort('delay')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary"
                >
                  <span>Delay</span>
                  <Icon name={getSortIcon('delay')} size={14} />
                </button>
              </th>
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedShipments.map((shipment) => (
              <tr
                key={shipment.id}
                onClick={() => handleShipmentSelect(shipment)}
                className={`
                  border-b border-border-light hover:bg-surface-50 cursor-pointer transition-colors duration-150
                  ${selectedShipment?.id === shipment.id ? 'bg-primary-50 border-primary-200' : ''}
                `}
              >
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-8 rounded-full ${priorityConfig[shipment.priority].indicator}`}></div>
                    <div>
                      <div className="font-medium text-text-primary">{shipment.trackingId}</div>
                      <div className="text-xs text-text-secondary">{shipment.id}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-text-primary">{shipment.route}</div>
                  <div className="text-xs text-text-secondary">{shipment.containerCount} container{shipment.containerCount > 1 ? 's' : ''}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-text-primary">{shipment.vessel}</div>
                  <div className="text-xs text-text-secondary">Updated {formatLastUpdate(shipment.lastUpdate)}</div>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-text-primary">{formatETA(shipment.eta)}</div>
                  {shipment.delay > 0 && (
                    <div className="text-xs text-error">+{shipment.delay}h delay</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[shipment.status].bg} ${statusConfig[shipment.status].color}`}>
                    <Icon name={statusConfig[shipment.status].icon} size={12} />
                    <span>{statusConfig[shipment.status].label}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-surface-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          shipment.progress >= 80 ? 'bg-success' :
                          shipment.progress >= 50 ? 'bg-primary': 'bg-warning'
                        }`}
                        style={{ width: `${shipment.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-text-secondary w-8">{shipment.progress}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {shipment.delay > 0 ? (
                    <div className="text-sm text-error font-medium">+{shipment.delay}h</div>
                  ) : (
                    <div className="text-sm text-success font-medium">On time</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShipmentSelect(shipment);
                      }}
                      className="p-1 text-text-secondary hover:text-primary"
                      title="View details"
                    >
                      <Icon name="Eye" size={16} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-text-secondary hover:text-primary"
                      title="Track shipment"
                    >
                      <Icon name="MapPin" size={16} />
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
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedShipments.length)} of {sortedShipments.length} shipments
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-border rounded-md hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`
                      px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                      ${currentPage === page 
                        ? 'bg-primary text-white' :'text-text-secondary hover:text-primary hover:bg-surface-50'
                      }
                    `}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-border rounded-md hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveShipmentsTable;