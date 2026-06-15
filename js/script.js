// Theme management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('darkMode') !== 'false');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else {
        if (themeToggle) themeToggle.textContent = '🌙';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', isDark);
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }
}

const spinCost = 2000000;

const products = [
    { id: 1, category: 'reg', name: '[Rank Cao] Acc Rank Kim Cương 1', price: 450000, description: 'Rank Kim Cương, nhiều tướng và trang phục. Thích hợp leo rank.', image: 'https://picsum.photos/seed/lq1/600/400', details: 'Rank: Kim Cương\nTướng nổi bật: Nakroth, Zill\nTrang phục: nhiều' },
    { id: 2, category: 'reg', name: '[Rank Cao] Acc Rank Cao Thủ', price: 950000, description: 'Acc Cao Thủ, tướng đa dạng, có skin hiếm.', image: 'https://picsum.photos/seed/lq2/600/400', details: 'Rank: Cao Thủ\nTướng nổi bật: Raz, Florentino\nTrang phục: có skin hiếm' },
    { id: 3, category: 'reg', name: '[Rank Trung] Acc Rank Vàng', price: 180000, description: 'Acc Vàng, phù hợp người mới muốn thử tướng mạnh.', image: 'https://picsum.photos/seed/lq3/600/400', details: 'Rank: Vàng\nTướng nổi bật: Veera, Tulen' },
    { id: 4, category: 'reg', name: '[Acc Tướng Hot] Acc full tướng 40+', price: 1250000, description: 'Acc có hơn 40 tướng, nhiều tướng hot.', image: 'https://picsum.photos/seed/lq4/600/400', details: 'Số tướng: 40+\nTrang phục: nhiều' },
    { id: 14, category: 'reg', name: 'Reg nak vệ thần', price: 1400000, description: 'Acc reg theo hình, giao dịch nhanh.', image: 'https://shoptethan.com/files/28/images/2023-05-25/nes1-Wn.webp', details: 'Acc reg, xem hình để biết chi tiết về tài khoản.' },
    { id: 5, category: 'gia-re', name: '[Acc Giá Rẻ] Acc Rank Bạc', price: 90000, description: 'Acc giá rẻ, Rank Bạc, dành cho người mới.', image: 'https://picsum.photos/seed/lq5/600/400', details: 'Rank: Bạc\nGiá tốt cho người mới' },
    { id: 6, category: 'vip', name: '[VIP] Acc Full Tướng 60+ Skin Hiếm', price: 2500000, description: 'Acc VIP full tướng 60+, nhiều skin hiếm, rank cao chuyên leo.', image: 'https://picsum.photos/seed/lqvip1/600/400', details: 'Rank: Cao Thủ/Quán Quân\nTướng: full 60+\nSkin hiếm: nhiều' },
    { id: 7, category: 'vip', name: '[VIP] Acc Siêu Xịn Full Tướng & Skin', price: 3200000, description: 'Acc siêu VIP, full tướng, skin limited và nhiều tướng meta.', image: 'https://picsum.photos/seed/lqvip2/600/400', details: 'Rank: Quán Quân/Chiến Tướng\nTướng: full\nSkin: hạn chế' }
];

let currentCategory = 'reg';

function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + ' ₫';
}

function renderProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    const filtered = products.filter(product => product.category === currentCategory);
    if (!filtered.length) {
        productList.innerHTML = '<div class="empty">Không có acc trong mục này. Vui lòng chọn danh mục khác.</div>';
        return;
    }
    const canBuy = isLoggedIn();
    productList.innerHTML = filtered.map(product => {
        const buyButton = canBuy
            ? `<button type="button" onclick="buyNow(${product.id})">Mua ngay</button>`
            : `<button type="button" class="btn-secondary disabled-btn" onclick="promptLogin()">Đăng nhập để mua</button>`;
        return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" />
            <div class="badge">${product.name.split(']')[0].replace('[', '')}</div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${formatCurrency(product.price)}</div>
            <div class="button-row">
                ${buyButton}
                <button type="button" class="secondary-btn" onclick="showDetails(${product.id})">Chi tiết</button>
            </div>
        </div>
    `;
    }).join('');
}

function getCategoryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    return category === 'gia-re' || category === 'vip' ? category : 'reg';
}

function updateCategoryPage() {
    const category = getCategoryFromUrl();
    currentCategory = category;
    const title = document.getElementById('categoryTitle');
    const badge = document.getElementById('categoryBadge');
    const description = document.getElementById('categoryDescription');

    if (!title || !badge || !description) return;

    if (category === 'gia-re') {
        badge.textContent = 'Acc Giá Rẻ';
        title.textContent = 'Acc Giá Rẻ Cho Người Mới';
        description.textContent = 'Các acc giá tốt, phù hợp người mới muốn mua nhanh và tiết kiệm.';
    } else if (category === 'vip') {
        badge.textContent = 'Acc VIP';
        title.textContent = 'Acc VIP Siêu Xịn';
        description.textContent = 'Acc premium full tướng, nhiều skin hiếm và rank cao - giá trên cả xịn.';
    } else {
        badge.textContent = 'Acc Reg';
        title.textContent = 'Acc Reg Chất Lượng';
        description.textContent = 'Danh sách acc reg cao, rank tốt và đầy đủ tướng để leo rank.';
    }

    renderProducts();
}

function buyNow(id) {
    if (!isLoggedIn()) {
        promptLogin();
        return;
    }
    const product = products.find(item => item.id === id);
    if (!product) return;

    const currentBalance = getCurrentUserBalance();
    if (currentBalance < product.price) {
        alert('Số dư không đủ. Vui lòng nạp thêm tiền để mua sản phẩm này.');
        return;
    }

    const confirmed = confirm(`Xác nhận mua ${product.name} với giá ${formatCurrency(product.price)}?`);
    if (!confirmed) return;

    setCurrentUserBalance(currentBalance - product.price);
    alert(`Bạn đã mua thành công ${product.name}. Acc đã được mua.
Số dư còn lại: ${formatCurrency(getCurrentUserBalance())}.`);
    updateAuthStatusUI();
}

function receivePrize(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;
    alert(`Bạn đã nhận acc ${product.name}! Hãy kiểm tra phần hỗ trợ để nhận thông tin chuyển nhượng.`);
}

function showDetails(id) {
    const p = products.find(x => x.id === id);
    if (!p) return;
    alert(p.name + "\n" + p.details + "\nGiá: " + formatCurrency(p.price));
}

function promptLogin() {
    showAuthModal('login');
}

function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('lqShopUsers') || '{}');
    } catch (e) {
        return {};
    }
}

function saveUsers(users) {
    localStorage.setItem('lqShopUsers', JSON.stringify(users));
}

function getCurrentUsername() {
    return localStorage.getItem('lqShopCurrentUser');
}

function getCurrentUser() {
    const username = getCurrentUsername();
    const users = getStoredUsers();
    return username && users[username] ? users[username] : null;
}

function getCurrentUserBalance() {
    const user = getCurrentUser();
    return user ? Number(user.balance || 0) : 0;
}

function setCurrentUserBalance(amount) {
    const username = getCurrentUsername();
    if (!username) return;
    const users = getStoredUsers();
    if (!users[username]) return;
    users[username].balance = Math.max(0, Number(amount) || 0);
    saveUsers(users);
}

function setCurrentUsername(username) {
    if (username) {
        localStorage.setItem('lqShopCurrentUser', username);
    } else {
        localStorage.removeItem('lqShopCurrentUser');
    }
}

function isLoggedIn() {
    return Boolean(getCurrentUsername());
}

function initAuthUI() {
    const topNav = document.querySelector('.top-nav');
    if (!topNav) return;

    if (!document.getElementById('accountButton')) {
        const accountButton = document.createElement('button');
        accountButton.type = 'button';
        accountButton.id = 'accountButton';
        accountButton.className = 'btn-secondary';
        accountButton.textContent = 'Đăng nhập';
        accountButton.addEventListener('click', () => showAuthModal('login'));
        topNav.appendChild(accountButton);
    }

    if (!document.getElementById('rechargeButton')) {
        const rechargeButton = document.createElement('button');
        rechargeButton.type = 'button';
        rechargeButton.id = 'rechargeButton';
        rechargeButton.className = 'btn-secondary hidden';
        rechargeButton.textContent = 'Nạp tiền';
        rechargeButton.addEventListener('click', showRechargeModal);
        topNav.appendChild(rechargeButton);
    }

    if (!document.getElementById('balanceInfo')) {
        const balanceInfo = document.createElement('div');
        balanceInfo.id = 'balanceInfo';
        balanceInfo.className = 'balance-info hidden';
        topNav.appendChild(balanceInfo);
    }

    if (!document.getElementById('authModal')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="auth-modal hidden" id="authModal">
                <div class="auth-panel">
                    <button type="button" class="modal-close" id="authClose">×</button>
                    <div class="auth-tabs">
                        <button type="button" id="loginTab" class="auth-tab active">Đăng nhập</button>
                        <button type="button" id="registerTab" class="auth-tab">Đăng ký</button>
                    </div>
                    <div class="auth-form">
                        <label class="auth-field">
                            <span>Tên đăng nhập</span>
                            <input id="authUsername" type="text" autocomplete="username" />
                        </label>
                        <label class="auth-field">
                            <span>Mật khẩu</span>
                            <input id="authPassword" type="password" autocomplete="current-password" />
                        </label>
                        <div id="authMessage" class="auth-message"></div>
                        <div class="auth-actions">
                            <button type="button" id="authSubmit" class="btn-primary">Đăng nhập</button>
                            <button type="button" id="authLogout" class="btn-secondary hidden">Đăng xuất</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="auth-modal hidden" id="rechargeModal">
                <div class="auth-panel">
                    <button type="button" class="modal-close" id="rechargeClose">×</button>
                    <h2>Nạp tiền</h2>
                    <p class="section-note">Nhập số tiền để nạp vào tài khoản trước khi mua acc.</p>
                    <div class="auth-form">
                        <label class="auth-field">
                            <span>Số tiền nạp (₫)</span>
                            <input id="rechargeAmount" type="number" min="10000" step="10000" placeholder="100000" />
                        </label>
                        <div class="quick-amounts">
                            <button type="button" onclick="setQuickRecharge(100000)">100k</button>
                            <button type="button" onclick="setQuickRecharge(200000)">200k</button>
                            <button type="button" onclick="setQuickRecharge(500000)">500k</button>
                            <button type="button" onclick="setQuickRecharge(1000000)">1tr</button>
                        </div>
                        <div id="rechargeMessage" class="auth-message"></div>
                        <div class="auth-actions">
                            <button type="button" id="rechargeSubmit" class="btn-primary">Nạp tiền</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    const authModal = document.getElementById('authModal');
    const authClose = document.getElementById('authClose');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authSubmit = document.getElementById('authSubmit');
    const authLogout = document.getElementById('authLogout');
    const rechargeModal = document.getElementById('rechargeModal');
    const rechargeClose = document.getElementById('rechargeClose');
    const rechargeSubmit = document.getElementById('rechargeSubmit');

    authModal?.addEventListener('click', (event) => {
        if (event.target === authModal) hideAuthModal();
    });
    authClose?.addEventListener('click', hideAuthModal);
    loginTab?.addEventListener('click', () => switchAuthTab('login'));
    registerTab?.addEventListener('click', () => switchAuthTab('register'));
    authSubmit?.addEventListener('click', handleAuthAction);
    authLogout?.addEventListener('click', () => {
        setCurrentUsername(null);
        hideAuthModal();
        updateAuthStatusUI();
    });

    rechargeModal?.addEventListener('click', (event) => {
        if (event.target === rechargeModal) hideRechargeModal();
    });
    rechargeClose?.addEventListener('click', hideRechargeModal);
    rechargeSubmit?.addEventListener('click', handleRecharge);

    updateAuthStatusUI();
}

function switchAuthTab(mode) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const authSubmit = document.getElementById('authSubmit');
    const authMessage = document.getElementById('authMessage');

    if (!loginTab || !registerTab || !authSubmit || !authMessage) return;
    loginTab.classList.toggle('active', mode === 'login');
    registerTab.classList.toggle('active', mode === 'register');
    authSubmit.textContent = mode === 'login' ? 'Đăng nhập' : 'Đăng ký';
    authMessage.textContent = '';
    authSubmit.dataset.mode = mode;
}

function showAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    switchAuthTab(mode);
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    document.getElementById('authMessage').textContent = '';
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function showRechargeModal() {
    if (!isLoggedIn()) {
        promptLogin();
        return;
    }
    const modal = document.getElementById('rechargeModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    const amountInput = document.getElementById('rechargeAmount');
    const rechargeMessage = document.getElementById('rechargeMessage');
    if (amountInput) amountInput.value = '';
    if (rechargeMessage) rechargeMessage.textContent = '';
}

function hideRechargeModal() {
    const modal = document.getElementById('rechargeModal');
    if (!modal) return;
    modal.classList.add('hidden');
}

function setQuickRecharge(amount) {
    const amountInput = document.getElementById('rechargeAmount');
    if (!amountInput) return;
    amountInput.value = amount;
}

function handleRecharge() {
    const amountInput = document.getElementById('rechargeAmount');
    const rechargeMessage = document.getElementById('rechargeMessage');
    if (!amountInput || !rechargeMessage) return;
    const amount = Number(amountInput.value);
    if (!amount || amount < 10000) {
        rechargeMessage.textContent = 'Nhập số tiền hợp lệ ít nhất 10.000₫.';
        rechargeMessage.classList.remove('success');
        rechargeMessage.classList.add('error');
        return;
    }
    const newBalance = getCurrentUserBalance() + amount;
    setCurrentUserBalance(newBalance);
    addRechargeHistory(amount);
    rechargeMessage.textContent = 'Nạp tiền thành công!';
    rechargeMessage.classList.remove('error');
    rechargeMessage.classList.add('success');
    updateAuthStatusUI();
    if (typeof loadRechargeHistory === 'function' && document.getElementById('rechargeList')) {
        loadRechargeHistory();
    }
    setTimeout(hideRechargeModal, 900);
}

function addRechargeHistory(amount) {
    const username = getCurrentUsername();
    if (!username) return;
    const history = getRechargeHistory();
    history.push({
        amount: amount,
        date: new Date().toLocaleString('vi-VN'),
        status: 'Thành công'
    });
    localStorage.setItem(`rechargeHistory_${username}`, JSON.stringify(history));
}

function getRechargeHistory() {
    const username = getCurrentUsername();
    if (!username) return [];
    const historyJson = localStorage.getItem(`rechargeHistory_${username}`);
    if (!historyJson) return [];
    try {
        const parsed = JSON.parse(historyJson);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        if (parsed && typeof parsed === 'object') {
            return [parsed];
        }
    } catch (e) {
        // ignore invalid data
    }
    return [];
}

function handleAuthAction() {
    const authSubmit = document.getElementById('authSubmit');
    const authMessage = document.getElementById('authMessage');
    const usernameInput = document.getElementById('authUsername');
    const passwordInput = document.getElementById('authPassword');

    if (!authSubmit || !authMessage || !usernameInput || !passwordInput) return;

    const mode = authSubmit.dataset.mode || 'login';
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const users = getStoredUsers();

    if (!username || !password) {
        authMessage.textContent = 'Nhập tên và mật khẩu để tiếp tục.';
        return;
    }

    if (mode === 'register') {
        if (users[username]) {
            authMessage.textContent = 'Tài khoản đã tồn tại. Vui lòng chọn tên khác.';
            return;
        }
        users[username] = { password, balance: 0 };
        saveUsers(users);
        setCurrentUsername(username);
        hideAuthModal();
        updateAuthStatusUI();
        return;
    }

    const account = users[username];
    if (account && typeof account.balance === 'undefined') {
        users[username].balance = 0;
        saveUsers(users);
    }
    if (!account || account.password !== password) {
        authMessage.textContent = 'Tên đăng nhập hoặc mật khẩu sai.';
        return;
    }

    setCurrentUsername(username);
    hideAuthModal();
    updateAuthStatusUI();
}

function updateAuthStatusUI() {
    const accountButton = document.getElementById('accountButton');
    const rechargeButton = document.getElementById('rechargeButton');
    const balanceInfo = document.getElementById('balanceInfo');
    const authLogout = document.getElementById('authLogout');
    const authSubmit = document.getElementById('authSubmit');
    const isAuth = isLoggedIn();
    const username = getCurrentUsername();

    if (accountButton) {
        accountButton.textContent = isAuth ? `Xin chào, ${username}` : 'Đăng nhập';
    }
    if (rechargeButton) {
        rechargeButton.classList.toggle('hidden', !isAuth);
    }
    if (balanceInfo) {
        balanceInfo.textContent = isAuth ? `Số dư: ${formatCurrency(getCurrentUserBalance())}` : '';
        balanceInfo.classList.toggle('hidden', !isAuth);
    }
    if (authLogout) {
        authLogout.classList.toggle('hidden', !isAuth);
    }
    if (authSubmit && authSubmit.dataset.mode === 'login' && isAuth) {
        authSubmit.textContent = 'Đăng nhập';
    }
    renderFeatured();
    renderProducts();
    if (window.location.pathname.endsWith('random.html')) {
        updateSpinAccess();
    }
}

function updateSpinAccess() {
    const spinButton = document.getElementById('spinButton');
    const spinNote = document.querySelector('.spin-note');
    if (!spinButton) return;
    if (isLoggedIn()) {
        spinButton.textContent = 'Quay ngay - 2 triệu';
        spinNote.textContent = 'Mỗi lượt quay tiêu tốn 2 triệu. Giá trị cao hơn ít xuất hiện hơn.';
    } else {
        spinButton.textContent = 'Đăng nhập để quay';
        spinNote.textContent = 'Bạn cần đăng nhập để sử dụng vòng quay may mắn.';
    }
}

let currentRotation = 0;

const spinPrizes = [
    { id: 8, category: 'random', name: '[Quay] Acc Cực VIP 10tr', price: 10000000, description: 'Acc cực vip full tướng + skin hiếm, giá trị cao nhất.', image: 'https://picsum.photos/seed/randomvip1/600/400', details: 'Rank: Quán Quân+\nSkin: full hiếm\nGiá trị: 10 triệu' },
    { id: 9, category: 'random', name: '[Quay] Acc VIP 8tr', price: 8000000, description: 'Acc VIP full tướng và nhiều skin, cực khó trúng.', image: 'https://picsum.photos/seed/randomvip2/600/400', details: 'Rank: Quán Quân\nSkin: nhiều\nGiá trị: 8 triệu' },
    { id: 10, category: 'random', name: '[Quay] Acc VIP 6tr', price: 6000000, description: 'Acc VIP cao cấp, nhiều tướng và skin hiếm.', image: 'https://picsum.photos/seed/randomvip3/600/400', details: 'Rank: Cao Thủ\nSkin: chất\nGiá trị: 6 triệu' },
    { id: 11, category: 'random', name: '[Quay] Acc 4tr', price: 4000000, description: 'Acc giá cao, rank ngon và nhiều skin.', image: 'https://picsum.photos/seed/random4m/600/400', details: 'Rank: Kim Cương\nSkin: khá\nGiá trị: 4 triệu' },
    { id: 12, category: 'random', name: '[Quay] Acc 2tr', price: 2000000, description: 'Acc ổn, phù hợp người muốn trải nghiệm acc tốt.', image: 'https://picsum.photos/seed/random2m/600/400', details: 'Rank: Vàng/Cao Thủ\nSkin: thường\nGiá trị: 2 triệu' },
    { id: 13, category: 'random', name: '[Quay] Acc 1tr', price: 1000000, description: 'Acc cơ bản giá tốt, vẫn đủ rank và tướng chơi được.', image: 'https://picsum.photos/seed/random1m/600/400', details: 'Rank: Bạc/Vàng\nSkin: thường\nGiá trị: 1 triệu' }
];

function getWeightedPrize() {
    const weights = [1, 2, 4, 8, 15, 30];
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const rand = Math.random() * totalWeight;
    let running = 0;
    for (let i = 0; i < weights.length; i++) {
        running += weights[i];
        if (rand <= running) {
            return spinPrizes[i];
        }
    }
    return spinPrizes[spinPrizes.length - 1];
}

function renderSpinWheel() {
    const spinner = document.getElementById('spinnerWheel');
    if (!spinner) return;
    const tempSlot = document.createElement('div');
    tempSlot.className = 'wheel-slot';
    tempSlot.style.visibility = 'hidden';
    spinner.appendChild(tempSlot);
    const slotSize = tempSlot.offsetWidth || 95;
    spinner.removeChild(tempSlot);
    const radius = Math.max(0, spinner.offsetWidth / 2 - slotSize / 2 - 8);
    spinner.innerHTML = spinPrizes.map((prize, index) => {
        const angle = index * 60;
        return `
            <div class="wheel-slot" style="transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px);">
                <div class="slot-card" style="background-image: url('${prize.image}');"></div>
                <div class="slot-content" style="transform: rotate(${-angle}deg);">
                    <div class="slot-label">${prize.name}</div>
                    <div class="slot-price">${formatCurrency(prize.price)}</div>
                </div>
            </div>
        `;
    }).join('');
}

function performSpin() {
    if (!isLoggedIn()) {
        promptLogin();
        return;
    }
    const currentBalance = getCurrentUserBalance();
    if (currentBalance < spinCost) {
        alert('Bạn cần ít nhất ' + formatCurrency(spinCost) + ' trong số dư để quay vòng. Vui lòng nạp thêm tiền.');
        return;
    }
    setCurrentUserBalance(currentBalance - spinCost);
    updateAuthStatusUI();

    const button = document.getElementById('spinButton');
    const resultBox = document.getElementById('spinResult');
    if (!button || !resultBox) return;
    button.disabled = true;
    button.textContent = 'Đang quay...';
    const prize = getWeightedPrize();
    const selectedIndex = spinPrizes.findIndex(item => item.id === prize.id);
    const baseRotation = 360 * 10 + 30;
    const desiredAngle = 360 - selectedIndex * 60;
    const currentMod = ((currentRotation % 360) + 360) % 360;
    const neededOffset = ((desiredAngle - currentMod) + 360) % 360;
    const targetRotation = currentRotation + baseRotation + neededOffset;
    currentRotation = targetRotation;
    const spinner = document.getElementById('spinnerWheel');
    if (spinner) {
        spinner.style.transition = 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        spinner.style.transform = `rotate(${targetRotation}deg)`;
    }
    setTimeout(() => {
        if (spinner) {
            spinner.style.transition = '';
            spinner.style.transform = `rotate(${targetRotation}deg)`;
        }
        resultBox.innerHTML = `
            <div class="product-card">
                <img src="${prize.image}" alt="${prize.name}" />
                <div class="badge">Thưởng</div>
                <h3>${prize.name}</h3>
                <p>${prize.description}</p>
                <div class="price">${formatCurrency(prize.price)}</div>
                <div class="button-row">
                    <button type="button" onclick="receivePrize(${prize.id})">Nhận acc</button>
                    <button type="button" class="secondary-btn" onclick="showDetails(${prize.id})">Chi tiết</button>
                </div>
            </div>
        `;
        button.disabled = false;
        button.textContent = 'Quay ngay';
    }, 4300);
}

function initSpinPage() {
    const button = document.getElementById('spinButton');
    if (!button) return;
    renderSpinWheel();
    button.addEventListener('click', performSpin);
}

function renderFeatured() {
    const featuredList = document.getElementById('featuredList');
    if (!featuredList) return;
    const featured = products.slice(0, 3);
    const canBuy = isLoggedIn();
    featuredList.innerHTML = featured.map(product => {
        const buyButton = canBuy
            ? `<button type="button" onclick="buyNow(${product.id})">Mua ngay</button>`
            : `<button type="button" class="btn-secondary disabled-btn" onclick="promptLogin()">Đăng nhập để mua</button>`;
        return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${formatCurrency(product.price)}</div>
            ${buyButton}
        </div>
    `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initAuthUI();
    if (window.location.pathname.endsWith('category.html')) {
        updateCategoryPage();
    }
    if (window.location.pathname.endsWith('random.html')) {
        initSpinPage();
    }
    renderFeatured();
    initSupportWidget();
});

