
import axios from "axios";

// Send contact message
export const createContact = async (contactData) => {
  try {
    const response = await axios.post(
      `/api/contact`,
      contactData
    );

    return response.data;
  } catch (error) {
    console.error("Create contact error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong",
    };
  }
};
export const getContact = async () => {
  try {
    const response = await axios.get(
      `/api/contact`,
    );

    return response.data;
  } catch (error) {
    console.error("Create contact error:", error);

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong",
    };
  }
};

