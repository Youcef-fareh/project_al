/**
 * Authentication Service
 * Handles user authentication, session management
 */

class AuthService {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        this.listeners = [];
    }

    /**
     * Subscribe to auth changes
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    /**
     * Notify listeners of auth changes
     */
    notify() {
        this.listeners.forEach(callback => callback(this.isAuthenticated, this.user));
    }

    /**
     * Register new user
     */
    async register(email, password, name) {
        try {
            const response = await UserAPI.register({ email, password, name });
            this.setUser(response.user, response.token);
            return response;
        } catch (error) {
            Log.error('Registration failed', error);
            throw error;
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            const response = await UserAPI.login(email, password);
            this.setUser(response.user, response.token);
            return response;
        } catch (error) {
            Log.error('Login failed', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await UserAPI.logout();
            this.clearUser();
        } catch (error) {
            Log.error('Logout failed', error);
            this.clearUser();
        }
    }

    /**
     * Set user and token
     */
    setUser(user, token) {
        this.user = user;
        this.isAuthenticated = true;
        Storage.set('auth_token', token);
        Storage.set('auth_user', user);
        this.notify();
    }

    /**
     * Clear user and token
     */
    clearUser() {
        this.user = null;
        this.isAuthenticated = false;
        Storage.remove('auth_token');
        Storage.remove('auth_user');
        this.notify();
    }

    /**
     * Get current user
     */
    getUser() {
        return this.user || Storage.get('auth_user');
    }

    /**
     * Check if user is authenticated
     */
    isLoggedIn() {
        return !!Storage.get('auth_token');
    }

    /**
     * Refresh user session
     */
    async refreshSession() {
        try {
            const response = await UserAPI.getCurrentUser();
            this.user = response;
            Storage.set('auth_user', response);
            return response;
        } catch (error) {
            this.clearUser();
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(data) {
        try {
            const response = await UserAPI.updateProfile(data);
            this.setUser(response, Storage.get('auth_token'));
            return response;
        } catch (error) {
            Log.error('Profile update failed', error);
            throw error;
        }
    }

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        if (!this.user) return false;
        return this.user.permissions?.includes(permission) || this.user.role === 'admin';
    }
}

/**
 * Permission Guard
 */
class PermissionGuard {
    constructor(authService) {
        this.auth = authService;
    }

    /**
     * Require authentication
     */
    requireAuth(callback) {
        if (!this.auth.isLoggedIn()) {
            this.redirectToLogin();
            return;
        }
        callback();
    }

    /**
     * Require specific permission
     */
    requirePermission(permission, callback) {
        if (!this.auth.hasPermission(permission)) {
            this.redirectToUnauthorized();
            return;
        }
        callback();
    }

    /**
     * Require specific role
     */
    requireRole(role, callback) {
        if (this.auth.getUser()?.role !== role) {
            this.redirectToUnauthorized();
            return;
        }
        callback();
    }

    /**
     * Redirect to login
     */
    redirectToLogin() {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    }

    /**
     * Redirect to unauthorized page
     */
    redirectToUnauthorized() {
        window.location.href = '/unauthorized';
    }
}

/**
 * Session Manager
 */
class SessionManager {
    constructor(authService, timeout = 30 * 60 * 1000) { // 30 minutes default
        this.auth = authService;
        this.timeout = timeout;
        this.timeoutId = null;
        this.warningTime = 5 * 60 * 1000; // Warn 5 minutes before timeout
        this.init();
    }

    /**
     * Initialize session manager
     */
    init() {
        if (this.auth.isLoggedIn()) {
            this.startSessionTimer();
            this.attachActivityListeners();
        }

        this.auth.subscribe((isAuthenticated) => {
            if (isAuthenticated) {
                this.startSessionTimer();
                this.attachActivityListeners();
            } else {
                this.clearSessionTimer();
                this.removeActivityListeners();
            }
        });
    }

    /**
     * Start session timer
     */
    startSessionTimer() {
        this.clearSessionTimer();
        this.timeoutId = setTimeout(() => {
            this.handleTimeout();
        }, this.timeout);
    }

    /**
     * Clear session timer
     */
    clearSessionTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    /**
     * Reset session timer on activity
     */
    resetTimer() {
        if (this.auth.isLoggedIn()) {
            this.startSessionTimer();
        }
    }

    /**
     * Handle session timeout
     */
    handleTimeout() {
        this.auth.logout();
        this.showTimeoutMessage();
    }

    /**
     * Show timeout message
     */
    showTimeoutMessage() {
        alert('Your session has expired. Please login again.');
        window.location.href = '/login';
    }

    /**
     * Attach activity listeners
     */
    attachActivityListeners() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handler = () => this.resetTimer();

        events.forEach(event => {
            document.addEventListener(event, handler);
        });
    }

    /**
     * Remove activity listeners
     */
    removeActivityListeners() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handler = () => this.resetTimer();

        events.forEach(event => {
            document.removeEventListener(event, handler);
        });
    }
}

// Initialize auth service
const authService = new AuthService();

// Check if user was previously logged in
if (Storage.get('auth_token') && Storage.get('auth_user')) {
    authService.user = Storage.get('auth_user');
    authService.isAuthenticated = true;
}

// Initialize permission guard
const permissionGuard = new PermissionGuard(authService);

// Initialize session manager
const sessionManager = new SessionManager(authService);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AuthService,
        PermissionGuard,
        SessionManager,
        authService,
        permissionGuard,
        sessionManager
    };
}