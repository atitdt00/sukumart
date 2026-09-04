import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;


// Get all categories
export const getCategories = async () => {
  const response = await axios.get(
    `${API}/api/categories`
  );

  return response.data.categories;
};


// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(
    `${API}/api/categories/${slug}`
  );

  return response.data;
};


// Create category
export const createCategory = async (categoryData) => {
  const response = await axios.post(
    `${API}/api/categories`,
    categoryData
  );

  return response.data;
};