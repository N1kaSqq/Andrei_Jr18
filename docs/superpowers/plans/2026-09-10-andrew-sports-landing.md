# Лендинг Андрея Снегурова — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать одностраничный лендинг персонального фитнес-тренера по макету Figma — статика без сборки, с рабочей каруселью отзывов и всеми CTA в Telegram.

**Architecture:** Три файла — `index.html` (разметка восьми секций), `styles.css` (токены → базовые стили → компоненты → секции → брейкпоинты), `script.js` (три независимых IIFE-модуля: активный пункт меню, карусель, появление секций). Mobile-first: базовые стили воспроизводят макет 390px один в один, десктоп надстраивается двумя медиа-запросами.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flex, scroll-snap), vanilla JS (IntersectionObserver, Pointer/scroll events). Ноль зависимостей, ноль сборки. Google Fonts: Exo 2 + Montserrat Alternates. Локальный просмотр — `.claude/dev-server.js` на порту 5173.

**Спека:** `docs/superpowers/specs/2026-09-10-andrew-sports-landing-design.md`. Длинные русские тексты берутся оттуда дословно — в плане они не дублируются, вместо этого указан § спеки. Числовые значения, имена классов и весь JS приведены в плане полностью.

## Про проверку вместо тестов

Тестового раннера в проекте нет и не будет — это статическая страница. Роль «падающего теста» в каждой задаче играет проверка в браузере через MCP-инструменты Claude Browser:

```
mcp__Claude_Browser__preview_start   {name: "andrew-sports"}          # один раз
mcp__Claude_Browser__resize_window   {width: 390, height: 844, tabId} # нужная ширина
mcp__Claude_Browser__navigate        {url: "http://localhost:5173/", tabId}
mcp__Claude_Browser__computer        {action: "screenshot", tabId}
mcp__Claude_Browser__read_console_messages {onlyErrors: true, tabId}
```

Эталон для сверки — слайсы макета:
`C:/Users/user/AppData/Local/Temp/claude/C--nikita-work-website-andrew-sports/bd30812f-6ef0-4238-a365-6795f3d0d7e2/scratchpad/figma/slice_00.png` … `slice_07.png`
(порядок сверху вниз: 00 меню+hero · 01 слоган/CTA+ОБО МНЕ · 02 фото+цитата+подход 01 · 03 подход 02–04+CTA · 04 УСЛУГИ карточка 1 · 05 карточки 2–3 · 06 ОТЗЫВЫ · 07 точки+КОНТАКТЫ).

Проверка «горизонтального скролла нет» — в консоли страницы:

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

## Global Constraints

- Никаких зависимостей, сборщиков, препроцессоров и CSS-фреймворков.
- Только три файла с кодом: `index.html`, `styles.css`, `script.js`. Внутри каждого — комментарии-разделители по секциям, порядок блоков совпадает с порядком секций в HTML.
- Все цвета, радиусы, отступы контейнера и шрифты — только через CSS-переменные из `:root`. Хардкод `#008CFF` или `#111` вне `:root` запрещён.
- Русские тексты — дословно из спеки, §4. Единственная правка: `ЗАПИСАТЬСЯ НА ТРЕНИРОВКУ` (в макете опечатка «ТРЕНЕРОВКУ»), §4.9.
- Все внешние ссылки — заглушки `https://t.me/CHANGE_ME`, `https://vk.com/CHANGE_ME`, `https://instagram.com/CHANGE_ME`, всегда `target="_blank" rel="noopener noreferrer"`.
- Каждая задача заканчивается коммитом. Сообщения коммитов на русском, с `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- После каждой задачи: ноль ошибок в консоли, ноль горизонтального скролла.

## Карта файлов

| Файл | Ответственность |
|---|---|
| `index.html` | Разметка: `<head>` с мета и шрифтами, `<header>` с меню, `<main>` с шестью секциями, `<footer>`. Никаких инлайновых стилей, кроме `style="--glow-x/--glow-y"` у свечений. |
| `styles.css` | Порядок блоков: `@font-face`-нет → `:root` токены → reset/base → утилиты (`.container`, `.section`, `.section-title`, `.glow`, `[data-reveal]`) → компоненты (`.btn*`) → секции в порядке страницы → `@media (min-width: 768px)` → `@media (min-width: 1024px)` → `@media (prefers-reduced-motion: reduce)`. |
| `script.js` | Три IIFE: `activeNav`, `reviewsCarousel`, `reveal`. Каждый начинается с проверки наличия своих узлов и молча выходит, если их нет. Первая строка файла — `document.documentElement.classList.add('js-enabled')`. |
| `assets/*` | Уже на месте: `hero-andrew.png`, `about-andrew.png`, `review-1..3.png`, `hero-lines.svg`, `arrow-right.svg`. |
| `favicon.svg` | Уже на месте. |
| `README.md`, `TODO.md` | Создаются в задаче 12. |

## Соглашения об именах (интерфейс между задачами)

Эти имена используются в нескольких задачах — менять их нельзя.

**ID секций:** `hero`, `about`, `approach`, `services`, `reviews`, `contacts`.

**Утилиты:** `.container`, `.section`, `.section-title`, `.glow`, `[data-reveal]` / `.is-visible`.

**Кнопки:** `.btn` (база) · `.btn--wide` (337×44, во всю колонку, со стрелкой) · `.btn--tab` (116×44, «хвостик» карточки) · `.btn--social` (218×44, контакты).

**Меню:** `.nav`, `.nav__list`, `.nav__link`, класс активного — `.is-active`.

**Карусель:** `.reviews__viewport` (обёртка с `role="region"`), `.reviews__track`, `.review-slide`, `.reviews__dots`, `.reviews__dot`, `.reviews__arrow` + `.reviews__arrow--prev` / `--next`. Атрибут для JS — `data-carousel`.

---

## Task 1: Скелет, токены и дизайн-система

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`

**Interfaces:**
- Consumes: ассеты в `assets/`, `favicon.svg`.
- Produces: CSS-переменные `--bg --accent --text --overlay-photo --font-display --font-body --radius-sm --radius-md --hairline --container --gutter --nav-h`; классы `.container`, `.section`, `.section-title`, `.glow`, `.btn`; класс `js-enabled` на `<html>`.

- [ ] **Шаг 1: Создать `index.html` — только `<head>` и пустой каркас**

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Андрей Снегуров — персональный фитнес-тренер. Индивидуальные программы тренировок, коррекционный тренинг, онлайн-сопровождение.">

    <meta property="og:title" content="Андрей Снегуров — персональный фитнес-тренер">
    <meta property="og:description" content="Индивидуальные программы тренировок, коррекционный тренинг и онлайн-сопровождение.">
    <meta property="og:type" content="website">
    <meta property="og:image" content="assets/hero-andrew.png">

    <title>Андрей Снегуров — персональный фитнес-тренер</title>

    <link rel="icon" href="favicon.svg" type="image/svg+xml">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@200;300;400&family=Montserrat+Alternates:wght@400;500&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Навигация — задача 2 -->
    <!-- Hero — задача 2 -->
    <main>
        <!-- Секции — задачи 3-9 -->
    </main>
    <script src="script.js" defer></script>
</body>
</html>
```

- [ ] **Шаг 2: Создать `styles.css` — токены, reset и утилиты**

```css
/* ============================================================
   Токены
   ============================================================ */
