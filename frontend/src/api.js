import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/documents/upload/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documents/files/`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getFileContent = async (filename) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documents/files/${filename?.filename}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const deleteFile = async (filename) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/documents/files/${filename?.filename}`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

// Unified error handler
const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    alert(`Error: ${error.response.data.message || "An error occurred"} (Status: ${error.response.status})`);
  } else if (error.request) {
    // No response from server
    alert("Error: Unable to connect to the server. Please check your network or try again later.");
  } else {
    // Other errors
    alert(`Error: ${error.message}`);
  }
  throw error; // Re-throw if needed for additional handling
};
