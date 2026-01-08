import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';
import SearchHeader from './components/SearchHeader';
import ShipmentTable from './components/ShipmentTable';
import ShipmentDetailPanel from './components/ShipmentDetailPanel';
import FilterPanel from './components/FilterPanel';
import BulkActions from './components/BulkActions';

const ShipmentTrackingDetailsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'trackingId', direction: 'asc' });
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [filters, setFilters] = useState({
    status: 'all',
    carrier: 'all',
    dateRange: 'all',
    priority: 'all',
    delayStatus: 'all'
  });

  // Mock shipment data
  const mockShipments = [
    {
      id: 1,
      trackingId: "MSK-2024-001847",
      customer: "Global Electronics Corp",
      customerCode: "GEC-001",
      origin: "Shanghai, China",
      destination: "Los Angeles, USA",
      currentStatus: "In Transit",
      statusCode: "IT",
      eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      actualDeparture: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      delayHours: 0,
      delayStatus: "on-time",
      carrier: "Maersk Line",
      carrierCode: "MSK",
      vessel: "Maersk Shanghai",
      containerType: "40ft HC",
      containerCount: 3,
      priority: "high",
      currentLocation: {
        lat: 35.6762,
        lng: 139.6503,
        port: "Tokyo Bay",
        country: "Japan"
      },
      milestones: [
        { id: 1, status: "Booking Confirmed", date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), completed: true },
        { id: 2, status: "Container Loaded", date: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000), completed: true },
        { id: 3, status: "Departed Shanghai", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), completed: true },
        { id: 4, status: "In Transit", date: new Date(), completed: true, current: true },
        { id: 5, status: "Arrive LA Port", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), completed: false },
        { id: 6, status: "Container Discharged", date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), completed: false },
        { id: 7, status: "Delivered", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), completed: false }
      ],
      documents: [
        { id: 1, name: "Bill of Lading", type: "BOL", url: "#", uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        { id: 2, name: "Commercial Invoice", type: "INV", url: "#", uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        { id: 3, name: "Packing List", type: "PKL", url: "#", uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
      ],
      notes: `High priority shipment for Global Electronics Corp containing sensitive electronic components. Customer requires daily status updates and immediate notification of any delays exceeding 24 hours.

Special handling instructions: Temperature controlled containers required. Fragile cargo - handle with care during loading/unloading operations.`,
      value: 2850000,
      weight: 45600,
      dimensions: "40ft x 8ft x 9.6ft"
    },
    {
      id: 2,
      trackingId: "COSCO-2024-002156",
      customer: "Automotive Parts Ltd",
      customerCode: "APL-002",
      origin: "Hamburg, Germany",
      destination: "New York, USA",
      currentStatus: "Delayed",
      statusCode: "DL",
      eta: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      actualDeparture: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      estimatedArrival: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      delayHours: 72,
      delayStatus: "delayed",
      carrier: "COSCO Shipping",
      carrierCode: "COSCO",
      vessel: "COSCO Atlantic",
      containerType: "20ft STD",
      containerCount: 2,
      priority: "medium",
      currentLocation: {
        lat: 51.8985,
        lng: -8.4756,
        port: "Cork, Ireland",
        country: "Ireland"
      },
      milestones: [
        { id: 1, status: "Booking Confirmed", date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), completed: true },
        { id: 2, status: "Container Loaded", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), completed: true },
        { id: 3, status: "Departed Hamburg", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), completed: true },
        { id: 4, status: "Weather Delay", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true, current: true },
        { id: 5, status: "Arrive NY Port", date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), completed: false },
        { id: 6, status: "Container Discharged", date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), completed: false },
        { id: 7, status: "Delivered", date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), completed: false }
      ],
      documents: [
        { id: 1, name: "Bill of Lading", type: "BOL", url: "#", uploadDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) },
        { id: 2, name: "Commercial Invoice", type: "INV", url: "#", uploadDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) }
      ],
      notes: `Automotive parts shipment experiencing weather-related delays in North Atlantic. Customer has been notified of revised ETA. Alternative routing being evaluated to minimize further delays.`,
      value: 1250000,
      weight: 28400,
      dimensions: "20ft x 8ft x 8.6ft"
    },
    {
      id: 3,
      trackingId: "EVERGREEN-2024-003421",
      customer: "Fashion Forward Inc",
      customerCode: "FFI-003",
      origin: "Mumbai, India",
      destination: "Rotterdam, Netherlands",
      currentStatus: "At Port",
      statusCode: "AP",
      eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      actualDeparture: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      estimatedArrival: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      delayHours: 0,
      delayStatus: "on-time",
      carrier: "Evergreen Marine",
      carrierCode: "EMC",
      vessel: "Ever Given",
      containerType: "40ft HC",
      containerCount: 5,
      priority: "low",
      currentLocation: {
        lat: 25.2048,
        lng: 55.2708,
        port: "Dubai, UAE",
        country: "United Arab Emirates"
      },
      milestones: [
        { id: 1, status: "Booking Confirmed", date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000), completed: true },
        { id: 2, status: "Container Loaded", date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), completed: true },
        { id: 3, status: "Departed Mumbai", date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), completed: true },
        { id: 4, status: "At Dubai Port", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), completed: true, current: true },
        { id: 5, status: "Arrive Rotterdam", date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), completed: false },
        { id: 6, status: "Container Discharged", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), completed: false },
        { id: 7, status: "Delivered", date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), completed: false }
      ],
      documents: [
        { id: 1, name: "Bill of Lading", type: "BOL", url: "#", uploadDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000) },
        { id: 2, name: "Commercial Invoice", type: "INV", url: "#", uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
        { id: 3, name: "Certificate of Origin", type: "COO", url: "#", uploadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) }
      ],
      notes: `Fashion merchandise shipment currently at Dubai transshipment hub. All containers accounted for and in good condition. Expected to depart for Rotterdam within 24 hours.`,
      value: 890000,
      weight: 52300,
      dimensions: "40ft x 8ft x 9.6ft"
    },
    {
      id: 4,
      trackingId: "HAPAG-2024-004789",
      customer: "Tech Solutions Global",
      customerCode: "TSG-004",
      origin: "Singapore",
      destination: "Vancouver, Canada",
      currentStatus: "Critical Delay",
      statusCode: "CD",
      eta: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      actualDeparture: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      estimatedArrival: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      delayHours: 120,
      delayStatus: "critical",
      carrier: "Hapag-Lloyd",
      carrierCode: "HLCU",
      vessel: "Hamburg Express",
      containerType: "20ft REF",
      containerCount: 1,
      priority: "high",
      currentLocation: {
        lat: 1.3521,
        lng: 103.8198,
        port: "Singapore Port",
        country: "Singapore"
      },
      milestones: [
        { id: 1, status: "Booking Confirmed", date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), completed: true },
        { id: 2, status: "Container Loaded", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), completed: true },
        { id: 3, status: "Mechanical Issue", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), completed: true, current: true },
        { id: 4, status: "Depart Singapore", date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), completed: false },
        { id: 5, status: "Arrive Vancouver", date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), completed: false },
        { id: 6, status: "Container Discharged", date: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), completed: false },
        { id: 7, status: "Delivered", date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), completed: false }
      ],
      documents: [
        { id: 1, name: "Bill of Lading", type: "BOL", url: "#", uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
        { id: 2, name: "Temperature Log", type: "TEMP", url: "#", uploadDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      notes: `URGENT: Refrigerated container with temperature-sensitive technology components. Vessel experiencing mechanical issues requiring extended port stay. Customer escalation in progress. Alternative vessel arrangements being evaluated.`,
      value: 3200000,
      weight: 15200,
      dimensions: "20ft x 8ft x 8.6ft"
    },
    {
      id: 5,
      trackingId: "MSC-2024-005632",
      customer: "Pharmaceutical Dynamics",
      customerCode: "PD-005",
      origin: "Basel, Switzerland",
      destination: "Miami, USA",
      currentStatus: "Delivered",
      statusCode: "DV",
      eta: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      actualDeparture: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      estimatedArrival: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      delayHours: 0,
      delayStatus: "on-time",
      carrier: "MSC",
      carrierCode: "MSC",
      vessel: "MSC Seaside",
      containerType: "20ft REF",
      containerCount: 2,
      priority: "high",
      currentLocation: {
        lat: 25.7617,
        lng: -80.1918,
        port: "Miami Port",
        country: "United States"
      },
      milestones: [
        { id: 1, status: "Booking Confirmed", date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), completed: true },
        { id: 2, status: "Container Loaded", date: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000), completed: true },
        { id: 3, status: "Departed Basel", date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), completed: true },
        { id: 4, status: "In Transit", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), completed: true },
        { id: 5, status: "Arrived Miami", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), completed: true },
        { id: 6, status: "Container Discharged", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true },
        { id: 7, status: "Delivered", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), completed: true, current: true }
      ],
      documents: [
        { id: 1, name: "Bill of Lading", type: "BOL", url: "#", uploadDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000) },
        { id: 2, name: "Pharmaceutical Certificate", type: "PHARM", url: "#", uploadDate: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000) },
        { id: 3, name: "Delivery Receipt", type: "DEL", url: "#", uploadDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
      ],
      notes: `Successfully delivered pharmaceutical shipment maintaining cold chain integrity throughout transit. All temperature logs within acceptable ranges. Customer satisfaction confirmed.`,
      value: 4500000,
      weight: 8900,
      dimensions: "20ft x 8ft x 8.6ft"
    }
  ];

  // Auto-complete suggestions
  const autoCompleteSuggestions = useMemo(() => {
    const suggestions = [];
    mockShipments.forEach(shipment => {
      suggestions.push({
        type: 'tracking',
        value: shipment.trackingId,
        label: `${shipment.trackingId} - ${shipment.customer}`
      });
      suggestions.push({
        type: 'customer',
        value: shipment.customer,
        label: `${shipment.customer} (${shipment.customerCode})`
      });
      suggestions.push({
        type: 'route',
        value: `${shipment.origin} to ${shipment.destination}`,
        label: `${shipment.origin} → ${shipment.destination}`
      });
    });
    return suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.value === suggestion.value)
    );
  }, []);

  // Filter and search logic
  const filteredShipments = useMemo(() => {
    let filtered = mockShipments;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(shipment =>
        shipment.trackingId.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query) ||
        shipment.carrier.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(shipment => shipment.statusCode === filters.status);
    }

    // Apply carrier filter
    if (filters.carrier !== 'all') {
      filtered = filtered.filter(shipment => shipment.carrierCode === filters.carrier);
    }

    // Apply delay status filter
    if (filters.delayStatus !== 'all') {
      filtered = filtered.filter(shipment => shipment.delayStatus === filters.delayStatus);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(shipment => shipment.priority === filters.priority);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(shipment => shipment.actualDeparture >= cutoffDate);
    }

    return filtered;
  }, [searchQuery, filters]);

  // Sort logic
  const sortedShipments = useMemo(() => {
    const sorted = [...filteredShipments];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredShipments, sortConfig]);

  // Pagination logic
  const paginatedShipments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedShipments.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedShipments, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedShipments.length / itemsPerPage);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle search from URL params
  useEffect(() => {
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl && searchFromUrl !== searchQuery) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setIsDetailPanelOpen(true);
  };

  const handleBulkSelect = (shipmentIds) => {
    setSelectedShipments(shipmentIds);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRefresh = () => {
    setLastUpdate(new Date());
  };

  const getStatusStats = () => {
    const stats = {
      total: filteredShipments.length,
      inTransit: filteredShipments.filter(s => s.statusCode === 'IT').length,
      delayed: filteredShipments.filter(s => s.delayStatus === 'delayed' || s.delayStatus === 'critical').length,
      onTime: filteredShipments.filter(s => s.delayStatus === 'on-time').length,
      delivered: filteredShipments.filter(s => s.statusCode === 'DV').length
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Shipment Tracking & Details</h1>
              <p className="text-text-secondary mt-1">
                Monitor and manage shipment status with real-time tracking updates
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="p-2 text-text-secondary hover:text-primary hover:bg-primary-50 rounded-md transition-colors duration-150"
                title="Refresh data"
              >
                <Icon name="RefreshCw" size={18} />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
              <div className="flex items-center space-x-2">
                <Icon name="Package" size={20} className="text-primary" />
                <div>
                  <p className="text-sm text-text-secondary">Total</p>
                  <p className="text-xl font-semibold text-text-primary">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
              <div className="flex items-center space-x-2">
                <Icon name="Truck" size={20} className="text-secondary" />
                <div>
                  <p className="text-sm text-text-secondary">In Transit</p>
                  <p className="text-xl font-semibold text-text-primary">{stats.inTransit}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={20} className="text-warning" />
                <div>
                  <p className="text-sm text-text-secondary">Delayed</p>
                  <p className="text-xl font-semibold text-text-primary">{stats.delayed}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
              <div className="flex items-center space-x-2">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <p className="text-sm text-text-secondary">On Time</p>
                  <p className="text-xl font-semibold text-text-primary">{stats.onTime}</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-50 rounded-lg p-4 border border-border-light">
              <div className="flex items-center space-x-2">
                <Icon name="PackageCheck" size={20} className="text-success" />
                <div>
                  <p className="text-sm text-text-secondary">Delivered</p>
                  <p className="text-xl font-semibold text-text-primary">{stats.delivered}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <SearchHeader
            searchQuery={searchQuery}
            onSearch={handleSearch}
            suggestions={autoCompleteSuggestions}
            onToggleFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            isFilterOpen={isFilterPanelOpen}
          />
          
          {isFilterPanelOpen && (
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              shipments={mockShipments}
            />
          )}
        </div>

        {/* Bulk Actions */}
        {selectedShipments.length > 0 && (
          <div className="mb-6">
            <BulkActions
              selectedCount={selectedShipments.length}
              onClearSelection={() => setSelectedShipments([])}
            />
          </div>
        )}

        {/* Results Table */}
        <div className="bg-surface rounded-lg border border-border shadow-sm">
          <ShipmentTable
            shipments={paginatedShipments}
            selectedShipments={selectedShipments}
            onShipmentSelect={handleShipmentSelect}
            onBulkSelect={handleBulkSelect}
            sortConfig={sortConfig}
            onSort={handleSort}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={sortedShipments.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>

        {/* Shipment Detail Panel */}
        {isDetailPanelOpen && selectedShipment && (
          <div className="mt-6">
            <ShipmentDetailPanel
              shipment={selectedShipment}
              onClose={() => setIsDetailPanelOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentTrackingDetailsDashboard;