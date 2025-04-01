import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/product-columns"
import { getProducts } from "@/lib/products"

// Loading component for Suspense
function ProductsTableSkeleton() {
  return (
    <div className="rounded-md border p-8">
      <div className="h-[400px] w-full animate-pulse bg-gray-200"></div>
    </div>
  )
}

// Server component to fetch products
async function ProductsTable() {
  const products = await getProducts()
  return <DataTable columns={columns} data={products} />
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Browse and manage products from FakeStore API.
          </p>
        </div>
        <Button asChild>
          <Link href="/product/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsTable />
        </Suspense>
      </div>
    </div>
  )
}

