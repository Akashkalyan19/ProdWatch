const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

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
