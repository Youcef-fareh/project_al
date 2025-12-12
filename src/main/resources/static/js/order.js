/* ========================================
   ORDER/CHECKOUT SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Payment method selection
    const paymentOptions = document.querySelectorAll('input[name="paymentMethod"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', handlePaymentMethodChange);
    });

    // Form submission
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', validateCheckoutForm);
    }

    // Quantity changes in cart
    const cartItemRows = document.querySelectorAll('.cart-item-row');
    cartItemRows.forEach(row => {
        const removeBtn = row.querySelector('.btn-remove');
        if (removeBtn) {
            removeBtn.addEventListener('click', removeCartItem);
        }
    });

    // Promo code
    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }

    // Initial cart total calculation
    calculateOrderTotal();
});

/**
 * Handles payment method selection
 */
function handlePaymentMethodChange(e) {
    const cardSection = document.getElementById('cardPaymentSection');

    if (e.target.value === 'CARD' && cardSection) {
        cardSection.style.display = 'block';
        // Add validation for card fields
        setupCardValidation();
    } else if (cardSection) {
        cardSection.style.display = 'none';
    }
}

/**
 * Sets up credit card validation
 */
function setupCardValidation() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

/**
 * Formats card number input (XXXX XXXX XXXX XXXX)
 */
function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formatted.slice(0, 19);
}

/**
 * Formats expiry date input (MM/YY)
 */
function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    e.target.value = value.slice(0, 5);
}

/**
 * Validates checkout form
 */
function validateCheckoutForm(e) {
    const requiredFields = [
        'fullName',
        'address',
        'city',
        'postalCode',
        'phone'
    ];

    let isValid = true;

    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field && !field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else if (field) {
            field.classList.remove('is-invalid');
        }
    });

    // Validate payment method
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showNotification('Please select a payment method', 'danger');
        isValid = false;
    }

    // Validate card details if card payment selected
    if (selectedPayment?.value === 'CARD') {
        if (!validateCardDetails()) {
            isValid = false;
        }
    }

    // Validate terms agreement
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('Please agree to Terms & Conditions', 'danger');
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
        showNotification('Please correct errors in the form', 'danger');
    }

    return isValid;
}

/**
 * Validates card details
 */
function validateCardDetails() {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;

    let isValid = true;

    // Luhn algorithm for card number validation
    if (!luhnCheck(cardNumber)) {
        showNotification('Invalid card number', 'danger');
        isValid = false;
    }

    if (!expiryDate || !validateExpiryDate(expiryDate)) {
        showNotification('Invalid expiry date', 'danger');
        isValid = false;
    }

    if (!cvv || cvv.length !== 3) {
        showNotification('Invalid CVV', 'danger');
        isValid = false;
    }

    return isValid;
}

/**
 * Luhn algorithm for card number validation
 */
function luhnCheck(cardNumber) {
    if (!cardNumber || !/^\d+$/.test(cardNumber)) return false;
    if (cardNumber.length < 13 || cardNumber.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i]);

        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
}

/**
 * Validates expiry date
 */
function validateExpiryDate(expiryDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) return false;

    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month));
    const now = new Date();

    return expiry > now;
}

/**
 * Removes item from cart
 */
function removeCartItem(e) {
    e.preventDefault();
    const row = e.target.closest('.cart-item-row');

    if (row) {
        row.style.opacity = '0.5';
        setTimeout(() => {
            row.remove();
            calculateOrderTotal();
            showNotification('Item removed from cart', 'info');
        }, 300);
    }
}

/**
 * Applies promo code
 */
function applyPromoCode(e) {
    e.preventDefault();

    const promoInput = document.getElementById('promoCode');
    const code = promoInput?.value.trim().toUpperCase();

    if (!code) {
        showNotification('Please enter a promo code', 'danger');
        return;
    }

    // Simulate API call
    validatePromoCode(code);
}

/**
 * Validates and applies promo code
 */
function validatePromoCode(code) {
    // Mock promo codes
    const promoCodes = {
        'WELCOME10': { discount: 10, type: 'percentage' },
        'SAVE500': { discount: 500, type: 'fixed' },
        'SUMMER20': { discount: 20, type: 'percentage' }
    };

    const promo = promoCodes[code];

    if (!promo) {
        showNotification('Invalid promo code', 'danger');
        return;
    }

    // Apply discount
    applyDiscount(promo);
    document.getElementById('promoCode').value = '';
    showNotification(`Promo code applied! ${promo.discount}${promo.type === 'percentage' ? '%' : ' DA'} discount`, 'success');
}

/**
 * Applies discount to order
 */
function applyDiscount(promo) {
    const subtotal = parseFloat(document.getElementById('subtotal')?.textContent.replace(/\D/g, '')) || 0;
    let discount = 0;

    if (promo.type === 'percentage') {
        discount = (subtotal * promo.discount) / 100;
    } else {
        discount = promo.discount;
    }

    const discountRow = document.getElementById('discountRow');
    const discountElement = document.getElementById('discount');

    if (discountRow) {
        discountRow.style.display = 'block';
    }

    if (discountElement) {
        discountElement.textContent = `-DA ${discount.toFixed(0)}`;
    }

    calculateOrderTotal();
}

/**
 * Calculates order total
 */
function calculateOrderTotal() {
    const subtotalText = document.getElementById('subtotal')?.textContent;
    const shippingText = document.getElementById('shipping')?.textContent;
    const discountText = document.getElementById('discount')?.textContent;
    const grandTotalElement = document.getElementById('grandTotal');

    const subtotal = extractNumber(subtotalText) || 0;
    const shipping = extractNumber(shippingText) || 500;
    const discount = extractNumber(discountText) || 0;

    const grandTotal = subtotal + shipping - discount;

    if (grandTotalElement) {
        grandTotalElement.textContent = `DA ${grandTotal.toFixed(0)}`;
    }
}

/**
 * Extracts number from text
 */
function extractNumber(text) {
    if (!text) return 0;
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
}

/**
 * Shows notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        min-width: 300px;
        animation: slideDown 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
