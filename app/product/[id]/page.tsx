import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getProduct } from "@/lib/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-lg overflow-hidden border">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain"
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">{product.title}</CardTitle>
              <Button variant="outline" asChild>
                <Link href={`/product/edit/${product.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Price</h3>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price)}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Category</h3>
                <p className="capitalize">{product.category}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error(`Failed to fetch product with ID ${params.id}:`, error)
    notFound()
  }
}