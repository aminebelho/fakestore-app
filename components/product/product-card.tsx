"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import type { Product } from "@/lib/api-service"
import { formatCurrency } from "@/lib/utils"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart(product, 1)
    toast.success(`${product.title} has been added to your cart.`)
  }

  return (
    <Card className="overflow-hidden">
      <Link href={`/product/${product.id}`} className="block overflow-hidden">
        <div className="aspect-square relative bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-contain p-4 transition-transform hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="space-y-1">
          <Link href={`/product/${product.id}`} className="font-medium line-clamp-1 hover:underline">
            {product.title}
          </Link>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.category}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold">{formatCurrency(product.price)}</span>
            <div className="flex items-center">
              <span className="text-sm text-yellow-500 mr-1">★</span>
              <span className="text-sm text-muted-foreground">
                {product.rating.rate} ({product.rating.count})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full" variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

