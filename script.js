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
    const navHeight = document.querySelector('.nav')?.offsetHeight || 42;
    const targets = [];

    document.querySelectorAll('.nav__link').forEach((link) => {
        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const section = document.querySelector(hash);
        if (section) targets.push({ link, section });
    });

    if (targets.length === 0) return;

    function activate(link) {
        targets.forEach(({ link: item }) => {
            const isActive = item === link;
            item.classList.toggle('is-active', isActive);
            if (isActive) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
        });
    }

    function update() {
        // Последнюю секцию часто невозможно доскроллить до верха экрана —
        // под ней просто нет контента. Поэтому у самого низа страницы
        // активным всегда считаем последний пункт, иначе подсветка
        // застревает на предыдущем.
        const atBottom = window.scrollY + window.innerHeight
            >= document.documentElement.scrollHeight - 2;
        if (atBottom) {
            activate(targets[targets.length - 1].link);
            return;
        }

        // Иначе активна последняя секция, начало которой уже прошло
        // под нижним краем меню.
        const line = window.scrollY + navHeight + 1;
        let active = targets[0].link;
        targets.forEach(({ link, section }) => {
            if (section.getBoundingClientRect().top + window.scrollY <= line) active = link;
        });
        activate(active);
    }

    let ticking = false;
    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
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
    const status = root.querySelector('[data-carousel-status]');
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
        // Обновляем состояние сразу, не дожидаясь события scroll: плавная
        // прокрутка длится ~300ms, и без этого второе быстрое нажатие
        // стрелки считало бы следующий индекс от устаревшего current.
        setActive(target);
        track.scrollTo({
            left: track.clientWidth * target,
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
        });
    }

    function setActive(index) {
        // Резиновый отскок в iOS Safari на мгновение даёт scrollLeft за
        // пределами трека, а из него — индекс -1 или 3. Без ограничения
        // это уронило бы syncHeight() на slides[-1].scrollHeight.
        const clamped = Math.max(0, Math.min(slides.length - 1, index));
        if (clamped === current) return;
        current = clamped;
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === current);
            if (i === current) dot.setAttribute('aria-current', 'true');
            else dot.removeAttribute('aria-current');
        });
        // Скринридеру смена слайда иначе никак не слышна: скролл трека
        // не меняет текст, а фокус остаётся на кнопке.
        if (status) status.textContent = `Отзыв ${current + 1} из ${slides.length}`;
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
