import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sandbox.academiadevelopers.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Maneja el caso en que el token haya expirado y el servidor devuelva un 401
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, { refresh: refreshToken });

        const newToken = response.data.access;
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Token ${newToken}`;

        return api(originalRequest); // Repite la solicitud original con el nuevo token
      } catch (refreshError) {
        console.error('No se pudo refrescar el token', refreshError);
        // Opcional: redirigir al usuario a la página de inicio de sesión si el refresh token también falló
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
