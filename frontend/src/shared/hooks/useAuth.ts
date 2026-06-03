import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { logout } from '../../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { student, token, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    student,
    token,
    loading,
    error,
    isAuthenticated,
    logout: handleLogout,
  };
};
