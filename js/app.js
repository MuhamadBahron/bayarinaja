// ============================================================
// STATE MANAGEMENT
// ============================================================

const AppState = {
    // Auth
    currentUser: null,
    isLoggedIn: false,

    // Bill
    billCategory: 'pln',
    billCustomerId: '',
    billData: null,
    billPaymentMethod: null,

    // SPP
    sppNim: '',
    sppData: null,
    sppSelected: [],

    // Pulsa
    pulsaProvider: null,
    pulsaPhone: '',
    pulsaNominal: null,
    pulsaPaymentMethod: null,

    // History
    history: [],
    historyFilter: 'all',

    // Saldo
    saldo: 1500000,

    // QR Timer
    qrTimerInterval: null,
    qrTimerPulsaInterval: null
};

// ============================================================
// TOAST NOTIFICATION
// ============================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ============================================================
// SALDO
// ============================================================

function updateSaldoDisplay() {
    const el = document.getElementById('saldoDisplay');
    if (el) {
        el.textContent = 'Rp' + AppState.saldo.toLocaleString('id-ID');
    }
}

function kurangiSaldo(amount) {
    if (AppState.saldo < amount) {
        showToast('Saldo tidak mencukupi! Silakan top-up terlebih dahulu.', 'error');
        return false;
    }
    AppState.saldo -= amount;
    updateSaldoDisplay();
    return true;
}

// ============================================================
// LOGIN / AUTH
// ============================================================

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const emailError = document.getElementById('loginEmailError');
    const passwordError = document.getElementById('loginPasswordError');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    // Reset errors
    emailError.classList.remove('show');
    passwordError.classList.remove('show');
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');

    // Validate
    let isValid = true;
    if (!email) {
        emailError.textContent = 'Email tidak boleh kosong';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    } else if (!email.includes('@')) {
        emailError.textContent = 'Format email tidak valid';
        emailError.classList.add('show');
        emailInput.classList.add('error');
        isValid = false;
    }

    if (!password) {
        passwordError.textContent = 'Password tidak boleh kosong';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = 'Password minimal 6 karakter';
        passwordError.classList.add('show');
        passwordInput.classList.add('error');
        isValid = false;
    }

    if (!isValid) return;

    // Cek user
    const user = validUsers.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Email atau password salah!', 'error');
        emailInput.classList.add('error');
        passwordInput.classList.add('error');
        return;
    }

    // Login success
    AppState.currentUser = user;
    AppState.isLoggedIn = true;

    // Show app
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    // Set user name
    document.getElementById('userNameDisplay').textContent = user.name;

    // Load history
    loadHistory();

    // Update dashboard
    updateDashboardStats();

    // Update saldo
    updateSaldoDisplay();

    showToast(`Selamat datang, ${user.name}!`, 'success');

    // Navigate to dashboard
    navigateTo('dashboard');
}

function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        AppState.currentUser = null;
        AppState.isLoggedIn = false;

        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('loginPage').style.display = 'flex';

        // Reset form
        document.getElementById('loginEmail').value = 'admin@bayarin.com';
        document.getElementById('loginPassword').value = 'password123';

        showToast('Anda telah keluar.', 'info');
    }
}

// ============================================================
// NAVIGATION
// ============================================================

function navigateTo(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));

    // Show target
    const target = document.getElementById('section-' + section);
    if (target) target.classList.add('active');

    // Update nav
    document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
    const navLink = document.querySelector(`.nav-links a[data-section="${section}"]`);
    if (navLink) navLink.classList.add('active');

    // Update stats
    if (section === 'dashboard') updateDashboardStats();
    if (section === 'history') renderHistory();
}

// ============================================================
// HISTORY
// ============================================================

function loadHistory() {
    try {
        const data = localStorage.getItem('bayarin_history');
        if (data) {
            AppState.history = JSON.parse(data);
        } else {
            // Seed dengan data dummy
            AppState.history = [{
                id: 'TRX-' + Date.now() - 100000,
                date: new Date(Date.now() - 86400000).toLocaleString('id-ID'),
                service: 'Tagihan',
                description: 'Listrik (PLN) - Budi Santoso',
                amount: 245000,
                method: 'VA',
                status: 'success'
            }, {
                id: 'TRX-' + Date.now() - 50000,
                date: new Date(Date.now() - 3600000).toLocaleString('id-ID'),
                service: 'Pulsa',
                description: 'Pulsa Telkomsel - 08123456789',
                amount: 50000,
                method: 'QRIS',
                status: 'success'
            }];
            saveHistoryToLocal();
        }
    } catch (e) {
        AppState.history = [];
    }
    renderHistory();
}

