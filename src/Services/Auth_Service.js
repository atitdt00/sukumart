import axios from "axios";

// =========================
// ADMIN LOGIN
// =========================
export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(
      "/api/auth/login",
      loginData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Login Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Login failed"
    );
  }
};


// =========================
// ADMIN LOGOUT
// =========================
export const logoutUser = async () => {
  try {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Logout Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Logout failed"
    );
  }
};


// =========================
// ADMIN REGISTER
// =========================
export const registeruser = async (registerData) => {
  try {
    const response = await axios.post(
      "/api/auth/register",
      registerData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Register Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message || "Registration failed"
    );
  }
};


// =========================
// GET CURRENT ADMIN
// =========================
export const getCurrentUser = async () => {
  try {
    const response = await axios.get(
      "/api/auth/me",
      {
        withCredentials: true,

        validateStatus: (status) =>
          status === 200 || status === 401,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// FORGOT PASSWORD
// =========================
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(
      "/api/auth/forgot-password",
      {
        email,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(
      "/api/auth/reset-password",
      {
        token,
        password,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error.response?.data || error.message
    );

    throw error;
  }
};