import axios from "axios";

/* ----------------------------------
   CATEGORY PREVIEW
----------------------------------- */

export const previewCategories = async (
  file
) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("preview", "true");

    const response = await axios.post(
      "/api/import/categories",
      formData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Category preview error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

/* ----------------------------------
   CATEGORY IMPORT
----------------------------------- */

export const importCategoriesCsv =
  async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "preview",
        "false"
      );

      const response =
        await axios.post(
          "/api/import/categories",
          formData
        );

      return response.data;
    } catch (error) {
      console.error(
        "Category import error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };

/* ----------------------------------
   PRODUCT PREVIEW
----------------------------------- */

export const previewProducts = async (
  file
) => {
  try {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("preview", "true");

    const response = await axios.post(
      "/api/import/products",
      formData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Product preview error:",
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

/* ----------------------------------
   PRODUCT IMPORT
----------------------------------- */

export const importProductsCsv =
  async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "preview",
        "false"
      );

      const response =
        await axios.post(
          "/api/import/products",
          formData
        );

      return response.data;
    } catch (error) {
      console.error(
        "Product import error:",
        error.response?.data ||
          error.message
      );

      throw error;
    }
  };