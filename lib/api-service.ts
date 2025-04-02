// API service for fetching data from FakeStore API

export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
      rate: number
      count: number
    }
  }
  
  export interface Category {
    name: string
  }
  
  const API_URL = "https://fakestoreapi.com"
  
  // Fetch all products
  export async function getProducts(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products`)
      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error("Failed to fetch products:", error)
      throw error
    }
  }
  
  // Fetch a single product by ID
  export async function getProduct(id: number): Promise<Product> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`)
      if (!response.ok) {
        throw new Error(`Error fetching product: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error)
      throw error
    }
  }
  
  // Fetch all categories
  export async function getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_URL}/products/categories`)
      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      throw error
    }
  }
  
  // Fetch products by category
  export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products/category/${category}`)
      if (!response.ok) {
        throw new Error(`Error fetching products by category: ${response.status}`)
      }
      return response.json()
    } catch (error) {
      console.error(`Failed to fetch products in category ${category}:`, error)
      throw error
    }
  }
  
  