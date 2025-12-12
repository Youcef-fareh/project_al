document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const exportOrdersBtn = document.getElementById('exportOrdersBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const printBtn = document.getElementById('printBtn');
    const searchInput = document.getElementById('searchOrders');
    const statusFilter = document.getElementById('statusFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const emptyState = document.getElementById('emptyState');
    const ordersTableContainer = document.querySelector('.orders-table-container');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');
    const alertMessage = document.getElementById('alertMessage');
    const errorMessage = document.getElementById('errorMessage');

    // Modal Elements
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const updateStatusSelect = document.getElementById('updateStatusSelect');

    // Sample orders data
    const orders = [
        {
            id: 1,
            orderId: "ORD-001",
            customer: {
                name: "Karim Ahmed",
                email: "karim.ahmed@example.com",
                phone: "+213 555 789 123",
                avatar: "K",
                address: "123 Street Name, Algiers, Algeria"
            },
            product: {
                name: "Apple MacBook Pro 16\"",
                image: "https://via.placeholder.com/50/33B0C6/ffffff?text=MBP",
                category: "Electronics"
            },
            price: "125,000 DA",
            quantity: 1,
            total: "125,500 DA",
            status: "pending",
            date: "Mar 15, 2024",
            time: "10:30 AM",
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Paid",
            deliveryMethod: "Standard Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        },
        {
            id: 2,
            orderId: "ORD-002",
            customer: {
                name: "Sarah Benali",
                email: "sarah.benali@example.com",
                phone: "+213 555 456 789",
                avatar: "S",
                address: "456 Avenue, Oran, Algeria"
            },
            product: {
                name: "Designer Handbag",
                image: "https://via.placeholder.com/50/FF6B6B/ffffff?text=DHB",
                category: "Fashion"
            },
            price: "8,500 DA",
            quantity: 2,
            total: "17,000 DA",
            status: "processing",
            date: "Mar 14, 2024",
            time: "02:15 PM",
            paymentMethod: "Credit Card",
            paymentStatus: "Paid",
            deliveryMethod: "Express Delivery",
            shipping: "0 DA",
            tax: "0 DA"
        },
        {
            id: 3,
            orderId: "ORD-003",
            customer: {
                name: "Mohamed Cherif",
                email: "m.cherif@example.com",
                phone: "+213 555 123 456",
                avatar: "M",
                address: "789 Boulevard, Constantine, Algeria"
            },
            product: {
                name: "Wireless Headphones",
                image: "https://via.placeholder.com/50/FFD166/333333?text=WH",
                category: "Electronics"
            },
            price: "15,000 DA",
            quantity: 1,
            total: "15,500 DA",
            status: "shipped",
            date: "Mar 13, 2024",
            time: "09:45 AM",
            paymentMethod: "Bank Transfer",
            paymentStatus: "Pending",
            deliveryMethod: "Standard Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        },
        {
            id: 4,
            orderId: "ORD-004",
            customer: {
                name: "Fatima Zohra",
                email: "f.zohra@example.com",
                phone: "+213 555 987 654",
                avatar: "F",
                address: "321 Road, Annaba, Algeria"
            },
            product: {
                name: "Leather Sofa",
                image: "https://via.placeholder.com/50/06D6A0/ffffff?text=LS",
                category: "Furniture"
            },
            price: "65,000 DA",
            quantity: 1,
            total: "65,000 DA",
            status: "delivered",
            date: "Mar 12, 2024",
            time: "04:20 PM",
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Paid",
            deliveryMethod: "Standard Delivery",
            shipping: "0 DA",
            tax: "0 DA"
        },
        {
            id: 5,
            orderId: "ORD-005",
            customer: {
                name: "Ali Hassan",
                email: "ali.hassan@example.com",
                phone: "+213 555 654 321",
                avatar: "A",
                address: "654 Street, Blida, Algeria"
            },
            product: {
                name: "Smartphone X",
                image: "https://via.placeholder.com/50/118AB2/ffffff?text=SX",
                category: "Electronics"
            },
            price: "45,000 DA",
            quantity: 1,
            total: "45,500 DA",
            status: "cancelled",
            date: "Mar 11, 2024",
            time: "11:10 AM",
            paymentMethod: "Credit Card",
            paymentStatus: "Refunded",
            deliveryMethod: "Standard Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        },
        {
            id: 6,
            orderId: "ORD-006",
            customer: {
                name: "Nadia Bouchenak",
                email: "nadia.b@example.com",
                phone: "+213 555 333 444",
                avatar: "N",
                address: "987 Avenue, Tizi Ouzou, Algeria"
            },
            product: {
                name: "Running Shoes",
                image: "https://via.placeholder.com/50/EF476F/ffffff?text=RS",
                category: "Sports"
            },
            price: "12,000 DA",
            quantity: 1,
            total: "12,500 DA",
            status: "delivered",
            date: "Mar 10, 2024",
            time: "03:45 PM",
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Paid",
            deliveryMethod: "Standard Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        },
        {
            id: 7,
            orderId: "ORD-007",
            customer: {
                name: "Omar Khelifi",
                email: "omar.k@example.com",
                phone: "+213 555 777 888",
                avatar: "O",
                address: "147 Street, Setif, Algeria"
            },
            product: {
                name: "Coffee Maker",
                image: "https://via.placeholder.com/50/073B4C/ffffff?text=CM",
                category: "Home"
            },
            price: "25,000 DA",
            quantity: 1,
            total: "25,500 DA",
            status: "processing",
            date: "Mar 9, 2024",
            time: "01:30 PM",
            paymentMethod: "Bank Transfer",
            paymentStatus: "Paid",
            deliveryMethod: "Express Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        },
        {
            id: 8,
            orderId: "ORD-008",
            customer: {
                name: "Leila Mansouri",
                email: "leila.m@example.com",
                phone: "+213 555 222 111",
                avatar: "L",
                address: "258 Road, Batna, Algeria"
            },
            product: {
                name: "Winter Jacket",
                image: "https://via.placeholder.com/50/7209B7/ffffff?text=WJ",
                category: "Fashion"
            },
            price: "18,000 DA",
            quantity: 1,
            total: "18,500 DA",
            status: "shipped",
            date: "Mar 8, 2024",
            time: "10:00 AM",
            paymentMethod: "Credit Card",
            paymentStatus: "Paid",
            deliveryMethod: "Standard Delivery",
            shipping: "500 DA",
            tax: "0 DA"
        }
    ];

    // Current order being viewed
    let currentOrderId = null;

    // Initialize the page
    function initializePage() {
        // Load orders data
        loadOrders();

        // Update stats
        updateStats();

        // Set up event listeners
        setupEventListeners();
    }

    // Load orders into table
    function loadOrders(filteredOrders = orders) {
        if (filteredOrders.length === 0) {
            ordersTableContainer.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        ordersTableContainer.style.display = 'block';
        emptyState.style.display = 'none';

        ordersTableBody.innerHTML = '';

        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            row.dataset.orderId = order.id;
            row.dataset.status = order.status;
            row.dataset.date = order.date;

            row.innerHTML = `
                <td>
                    <div class="order-id">
                        <span class="prefix">#</span>${order.orderId}
                    </div>
                </td>
                <td>
                    <div class="customer-info">
                        <div class="customer-avatar">
                            ${order.customer.avatar}
                        </div>
                        <div class="customer-details">
                            <h4>${order.customer.name}</h4>
                            <p>${order.customer.email}</p>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="product-info">
                        <div class="product-image">
                            <img src="${order.product.image}" alt="${order.product.name}">
                        </div>
                        <div class="product-details">
                            <h4>${order.product.name}</h4>
                            <span class="category">${order.product.category}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="price">${order.price}</div>
                </td>
                <td>
                    <div class="quantity">${order.quantity}</div>
                </td>
                <td>
                    <div class="total">${order.total}</div>
                </td>
                <td>
                    <span class="status-badge status-${order.status}">${capitalizeFirstLetter(order.status)}</span>
                </td>
                <td>
                    <div class="order-date">
                        ${order.date}
                        <span class="time">${order.time}</span>
                    </div>
                </td>
                <td>
                    <div class="actions">
                        <button class="action-btn view" title="View" onclick="viewOrder(${order.id})">
                            👁️
                        </button>
                        <button class="action-btn edit" title="Update Status" onclick="updateOrderStatus(${order.id})">
                            ✏️
                        </button>
                        <button class="action-btn print" title="Print Invoice" onclick="printInvoice(${order.id})">
                            🖨️
                        </button>
                    </div>
                </td>
            `;

            ordersTableBody.appendChild(row);
        });
    }

    // Filter orders based on search and filters
    function filterOrders() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const startDateValue = startDate.value;
        const endDateValue = endDate.value;

        const filteredOrders = orders.filter(order => {
            const matchesSearch = searchTerm === '' ||
                order.orderId.toLowerCase().includes(searchTerm) ||
                order.customer.name.toLowerCase().includes(searchTerm) ||
                order.customer.email.toLowerCase().includes(searchTerm) ||
                order.product.name.toLowerCase().includes(searchTerm);

            const matchesStatus = statusValue === '' || order.status === statusValue;

            // Date filtering
            let matchesDate = true;
            if (startDateValue || endDateValue) {
                const orderDate = new Date(order.date);
                if (startDateValue) {
                    const start = new Date(startDateValue);
                    if (orderDate < start) matchesDate = false;
                }
                if (endDateValue) {
                    const end = new Date(endDateValue);
                    end.setHours(23, 59, 59, 999);
                    if (orderDate > end) matchesDate = false;
                }
            }

            return matchesSearch && matchesStatus && matchesDate;
        });

        loadOrders(filteredOrders);

        // Update pagination info
        const paginationInfo = document.querySelector('.pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Showing 1-${filteredOrders.length} of ${filteredOrders.length} orders`;
        }
    }

    // Update stats
    function updateStats() {
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const completedOrders = orders.filter(order => order.status === 'delivered').length;
        const totalRevenue = orders.reduce((sum, order) => {
            const revenue = parseInt(order.total.replace(/[^0-9]/g, ''));
            return sum + (isNaN(revenue) ? 0 : revenue);
        }, 0);

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('completedOrders').textContent = completedOrders;
        document.getElementById('totalRevenue').textContent = formatCurrency(totalRevenue);
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Export orders
        exportOrdersBtn.addEventListener('click', exportOrders);

        // Refresh button
        refreshBtn.addEventListener('click', refreshOrders);

        // Print button
        printBtn.addEventListener('click', printAllInvoices);

        // Search and filters
        searchInput.addEventListener('input', filterOrders);
        statusFilter.addEventListener('change', filterOrders);
        startDate.addEventListener('change', filterOrders);
        endDate.addEventListener('change', filterOrders);

        // Modal controls
        closeOrderModal.addEventListener('click', () => closeModal(orderDetailsModal));
        printInvoiceBtn.addEventListener('click', printCurrentInvoice);
        updateStatusBtn.addEventListener('click', updateCurrentOrderStatus);
    }

    // Open order details modal
    function openOrderDetailsModal(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        currentOrderId = orderId;

        // Update modal title
        document.getElementById('modalOrderId').textContent = order.orderId;

        // Update order information
        document.getElementById('detailOrderId').textContent = order.orderId;
        document.getElementById('detailOrderDate').textContent = `${order.date} ${order.time}`;
        document.getElementById('detailPaymentMethod').textContent = order.paymentMethod;
        document.getElementById('detailPaymentStatus').textContent = order.paymentStatus;
        document.getElementById('detailDeliveryMethod').textContent = order.deliveryMethod;

        // Update customer information
        document.getElementById('detailCustomerAvatar').textContent = order.customer.avatar;
        document.getElementById('detailCustomerName').textContent = order.customer.name;
        document.getElementById('detailCustomerContact').textContent = order.customer.email;
        document.getElementById('detailCustomerPhone').textContent = order.customer.phone;
        document.getElementById('detailCustomerAddress').textContent = order.customer.address;

        // Update order items
        const orderItemsList = document.getElementById('orderItemsList');
        orderItemsList.innerHTML = `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${order.product.image}" alt="${order.product.name}">
                </div>
                <div class="order-item-details">
                    <div class="order-item-name">${order.product.name}</div>
                    <div class="order-item-meta">
                        <span>Category: ${order.product.category}</span>
                        <span>Qty: ${order.quantity}</span>
                    </div>
                </div>
                <div class="order-item-price">${order.price}</div>
            </div>
        `;

        // Update order summary
        const subtotal = parseInt(order.price.replace(/[^0-9]/g, ''));
        const shipping = parseInt(order.shipping.replace(/[^0-9]/g, ''));
        const tax = parseInt(order.tax.replace(/[^0-9]/g, ''));
        const total = subtotal + shipping + tax;

        document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
        document.getElementById('summaryShipping').textContent = formatCurrency(shipping);
        document.getElementById('summaryTax').textContent = formatCurrency(tax);
        document.getElementById('summaryTotal').textContent = formatCurrency(total);

        // Update status select
        updateStatusSelect.value = order.status;

        openModal(orderDetailsModal);
    }

    // Update current order status
    function updateCurrentOrderStatus() {
        const newStatus = updateStatusSelect.value;
        const orderIndex = orders.findIndex(o => o.id === currentOrderId);

        if (orderIndex === -1) return;

        simulateApiCall(() => {
            orders[orderIndex].status = newStatus;

            // Update UI
            loadOrders();
            updateStats();
            filterOrders();

            showAlert('Order status updated successfully!', 'success');
            closeModal(orderDetailsModal);
        });
    }

    // Export orders function
    function exportOrders() {
        simulateApiCall(() => {
            showAlert('Orders export has started. You will receive an email with the CSV file.', 'info');
        });
    }

    // Refresh orders function
    function refreshOrders() {
        const refreshIcon = refreshBtn.querySelector('span:first-child');
        const originalIcon = refreshIcon.textContent;
        refreshIcon.textContent = '⏳';

        simulateApiCall(() => {
            refreshIcon.textContent = originalIcon;
            showAlert('Orders refreshed successfully', 'success');
        });
    }

    // Print all invoices
    function printAllInvoices() {
        alert('Opening print dialog for all invoices...');
        // In a real app: window.print();
    }

    // Print current invoice
    function printCurrentInvoice() {
        alert(`Printing invoice for order #${currentOrderId}`);
        // In a real app: Generate and print PDF
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
        } else if (type === 'info') {
            // Create a temporary info alert
            const infoAlert = document.createElement('div');
            infoAlert.className = 'alert alert-info active';
            infoAlert.innerHTML = `
                <span>ℹ️</span>
                <span>${message}</span>
            `;
            infoAlert.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            `;

            document.body.appendChild(infoAlert);

            setTimeout(() => {
                infoAlert.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => infoAlert.remove(), 300);
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

    // Add CSS animations for fadeOut
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);

    // Global functions for inline onclick handlers
    window.viewOrder = function(orderId) {
        openOrderDetailsModal(orderId);
    };

    window.updateOrderStatus = function(orderId) {
        openOrderDetailsModal(orderId);
    };

    window.printInvoice = function(orderId) {
        alert(`Printing invoice for order #${orderId}`);
        // In a real app: Generate and print PDF
    };

    // Initialize the page
    initializePage();
});