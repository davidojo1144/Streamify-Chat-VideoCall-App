import { axiosInstance } from "./axios.js";

// Request interceptor to add auth token from localStorage if exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.log('API error:', error.response?.status, error.config?.url);
    
    if (error.response?.status === 401) {
      // Clear stored tokens and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Test CORS connection
export const testConnection = async () => {
  try {
    const response = await axiosInstance.get("/test");
    console.log("CORS test successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("CORS test failed:", error);
    throw error;
  }
};

export const signup = async (signupData) => {
  const response = await axiosInstance.post('/auth/signup', signupData);
  
  // Store token in localStorage if needed for mobile apps
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}

export const login = async (loginData) => {
  const response = await axiosInstance.post('/auth/login', loginData);
  
  // Store user data in localStorage
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}

export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('authToken');
  
  return response.data;
}

export const getAuthUser = async () => {
  try {
    console.log('Fetching authenticated user...');
    const res = await axiosInstance.get("/auth/me");
    console.log('User data received:', res.data);
    
    // Update localStorage with fresh user data
    if (res.data.user) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    
    return res.data;
  } catch (error) {
    console.log("Error in getting user auth:", error);
    
    // Detailed error logging
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Data:", error.response.data);
    } else if (error.request) {
      console.log("No response received - CORS or network issue");
    }
    
    return null;
  }
}

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  
  // Update localStorage with updated user data
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
}

// ... rest of your API functions remain the same
export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers(){
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId){
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests(){
  const response = await axiosInstance.get("/users/friends-request");
  return response.data;
}

export async function acceptFriendRequest(requestId){
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}
