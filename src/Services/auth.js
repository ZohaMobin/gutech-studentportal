import api from './api';

// Forgot Password - Request Reset Code
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to request password reset');
  }
};

// Verify Reset Code
export const verifyResetCode = async (email, code) => {
  try {
    const response = await api.post('/api/auth/verify-reset-code', { email, code });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify reset code');
  }
};

// Reset Password
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await api.post('/api/auth/reset-password', {
      email,
      code,
      newPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to reset password');
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}; 