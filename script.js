document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Navbar
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Copy IP Functionality
    const copyBtns = document.querySelectorAll('.copy-ip-btn');
    const toast = document.getElementById('toast');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const ip = btn.getAttribute('data-ip');
            
            navigator.clipboard.writeText(ip).then(() => {
                showToast(`Copied ${ip} to clipboard!`);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                showToast('Failed to copy IP. Try manually: ' + ip);
            });
        });
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 3. Mock Live Player Count
    const playerCountEl = document.getElementById('player-count');
    let currentPlayers = Math.floor(Math.random() * 20) + 10; // Start with 10-30 players
    
    // Animate the initial count up
    let startValue = 0;
    const duration = 2000; // 2 seconds
    const interval = 50; 
    const steps = duration / interval;
    const increment = currentPlayers / steps;
    
    const counterInterval = setInterval(() => {
        startValue += increment;
        if (startValue >= currentPlayers) {
            startValue = currentPlayers;
            clearInterval(counterInterval);
        }
        playerCountEl.textContent = Math.floor(startValue);
    }, interval);

    // Occasionally change player count
    setInterval(() => {
        // Randomly go up or down by 1-3 players, min 5, max 50
        const change = Math.floor(Math.random() * 7) - 3;
        currentPlayers += change;
        
        if (currentPlayers < 5) currentPlayers = 5;
        if (currentPlayers > 50) currentPlayers = 50;
        
        playerCountEl.textContent = currentPlayers;
        
        // Add a slight ping animation
        playerCountEl.style.transform = 'scale(1.1)';
        playerCountEl.style.color = 'var(--text-primary)';
        
        setTimeout(() => {
            playerCountEl.style.transform = 'scale(1)';
            playerCountEl.style.color = 'var(--azure-light)';
        }, 200);
        
    }, 5000);

    // 4. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // 5. Shopping Cart Functionality
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartSidebar && cartOverlay) {
        window.cart = [];
        
        window.toggleCart = function() {
            cartSidebar.classList.toggle('active');
            cartOverlay.classList.toggle('active');
        };

        window.addToCart = function(name, price) {
            window.cart.push({ id: Date.now(), name, price });
            updateCartUI();
            showToast(`${name} added to cart!`);
            
            // Pop animation on badge
            const badge = document.getElementById('cart-badge');
            if(badge) {
                badge.style.transform = 'scale(1.5)';
                setTimeout(() => badge.style.transform = 'scale(1)', 200);
            }
        };

        window.removeFromCart = function(id) {
            window.cart = window.cart.filter(item => item.id !== id);
            updateCartUI();
        };

        window.checkoutCart = function() {
            if (window.cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            alert('Redirecting to Tebex/CraftingStore checkout with your items...');
            window.cart = [];
            updateCartUI();
            toggleCart();
        };

        function updateCartUI() {
            const cartItemsEl = document.getElementById('cart-items');
            const cartTotalEl = document.getElementById('cart-total-price');
            const cartBadgeEl = document.getElementById('cart-badge');
            
            if(!cartItemsEl) return;

            let total = 0;
            cartItemsEl.innerHTML = '';
            
            if (window.cart.length === 0) {
                cartItemsEl.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            } else {
                window.cart.forEach(item => {
                    total += item.price;
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>$${item.price.toFixed(2)}</p>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">&times;</button>
                    `;
                    cartItemsEl.appendChild(itemEl);
                });
            }

            if(cartTotalEl) cartTotalEl.textContent = total.toFixed(2);
            if(cartBadgeEl) cartBadgeEl.textContent = window.cart.length;
            
            // hide badge if 0
            if(cartBadgeEl) cartBadgeEl.style.display = window.cart.length > 0 ? 'flex' : 'none';
        }
        
        // Render initial empty cart
        updateCartUI();
    }
});
