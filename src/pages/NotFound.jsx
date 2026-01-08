import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Anchor" size={48} className="text-primary" />
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Page Not Found</h2>
          <p className="text-text-secondary mb-8">
            The logistics route you're looking for doesn't exist in our navigation system.
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate('/global-operations-overview-dashboard')}
            className="w-full btn-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Icon name="Home" size={20} />
            <span>Return to Operations Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-surface border border-border text-text-primary hover:bg-surface-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <Icon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;