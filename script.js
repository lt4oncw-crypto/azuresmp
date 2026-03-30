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
            playerCountEl.style.color = 'var(--nexum-light)';
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

        const checkoutModal = document.getElementById('checkout-modal');
        const checkoutOverlay = document.getElementById('checkout-overlay');
        const successModal = document.getElementById('success-modal');

        // Stripe Initialization (Mock Public Key)
        let stripe, elements;
        try {
            stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
        } catch (e) {
            console.error("Stripe failed to load. Make sure you are online.");
        }

        window.checkoutCart = async function() {
            if (window.cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }
            
            // Build the checkout items list
            const checkoutItemsEl = document.getElementById('checkout-items');
            const checkoutTotalEl = document.getElementById('checkout-total-price');
            let total = 0;
            if(checkoutItemsEl && checkoutTotalEl) {
                checkoutItemsEl.innerHTML = '';
                window.cart.forEach(item => {
                    total += item.price;
                    checkoutItemsEl.innerHTML += `
                        <div class="checkout-item">
                            <span>${item.name}</span>
                            <span>$${item.price.toFixed(2)}</span>
                        </div>
                    `;
                });
                checkoutTotalEl.textContent = total.toFixed(2);
            }

            // Initialize Stripe Elements
            if (stripe) {
                // In a real app, you'd fetch a clientSecret from your server here
                // For this demonstration, we'll simulate the appearance
                const appearance = { theme: 'night', variables: { colorPrimary: '#38bdf8' } };
                
                // Note: Payment Element usually requires a clientSecret.
                // We'll use a dummy setup or explain the requirement.
                const options = {
                    mode: 'payment',
                    amount: Math.round(total * 100),
                    currency: 'usd',
                    appearance,
                };

                elements = stripe.elements(options);
                const paymentElement = elements.create('payment');
                paymentElement.mount('#payment-element');
            }

            // Close cart, open checkout
            toggleCart();
            if (checkoutModal && checkoutOverlay) {
                checkoutModal.classList.add('active');
                checkoutOverlay.classList.add('active');
            }
        };

        window.closeCheckout = function() {
            if (checkoutModal && checkoutOverlay) {
                checkoutModal.classList.remove('active');
                checkoutOverlay.classList.remove('active');
            }
        };

        window.selectPayment = function(btn) {
            document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };

        let avatarTimeout;
        window.updateAvatar = function() {
            clearTimeout(avatarTimeout);
            avatarTimeout = setTimeout(() => {
                const username = document.getElementById('mc-username').value.trim();
                const avatarImg = document.getElementById('mc-avatar');
                if (username.length > 2) {
                    avatarImg.src = `https://minotar.net/helm/${username}/32.png`;
                } else {
                    avatarImg.src = `https://minotar.net/helm/MHF_Steve/32.png`; // default Steve
                }
            }, 500);
        };

        window.confirmPurchase = async function() {
            const username = document.getElementById('mc-username');
            if (!username || username.value.trim() === '') {
                showToast('Please enter your Minecraft username!');
                if (username) username.focus();
                return;
            }
            
            // Show loading state
            const btn = document.querySelector('.checkout-footer .btn-primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="loader"></span> Processing...';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';

            // If Stripe is active, trigger confirmation
            if (stripe && elements) {
                // In a real implementation:
                // const {error} = await stripe.confirmPayment({
                //   elements,
                //   confirmParams: { return_url: window.location.href + "?success=true" },
                // });
                
                // For demo purposes, we'll simulate the Stripe response
                setTimeout(() => {
                    handleSuccess();
                }, 2000);
            } else {
                // Fallback for mock flow
                setTimeout(() => {
                    handleSuccess();
                }, 1000);
            }

            function handleSuccess() {
                closeCheckout();
                window.cart = [];
                updateCartUI();
                
                if (successModal && checkoutOverlay) {
                    checkoutOverlay.classList.add('active');
                    successModal.classList.add('active');
                }
                
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        };

        window.closeSuccess = function() {
            if (successModal && checkoutOverlay) {
                successModal.classList.remove('active');
                checkoutOverlay.classList.remove('active');
            }
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
        
        // Check for redirect success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            setTimeout(() => {
                if (successModal && checkoutOverlay) {
                    checkoutOverlay.classList.add('active');
                    successModal.classList.add('active');
                }
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 500);
        }
    }
});
