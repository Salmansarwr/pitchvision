import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    general: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is changed
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
        general: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.user, data.token);
          navigate('/dashboard');
        } else {
          setFormErrors({
            general: data.message || 'Failed to sign in. Please check your credentials.',
          });
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Sign in error:', error);
        setFormErrors({
          general: 'An error occurred. Please try again.',
        });
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col">
      {/* Header Section */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-4 fixed w-full top-0 z-10 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <a
              href="/"
              className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-2xl font-bold tracking-wide"
            >
              PITCH VISION
            </a>
          </div>
          <nav className="hidden md:flex space-x-12">
            <a href="/dashboard" className="text-gray-300 hover:text-white transition text-lg">
              Dashboard
            </a>
            <a href="/player-tracking" className="text-gray-300 hover:text-white transition text-lg">
              Player Tracking
            </a>
            <a href="/event-detection" className="text-gray-300 hover:text-white transition text-lg">
              Event Detection
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <a
              href="/signup"
              className="px-6 py-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Header Spacer */}
      <div className="h-20"></div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Sign In to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  Pitch Vision
                </span>
              </h1>
              <p className="text-gray-400">Access your account to analyze your team's performance</p>
            </div>

            <form onSubmit={handleSubmit}>
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-md">
                  <p className="text-red-500 text-sm">{formErrors.general}</p>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-gray-700 border ${
                    formErrors.email ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-400 text-sm font-medium mb-1"
                  htmlFor="password"
                >
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-gray-700 border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-600'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                          clipRule="evenodd"
                        />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 py-6 border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pitch Vision. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SignInPage;