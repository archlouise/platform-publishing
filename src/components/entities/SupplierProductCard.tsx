import { productUri } from "@/lib/placeholders";
import type { SupplierProduct } from "@/lib/types";

export function SupplierProductCard({ product }: { product: SupplierProduct }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.image_url ?? productUri(product.name, product.id)} alt="" className="aspect-[3/2] w-full object-cover" />
      <div className="p-3.5">
        <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
        <h3 className="mt-0.5 font-medium leading-snug">{product.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{product.summary}</p>
      </div>
    </article>
  );
}
