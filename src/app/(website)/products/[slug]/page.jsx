import { getProductBySlug } from "../../../../Services/Product_Services";
import ProductDetailsPage from "../ProductDetailsPage";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await getProductBySlug(slug);

    if (!response.success || !response.product) {
      return {
        title: "Product | Sukumart",
        description: "Product not found.",
      };
    }

    const product = response.product;

    const category = product.category_id;

    const categoryName =
      category?.parent_id?.name || category?.name || "";

    const subcategoryName =
      category?.parent_id ? category.name : "";

    const categoryPath = subcategoryName
      ? `${categoryName} / ${subcategoryName}`
      : categoryName;

    const imageName =
      product.thumbnail ||
      product.gallery?.[0] ||
      null;

    const imageUrl = imageName
      ? `/image/products/${imageName}`
      : "/image/products/sukumart.jpg";

    return {
      title: `${product.name} | Sukumart`,

      description:
        product.description ||
        `Buy ${product.name} from Sukumart.`,

      openGraph: {
        title: `${product.name} | Sukumart`,

        description:
          product.description ||
          `Buy ${product.name} from Sukumart.`,

        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],

        type: "website",
      },

      other: {
        "product:category": categoryPath,
      },
    };
  } catch (error) {
    console.error("Product metadata error:", error);

    return {
      title: "Sukumart",
      description: "Online shopping at Sukumart.",
    };
  }
}

export default async function Page({ params }) {
  const { slug } = await params;

  return <ProductDetailsPage slug={slug} />;
}