function saveHistoryToLocal() {
    try {
        localStorage.setItem('bayarin_history', JSON.stringify(AppState.history));
    } catch (e) {}
}

function saveTransaction(transaction) {
    AppState.history.unshift(transaction);
    saveHistoryToLocal();
}

function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    const filter = AppState.historyFilter;
    let filtered = AppState.history;
    if (filter !== 'all') {
        filtered = AppState.history.filter(t => t.status === filter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; color:var(--gray-400); padding:2rem;">
                    <i class="fas fa-inbox" style="font-size:2rem; display:block; margin-bottom:0.5rem;"></i>
                    ${AppState.history.length === 0 ? 'Belum ada transaksi' : 'Tidak ada transaksi dengan filter ini'}
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    filtered.forEach(t => {
        const statusClass = t.status === 'success' ? 'success' :
            t.status === 'pending' ? 'pending' : 'failed';
        html += `
            <tr>
                <td>${t.date}</td>
                <td><strong>${t.service}</strong></td>
                <td>${t.description}</td>
                <td>Rp${t.amount.toLocaleString('id-ID')}</td>
                <td>${t.method}</td>
                <td><span class="status-badge ${statusClass}">${t.status.toUpperCase()}</span></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function filterHistory(filter) {
    AppState.historyFilter = filter;
    renderHistory();
    showToast(`Menampilkan: ${filter === 'all' ? 'Semua' : filter}`, 'info');
}

function clearHistory() {
    if (AppState.history.length === 0) {
        showToast('Tidak ada riwayat untuk dihapus', 'warning');
        return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat transaksi?')) {
        AppState.history = [];
        saveHistoryToLocal();
        renderHistory();
        updateDashboardStats();
        showToast('Semua riwayat berhasil dihapus!', 'success');
    }
}

// ============================================================
// DASHBOARD STATS
// ============================================================

function updateDashboardStats() {
    const total = AppState.history.length;
    const totalEl = document.getElementById('totalTransaksi');
    if (totalEl) totalEl.textContent = total;

    const totalAmount = AppState.history.reduce((sum, t) => sum + t.amount, 0);
    const pengeluaranEl = document.getElementById('totalPengeluaran');
    if (pengeluaranEl) pengeluaranEl.textContent = 'Rp' + totalAmount.toLocaleString('id-ID');

    const today = new Date().toLocaleDateString('id-ID');
    const todayCount = AppState.history.filter(t => {
        const tDate = new Date(t.date).toLocaleDateString('id-ID');
        return tDate === today;
    }).length;
    const todayEl = document.getElementById('transaksiHariIni');
    if (todayEl) todayEl.textContent = todayCount;
}

// ============================================================
// MODAL / RECEIPT
// ============================================================

function showReceipt(transaction) {
    const overlay = document.getElementById('modalOverlay');
    const content = document.getElementById('modalContent');

    content.innerHTML = `
        <h2><i class="fas fa-receipt" style="color:var(--primary);"></i> Bukti Transaksi</h2>
        <div class="receipt">
            <div class="receipt-title">🏷️ Bayarin Disini Aja</div>
            <div style="text-align:center; font-size:0.8rem; color:var(--gray-500); margin-bottom:0.75rem;">
                ID Transaksi: ${transaction.id}
            </div>
            <div class="receipt-row"><span>Tanggal</span><span>${transaction.date}</span></div>
            <div class="receipt-row"><span>Layanan</span><span>${transaction.service}</span></div>
            <div class="receipt-row"><span>Deskripsi</span><span>${transaction.description}</span></div>
            <div class="receipt-row"><span>Metode</span><span>${transaction.method}</span></div>
            <div class="receipt-row"><span>Status</span><span style="color:var(--success); font-weight:600;">✓ SUCCESS</span></div>
            <div class="receipt-row total"><span>Total</span><span>Rp${transaction.amount.toLocaleString('id-ID')}</span></div>
        </div>
        <p style="font-size:0.8rem; color:var(--gray-500); text-align:center; margin-bottom:0.75rem;">
            <i class="fas fa-check-circle" style="color:var(--success);"></i> Transaksi berhasil! Terima kasih telah menggunakan Bayarin Disini Aja.
        </p>
        <div class="modal-actions">
            <button class="btn btn-primary" onclick="window.print()"><i class="fas fa-print"></i> Cetak Struk</button>
            <button class="btn btn-outline" onclick="window.closeModal()"><i class="fas fa-times"></i> Tutup</button>
        </div>
    `;

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }

    // Keyboard shortcut
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.getElementById('modalOverlay').classList.contains('show')) {
                closeModal();
            }
        }
    });
});