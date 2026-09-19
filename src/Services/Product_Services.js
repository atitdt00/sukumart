  import axios from "axios";

  const API = process.env.NEXT_PUBLIC_API_URL || "";

  export const getProducts = async () => {
    try {
      const response = await axios.get(`/api/products`);

      return response.data;
    } catch (error) {
      console.error("Get products API error:", error);
      throw error;
    }
  };

  export const getProductsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `/api/products/category/${categoryId}`
      );

      return response.data;
    } catch (error) {
      console.error("Category products API error:", error);
      throw error;
    }
  };

  //get Product  by their slug
   export const getProductBySlug = async(slug) => {
    try {
      const response = await axios.get(
        `/api/products/${slug}`
      );

      return response.data;
    } catch (error) {
      console.error("Products detail  API error:", error);
      throw error;
    }
  };


  export const searchProducts = async (query) => {
    try {
      const response = await axios.get(
        `/api/products?search=${encodeURIComponent(query)}`
      );

      return response.data;
    } catch (error) {
      console.error("Search products API error:", error);
      throw error;
    }
  };


  export const  deleteProduct= async(id)=>{
    const response= await axios.delete(`/api/products/${id}`);

    return response.data;
  }

  export const updateProduct= async(id, formData)=>{
    const response= await axios.put(`/api/products/${id}`, formData);

    return response.data;
  }

  export const createProduct=async(formData)=>{
    const response= await axios.post(`/api/products`, formData);

    return response.data;

  }