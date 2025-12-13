/**
 * handlers.js - Shared Event Handlers & Utilities
 * Avoids repetition of common event handling logic
 */

const Handlers = {
    /**
     * Setup search handler with debouncing
     */
    search: (selector, callback, delay = 300) => {
        const element = DOM.get(selector);
        if (element) {
            DOM.on(element, 'input', Async.debounce((e) => {
                const query = e.target.value;
                if (query.length > 0) {
                    callback(query);
                }
            }, delay));
        }
    },

    /**
     * Setup filter handler
     */
    filter: (selector, callback) => {
        const element = DOM.get(selector);
        if (element) {
            DOM.on(element, 'change', (e) => {
                callback(e.target.value);
            });
        }
    },

    /**
     * Setup sort handler
     */
    sort: (selector, callback) => {
        const element = DOM.get(selector);
        if (element) {
            DOM.on(element, 'change', (e) => {
                callback(e.target.value);
            });
        }
    },

    /**
     * Setup pagination
     */
    pagination: (selector, currentPage, totalPages, callback) => {
        const html = Components.pagination(currentPage, totalPages);
        const container = DOM.get(selector);
        if (container) {
            container.innerHTML = html;
            DOM.getAll('.pagination button').forEach(btn => {
                DOM.on(btn, 'click', () => {
                    const page = parseInt(btn.textContent);
                    if (!isNaN(page)) callback(page);
                });
            });
        }
    },

    /**
     * Add to cart with auth check
     */
    addToCart: async (productId, quantity = 1) => {
        if (!authService.isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        try {
            await CartAPI.addToCart(productId, quantity);
            app.showNotification('Added to cart ✓', 'success');
        } catch (error) {
            app.showNotification('Failed to add to cart', 'error');
        }
    },

    /**
     * Follow store with auth check
     */
    followStore: async (storeId) => {
        if (!authService.isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        try {
            // API call would go here
            app.showNotification('Store followed ✓', 'success');
        } catch (error) {
            app.showNotification('Failed to follow store', 'error');
        }
    },

    /**
     * Add to wishlist with auth check
     */
    addToWishlist: async (productId) => {
        if (!authService.isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        try {
            // API call would go here
            app.showNotification('Added to wishlist ✓', 'success');
        } catch (error) {
            app.showNotification('Failed to add to wishlist', 'error');
        }
    },

    /**
     * Generic form submission handler
     */
    submitForm: async (formSelector, endpoint, method = 'POST', onSuccess = null) => {
        const form = DOM.get(formSelector);
        if (!form) return;

        DOM.on(form, 'submit', async (e) => {
            e.preventDefault();

            if (!form.checkValidity()) {
                app.showNotification('Please fill all required fields', 'error');
                return;
            }

            try {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);

                const response = await APIService.request(endpoint, method, data);

                app.showNotification('Success! ✓', 'success');
                if (onSuccess) onSuccess(response);
                form.reset();
            } catch (error) {
                app.showNotification(error.message || 'Failed to submit', 'error');
            }
        });
    },

    /**
     * Toggle sidebar on mobile
     */
    toggleSidebar: () => {
        const sidebar = DOM.get('#sidebar');
        if (sidebar) {
            DOM.toggleClass(sidebar, 'active');
        }
    }
};

// Global handler shortcuts
function addToCart(productId, quantity = 1) {
    return Handlers.addToCart(productId, quantity);
}

function followStore(storeId) {
    return Handlers.followStore(storeId);
}

function addToWishlist(productId) {
    return Handlers.addToWishlist(productId);
}

function toggleSidebar() {
    return Handlers.toggleSidebar();
}

function goToPage(page) {
    currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reload data for current page - implementation depends on context
}

/**
 * DataManager - Shared data loading and management
 */
const DataManager = {
    /**
     * Load list data
     */
    loadList: async (endpoint, options = {}) => {
        try {
            const page = options.page || 1;
            const limit = options.limit || 20;
            const url = `${endpoint}?page=${page}&limit=${limit}`;

            const response = await APIService.request(url, 'GET');
            return response;
        } catch (error) {
            app.showNotification('Failed to load data', 'error');
            throw error;
        }
    },

    /**
     * Load single item
     */
    loadItem: async (endpoint) => {
        try {
            const response = await APIService.request(endpoint, 'GET');
            return response;
        } catch (error) {
            app.showNotification('Failed to load item', 'error');
            throw error;
        }
    },

    /**
     * Create item
     */
    createItem: async (endpoint, data) => {
        try {
            const response = await APIService.request(endpoint, 'POST', data);
            app.showNotification('Created successfully ✓', 'success');
            return response;
        } catch (error) {
            app.showNotification(error.message || 'Failed to create', 'error');
            throw error;
        }
    },

    /**
     * Update item
     */
    updateItem: async (endpoint, data) => {
        try {
            const response = await APIService.request(endpoint, 'PUT', data);
            app.showNotification('Updated successfully ✓', 'success');
            return response;
        } catch (error) {
            app.showNotification(error.message || 'Failed to update', 'error');
            throw error;
        }
    },

    /**
     * Delete item
     */
    deleteItem: async (endpoint) => {
        if (!confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await APIService.request(endpoint, 'DELETE');
            app.showNotification('Deleted successfully ✓', 'success');
            return true;
        } catch (error) {
            app.showNotification(error.message || 'Failed to delete', 'error');
            throw error;
        }
    }
};