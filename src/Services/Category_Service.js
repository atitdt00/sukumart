import axios from "axios";



// Get all categories
export const getCategories = async () => {
  const response = await axios.get(`/api/categories` , { withCredentail: true });

  return response.data;
};

// Get category by slug
export const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`/api/categories/${slug}`, { withCredential: true });

  return response.data;
};

// Create category
export const createCategory = async (categoryData) => {
  const response = await axios.post(`/api/categories`, categoryData);

  return response.data;
};

//delete category by slug
export const deleteCategory = async (slug) => {
  const response = await axios.delete(`/api/categories/${slug}`, { withCreadential: true});

  return response.data;
};


//update category by slug
export const updateCategory=async(slug, categoryData)=>{
  const response= await axios.put(`/api/categories/${slug}`, categoryData);

  return response.data;
}