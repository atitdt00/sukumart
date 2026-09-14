import { getProductBySlug } from "../../../../Services/Product_Services";
import ProductDetailsPage from "../ProductDetailsPage";

export async function generateMetadata({params}){

    const { slug }= await params;

    try{
        const response= await getProductBySlug(slug);

        if(!response.success || !response.product){
            return {
                title: "product",
                description: "product descriptin",
            }
        }

        const product= response.product;

        return{
            title: `${product.name} | Sukumart`,

            description: product.description || `Buy ${product.name} from Sukumart.`,

            openGraph: {
                title: `${product.name} | Sukumart`,

                description: product.description || `Buy ${product.name} from sukumart.`,
                
                gallery : product.gallery? [
                    {
                        url: `/image/products/${product.gallery}`,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    }
                ] 
                :
                [],

                type: "website",
            }
        };

    }catch(error){
        console.log( "OG metadata error",error);
        return {
            title: "sukumart",
            description: "Online shopping at Sukumart.",
        };
    }
}

export default async function page({params}){
    const {slug }= await params;

    return <ProductDetailsPage slug={slug}/>
}