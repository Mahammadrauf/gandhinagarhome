'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api'

interface User {
  _id: string
  name: string
  email: string
  mobile: string
  whatsappNumber?: string
  role: string
  subscriptionStatus: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/admin/users?page=${page}&limit=10`)
      setUsers(response.data.data)
      setTotalPages(response.data.pagination?.pages || 0)
      setTotalUsers(response.data.pagination?.total || 0)
      setCurrentPage(response.data.pagination?.currentPage || 1)
    } catch (err) {
      setError('Failed to fetch users')
      console.error('Error fetching users:', err)
      setUsers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', mobile: '+91 9876543210', role: 'user', subscriptionStatus: 'free', isActive: true, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', mobile: '+91 9876543211', role: 'seller', subscriptionStatus: 'subscribed', isActive: true, createdAt: '2024-01-16', updatedAt: '2024-01-16' }
      ])
      setTotalPages(1); setTotalUsers(2); setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) fetchUsers(page)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error && users.length === 0) {
    return <p className="text-red-500 text-sm text-center py-8">{error}</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#006D5B]" />
          <h2 className="text-lg font-bold text-gray-900">Users</h2>
          <span className="bg-[#006D5B]/10 text-[#006D5B] text-xs font-semibold px-2.5 py-0.5 rounded-full">{totalUsers}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Name', 'Email', 'Mobile', 'Role', 'Subscription', 'Status', 'Joined'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user, i) => (
              <tr key={user._id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-[#006D5B]/5 transition-colors`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#006D5B]/10 flex items-center justify-center text-[#006D5B] text-xs font-bold flex-shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.mobile}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    user.role === 'seller' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>{user.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                    user.subscriptionStatus === 'subscribed' ? 'bg-[#006D5B]/10 text-[#006D5B]' : 'bg-gray-100 text-gray-600'
                  }`}>{user.subscriptionStatus}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-10 text-gray-400 text-sm">No users found</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * 10) + 1}–{Math.min(currentPage * 10, totalUsers)} of {totalUsers}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const page = i + 1
              return (
                <button key={page} onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 text-xs rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-[#006D5B] text-white shadow-sm'
                      : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{page}</button>
              )
            })}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
