import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const BulkActions = ({ selectedCount, onClearSelection }) => {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const bulkActions = [
    {
      id: 'update-status',
      label: 'Update Status',
      icon: 'RefreshCw',
      description: 'Change status for selected shipments'
    },
    {
      id: 'send-notification',
      label: 'Send Notification',
      icon: 'Bell',
      description: 'Notify customers about selected shipments'
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: 'FileText',
      description: 'Create report for selected shipments'
    },
    {
      id: 'export-data',
      label: 'Export Data',
      icon: 'Download',
      description: 'Export selected shipments to CSV/Excel'
    },
    {
      id: 'flag-priority',
      label: 'Flag as Priority',
      icon: 'Flag',
      description: 'Mark selected shipments as high priority'
    },
    {
      id: 'assign-agent',
      label: 'Assign Agent',
      icon: 'UserPlus',
      description: 'Assign customer service agent'
    }
  ];

  const handleActionClick = (actionId) => {
    console.log(`Executing bulk action: ${actionId} for ${selectedCount} shipments`);
    setIsActionsOpen(false);
    // Here you would implement the actual bulk action logic
  };

  return (
    <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} color="white" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary">
                {selectedCount} shipment{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-primary-600">
                Choose an action to apply to all selected items
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => handleActionClick('send-notification')}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary bg-surface border border-primary-200 rounded-md hover:bg-primary-50 transition-colors duration-150"
            >
              <Icon name="Bell" size={16} />
              <span>Notify</span>
            </button>
            
            <button
              onClick={() => handleActionClick('export-data')}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-primary bg-surface border border-primary-200 rounded-md hover:bg-primary-50 transition-colors duration-150"
            >
              <Icon name="Download" size={16} />
              <span>Export</span>
            </button>
          </div>

          {/* More Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-primary rounded-md hover:bg-primary-700 transition-colors duration-150"
            >
              <Icon name="MoreHorizontal" size={16} />
              <span>Actions</span>
              <Icon 
                name="ChevronDown" 
                size={14} 
                className={`transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            {isActionsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg z-dropdown animate-slide-down">
                <div className="py-2">
                  {bulkActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id)}
                      className="w-full text-left px-4 py-3 flex items-start space-x-3 text-text-primary hover:bg-surface-50 transition-colors duration-150"
                    >
                      <Icon name={action.icon} size={16} className="text-text-secondary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="text-xs text-text-secondary">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Selection */}
          <button
            onClick={onClearSelection}
            className="p-2 text-primary hover:text-primary-700 hover:bg-primary-100 rounded-md transition-colors duration-150"
            title="Clear selection"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
      </div>

      {/* Action Status Bar */}
      <div className="mt-3 pt-3 border-t border-primary-200">
        <div className="flex items-center justify-between text-xs text-primary-600">
          <span>
            Selected shipments can be processed individually or in bulk
          </span>
          <div className="flex items-center space-x-4">
            <span>Last action: 2 minutes ago</span>
            <button className="text-primary hover:text-primary-700 transition-colors duration-150">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;