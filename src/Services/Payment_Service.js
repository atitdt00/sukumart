import axios from "axios"


export const initiateEsewaPayment=async(orderId)=>{
    const response= await axios.post("/api/payments/esewa/initiate", {
        orderId
    })

    return response.data;
}


export const initiateKhaltiPayment = async (orderId) => {
  const response = await axios.post(
    "/api/payments/khalti/initiate",
    {
      orderId,
    }
  );

  return response.data;
};