"use client";
import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';

export default function Home() {
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    eventType: '',
    location: '',
    startDate: '',
    endDate: '',
    accountManagerInitials: ''
  });

  const [roles, setRoles] = useState<Array<{
    id: string;
    role: string;
    quantity: string;
    gender: string;
    language: string;
  }>>([
    {
      id: '1',
      role: '',
      quantity: '',
      gender: '',
      language: ''
    }
  ]);

  const [timeSlots, setTimeSlots] = useState<{[key: string]: {startTime: string, endTime: string}}>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Function to get all dates between start and end date (inclusive)
  const getDatesInRange = (startDate: string, endDate: string): string[] => {
    if (!startDate || !endDate) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: string[] = [];
    
    if (start > end) return [];
    
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Function to format date for display
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

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

      // Clear time slots when dates change
      if (name === 'startDate' || name === 'endDate') {
        setTimeSlots({});
      }
    }
  };

  // Handle role changes
  const handleRoleChange = (roleId: string, field: keyof typeof roles[0], value: string) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId ? { ...role, [field]: value } : role
    ));
  };

  // Add new role
  const addRole = () => {
    const newRoleId = Date.now().toString();
    setRoles(prev => [...prev, {
      id: newRoleId,
      role: '',
      quantity: '',
      gender: '',
      language: ''
    }]);
  };

  // Remove role
  const removeRole = (roleId: string) => {
    if (roles.length > 1) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  // Handle time slot changes
  const handleTimeSlotChange = (date: string, field: 'startTime' | 'endTime', value: string) => {
    setTimeSlots(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value
      }
    }));
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
        body: JSON.stringify({
          ...formData,
          roles: roles,
          timeSlots: timeSlots
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        setSubmitMessage('Form submitted successfully!');
        setFormData({
          clientName: '',
          projectName: '',
          eventType: '',
          location: '',
          startDate: '',
          endDate: '',
          accountManagerInitials: ''
        });
        setRoles([{
          id: '1',
          role: '',
          quantity: '',
          gender: '',
          language: ''
        }]);
        setTimeSlots({});
      } else {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        console.error('Full response:', response);
        setSubmitMessage(`Error ${response.status}: ${response.statusText}. ${errorText ? `Details: ${errorText}` : 'Please check the webhook configuration.'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitMessage(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and webhook URL.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
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

            {/* Event Type */}
            <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <input
                type="text"
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black"
                placeholder="Enter event type"
              />
            </div>

            {/* Roles Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Roles Required</h3>
                <button
                  type="button"
                  onClick={addRole}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-sm flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Role
                </button>
              </div>

              <div className="space-y-4">
                {roles.map((roleItem, index) => (
                  <div key={roleItem.id} className="border border-gray-200 rounded-lg p-4 bg-white relative shadow-sm">
                    {roles.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRole(roleItem.id)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors duration-200"
                        title="Remove this role"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-indigo-600">{index + 1}</span>
                      </div>
                      <h4 className="text-sm font-medium text-gray-800">
                        Role {index + 1}
                      </h4>
                    </div>

                    {/* Role and Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div className="md:col-span-3">
                        <label htmlFor={`role-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <input
                          type="text"
                          id={`role-${roleItem.id}`}
                          value={roleItem.role}
                          onChange={(e) => handleRoleChange(roleItem.id, 'role', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                          placeholder="Enter role"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label htmlFor={`quantity-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Qty *
                        </label>
                        <input
                          type="number"
                          id={`quantity-${roleItem.id}`}
                          value={roleItem.quantity}
                          onChange={(e) => handleRoleChange(roleItem.id, 'quantity', e.target.value)}
                          required
                          min="1"
                          max="999"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-center text-sm"
                          placeholder="0"
                        />
                      </div>
                    </div>

                    {/* Gender and Language - Show when role is filled */}
                    {roleItem.role && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                        <div>
                          <label htmlFor={`gender-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Gender *
                          </label>
                          <input
                            type="text"
                            id={`gender-${roleItem.id}`}
                            value={roleItem.gender}
                            onChange={(e) => handleRoleChange(roleItem.id, 'gender', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                            placeholder="Gender"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor={`language-${roleItem.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Language *
                          </label>
                          <input
                            type="text"
                            id={`language-${roleItem.id}`}
                            value={roleItem.language}
                            onChange={(e) => handleRoleChange(roleItem.id, 'language', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-black text-sm"
                            placeholder="e.g., English, Spanish"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

            {/* Time Slots - Dynamic fields based on date range */}
            {formData.startDate && formData.endDate && getDatesInRange(formData.startDate, formData.endDate).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Event Times</h3>
                <div className="space-y-4">
                  {getDatesInRange(formData.startDate, formData.endDate).map((date) => (
                    <div key={date} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-800 mb-3">
                        {formatDateForDisplay(date)}:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor={`start-${date}`} className="block text-sm font-medium text-gray-700 mb-2">
                            Start Time *
                          </label>
                          <input
                            type="time"
                            id={`start-${date}`}
                            value={timeSlots[date]?.startTime || ''}
                            onChange={(e) => handleTimeSlotChange(date, 'startTime', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                          />
                        </div>
                        <div>
                          <label htmlFor={`end-${date}`} className="block text-sm font-medium text-gray-700 mb-2">
                            End Time *
                          </label>
                          <input
                            type="time"
                            id={`end-${date}`}
                            value={timeSlots[date]?.endTime || ''}
                            onChange={(e) => handleTimeSlotChange(date, 'endTime', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-black"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          {(Object.values(formData).some(value => value) || roles.some(role => role.role)) && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Current Form Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                {formData.clientName && <p><strong>Client:</strong> {formData.clientName}</p>}
                {formData.projectName && <p><strong>Project:</strong> {formData.projectName}</p>}
                {formData.eventType && <p><strong>Event Type:</strong> {formData.eventType}</p>}
                {roles.some(role => role.role) && (
                  <div className="mt-2">
                    <strong>Roles:</strong>
                    {roles.filter(role => role.role).map((role, index) => (
                      <div key={role.id} className="ml-4 mt-1">
                        <span className="font-medium">Role {index + 1}:</span> {role.role}
                        {role.quantity && ` (${role.quantity})`}
                        {role.gender && `, ${role.gender}`}
                        {role.language && `, ${role.language}`}
                      </div>
                    ))}
                  </div>
                )}
                {formData.location && <p><strong>Location:</strong> {formData.location}</p>}
                {formData.startDate && <p><strong>Start Date:</strong> {formData.startDate}</p>}
                {formData.endDate && <p><strong>End Date:</strong> {formData.endDate}</p>}
                {Object.keys(timeSlots).length > 0 && (
                  <div className="mt-2">
                    <strong>Event Times:</strong>
                    {Object.entries(timeSlots).map(([date, times]) => (
                      <div key={date} className="ml-4 mt-1">
                        <span className="font-medium">{formatDateForDisplay(date)}:</span> {times.startTime} - {times.endTime}
                      </div>
                    ))}
                  </div>
                )}
                {formData.accountManagerInitials && <p><strong>AM Initials:</strong> {formData.accountManagerInitials}</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
