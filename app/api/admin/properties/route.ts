import { NextRequest, NextResponse } from 'next/server'

// Mock data - replace with actual database calls
const mockProperties = [
  {
    id: '1',
    title: 'Luxury Apartment in Gandhinagar',
    type: 'sale',
    price: 7500000,
    location: 'Sector 15, Gandhinagar',
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    status: 'available',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Modern Villa with Garden',
    type: 'sale',
    price: 12000000,
    location: 'Sector 21, Gandhinagar',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    status: 'sold',
    createdAt: '2024-01-10'
  },
  {
    id: '3',
    title: 'Cozy 2BHK Apartment',
    type: 'rent',
    price: 15000,
    location: 'Sector 8, Gandhinagar',
    bedrooms: 2,
    bathrooms: 1,
    area: 800,
    status: 'available',
    createdAt: '2024-01-12'
  },
  {
    id: '4',
    title: 'Penthouse with City View',
    type: 'sale',
    price: 15000000,
    location: 'Sector 23, Gandhinagar',
    bedrooms: 5,
    bathrooms: 4,
    area: 3500,
    status: 'rented',
    createdAt: '2024-01-08'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Add authentication check here if needed
    // For now, return mock data
    
    return NextResponse.json({
      success: true,
      data: mockProperties
    })
  } catch (error) {
    console.error('Error fetching properties:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch properties' },
      { status: 500 }
    )
  }
}
