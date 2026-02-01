import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const mockSubscriptions = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 9999,
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    plan: 'basic',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-07-15',
    amount: 4999,
    paymentMethod: 'UPI'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    plan: 'enterprise',
    status: 'expired',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    amount: 19999,
    paymentMethod: 'Net Banking'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Sarah Williams',
    userEmail: 'sarah@example.com',
    plan: 'premium',
    status: 'cancelled',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    amount: 9999,
    paymentMethod: 'Credit Card'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here if needed
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      data: mockSubscriptions
    })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    )
  }
}
