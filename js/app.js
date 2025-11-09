// SwiftRide Premium JavaScript
class SwiftRideApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupAnimations();
        this.setupEventListeners();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        console.log('🚗 SwiftRide Premium initialized');
    }

    setupNavbar() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupAnimations() {
        // Add hover animations to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-primary, .btn-secondary, .ride-option');
        interactiveElements.forEach(el => {
            el.classList.add('hover-lift');
        });
    }

    setupEventListeners() {
        // Download buttons
        const downloadButtons = document.querySelectorAll('.store-btn, .btn-hero-primary');
        downloadButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDownloadModal();
            });
        });

        // Demo button
        const demoBtn = document.querySelector('.btn-hero-secondary');
        if (demoBtn) {
            demoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.playDemoVideo();
            });
        }

        // Ride options
        const rideOptions = document.querySelectorAll('.ride-option');
        rideOptions.forEach(option => {
            option.addEventListener('click', () => {
                rideOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const rideType = option.querySelector('strong').textContent;
                this.showNotification(`Selected ${rideType} ride`, 'success');
            });
        });

        // Book ride button
        const bookBtn = document.querySelector('.book-ride-btn');
        if (bookBtn) {
            bookBtn.addEventListener('click', () => {
                this.bookRide();
            });
        }

        // App access buttons
        const appButtons = document.querySelectorAll('.btn-passenger, .btn-driver, .btn-admin');
        appButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const appType = button.classList.contains('btn-passenger') ? 'Passenger' : 
                               button.classList.contains('btn-driver') ? 'Driver' : 'Admin';
                this.showNotification(`🚀 Opening ${appType} App...`, 'success');
                // In real app, this would navigate to the respective dashboard
                setTimeout(() => {
                    if (appType === 'Passenger') {
                        window.location.href = 'passenger-dashboard.html';
                    } else if (appType === 'Driver') {
                        window.location.href = 'driver-login.html';
                    } else {
                        window.location.href = 'admin-login.html';
                    }
                }, 1000);
            });
        });
    }

    // Enhanced Mobile Menu Functionality
    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileMenuBtn) {
            // Create mobile menu if it doesn't exist
            if (!document.querySelector('.mobile-menu')) {
                this.createMobileMenu();
            }
            
            const mobileMenu = document.querySelector('.mobile-menu');
            
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.navbar') && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
            
            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
            <div class="mobile-nav-links">
                <a href="#features" class="mobile-nav-link">
                    <i class="fas fa-star"></i>
                    Features
                </a>
                <a href="#how-it-works" class="mobile-nav-link">
                    <i class="fas fa-play-circle"></i>
                    How It Works
                </a>
                <a href="#safety" class="mobile-nav-link">
                    <i class="fas fa-shield-alt"></i>
                    Safety
                </a>
                <a href="driver-login.html" class="mobile-nav-link">
                    <i class="fas fa-car"></i>
                    Drive With Us
                </a>
            </div>
            <div class="mobile-nav-actions">
                <a href="login.html" class="btn-secondary">Login</a>
                <a href="signup.html" class="btn-primary">Sign Up</a>
            </div>
        `;
        document.body.appendChild(mobileMenu);
        
        // Add click listeners to mobile menu links
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }
    
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const icon = mobileMenuBtn.querySelector('i');
        
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
            document.body.style.overflow = 'hidden';
        } else {
            icon.className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const icon = mobileMenuBtn.querySelector('i');
        
        mobileMenu.classList.remove('active');
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    showDownloadModal() {
        this.showNotification('📱 Download starting soon...', 'success');
    }

    playDemoVideo() {
        this.showNotification('🎬 Demo video would play here', 'info');
    }

    bookRide() {
        const activeRide = document.querySelector('.ride-option.active');
        const rideType = activeRide ? activeRide.querySelector('strong').textContent : 'Swift';
        
        this.showNotification(`🚗 Booking ${rideType} ride...`, 'success');
        
        setTimeout(() => {
            this.showNotification(`✅ ${rideType} ride booked! Driver arriving in 2 minutes.`, 'success');
        }, 1500);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} bounce-in`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                ${message}
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#00C851' : type === 'error' ? '#FF4444' : '#0066FF'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            max-width: 300px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: fadeInUp 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeInUp 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SwiftRideApp();
});

// Make app globally accessible
window.swiftRideApp = new SwiftRideApp();
