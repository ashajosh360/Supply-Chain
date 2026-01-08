import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Header from "components/ui/Header";
import GlobalOperationsOverviewDashboard from "pages/global-operations-overview-dashboard";
import RoutePerformanceAnalyticsDashboard from "pages/route-performance-analytics-dashboard";
import RiskManagementAlertsDashboard from "pages/risk-management-alerts-dashboard";
import ShipmentTrackingDetailsDashboard from "pages/shipment-tracking-details-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Header />
        <div className="pt-16 pb-16 md:pb-0 min-h-screen bg-background">
          <RouterRoutes>
            <Route path="/" element={<GlobalOperationsOverviewDashboard />} />
            <Route path="/global-operations-overview-dashboard" element={<GlobalOperationsOverviewDashboard />} />
            <Route path="/route-performance-analytics-dashboard" element={<RoutePerformanceAnalyticsDashboard />} />
            <Route path="/risk-management-alerts-dashboard" element={<RiskManagementAlertsDashboard />} />
            <Route path="/shipment-tracking-details-dashboard" element={<ShipmentTrackingDetailsDashboard />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;