

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
        }
        // ... other posts
    ];

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
                        <button class="action-btn view" title="View" onclick="viewPost(${post.id})">👁️</button>
                        <button class="action-btn edit" title="Edit" onclick="editPost(${post.id})">✏️</button>
                        <button class="action-btn delete" title="Delete" onclick="deletePost(${post.id})">🗑️</button>
                    </div>
                </td>
            `;
            
            postsTableBody.appendChild(row);
        });
    }

    // Posts-specific functions
    window.viewPost = function(postId) {
        alert(`Viewing post #${postId}`);
    };

    window.editPost = function(postId) {
        alert(`Editing post #${postId}`);
    };

    window.deletePost = function(postId) {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            alert(`Post #${postId} deleted`);
        }
    };

    // Initialize
    initializePosts();
});
