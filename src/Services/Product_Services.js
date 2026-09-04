import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API}/api/products`);

    return response.data.products || response.data;
  } catch (error) {
    console.error("Get products API error:", error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(
      `${API}/api/products/category/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error("Category products API error:", error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axios.get(
      `${API}/api/products?search=${encodeURIComponent(query)}`
    );

    return response.data;
  } catch (error) {
    console.error("Search products API error:", error);
    throw error;
  }
};