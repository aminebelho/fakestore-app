import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProducts, getCategories } from "@/lib/api-service"
import { ProductCard } from "@/components/product/product-card"

import { Button } from "@/components/ui/button"

export default async function HomePage() {
  // Get featured products (first 4)
  const products = await getProducts()
  const featuredProducts = products.slice(0, 4)

  // Get categories
  const categories = await getCategories()

  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Welcome to FakeStore</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our collection of high-quality products at affordable prices.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Products</h2>
            <p className="text-muted-foreground">Check out our most popular items</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/products">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
          <p className="text-muted-foreground">Browse products by category</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category}`}
              className="group block bg-muted rounded-lg p-6 text-center hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <h3 className="text-lg font-medium capitalize">{category}</h3>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

