import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudentAsync, clearError } from './authSlice';
import { RootState } from '../../app/store';
import { Input, Button, Card } from '../../shared/ui';

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    year: '1st year' as '1st year' | '2nd year' | '3rd year' | '4th year',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Validation
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 3) {
      errors.full_name = 'Name must be at least 3 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      errors.password = 'Password must be at least 5 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        registerStudentAsync({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          year: formData.year,
        }) as any
      ).unwrap();

      setRegistrationSuccess(true);

      // Clear form
      setFormData({
        full_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        year: '1st year',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      // Error already in Redux state
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4 py-12">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <Card className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">Join Us</h1>
            <p className="text-gray-600">Create your student account</p>
          </div>

          {/* Success Message */}
          {registrationSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-bounce">
              <p className="text-green-800 text-sm font-medium">
                ✓ Registration successful! Redirecting to login...
              </p>
            </div>
          )}

          {/* Error Alert */}
          {error && !registrationSuccess && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-600 hover:text-red-800 text-xs mt-2 font-medium"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Form */}
          {!registrationSuccess && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                name="full_name"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
                error={fieldErrors.full_name}
                disabled={loading}
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
                disabled={loading}
              />

              {/* Year Selection */}
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="1st year">1st Year</option>
                  <option value="2nd year">2nd Year</option>
                  <option value="3rd year">3rd Year</option>
                  <option value="4th year">4th Year</option>
                </select>
              </div>

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
                disabled={loading}
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={fieldErrors.confirmPassword}
                disabled={loading}
              />

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </a>
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                isLoading={loading}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full px-6 py-3 text-center text-blue-600 font-semibold hover:text-blue-700 transition duration-200"
          >
            Sign In Instead
          </Link>
        </Card>
      </div>
    </div>
  );
};