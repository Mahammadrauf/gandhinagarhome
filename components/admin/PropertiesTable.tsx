'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const STATUS_OPTIONS = ['awaiting_payment', 'pending', 'approved', 'rejected', 'sold', 'inactive']
const CATEGORY_OPTIONS = ['residential', 'commercial', 'plot']
const PROPERTY_CATEGORY_OPTIONS = ['Exclusive', 'Featured', 'Regular']

// Use the same API configuration as other components
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gandhinagarhomes.com/api'

interface Property {
  _id: string
  userId?: {
    _id: string
    name: string
    mobile: string
    email: string
  } | null
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
    totalAreaUnit?: string
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
  description?: string
  status: 'pending' | 'approved' | 'rejected' | 'sold' | 'inactive' | 'awaiting_payment'
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
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<FileList | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async (page = 1) => {
    try {
      setLoading(true)
      // Replace with your actual backend API endpoint
      const response = await axios.get(`${API_BASE_URL}/admin/properties?page=${page}&limit=10`)
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

  const openEditModal = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      title: property.title || '',
      propertyType: property.propertyType || '',
      category: property.category || 'residential',
      propertyCategory: property.propertyCategory || 'Regular',
      status: property.status || 'pending',
      postedBy: property.postedBy || 'owner',
      description: property.description || '',
      location: {
        sector: property.location?.sector || '',
        address: property.location?.address || '',
        city: property.location?.city || '',
        landmark: property.location?.landmark || '',
        pinCode: property.location?.pinCode || ''
      },
      specifications: {
        bhk: property.specifications?.bhk || '',
        bathrooms: property.specifications?.bathrooms || 0,
        balconies: property.specifications?.balconies || 0,
        totalArea: property.specifications?.totalArea || 0,
        totalAreaUnit: property.specifications?.totalAreaUnit || 'sqft',
        furnishing: property.specifications?.furnishing || '',
        age: property.specifications?.age || '',
        parking: property.specifications?.parking || 0,
        floorNo: property.specifications?.floorNo || ''
      },
      pricing: {
        expectedPrice: property.pricing?.expectedPrice || 0,
        negotiable: property.pricing?.negotiable || false,
        maintenanceCharges: property.pricing?.maintenanceCharges || 0,
        availability: property.pricing?.availability || '',
        inclusions: property.pricing?.inclusions || '',
        ownershipDocuments: property.pricing?.ownershipDocuments || true
      },
      amenities: property.amenities || []
    })
    setSelectedImages(null)
    setSelectedVideo(null)
    setSelectedDocuments(null)
  }

  const closeEditModal = () => {
    setEditingProperty(null)
    setFormData({})
    setSelectedImages(null)
    setSelectedVideo(null)
    setSelectedDocuments(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1]
      setFormData((prev: any) => ({ ...prev, location: { ...(prev.location || {}), [key]: value } }))
      return
    }
    if (name.startsWith('specifications.')) {
      const key = name.split('.')[1]
      setFormData((prev: any) => ({ ...prev, specifications: { ...(prev.specifications || {}), [key]: value } }))
      return
    }
    if (name.startsWith('pricing.')) {
      const key = name.split('.')[1]
      setFormData((prev: any) => ({ ...prev, pricing: { ...(prev.pricing || {}), [key]: value } }))
      return
    }
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    if (name.startsWith('pricing.')) {
      const key = name.split('.')[1]
      setFormData((prev: any) => ({ ...prev, pricing: { ...(prev.pricing || {}), [key]: checked } }))
      return
    }
    setFormData((prev: any) => ({ ...prev, [name]: checked }))
  }

  const handleSaveProperty = async () => {
    if (!editingProperty) return
    try {
      setSaving(true)
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
          payload.append(key, JSON.stringify(value))
        } else {
          payload.append(key, String(value))
        }
      })

      if (selectedImages) {
        Array.from(selectedImages).forEach((file) => payload.append('images', file))
      }
      if (selectedVideo) payload.append('video', selectedVideo)
      if (selectedDocuments) {
        Array.from(selectedDocuments).forEach((file) => payload.append('documents', file))
      }

      const response = await axios.put(`${API_BASE_URL}/admin/properties/${editingProperty._id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (response.data.success) {
        closeEditModal()
        fetchProperties(currentPage)
      }
    } catch (error) {
      console.error('Error updating property:', error)
      alert('Failed to update property')
    } finally {
      setSaving(false)
    }
  }

  const handleApprove = async (propertyId: string) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/properties/${propertyId}/approve`, {
        postedBy: 'owner' // Default to owner, can be made configurable
      })
      
      if (response.data.success) {
        // Refresh the properties list
        fetchProperties(currentPage)
      }
    } catch (error) {
      console.error('Error approving property:', error)
    }
  }

  const handleReject = async (propertyId: string) => {
    try {
      const rejectionReason = prompt('Please enter rejection reason:')
      if (!rejectionReason) return

      const response = await axios.put(`${API_BASE_URL}/admin/properties/${propertyId}/reject`, {
        rejectionReason
      })
      
      if (response.data.success) {
        // Refresh the properties list
        fetchProperties(currentPage)
      }
    } catch (error) {
      console.error('Error rejecting property:', error)
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {property.userId?.name || 'Unknown User'}
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
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => openEditModal(property)}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  {property.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(property._id)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(property._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      {properties.length === 0 && (
        <div className="text-center py-8 text-gray-500">No properties found</div>
      )}

      {editingProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Property</h3>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <input name="propertyType" value={formData.propertyType || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={formData.category || 'residential'} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                  {CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Category</label>
                <select name="propertyCategory" value={formData.propertyCategory || 'Regular'} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                  {PROPERTY_CATEGORY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={formData.status || 'pending'} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                  {STATUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Posted By</label>
                <select name="postedBy" value={formData.postedBy || 'owner'} onChange={handleInputChange} className="w-full border rounded px-3 py-2">
                  <option value="owner">Owner</option>
                  <option value="broker">Broker</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location Sector</label>
                <input name="location.sector" value={formData.location?.sector || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input name="location.address" value={formData.location?.address || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input name="location.city" value={formData.location?.city || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pin Code</label>
                <input name="location.pinCode" value={formData.location?.pinCode || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">BHK</label>
                <input name="specifications.bhk" value={formData.specifications?.bhk || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bathrooms</label>
                <input type="number" name="specifications.bathrooms" value={formData.specifications?.bathrooms || 0} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Balconies</label>
                <input type="number" name="specifications.balconies" value={formData.specifications?.balconies || 0} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Area</label>
                <input type="number" name="specifications.totalArea" value={formData.specifications?.totalArea || 0} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Furnishing</label>
                <input name="specifications.furnishing" value={formData.specifications?.furnishing || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input name="specifications.age" value={formData.specifications?.age || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input type="number" name="pricing.expectedPrice" value={formData.pricing?.expectedPrice || 0} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Availability</label>
                <input name="pricing.availability" value={formData.pricing?.availability || ''} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Maintenance Charges</label>
                <input type="number" name="pricing.maintenanceCharges" value={formData.pricing?.maintenanceCharges || 0} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" name="pricing.negotiable" checked={formData.pricing?.negotiable || false} onChange={handleCheckboxChange} />
                <label>Negotiable</label>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" name="pricing.ownershipDocuments" checked={formData.pricing?.ownershipDocuments || false} onChange={handleCheckboxChange} />
                <label>Ownership Documents</label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Amenities (comma separated)</label>
                <input value={(formData.amenities || []).join(', ')} onChange={(e) => setFormData((prev: any) => ({ ...prev, amenities: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) }))} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Add Images</label>
                <input type="file" multiple accept="image/*" onChange={(e) => setSelectedImages(e.target.files)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Add Video</label>
                <input type="file" accept="video/*" onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Add Documents</label>
                <input type="file" multiple onChange={(e) => setSelectedDocuments(e.target.files)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeEditModal} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={handleSaveProperty} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
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