:root {
    --bg: #111111;
    --accent: #008CFF;
    --text: #FFFFFF;
    --overlay-photo: linear-gradient(61.36deg,
        rgba(17, 17, 17, 0) 19.7%,
        rgba(17, 17, 17, .16) 69.5%,
        #10181E 91%);

    --font-display: 'Exo 2', 'Segoe UI', sans-serif;
    --font-body: 'Montserrat Alternates', 'Segoe UI', sans-serif;

    --radius-sm: 8px;
    --radius-md: 16px;
    --hairline: 0.8px solid var(--accent);

    --container: 390px;
    --gutter: 27px;
    --nav-h: 42px;
}

/* ============================================================
   Reset и база
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; }

html {
    scroll-behavior: smooth;
    scroll-padding-top: var(--nav-h);
    /* Полосы прокрутки по горизонтали быть не должно ни при каких
       декоративных выносах за край экрана. */
    overflow-x: hidden;
}

body {
    margin: 0;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 13px;
    line-height: 1.35;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
}

img { max-width: 100%; display: block; }

a { color: inherit; }

:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

/* ============================================================
   Утилиты
   ============================================================ */
.container {
    width: 100%;
    max-width: var(--container);
    margin-inline: auto;
    padding-inline: var(--gutter);
}

.section {
    position: relative;
    z-index: 1;
}

.section-title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 200;
    font-size: 32px;
    line-height: 1.18;
    color: var(--accent);
    text-align: center;
    text-transform: uppercase;
}

/* Размытые синие пятна фона. Позиция задаётся инлайном через
   --glow-x / --glow-y, размер — через --glow-size. */
.glow {
    position: absolute;
    z-index: 0;
    width: var(--glow-size, 154px);
    aspect-ratio: 1;
    left: var(--glow-x, 0);
    top: var(--glow-y, 0);
    border-radius: 50%;
    background: var(--accent);
    filter: blur(129.6px);
    pointer-events: none;
}

/* ============================================================
   Кнопки
   ============================================================ */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding-inline: 20px;
    border: 0;
    background: var(--accent);
    color: var(--text);
    font-family: var(--font-display);
    font-weight: 400;
    font-size: 16px;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color .2s ease, transform .2s ease;
}

.btn:hover { background: #2ea0ff; }
.btn:active { transform: translateY(1px); }
.btn:focus-visible { outline-color: var(--text); }

.btn--wide {
    position: relative;
    display: flex;
    width: 100%;
    border-radius: var(--radius-sm);
    padding-inline: 20px 52px;
}

.btn--wide .btn__arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    translate: 0 -50%;
    width: 24px;
    height: 24px;
}
```

- [ ] **Шаг 3: Создать `script.js` с одной строкой**

```js
/* Помечаем страницу как «JS живой» — на этом классе висят состояния,
   которые без JS показывать нельзя (например, скрытые до появления секции). */
document.documentElement.classList.add('js-enabled');
```

- [ ] **Шаг 4: Запустить сервер и убедиться, что страница открывается**

Запустить `preview_start {name: "andrew-sports"}`, затем `navigate` на `http://localhost:5173/`.
Ожидается: тёмная (`#111`) пустая страница, во вкладке — заголовок «Андрей Снегуров — персональный фитнес-тренер» и синяя иконка.

- [ ] **Шаг 5: Проверить, что шрифты реально загрузились**

В консоли страницы (`javascript_tool`):

```js
await document.fonts.ready;
[document.fonts.check('16px "Exo 2"'), document.fonts.check('13px "Montserrat Alternates"')]
```

Ожидается: `[true, true]`. Если `false` — проверить URL Google Fonts в `<head>`.

- [ ] **Шаг 6: Коммит**

```bash
git add index.html styles.css script.js
git commit -m "Каркас страницы, дизайн-токены и базовые компоненты"
```

---

## Task 2: Навигация и hero

**Files:**
- Modify: `index.html` (заменить комментарии-заглушки навигации и hero)
- Modify: `styles.css` (добавить блоки `.nav` и `.hero`)

**Interfaces:**
- Consumes: `.container`, `.glow`, токены из задачи 1.
- Produces: `#hero`; `.nav`, `.nav__list`, `.nav__link` (задача 10 вешает на них `.is-active`); `.hero__media`.

- [ ] **Шаг 1: Разметка навигации и hero**

Заменить два комментария-заглушки в `<body>` на:

```html
    <header class="nav">
        <nav aria-label="Основная навигация">
            <ul class="nav__list">
                <li><a class="nav__link" href="#hero">главная</a></li>
                <li><a class="nav__link" href="#services">услуги</a></li>
                <li><a class="nav__link" href="#reviews">отзывы</a></li>
                <li><a class="nav__link" href="#contacts">контакты</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section class="section hero" id="hero" aria-labelledby="hero-title">
            <div class="glow" style="--glow-x: 256px; --glow-y: -7px; --glow-size: 161px" aria-hidden="true"></div>

            <div class="hero__media">
                <img class="hero__photo hero__photo--blur" src="assets/hero-andrew.png" alt="" aria-hidden="true">
                <img class="hero__photo" src="assets/hero-andrew.png"
                     alt="Андрей Снегуров, персональный фитнес-тренер" width="862" height="1288">
                <img class="hero__lines" src="assets/hero-lines.svg" alt="" aria-hidden="true">

                <div class="hero__caption">
                    <h1 class="hero__title" id="hero-title">Андрей<br>Снегуров</h1>
                    <p class="hero__role">персональный<br>фитнес-тренер</p>
                </div>
            </div>

            <div class="hero__rule" aria-hidden="true"></div>
        </section>
```

Тег `</main>` пока оставить сразу после — секции добавляются следующими задачами.

- [ ] **Шаг 2: Стили навигации**

```css
/* ============================================================
   Навигация
   ============================================================ */
.nav {
    position: fixed;
    inset: 0 0 auto;
    z-index: 20;
    height: var(--nav-h);
    background: var(--accent);
}

.nav__list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    max-width: var(--container);
    margin-inline: auto;
    padding: 0 var(--gutter);
    list-style: none;
}

.nav__link {
    display: block;
    padding: 6px 2px;
    font-size: 13px;
    text-decoration: none;
    opacity: .85;
    transition: opacity .2s ease, text-shadow .2s ease;
}

.nav__link:hover { opacity: 1; }

.nav__link.is-active {
    opacity: 1;
    font-weight: 500;
    text-shadow: 0 0 12px rgba(255, 255, 255, .5);
}
```

- [ ] **Шаг 3: Стили hero**

Пропорция кадра — 390 : 404, как в макете. Резкое фото сдвинуто на −13px / +10px внутри рамки, размытая копия — на 0 / +16px, обе шириной 431px при базовой ширине 390. В относительных единицах это `left: -3.33%` (13/390) и `width: 110.5%` (431/390).

