// ============================================================
// DATA SIMULASI - BILL DATA
// ============================================================

const billData = {
    pln: {
        "1234567890": { name: "Budi Santoso", address: "Jl. Merdeka No. 12, Jakarta", period: "Desember 2024",
            amount: 245000, fine: 0, due: "2025-01-15" },
        "2345678901": { name: "Siti Rahayu", address: "Jl. Sudirman Kav 22, Bandung", period: "Desember 2024",
            amount: 512000, fine: 15000, due: "2025-01-20" },
        "3456789012": { name: "Ahmad Fauzi", address: "Jl. Raya No. 8, Surabaya", period: "Desember 2024",
            amount: 187000, fine: 0, due: "2025-01-10" },
        "4567890123": { name: "Dewi Lestari", address: "Jl. Gatot Subroto No. 45, Medan", period: "Desember 2024",
            amount: 732000, fine: 25000, due: "2025-01-25" },
        "5678901234": { name: "Rudi Hermawan", address: "Jl. Pahlawan No. 7, Semarang", period: "Desember 2024",
            amount: 398000, fine: 0, due: "2025-01-18" }
    },
    pdam: {
        "8765432109": { name: "PT Maju Bersama", address: "Jl. Industri No. 3, Jakarta", period: "Desember 2024",
            amount: 125000, fine: 0, due: "2025-01-12" },
        "7654321098": { name: "Rumah Tangga", address: "Jl. Mawar No. 5, Bandung", period: "Desember 2024",
            amount: 87000, fine: 5000, due: "2025-01-14" },
        "6543210987": { name: "Kantor Pusat", address: "Jl. Perkantoran No. 1, Surabaya", period: "Desember 2024",
            amount: 210000, fine: 0, due: "2025-01-19" }
    },
    internet: {
        "9988776655": { name: "PT Digital Nusantara", address: "Jl. Teknologi No. 9, Jakarta", period: "Desember 2024",
            amount: 350000, fine: 0, due: "2025-01-13" },
        "8877665544": { name: "Rumah", address: "Jl. Flamboyan No. 2, Bandung", period: "Desember 2024",
            amount: 275000, fine: 10000, due: "2025-01-16" },
        "7766554433": { name: "Warnet Net", address: "Jl. Raya No. 15, Semarang", period: "Desember 2024",
            amount: 425000, fine: 0, due: "2025-01-21" }
    },
    seminar: {
        "SEM001": { name: "Tech Conference 2024", address: "Jakarta Convention Center", period: "20-21 Desember 2024",
            amount: 850000, fine: 0, due: "2024-12-10" },
        "SEM002": { name: "Digital Marketing Bootcamp", address: "Online - Zoom", period: "15-17 Desember 2024",
            amount: 450000, fine: 0, due: "2024-12-12" },
        "SEM003": { name: "AI & Data Science Summit", address: "Hotel Indonesia, Jakarta", period: "5-6 Januari 2025",
            amount: 1200000, fine: 0, due: "2025-01-03" }
    }
};

// ============================================================
// DATA SIMULASI - SPP
// ============================================================

const sppData = {
    "202310001": {
        name: "Andi Pratama",
        semester: "Ganjil 2024/2025",
        cicilan: [
            { id: 1, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-1", amount: 2500000, status: "paid" },
            { id: 2, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-2", amount: 2500000, status: "paid" },
            { id: 3, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-3", amount: 2500000, status: "unpaid" },
            { id: 4, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-4", amount: 2500000, status: "unpaid" },
            { id: 5, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-5", amount: 2500000, status: "unpaid" },
            { id: 6, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-6", amount: 2500000, status: "unpaid" }
        ]
    },
    "202310002": {
        name: "Bunga Citra",
        semester: "Genap 2024/2025",
        cicilan: [
            { id: 1, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-1", amount: 2750000, status: "paid" },
            { id: 2, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-2", amount: 2750000, status: "unpaid" },
            { id: 3, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-3", amount: 2750000, status: "unpaid" },
            { id: 4, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-4", amount: 2750000, status: "unpaid" },
            { id: 5, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-5", amount: 2750000, status: "unpaid" },
            { id: 6, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-6", amount: 2750000, status: "unpaid" },
            { id: 7, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-7", amount: 2750000, status: "unpaid" },
            { id: 8, desc: "SPP Semester Genap 2024/2025 - Cicilan ke-8", amount: 2750000, status: "unpaid" }
        ]
    },
    "202310003": {
        name: "Dewi Sartika",
        semester: "Ganjil 2024/2025",
        cicilan: [
            { id: 1, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-1", amount: 2200000, status: "paid" },
            { id: 2, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-2", amount: 2200000, status: "paid" },
            { id: 3, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-3", amount: 2200000, status: "paid" },
            { id: 4, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-4", amount: 2200000, status: "unpaid" },
            { id: 5, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-5", amount: 2200000, status: "unpaid" },
            { id: 6, desc: "SPP Semester Ganjil 2024/2025 - Cicilan ke-6", amount: 2200000, status: "unpaid" }
        ]
    }
};

// ============================================================
// PROVIDER MAPPING
// ============================================================

const providerMapping = {
    "081": "telkomsel",
    "082": "telkomsel",
    "083": "telkomsel",
    "085": "indosat",
    "086": "indosat",
    "087": "xl",
    "088": "xl",
    "089": "tri",
    "0811": "telkomsel",
    "0812": "telkomsel",
    "0813": "telkomsel",
    "0814": "indosat",
    "0815": "indosat",
    "0816": "indosat",
    "0817": "xl",
    "0818": "xl",
    "0819": "xl",
    "0851": "indosat",
    "0852": "indosat",
    "0853": "indosat",
    "0855": "indosat",
    "0856": "indosat",
    "0857": "indosat",
    "0858": "indosat",
    "0877": "xl",
    "0878": "xl",
    "0879": "xl",
    "0881": "smartfren",
    "0882": "smartfren",
    "0883": "smartfren",
    "0884": "smartfren",
    "0885": "smartfren",
    "0886": "smartfren",
    "0887": "smartfren",
    "0888": "smartfren",
    "0895": "tri",
    "0896": "tri",
    "0897": "tri",
    "0898": "tri",
    "0899": "tri",
    "0831": "axis",
    "0832": "axis",
    "0833": "axis",
    "0834": "axis",
    "0835": "axis",
    "0836": "axis",
    "0837": "axis",
    "0838": "axis",
    "0839": "axis"
};

const providerNames = {
    telkomsel: 'Telkomsel',
    xl: 'XL Axiata',
    indosat: 'Indosat Ooredoo',
    tri: 'Tri (3)',
    smartfren: 'Smartfren',
    axis: 'Axis'
};

const categoryNames = {
    pln: 'Listrik (PLN)',
    pdam: 'PDAM',
    internet: 'Internet',
    seminar: 'Seminar / Event'
};

// ============================================================
// USER DATA
// ============================================================

const validUsers = [
    { email: 'admin@bayarin.com', password: 'password123', name: 'Administrator' },
    { email: 'user@bayarin.com', password: 'user123', name: 'Pengguna' },
    { email: 'demo@bayarin.com', password: 'demo123', name: 'Demo User' }
];