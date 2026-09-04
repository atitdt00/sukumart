import axios from "axios";

export const loginUser = async (loginData) => {
  const response = await axios.post("/api/auth/login", loginData);
  return response.data;
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
