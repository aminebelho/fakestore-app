import { Suspense } from "react"
import { getProducts } from "@/lib/api-service"
import { ProductCard } from "@/components/product/product-card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "All Products | FakeStore",
  description: "Browse our collection of products",
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground">Browse our collection of products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Suspense fallback={<ProductGridSkeleton />}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Suspense>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return Array.from({ length: 8 }).map((_, i) => (
    <div key={i} className="space-y-3">
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  ))
}

