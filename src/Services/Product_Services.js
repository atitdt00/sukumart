import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL || "";

export const getProducts= async()=>{
    try{
        const response= await axios.get(`${API}/api/products`);
        return response.data.products || response.data;
    }catch(error){
        console.error("get Products api error ", error);
        throw error;
    }
}

export const getProductsByCategory=async(categoryId)=>{
    const response = await axios.get(`${API}/api/products/category/${categoryId}`);
    return response.data;
}