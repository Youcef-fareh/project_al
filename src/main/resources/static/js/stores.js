document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const createStoreBtn = document.getElementById('createStoreBtn');
    const createStoreEmptyBtn = document.getElementById('createStoreEmptyBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchStores');
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const viewBtns = document.querySelectorAll('.view-btn');
    const storesGridView = document.getElementById('storesGridView');
    const storesTableView = document.getElementById('storesTableView');
    const storesTableBody = document.getElementById('storesTableBody');
    const emptyState = document.getElementById('emptyState');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    const alertMessage = document.getElementById('alertMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Modal Elements
    const storeModal = document.getElementById('storeModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeStoreModal = document.getElementById('closeStoreModal');
    const cancelStoreBtn = document.getElementById('cancelStoreBtn');
    const saveStoreBtn = document.getElementById('saveStoreBtn');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const confirmDeleteInput = document.getElementById('confirmDelete');
    const deleteStoreName = document.getElementById('deleteStoreName');
    const modalTitle = document.getElementById('modalTitle');
    const storeForm = document.getElementById('storeForm');

    // Form Elements
    const storeBanner = document.getElementById('storeBanner');
    const storeLogo = document.getElementById('storeLogo');
    const bannerPreview = document.getElementById('bannerPreview');
    const logoPreview = document.getElementById('logoPreview');
    const bannerUpload = document.getElementById('bannerUpload');
    const logoUpload = document.getElementById('logoUpload');

    // Sample stores data
    const stores = [
        {
            id: 1,
            name: "Tech Gadgets Store",
            description: "Latest electronics, smartphones, laptops, and accessories with warranty and fast delivery.",
            category: "electronics",
            status: "active",
            location: "Algiers",
            contact: "tech@gadgets.com",
            banner: "https://via.placeholder.com/400x180/33B0C6/ffffff?text=Tech+Gadgets+Store",
            logo: "https://via.placeholder.com/72/33B0C6/ffffff?text=TG",
            products: 78,
            sales: 1200,
            revenue: "85,400 DA",
            rating: 4.8,
            orders: 32,
            established: "2022"
        },
        {
            id: 2,
            name: "Urban Fashion",
            description: "Trendy clothing, shoes, and accessories for men and women. Latest fashion trends.",
            category: "fashion",
            status: "active",
            location: "Oran",
            contact: "info@urbanfashion.com",
            banner: "https://via.placeholder.com/400x180/FF6B6B/ffffff?text=Urban+Fashion",
            logo: "https://via.placeholder.com/72/FF6B6B/ffffff?text=UF",
            products: 45,
            sales: 856,
            revenue: "32,150 DA",
            rating: 4.5,
            orders: 24,
            established: "2021"
        },
        {
            id: 3,
            name: "Home Essentials",
            description: "Furniture, home decor, kitchenware, and everything for your beautiful home.",
            category: "home",
            status: "pending",
            location: "Constantine",
            contact: "support@homeessentials.com",
            banner: "https://via.placeholder.com/400x180/FFD166/333333?text=Home+Essentials",
            logo: "https://via.placeholder.com/72/FFD166/333333?text=HE",
            products: 25,
            sales: 142,
            revenue: "8,250 DA",
            rating: 4.2,
            orders: 12,
            established: "2023"
        }
    ];

    // Current store being edited/deleted
    let currentStoreId = null;
    let isEditing = false;

    // Initialize the page
    function initializePage() {
        // Load stores data
        loadStores();

        // Update stats
        updateStats();

        // Set up event listeners
        setupEventListeners();

        // Initialize table view
        populateTable();
    }

    // Load stores into grid view
    function loadStores(filteredStores = stores) {
        if (filteredStores.length === 0) {
            storesGridView.style.display = 'none';
            storesTableView.classList.remove('active');
            emptyState.style.display = 'block';
            return;
        }

        storesGridView.style.display = 'grid';
        emptyState.style.display = 'none';

        // Note: The grid view cards are already in the HTML
        // We just need to filter them based on search/filters
        filterGridStores();
    }

    // Filter stores in grid view
    function filterGridStores() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const categoryValue = categoryFilter.value;

        const storeCards = document.querySelectorAll('.store-card');

        storeCards.forEach(card => {
            const storeName = card.querySelector('h3').textContent.toLowerCase();
            const storeStatus = card.dataset.status;
            const storeCategory = card.dataset.category;

            const matchesSearch = searchTerm === '' || storeName.includes(searchTerm);
            const matchesStatus = statusValue === '' || storeStatus === statusValue;
            const matchesCategory = categoryValue === '' || storeCategory === categoryValue;

            if (matchesSearch && matchesStatus && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Check if any cards are visible
        const visibleCards = Array.from(storeCards).some(card => card.style.display !== 'none');
        if (!visibleCards) {
            storesGridView.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            storesGridView.style.display = 'grid';
            emptyState.style.display = 'none';
        }
    }

    // Populate table view
    function populateTable() {
        storesTableBody.innerHTML = '';

        stores.forEach(store => {
            const row = document.createElement('tr');
            row.dataset.storeId = store.id;

            row.innerHTML = `
                <td>
                    <div class="table-store-info">
                        <div class="table-store-logo">
                            <img src="${store.logo}" alt="${store.name}">
                        </div>
                        <div class="table-store-details">
                            <h4>${store.name}</h4>
                            <p>${store.category}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <span class="store-status status-${store.status}">${capitalizeFirstLetter(store.status)}</span>
                </td>
                <td>
                    <div class="stat-value">${store.products}</div>
                </td>
                <td>
                    <div class="stat-value">${store.sales}</div>
                </td>
                <td>
                    <div class="stat-value">${store.revenue}</div>
                </td>
                <td>
                    <div class="store-rating">
                        <span>⭐</span>
                        <span>${store.rating}</span>
                    </div>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="table-btn view" title="View" onclick="viewStore(${store.id})">
                            👁️
                        </button>
                        <button class="table-btn edit" title="Edit" onclick="editStore(${store.id})">
                            ✏️
                        </button>
                        <button class="table-btn delete" title="Delete" onclick="deleteStore(${store.id})">
                            🗑️
                        </button>
                    </div>
                </td>
            `;

            storesTableBody.appendChild(row);
        });
    }

    // Update stats
    function updateStats() {
        const totalStores = stores.length;
        const totalProducts = stores.reduce((sum, store) => sum + store.products, 0);
        const totalSales = stores.reduce((sum, store) => sum + store.sales, 0);
        const totalRevenue = stores.reduce((sum, store) => {
            const revenue = parseInt(store.revenue.replace(/[^0-9]/g, ''));
            return sum + (isNaN(revenue) ? 0 : revenue);
        }, 0);

        document.getElementById('totalStores').textContent = totalStores;
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalSales').textContent = totalSales;
        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Store creation
        createStoreBtn.addEventListener('click', () => openCreateStoreModal());
        createStoreEmptyBtn.addEventListener('click', () => openCreateStoreModal());

        // Modal controls
        closeStoreModal.addEventListener('click', () => closeModal(storeModal));
        cancelStoreBtn.addEventListener('click', () => closeModal(storeModal));
        saveStoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleSaveStore();
        });

        closeDeleteModal.addEventListener('click', () => closeModal(deleteModal));
        cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));
        confirmDeleteBtn.addEventListener('click', handleConfirmDelete);

        // Store form submission
        storeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSaveStore();
        });

        // File uploads
        bannerUpload.addEventListener('click', () => storeBanner.click());
        logoUpload.addEventListener('click', () => storeLogo.click());

        storeBanner.addEventListener('change', (e) => previewImage(e, bannerPreview));
        storeLogo.addEventListener('change', (e) => previewImage(e, logoPreview));

        // Drag and drop for file uploads
        ['dragover', 'dragleave', 'drop'].forEach(eventName => {
            bannerUpload.addEventListener(eventName, preventDefaults);
            logoUpload.addEventListener(eventName, preventDefaults);
        });

        ['dragover'].forEach(eventName => {
            bannerUpload.addEventListener(eventName, () => bannerUpload.classList.add('dragover'));
            logoUpload.addEventListener(eventName, () => logoUpload.classList.add('dragover'));
        });

        ['dragleave', 'drop'].forEach(eventName => {
            bannerUpload.addEventListener(eventName, () => bannerUpload.classList.remove('dragover'));
            logoUpload.addEventListener(eventName, () => logoUpload.classList.remove('dragover'));
        });

        bannerUpload.addEventListener('drop', (e) => handleDrop(e, storeBanner, bannerPreview));
        logoUpload.addEventListener('drop', (e) => handleDrop(e, storeLogo, logoPreview));

        // Search and filters
        searchInput.addEventListener('input', filterGridStores);
        statusFilter.addEventListener('change', filterGridStores);
        categoryFilter.addEventListener('change', filterGridStores);

        // View toggle
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;
                switchView(view);
            });
        });

        // Refresh button
        refreshBtn.addEventListener('click', refreshStores);
    }

    // Open create store modal
    function openCreateStoreModal() {
        isEditing = false;
        modalTitle.textContent = 'Create New Store';
        storeForm.reset();
        bannerPreview.innerHTML = '';
        logoPreview.innerHTML = '';
        currentStoreId = null;
        openModal(storeModal);
    }

    // Open edit store modal
    function openEditStoreModal(storeId) {
        isEditing = true;
        modalTitle.textContent = 'Edit Store';

        const store = stores.find(s => s.id === storeId);
        if (!store) return;

        currentStoreId = storeId;

        // Fill form with store data
        document.getElementById('storeName').value = store.name;
        document.getElementById('storeDescription').value = store.description;
        document.getElementById('storeCategory').value = store.category;
        document.getElementById('storeStatus').value = store.status;
        document.getElementById('storeLocation').value = store.location;
        document.getElementById('storeContact').value = store.contact;

        // Preview images
        bannerPreview.innerHTML = `
            <div class="preview-item">
                <img src="${store.banner}" alt="Store Banner">
                <button type="button" class="remove-image" onclick="removePreview(this)">×</button>
            </div>
        `;

        logoPreview.innerHTML = `
            <div class="preview-item">
                <img src="${store.logo}" alt="Store Logo">
                <button type="button" class="remove-image" onclick="removePreview(this)">×</button>
            </div>
        `;

        openModal(storeModal);
    }

    // Handle save store
    function handleSaveStore() {
        const formData = {
            name: document.getElementById('storeName').value.trim(),
            description: document.getElementById('storeDescription').value.trim(),
            category: document.getElementById('storeCategory').value,
            status: document.getElementById('storeStatus').value,
            location: document.getElementById('storeLocation').value.trim(),
            contact: document.getElementById('storeContact').value.trim(),
            banner: bannerPreview.querySelector('img')?.src || '',
            logo: logoPreview.querySelector('img')?.src || '',
            products: isEditing ? stores.find(s => s.id === currentStoreId)?.products || 0 : 0,
            sales: isEditing ? stores.find(s => s.id === currentStoreId)?.sales || 0 : 0,
            revenue: isEditing ? stores.find(s => s.id === currentStoreId)?.revenue || '0 DA' : '0 DA',
            rating: isEditing ? stores.find(s => s.id === currentStoreId)?.rating || 4.0 : 4.0,
            orders: isEditing ? stores.find(s => s.id === currentStoreId)?.orders || 0 : 0,
            established: isEditing ? stores.find(s => s.id === currentStoreId)?.established || new Date().getFullYear().toString() : new Date().getFullYear().toString()
        };

        // Validate required fields
        if (!formData.name || !formData.category) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        // Generate default images if none provided
        if (!formData.banner) {
            const color = getCategoryColor(formData.category);
            formData.banner = `https://via.placeholder.com/400x180/${color}/ffffff?text=${encodeURIComponent(formData.name)}`;
        }

        if (!formData.logo) {
            const color = getCategoryColor(formData.category);
            const initials = formData.name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
            formData.logo = `https://via.placeholder.com/72/${color}/ffffff?text=${initials}`;
        }

        simulateApiCall(() => {
            if (isEditing && currentStoreId) {
                // Update existing store
                const index = stores.findIndex(s => s.id === currentStoreId);
                if (index !== -1) {
                    stores[index] = { ...stores[index], ...formData, id: currentStoreId };
                }
                showAlert('Store updated successfully!', 'success');
            } else {
                // Create new store
                const newStore = {
                    ...formData,
                    id: stores.length > 0 ? Math.max(...stores.map(s => s.id)) + 1 : 1
                };
                stores.push(newStore);
                showAlert('Store created successfully!', 'success');
            }

            // Update UI
            loadStores();
            populateTable();
            updateStats();
            filterGridStores();

            // Close modal
            closeModal(storeModal);
        });
    }

    // Handle delete confirmation
    function handleConfirmDelete() {
        if (confirmDeleteInput.value !== 'DELETE') {
            showAlert('Please type "DELETE" to confirm', 'error');
            return;
        }

        simulateApiCall(() => {
            const index = stores.findIndex(s => s.id === currentStoreId);
            if (index !== -1) {
                stores.splice(index, 1);
            }

            showAlert('Store deleted successfully!', 'success');
            closeModal(deleteModal);

            // Update UI
            loadStores();
            populateTable();
            updateStats();
            filterGridStores();

            // Reset confirmation input
            confirmDeleteInput.value = '';
        });
    }

    // Switch between grid and table view
    function switchView(view) {
        viewBtns.forEach(btn => {
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        if (view === 'grid') {
            storesGridView.style.display = 'grid';
            storesTableView.classList.remove('active');
        } else {
            storesGridView.style.display = 'none';
            storesTableView.classList.add('active');
        }
    }

    // Refresh stores
    function refreshStores() {
        const refreshIcon = refreshBtn.querySelector('span:first-child');
        const originalIcon = refreshIcon.textContent;
        refreshIcon.textContent = '⏳';

        simulateApiCall(() => {
            refreshIcon.textContent = originalIcon;
            showAlert('Stores refreshed successfully', 'success');
        });
    }

    // Image preview function
    function previewImage(event, previewContainer) {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            previewContainer.innerHTML = `
                <div class="preview-item">
                    <img src="${e.target.result}" alt="Preview">
                    <button type="button" class="remove-image" onclick="removePreview(this)">×</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }

    // Handle file drop
    function handleDrop(event, fileInput, previewContainer) {
        const dt = event.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files;
            const changeEvent = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    }

    // Utility functions
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function showAlert(message, type = 'success') {
        if (type === 'success') {
            alertMessage.textContent = message;
            successAlert.classList.add('active');
            errorAlert.classList.remove('active');

            setTimeout(() => {
                successAlert.classList.remove('active');
            }, 5000);
        } else if (type === 'error') {
            errorMessage.textContent = message;
            errorAlert.classList.add('active');
            successAlert.classList.remove('active');

            setTimeout(() => {
                errorAlert.classList.remove('active');
            }, 5000);
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0
        }).format(amount);
    }

    function getCategoryColor(category) {
        const colors = {
            electronics: '33B0C6',
            fashion: 'FF6B6B',
            home: 'FFD166',
            automotive: '06D6A0',
            sports: '118AB2',
            beauty: 'EF476F',
            other: '073B4C'
        };
        return colors[category] || '33B0C6';
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function simulateApiCall(callback) {
        // Show loading state
        const currentBtn = document.activeElement;
        const originalText = currentBtn.innerHTML;
        currentBtn.innerHTML = '<span>⏳</span><span>Processing...</span>';
        currentBtn.disabled = true;

        // Simulate API delay
        setTimeout(() => {
            callback();
            currentBtn.innerHTML = originalText;
            currentBtn.disabled = false;
        }, 1000);
    }

    // Global functions for inline onclick handlers
    window.viewStore = function(storeId) {
        alert(`Viewing store #${storeId}`);
        // In a real app: window.location.href = `/stores/${storeId}`;
    };

    window.editStore = function(storeId) {
        openEditStoreModal(storeId);
    };

    window.deleteStore = function(storeId) {
        const store = stores.find(s => s.id === storeId);
        if (!store) return;

        currentStoreId = storeId;
        deleteStoreName.textContent = store.name;
        confirmDeleteInput.value = '';
        openModal(deleteModal);
    };

    window.removePreview = function(button) {
        const previewItem = button.closest('.preview-item');
        if (previewItem) {
            previewItem.remove();
        }
    };

    // Add CSS for dragover effect
    const style = document.createElement('style');
    style.textContent = `
        .file-upload.dragover {
            border-color: var(--color-primary);
            background-color: rgba(var(--color-teal-500-rgb), 0.15);
        }
        
        .preview-item {
            position: relative;
        }
        
        .preview-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .preview-item .remove-image {
            position: absolute;
            top: 4px;
            right: 4px;
            background-color: var(--color-error);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    document.head.appendChild(style);

    // Initialize the page
    initializePage();
});