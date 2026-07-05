// ============================================================
// MAIN APPLICATION - BILL PAYMENT, SPP, PULSA
// ============================================================

// ============================================================
// BILL PAYMENT
// ============================================================

function cekTagihan() {
    const category = AppState.billCategory || document.getElementById('billCategory').value;
    const customerId = document.getElementById('billCustomerId').value.trim();

    // Validasi
    const errorEl = document.getElementById('billError');
    const inputEl = document.getElementById('billCustomerId');

    if (!customerId) {
        errorEl.textContent = 'Nomor pelanggan tidak boleh kosong';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    let isValid = false;
    if (category === 'seminar') {
        isValid = /^[a-zA-Z0-9]{4,12}$/.test(customerId);
    } else {
        isValid = /^[0-9]{8,12}$/.test(customerId);
    }

    if (!isValid) {
        errorEl.textContent = category === 'seminar' ?
            'Nomor seminar harus 4-12 karakter alfanumerik' :
            'Nomor pelanggan harus 8-12 digit angka';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    errorEl.classList.remove('show');
    inputEl.classList.remove('error');

    // Loading
    const loading = document.getElementById('billLoading');
    loading.classList.add('show');
    document.getElementById('billResult').classList.remove('show');

    // Simulasi API call
    setTimeout(() => {
        loading.classList.remove('show');

        const data = billData[category];
        if (!data || !data[customerId]) {
            showToast('Nomor pelanggan tidak ditemukan!', 'error');
            return;
        }

        AppState.billCustomerId = customerId;
        AppState.billData = data[customerId];
        AppState.billCategory = category;

        renderBillResult(category, customerId, data[customerId]);
        document.getElementById('billResult').classList.add('show');
        showToast('Data tagihan ditemukan!', 'success');
    }, 800);
}

function renderBillResult(category, customerId, data) {
    const container = document.getElementById('billDetail');
    const total = data.amount + (data.fine || 0);

    container.innerHTML = `
        <div class="bill-detail-item"><span class="label">Kategori</span><span class="value">${categoryNames[category]}</span></div>
        <div class="bill-detail-item"><span class="label">Nomor Pelanggan</span><span class="value">${customerId}</span></div>
        <div class="bill-detail-item"><span class="label">Nama Pelanggan</span><span class="value">${data.name}</span></div>
        <div class="bill-detail-item"><span class="label">Alamat / Periode</span><span class="value">${data.address || data.period}</span></div>
        <div class="bill-detail-item"><span class="label">Tagihan Pokok</span><span class="value">Rp${data.amount.toLocaleString('id-ID')}</span></div>
        ${data.fine ? `<div class="bill-detail-item"><span class="label">Denda</span><span class="value" style="color:var(--danger);">Rp${data.fine.toLocaleString('id-ID')}</span></div>` : ''}
        <div class="bill-detail-item"><span class="label">Jatuh Tempo</span><span class="value">${data.due}</span></div>
        <div class="bill-detail-item" style="border-bottom:none;"><span class="label" style="font-weight:700;">Total Dibayar</span><span class="value total">Rp${total.toLocaleString('id-ID')}</span></div>
    `;

    // Reset payment method
    AppState.billPaymentMethod = null;
    document.querySelectorAll('#paymentMethods .payment-method').forEach(el => el.classList.remove('active'));
    document.getElementById('paymentDetail').style.display = 'none';

    // Store total for payment
    container.dataset.total = total;
}

function selectPayment(method) {
    AppState.billPaymentMethod = method;
    document.querySelectorAll('#paymentMethods .payment-method').forEach(el => {
        el.classList.toggle('active', el.dataset.method === method);
    });

    const detailEl = document.getElementById('paymentDetail');
    detailEl.style.display = 'block';

    const vaNumber = 'VA-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const details = {
        va: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-university"></i> Virtual Account</div>
            <div style="font-size:0.9rem; color:var(--gray-600);">
                <div>Nomor VA: <strong>${vaNumber}</strong></div>
                <div style="margin-top:4px; font-size:0.8rem;">Transfer ke rekening berikut:</div>
                <div style="font-size:0.8rem; color:var(--gray-500);">
                    BCA: 1234567890 a/n PT Bayarin<br>
                    BNI: 0987654321 a/n PT Bayarin<br>
                    Mandiri: 5678901234 a/n PT Bayarin
                </div>
                <div style="margin-top:4px; font-size:0.8rem; color:var(--warning);">
                    <i class="fas fa-clock"></i> Batas waktu pembayaran: 24 jam
                </div>
            </div>
        `,
        qris: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-qrcode"></i> QRIS</div>
            <div class="qr-wrapper">
                <div id="qrcode"></div>
                <div class="qr-timer">⏱️ Waktu tersisa: <span id="qrTimer">5:00</span></div>
            </div>
            <div style="font-size:0.8rem; color:var(--gray-500); text-align:center;">
                Scan QRIS menggunakan aplikasi mobile banking atau e-wallet
            </div>
        `,
        teller: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-building"></i> Bayar di Teller / Kasir</div>
            <div style="font-size:0.9rem; color:var(--gray-600);">
                <div>Kode Pembayaran: <strong>${'KP-' + Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                <div style="margin-top:6px; font-size:0.8rem;">Datang ke lokasi terdekat:</div>
                <div style="font-size:0.8rem; color:var(--gray-500);">
                    📍 Kantor Pusat: Jl. Merdeka No. 10, Jakarta<br>
                    📍 Cabang Bandung: Jl. Asia Afrika No. 5, Bandung<br>
                    📍 Cabang Surabaya: Jl. Tunjungan No. 8, Surabaya
                </div>
            </div>
        `
    };

    detailEl.innerHTML = details[method] || '';

    // Generate QR Code jika method QRIS
    if (method === 'qris') {
        setTimeout(() => {
            const qrContainer = document.getElementById('qrcode');
            if (qrContainer) {
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, {
                    text: `BAYARIN:${vaNumber}`,
                    width: 160,
                    height: 160,
                    colorDark: '#0d9488',
                    colorLight: '#ffffff'
                });
                startQrTimer();
            }
        }, 100);
    }
}

function startQrTimer() {
    let seconds = 300;
    const timerEl = document.getElementById('qrTimer');
    if (!timerEl) return;

    if (AppState.qrTimerInterval) clearInterval(AppState.qrTimerInterval);

    AppState.qrTimerInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(AppState.qrTimerInterval);
            timerEl.textContent = '⏰ Kadaluarsa!';
            showToast('QRIS telah kadaluarsa, silakan refresh.', 'warning');
            return;
        }
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function prosesBayarTagihan() {
    if (!AppState.billData) {
        showToast('Silakan cek tagihan terlebih dahulu!', 'error');
        return;
    }

    if (!AppState.billPaymentMethod) {
        showToast('Pilih metode pembayaran terlebih dahulu!', 'error');
        return;
    }

    const total = parseInt(document.getElementById('billDetail').dataset.total || '0');

    if (!kurangiSaldo(total)) return;

    const btn = document.getElementById('btnBayarTagihan');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Memproses...';

    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-check"></i> Bayar Sekarang';

        const transaction = {
            id: 'TRX-' + Date.now(),
            date: new Date().toLocaleString('id-ID'),
            service: 'Tagihan',
            description: `${categoryNames[AppState.billCategory]} - ${AppState.billData.name}`,
            amount: total,
            method: AppState.billPaymentMethod.toUpperCase(),
            status: 'success',
            customerId: AppState.billCustomerId
        };

        saveTransaction(transaction);
        showReceipt(transaction);
        resetBill();
        updateDashboardStats();
        renderHistory();
        showToast('Pembayaran berhasil!', 'success');
    }, 1500);
}

function resetBill() {
    document.getElementById('billCustomerId').value = '';
    document.getElementById('billResult').classList.remove('show');
    document.getElementById('billLoading').classList.remove('show');
    document.getElementById('billError').classList.remove('show');
    document.getElementById('billCustomerId').classList.remove('error');
    AppState.billData = null;
    AppState.billPaymentMethod = null;
    document.querySelectorAll('#paymentMethods .payment-method').forEach(el => el.classList.remove('active'));
    document.getElementById('paymentDetail').style.display = 'none';
    if (AppState.qrTimerInterval) clearInterval(AppState.qrTimerInterval);
}

// ============================================================
// SPP / CICILAN
// ============================================================

function cekSpp() {
    const nim = document.getElementById('sppNim').value.trim();
    const errorEl = document.getElementById('sppError');
    const inputEl = document.getElementById('sppNim');

    if (!nim) {
        errorEl.textContent = 'NIM tidak boleh kosong';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    if (!/^[0-9]{9,12}$/.test(nim)) {
        errorEl.textContent = 'NIM harus 9-12 digit angka';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    errorEl.classList.remove('show');
    inputEl.classList.remove('error');

    const loading = document.getElementById('sppLoading');
    loading.classList.add('show');
    document.getElementById('sppResult').style.display = 'none';

    setTimeout(() => {
        loading.classList.remove('show');

        const data = sppData[nim];
        if (!data) {
            showToast('NIM tidak terdaftar!', 'error');
            return;
        }

        AppState.sppNim = nim;
        AppState.sppData = data;
        AppState.sppSelected = [];

        renderSppList(data);
        document.getElementById('sppResult').style.display = 'block';
        showToast('Data SPP ditemukan!', 'success');
    }, 800);
}

function renderSppList(data) {
    const container = document.getElementById('sppList');
    document.getElementById('sppMahasiswa').textContent =
        `${data.name} - ${data.semester}`;

    let html = '';
    data.cicilan.forEach((item, index) => {
        const isPaid = item.status === 'paid';
        html += `
            <div class="spp-item">
                <div class="spp-info">
                    ${!isPaid ? `<input type="checkbox" data-index="${index}" onchange="window.toggleSpp(${index})" />` : `<span style="width:18px;"></span>`}
                    <span class="spp-desc">${item.desc}</span>
                </div>
                <div style="display:flex; align-items:center; gap:0.75rem;">
                    <span class="spp-amount">Rp${item.amount.toLocaleString('id-ID')}</span>
                    <span class="spp-status ${isPaid ? 'paid' : 'unpaid'}">${isPaid ? '✓ Lunas' : 'Belum Lunas'}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateSppTotal();
}

function toggleSpp(index) {
    const checkbox = document.querySelector(`.spp-item input[data-index="${index}"]`);
    if (!checkbox) return;

    const isChecked = checkbox.checked;
    if (isChecked) {
        if (!AppState.sppSelected.includes(index)) {
            AppState.sppSelected.push(index);
        }
    } else {
        AppState.sppSelected = AppState.sppSelected.filter(i => i !== index);
    }

    updateSppTotal();
}

function updateSppTotal() {
    if (!AppState.sppData) return;

    const total = AppState.sppSelected.reduce((sum, idx) => {
        const item = AppState.sppData.cicilan[idx];
        return item && item.status === 'unpaid' ? sum + item.amount : sum;
    }, 0);

    document.getElementById('sppTotalAmount').textContent =
        total > 0 ? 'Rp' + total.toLocaleString('id-ID') : 'Rp0';
}

function prosesBayarSpp() {
    if (!AppState.sppData) {
        showToast('Silakan cek NIM terlebih dahulu!', 'error');
        return;
    }

    const selectedItems = AppState.sppSelected.filter(idx => {
        return AppState.sppData.cicilan[idx] && AppState.sppData.cicilan[idx].status === 'unpaid';
    });

    if (selectedItems.length === 0) {
        showToast('Pilih minimal 1 cicilan yang belum lunas!', 'warning');
        return;
    }

    const total = selectedItems.reduce((sum, idx) => sum + AppState.sppData.cicilan[idx].amount, 0);

    if (!kurangiSaldo(total)) return;

    selectedItems.forEach(idx => {
        AppState.sppData.cicilan[idx].status = 'paid';
    });

    const transaction = {
        id: 'TRX-' + Date.now(),
        date: new Date().toLocaleString('id-ID'),
        service: 'SPP',
        description: `SPP ${AppState.sppData.name} - ${selectedItems.length} cicilan`,
        amount: total,
        method: 'SPP',
        status: 'success',
        nim: AppState.sppNim
    };

    saveTransaction(transaction);
    showReceipt(transaction);
    renderSppList(AppState.sppData);
    AppState.sppSelected = [];
    updateDashboardStats();
    renderHistory();
    showToast(`Pembayaran SPP ${selectedItems.length} cicilan berhasil!`, 'success');
}

function resetSpp() {
    document.getElementById('sppNim').value = '';
    document.getElementById('sppResult').style.display = 'none';
    document.getElementById('sppError').classList.remove('show');
    document.getElementById('sppNim').classList.remove('error');
    AppState.sppData = null;
    AppState.sppSelected = [];
}

// ============================================================
// PULSA
// ============================================================

function selectProvider(provider) {
    AppState.pulsaProvider = provider;
    document.querySelectorAll('.provider-item').forEach(el => {
        el.classList.toggle('active', el.dataset.provider === provider);
    });
}

function selectNominal(nominal) {
    const nominalVal = parseInt(nominal);
    AppState.pulsaNominal = nominalVal;
    document.querySelectorAll('.nominal-item').forEach(el => {
        el.classList.toggle('active', el.dataset.nominal === nominal);
    });
    document.getElementById('pulsaCustom').value = '';
}

function cekPulsa() {
    const phone = document.getElementById('pulsaPhone').value.trim();
    const errorEl = document.getElementById('pulsaError');
    const inputEl = document.getElementById('pulsaPhone');

    if (!phone) {
        errorEl.textContent = 'Nomor HP tidak boleh kosong';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    if (!/^08[0-9]{8,11}$/.test(phone)) {
        errorEl.textContent = 'Nomor HP harus 10-13 digit dan diawali 08';
        errorEl.classList.add('show');
        inputEl.classList.add('error');
        return;
    }

    errorEl.classList.remove('show');
    inputEl.classList.remove('error');

    // Cek provider dari nomor
    let detectedProvider = null;
    for (const [prefix, prov] of Object.entries(providerMapping)) {
        if (phone.startsWith(prefix)) {
            detectedProvider = prov;
            break;
        }
    }

    if (detectedProvider && AppState.pulsaProvider && detectedProvider !== AppState.pulsaProvider) {
        showToast(`Nomor HP terdeteksi ${providerNames[detectedProvider]}, provider akan disesuaikan.`, 'warning');
        AppState.pulsaProvider = detectedProvider;
        document.querySelectorAll('.provider-item').forEach(el => {
            el.classList.toggle('active', el.dataset.provider === detectedProvider);
        });
    } else if (!AppState.pulsaProvider) {
        if (detectedProvider) {
            AppState.pulsaProvider = detectedProvider;
            document.querySelectorAll('.provider-item').forEach(el => {
                el.classList.toggle('active', el.dataset.provider === detectedProvider);
            });
        } else {
            showToast('Silakan pilih provider terlebih dahulu!', 'error');
            return;
        }
    }

    const customVal = document.getElementById('pulsaCustom').value;
    let nominal = AppState.pulsaNominal;
    if (customVal && parseInt(customVal) > 0) {
        nominal = parseInt(customVal);
    }

    if (!nominal || nominal < 5000) {
        showToast('Pilih nominal pulsa yang valid (minimal Rp5.000)!', 'error');
        return;
    }

    AppState.pulsaPhone = phone;

    const loading = document.getElementById('pulsaLoading');
    loading.classList.add('show');
    document.getElementById('pulsaResult').classList.remove('show');

    setTimeout(() => {
        loading.classList.remove('show');

        const detailEl = document.getElementById('pulsaDetail');
        detailEl.innerHTML = `
            <div class="bill-detail-item"><span class="label">Provider</span><span class="value">${providerNames[AppState.pulsaProvider] || AppState.pulsaProvider}</span></div>
            <div class="bill-detail-item"><span class="label">Nomor Tujuan</span><span class="value">${phone}</span></div>
            <div class="bill-detail-item"><span class="label">Nominal</span><span class="value">Rp${nominal.toLocaleString('id-ID')}</span></div>
            <div class="bill-detail-item" style="border-bottom:none;"><span class="label" style="font-weight:700;">Total Dibayar</span><span class="value total">Rp${nominal.toLocaleString('id-ID')}</span></div>
        `;
        detailEl.dataset.total = nominal;

        AppState.pulsaPaymentMethod = null;
        document.querySelectorAll('#paymentMethodsPulsa .payment-method').forEach(el => el.classList.remove('active'));
        document.getElementById('paymentDetailPulsa').style.display = 'none';

        document.getElementById('pulsaResult').classList.add('show');
        showToast('Detail pembelian siap!', 'success');
    }, 600);
}

function selectPaymentPulsa(method) {
    AppState.pulsaPaymentMethod = method;
    document.querySelectorAll('#paymentMethodsPulsa .payment-method').forEach(el => {
        el.classList.toggle('active', el.dataset.method === method);
    });

    const detailEl = document.getElementById('paymentDetailPulsa');
    detailEl.style.display = 'block';

    const vaNumber = 'VA-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const details = {
        va: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-university"></i> Virtual Account</div>
            <div style="font-size:0.9rem; color:var(--gray-600);">
                <div>Nomor VA: <strong>${vaNumber}</strong></div>
                <div style="margin-top:4px; font-size:0.8rem;">Transfer ke rekening berikut:</div>
                <div style="font-size:0.8rem; color:var(--gray-500);">
                    BCA: 1234567890 a/n PT Bayarin<br>
                    BNI: 0987654321 a/n PT Bayarin<br>
                    Mandiri: 5678901234 a/n PT Bayarin
                </div>
            </div>
        `,
        qris: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-qrcode"></i> QRIS</div>
            <div class="qr-wrapper">
                <div id="qrcodePulsa"></div>
                <div class="qr-timer">⏱️ Waktu tersisa: <span id="qrTimerPulsa">5:00</span></div>
            </div>
        `,
        teller: `
            <div style="font-weight:600; margin-bottom:4px;"><i class="fas fa-building"></i> Bayar di Teller / Kasir</div>
            <div style="font-size:0.9rem; color:var(--gray-600);">
                <div>Kode Pembayaran: <strong>${'KP-' + Math.random().toString(36).substring(2, 8).toUpperCase()}</strong></div>
                <div style="margin-top:6px; font-size:0.8rem;">Datang ke lokasi terdekat:</div>
                <div style="font-size:0.8rem; color:var(--gray-500);">
                    📍 Kantor Pusat: Jl. Merdeka No. 10, Jakarta<br>
                    📍 Cabang Bandung: Jl. Asia Afrika No. 5, Bandung
                </div>
            </div>
        `
    };

    detailEl.innerHTML = details[method] || '';

    if (method === 'qris') {
        setTimeout(() => {
            const qrContainer = document.getElementById('qrcodePulsa');
            if (qrContainer) {
                qrContainer.innerHTML = '';
                new QRCode(qrContainer, {
                    text: `BAYARIN-PULSA:${vaNumber}`,
                    width: 160,
                    height: 160,
                    colorDark: '#0d9488',
                    colorLight: '#ffffff'
                });
                startQrTimerPulsa();
            }
        }, 100);
    }
}

function startQrTimerPulsa() {
    let seconds = 300;
    const timerEl = document.getElementById('qrTimerPulsa');
    if (!timerEl) return;

    if (AppState.qrTimerPulsaInterval) clearInterval(AppState.qrTimerPulsaInterval);

    AppState.qrTimerPulsaInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(AppState.qrTimerPulsaInterval);
            timerEl.textContent = '⏰ Kadaluarsa!';
            showToast('QRIS telah kadaluarsa, silakan refresh.', 'warning');
            return;
        }
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

function prosesBayarPulsa() {
    const detailEl = document.getElementById('pulsaDetail');
    const total = parseInt(detailEl.dataset.total || '0');

    if (!total || total < 5000) {
        showToast('Silakan cek ulang detail pembelian!', 'error');
        return;
    }

    if (!AppState.pulsaPaymentMethod) {
        showToast('Pilih metode pembayaran!', 'error');
        return;
    }

    if (!kurangiSaldo(total)) return;

    const transaction = {
        id: 'TRX-' + Date.now(),
        date: new Date().toLocaleString('id-ID'),
        service: 'Pulsa',
        description: `Pulsa ${providerNames[AppState.pulsaProvider] || AppState.pulsaProvider} - ${AppState.pulsaPhone}`,
        amount: total,
        method: AppState.pulsaPaymentMethod.toUpperCase(),
        status: 'success',
        phone: AppState.pulsaPhone
    };

    saveTransaction(transaction);
    showReceipt(transaction);

    // Reset pulsa
    document.getElementById('pulsaResult').classList.remove('show');
    document.getElementById('pulsaPhone').value = '';
    document.querySelectorAll('.provider-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nominal-item').forEach(el => el.classList.remove('active'));
    document.getElementById('pulsaCustom').value = '';
    document.querySelectorAll('#paymentMethodsPulsa .payment-method').forEach(el => el.classList.remove('active'));
    document.getElementById('paymentDetailPulsa').style.display = 'none';
    AppState.pulsaProvider = null;
    AppState.pulsaNominal = null;
    AppState.pulsaPaymentMethod = null;

    if (AppState.qrTimerPulsaInterval) clearInterval(AppState.qrTimerPulsaInterval);

    updateDashboardStats();
    renderHistory();
    showToast('Pengisian pulsa berhasil!', 'success');
}

// ============================================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================================

window.navigateTo = navigateTo;
window.cekTagihan = cekTagihan;
window.selectPayment = selectPayment;
window.prosesBayarTagihan = prosesBayarTagihan;
window.resetBill = resetBill;
window.cekSpp = cekSpp;
window.toggleSpp = toggleSpp;
window.prosesBayarSpp = prosesBayarSpp;
window.resetSpp = resetSpp;
window.selectProvider = selectProvider;
window.selectNominal = selectNominal;
window.cekPulsa = cekPulsa;
window.selectPaymentPulsa = selectPaymentPulsa;
window.prosesBayarPulsa = prosesBayarPulsa;
window.filterHistory = filterHistory;
window.clearHistory = clearHistory;
window.closeModal = closeModal;
window.showToast = showToast;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;

// ============================================================
// INIT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Set default bill category
    const billCategory = document.getElementById('billCategory');
    if (billCategory) {
        billCategory.value = 'pln';
        AppState.billCategory = 'pln';
        billCategory.addEventListener('change', function() {
            AppState.billCategory = this.value;
            resetBill();
        });
    }

    // Enter key handlers
    document.getElementById('billCustomerId').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') cekTagihan();
    });
    document.getElementById('sppNim').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') cekSpp();
    });
    document.getElementById('pulsaPhone').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') cekPulsa();
    });

    // Nominal custom input
    document.getElementById('pulsaCustom').addEventListener('input', function() {
        const val = this.value;
        document.querySelectorAll('.nominal-item').forEach(el => el.classList.remove('active'));
        if (val && parseInt(val) > 0) {
            AppState.pulsaNominal = parseInt(val);
        } else {
            AppState.pulsaNominal = null;
        }
    });

    // Nav click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateTo(section);
        });
    });

    // Check if already logged in (session)
    const savedUser = localStorage.getItem('bayarin_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            const validUser = validUsers.find(u => u.email === user.email);
            if (validUser) {
                AppState.currentUser = validUser;
                AppState.isLoggedIn = true;
                document.getElementById('loginPage').style.display = 'none';
                document.getElementById('appContainer').style.display = 'flex';
                document.getElementById('userNameDisplay').textContent = validUser.name;
                loadHistory();
                updateDashboardStats();
                updateSaldoDisplay();
                navigateTo('dashboard');
                return;
            }
        } catch (e) {}
    }

    // Show login page by default
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';

    // Pre-fill login form
    document.getElementById('loginEmail').value = 'admin@bayarin.com';
    document.getElementById('loginPassword').value = 'password123';

    console.log('🏷️ Bayarin Disini Aja v2.0 - Dengan Fitur Login');
    console.log('📧 Akun demo: admin@bayarin.com / password123');
    console.log('📦 Data dummy tersedia untuk PLN, PDAM, Internet, Seminar, dan SPP.');
    console.log('💡 Gunakan NIM: 202310001, 202310002, 202310003');
    console.log('📱 Contoh nomor HP: 08123456789');
});

// Save user session on login
const originalHandleLogin = handleLogin;
handleLogin = function(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const user = validUsers.find(u => u.email === email && u.password === password);

    if (user) {
        try {
            localStorage.setItem('bayarin_user', JSON.stringify({ email: user.email, name: user.name }));
        } catch (e) {}
    }

    originalHandleLogin(event);
};