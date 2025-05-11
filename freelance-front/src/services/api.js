import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// إضافة معترض للطلبات لطباعة عنوان URL وبيانات الطلب قبل إرساله
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method);
    console.log('Request Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    console.error('Error Response:', error.response ? error.response.data : 'No response data');
    
    // معالجة أخطاء المصادقة
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("employer");
      window.location = "/login";
    }
    
    // معالجة أخطاء الشبكة
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('Network error or timeout');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
