import axios from "axios";

export const createOrder = async (OrderData) => {
  const response = await axios.post(`/api/orders`, OrderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await axios.get(`/api/orders`, { withCredentials: true});
  return response.data;
};

export const trackOrder = async (orderId) => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`, { withCredentials: true});
    return response.data;
  } catch (error) {
    console.error("Track order API error:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.put(`/api/orders/${orderId}`, {
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
    const response = await axios.get("/api/orders/my-orders", {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error(
      "My orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};