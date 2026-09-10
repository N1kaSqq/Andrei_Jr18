/* ============================================================
   Лендинг Андрея Снегурова

   Три независимых модуля. Каждый начинается с проверки, что его узлы
   есть в DOM, и молча выходит, если их нет, — падение одного не должно
   ломать остальные. Порядок модулей совпадает с порядком секций.
   ============================================================ */

/* Помечаем страницу как «JS живой». На этом классе висят состояния,
   которые без JS показывать нельзя, — например, скрытые до появления блоки. */
document.documentElement.classList.add('js-enabled');

/* ============================================================
   Подсветка активного пункта меню
   ============================================================ */
(function activeNav() {
    const links = [...document.querySelectorAll('.nav__link')];
    if (links.length === 0) return;

    const linkBySection = new Map();

    links.forEach((link) => {
        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const section = document.querySelector(hash);
        if (section) linkBySection.set(section, link);
    });

    if (linkBySection.size === 0) return;

    function activate(link) {
        links.forEach((item) => {
            const isActive = item === link;
            item.classList.toggle('is-active', isActive);
            if (isActive) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        // Активной считаем самую верхнюю из секций, попавших в кадр.
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) activate(linkBySection.get(visible[0].target));
    }, { rootMargin: '-42px 0px -66% 0px' });

    linkBySection.forEach((_link, section) => observer.observe(section));
}());

/* ============================================================
   Карусель отзывов

   Листание построено на нативном горизонтальном скролле со scroll-snap:
   свайп пальцем и трекпадом работает сам, без JS. Здесь добавляются
   только индикаторы, стрелки и клавиатура — плюс синхронизация
   индикаторов с фактической позицией скролла.
   ============================================================ */
(function reviewsCarousel() {
    const root = document.querySelector('[data-carousel]');
    if (!root) return;

    const viewport = root.querySelector('.reviews__viewport');
    const track = root.querySelector('.reviews__track');
    const slides = [...root.querySelectorAll('.review-slide')];
    const dots = [...root.querySelectorAll('.reviews__dot')];
    const prev = root.querySelector('.reviews__arrow--prev');
    const next = root.querySelector('.reviews__arrow--next');
    if (!track || slides.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;

    // Отзывы разной длины: без подгонки высоты под коротким слайдом
    // остаётся пустота высотой с самый длинный.
    function syncHeight() {
        if (!viewport) return;
        viewport.style.height = slides[current].scrollHeight + 'px';
    }

    function goTo(index) {
        // Зацикливаем: с последнего «вперёд» ведёт на первый.
        const target = (index + slides.length) % slides.length;
        track.scrollTo({
            left: track.clientWidth * target,
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
        });
    }

    function setActive(index) {
        if (index === current) return;
        current = index;
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            if (i === index) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        syncHeight();
    }

    // Индикаторы следуют за фактической позицией скролла — неважно,
    // прокрутил её пользователь пальцем или это сделал goTo().
    let ticking = false;
    track.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const width = track.clientWidth;
            if (width > 0) setActive(Math.round(track.scrollLeft / width));
        });
    }, { passive: true });

    dots.forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(current - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(current + 1);
        }
    });

    // Высота слайда зависит от ширины (текст переносится иначе),
    // поэтому пересчитываем при любом изменении размеров.
    if (typeof ResizeObserver === 'function') {
        new ResizeObserver(syncHeight).observe(track);
    } else {
        window.addEventListener('resize', syncHeight);
    }

    // Шрифты подгружаются асинхронно и меняют высоту текста.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeight);
    syncHeight();
}());

/* ============================================================
   Появление блоков при скролле
   ============================================================ */
(function reveal() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (items.length === 0) return;

    // Пользователь просил меньше движения — показываем всё сразу.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15 });

    items.forEach((item) => observer.observe(item));
}());
