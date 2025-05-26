import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store';
import { checkAccessStatus } from '@slices';

type ProtectedRouteProps = {
  forAuthorized: boolean;
};

export const ProtectedRoute = ({
  forAuthorized = false
}: ProtectedRouteProps) => {
  const currentLocation = useLocation();
  const hasUserAccess = useAppSelector(checkAccessStatus);
  const redirectPath = currentLocation.state?.from || '/';

  if (!forAuthorized && hasUserAccess) {
    return <Navigate to={redirectPath} />;
  }

  if (forAuthorized && !hasUserAccess) {
    return <Navigate to='/login' state={{ from: currentLocation }} />;
  }

  return <Outlet />;
};
