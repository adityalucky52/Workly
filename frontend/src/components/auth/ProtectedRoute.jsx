import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";
import { Loader2 } from "lucide-react";
import { authAPI } from "../../services/api";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Wait for zustand to hydrate from localStorage
  useEffect(() => {
    // Check if zustand has finished hydrating
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // If already hydrated (happens when navigating between pages)
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Verify auth with backend after hydration
  useEffect(() => {
    const verifyAuth = async () => {
      if (!hasHydrated) {
        return;
      }

      try {
        // Always verify with backend that token is still valid
        const response = await authAPI.getCurrentUser();

        if (response.data.success) {
          // Update store with latest user data from server
          useAuthStore.setState({
            user: response.data.user,
            isAuthenticated: true,
          });
          setIsValid(true);
        } else {
          // Token is invalid
          localStorage.removeItem("auth-storage");
          useAuthStore.setState({
            user: null,
            isAuthenticated: false,
          });
          setIsValid(false);
        }
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("auth-storage");
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
        });
        setIsValid(false);
      }
      setIsVerifying(false);
    };

    verifyAuth();
  }, [hasHydrated]);

  // Show loading while waiting for hydration or verifying
  if (!hasHydrated || isVerifying) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or invalid token - redirect to login
  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get updated user from store
  const currentUser = useAuthStore.getState().user;

  // If roles are specified, check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser?.role)) {
    // Redirect to user's dashboard based on their role
    const dashboardPath = `/${currentUser?.role}/dashboard`;
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
