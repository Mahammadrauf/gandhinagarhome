'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Property {
  _id: string
  userId: {
    _id: string
    name: string
    mobile: string
    email: string
  }
  title: string
  propertyType: string
  category: string
  propertyCategory: string
  location: {
    sector: string
    address: string
    city?: string
    landmark?: string
    pinCode: string
  }
  specifications: {
    bhk?: string
    bathrooms?: number
    balconies?: number
    totalArea: number
    carpetArea?: number
    builtUpArea?: number
    floorNo?: string
    furnishing?: string
    age?: string
    facing?: string
    cabins?: number
    washrooms?: number
    pantry?: boolean
    parking?: number
    boundaryWall?: boolean
    cornerPlot?: boolean
  }
  pricing: {
    expectedPrice: number
    negotiable: boolean
    maintenanceCharges?: number
    availability?: string
    inclusions?: string
    ownershipDocuments: boolean
  }
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'inactive'
  postedBy?: 'owner' | 'broker'
  isFeatured: boolean
  views: number
  inquiries: number
  createdAt: string
  updatedAt: string
}

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProperties, setTotalProperties] = useState(0)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true)
      // Replace with your actual backend API endpoint
      const response = await axios.get(`http://localhost:5000/api/admin/properties?page=${page}&limit=10`)
      setProperties(response.data.data)
      setTotalPages(response.data.pagination?.pages || 0)
      setTotalProperties(response.data.pagination?.total || 0)
      setCurrentPage(response.data.pagination?.currentPage || 1)
    } catch (err) {
      setError('Failed to fetch properties')
      console.error('Error fetching properties:', err)
      // Mock data for demonstration
      setProperties([
        {
          _id: '1',
          userId: {
            _id: '1',
            name: 'John Doe',
            mobile: '+91 9876543210',
            email: 'john@example.com'
          },
          title: 'Luxury Apartment in Gandhinagar',
          propertyType: 'apartment',
          category: 'residential',
          propertyCategory: 'Featured',
          location: {
            sector: 'Sector 15',
            address: 'Main Road',
            city: 'Gandhinagar',
            pinCode: '382421'
          },
          specifications: {
            bhk: '3BHK',
            bathrooms: 2,
            balconies: 2,
            totalArea: 1500,
            carpetArea: 1200,
            furnishing: 'semi-furnished'
          },
          pricing: {
            expectedPrice: 7500000,
            negotiable: false,
            ownershipDocuments: true
          },
          status: 'approved',
          postedBy: 'owner',
          isFeatured: true,
          views: 150,
          inquiries: 12,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15'
        },
        {
          _id: '2',
          userId: {
            _id: '2',
            name: 'Jane Smith',
            mobile: '+91 9876543211',
            email: 'jane@example.com'
          },
          title: 'Modern Villa with Garden',
          propertyType: 'villa',
          category: 'residential',
          propertyCategory: 'Exclusive',
          location: {
            sector: 'Sector 21',
            address: 'Garden Area',
            city: 'Gandhinagar',
            pinCode: '382422'
          },
          specifications: {
            bhk: '4BHK',
            bathrooms: 3,
            balconies: 3,
            totalArea: 2500,
            carpetArea: 2000,
            furnishing: 'furnished'
          },
          pricing: {
            expectedPrice: 12000000,
            negotiable: true,
            ownershipDocuments: true
          },
          status: 'sold',
          postedBy: 'owner',
          isFeatured: false,
          views: 200,
          inquiries: 25,
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10'
        }
      ])
      setTotalPages(1)
      setTotalProperties(2)
      setCurrentPage(1)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchProperties(page)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading properties...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Area
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Views
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.userId.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.category === 'residential' ? 'bg-blue-100 text-blue-800' :
                  property.category === 'commercial' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {property.propertyType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.propertyCategory === 'Exclusive' ? 'bg-red-100 text-red-800' :
                  property.propertyCategory === 'Featured' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.propertyCategory}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{property.pricing.expectedPrice.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.location.sector}, {property.location.city}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.specifications.totalArea} sqft
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  property.status === 'approved' ? 'bg-green-100 text-green-800' :
                  property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  property.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  property.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.views}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(property.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">No properties found</div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProperties)} of {totalProperties} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    currentPage === page
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
