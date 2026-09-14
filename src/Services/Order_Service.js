import axios from "axios";
const API = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async (OrderData) => {
  const response = await axios.post(`/api/orders`, OrderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`/api/orders`);
  return response.data;
};

export const trackOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API}/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Track order API error:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`${API}/api/orders/${orderId}`, {
      status,
    });

    return response.data;
  } catch (error) {
    console.error("Update order status API error:", error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const response = await axios.get(`${API}/api/orders/my-orders`, {
      
    });

    return response.data;
  } catch (error) {
    console.error("My orders users API error:", error);
    throw error;
  }
};
