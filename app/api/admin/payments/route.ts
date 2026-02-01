import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const mockPayments = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    type: 'subscription',
    amount: 9999,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN123456789',
    createdAt: '2024-01-15 10:30:00',
    description: 'Premium Plan Subscription'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    type: 'property',
    amount: 50000,
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'UPI',
    transactionId: 'TXN987654321',
    createdAt: '2024-01-14 14:45:00',
    description: 'Property Listing Fee'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    type: 'subscription',
    amount: 4999,
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'Net Banking',
    transactionId: 'TXN456789123',
    createdAt: '2024-01-16 09:15:00',
    description: 'Basic Plan Subscription'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Sarah Williams',
    userEmail: 'sarah@example.com',
    type: 'listing',
    amount: 25000,
    currency: 'INR',
    status: 'failed',
    paymentMethod: 'Debit Card',
    transactionId: 'TXN789123456',
    createdAt: '2024-01-13 16:20:00',
    description: 'Featured Listing Fee'
  },
  {
    id: '5',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    type: 'property',
    amount: 15000,
    currency: 'INR',
    status: 'refunded',
    paymentMethod: 'UPI',
    transactionId: 'TXN321654987',
    createdAt: '2024-01-12 11:00:00',
    description: 'Property Promotion Fee'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here if needed
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      data: mockPayments
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}