```css
/* ============================================================
   Hero
   ============================================================ */
.hero { padding-top: 8px; }

.hero__media {
    position: relative;
    aspect-ratio: 390 / 404;
    overflow: hidden;
}

.hero__photo {
    position: absolute;
    top: 0;
    left: -3.33%;
    width: 110.5%;
    height: 159%;         /* 644 / 404 */
    max-width: none;
    object-fit: cover;
    object-position: top center;
}

.hero__photo--blur {
    left: 0;
    top: 1.5%;
    opacity: .41;
    filter: blur(6.45px);
}

.hero__lines {
    position: absolute;
    left: -7.5%;
    top: 14.4%;
    width: 99.4%;
    max-width: none;
    pointer-events: none;
}

.hero__caption {
    position: absolute;
    right: var(--gutter);
    top: 74px;
    z-index: 2;
    text-align: right;
}

.hero__title {
    margin: 0;
    font-family: var(--font-display);
    font-weight: 200;
    font-size: 32px;
    line-height: 1.18;
    color: var(--accent);
    text-transform: uppercase;
}

.hero__role {
    margin: 8px 0 0;
    font-size: 13px;
    line-height: 1.25;
}

.hero__rule {
    height: 8px;
    background: var(--accent);
}
```

- [ ] **Шаг 4: Сверить с макетом на 390px**

`resize_window {width: 390, height: 844}` → `navigate` → `screenshot`.
Рядом открыть `slice_00.png`.

Сверять поштучно: синяя полоса меню сверху с четырьмя пунктами строчными · портрет занимает весь первый экран · «АНДРЕЙ / СНЕГУРОВ» синим по правому краю, под ним белым «персональный / фитнес-тренер» · синяя ломаная линия видна поверх фото слева и справа · под фото сплошная синяя полоса.

- [ ] **Шаг 5: Проверить отсутствие горизонтального скролла**

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Ожидается: `true`. Если `false` — виновата `.hero__lines` или `.hero__photo`, они шире контейнера; проверить, что `.hero__media` имеет `overflow: hidden`.

- [ ] **Шаг 6: Коммит**

```bash
git add index.html styles.css
git commit -m "Фиксированное меню и hero-секция"
```

---

## Task 3: Слоган и первый CTA

**Files:**
- Modify: `index.html` (добавить блок после `</section>` hero)
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.btn`, `.btn--wide`, `.glow`.
- Produces: `.intro`.

- [ ] **Шаг 1: Разметка**

Вставить сразу после закрывающего тега hero-секции:

```html
        <section class="section intro" aria-label="Кратко о подходе">
            <div class="glow" style="--glow-x: -33px; --glow-y: 96px; --glow-size: 161px" aria-hidden="true"></div>
            <div class="container">
                <p class="intro__text" data-reveal>
                    Моя задача - разбудить вашего внутреннего чемпиона и помочь достичь ваших целей,
                    сохраняя здоровье и правильную работу вашего организма
                </p>
                <a class="btn btn--wide" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer" data-reveal>
                    Записаться на тренировку
                    <img class="btn__arrow" src="assets/arrow-right.svg" alt="" aria-hidden="true" width="24" height="24">
                </a>
            </div>
        </section>
```

- [ ] **Шаг 2: Стили**

```css
/* ============================================================
   Слоган и первый CTA
   ============================================================ */
.intro { padding: 35px 0 0; }

.intro__text {
    max-width: 350px;
    margin: 0 auto 32px;
    text-align: center;
    line-height: 1.42;
}
```

- [ ] **Шаг 3: Сверить со `slice_01.png` на 390px**

Проверить: текст в три строки по центру · синяя кнопка во всю ширину колонки со стрелкой у правого края · вертикальный ритм совпадает.

- [ ] **Шаг 4: Проверить, что ссылка настоящая**

```js
const a = document.querySelector('.intro .btn');
[a.tagName, a.getAttribute('href'), a.target, a.rel]
```

Ожидается: `["A", "https://t.me/CHANGE_ME", "_blank", "noopener noreferrer"]`.

- [ ] **Шаг 5: Коммит**

```bash
git add index.html styles.css
git commit -m "Блок со слоганом и кнопкой записи"
```

---

## Task 4: Обо мне

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.container`, `.section-title`.
- Produces: `#about`, `.about__figure` (используется в задаче 11 для десктопной раскладки).

- [ ] **Шаг 1: Разметка**

Текст абзацев — дословно из спеки §4.4. Три фрагмента оборачиваются в `<span class="accent">`.

```html
        <section class="section about" id="about" aria-labelledby="about-title">
            <div class="container">
                <h2 class="section-title" id="about-title" data-reveal>Обо мне</h2>

                <div class="about__text" data-reveal>
                    <p>Я - Андрей, персональный фитнес-тренер со стажем более 3 лет. Помогаю достигать
                    целей в тренировках, <span class="accent">учитывая индивидуальные особенности,
                    запросы и уровень подготовки.</span></p>

                    <p>В моей работе главное - <span class="accent">грамотный подход, комфорт и
                    постепенный прогресс.</span> Я разрабатываю индивидуальные программы тренировок,
                    подбираю подходящие упражнения и помогаю выстроить эффективный путь к результату.
                    <span class="accent">Каждая программа адаптируется под вас,</span> чтобы тренировки
                    были не только эффективными, но и комфортными.</p>
                </div>
            </div>

            <figure class="about__figure" data-reveal>
                <div class="about__photo">
                    <img src="assets/about-andrew.png" alt="Андрей на тренировке" width="478" height="574" loading="lazy">
                    <svg class="about__bracket" viewBox="0 0 239.8 214.8" fill="none" aria-hidden="true" preserveAspectRatio="none">
                        <path d="M239.4 0.4V198.4C239.4 207.237 232.237 214.4 223.4 214.4H0.4"
                              stroke="#008CFF" stroke-width="0.8" stroke-linecap="round"/>
                    </svg>
                </div>
                <figcaption class="about__quote">
                    Моя цель - сделать так, чтобы вы не просто достигали желаемого результата,
                    но и чувствовали себя уверенно и комфортно на пути к нему
                </figcaption>
            </figure>
        </section>
```

- [ ] **Шаг 2: Стили**

Фото прижато к левому краю экрана без отступа — как в макете (`x: 0`). Цитата лежит справа сверху и заходит на фото.

```css
/* ============================================================
   Обо мне
   ============================================================ */
.about { padding-top: 35px; }

.accent { color: var(--accent); }

.about__text { margin-top: 26px; }
.about__text p { margin: 0 0 16px; line-height: 1.42; }
.about__text p:last-child { margin-bottom: 0; }

.about__figure {
    position: relative;
    margin: 20px 0 0;
    padding-bottom: 8px;
}

.about__photo {
    position: relative;
    width: 61.3%;              /* 239 / 390 */
    aspect-ratio: 239 / 287;
    border-radius: var(--radius-md);
    overflow: hidden;
}

.about__photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Затемняющий градиент поверх фото. */
.about__photo::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--overlay-photo);
    pointer-events: none;
}

/* Угловая скобка по правому и нижнему краю фото. */
.about__bracket {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 74.6%;             /* 214 / 287 */
    overflow: visible;
    z-index: 1;
}

.about__quote {
    position: absolute;
    right: var(--gutter);
    top: -8px;
    width: 69%;
    font-family: var(--font-display);
    font-weight: 300;
    font-size: 10px;
    line-height: 1.55;
    text-align: right;
    text-transform: uppercase;
}

/* Синие скобки вокруг цитаты. */
.about__quote::before,
.about__quote::after {
    position: absolute;
    color: var(--accent);
    font-size: 14px;
    line-height: 1;
}

.about__quote::before { content: '['; left: 5px; top: -4px; }
.about__quote::after  { content: ']'; right: -8px; bottom: -4px; }
```

