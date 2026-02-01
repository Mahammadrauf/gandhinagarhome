'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Payment {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
    mobile: string
  }
  razorpayPaymentId?: string
  razorpayOrderId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'refunded'
  paymentType: 'subscription' | 'featured' | 'buyer_subscription'
  planId?: string
  propertyId?: {
    _id: string
    title: string
  }
  subscriptionId?: {
    _id: string
    planName: string
  }
  paymentMethod?: string
  invoiceUrl?: string
  failureReason?: string
  createdAt: string
  updatedAt: string
}

export default function PaymentsTable() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      // Replace with your actual backend API endpoint
      const response = await axios.get('http://localhost:5000/api/admin/payments')
      setPayments(response.data.data)
    } catch (err) {
      setError('Failed to fetch payments')
      console.error('Error fetching payments:', err)
      // Mock data for demonstration
      setPayments([
        {
          _id: '1',
          userId: {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            mobile: '+91 9876543210'
          },
          razorpayPaymentId: 'TXN123456789',
          amount: 9999,
          currency: 'INR',
          status: 'success',
          paymentType: 'subscription',
          subscriptionId: {
            _id: 'sub1',
            planName: 'Premium Access Plan'
          },
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          userId: {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            mobile: '+91 9876543211'
          },
          razorpayPaymentId: 'TXN987654321',
          amount: 50000,
          currency: 'INR',
          status: 'success',
          paymentType: 'featured',
          propertyId: {
            _id: 'prop1',
            title: 'Luxury Apartment'
          },
          paymentMethod: 'UPI',
          createdAt: '2024-01-14T14:45:00Z',
          updatedAt: '2024-01-14T14:45:00Z'
        },
        {
          _id: '3',
          userId: {
            _id: '3',
            name: 'Mike Johnson',
            email: 'mike@example.com',
            mobile: '+91 9876543212'
          },
          razorpayPaymentId: 'TXN456789123',
          amount: 4999,
          currency: 'INR',
          status: 'pending',
          paymentType: 'subscription',
          subscriptionId: {
            _id: 'sub2',
            planName: 'Smart Buyer Plan'
          },
          paymentMethod: 'Net Banking',
          createdAt: '2024-01-16T09:15:00Z',
          updatedAt: '2024-01-16T09:15:00Z'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading payments...</div>
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
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => (
            <tr key={payment._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.userId.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.userId.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.paymentType === 'subscription' ? 'bg-blue-100 text-blue-800' :
                  payment.paymentType === 'featured' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {payment.paymentType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{payment.amount.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.status === 'success' ? 'bg-green-100 text-green-800' :
                  payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.paymentMethod || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {payment.razorpayPaymentId || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(payment.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                {payment.subscriptionId?.planName || payment.propertyId?.title || 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && (
        <div className="text-center py-8 text-gray-500">No payments found</div>
      )}
    </div>
  )
}
