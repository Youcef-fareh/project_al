/**
 * Utility Functions
 * Common helper functions for the application
 */

// DOM Helpers
const DOM = {
    // Get single element
    get: (selector) => document.querySelector(selector),

    // Get multiple elements
    getAll: (selector) => document.querySelectorAll(selector),

    // Create element with attributes
    create: (tag, attributes = {}, content = '') => {
        const el = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                el.className = value;
            } else if (key === 'data') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    el.dataset[dataKey] = dataValue;
                });
            } else {
                el.setAttribute(key, value);
            }
        });
        if (content) el.innerHTML = content;
        return el;
    },

    // Add event listener
    on: (el, event, handler) => {
        if (el) el.addEventListener(event, handler);
    },

    // Remove event listener
    off: (el, event, handler) => {
        if (el) el.removeEventListener(event, handler);
    },

    // Add class
    addClass: (el, className) => {
        if (el) el.classList.add(className);
    },

    // Remove class
    removeClass: (el, className) => {
        if (el) el.classList.remove(className);
    },

    // Toggle class
    toggleClass: (el, className) => {
        if (el) el.classList.toggle(className);
    },

    // Check if has class
    hasClass: (el, className) => {
        return el ? el.classList.contains(className) : false;
    },

    // Set attribute
    attr: (el, name, value) => {
        if (el) {
            if (value === undefined) {
                return el.getAttribute(name);
            }
            el.setAttribute(name, value);
        }
    },

    // Get/Set text
    text: (el, content) => {
        if (!el) return;
        if (content === undefined) {
            return el.textContent;
        }
        el.textContent = content;
    },

    // Get/Set HTML
    html: (el, content) => {
        if (!el) return;
        if (content === undefined) {
            return el.innerHTML;
        }
        el.innerHTML = content;
    },

    // Show element
    show: (el) => {
        if (el) el.style.display = '';
    },

    // Hide element
    hide: (el) => {
        if (el) el.style.display = 'none';
    },

    // Toggle visibility
    toggle: (el) => {
        if (el) el.style.display = el.style.display === 'none' ? '' : 'none';
    }
};

// String Utilities
const String = {
    // Capitalize first letter
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),

    // Convert to slug
    toSlug: (str) => str.toLowerCase().replace(/[^\w]+/g, '-'),

    // Format currency
    formatCurrency: (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    // Format date
    formatDate: (date, locale = 'en-US') => {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Truncate string
    truncate: (str, length = 100) => {
        return str.length > length ? str.substring(0, length) + '...' : str;
    },

    // Escape HTML
    escapeHtml: (str) => {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Array Utilities
const Array = {
    // Unique values
    unique: (arr) => [...new Set(arr)],

    // Group by property
    groupBy: (arr, key) => {
        return arr.reduce((acc, item) => {
            const group = item[key];
            if (!acc[group]) acc[group] = [];
            acc[group].push(item);
            return acc;
        }, {});
    },

    // Sort by property
    sortBy: (arr, key, order = 'asc') => {
        const sorted = [...arr].sort((a, b) => {
            if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    },

    // Filter by property
    filterBy: (arr, key, value) => {
        return arr.filter(item => item[key] === value);
    }
};

// Validation Utilities
const Validation = {
    // Email validation
    isEmail: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    // Phone validation
    isPhone: (phone) => {
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    // URL validation
    isUrl: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    // Password strength
    getPasswordStrength: (password) => {
        if (password.length < 6) return 'weak';
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium';
        if (!/[^a-zA-Z0-9]/.test(password)) return 'medium';
        return 'strong';
    },

    // Is empty
    isEmpty: (value) => {
        return value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0) ||
            (typeof value === 'object' && Object.keys(value).length === 0);
    }
};

// Storage Utilities
const Storage = {
    // Get from localStorage
    get: (key) => {
        const item = localStorage.getItem(key);
        try {
            return item ? JSON.parse(item) : null;
        } catch {
            return item;
        }
    },

    // Set to localStorage
    set: (key, value) => {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    },

    // Remove from localStorage
    remove: (key) => {
        localStorage.removeItem(key);
    },

    // Clear all localStorage
    clear: () => {
        localStorage.clear();
    }
};

// Promise & Async Utilities
const Async = {
    // Delay execution
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

    // Retry function
    retry: async (fn, retries = 3, delay = 1000) => {
        for (let i = 0; i < retries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === retries - 1) throw error;
                await Async.delay(delay);
            }
        }
    },

    // Debounce function
    debounce: (fn, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                fn(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (fn, wait) => {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= wait) {
                fn(...args);
                lastTime = now;
            }
        };
    }
};

// Console Utilities for Development
const Log = {
    // Info
    info: (message, data = null) => {
        console.log(`%c[INFO] ${message}`, 'color: #3b82f6;', data || '');
    },

    // Success
    success: (message, data = null) => {
        console.log(`%c[SUCCESS] ${message}`, 'color: #10b981;', data || '');
    },

    // Warning
    warn: (message, data = null) => {
        console.warn(`%c[WARNING] ${message}`, 'color: #f59e0b;', data || '');
    },

    // Error
    error: (message, data = null) => {
        console.error(`%c[ERROR] ${message}`, 'color: #ef4444;', data || '');
    }
};

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOM, String, Array, Validation, Storage, Async, Log };}