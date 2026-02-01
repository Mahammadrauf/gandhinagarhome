import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    createdAt: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+91 9876543211',
    createdAt: '2024-01-16',
    status: 'active'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+91 9876543212',
    createdAt: '2024-01-10',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+91 9876543213',
    createdAt: '2024-01-12',
    status: 'active'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here if needed
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      data: mockUsers
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
