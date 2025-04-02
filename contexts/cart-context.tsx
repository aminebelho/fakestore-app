"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/contexts/auth-context"
import type { Product } from "@/lib/api-service"
import {
  type Cart,
  initCart,
  addToCart as addToCartService,
  updateCartItemQuantity,
  removeCartItem,
  clearCart as clearCartService,
  calculateCartTotals,
} from "@/lib/cart-service"
import { toast } from "sonner"

interface CartContextType {
  cart: Cart
  cartTotals: {
    subtotal: number
    tax: number
    shipping: number
    total: number
    itemCount: number
  }
  addToCart: (product: Product, quantity?: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  removeItem: (itemId: number) => void
  clearCart: () => void
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Separate storage keys for guest and user carts
const GUEST_CART_STORAGE_KEY = "ecommerce_guest_cart"
const USER_CART_STORAGE_KEY = "ecommerce_user_cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [cart, setCart] = useState<Cart>({ items: [], lastUpdated: new Date().toISOString() })
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize cart based on authentication status
  useEffect(() => {
    // Get the appropriate cart based on authentication status
    const storageKey = isAuthenticated ? USER_CART_STORAGE_KEY : GUEST_CART_STORAGE_KEY

    // Initialize cart from localStorage
    const initialCart = initCart(storageKey)

    // If user just logged in, merge guest cart with user cart
    if (isAuthenticated && !isInitialized) {
      const guestCart = initCart(GUEST_CART_STORAGE_KEY)

      // If guest cart has items, merge them with user cart
      if (guestCart.items.length > 0) {
        const mergedCart = { ...initialCart }

        // Add guest items to user cart
        guestCart.items.forEach((guestItem) => {
          const existingItemIndex = mergedCart.items.findIndex((item) => item.product.id === guestItem.product.id)

          if (existingItemIndex >= 0) {
            // Update quantity if item already exists
            mergedCart.items[existingItemIndex].quantity += guestItem.quantity
          } else {
            // Add new item if it doesn't exist
            mergedCart.items.push(guestItem)
          }
        })

        // Save merged cart and clear guest cart
        localStorage.setItem(USER_CART_STORAGE_KEY, JSON.stringify(mergedCart))
        localStorage.removeItem(GUEST_CART_STORAGE_KEY)

        setCart(mergedCart)
        setCartTotals(calculateCartTotals(mergedCart))

        toast.success("Cart synchronized", {
          description: "Your guest cart items have been added to your account.",
        })
      } else {
        setCart(initialCart)
        setCartTotals(calculateCartTotals(initialCart))
      }
    } else {
      setCart(initialCart)
      setCartTotals(calculateCartTotals(initialCart))
    }

    setIsInitialized(true)
  }, [isAuthenticated, user, isInitialized])

  // Get the current storage key based on authentication status
  const getCurrentStorageKey = () => {
    return isAuthenticated ? USER_CART_STORAGE_KEY : GUEST_CART_STORAGE_KEY
  }

  // Add product to cart
  const addToCart = (product: Product, quantity = 1) => {
    const storageKey = getCurrentStorageKey()
    const updatedCart = addToCartService(cart, product, quantity, storageKey)
    setCart(updatedCart)
    setCartTotals(calculateCartTotals(updatedCart))
    setIsCartOpen(true) // Open cart drawer when adding items
  }

  // Update cart item quantity
  const updateQuantity = (itemId: number, quantity: number) => {
    const storageKey = getCurrentStorageKey()
    const updatedCart = updateCartItemQuantity(cart, itemId, quantity, storageKey)
    setCart(updatedCart)
    setCartTotals(calculateCartTotals(updatedCart))
  }

  // Remove item from cart
  const removeItem = (itemId: number) => {
    const storageKey = getCurrentStorageKey()
    const updatedCart = removeCartItem(cart, itemId, storageKey)
    setCart(updatedCart)
    setCartTotals(calculateCartTotals(updatedCart))
  }

  // Clear cart
  const clearCart = () => {
    const storageKey = getCurrentStorageKey()
    const emptyCart = clearCartService(storageKey)
    setCart(emptyCart)
    setCartTotals(calculateCartTotals(emptyCart))
  }

  // Only render children after cart is initialized
  if (!isInitialized && typeof window !== "undefined") {
    return null
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotals,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

