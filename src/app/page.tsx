"use client";
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';

export default function Home() {
  const router = useRouter();

  const handleNavigateToPeopleForm = () => {
    router.push('/people-form');
  };

  const handleNavigateToLookupForm = () => {
    router.push('/lookup-form');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-8 sm:px-12 lg:px-16 flex items-center">
        <div className="w-full">
          <div className="bg-white rounded-lg shadow-xl p-12 md:p-16 lg:p-20 min-h-[85vh] flex flex-col justify-center">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">JAM PEOPLE</h1>
              <p className="text-gray-600 text-lg md:text-xl">Welcome! Select a form to get started</p>
            </div>

            {/* Forms Grid */}
            <div className="flex-grow flex items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
                {/* People Form Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-16 border-3 border-indigo-200 hover:border-indigo-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                <div className="flex items-center justify-center mb-10">
                  <div className="bg-indigo-600 rounded-full p-8">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    </div>
                </div>
                <h2 className="text-4xl font-bold text-indigo-900 mb-6 text-center">People Form</h2>
                <p className="text-gray-600 mb-12 text-center text-xl leading-relaxed">Submit project details and staff requirements</p>
                <button
                  onClick={handleNavigateToPeopleForm}
                  className="w-full bg-indigo-600 text-white py-5 px-8 rounded-xl font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 text-xl shadow-lg"
                >
                  Open Form
                </button>
              </div>

              {/* Lookup Form Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-16 border-3 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                <div className="flex items-center justify-center mb-10">
                  <div className="bg-purple-600 rounded-full p-8">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-bold text-purple-900 mb-6 text-center">Project Lookup</h2>
                <p className="text-gray-600 mb-12 text-center text-xl leading-relaxed">Search and edit existing project data</p>
                <button
                  onClick={handleNavigateToLookupForm}
                  className="w-full bg-purple-600 text-white py-5 px-8 rounded-xl font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 text-xl shadow-lg"
                >
                  Open Lookup
                </button>
              </div>
            </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-gray-600">
                <p className="text-sm">
                  Need help? Contact your system administrator
                </p>
              </div>
            </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}