- [ ] **Шаг 3: Сверить со `slice_01.png` и `slice_02.png`**

Проверить: заголовок «ОБО МНЕ» синим по центру · три фрагмента текста подсвечены синим · фото прижато к левому краю экрана · тонкая синяя линия обводит правый и нижний край фото со скруглением в углу · цитата капсом справа сверху в квадратных скобках.

- [ ] **Шаг 4: Проверить горизонтальный скролл**

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

- [ ] **Шаг 5: Коммит**

```bash
git add index.html styles.css
git commit -m "Секция «Обо мне» с фото и цитатой"
```

---

## Task 5: Мой подход

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.container`, `.section-title`, `.btn--wide`.
- Produces: `#approach`, `.approach__item`, `.approach__num` (в задаче 11 меняется поведение выноса номера).

- [ ] **Шаг 1: Разметка**

Все четыре пункта — тексты дословно из спеки §4.5.

```html
        <section class="section approach" id="approach" aria-labelledby="approach-title">
            <div class="glow" style="--glow-x: -53px; --glow-y: 147px; --glow-size: 154px" aria-hidden="true"></div>
            <div class="container">
                <h2 class="section-title" id="approach-title" data-reveal>Мой подход</h2>

                <ol class="approach__list">
                    <li class="approach__item" data-reveal>
                        <span class="approach__num" aria-hidden="true">01</span>
                        <div class="approach__body">
                            <h3 class="approach__name">Индивидуальная программа</h3>
                            <p class="approach__desc">Учитываю ваши цели, уровень подготовки и особенности,
                            чтобы подобрать оптимальную нагрузку</p>
                        </div>
                    </li>
                    <li class="approach__item" data-reveal>
                        <span class="approach__num" aria-hidden="true">02</span>
                        <div class="approach__body">
                            <h3 class="approach__name">Коррекционный тренинг</h3>
                            <p class="approach__desc">Работаю с дисбалансами тела, устранением боли в спине,
                            улучшением осанки и возвращением суставам нормальную подвижность</p>
                        </div>
                    </li>
                    <li class="approach__item" data-reveal>
                        <span class="approach__num" aria-hidden="true">03</span>
                        <div class="approach__body">
                            <h3 class="approach__name">Комфортные тренировки</h3>
                            <p class="approach__desc">Подбираю упражнения, которые подходят именно вам
                            и помогают чувствовать себя уверенно на тренировках</p>
                        </div>
                    </li>
                    <li class="approach__item" data-reveal>
                        <span class="approach__num" aria-hidden="true">04</span>
                        <div class="approach__body">
                            <h3 class="approach__name">Фокус на результат</h3>
                            <p class="approach__desc">Отслеживаем прогресс и корректируем программу,
                            чтобы тренировки действительно приносили результат</p>
                        </div>
                    </li>
                </ol>

                <a class="btn btn--wide" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer" data-reveal>
                    Сделать первый шаг
                    <img class="btn__arrow" src="assets/arrow-right.svg" alt="" aria-hidden="true" width="24" height="24">
                </a>
            </div>
        </section>
```

Номер продублирован как текст и помечен `aria-hidden`: для зрячего это крупный декоративный элемент, а скринридер и так объявит пункт списка по номеру.

- [ ] **Шаг 2: Стили**

Номер выходит за левый край экрана — в макете «01» обрезается границей фрейма. Даёт это отрицательный `margin-left`, а от появления горизонтального скролла страхует `overflow-x: hidden` на `body` из задачи 1.

```css
/* ============================================================
   Мой подход
   ============================================================ */
.approach { padding-top: 42px; }

.approach__list {
    margin: 32px 0 0;
    padding: 0;
    list-style: none;
}

.approach__item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    column-gap: 16px;
    margin-bottom: 34px;
}

.approach__num {
    margin-left: -75px;        /* вынос за край экрана, как в макете */
    font-family: var(--font-display);
    font-weight: 200;
    font-size: 64px;
    line-height: .95;
    color: var(--accent);
    letter-spacing: -.02em;
}

.approach__name {
    margin: 6px 0 4px;
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 15px;
    line-height: 1.3;
    color: var(--accent);
}

.approach__desc { margin: 0; line-height: 1.42; }
```

- [ ] **Шаг 3: Сверить со `slice_02.png` и `slice_03.png`**

Ключевая деталь: цифры действительно обрезаны левым краем экрана — у «01» видна только правая часть нуля и единица. Если цифры видны целиком, `margin-left` мал; если исчезли — велик.

- [ ] **Шаг 4: Проверить горизонтальный скролл**

```js
document.documentElement.scrollWidth <= document.documentElement.clientWidth
```

Ожидается `true` — вынос номера не должен создавать прокрутку.

- [ ] **Шаг 5: Коммит**

```bash
git add index.html styles.css
git commit -m "Секция «Мой подход» с выносными номерами"
```

---

## Task 6: Услуги

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.container`, `.section-title`, `.btn`.
- Produces: `#services`, `.service-card`, `.btn--tab`.

- [ ] **Шаг 1: Разметка**

Пункты — дословно из спеки §4.6.

```html
        <section class="section services" id="services" aria-labelledby="services-title">
            <div class="glow" style="--glow-x: 268px; --glow-y: 41px; --glow-size: 154px" aria-hidden="true"></div>
            <div class="container">
                <h2 class="section-title" id="services-title" data-reveal>Услуги</h2>

                <div class="services__list">
                    <article class="service-card" data-reveal>
                        <h3 class="service-card__title">Персональная тренировка</h3>
                        <ul class="service-card__points">
                            <li>Предварительная консультация</li>
                            <li>Контроль техники и прогрессии на каждом этапе</li>
                            <li>Гибкий график и возможность заниматься в удобное для вас время</li>
                            <li>Рекомендации по питанию, расчет КБЖУ</li>
                        </ul>
                        <a class="btn btn--tab" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer"
                           aria-label="Начать: персональная тренировка">Начать</a>
                    </article>

                    <article class="service-card" data-reveal>
                        <h3 class="service-card__title">Индивидуальная программа тренировок</h3>
                        <ul class="service-card__points">
                            <li>Индивидуальная программа под ваши цели (Похудение, Набор мышечной массы,
                                Поддержка формы, Улучшение пропорций)</li>
                            <li>Разбор техники по видеоотчётам/Обратная связь</li>
                            <li>Еженедельные отчеты/Корректировка плана</li>
                        </ul>
                        <a class="btn btn--tab" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer"
                           aria-label="Начать: индивидуальная программа тренировок">Начать</a>
                    </article>

                    <article class="service-card" data-reveal>
                        <h3 class="service-card__title">Онлайн-сопровождение</h3>
                        <ul class="service-card__points">
                            <li>Предварительная консультация</li>
                            <li>Индивидуальная программа под ваши цели (Похудение, Набор мышечной массы,
                                Поддержка формы, Улучшение пропорций)</li>
                            <li>Разбор техники по видеоотчётам/Обратная связь</li>
                            <li>Питание: расчёт КБЖУ, индивидуальные рекомендации под ваши цели,
                                ежедневная проверка</li>
                            <li>Еженедельные отчеты/Корректировка плана</li>
                        </ul>
                        <a class="btn btn--tab" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer"
                           aria-label="Начать: онлайн-сопровождение">Начать</a>
                    </article>
                </div>
            </div>
        </section>
```

