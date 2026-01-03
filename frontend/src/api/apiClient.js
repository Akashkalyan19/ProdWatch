const API_BASE_URL = process.env.VITE_BASE_URL;

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server did not return JSON");
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API error");
  }

  return data;
};
