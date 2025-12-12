/* ========================================
   AUTHENTICATION SCRIPTS (login.html, signup.html)
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Form validation
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    }

    // Password strength indicator for signup
    const passwordInputs = document.querySelectorAll('[data-password-field="true"]');
    passwordInputs.forEach(input => {
        input.addEventListener('input', updatePasswordStrength);
    });

    // Confirm password validation for signup
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', validatePasswordMatch);
    }
});

/**
 * Validates form fields (email, password not empty)
 */
function validateForm(form) {
    const emailInput = form.querySelector('input[type="email"]');
    const passwordInput = form.querySelector('input[type="password"]');

    let isValid = true;

    // Validate email
    if (!emailInput.value.trim()) {
        emailInput.classList.add('is-invalid');
        isValid = false;
    } else {
        emailInput.classList.remove('is-invalid');
    }

    // Validate password
    if (!passwordInput.value.trim()) {
        passwordInput.classList.add('is-invalid');
        isValid = false;
    } else {
        passwordInput.classList.remove('is-invalid');
    }

    return isValid;
}

/**
 * Updates password strength indicator
 */
function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = e.target.nextElementSibling?.querySelector('.strength-bar');
    const strengthText = e.target.nextElementSibling?.querySelector('.strength-text');

    if (!strengthBar || !strengthText) return;

    let strength = 0;
    const strengthAfter = strengthBar.style.color;

    // Check length
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;

    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 25;

    // Check for numbers
    if (/[0-9]/.test(password)) strength += 25;

    // Update bar
    const barAfter = strengthBar.querySelector('::after') || strengthBar;
    if (barAfter) {
        barAfter.style.width = strength + '%';
    }

    // Update text
    let strengthLabel = '';
    if (strength === 0) {
        strengthLabel = 'Weak password';
        strengthBar.style.backgroundColor = '#d62828';
    } else if (strength < 50) {
        strengthLabel = 'Fair password';
        strengthBar.style.backgroundColor = '#f77f00';
    } else if (strength < 75) {
        strengthLabel = 'Good password';
        strengthBar.style.backgroundColor = '#ffc914';
    } else {
        strengthLabel = 'Strong password';
        strengthBar.style.backgroundColor = '#06a77d';
    }

    strengthText.textContent = strengthLabel;
}

/**
 * Validates that confirm password matches password
 */
function validatePasswordMatch(e) {
    const confirmPassword = e.target.value;
    const password = document.getElementById('password')?.value;
    const errorElement = document.getElementById('confirmPasswordError');

    if (!password || !confirmPassword) return;

    if (confirmPassword !== password) {
        e.target.classList.add('is-invalid');
        if (errorElement) {
            errorElement.textContent = 'Passwords do not match';
        }
    } else {
        e.target.classList.remove('is-invalid');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
}

/**
 * Add visual feedback for input focus
 */
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.classList.add('is-focused');
    });

    input.addEventListener('blur', function() {
        this.classList.remove('is-focused');
    });
});

/**
 * Toggle password visibility (optional enhancement)
 */
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}
