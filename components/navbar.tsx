"use client"

import Link from "next/link"
import { User, ShoppingCart, LogIn, LogOut } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { cartTotals, setIsCartOpen } = useCart()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <>
      <header className="border-b sticky top-0 bg-background z-40">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-bold text-xl">
              FakeStore
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/product" className="text-sm font-medium hover:underline">
                All Products
              </Link>
              <Link href="/categories" className="text-sm font-medium hover:underline">
                Categories
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {/* Cart button - now visible for all users */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {cartTotals.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartTotals.itemCount}
                </span>
              )}
              <span className="sr-only">Open cart ({cartTotals.itemCount} items)</span>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name || user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                <Link href="/login">
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

    </>
  )
}

