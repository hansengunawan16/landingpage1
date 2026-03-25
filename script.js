document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Transparent to Solid Navbar Transition on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-white/90', 'backdrop-blur-md', 'border-b', 'border-gray-100', 'text-black');
            navbar.classList.remove('bg-transparent', 'text-white');
        } else {
            navbar.classList.remove('bg-white/90', 'backdrop-blur-md', 'border-b', 'border-gray-100', 'text-black');
            navbar.classList.add('bg-transparent', 'text-white');
        }
    });

    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
});
