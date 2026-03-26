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
});
