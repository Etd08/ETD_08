
// ===================================
// ETD_08 — INTERACTION SYSTEM
// ===================================


// SCROLL REVEAL

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.15
});


document.querySelectorAll(
    ".project-card, .about, .section-heading, " +
    ".overview-header, .overview-main, .overview-side, " +
    ".principle-card, .philosophy-intro, " +
    ".philosophy-statement, .process-intro, .process-step"
).forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


// ACTIVE NAVIGATION

const sections = document.querySelectorAll("main section[id]");

const navLinks = document.querySelectorAll(".nav-link");


function updateNavigation() {

    let current = "home";

    sections.forEach(section => {

        if (window.scrollY >= section.offsetTop - 150) {

            current = section.id;

        }

    });

    navLinks.forEach(link => {

        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${current}`
        );

    });

}


window.addEventListener("scroll", updateNavigation, {
    passive: true
});

updateNavigation();


// SMOOTH NAVIGATION

navLinks.forEach(link => {

    link.addEventListener("click", (event) => {

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// PROJECT CARD POINTER GLOW

document.querySelectorAll(".project-card").forEach(card => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

    });

});


// SYSTEM STATUS

console.log(
    "%c ETD_08 ",
    "background:#9b5cff;color:white;padding:8px;font-weight:bold;"
);

console.log("Digital Interface Initialized.");
console.log("All systems operational.");


// ===================================
// SIGNAL PARTICLES — ORIGINAL CANVAS 2D VARIANT
// ===================================

(() => {
    const canvas = document.getElementById('particle-canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width;
    let height;

    const spacing = 16;
    const dotRadius = 1.5;
    let time = 0;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const cols = Math.floor(width / spacing);
        const rows = Math.floor(height / spacing);

        const offsetX = (width - cols * spacing) / 2;
        const offsetY = (height - rows * spacing) / 2;

        for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
                const x = offsetX + i * spacing;
                const y = offsetY + j * spacing;

                const nx = i * 0.1;
                const ny = j * 0.1;

                const wave1 = Math.sin(nx + time * 0.5) * Math.cos(ny - time * 0.3);
                const wave2 = Math.sin(nx * 0.5 - ny * 0.5 + time * 0.8);
                const value = wave1 + wave2;

                if (value > 0.1) {
                    ctx.beginPath();
                    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);

                    const highlightCheck = Math.sin(i * 12.34) * Math.cos(j * 56.78);

                    if (highlightCheck > 0.98) {
                        ctx.fillStyle = '#3b82f6';
                    } else if (highlightCheck < -0.98) {
                        ctx.fillStyle = '#8b5cf6';
                    } else {
                        const alpha = Math.min(0.6, (value - 0.1) * 0.8);
                        ctx.fillStyle = `rgba(148, 163, 184, ${alpha})`;
                    }

                    ctx.fill();
                }
            }
        }

        time += 0.02;
        requestAnimationFrame(draw);
    }

    draw();
})();


// ===================================
// OLDER VERSION — RANDOM TECH LINES
// ===================================

(() => {

    const button = document.querySelector('.how-to-btn');

    if (!button) return;

    const container = button.querySelector('.tech-lines');

    if (!container) return;

    const lineCount = 20;

    // Generate random lines
    for (let i = 0; i < lineCount; i++) {

        const line = document.createElement('span');

        line.className = 'tech-line';

        const side = Math.floor(Math.random() * 4);

        let x, y, angle;

        // Top
        if (side === 0) {
            x = Math.random() * 100;
            y = 0;
            angle = -90 + (Math.random() - 0.5) * 100;
        }

        // Right
        else if (side === 1) {
            x = 100;
            y = Math.random() * 100;
            angle = (Math.random() - 0.5) * 100;
        }

        // Bottom
        else if (side === 2) {
            x = Math.random() * 100;
            y = 100;
            angle = 90 + (Math.random() - 0.5) * 100;
        }

        // Left
        else {
            x = 0;
            y = Math.random() * 100;
            angle = 180 + (Math.random() - 0.5) * 100;
        }

        const length = 25 + Math.random() * 65;
        const delay = Math.random() * 0.3;

        line.style.setProperty('--x', `${x}%`);
        line.style.setProperty('--y', `${y}%`);
        line.style.setProperty('--angle', `${angle}deg`);
        line.style.setProperty('--length', `${length}px`);
        line.style.setProperty('--delay', `${delay}s`);

        container.appendChild(line);
    }

    // Hover in
    button.addEventListener('mouseenter', () => {
        button.classList.add('tech-active');
    });

    // Hover out — retract
    button.addEventListener('mouseleave', () => {
        button.classList.remove('tech-active');
    });

})();