// Используем новое имя, чтобы избежать ошибки "Already declared"
const initApp = () => {
    // 1. Проверка библиотек
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP/ScrollTrigger не найдены.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // 2. Мобильное меню
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.mobile-menu');
    if (burger && menu) {
        burger.onclick = () => {
            burger.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
        };
    }

    // 3. ВАЛИДАЦИЯ ТЕЛЕФОНА (Теперь она здесь и не пропадет)
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });
    }

    // 4. Hero Анимация
    const tl = gsap.timeline();
    tl.from('.hero__title', { opacity: 0, y: 30, duration: 1 })
      .from('.hero__subtitle', { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
      .from('.tech-glass-card', { opacity: 0, scale: 0.8, duration: 1 }, "-=0.5");

    // 5. Анимация появления (ScrollTrigger)
    const revealElements = [
        { selector: '.course-card', trigger: '.courses' },
        { selector: '.feature-card', trigger: '.features' },
        { selector: '.about__image', trigger: '.about', x: -50 },
        { selector: '.about__content', trigger: '.about', x: 50 }
    ];

    revealElements.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        if (elements.length > 0) {
            gsap.from(elements, {
                scrollTrigger: {
                    trigger: item.trigger,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: item.x ? 0 : 50,
                x: item.x || 0,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                clearProps: "all" 
            });
        }
    });

    // 6. FAQ
    document.querySelectorAll('.faq__question').forEach(q => {
        q.onclick = () => q.parentElement.classList.toggle('active');
    });

    // 7. Капча и Форма
    const contactForm = document.getElementById('contactForm');
    let answer = 0;
    const makeCaptcha = () => {
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        answer = a + b;
        const q = document.getElementById('captchaQuestion');
        if (q) q.innerText = `${a} + ${b} = ?`;
    };
    makeCaptcha();

    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const userVal = document.getElementById('captchaInput').value;
            const status = document.getElementById('formStatus');
            if (parseInt(userVal) !== answer) {
                alert("Ошибка в капче!");
                makeCaptcha();
                return;
            }
            status.style.display = 'block';
            status.className = 'form-status success';
            status.innerText = "Успешно! Мы свяжемся с вами.";
            contactForm.reset();
            makeCaptcha();
        };
    }

    // 8. Cookie
    const cp = document.getElementById('cookiePopup');
    if (cp && !localStorage.getItem('cc')) {
        setTimeout(() => cp.classList.add('active'), 2000);
        const acceptBtn = document.getElementById('acceptCookies');
        if (acceptBtn) {
            acceptBtn.onclick = () => {
                localStorage.setItem('cc', '1');
                cp.classList.remove('active');
            };
        }
    }

    // 9. ПЕРЕСЧЕТ ТОЧЕК
    setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 500);
    setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 2000);
};

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}