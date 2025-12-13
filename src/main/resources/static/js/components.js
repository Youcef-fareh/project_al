/**
 * components.js - Shared Component Rendering Functions
 * Avoids repetition of component rendering across templates
 */

const Components = {
    /**
     * Render product card
     */
    productCard: (product) => `
    <div class="card product-card">
      <div class="card-image">
        <div style="width: 100%; height: 150px; background-color: var(--color-bg-1); display: flex; align-items: center; justify-content: center;">
          📦
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title line-clamp-2">${product.name}</h3>
        <p class="card-category text-sm text-secondary">${product.category}</p>
        <div class="card-rating">⭐ ${product.rating} (${product.reviews} reviews)</div>
        <div class="card-price text-primary font-bold">${String.formatCurrency(product.price)}</div>
        <button class="btn btn-primary btn-block btn-sm" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `,

    /**
     * Render store card
     */
    storeCard: (store) => `
    <a href="/stores/${store.id}" class="card store-card">
      <div class="card-image">
        <div style="width: 100%; height: 150px; background-color: var(--color-bg-1); display: flex; align-items: center; justify-content: center; font-size: 3em;">
          🏪
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${store.name}</h3>
        <div class="card-rating">⭐ ${store.rating}</div>
        <p class="card-followers text-sm text-secondary">${store.followers} followers</p>
        <button class="btn btn-outline btn-block btn-sm" onclick="event.preventDefault(); followStore(${store.id})">Follow</button>
      </div>
    </a>
  `,

    /**
     * Render order item
     */
    orderItem: (order) => `
    <div class="card order-item">
      <div class="order-header flex justify-between items-center">
        <div>
          <h3 class="order-id">Order #${order.id}</h3>
          <p class="order-date text-secondary text-sm">${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="order-status">
          <span class="badge badge-${Components.getStatusColor(order.status)}">${order.status}</span>
        </div>
      </div>
      <div class="order-body">
        <div class="order-items">${order.items?.length || 0} items</div>
        <div class="order-total font-bold">${String.formatCurrency(order.total)}</div>
      </div>
    </div>
  `,

    /**
     * Render pagination controls
     */
    pagination: (currentPage, totalPages) => {
        let html = '';
        if (currentPage > 1) {
            html += `<button onclick="goToPage(${currentPage - 1})" class="btn btn-secondary">← Previous</button>`;
        }
        for (let i = 1; i <= Math.min(totalPages, 5); i++) {
            html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        }
        if (currentPage < totalPages) {
            html += `<button onclick="goToPage(${currentPage + 1})" class="btn btn-secondary">Next →</button>`;
        }
        return html;
    },

    /**
     * Render category item
     */
    categoryItem: (category) => `
    <a href="/catalog/category-details/${category.id}" class="card category-item">
      <div class="card-image">
        <div style="width: 100%; height: 150px; background-color: var(--color-bg-1); display: flex; align-items: center; justify-content: center; font-size: 3em;">
          ${category.icon || '📦'}
        </div>
      </div>
      <div class="card-body text-center">
        <h3 class="card-title">${category.name}</h3>
        <p class="text-secondary text-sm">${category.productCount} products</p>
      </div>
    </a>
  `,

    /**
     * Render empty state
     */
    emptyState: (message = 'No items found', icon = '📭') => `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <p class="empty-message">${message}</p>
    </div>
  `,

    /**
     * Render loading state
     */
    loadingState: () => `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `,

    /**
     * Render error state
     */
    errorState: (message = 'Something went wrong') => `
    <div class="error-state">
      <p class="error-icon">❌</p>
      <p class="error-message">${message}</p>
    </div>
  `,

    /**
     * Render alert/notification
     */
    alert: (message, type = 'info') => `
    <div class="alert alert-${type}">
      <span class="alert-icon">${Components.getAlertIcon(type)}</span>
      <span class="alert-message">${message}</span>
    </div>
  `,

    /**
     * Helper: Get status color
     */
    getStatusColor: (status) => {
        const colors = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'info',
            'delivered': 'success',
            'cancelled': 'error'
        };
        return colors[status] || 'info';
    },

    /**
     * Helper: Get alert icon
     */
    getAlertIcon: (type) => {
        const icons = {
            'success': '✓',
            'error': '✕',
            'warning': '⚠',
            'info': 'ℹ'
        };
        return icons[type] || 'ℹ';
    }
};

/**
 * renderList - Generic list renderer
 * Usage: renderList(container, items, Components.productCard)
 */
function renderList(container, items, template, options = {}) {
    if (!container) return;

    if (!items || items.length === 0) {
        container.innerHTML = Components.emptyState(
            options.emptyMessage || 'No items found',
            options.emptyIcon || '📭'
        );
        return;
    }

    container.innerHTML = items.map(item => template(item)).join('');
}

/**
 * renderGrid - Grid layout renderer
 * Usage: renderGrid(container, items, Components.productCard, 3)
 */
function renderGrid(container, items, template, columns = 3, options = {}) {
    if (!container) return;

    renderList(container, items, template, options);

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    container.style.gap = 'var(--space-lg)';
}