import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/hooks/useAuth';
import { useApi } from '../../shared/hooks/useApi';
import { Button, Card } from '../../shared/ui';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const { request, loading } = useApi();
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await request('get', '/student/dashboard');
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      }
    };

    fetchDashboard();
  }, [request]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {student?.full_name}!</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Info Card */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{student?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{student?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="text-lg font-semibold text-gray-900">{student?.year}</p>
                </div>
              </div>
            </Card>

            {/* Dashboard Data */}
            <Card className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dashboard Data</h2>
              {dashboardData && (
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(dashboardData, null, 2)}
                </pre>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};