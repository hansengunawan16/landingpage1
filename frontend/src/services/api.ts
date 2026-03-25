import axios from 'axios';

const isServer = typeof window === 'undefined';
const baseURL = isServer 
  ? ((process.env.INTERNAL_API_URL || 'http://backend:4000') + '/api/') 
  : ((process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const getProducts = async (params?: any) => {
  try {
    const url = 'products';
    console.log(`[FRONTEND] Fetching from: ${baseURL}${url}`, { params });
    const { data } = await api.get(url, { params });
    console.log(`[FRONTEND] Received ${Array.isArray(data) ? data.length : 'non-array'} products`);
    return data;
  } catch (error: any) {
    console.error('API Error [getProducts]:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      response: error.response?.data
    });
    return { data: [] }; // Return empty data rather than throwing in RSC
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await api.get(`products/${slug}`);
    return data;
  } catch (error) {
    console.error(`API Error [getProductBySlug ${slug}]:`, error);
    return null;
  }
};

export const createOrder = async (orderData: any) => {
  try {
    const { data } = await api.post('orders', orderData);
    return data;
  } catch (error) {
    console.error('API Error [createOrder]:', error);
    throw error; // Rethrow for Client Components to handle
  }
};

export const initiatePayment = async (orderId: string) => {
  try {
    const { data } = await api.post('payments/initiate', { orderId });
    return data;
  } catch (error) {
    console.error('API Error [initiatePayment]:', error);
    throw error;
  }
};
