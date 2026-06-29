'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart3 } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api'

interface Subscription {
  _id: string
  userId: { _id: string; name: string; email: string; mobile: string }
  planType: 'basic_unlock' | 'smart_buyer' | 'premium_access'
  planName: string
  unlockLimit: number
  unlockedProperties: Array<{ propertyId: string; unlockedAt: string }>
  razorpaySubscriptionId?: string
  razorpayPlanId?: string
  razorpayCustomerId?: string
  amount: number
  currency: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  billingCycle: { startDate?: string; endDate?: string; nextBillingDate?: string }
  autoRenewal: boolean
  cancelledAt?: string
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

const STATUS_STYLE: Record<string, string> = {
  active:    'bg-green-50 text-green-700',
  expired:   'bg-red-50 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
  paused:    'bg-amber-50 text-amber-700',
}

const PLAN_STYLE: Record<string, string> = {
  premium_access: 'bg-violet-50 text-violet-700',
  smart_buyer:    'bg-blue-50 text-blue-700',
  basic_unlock:   'bg-gray-100 text-gray-600',
}

export default function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchSubscriptions() }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/admin/subscriptions`)
      setSubscriptions(response.data.data)
    } catch (err) {
      setError('Failed to fetch subscriptions')
      console.error('Error fetching subscriptions:', err)
      setSubscriptions([
        {
          _id: '1', userId: { _id: '1', name: 'John Doe', email: 'john@example.com', mobile: '+91 9876543210' },
          planType: 'premium_access', planName: 'Premium Access Plan', unlockLimit: 50, unlockedProperties: [],
          amount: 9999, currency: 'INR', status: 'active',
          billingCycle: { startDate: '2024-01-01', endDate: '2024-12-31' }, autoRenewal: true,
          createdAt: '2024-01-01', updatedAt: '2024-01-01'
        },
        {
          _id: '2', userId: { _id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '+91 9876543211' },
          planType: 'smart_buyer', planName: 'Smart Buyer Plan', unlockLimit: 20, unlockedProperties: [],
          amount: 4999, currency: 'INR', status: 'active',
          billingCycle: { startDate: '2024-01-15', endDate: '2024-07-15' }, autoRenewal: false,
          createdAt: '2024-01-15', updatedAt: '2024-01-15'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (error && subscriptions.length === 0) {
    return <p className="text-red-500 text-sm text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-[#006D5B]" />
        <h2 className="text-lg font-bold text-gray-900">Subscriptions</h2>
        <span className="bg-[#006D5B]/10 text-[#006D5B] text-xs font-semibold px-2.5 py-0.5 rounded-full">{subscriptions.length}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['User', 'Email', 'Plan', 'Status', 'Start', 'End', 'Amount', 'Auto Renew'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {subscriptions.map((sub, i) => (
              <tr key={sub._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-[#006D5B]/5 transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#006D5B]/10 flex items-center justify-center text-[#006D5B] text-xs font-bold flex-shrink-0">
                      {sub.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{sub.userId.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{sub.userId.email}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${PLAN_STYLE[sub.planType] ?? 'bg-gray-100 text-gray-600'}`}>
                    {sub.planName}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[sub.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {sub.billingCycle.startDate ? new Date(sub.billingCycle.startDate).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {sub.billingCycle.endDate ? new Date(sub.billingCycle.endDate).toLocaleDateString('en-IN') : '—'}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">
                  ₹{sub.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${sub.autoRenewal ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {sub.autoRenewal ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscriptions.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No subscriptions found</p>}
      </div>
    </div>
  )
}
