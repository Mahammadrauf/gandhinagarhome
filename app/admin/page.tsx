'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UsersTable from '@/components/admin/UsersTable'
import PropertiesTable from '@/components/admin/PropertiesTable'
import SubscriptionsTable from '@/components/admin/SubscriptionsTable'
import PaymentsTable from '@/components/admin/PaymentsTable'
import Dashboard from '@/components/admin/Dashboard'

const ADMIN_PASSWORD = 'gandhinagarhome#@7'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Invalid password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminAuth')
    setPassword('')
    router.push('/admin')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && (
              <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <div className="p-4">
            <h2 className="text-white text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab('properties')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  activeTab === 'properties'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Properties
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  activeTab === 'subscriptions'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Subscriptions
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  activeTab === 'payments'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Payments
              </button>
            </nav>
            <button
              onClick={handleLogout}
              className="w-full mt-8 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : `${activeTab} Management`}
            </h1>
            
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'users' && <UsersTable />}
            {activeTab === 'properties' && <PropertiesTable />}
            {activeTab === 'subscriptions' && <SubscriptionsTable />}
            {activeTab === 'payments' && <PaymentsTable />}
          </div>
        </div>
      </div>
    </div>
  )
}