У всех трёх кнопок одинаковая надпись «Начать», поэтому каждой дан свой `aria-label` — иначе в списке ссылок скринридера три неразличимых пункта.

- [ ] **Шаг 2: Стили карточки**

Правый нижний угол карточки прямой, кнопка-«хвостик» примыкает снизу справа: верхние углы прямые, нижние скруглены. Кнопка вынесена из потока карточки абсолютом, поэтому у карточки увеличен нижний внутренний отступ.

```css
/* ============================================================
   Услуги
   ============================================================ */
.services { padding-top: 42px; }

.services__list { margin-top: 30px; }

.service-card {
    position: relative;
    margin-bottom: 68px;       /* 44 высота хвостика + 24 воздуха */
    padding: 16px 18px 22px;
    border: var(--hairline);
    border-radius: var(--radius-md) var(--radius-md) 0 var(--radius-md);
}

.service-card__title {
    margin: 0 0 12px;
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 15px;
    line-height: 1.3;
    color: var(--accent);
}

.service-card__points {
    margin: 0;
    padding: 0;
    list-style: none;
}

.service-card__points li {
    position: relative;
    margin-bottom: 8px;
    padding-left: 12px;
    line-height: 1.42;
}

.service-card__points li:last-child { margin-bottom: 0; }

.service-card__points li::before {
    content: '\2022';
    position: absolute;
    left: 0;
}

.btn--tab {
    position: absolute;
    right: -0.8px;             /* садится на обводку карточки, а не рядом с ней */
    bottom: -44px;
    width: 116px;
    padding-inline: 8px;
    border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}
```

- [ ] **Шаг 3: Сверить со `slice_04.png` и `slice_05.png`**

Ключевая деталь: карточка и синяя кнопка читаются как одна фигура — правый нижний угол карточки прямой, кнопка примыкает вплотную без зазора и без наложения.

- [ ] **Шаг 4: Проверить, что кнопка не наезжает на текст**

```js
[...document.querySelectorAll('.service-card')].map(c => {
  const card = c.getBoundingClientRect();
  const last = c.querySelector('.service-card__points li:last-child').getBoundingClientRect();
  return Math.round(card.bottom - last.bottom);   // запас снизу
})
```

Ожидается: все три значения ≥ 16.

- [ ] **Шаг 5: Коммит**

```bash
git add index.html styles.css
git commit -m "Секция «Услуги» с карточками и кнопками-хвостиками"
```

---

## Task 7: Отзывы — разметка и стили

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.container`, `.section-title`.
- Produces: `#reviews`; узлы `[data-carousel]`, `.reviews__track`, `.review-slide`, `.reviews__dots`, `.reviews__dot`, `.reviews__arrow` — на них навешивается JS в задаче 8.

- [ ] **Шаг 1: Разметка**

Тексты отзывов — дословно из спеки §4.7. Подписи «До/После» ставятся только на слайдах 1 и 2: на третьем фото они уже вшиты в изображение.

```html
        <section class="section reviews" id="reviews" aria-labelledby="reviews-title">
            <div class="glow" style="--glow-x: -71px; --glow-y: 60px; --glow-size: 154px" aria-hidden="true"></div>
            <div class="container">
                <h2 class="section-title" id="reviews-title" data-reveal>Отзывы</h2>

                <div class="reviews__carousel" data-carousel data-reveal>
                    <button class="reviews__arrow reviews__arrow--prev" type="button" aria-label="Предыдущий отзыв">
                        <span aria-hidden="true">&#8592;</span>
                    </button>

                    <div class="reviews__viewport" role="region" tabindex="0"
                         aria-roledescription="carousel" aria-label="Отзывы клиентов">
                        <ul class="reviews__track">
                            <li class="review-slide" role="group" aria-roledescription="слайд" aria-label="1 из 3">
                                <div class="review-slide__photo">
                                    <img src="assets/review-1.png" alt="Осанка клиентки до и после тренировок"
                                         width="346" height="346" loading="lazy">
                                    <span class="review-slide__label review-slide__label--before">До</span>
                                    <span class="review-slide__label review-slide__label--after">После</span>
                                </div>
                                <p class="review-slide__text">…текст отзыва 1 из спеки §4.7…</p>
                            </li>

                            <li class="review-slide" role="group" aria-roledescription="слайд" aria-label="2 из 3">
                                <div class="review-slide__photo">
                                    <img src="assets/review-2.png" alt="Телосложение клиента до и после тренировок"
                                         width="346" height="346" loading="lazy">
                                    <span class="review-slide__label review-slide__label--before">До</span>
                                    <span class="review-slide__label review-slide__label--after">После</span>
                                </div>
                                <p class="review-slide__text">…текст отзыва 2 из спеки §4.7…</p>
                            </li>

                            <li class="review-slide" role="group" aria-roledescription="слайд" aria-label="3 из 3">
                                <div class="review-slide__photo">
                                    <img src="assets/review-3.png" alt="Осанка клиентки до и после тренировок, вид сбоку"
                                         width="346" height="346" loading="lazy">
                                </div>
                                <p class="review-slide__text">…текст отзыва 3 из спеки §4.7…</p>
                            </li>
                        </ul>
                    </div>

                    <button class="reviews__arrow reviews__arrow--next" type="button" aria-label="Следующий отзыв">
                        <span aria-hidden="true">&#8594;</span>
                    </button>

                    <div class="reviews__dots" role="tablist" aria-label="Выбор отзыва">
                        <button class="reviews__dot is-active" type="button" role="tab"
                                aria-label="Отзыв 1" aria-selected="true"></button>
                        <button class="reviews__dot" type="button" role="tab"
                                aria-label="Отзыв 2" aria-selected="false"></button>
                        <button class="reviews__dot" type="button" role="tab"
                                aria-label="Отзыв 3" aria-selected="false"></button>
                    </div>
                </div>
            </div>
        </section>
```

- [ ] **Шаг 2: Стили**

Трек — нативный горизонтальный скролл со `scroll-snap`. Это даёт родной свайп и работает без JS.

```css
/* ============================================================
   Отзывы
   ============================================================ */
.reviews { padding-top: 42px; }

.reviews__carousel { position: relative; margin-top: 28px; }

.reviews__viewport {
    overflow: hidden;
    border-radius: var(--radius-md);
}

.reviews__viewport:focus-visible { outline-offset: 4px; }

.reviews__track {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
    overscroll-behavior-x: contain;
}

.reviews__track::-webkit-scrollbar { display: none; }

.review-slide {
    flex: 0 0 100%;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.review-slide__photo {
    position: relative;
    width: 173px;
    aspect-ratio: 1;
    border-radius: var(--radius-md);
    overflow: hidden;
    outline: var(--hairline);
    outline-offset: -0.8px;
}

.review-slide__photo img { width: 100%; height: 100%; object-fit: cover; }

.review-slide__label {
    position: absolute;
    top: 6px;
    font-size: 13px;
    line-height: 1;
    text-shadow: 0 1px 3px rgba(0, 0, 0, .6);
}

.review-slide__label--before { left: 6px; }
.review-slide__label--after  { left: 50%; padding-left: 6px; }

.review-slide__text {
    max-width: 339px;
    margin: 18px 0 0;
    text-align: center;
    line-height: 1.42;
}

/* Индикаторы — три горизонтальных штриха. */
.reviews__dots {
    display: flex;
    justify-content: center;
    gap: 3px;
    margin-top: 26px;
}

.reviews__dot {
    width: 38px;
    height: 3px;
    padding: 12px 0;           /* тач-цель 38x27 при видимой полоске 3px */
    border: 0;
    background: transparent;
    cursor: pointer;
}

.reviews__dot::before {
    content: '';
    display: block;
    height: 3px;
    border-radius: 3px;
    background: var(--text);
    transition: background-color .2s ease;
}

.reviews__dot.is-active::before { background: var(--accent); }

/* Стрелки появляются только на планшете и шире — задача 11. */
.reviews__arrow { display: none; }
```

