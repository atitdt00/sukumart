import axios from "axios";

const API_URL = "/api/categories";

// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`/api/categories` , { withCredentails: true });

  return response.data;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`/api/categories/${slug}`, { withCredentials: true });

  return response.data;
};

// Create category
export const createCategory = async (formData) => {
  const response = await axios.post(`/api/categories`, formData);

  return response.data;
};

//delete category by slug
export const deleteCategory = async (slug) => {
  const response = await axios.delete(`${API_URL}/${slug}`);
  return response.data;
};

  
//update category by slug
export const updateCategory = async (slug, formData) => {
  const response = await axios.put(
    `${API_URL}/${slug}`,
    formData,
  );

  return response.data;
};