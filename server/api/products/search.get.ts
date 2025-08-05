import { authenticateToken } from '../../utils/auth'

// Mock products for autocomplete (in real app, this would be a database query)
const mockProducts = [
  { _id: 'prod_1', name: 'Wireless Bluetooth Headphones', sku: 'WH-001', category: 'Electronics', price: 99.99, stock: 25 },
  { _id: 'prod_2', name: 'Cotton T-Shirt', sku: 'TS-002', category: 'Clothing', price: 19.99, stock: 150 },
  { _id: 'prod_3', name: 'Organic Green Tea', sku: 'GT-003', category: 'Food & Beverages', price: 15.50, stock: 3 },
  { _id: 'prod_4', name: 'Office Chair', sku: 'OC-004', category: 'Office Supplies', price: 199.99, stock: 12 },
  { _id: 'prod_5', name: 'Smartphone Case', sku: 'SC-005', category: 'Electronics', price: 12.99, stock: 0 },
  { _id: 'prod_6', name: 'Gaming Mouse', sku: 'GM-006', category: 'Electronics', price: 79.99, stock: 35 },
  { _id: 'prod_7', name: 'Protein Powder', sku: 'PP-007', category: 'Health & Beauty', price: 45.99, stock: 2 },
  { _id: 'prod_8', name: 'Desk Lamp', sku: 'DL-008', category: 'Office Supplies', price: 34.99, stock: 18 },
  { _id: 'prod_9', name: 'Winter Jacket', sku: 'WJ-009', category: 'Clothing', price: 89.99, stock: 8 },
  { _id: 'prod_10', name: 'Coffee Beans', sku: 'CB-010', category: 'Food & Beverages', price: 24.99, stock: 0 }
]

export default defineEventHandler(async (event) => {
  try {
    const decoded = await authenticateToken(event)
    
    if (!decoded) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const query = getQuery(event)
    const { 
      q = '', 
      type = 'general',
      limit = 10,
      category = '',
      include_inactive = false 
    } = query

    const searchTerm = (q as string).toLowerCase().trim()
    const searchLimit = Math.min(Number(limit), 50) // Max 50 results

    if (!searchTerm && type !== 'suggestions') {
      return {
        success: true,
        data: {
          results: [],
          suggestions: [],
          type,
          query: searchTerm
        }
      }
    }

    let results: any[] = []

    switch (type) {
      case 'autocomplete':
        // Fast autocomplete for search input
        results = mockProducts
          .filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm)
          )
          .slice(0, searchLimit)
          .map(product => ({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            type: 'product'
          }))
        break

      case 'sku_lookup':
        // Exact SKU lookup for barcode scanning
        results = mockProducts
          .filter(product => 
            product.sku.toLowerCase() === searchTerm ||
            product.sku.toLowerCase().includes(searchTerm)
          )
          .map(product => ({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            exactMatch: product.sku.toLowerCase() === searchTerm
          }))
        break

      case 'suggestions':
        // Popular search suggestions
        const popularSearches = [
          'Electronics', 'Clothing', 'Office Supplies', 'Food & Beverages',
          'Wireless', 'Gaming', 'Organic', 'Bluetooth', 'Cotton'
        ]
        
        results = popularSearches
          .filter(term => !searchTerm || term.toLowerCase().includes(searchTerm))
          .slice(0, searchLimit)
          .map(term => ({
            text: term,
            type: 'suggestion',
            category: term.includes(' ') ? 'phrase' : 'keyword'
          }))
        break

      case 'category_products':
        // Products within specific category
        results = mockProducts
          .filter(product => 
            (!category || product.category === category) &&
            (product.name.toLowerCase().includes(searchTerm) ||
             product.sku.toLowerCase().includes(searchTerm))
          )
          .slice(0, searchLimit)
          .map(product => ({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            stock: product.stock,
            stockStatus: product.stock === 0 ? 'out_of_stock' : 
                        product.stock <= 5 ? 'low_stock' : 'in_stock'
          }))
        break

      default: // 'general' search
        results = mockProducts
          .filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
          )
          .slice(0, searchLimit)
          .map(product => ({
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            stock: product.stock,
            relevance: calculateRelevance(product, searchTerm)
          }))
          .sort((a, b) => b.relevance - a.relevance)
        break
    }

    // Generate related suggestions based on search
    const suggestions = generateSuggestions(searchTerm, results)

    return {
      success: true,
      data: {
        results,
        suggestions,
        type,
        query: searchTerm,
        total: results.length,
        meta: {
          searchTime: '0.05s', // Mock search time
          timestamp: new Date().toISOString()
        }
      }
    }

  } catch (error: any) {
    console.error('Search error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Search operation failed'
    })
  }
})

// Helper function to calculate search relevance
function calculateRelevance(product: any, searchTerm: string): number {
  let score = 0
  const term = searchTerm.toLowerCase()
  
  // Exact matches get highest score
  if (product.name.toLowerCase() === term) score += 100
  if (product.sku.toLowerCase() === term) score += 90
  
  // Starts with matches
  if (product.name.toLowerCase().startsWith(term)) score += 50
  if (product.sku.toLowerCase().startsWith(term)) score += 40
  
  // Contains matches
  if (product.name.toLowerCase().includes(term)) score += 20
  if (product.sku.toLowerCase().includes(term)) score += 15
  if (product.category.toLowerCase().includes(term)) score += 10
  
  // Boost for products in stock
  if (product.stock > 0) score += 5
  
  return score
}

// Helper function to generate search suggestions
function generateSuggestions(searchTerm: string, results: any[]): string[] {
  if (!searchTerm || searchTerm.length < 2) return []
  
  const suggestions = new Set<string>()
  
  // Add category suggestions based on results
  results.forEach(result => {
    if (result.category && !result.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      suggestions.add(result.category)
    }
  })
  
  // Add common search completions
  const commonTerms = ['wireless', 'bluetooth', 'organic', 'gaming', 'office', 'cotton']
  commonTerms.forEach(term => {
    if (term.startsWith(searchTerm.toLowerCase()) && term !== searchTerm.toLowerCase()) {
      suggestions.add(term)
    }
  })
  
  return Array.from(suggestions).slice(0, 5)
}