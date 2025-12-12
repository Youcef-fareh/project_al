document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchInput = document.getElementById('searchPosts');
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const postsTableBody = document.getElementById('postsTableBody');
    const emptyState = document.getElementById('emptyState');
    const postsTableContainer = document.querySelector('.posts-table-container');

    // Sample data for posts
    const posts = [
        {
            id: 1,
            title: "Apple MacBook Pro 16\"",
            category: "electronics",
            status: "active",
            price: "125,000 DA",
            views: 1200,
            inquiries: 45,
            date: "Mar 15, 2024",
            timeAgo: "2 days ago",
            image: "https://via.placeholder.com/60"
        },
        {
            id: 2,
            title: "Modern 3-Bedroom Apartment",
            category: "real_estate",
            status: "sold",
            price: "12,500,000 DA",
            views: 5800,
            inquiries: 128,
            date: "Feb 28, 2024",
            timeAgo: "3 weeks ago",
            image: "https://via.placeholder.com/60"
        },
        {
            id: 3,
            title: "Toyota Camry 2020",
            category: "vehicles",
            status: "pending",
            price: "4,800,000 DA",
            views: 850,
            inquiries: 22,
            date: "Mar 17, 2024",
            timeAgo: "Today",
            image: "https://via.placeholder.com/60"
        },
        {
            id: 4,
            title: "Designer Leather Shoes",
            category: "fashion",
            status: "draft",
            price: "8,500 DA",
            views: 0,
            inquiries: 0,
            date: "Mar 16, 2024",
            timeAgo: "1 day ago",
            image: "https://via.placeholder.com/60"
        },
        {
            id: 5,
            title: "Leather Living Room Sofa",
            category: "furniture",
            status: "expired",
            price: "65,000 DA",
            views: 3200,
            inquiries: 67,
            date: "Mar 1, 2024",
            timeAgo: "2 weeks ago",
            image: "https://via.placeholder.com/60"
        }
    ];

    // Status badge classes mapping
    const statusClasses = {
        active: 'status-active',
        pending: 'status-pending',
        draft: 'status-draft',
        sold: 'status-sold',
        expired: 'status-expired'
    };

    // Category display names
    const categoryNames = {
        electronics: 'Electronics',
        real_estate: 'Real Estate',
        vehicles: 'Vehicles',
        fashion: 'Fashion',
        furniture: 'Furniture',
        other: 'Other'
    };

    // Initialize posts
    function initializePosts() {
        renderPosts(posts);
    }

    // Render posts to table
    function renderPosts(postsToRender) {
        if (postsToRender.length === 0) {
            postsTableContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        postsTableContainer.style.display = 'block';
        emptyState.style.display = 'none';

        postsTableBody.innerHTML = '';

        postsToRender.forEach(post => {
            const row = document.createElement('tr');
            row.dataset.postId = post.id;
            row.dataset.status = post.status;
            row.dataset.category = post.category;

            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: var(--space-12);">
                        <div class="post-image">
                            <img src="${post.image}" alt="${post.title}">
                        </div>
                        <div class="post-info">
                            <h3>${post.title}</h3>
                            <span class="category">${categoryNames[post.category]}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${statusClasses[post.status]}">${capitalizeFirstLetter(post.status)}</span>
                </td>
                <td>
                    <div class="price">${post.price}</div>
                </td>
                <td>
                    <div class="stats">
                        <div class="stat-item">
                            <span class="icon">👁️</span>
                            <span>${formatNumber(post.views)} views</span>
                        </div>
                        <div class="stat-item">
                            <span class="icon">💬</span>
                            <span>${post.inquiries} inquiries</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div>${post.date}</div>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${post.timeAgo}</div>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn view" title="View" onclick="viewPost(${post.id})">
                            👁️
                        </button>
                        <button class="action-btn edit" title="Edit" onclick="editPost(${post.id})">
                            ✏️
                        </button>
                        <button class="action-btn delete" title="Delete" onclick="deletePost(${post.id})">
                            🗑️
                        </button>
                    </div>
                </td>
            `;

            postsTableBody.appendChild(row);
        });
    }

    // Filter posts based on search and filters
    function filterPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const categoryValue = categoryFilter.value;

        const filteredPosts = posts.filter(post => {
            const matchesSearch = searchTerm === '' ||
                post.title.toLowerCase().includes(searchTerm) ||
                categoryNames[post.category].toLowerCase().includes(searchTerm);

            const matchesStatus = statusValue === '' || post.status === statusValue;
            const matchesCategory = categoryValue === '' || post.category === categoryValue;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        renderPosts(filteredPosts);
    }

    // Utility functions
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Action functions
    window.viewPost = function(postId) {
        alert(`Viewing post #${postId}`);
        // In a real app: window.location.href = `/posts/${postId}`;
    };

    window.editPost = function(postId) {
        alert(`Editing post #${postId}`);
        // In a real app: window.location.href = `/posts/${postId}/edit`;
    };

    window.deletePost = function(postId) {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            alert(`Post #${postId} deleted`);
            // In a real app: API call to delete post
        }
    };

    // Export function
    function exportPosts() {
        alert('Exporting posts data...');
        // In a real app: generate and download CSV/Excel file
    }

    // Refresh function
    function refreshPosts() {
        // Show loading state
        const refreshIcon = refreshBtn.querySelector('span:first-child');
        const originalIcon = refreshIcon.textContent;
        refreshIcon.textContent = '⏳';

        // Simulate API call
        setTimeout(() => {
            refreshIcon.textContent = originalIcon;
            filterPosts();
            showNotification('Posts refreshed successfully', 'success');
        }, 1000);
    }

    // Notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: var(--space-12) var(--space-16);
            background-color: ${type === 'success' ? 'var(--color-success)' : 'var(--color-primary)'};
            color: white;
            border-radius: var(--radius-base);
            box-shadow: var(--shadow-md);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Event Listeners
    searchInput.addEventListener('input', filterPosts);
    statusFilter.addEventListener('change', filterPosts);
    categoryFilter.addEventListener('change', filterPosts);
    exportBtn.addEventListener('click', exportPosts);
    refreshBtn.addEventListener('click', refreshPosts);

    // Initialize
    initializePosts();
});