function initSupportWidget() {
    const widget = document.getElementById('supportWidget');
    if (!widget) return;

    try {
        const pos = JSON.parse(localStorage.getItem('supportWidgetPos'));
        if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            widget.style.left = pos.x + 'px';
            widget.style.top = pos.y + 'px';
            widget.style.right = 'auto';
            widget.style.bottom = 'auto';
        }
    } catch (e) {}

    const handle = widget.querySelector('.support-handle');
    let dragging = false;
    let offsetX = 0, offsetY = 0;

    handle.addEventListener('pointerdown', (e) => {
        dragging = true;
        widget.setPointerCapture(e.pointerId);
        const rect = widget.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        widget.classList.add('dragging');
        e.preventDefault();
    });

    window.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;
        const w = widget.offsetWidth, h = widget.offsetHeight;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        x = Math.max(8, Math.min(x, vw - w - 8));
        y = Math.max(8, Math.min(y, vh - h - 8));
        widget.style.left = x + 'px';
        widget.style.top = y + 'px';
        widget.style.right = 'auto';
        widget.style.bottom = 'auto';
    });

    window.addEventListener('pointerup', () => {
        if (!dragging) return;
        dragging = false;
        widget.classList.remove('dragging');
        try {
            const rect = widget.getBoundingClientRect();
            localStorage.setItem('supportWidgetPos', JSON.stringify({ x: rect.left, y: rect.top }));
        } catch (e) {}
    });

    const contact = widget.querySelector('.support-contact');
    let tooltip = null;

    function hideTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    function showTooltip(number) {
        hideTooltip();
        tooltip = document.createElement('div');
        tooltip.className = 'support-tooltip';
        tooltip.textContent = number;
        document.body.appendChild(tooltip);
        const rect = widget.getBoundingClientRect();
        const ttRect = tooltip.getBoundingClientRect();
        let left = rect.right - ttRect.width;
        let top = rect.top - ttRect.height - 10;
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        left = Math.max(8, Math.min(left, vw - ttRect.width - 8));
        top = Math.max(8, Math.min(top, vh - ttRect.height - 8));
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    if (contact) {
        contact.addEventListener('click', (e) => {
            e.preventDefault();
            const number = contact.getAttribute('data-number') || '';
            if (tooltip) hideTooltip(); else showTooltip(number);
        });
    }

    window.addEventListener('pointerdown', (e) => {
        if (!widget.contains(e.target)) hideTooltip();
    });
}
