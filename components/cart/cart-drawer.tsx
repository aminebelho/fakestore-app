/* eslint-disable react/no-unescaped-entities */
"use client"

import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { X, ShoppingCart, Trash2, Plus, Minus, LogIn } from "lucide-react"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function CartDrawer() {
  const { isAuthenticated } = useAuth()
  const { cart, cartTotals, isCartOpen, setIsCartOpen, updateQuantity, removeItem, clearCart } = useCart()

  return (
    <>
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader className="px-1">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Your Cart
                {cartTotals.itemCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cartTotals.itemCount} {cartTotals.itemCount === 1 ? "item" : "items"}
                  </Badge>
                )}
              </SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </SheetHeader>

          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 py-12">
              <div className="rounded-full bg-muted p-6 mb-4">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-center mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild onClick={() => setIsCartOpen(false)}>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4 py-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium line-clamp-1">{item.product.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.product.price)} × {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-start">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-4 pt-4">
                <Separator />
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cartTotals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(cartTotals.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {cartTotals.shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatCurrency(cartTotals.shipping)
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatCurrency(cartTotals.total)}</span>
                  </div>
                </div>

                <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                  {isAuthenticated ? (
                    <Button asChild className="w-full">
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  ) : (
                    <Button className="w-full">
                      <LogIn className="mr-2 h-4 w-4" />
                      <Link href="/login">Login to Checkout</Link>
                    </Button>
                  )}
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" className="flex-1" onClick={() => setIsCartOpen(false)}>
                      Continue Shopping
                    </Button>
                    <Button variant="outline" className="text-destructive" onClick={clearCart}>
                      Clear Cart
                    </Button>
                  </div>
                </SheetFooter>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

    </>
  )
}

