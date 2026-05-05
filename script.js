// script.js
function showToast(message) {
    const toastElement = document.getElementById('toast-message');
    if (!toastElement) return;
    toastElement.textContent = message;
    toastElement.classList.add('show');
    setTimeout(function() {
        toastElement.classList.remove('show');
    }, 3000);
}

function copyToClipboard(text, customMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            showToast(customMessage || 'Berhasil disalin ke papan klip');
        }).catch(function() {
            fallbackCopy(text, customMessage);
        });
    } else {
        fallbackCopy(text, customMessage);
    }
}

function fallbackCopy(text, customMessage) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showToast(customMessage || 'Berhasil disalin');
    } catch (err) {
        showToast('Gagal menyalin, silakan salin manual');
    }
    document.body.removeChild(textarea);
}

function openModal(imageSrc) {
    const modal = document.getElementById('modal-overlay');
    const modalImage = document.getElementById('modal-image');
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('modal-overlay');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const zoomButtons = document.querySelectorAll('.zoom-qris-btn');
    zoomButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const qrisId = btn.getAttribute('data-qris');
            if (qrisId) {
                const qrisImage = document.getElementById(qrisId);
                if (qrisImage && qrisImage.src) {
                    openModal(qrisImage.src);
                } else {
                    showToast('Gambar QRIS tidak tersedia');
                }
            }
        });
    });

    const qrisImages = document.querySelectorAll('.qris-image');
    qrisImages.forEach(function(img) {
        img.addEventListener('click', function() {
            if (img.src) {
                openModal(img.src);
            }
        });
    });

    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            if (event.target === modalOverlay || event.target.classList.contains('modal-close')) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const copyValue = btn.getAttribute('data-copy');
            const copyType = btn.getAttribute('data-type');
            let message = '';
            if (copyType === 'rekening-all') message = 'Semua nomor rekening berhasil disalin';
            else message = 'Berhasil disalin';
            if (copyValue) {
                copyToClipboard(copyValue, message);
            } else {
                showToast('Data tidak tersedia');
            }
        });
    });

    const bankAccountGroups = document.querySelectorAll('.account-number-group');
    bankAccountGroups.forEach(function(group) {
        group.addEventListener('click', function(event) {
            event.stopPropagation();
            const nomor = group.getAttribute('data-nomor');
            if (nomor) {
                const bankName = group.closest('.bank-detail')?.querySelector('.bank-name')?.innerText || 'Rekening';
                copyToClipboard(nomor, bankName + ' : ' + nomor + ' berhasil disalin');
            }
        });
    });

    const ewalletGroups = document.querySelectorAll('.ewallet-number-group');
    ewalletGroups.forEach(function(group) {
        group.addEventListener('click', function(event) {
            event.stopPropagation();
            const nomor = group.getAttribute('data-nomor');
            if (nomor) {
                const ewalletName = group.closest('.ewallet-item')?.querySelector('.ewallet-name')?.innerText || 'E-Wallet';
                copyToClipboard(nomor, ewalletName + ' : ' + nomor + ' berhasil disalin');
            }
        });
    });
});