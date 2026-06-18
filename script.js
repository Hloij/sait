// Активная ссылка в навигации
(function() {
    const currentLocation = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentLocation) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
})();

// Аккордеон для рецептов
document.addEventListener('DOMContentLoaded', function() {
    const grids = document.querySelectorAll('.recipe-grid');
    const icons = document.querySelectorAll('.category-title .toggle-icon i');

    // Открываем все категории при загрузке
    grids.forEach(grid => {
        grid.classList.add('open');
    });

    icons.forEach(icon => {
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    });

    // Обработчики кликов для переключения
    const categoryTitles = document.querySelectorAll('.category-title');
    categoryTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            const section = this.closest('.category-section');
            const grid = section.querySelector('.recipe-grid');
            const icon = this.querySelector('.toggle-icon i');
            if (grid) {
                grid.classList.toggle('open');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            }
        });
    });
});