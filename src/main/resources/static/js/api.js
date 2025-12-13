/**
* API Service
* Handles all HTTP requests to the backend
*/

class APIService {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.timeout = 10000;
    }

    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add auth token if available
        const token = Storage.get('auth_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new APIError(response.status, response.statusText);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw new APIError(0, 'Network error');
        }
    }

    /**
     * GET request
     */
    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    /**
     * POST request
     */
    post(endpoint, data = {}, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    put(endpoint, data = {}, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * PATCH request
     */
    patch(endpoint, data = {}, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
}

/**
 * API Error Class
 */
class APIError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'APIError';
    }
}

// User API endpoints
const UserAPI = {
    // Register new user
    register: (data) => api.post('/users/register', data),

    // Login
    login: (email, password) => api.post('/users/login', { email, password }),

    // Logout
    logout: () => api.post('/users/logout'),

    // Get current user
    getCurrentUser: () => api.get('/users/me'),

    // Update profile
    updateProfile: (data) => api.put('/users/profile', data),

    // Get user by ID
    getUserById: (id) => api.get(`/users/${id}`),

    // Search users
    searchUsers: (query) => api.get(`/users/search?q=${query}`)
};

// Store API endpoints
const StoreAPI = {
    // Get all stores
    getAllStores: (page = 1, limit = 10) => api.get(`/stores?page=${page}&limit=${limit}`),

    // Get store by ID
    getStoreById: (id) => api.get(`/stores/${id}`),

    // Create store
    createStore: (data) => api.post('/stores', data),

    // Update store
    updateStore: (id, data) => api.put(`/stores/${id}`, data),

    // Delete store
    deleteStore: (id) => api.delete(`/stores/${id}`),

    // Get store posts
    getStorePosts: (id, page = 1) => api.get(`/stores/${id}/posts?page=${page}`),

    // Search stores
    searchStores: (query) => api.get(`/stores/search?q=${query}`)
};

// Product API endpoints
const ProductAPI = {
    // Get all products
    getAllProducts: (page = 1, limit = 20, filters = {}) => {
        const params = new URLSearchParams({ page, limit, ...filters });
        return api.get(`/products?${params}`);
    },

    // Get product by ID
    getProductById: (id) => api.get(`/products/${id}`),

    // Create product
    createProduct: (data) => api.post('/products', data),

    // Update product
    updateProduct: (id, data) => api.put(`/products/${id}`, data),

    // Delete product
    deleteProduct: (id) => api.delete(`/products/${id}`),

    // Get categories
    getCategories: () => api.get('/categories'),

    // Search products
    searchProducts: (query) => api.get(`/products/search?q=${query}`),

    // Get related products
    getRelatedProducts: (id) => api.get(`/products/${id}/related`)
};

// Order API endpoints
const OrderAPI = {
    // Get user orders
    getUserOrders: (page = 1) => api.get(`/orders?page=${page}`),

    // Get order by ID
    getOrderById: (id) => api.get(`/orders/${id}`),

    // Create order
    createOrder: (data) => api.post('/orders', data),

    // Update order
    updateOrder: (id, data) => api.put(`/orders/${id}`, data),

    // Cancel order
    cancelOrder: (id) => api.post(`/orders/${id}/cancel`),

    // Get order history
    getOrderHistory: () => api.get('/orders/history')
};

// Cart API endpoints
const CartAPI = {
    // Get cart
    getCart: () => api.get('/cart'),

    // Add to cart
    addToCart: (productId, quantity = 1) => {
        return api.post('/cart/items', { productId, quantity });
    },

    // Update cart item
    updateCartItem: (itemId, quantity) => {
        return api.put(`/cart/items/${itemId}`, { quantity });
    },

    // Remove from cart
    removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),

    // Clear cart
    clearCart: () => api.post('/cart/clear'),

    // Checkout
    checkout: (data) => api.post('/cart/checkout', data)
};

// Notification API endpoints
const NotificationAPI = {
    // Get notifications
    getNotifications: (page = 1) => api.get(`/notifications?page=${page}`),

    // Mark as read
    markAsRead: (id) => api.post(`/notifications/${id}/read`),

    // Mark all as read
    markAllAsRead: () => api.post('/notifications/read-all'),

    // Delete notification
    deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

// Initialize API service
const api = new APIService('/api');

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APIService,
        api,
        UserAPI,
        StoreAPI,
        ProductAPI,
        OrderAPI,
        CartAPI,
        NotificationAPI
    };
}