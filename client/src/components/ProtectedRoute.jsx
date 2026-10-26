import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 dark:bg-slate-950">
        <div className="p-4 rounded-2xl glass-card flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-bloom-600 dark:text-bloom-400 animate-spin" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Nurturing your wellness space...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
