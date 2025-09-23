"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    projectName: '',
    eventLocation: '',
    quoteSource: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Quote Request</h1>
            <p className="text-gray-600">Fill out the details below to get your quote</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your project name"
              />
            </div>

            {/* Event Location */}
            <div>
              <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                Event Location
              </label>
              <input
                type="text"
                id="eventLocation"
                name="eventLocation"
                value={formData.eventLocation}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter the event location"
              />
            </div>

            {/* Quote Source */}
            <div>
              <label htmlFor="quoteSource" className="block text-sm font-medium text-gray-700 mb-2">
                Where are you quoting from?
              </label>
              <select
                id="quoteSource"
                name="quoteSource"
                value={formData.quoteSource}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">Select an option</option>
                <option value="JAM UAE">JAM UAE</option>
                <option value="JAM KSA">JAM KSA</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              Submit Quote Request
            </button>
          </form>

          {/* Display submitted data for demo purposes */}
          {(formData.projectName || formData.eventLocation || formData.quoteSource) && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Form Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {formData.projectName && <p><strong>Project:</strong> {formData.projectName}</p>}
                {formData.eventLocation && <p><strong>Location:</strong> {formData.eventLocation}</p>}
                {formData.quoteSource && <p><strong>Quote Source:</strong> {formData.quoteSource}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
