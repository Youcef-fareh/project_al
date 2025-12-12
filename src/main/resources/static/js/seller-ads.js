/* ========================================
   SELLER CREATE AD SCRIPTS
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Keywords/tags handling
    const keywordInput = document.getElementById('keywords');
    const keywordsChips = document.getElementById('keywordsChips');

    if (keywordInput && keywordsChips) {
        keywordInput.addEventListener('keydown', handleKeywordInput);
        keywordInput.addEventListener('blur', parseKeywordsFromInput);
    }

    // File upload handling
    const imageUploadArea = document.getElementById('imageUploadArea');
    const imageFiles = document.getElementById('imageFiles');
    const imagePreview = document.getElementById('imagePreview');

    if (imageUploadArea && imageFiles) {
        imageUploadArea.addEventListener('click', () => imageFiles.click());
        imageUploadArea.addEventListener('dragover', preventDefaults);
        imageUploadArea.addEventListener('dragleave', removeHover);
        imageUploadArea.addEventListener('drop', handleImageDrop);

        imageFiles.addEventListener('change', handleImageSelect);
    }

    // Form validation
    const form = document.querySelector('.ad-form');
    if (form) {
        form.addEventListener('submit', validateAdForm);
    }

    // Dynamic price/cost calculation
    const costInput = document.getElementById('cost');
    const reductionInput = document.getElementById('reduction');
    if (costInput) {
        costInput.addEventListener('change', updateAdCost);
    }
    if (reductionInput) {
        reductionInput.addEventListener('change', updateAdCost);
    }
});

/**
 * Handles keyword input
 */
function handleKeywordInput(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addKeyword(this.value.trim());
        this.value = '';
    }
}

/**
 * Parses keywords from input on blur
 */
function parseKeywordsFromInput(e) {
    const value = e.target.value.trim();
    if (value) {
        const keywords = value.split(',').map(k => k.trim()).filter(k => k);
        keywords.forEach(keyword => addKeyword(keyword));
        e.target.value = '';
    }
}

/**
 * Adds a keyword chip
 */
function addKeyword(keyword) {
    if (!keyword) return;

    const keywordsChips = document.getElementById('keywordsChips');
    if (!keywordsChips) return;

    // Check if keyword already exists
    if (Array.from(keywordsChips.querySelectorAll('.keyword-chip')).some(chip => 
        chip.textContent.toLowerCase() === keyword.toLowerCase())) {
        return;
    }

    const chip = document.createElement('span');
    chip.className = 'keyword-chip';
    chip.innerHTML = `
        ${escapeHtml(keyword)}
        <span class="remove-btn" onclick="this.parentElement.remove()">✕</span>
    `;

    keywordsChips.appendChild(chip);
}

/**
 * Prevents default drag/drop behavior
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
}

/**
 * Removes hover effect
 */
function removeHover(e) {
    e.currentTarget.classList.remove('dragover');
}

/**
 * Handles image drop
 */
function handleImageDrop(e) {
    preventDefaults(e);
    e.currentTarget.classList.remove('dragover');

    const files = e.dataTransfer.files;
    previewImages(files);
}

/**
 * Handles image file selection
 */
function handleImageSelect(e) {
    const files = e.target.files;
    previewImages(files);
}

/**
 * Previews selected images
 */
function previewImages(files) {
    const imagePreview = document.getElementById('imagePreview');
    if (!imagePreview) return;

    // Clear existing previews
    imagePreview.innerHTML = '';

    // Limit to 5 images
    const fileArray = Array.from(files).slice(0, 5);

    if (fileArray.length === 0) {
        return;
    }

    fileArray.forEach((file, index) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${index + 1}">
                <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                    ✕
                </button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Validates the ad form
 */
function validateAdForm(e) {
    const requiredFields = [
        'nom_post',
        'type',
        'description',
        'price',
        'quantity',
        'category',
        'duration',
        'cost',
        'onlineStore'
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

    if (!isValid) {
        e.preventDefault();
        showNotification('Please fill in all required fields', 'danger');
    }

    return isValid;
}

/**
 * Updates ad cost calculation
 */
function updateAdCost() {
    const costInput = document.getElementById('cost');
    const durationInput = document.getElementById('duration');
    const reductionInput = document.getElementById('reduction');

    if (!costInput || !durationInput) return;

    const cost = parseFloat(costInput.value) || 0;
    const duration = parseInt(durationInput.value) || 1;
    const reduction = parseFloat(reductionInput?.value) || 0;

    // Calculate total cost (cost per day * duration - reduction)
    const totalCost = (cost * duration) - reduction;

    console.log(`Ad Cost: ${totalCost} DA (${cost} DA/day × ${duration} days - ${reduction} DA)`);
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

/**
 * Escapes HTML special characters
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Saves form as draft
 */
function saveDraft() {
    const formData = new FormData(document.querySelector('.ad-form'));
    const data = Object.fromEntries(formData);

    // Save to localStorage
    localStorage.setItem('adFormDraft', JSON.stringify(data));
    showNotification('Ad saved as draft', 'success');
}

/**
 * Loads draft form if exists
 */
function loadDraft() {
    const draft = localStorage.getItem('adFormDraft');
    if (!draft) return;

    const data = JSON.parse(draft);
    Object.entries(data).forEach(([key, value]) => {
        const field = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = value;
        }
    });

    showNotification('Draft loaded', 'info');
}
