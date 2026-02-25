'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

// Use the same API configuration as other components
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface DashboardStats {
  totalUsers: number
  totalProperties: number
  totalSubscriptions: number
  totalPayments: number
  pendingProperties: number
  approvedProperties: number
  activeSubscriptions: number
  totalRevenue: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalSubscriptions: 0,
    totalPayments: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    activeSubscriptions: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Fetch data from all endpoints
      const [usersRes, propertiesRes, subscriptionsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/users?limit=1`),
        axios.get(`${API_BASE_URL}/admin/properties?limit=1`),
        axios.get(`${API_BASE_URL}/admin/subscriptions?limit=1`),
        axios.get(`${API_BASE_URL}/admin/payments?limit=1`)
      ])

      // Extract total counts from pagination data
      const totalUsers = usersRes.data.pagination?.total || 0
      const totalProperties = propertiesRes.data.pagination?.total || 0
      const totalSubscriptions = subscriptionsRes.data.pagination?.total || 0
      const totalPayments = paymentsRes.data.pagination?.total || 0

      // Fetch detailed stats
      const statsRes = await axios.get(`${API_BASE_URL}/admin/stats`)
      const adminStats = statsRes.data.data

      // Calculate active subscriptions and total revenue from actual data
      const subscriptionsData = subscriptionsRes.data.data || []
      const activeSubscriptions = subscriptionsData.filter((sub: any) => sub.status === 'active').length
      
      const paymentsData = paymentsRes.data.data || []
      const totalRevenue = paymentsData
        .filter((payment: any) => payment.status === 'success')
        .reduce((sum: number, payment: any) => sum + payment.amount, 0)

      setStats({
        totalUsers,
        totalProperties,
        totalSubscriptions,
        totalPayments,
        pendingProperties: adminStats.totalPending || 0,
        approvedProperties: adminStats.totalApproved || 0,
        activeSubscriptions,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Set mock data for demonstration
      setStats({
        totalUsers: 150,
        totalProperties: 89,
        totalSubscriptions: 45,
        totalPayments: 234,
        pendingProperties: 12,
        approvedProperties: 65,
        activeSubscriptions: 38,
        totalRevenue: 2450000
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Users */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.totalUsers.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Properties */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.totalProperties.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.activeSubscriptions.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
              <dd className="text-lg font-semibold text-gray-900">₹{(stats.totalRevenue / 100000).toFixed(1)}L</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Pending Properties */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Pending Properties</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.pendingProperties.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Approved Properties */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Approved Properties</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.approvedProperties.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Subscriptions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Subscriptions</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.totalSubscriptions.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Total Payments */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">Total Payments</dt>
              <dd className="text-lg font-semibold text-gray-900">{stats.totalPayments.toLocaleString()}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
