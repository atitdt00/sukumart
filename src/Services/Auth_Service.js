import axios from "axios";

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(
      "/api/auth/login",
      loginData,
    );

    return response.data;
  } catch (error) {
    console.error(
      "Login Error:",
      error.response?.data || error.message,
    );

    throw new Error(
      error.response?.data?.message || "Login failed",
    );
  }
};

export const logoutUser = async () => {
  const response = await axios.post("/api/auth/logout");
  return response.data;
};

export const registeruser = async (registerData) => {
  const response = await axios.post("/api/auth/register", registerData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/api/auth/me", { validateStatus: (status)=> status===200 || status===401,});
  return response.data;
};



export const forgotPassword= async(email)=>{
  try{
    const response = await axios.post(`/api/auth/forgot-password`, {email});
    return response.data;
  }catch(error){
    console.error("forgot password api error", error);
    throw error;
  }

}

export const resetPassword= async(token, password)=>{
  try{

    const response = await axios.post(`/api/auth/reset-password`, {token, password});
    return response.data;
  }catch(error){
    console.error("Reset token api error", error);
    throw error;
  }

}