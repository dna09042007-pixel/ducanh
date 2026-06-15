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

const products = [
    { id: 1, name: 'Ấm siêu tốc', price: 420000, description: 'Ấm điện dung tích 1.7L, dễ sử dụng và an toàn.', image: 'https://sunhouse.com.vn/pic/product/images/am-sieu-toc-sunhouse-shd1186_002.png' },
    { id: 2, name: 'Nồi cơm điện', price: 980000, description: 'Nồi cơm điện 1.8L, giữ ấm lâu và nấu nhanh.', image: 'https://anhchinh.vn/Files/450/noi-com-dien/16812_cuckoo_cr1095.jpg' },
    { id: 3, name: 'Quạt đứng', price: 650000, description: 'Quạt đứng 3 tốc độ, làm mát hiệu quả.', image: 'https://cdn.tgdd.vn/Products/Images/1992/324892/quat-dung-midea-mfs400m0bpw-55w-200424-054615-600x600.jpg' },
    { id: 4, name: 'Bình giữ nhiệt', price: 220000, description: 'Bình giữ nhiệt 500ml, giữ lạnh và nóng tốt.', image: 'https://quatangbinhnuoc.com/wp-content/uploads/2020/02/Bi%CC%80nh-Giu%CC%9B%CC%83-Nhie%CC%A3%CC%82t-Inox-304-cao-ca%CC%82%CC%81p-Q051-1.jpg' },
    { id: 5, name: 'Máy xay sinh tố', price: 780000, description: 'Máy xay sinh tố 4 cối, tiện lợi cho gia đình.', image: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTgATslWwPOWvWgj4SyBoccbCfQQeYYNPr9lhejDJbp83s4rCIcMo1LbNjWdPKGf6nGzlEmMlvgKXBmn2_O7bj-v2kNiDDysOVeG2-5LkJzlmnP1lXLN-nG13rT8yS0BtiPLHpI9FCqWag&usqp=CAc' },
    { id: 6, name: 'Đèn bàn học', price: 310000, description: 'Đèn bàn LED tiết kiệm điện, chống cận thị.', image: 'https://losi.vn/img/image/99920/mua-den-ban-hoc-led-hoc-sinh-chong-can-losi-chinh-hang-o-dau-4(1).jpg' }
];

const cart = {};

function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + ' ₫';
}

function renderProducts() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${formatCurrency(product.price)}</div>
            <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        </div>
    `).join('');
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    const cartItems = Object.values(cart);

    if (!cartItems.length) {
        cartContent.innerHTML = '<div class="empty">Giỏ hàng của bạn hiện đang rỗng.</div>';
        const trackingInfo = document.getElementById('trackingInfo');
        if (trackingInfo) trackingInfo.textContent = 'Chưa có Acc nào được thêm vào giỏ hàng.';
        return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const productNames = cartItems.map(item => `${item.name} x${item.quantity}`).join(', ');

    cartContent.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                    <th>Xóa</th>
                </tr>
            </thead>
            <tbody>
                ${cartItems.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.price * item.quantity)}</td>
                        <td><button type="button" onclick="removeFromCart(${item.id})">X</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="cart-actions">
            <div class="total">Tổng: ${formatCurrency(total)}</div>
            <button type="button" onclick="checkout()">Thanh toán</button>
        </div>
    `;

    const trackingInfo = document.getElementById('trackingInfo');
    if (trackingInfo) trackingInfo.textContent = `Đã thêm vào giỏ: ${productNames}. Tổng ${cartItems.length} loại sản phẩm.`;
}

function addToCart(id) {
    const product = products.find(item => item.id === id);
    if (!product) return;

    if (cart[id]) {
        cart[id].quantity += 1;
    } else {
        cart[id] = { ...product, quantity: 1 };
    }

    renderCart();
}

function removeFromCart(id) {
    delete cart[id];
    renderCart();
}

function checkout() {
    const cartItems = Object.values(cart);
    if (!cartItems.length) {
        alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
        return;
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    alert('Bạn đã đặt hàng thành công. Tổng: ' + formatCurrency(total));
    Object.keys(cart).forEach(key => delete cart[key]);
    renderCart();
}

function renderFeatured() {
    const featuredList = document.getElementById('featuredList');
    if (!featuredList) return;
    const featured = products.slice(0, 3);
    featuredList.innerHTML = featured.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price">${formatCurrency(product.price)}</div>
            <button type="button" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    renderProducts();
    renderCart();
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