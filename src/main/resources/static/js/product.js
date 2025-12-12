/* ========================================
   PRODUCT DETAILS PAGE SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Image gallery thumbnail click
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            updateMainImage(this.src);
            updateActiveThumbnail(this);
        });
    });

    // Quantity selector buttons
    const qtyMinusBtn = document.querySelector('.qty-minus');
    const qtyPlusBtn = document.querySelector('.qty-plus');
    const qtyInput = document.getElementById('quantity');

    if (qtyMinusBtn && qtyInput) {
        qtyMinusBtn.addEventListener('click', function() {
            decreaseQuantity(qtyInput);
        });
    }

    if (qtyPlusBtn && qtyInput) {
        qtyPlusBtn.addEventListener('click', function() {
            increaseQuantity(qtyInput);
        });
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('add-wishlist') || document.getElementById('remove-wishlist');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', toggleWishlist);
    }

    // Direct quantity input change
    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            validateQuantity(this);
        });
    }
});

/**
 * Updates main image when thumbnail is clicked
 */
function updateMainImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
        mainImage.style.opacity = '0.8';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    }
}

/**
 * Updates active thumbnail styling
 */
function updateActiveThumbnail(thumbnail) {
    document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

/**
 * Increases quantity
 */
function increaseQuantity(input) {
    const maxQty = parseInt(input.max) || 999;
    const current = parseInt(input.value) || 1;

    if (current < maxQty) {
        input.value = current + 1;
    }
}

/**
 * Decreases quantity
 */
function decreaseQuantity(input) {
    const current = parseInt(input.value) || 1;
    const minQty = parseInt(input.min) || 1;

    if (current > minQty) {
        input.value = current - 1;
    }
}

/**
 * Validates quantity input
 */
function validateQuantity(input) {
    let value = parseInt(input.value);
    const min = parseInt(input.min) || 1;
    const max = parseInt(input.max) || 999;

    if (isNaN(value) || value < min) {
        input.value = min;
    } else if (value > max) {
        input.value = max;
    }
}

/**
 * Toggles wishlist status
 */
function toggleWishlist(e) {
    e.preventDefault();
    const btn = e.currentTarget;
    const isInWishlist = btn.id === 'remove-wishlist';

    // Simulate API call
    const productId = new URLSearchParams(window.location.search).get('id') || 1;

    // Visual feedback
    btn.disabled = true;
    btn.style.opacity = '0.6';

    // Simulate network delay
    setTimeout(() => {
        if (isInWishlist) {
            // Remove from wishlist
            btn.id = 'add-wishlist';
            btn.innerHTML = '🤍 Add to Wishlist';
            showNotification('Removed from wishlist', 'info');
        } else {
            // Add to wishlist
            btn.id = 'remove-wishlist';
            btn.innerHTML = '❤ Remove from Wishlist';
            showNotification('Added to wishlist!', 'success');
        }

        btn.disabled = false;
        btn.style.opacity = '1';
    }, 500);
}

/**
 * Shows a temporary notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${type === 'success' ? '#06a77d' : '#004e89'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Format price display
 */
function formatPrice(price) {
    return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
    }).format(price);
}
