import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getProduct } from "@/lib/api-service"
import { formatCurrency } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AddToCartButton } from "@/components/product/add-to-cart-button"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const product = await getProduct(Number.parseInt(params.id))

    return {
      title: `${product.title} | FakeStore`,
      description: product.description,
    }
  } catch {
    return {
      title: "Product | FakeStore",
      description: "Product details",
    }
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="bg-white rounded-lg p-6 flex items-center justify-center">
          <div className="relative aspect-square w-full max-w-md">
            <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </Suspense>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold tracking-tight mb-4">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${i < Math.round(product.rating.rate) ? "text-yellow-500" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>
            <p className="text-3xl font-bold mb-6">{formatCurrency(product.price)}</p>
            <div className="prose max-w-none mb-8">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-auto space-y-4">
            <AddToCartButton productId={product.id.toString()} />
          </div>
        </div>
      </div>
    </div>
  )
}

