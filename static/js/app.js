/* ============================================
   Price Benchmarking System - Interactive JS
   ============================================ */

(function() {
    'use strict';

    // === Toast Notification System ===
    const Toast = {
        container: null,

        init() {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        },

        show(message, type = 'info', duration = 4000) {
            if (!this.container) this.init();

            const icons = {
                success: '&#10003;',
                error: '&#10007;',
                info: '&#8505;'
            };

            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <span class="toast-icon">${icons[type] || icons.info}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            `;

            this.container.appendChild(toast);

            toast.addEventListener('click', () => {
                toast.classList.add('removing');
                setTimeout(() => toast.remove(), 300);
            });

            setTimeout(() => {
                if (toast.parentElement) {
                    toast.classList.add('removing');
                    setTimeout(() => toast.remove(), 300);
                }
            }, duration);
        },

        success(msg) { this.show(msg, 'success'); },
        error(msg) { this.show(msg, 'error'); },
        info(msg) { this.show(msg, 'info'); }
    };

    // === Animated Counter ===
    function animateCounter(element, target, duration = 1500) {
        const start = 0;
        const startTime = performance.now();
        const isDecimal = String(target).includes('.');
        const prefix = element.dataset.prefix || '';
        const suffix = element.dataset.suffix || '';

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);

            element.textContent = prefix + current.toLocaleString() + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = prefix + target.toLocaleString() + suffix;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        }

        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'all 0.3s ease';
        requestAnimationFrame(update);
    }

    // === Button Ripple Effect ===
    function initRipple() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';

                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // === Loading Overlay ===
    const Loading = {
        overlay: null,

        init() {
            this.overlay = document.createElement('div');
            this.overlay.className = 'loading-overlay';
            this.overlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(this.overlay);
        },

        show() {
            if (!this.overlay) this.init();
            this.overlay.classList.add('active');
        },

        hide() {
            if (this.overlay) {
                this.overlay.classList.remove('active');
            }
        }
    };

    // === Form Validation ===
    function validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        const msg = group.querySelector('.validation-msg');
        let valid = true;
        let message = '';

        if (input.required && !input.value.trim()) {
            valid = false;
            message = 'This field is required';
        } else if (input.type === 'number' && input.value) {
            const val = parseFloat(input.value);
            const min = parseFloat(input.min);
            const max = parseFloat(input.max);
            if (!isNaN(min) && val < min) {
                valid = false;
                message = `Minimum value is ${min}`;
            } else if (!isNaN(max) && val > max) {
                valid = false;
                message = `Maximum value is ${max}`;
            }
        } else if (input.name === 'confirm_password') {
            const password = document.querySelector('input[name="password"]');
            if (password && input.value !== password.value) {
                valid = false;
                message = 'Passwords do not match';
            }
        } else if (input.name === 'username' && input.value.length < 3) {
            valid = false;
            message = 'Username must be at least 3 characters';
        } else if (input.name === 'password' && input.value.length < 4) {
            valid = false;
            message = 'Password must be at least 4 characters';
        }

        input.classList.remove('valid', 'invalid');
        if (msg) {
            msg.classList.remove('show', 'error', 'success');
        }

        if (input.value.trim()) {
            if (valid) {
                input.classList.add('valid');
                if (msg) {
                    msg.textContent = 'Looks good!';
                    msg.classList.add('show', 'success');
                }
            } else {
                input.classList.add('invalid');
                if (msg) {
                    msg.textContent = message;
                    msg.classList.add('show', 'error');
                }
            }
        }

        return valid;
    }

    function initFormValidation() {
        document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });

        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                let allValid = true;
                this.querySelectorAll('.form-group input[required], .form-group select[required]').forEach(input => {
                    if (!validateField(input)) {
                        allValid = false;
                    }
                });

                if (!allValid) {
                    e.preventDefault();
                    Toast.error('Please fill in all required fields correctly.');
                    return;
                }

                if (this.closest('.container-narrow') || this.closest('.container')) {
                    Loading.show();
                }
            });
        });
    }

    // === Sortable Table ===
    function initSortableTables() {
        document.querySelectorAll('.history-table').forEach(table => {
            const headers = table.querySelectorAll('th');
            headers.forEach((th, index) => {
                th.addEventListener('click', function() {
                    const tbody = table.querySelector('tbody');
                    if (!tbody) return;

                    const rows = Array.from(tbody.querySelectorAll('tr'));
                    const isAsc = this.classList.contains('sorted-asc');

                    headers.forEach(h => {
                        h.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
                        const icon = h.querySelector('.sort-icon');
                        if (icon) icon.textContent = '\u2195';
                    });

                    this.classList.add('sorted', isAsc ? 'sorted-desc' : 'sorted-asc');
                    const icon = this.querySelector('.sort-icon');
                    if (icon) icon.textContent = isAsc ? '\u2191' : '\u2193';

                    rows.sort((a, b) => {
                        let aVal = a.cells[index].textContent.trim();
                        let bVal = b.cells[index].textContent.trim();

                        const aNum = parseFloat(aVal.replace(/[₹,%]/g, ''));
                        const bNum = parseFloat(bVal.replace(/[₹,%]/g, ''));

                        if (!isNaN(aNum) && !isNaN(bNum)) {
                            return isAsc ? bNum - aNum : aNum - bNum;
                        }
                        return isAsc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
                    });

                    rows.forEach(row => tbody.appendChild(row));

                    rows.forEach((row, i) => {
                        row.style.animation = 'none';
                        row.offsetHeight;
                        row.style.animation = `fadeInUp 0.3s ease ${i * 0.05}s forwards`;
                        row.style.opacity = '0';
                    });
                });
            });
        });
    }

    // === History Search/Filter ===
    function initHistoryFilter() {
        const filterInput = document.querySelector('.filter-bar input');
        if (!filterInput) return;

        filterInput.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            const rows = document.querySelectorAll('.history-table tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(term)) {
                    row.style.display = '';
                    row.style.opacity = '1';
                } else {
                    row.style.display = 'none';
                }
            });

            const visibleCount = document.querySelectorAll('.history-table tbody tr:not([style*="display: none"])').length;
            const emptyMsg = document.querySelector('.filter-empty');
            if (emptyMsg) {
                emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        });
    }

    // === Collapsible Sections ===
    function initCollapsibles() {
        document.querySelectorAll('.trend-card h3').forEach(heading => {
            heading.addEventListener('click', function() {
                const content = this.nextElementSibling;
                const icon = this.querySelector('.toggle-icon');
                if (!content) return;

                if (content.classList.contains('collapsed')) {
                    content.classList.remove('collapsed');
                    if (icon) icon.classList.remove('collapsed');
                } else {
                    content.classList.add('collapsed');
                    if (icon) icon.classList.add('collapsed');
                }
            });
        });
    }

    // === Staggered Card Entrance ===
    function initCardAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.card, .stat-card, .action-card, .trend-card').forEach(card => {
            observer.observe(card);
        });
    }

    // === Smooth Scroll ===
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // === Active Nav Link ===
    function initActiveNav() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.navbar a').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // === Tab System ===
    window.showTab = function(type) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            if (tab.dataset.type === type) {
                tab.classList.add('active');
            }
        });

        const content = document.getElementById(type + '-form') || document.getElementById(type + '-content');
        if (content) {
            content.classList.add('active');
        }
    };

    // === Login Tab System ===
    window.showForm = function(type) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.form-container').forEach(form => form.classList.remove('active'));

        if (type === 'login') {
            document.querySelector('.tab:first-child').classList.add('active');
            document.getElementById('login-form').classList.add('active');
        } else {
            document.querySelector('.tab:last-child').classList.add('active');
            document.getElementById('register-form').classList.add('active');
        }
    };

    // === Export History ===
    window.exportHistory = function() {
        const table = document.querySelector('.history-table');
        if (!table) return;

        let csv = [];
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
            const cols = row.querySelectorAll('th, td');
            const rowData = Array.from(cols).map(col => col.textContent.trim());
            csv.push(rowData.join(','));
        });

        const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'query_history.csv';
        a.click();
        URL.revokeObjectURL(url);

        Toast.success('History exported successfully!');
    };

    // === Initialize Everything ===
    document.addEventListener('DOMContentLoaded', function() {
        Toast.init();
        initRipple();
        initFormValidation();
        initSortableTables();
        initHistoryFilter();
        initCollapsibles();
        initCardAnimations();
        initSmoothScroll();
        initActiveNav();

        // Animate stat counters
        document.querySelectorAll('.stat-card .value, .stat-box .value').forEach(el => {
            const target = parseInt(el.textContent.replace(/[^0-9]/g, ''));
            if (!isNaN(target) && target > 0) {
                animateCounter(el, target);
            }
        });

        // Auto-hide loading when page is ready
        Loading.hide();
    });

    // Expose globally
    window.PBApp = {
        Toast,
        Loading,
        animateCounter,
        validateField
    };

})();
