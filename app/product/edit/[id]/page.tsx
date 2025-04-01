import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/product-form"
import { getProduct } from "@/lib/products"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  try {
    const product = await getProduct(parseInt(params.id))
    
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <Button variant="outline" asChild>
            <Link href="/product">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Edit Product</h1>
          <ProductForm product={product} mode="edit" />
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Failed to fetch product with ID ${params.id}:`, error)
    notFound()
  }
}