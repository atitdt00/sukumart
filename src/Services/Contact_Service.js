
import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;

// Send contact message
export const createContact = async (contactData) => {
  try {
    const response = await axios.post(
      `${API}/api/contact`,
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
      `${API}/api/contact`,
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