- [ ] **Шаг 3: Подставить настоящие тексты отзывов**

Заменить три плейсхолдера `…текст отзыва N из спеки §4.7…` на полные тексты из таблицы спеки §4.7, включая эмодзи в третьем.

- [ ] **Шаг 4: Проверить, что плейсхолдеров не осталось**

```bash
grep -n "текст отзыва" index.html
```

Ожидается: пусто (код возврата 1).

- [ ] **Шаг 5: Сверить со `slice_06.png` и `slice_07.png` и проверить свайп без JS**

Проверить: квадратное фото с синей обводкой по центру · подписи «До»/«После» поверх первого фото · текст по центру · три белых штриха под текстом, первый синий.

Свайп проверяется прямо сейчас, до написания JS:

```js
const t = document.querySelector('.reviews__track');
t.scrollBy({left: t.clientWidth});
await new Promise(r => setTimeout(r, 600));
Math.round(t.scrollLeft / t.clientWidth)
```

Ожидается: `1`.

- [ ] **Шаг 6: Коммит**

```bash
git add index.html styles.css
git commit -m "Секция «Отзывы»: слайды, фото до/после, индикаторы"
```

---

## Task 8: Карусель — JavaScript

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: `[data-carousel]`, `.reviews__track`, `.review-slide`, `.reviews__dot`, `.reviews__arrow--prev`, `.reviews__arrow--next` из задачи 7.
- Produces: ничего наружу — модуль замкнут на себе.

- [ ] **Шаг 1: Дописать модуль в `script.js`**

```js
/* ============================================================
   Карусель отзывов

   Листание построено на нативном горизонтальном скролле со scroll-snap:
   свайп пальцем и трекпадом работает сам, без JS. Здесь добавляются
   только индикаторы, стрелки и клавиатура — и синхронизация индикаторов
   с фактической позицией скролла.
   ============================================================ */
(function reviewsCarousel() {
    const root = document.querySelector('[data-carousel]');
    if (!root) return;

    const track = root.querySelector('.reviews__track');
    const slides = [...root.querySelectorAll('.review-slide')];
    const dots = [...root.querySelectorAll('.reviews__dot')];
    const prev = root.querySelector('.reviews__arrow--prev');
    const next = root.querySelector('.reviews__arrow--next');
    if (!track || slides.length === 0) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;

    function goTo(index) {
        // Зацикливаем: с последнего «вперёд» — на первый.
        const target = (index + slides.length) % slides.length;
        track.scrollTo({
            left: track.clientWidth * target,
            behavior: reduceMotion ? 'auto' : 'smooth',
        });
    }

    function setActive(index) {
        if (index === current) return;
        current = index;
        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
            dot.setAttribute('aria-selected', String(i === index));
        });
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

    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    root.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
    });
}());
```

- [ ] **Шаг 2: Проверить клик по индикаторам**

```js
document.querySelectorAll('.reviews__dot')[2].click();
await new Promise(r => setTimeout(r, 700));
const t = document.querySelector('.reviews__track');
[Math.round(t.scrollLeft / t.clientWidth),
 [...document.querySelectorAll('.reviews__dot')].findIndex(d => d.classList.contains('is-active'))]
```

Ожидается: `[2, 2]`.

- [ ] **Шаг 3: Проверить зацикливание**

```js
document.querySelector('.reviews__carousel').dispatchEvent(
  new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
await new Promise(r => setTimeout(r, 700));
Math.round(document.querySelector('.reviews__track').scrollLeft /
           document.querySelector('.reviews__track').clientWidth)
```

Ожидается: `0` — с третьего слайда «вперёд» вернуло на первый.

- [ ] **Шаг 4: Проверить обратную синхронизацию — скролл двигает индикаторы**

```js
const t = document.querySelector('.reviews__track');
t.scrollTo({left: t.clientWidth, behavior: 'auto'});
await new Promise(r => setTimeout(r, 300));
[...document.querySelectorAll('.reviews__dot')].findIndex(d => d.classList.contains('is-active'))
```

Ожидается: `1`.

- [ ] **Шаг 5: Проверить консоль**

`read_console_messages {onlyErrors: true}` — ожидается пустой список.

- [ ] **Шаг 6: Коммит**

```bash
git add script.js
git commit -m "Логика карусели отзывов: индикаторы, стрелки, клавиатура"
```

---

## Task 9: Контакты

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.container`, `.section-title`, `.btn`.
- Produces: `#contacts`, `.btn--social`.

- [ ] **Шаг 1: Разметка**

Вставить перед закрывающим `</main>`:

```html
        <section class="section contacts" id="contacts" aria-labelledby="contacts-title">
            <div class="glow" style="--glow-x: 263px; --glow-y: 225px; --glow-size: 154px" aria-hidden="true"></div>
            <div class="container">
                <h2 class="section-title" id="contacts-title" data-reveal>Контакты</h2>

                <p class="contacts__lead" data-reveal>
                    Не пропускай новые программы и полезные материалы. Подписывайся!
                </p>

                <div class="contacts__links" data-reveal>
                    <a class="btn btn--social" href="https://t.me/CHANGE_ME" target="_blank" rel="noopener noreferrer">Telegram</a>
                    <a class="btn btn--social" href="https://vk.com/CHANGE_ME" target="_blank" rel="noopener noreferrer">VK</a>
                    <a class="btn btn--social" href="https://instagram.com/CHANGE_ME" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <p class="footer__note">© 2026 Андрей Снегуров</p>
    </footer>
```

- [ ] **Шаг 2: Стили**

```css
/* ============================================================
   Контакты и подвал
   ============================================================ */
.contacts { padding-top: 42px; }

.contacts__lead {
    max-width: 356px;
    margin: 22px auto 32px;
    text-align: center;
    line-height: 1.42;
}

.contacts__links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 29px;
}

.btn--social {
    width: 218px;
    border-radius: var(--radius-sm);
}

.footer {
    position: relative;
    z-index: 1;
    padding: 48px 0 24px;
    text-align: center;
}

.footer__note {
    margin: 0;
    font-size: 12px;
    opacity: .45;
}
```

- [ ] **Шаг 3: Сверить со `slice_07.png`**

Проверить: заголовок, текст в две строки по центру, три синие кнопки одинаковой ширины столбиком с равными промежутками.

- [ ] **Шаг 4: Проверить все ссылки страницы разом**

```js
[...document.querySelectorAll('a[href]')].map(a => [a.textContent.trim().slice(0, 22), a.getAttribute('href')])
```

Ожидается: пункты меню с якорями `#…`, пять ссылок на `https://t.me/CHANGE_ME`, по одной на `vk.com` и `instagram.com`. Ни одного пустого `href` и ни одного `#` у CTA.

