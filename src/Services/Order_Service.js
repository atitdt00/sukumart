import axios from "axios";
// const API = process.env.NEXT_PUBLIC_API_URL;

export const createOrder = async(OrderData)=>{
    const response = await axios.post(`/api/orders`, OrderData)
    return response.data;
}

export const getOrders=async()=>{
    const response= await axios.get(`/api/orders`)
    return response.data;
}