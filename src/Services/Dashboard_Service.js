import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API}/api/dashboard/stats` , { withCredentials: true});

    return response.data;
  } catch (error) {
    console.error("Dashboard stats API error:", error);
    throw error;
  }
};