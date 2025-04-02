"use client"

import type React from "react"

import { useState } from "react"
import { ShoppingCart, Minus, Plus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { getProduct } from "@/lib/api-service"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface AddToCartButtonProps {
  productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { addToCart } = useCart()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const product = await getProduct(Number.parseInt(productId))
      addToCart(product, quantity)
      toast.success(`${product.title} (${quantity}) has been added to your cart.`)
    } catch {
      toast.error("Error", {
        description: "Failed to add product to cart.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1 || isLoading}>
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <Input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 h-10 mx-2 text-center"
          disabled={isLoading}
        />
        <Button variant="outline" size="icon" onClick={increaseQuantity} disabled={isLoading}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
      <Button onClick={handleAddToCart} disabled={isLoading} className="w-full" size="lg">
        <ShoppingCart className="mr-2 h-5 w-5" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  )
}

