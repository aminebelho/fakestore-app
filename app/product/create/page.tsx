import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductForm } from "@/components/product-form"

export default function CreateProductPage() {
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
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Product</h1>
        <ProductForm mode="create" />
      </div>
    </div>
  )
}