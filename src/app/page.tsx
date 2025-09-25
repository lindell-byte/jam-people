"use client";
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    role: '',
    location: '',
    startDate: '',
    endDate: '',
    accountManagerInitials: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Auto-capitalize Account Manager Initials
    if (name === 'accountManagerInitials') {
      const capitalizedValue = value.toUpperCase();
      setFormData(prev => ({
        ...prev,
        [name]: capitalizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const webhookUrl = 'https://jamlive.app.n8n.cloud/webhook/jam-people';
      console.log('Submitting to:', webhookUrl);
      console.log('Form data:', formData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        setSubmitMessage('Form submitted successfully!');
        setFormData({
          clientName: '',
          projectName: '',
          role: '',
          location: '',
          startDate: '',
          endDate: '',
          accountManagerInitials: ''
        });
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        setSubmitMessage(`Error ${response.status}: ${response.statusText}. Please check the webhook URL.`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and webhook URL.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-16">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-indigo-900 mb-4">JAM PEOPLE</h1>
            <p className="text-gray-600 text-lg">Please fill out the form below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Client Name */}
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black" 
                placeholder="Enter client name"
              />
            </div>

            {/* Project Name */}
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                placeholder="Enter project name"
              />
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                placeholder="Enter your role"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                placeholder="Enter location"
              />
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                />
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                />
              </div>
            </div>

            {/* Account Manager Initials */}
            <div>
              <label htmlFor="accountManagerInitials" className="block text-sm font-medium text-gray-700 mb-2">
                Account Manager Initials *
              </label>
              <input
                type="text"
                id="accountManagerInitials"
                name="accountManagerInitials"
                value={formData.accountManagerInitials}
                onChange={handleInputChange}
                required
                maxLength={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                placeholder="Enter your initials (e.g., AB)"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mt-6 p-4 rounded-lg ${
              submitMessage.includes('success')
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm ${
                submitMessage.includes('success')
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {submitMessage}
              </p>
            </div>
          )}

          {/* Display current form data for demo */}
          {Object.values(formData).some(value => value) && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Form Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {formData.clientName && <p><strong>Client:</strong> {formData.clientName}</p>}
                {formData.projectName && <p><strong>Project:</strong> {formData.projectName}</p>}
                {formData.role && <p><strong>Role:</strong> {formData.role}</p>}
                {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                {formData.startDate && <p><strong>Start Date:</strong> {formData.startDate}</p>}
                {formData.endDate && <p><strong>End Date:</strong> {formData.endDate}</p>}
                {formData.accountManagerInitials && <p><strong>AM Initials:</strong> {formData.accountManagerInitials}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
