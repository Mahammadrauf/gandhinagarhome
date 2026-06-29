'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { CreditCard } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api'

interface Payment {
  _id: string
  userId: { _id: string; name: string; email: string; mobile: string }
  razorpayPaymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'refunded'
  paymentType: 'subscription' | 'featured' | 'buyer_subscription'
  planId?: string
  propertyId?: { _id: string; title: string }
  subscriptionId?: { _id: string; planName: string }
  paymentMethod?: string
  invoiceUrl?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

const STATUS_STYLE: Record<string, string> = {
  success:  'bg-green-50 text-green-700',
  pending:  'bg-amber-50 text-amber-700',
  failed:   'bg-red-50 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

const TYPE_STYLE: Record<string, string> = {
  subscription:      'bg-blue-50 text-blue-700',
  featured:          'bg-[#006D5B]/10 text-[#006D5B]',
  buyer_subscription:'bg-violet-50 text-violet-700',
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { fetchPayments() }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/admin/payments`)
      setPayments(response.data.data)
    } catch (err) {
      setError('Failed to fetch payments')
      console.error('Error fetching payments:', err)
      setPayments([
        { _id: '1', userId: { _id: '1', name: 'John Doe', email: 'john@example.com', mobile: '+91 9876543210' }, razorpayPaymentId: 'TXN123456789', amount: 9999, currency: 'INR', status: 'success', paymentType: 'subscription', subscriptionId: { _id: 'sub1', planName: 'Premium Access Plan' }, paymentMethod: 'Credit Card', createdAt: '2024-01-15T10:30:00Z', updatedAt: '2024-01-15T10:30:00Z' },
        { _id: '2', userId: { _id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '+91 9876543211' }, razorpayPaymentId: 'TXN987654321', amount: 50000, currency: 'INR', status: 'success', paymentType: 'featured', propertyId: { _id: 'prop1', title: 'Luxury Apartment' }, paymentMethod: 'UPI', createdAt: '2024-01-14T14:45:00Z', updatedAt: '2024-01-14T14:45:00Z' },
        { _id: '3', userId: { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', mobile: '+91 9876543212' }, razorpayPaymentId: 'TXN456789123', amount: 4999, currency: 'INR', status: 'pending', paymentType: 'subscription', subscriptionId: { _id: 'sub2', planName: 'Smart Buyer Plan' }, paymentMethod: 'Net Banking', createdAt: '2024-01-16T09:15:00Z', updatedAt: '2024-01-16T09:15:00Z' }
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

  if (error && payments.length === 0) {
    return <p className="text-red-500 text-sm text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <CreditCard className="w-5 h-5 text-[#006D5B]" />
        <h2 className="text-lg font-bold text-gray-900">Payments</h2>
        <span className="bg-[#006D5B]/10 text-[#006D5B] text-xs font-semibold px-2.5 py-0.5 rounded-full">{payments.length}</span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['User', 'Type', 'Amount', 'Status', 'Method', 'Transaction ID', 'Date', 'Details'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment, i) => (
              <tr key={payment._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-[#006D5B]/5 transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#006D5B]/10 flex items-center justify-center text-[#006D5B] text-xs font-bold flex-shrink-0">
                      {payment.userId.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{payment.userId.name}</p>
                      <p className="text-xs text-gray-400 truncate">{payment.userId.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap capitalize ${TYPE_STYLE[payment.paymentType] ?? 'bg-gray-100 text-gray-600'}`}>
                    {payment.paymentType.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800 whitespace-nowrap">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[payment.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{payment.paymentMethod ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">{payment.razorpayPaymentId ?? '—'}</td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-[140px] truncate">
                  {payment.subscriptionId?.planName ?? payment.propertyId?.title ?? '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="text-center py-10 text-gray-400 text-sm">No payments found</p>}
      </div>
    </div>
  )
}
