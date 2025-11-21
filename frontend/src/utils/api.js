const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Token storage - using a module-level variable that can be set by AuthContext
let currentAuthToken = null;

export const setAuthToken = (token) => {
  currentAuthToken = token;
};

export const getAuthToken = () => {
  // Try to get from sessionStorage as fallback (for API calls outside React context)
  return currentAuthToken || sessionStorage.getItem('authToken');
};

// Make API request with authentication
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Employee API
export const employeeAPI = {
  getAll: () => apiRequest('/auth/employees/'),
  getById: (id) => apiRequest(`/auth/employees/${id}/`),
  create: (data) => apiRequest('/auth/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/auth/employees/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/auth/employees/${id}/`, {
    method: 'DELETE',
  }),
};

// Session API
export const sessionAPI = {
  getAll: (status = null) => {
    const endpoint = status 
      ? `/auth/sessions/?status=${status}`
      : '/auth/sessions/';
    return apiRequest(endpoint);
  },
  getById: (id) => apiRequest(`/auth/sessions/${id}/`),
  create: (data) => apiRequest('/auth/sessions/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/auth/sessions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/auth/sessions/${id}/`, {
    method: 'DELETE',
  }),
};

// Session Request API
export const sessionRequestAPI = {
  getAll: (status = null) => {
    const endpoint = status 
      ? `/auth/session-requests/?status=${status}`
      : '/auth/session-requests/';
    return apiRequest(endpoint);
  },
  getById: (id) => apiRequest(`/auth/session-requests/${id}/`),
  create: (data) => apiRequest('/auth/session-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/auth/session-requests/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/auth/session-requests/${id}/`, {
    method: 'DELETE',
  }),
};

// Session Completion API
export const sessionCompletionAPI = {
  getAll: (employeeId = null, sessionId = null) => {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee', employeeId);
    if (sessionId) params.append('session', sessionId);
    const queryString = params.toString();
    const endpoint = queryString 
      ? `/auth/session-completions/?${queryString}`
      : '/auth/session-completions/';
    return apiRequest(endpoint);
  },
  create: (data) => apiRequest('/auth/session-completions/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/auth/session-completions/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export default apiRequest;