- [ ] **Шаг 5: Коммит**

```bash
git add index.html styles.css
git commit -m "Секция «Контакты» и подвал"
```

---

## Task 10: Активное меню и появление секций

**Files:**
- Modify: `script.js`
- Modify: `styles.css`

**Interfaces:**
- Consumes: `.nav__link`, `#hero/#services/#reviews/#contacts`, `[data-reveal]`, класс `js-enabled`.
- Produces: класс `.is-active` на `.nav__link`, класс `.is-visible` на `[data-reveal]`.

- [ ] **Шаг 1: Дописать два модуля в `script.js`**

```js
/* ============================================================
   Подсветка активного пункта меню
   ============================================================ */
(function activeNav() {
    const links = [...document.querySelectorAll('.nav__link')];
    if (links.length === 0) return;

    const byId = new Map();
    const sections = [];

    links.forEach((link) => {
        const id = link.getAttribute('href');
        if (!id || !id.startsWith('#')) return;
        const section = document.querySelector(id);
        if (!section) return;
        byId.set(section, link);
        sections.push(section);
    });

    if (sections.length === 0) return;

    function activate(link) {
        links.forEach((item) => {
            const isActive = item === link;
            item.classList.toggle('is-active', isActive);
            if (isActive) item.setAttribute('aria-current', 'true');
            else item.removeAttribute('aria-current');
        });
    }

    const observer = new IntersectionObserver((entries) => {
        // Активной считаем самую верхнюю из пересекающих экран секций.
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) activate(byId.get(visible[0].target));
    }, { rootMargin: '-42px 0px -66% 0px' });

    sections.forEach((section) => observer.observe(section));
}());

/* ============================================================
   Появление блоков при скролле
   ============================================================ */
(function reveal() {
    const items = [...document.querySelectorAll('[data-reveal]')];
    if (items.length === 0) return;

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
```

- [ ] **Шаг 2: Стили появления**

Начальное `opacity: 0` действует только при живом JS и только если пользователь не просил убрать анимации. Иначе контент виден всегда — страница не может остаться пустой.

```css
/* ============================================================
   Появление блоков при скролле
   ============================================================ */
@media (prefers-reduced-motion: no-preference) {
    .js-enabled [data-reveal] {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity .5s ease, transform .5s ease;
    }

    .js-enabled [data-reveal].is-visible {
        opacity: 1;
        transform: none;
    }
}
```

- [ ] **Шаг 3: Проверить, что первый экран виден сразу**

Перезагрузить страницу, сделать скриншот без прокрутки.
Ожидается: hero виден полностью, ничего не «висит» прозрачным.

- [ ] **Шаг 4: Проверить смену активного пункта**

```js
document.querySelector('#reviews').scrollIntoView();
await new Promise(r => setTimeout(r, 800));
document.querySelector('.nav__link.is-active').textContent
```

Ожидается: `"отзывы"`.

- [ ] **Шаг 5: Проверить, что без JS ничего не спрятано**

```js
document.documentElement.classList.remove('js-enabled');
[...document.querySelectorAll('[data-reveal]')].every(el => getComputedStyle(el).opacity === '1')
```

Ожидается: `true`. После проверки перезагрузить страницу.

- [ ] **Шаг 6: Коммит**

```bash
git add script.js styles.css
git commit -m "Подсветка активного пункта меню и появление блоков при скролле"
```

---

## Task 11: Планшет и десктоп

**Files:**
- Modify: `styles.css` (добавить два медиа-запроса в конец, перед блоком reduced-motion)
- Modify: `index.html` (обёртка hero для двухколоночной раскладки)

**Interfaces:**
- Consumes: все классы предыдущих задач.
- Produces: `.hero__inner` — обёртка, нужная только десктопной раскладке.

- [ ] **Шаг 1: Обернуть содержимое hero**

В `index.html` обернуть `.hero__media` и `.hero__rule` не трогая, а `.hero__caption` вынести из `.hero__media` наружу — в новый `.hero__inner`, который на мобильном не влияет на раскладку:

```html
        <section class="section hero" id="hero" aria-labelledby="hero-title">
            <div class="glow" style="--glow-x: 256px; --glow-y: -7px; --glow-size: 161px" aria-hidden="true"></div>

            <div class="hero__inner">
                <div class="hero__media">
                    <img class="hero__photo hero__photo--blur" src="assets/hero-andrew.png" alt="" aria-hidden="true">
                    <img class="hero__photo" src="assets/hero-andrew.png"
                         alt="Андрей Снегуров, персональный фитнес-тренер" width="862" height="1288">
                    <img class="hero__lines" src="assets/hero-lines.svg" alt="" aria-hidden="true">
                </div>

                <div class="hero__caption">
                    <h1 class="hero__title" id="hero-title">Андрей<br>Снегуров</h1>
                    <p class="hero__role">персональный<br>фитнес-тренер</p>
                </div>
            </div>

            <div class="hero__rule" aria-hidden="true"></div>
        </section>
```

И добавить в мобильные стили, чтобы поведение не изменилось:

```css
.hero__inner { position: relative; }
```

(`.hero__caption` уже спозиционирован абсолютом относительно ближайшего позиционированного предка — теперь это `.hero__inner`, размер которого на мобильном совпадает с `.hero__media`.)

- [ ] **Шаг 2: Планшет**

```css
/* ============================================================
   Планшет
   ============================================================ */
@media (min-width: 768px) {
    :root {
        --container: 720px;
        --gutter: 32px;
    }

    body { font-size: 15px; }

    .section-title { font-size: 38px; }

    .hero__caption { top: 96px; }
    .hero__title { font-size: 42px; }
    .hero__role { font-size: 15px; }

    .approach__list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 32px;
    }

    .approach__num { margin-left: 0; font-size: 56px; }

    /* На планшете карточки остаются колонкой, но не растягиваются:
       две колонки дают либо сироту в полряда, либо растянутую третью. */
    .service-card { max-width: 480px; margin-inline: auto; }

    .review-slide__photo { width: 240px; }
    .review-slide__text { max-width: 480px; }

    .reviews__arrow {
        position: absolute;
        top: 120px;
        z-index: 2;
        display: grid;
        place-items: center;
        width: 44px;
        height: 44px;
        border: var(--hairline);
        border-radius: 50%;
        background: rgba(17, 17, 17, .6);
        color: var(--text);
        font-size: 18px;
        cursor: pointer;
        transition: background-color .2s ease;
    }

    .reviews__arrow:hover { background: var(--accent); }
    .reviews__arrow--prev { left: 0; }
    .reviews__arrow--next { right: 0; }

    .contacts__links { flex-direction: row; justify-content: center; gap: 20px; }
}
```

- [ ] **Шаг 3: Десктоп**

