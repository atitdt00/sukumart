import axios from "axios";


export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`/api/dashboard/stats` , { withCredentials: true});

    return response.data;
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    throw error;
  }
};