import type { Product } from "./api-service"

export interface CartItem {
  id: number
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  lastUpdated: string
}

// Default storage key for cart
const DEFAULT_CART_STORAGE_KEY = "ecommerce_cart"

// Initialize cart from localStorage or create a new one
export function initCart(storageKey = DEFAULT_CART_STORAGE_KEY): Cart {
  if (typeof window === "undefined") {
    return { items: [], lastUpdated: new Date().toISOString() }
  }

  const storedCart = localStorage.getItem(storageKey)
  if (storedCart) {
    try {
      return JSON.parse(storedCart)
    } catch (error) {
      console.error(`Failed to parse cart from localStorage (${storageKey}):`, error)
    }
  }

  // Return empty cart if nothing in localStorage or parsing failed
  return { items: [], lastUpdated: new Date().toISOString() }
}

// Save cart to localStorage
export function saveCart(cart: Cart, storageKey = DEFAULT_CART_STORAGE_KEY): void {
  if (typeof window !== "undefined") {
    cart.lastUpdated = new Date().toISOString()
    localStorage.setItem(storageKey, JSON.stringify(cart))
  }
}

// Add product to cart
export function addToCart(cart: Cart, product: Product, quantity = 1, storageKey = DEFAULT_CART_STORAGE_KEY): Cart {
  const updatedCart = { ...cart }
  const existingItemIndex = updatedCart.items.findIndex((item) => item.product.id === product.id)

  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    updatedCart.items[existingItemIndex].quantity += quantity
  } else {
    // Add new item if it doesn't exist
    updatedCart.items.push({
      id: Date.now(), // Generate a unique ID for the cart item
      product,
      quantity,
    })
  }

  saveCart(updatedCart, storageKey)
  return updatedCart
}

// Update cart item quantity
export function updateCartItemQuantity(
  cart: Cart,
  itemId: number,
  quantity: number,
  storageKey = DEFAULT_CART_STORAGE_KEY,
): Cart {
  const updatedCart = { ...cart }
  const itemIndex = updatedCart.items.findIndex((item) => item.id === itemId)

  if (itemIndex === -1) {
    console.error(`Cart item with ID ${itemId} not found`)
    return cart
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    updatedCart.items = updatedCart.items.filter((item) => item.id !== itemId)
  } else {
    // Update quantity
    updatedCart.items[itemIndex].quantity = quantity
  }

  saveCart(updatedCart, storageKey)
  return updatedCart
}

// Remove item from cart
export function removeCartItem(cart: Cart, itemId: number, storageKey = DEFAULT_CART_STORAGE_KEY): Cart {
  const updatedCart = { ...cart }
  updatedCart.items = updatedCart.items.filter((item) => item.id !== itemId)

  saveCart(updatedCart, storageKey)
  return updatedCart
}

// Clear cart
export function clearCart(storageKey = DEFAULT_CART_STORAGE_KEY): Cart {
  const emptyCart = { items: [], lastUpdated: new Date().toISOString() }
  saveCart(emptyCart, storageKey)
  return emptyCart
}

// Calculate cart totals
export function calculateCartTotals(cart: Cart) {
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const total = subtotal + tax + shipping

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount: cart.items.reduce((count, item) => count + item.quantity, 0),
  }
}

