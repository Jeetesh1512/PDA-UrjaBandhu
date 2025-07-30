'use client';

import React, { useState } from 'react';

export default function LinkHouseholdPage() {
  const [consumerId, setConsumerId] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const HARDCODED_CONSUMER_ID = 'TEST1234';
  const CORRECT_OTP = '123456';

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!consumerId.trim()) {
      setError('Please enter a Consumer ID');
      return;
    }

    if (consumerId !== HARDCODED_CONSUMER_ID) {
      setError('Invalid Consumer ID. Use TEST1234 for demo.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      setSuccess('OTP sent to household email (test****@example.com)');
      setOtpSent(true);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    setTimeout(() => {
      if (otp === CORRECT_OTP) {
        setSuccess('Household linked successfully! Redirecting...');
        setTimeout(() => {
          // In a real Next.js app, this would work with useRouter
          console.log('Would redirect to /basic-user/dashboard');
          alert('Demo: Would redirect to /basic-user/dashboard');
        }, 2000);
      } else {
        setError('Invalid OTP. Use 123456 for demo.');
      }
      setLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    setOtpSent(false);
    setOtp('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Link Your Household
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            {!otpSent 
              ? 'Enter your Consumer ID to get started'
              : 'Enter the OTP sent to your household email'
            }
          </p>
          {!otpSent && (
            <p className="mt-1 text-center text-xs text-blue-400">
              Demo: Use Consumer ID "TEST1234"
            </p>
          )}
          {otpSent && (
            <p className="mt-1 text-center text-xs text-blue-400">
              Demo: Use OTP "123456"
            </p>
          )}
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm">
              {success}
            </div>
          )}

          {!otpSent ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="consumerId" className="block text-sm font-medium text-gray-300">
                  Consumer ID
                </label>
                <input
                  id="consumerId"
                  name="consumerId"
                  type="text"
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP(e)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your Consumer ID"
                  disabled={loading}
                />
              </div>

              <div>
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !consumerId.trim()}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending OTP...
                    </span>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP(e)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center tracking-widest"
                  placeholder="123456"
                  maxLength="6"
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Consumer ID: {consumerId}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className="flex-1 py-2 px-4 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={handleVerifyOTP}
                  disabled={loading || !otp.trim() || otp.length !== 6}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}