'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  if (isChecking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome!</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Photo */}
            <div className="flex flex-col items-center">
              {user.profilePhoto ? (
                <div className="relative w-32 h-32 mb-4">
                  <Image
                    src={user.profilePhoto}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mb-4">
                  <span className="text-4xl text-white font-bold">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {user.firstName} {user.lastName}
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 font-semibold">Email</p>
                  <p className="text-gray-800 text-lg">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">Account Status</p>
                  <p className="text-green-600 text-lg font-semibold">✓ Active & Setup Complete</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700">
                  🎉 Your account is all set up and ready to go! You're now fully registered and can
                  access all features of our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-lg hover:shadow-lg transition">
                Settings
              </button>
              <button className="p-4 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg hover:shadow-lg transition">
                Profile
              </button>
              <button className="p-4 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg hover:shadow-lg transition">
                Preferences
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
