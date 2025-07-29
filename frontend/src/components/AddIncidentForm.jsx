'use client';

import { useState } from 'react';
import axios from 'axios';

const AddIncidentForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'Medium'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitSuccess(false);

    try {
      const response = await axios.post('/api/incident/create', formData);
      
      if (response.status === 200 || response.status === 201) {
        setSubmitSuccess(true);
        setFormData({
          title: '',
          description: '',
          location: '',
          urgency: 'Medium'
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to submit incident. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Report Incident</h1>
            <p className="text-gray-400">Provide details about the incident to help us respond appropriately.</p>
          </div>

          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg">
              <p className="text-green-400 font-medium">Incident reported successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Incident Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Brief description of the incident"
                disabled={isLoading}
              />
              {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-vertical ${
                  errors.description ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Provide detailed information about what happened, when, and any other relevant details..."
                disabled={isLoading}
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>

            {/* Location Field */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.location ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Street address, coordinates, or landmark"
                disabled={isLoading}
              />
              {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
            </div>

            {/* Urgency Field */}
            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-300 mb-2">
                Urgency Level
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${getUrgencyColor(formData.urgency)}`}
                disabled={isLoading}
              >
                <option value="Low" className="text-green-400">Low - Non-urgent, can wait</option>
                <option value="Medium" className="text-yellow-400">Medium - Needs attention</option>
                <option value="High" className="text-red-400">High - Urgent response required</option>
              </select>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-400">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Incident Report'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400 text-center">
              * Required fields. All reports are reviewed and processed according to urgency level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddIncidentForm;