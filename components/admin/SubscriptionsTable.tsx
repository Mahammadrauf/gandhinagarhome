'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

// Use the same API configuration as other components
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface Subscription {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    mobile: string
  }
  planType: 'basic_unlock' | 'smart_buyer' | 'premium_access'
  planName: string
  unlockLimit: number
  unlockedProperties: Array<{
    propertyId: string
    unlockedAt: string
  }>
  razorpaySubscriptionId?: string
  razorpayPlanId?: string
  razorpayCustomerId?: string
  amount: number
  currency: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  billingCycle: {
    startDate?: string
    endDate?: string
    nextBillingDate?: string
  }
  autoRenewal: boolean
  cancelledAt?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

export default function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      // Replace with your actual backend API endpoint
      const response = await axios.get(`${API_BASE_URL}/admin/subscriptions`)
      setSubscriptions(response.data.data)
    } catch (err) {
      setError('Failed to fetch subscriptions')
      console.error('Error fetching subscriptions:', err)
      // Mock data for demonstration
      setSubscriptions([
        {
          _id: '1',
          userId: {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '+91 9876543210'
          },
          planType: 'premium_access',
          planName: 'Premium Access Plan',
          unlockLimit: 50,
          unlockedProperties: [],
          amount: 9999,
          currency: 'INR',
          status: 'active',
          billingCycle: {
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            nextBillingDate: '2025-01-01'
          },
          autoRenewal: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          _id: '2',
          userId: {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobile: '+91 9876543211'
          },
          planType: 'smart_buyer',
          planName: 'Smart Buyer Plan',
          unlockLimit: 20,
          unlockedProperties: [],
          amount: 4999,
          currency: 'INR',
          status: 'active',
          billingCycle: {
            startDate: '2024-01-15',
            endDate: '2024-07-15',
            nextBillingDate: '2024-07-15'
          },
          autoRenewal: false,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading subscriptions...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plan
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Auto Renewal
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {subscriptions.map((subscription) => (
            <tr key={subscription._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subscription.userId.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subscription.userId.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  subscription.planType === 'premium_access' ? 'bg-purple-100 text-purple-800' :
                  subscription.planType === 'smart_buyer' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {subscription.planName}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                  subscription.status === 'expired' ? 'bg-red-100 text-red-800' :
                  subscription.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {subscription.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subscription.billingCycle.startDate ? new Date(subscription.billingCycle.startDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subscription.billingCycle.endDate ? new Date(subscription.billingCycle.endDate).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{subscription.amount.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  subscription.autoRenewal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subscription.autoRenewal ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {subscriptions.length === 0 && (
        <div className="text-center py-8 text-gray-500">No subscriptions found</div>
      )}
    </div>
  )
}
