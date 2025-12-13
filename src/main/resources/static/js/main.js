/**
 * Main Application Script
 * Initializes the application and handles global events
 */

// App Configuration
const AppConfig = {
    name: 'Oudkeniss',
    version: '1.0.0',
    apiUrl: '/api',
    environment: 'production'
};

/**
 * Main Application Class
 */
class Application {
    constructor() {
        this.initialized = false;
        this.modules = {};
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            Log.info('Initializing application...');

            // Setup global event listeners
            this.setupGlobalListeners();

            // Initialize modules
            this.initializeModules();

            // Setup navigation
            this.setupNavigation();

            // Setup tooltips and popovers
            this.setupTooltips();

            // Check authentication
            await this.checkAuth();

            this.initialized = true;
            Log.success('Application initialized successfully');

            // Emit init event
            document.dispatchEvent(new CustomEvent('app:init'));
        } catch (error) {
            Log.error('Failed to initialize application', error);
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Close modals on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Prevent form submission on Enter in search
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('search-form')) {
                e.preventDefault();
                this.handleSearch(e.target);
            }
        });

        // Handle dynamic links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-link]');
            if (link) {
                e.preventDefault();
                this.navigate(link.dataset.link);
            }
        });

        // Handle modal triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal-trigger]');
            if (trigger) {
                e.preventDefault();
                this.openModal(trigger.dataset.modalTrigger);
            }
        });

        // Handle modal close buttons
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('[data-modal-close]');
            if (closeBtn) {
                e.preventDefault();
                const modal = closeBtn.closest('.modal');
                if (modal) this.closeModal(modal);
            }
        });

        // Window resize for responsive adjustments
        window.addEventListener('resize', Async.debounce(() => {
            document.dispatchEvent(new CustomEvent('window:resize'));
        }, 250));
    }

    /**
     * Initialize modules
     */
    initializeModules() {
        // Example: Initialize cart module
        if (typeof CartModule !== 'undefined') {
            this.modules.cart = new CartModule();
            this.modules.cart.init();
        }

        // Example: Initialize notification module
        if (typeof NotificationModule !== 'undefined') {
            this.modules.notifications = new NotificationModule();
            this.modules.notifications.init();
        }

        // Example: Initialize search module
        if (typeof SearchModule !== 'undefined') {
            this.modules.search = new SearchModule();
            this.modules.search.init();
        }
    }

    /**
     * Setup navigation
     */
    setupNavigation() {
        const navLinks = DOM.getAll('[data-nav]');
        navLinks.forEach(link => {
            DOM.on(link, 'click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                if (href) this.navigate(href);
            });
        });
    }

    /**
     * Setup tooltips
     */
    setupTooltips() {
        const tooltips = DOM.getAll('[data-tooltip]');
        tooltips.forEach(el => {
            const tooltipText = el.dataset.tooltip;
            DOM.on(el, 'mouseenter', () => {
                this.showTooltip(el, tooltipText);
            });
            DOM.on(el, 'mouseleave', () => {
                this.hideTooltip(el);
            });
        });
    }

    /**
     * Check authentication
     */
    async checkAuth() {
        if (authService.isLoggedIn()) {
            try {
                await authService.refreshSession();
                this.updateAuthUI();
            } catch (error) {
                Log.warn('Session refresh failed, logging out');
                authService.logout();
            }
        }
    }

    /**
     * Update UI based on auth state
     */
    updateAuthUI() {
        const authContainer = DOM.get('[data-auth-container]');
        if (!authContainer) return;

        if (authService.isLoggedIn()) {
            DOM.removeClass(authContainer, 'hidden');
            const user = authService.getUser();
            const userNameEl = DOM.get('[data-user-name]');
            if (userNameEl && user) {
                DOM.text(userNameEl, user.name || user.email);
            }
        } else {
            DOM.addClass(authContainer, 'hidden');
        }
    }

    /**
     * Navigate to page
     */
    navigate(href) {
        window.location.href = href;
    }

    /**
     * Open modal
     */
    openModal(modalId) {
        const modal = DOM.get(`#${modalId}`);
        if (modal) {
            DOM.addClass(modal, 'active');
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        DOM.removeClass(modal, 'active');
        document.body.style.overflow = '';
    }

    /**
     * Close all modals
     */
    closeAllModals() {
        DOM.getAll('.modal.active').forEach(modal => {
            this.closeModal(modal);
        });
    }

    /**
     * Show tooltip
     */
    showTooltip(el, text) {
        const tooltip = DOM.create('div', {
            class: 'tooltip',
            'data-tooltip-content': ''
        }, text);

        document.body.appendChild(tooltip);

        const rect = el.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';

        el.tooltipElement = tooltip;
    }

    /**
     * Hide tooltip
     */
    hideTooltip(el) {
        if (el.tooltipElement) {
            el.tooltipElement.remove();
            delete el.tooltipElement;
        }
    }

    /**
     * Handle search
     */
    handleSearch(form) {
        const query = form.querySelector('input[type="search"]').value;
        if (query.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = DOM.create('div', {
            class: `alert alert-${type}`,
            role: 'alert'
        }, message);

        const container = DOM.get('[data-notification-container]') || document.body;
        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loader = DOM.get('[data-loader]');
        if (loader) DOM.show(loader);
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = DOM.get('[data-loader]');
        if (loader) DOM.hide(loader);
    }
}

/**
 * Notification Module
 */
class NotificationModule {
    constructor() {
        this.container = DOM.get('[data-notifications]');
        this.count = 0;
    }

    init() {
        if (!this.container) return;
        this.loadNotifications();

        // Refresh notifications every 30 seconds
        setInterval(() => this.loadNotifications(), 30000);
    }

    async loadNotifications() {
        try {
            const response = await NotificationAPI.getNotifications();
            this.count = response.total || 0;
            this.updateBadge();
        } catch (error) {
            Log.error('Failed to load notifications', error);
        }
    }

    updateBadge() {
        const badge = DOM.get('[data-notification-badge]');
        if (badge) {
            if (this.count > 0) {
                DOM.text(badge, this.count);
                DOM.removeClass(badge, 'hidden');
            } else {
                DOM.addClass(badge, 'hidden');
            }
        }
    }

    markAsRead(id) {
        NotificationAPI.markAsRead(id).catch(error => {
            Log.error('Failed to mark notification as read', error);
        });
    }
}

/**
 * Cart Module
 */
class CartModule {
    constructor() {
        this.items = [];
        this.total = 0;
    }

    init() {
        this.loadCart();

        // Listen for cart updates
        document.addEventListener('cart:update', () => this.loadCart());
    }

    async loadCart() {
        try {
            const response = await CartAPI.getCart();
            this.items = response.items || [];
            this.total = response.total || 0;
            this.updateUI();
        } catch (error) {
            Log.error('Failed to load cart', error);
        }
    }

    async addItem(productId, quantity = 1) {
        try {
            await CartAPI.addToCart(productId, quantity);
            this.loadCart();
            document.dispatchEvent(new CustomEvent('cart:itemAdded', {
                detail: { productId, quantity }
            }));
        } catch (error) {
            Log.error('Failed to add item to cart', error);
        }
    }

    updateUI() {
        const count = DOM.get('[data-cart-count]');
        if (count) {
            DOM.text(count, this.items.length);
        }

        const total = DOM.get('[data-cart-total]');
        if (total) {
            DOM.text(total, String.formatCurrency(this.total));
        }
    }
}

/**
 * Search Module
 */
class SearchModule {
    constructor() {
        this.searchInput = DOM.get('[data-search-input]');
        this.searchResults = DOM.get('[data-search-results]');
    }

    init() {
        if (!this.searchInput) return;

        const handleSearch = Async.debounce((query) => {
            this.search(query);
        }, 300);

        DOM.on(this.searchInput, 'input', (e) => {
            handleSearch(e.target.value);
        });
    }

    async search(query) {
        if (!query.trim()) {
            DOM.hide(this.searchResults);
            return;
        }

        try {
            const response = await ProductAPI.searchProducts(query);
            this.displayResults(response.items || []);
        } catch (error) {
            Log.error('Search failed', error);
        }
    }

    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<p class="p-md">No results found</p>';
        } else {
            this.searchResults.innerHTML = results
                .slice(0, 5)
                .map(item => `
          <a href="/products/${item.id}" class="search-result-item p-md border-bottom">
            <h6>${item.name}</h6>
            <p class="text-sm text-secondary">${String.formatCurrency(item.price)}</p>
          </a>
        `)
                .join('');
        }
        DOM.show(this.searchResults);
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Application();
    window.app.init();
});

// Global error handler
window.addEventListener('error', (event) => {
    Log.error('Global error', event.error);
    if (window.app) {
        window.app.showNotification('An unexpected error occurred', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    Log.error('Unhandled promise rejection', event.reason);
    if (window.app) {
        window.app.showNotification('An error occurred. Please try again.', 'error');
    }
});