```css
/* ============================================================
   Десктоп
   ============================================================ */
@media (min-width: 1024px) {
    :root {
        --container: 1120px;
        --gutter: 40px;
    }

    .section-title { font-size: 44px; }

    /* Hero в две колонки: слева фото, справа имя и подпись. */
    .hero { padding-top: calc(var(--nav-h) + 40px); }

    .hero__inner {
        display: grid;
        grid-template-columns: minmax(0, 460px) 1fr;
        align-items: center;
        gap: 48px;
        max-width: var(--container);
        margin-inline: auto;
        padding-inline: var(--gutter);
    }

    .hero__media {
        aspect-ratio: 460 / 560;
        border-radius: var(--radius-md);
    }

    .hero__caption {
        position: static;
        text-align: left;
    }

    .hero__title { font-size: 64px; }
    .hero__role { font-size: 18px; margin-top: 16px; }

    .hero__rule { margin-top: 48px; }

    .about .container,
    .approach .container,
    .services .container,
    .reviews .container,
    .contacts .container { max-width: var(--container); }

    .about__text {
        columns: 2;
        column-gap: 48px;
        max-width: none;
    }

    .about__figure {
        display: grid;
        grid-template-columns: 320px 1fr;
        align-items: start;
        gap: 40px;
        max-width: var(--container);
        margin-inline: auto;
        padding-inline: var(--gutter);
    }

    .about__photo { width: 100%; }

    .about__quote {
        position: static;
        width: auto;
        font-size: 14px;
        text-align: left;
        padding: 8px 16px;
    }

    .about__quote::before { left: 0; top: 0; }
    .about__quote::after { right: 0; bottom: 0; }

    .services__list {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        align-items: stretch;
        gap: 24px;
    }

    .service-card {
        max-width: none;
        margin-inline: 0;
        display: flex;
        flex-direction: column;
    }

    .service-card__points { flex: 1; }

    .reviews__arrow { top: 50%; translate: 0 -50%; }
    .reviews__arrow--prev { left: -8px; }
    .reviews__arrow--next { right: -8px; }

    .review-slide__photo { width: 280px; }
    .review-slide__text { max-width: 620px; font-size: 15px; }
}
```

- [ ] **Шаг 4: Скриншоты на трёх ширинах**

По очереди: `resize_window {width: 390, height: 844}`, `{width: 768, height: 1024}`, `{width: 1440, height: 900}` — с перезагрузкой и скриншотом на каждой.

Проверить на каждой: ничего не наезжает, ничего не обрезано, кнопки-«хвостики» на месте, карусель по центру.

- [ ] **Шаг 5: Проверить отсутствие горизонтального скролла на всех трёх**

На каждой ширине:

```js
[innerWidth, document.documentElement.scrollWidth, document.documentElement.clientWidth,
 document.documentElement.scrollWidth <= document.documentElement.clientWidth]
```

Ожидается: последним элементом `true` на всех трёх ширинах.

- [ ] **Шаг 6: Коммит**

```bash
git add index.html styles.css
git commit -m "Адаптив: планшет и десктоп"
```

---

## Task 12: Приёмка, документация и уборка

**Files:**
- Create: `README.md`
- Create: `TODO.md`
- Modify: `index.html`, `styles.css`, `script.js` (правки по итогам приёмки)

**Interfaces:**
- Consumes: всё предыдущее.
- Produces: готовый к передаче проект.

- [ ] **Шаг 1: Прогнать полный чек-лист приёмки из спеки §10**

Восемь пунктов, каждый — с фактическим запуском. Записать результат каждого; всё, что не прошло, чинится здесь же.

- [ ] **Шаг 2: Проверить `prefers-reduced-motion`**

`resize_window {colorScheme: ..., ...}` не подходит — проверять через эмуляцию в `javascript_tool` нельзя. Вместо этого временно инвертировать условие в CSS не нужно: достаточно проверить, что в `script.js` обе ветки покрыты, и что при `matchMedia('(prefers-reduced-motion: reduce)').matches === true` модуль `reveal` сразу проставляет `is-visible` (шаг проверяется чтением кода и ручным вызовом):

```js
[...document.querySelectorAll('[data-reveal]')].forEach(el => el.classList.add('is-visible'));
[...document.querySelectorAll('[data-reveal]')].every(el => getComputedStyle(el).opacity === '1')
```

Ожидается: `true`.

- [ ] **Шаг 3: Проверить порядок заголовков**

```js
[...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + h.textContent.trim().slice(0, 28))
```

Ожидается: ровно один `H1` (первым), далее `H2` секций, внутри — `H3`. Пропусков уровней нет.

- [ ] **Шаг 4: Написать `README.md`**

Разделы: что это · структура файлов · как запустить локально (`node .claude/dev-server.js`, затем `http://localhost:5173`) · как заменить ссылки · как заменить шрифт на оригинальный Electrolize RUS · как выложить на GitHub Pages / Netlify / Vercel · поддерживаемые браузеры.

- [ ] **Шаг 5: Написать `TODO.md`**

Что должен прислать заказчик, с точными командами замены:

```bash
# Telegram (5 мест: hero-CTA, «сделать первый шаг», три кнопки «Начать», кнопка TELEGRAM)
sed -i 's#https://t.me/CHANGE_ME#https://t.me/НИК#g' index.html
sed -i 's#https://vk.com/CHANGE_ME#https://vk.com/НИК#g' index.html
sed -i 's#https://instagram.com/CHANGE_ME#https://instagram.com/НИК#g' index.html
```

Плюс: файл шрифта Electrolize RUS (опционально), абсолютный URL для `og:image` после выбора домена, решение по опечаткам «расчет/расчёт».

- [ ] **Шаг 6: Убрать временные файлы и проверить чистоту дерева**

```bash
git status --short
ls
```

В корне не должно остаться `fonts-preview.html`, `target-crop.png` и прочего мусора.

- [ ] **Шаг 7: Финальный коммит**

```bash
git add -A
git commit -m "Документация проекта и правки по итогам приёмки"
```

---

## Self-review плана

**Покрытие спеки.** §2 стек → задача 1. §3 токены/шрифты/свечения → задача 1 (+ инлайн-позиции свечений в задачах 2–9). §4.1 меню → задача 2. §4.2 hero → задача 2. §4.3 слоган/CTA → задача 3. §4.4 обо мне → задача 4. §4.5 подход → задача 5. §4.6 услуги → задача 6. §4.7 отзывы → задачи 7–8. §4.8 контакты → задача 9. §4.9 правка текста → Global Constraints. §5.1 плавный скролл → задача 1 (CSS). §5.2 активное меню → задача 10. §5.3 карусель → задачи 7–8. §5.4 появление → задача 10. §6 адаптив → задача 11. §7 доступность → распределена по задачам, финальная проверка в задаче 12. §8 SEO → задача 1 (`<head>`), проверка в задаче 12. §9 ссылки → Global Constraints, `TODO.md` в задаче 12. §10 приёмка → задача 12.

**Плейсхолдеры.** Единственный намеренный — три `…текст отзыва N из спеки §4.7…` в задаче 7, и там же, шагами 3–4, они подставляются и проверяются `grep`. Больше «TBD»/«и т.п.» в плане нет.

**Согласованность имён.** `.btn--wide` (задачи 1, 3, 5) · `.btn--tab` (задачи 1, 6) · `.btn--social` (задачи 1, 9) · `.glow` + `--glow-x/--glow-y/--glow-size` (задачи 1, 2, 3, 5, 6, 7, 9) · `[data-reveal]`/`.is-visible` (задачи 3–10) · `js-enabled` (задачи 1, 10) · `.nav__link`/`.is-active` (задачи 2, 10) · `[data-carousel]`, `.reviews__track`, `.review-slide`, `.reviews__dot`, `.reviews__arrow--prev/--next` (задачи 7, 8) · `.hero__inner` (задача 11 создаёт, использует только она). Расхождений нет.
