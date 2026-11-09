
/* =====================================
   HOW-TO? — INTERACTION SYSTEM
===================================== */

const cards = document.querySelectorAll('.method-card');

cards.forEach((card) => {

    const main = card.querySelector('.card-main');
    const contractButton = card.querySelector('.contract-btn');
    const followButton = card.querySelector('.follow-btn');

    // Expand / Contract card
    main.addEventListener('click', () => {

        const wasActive = card.classList.contains('active');

        // Close every card first
        cards.forEach((otherCard) => {
            otherCard.classList.remove('active');
        });

        // Open selected card if it was previously closed
        if (!wasActive) {
            card.classList.add('active');
        }

    });

    // Contract Tab button
    contractButton.addEventListener('click', (event) => {

        event.stopPropagation();

        card.classList.remove('active');

    });

    // Follow Method button
    followButton.addEventListener('click', (event) => {

        // Empty href means no destination has been assigned yet
        if (!followButton.getAttribute('href')) {
            event.preventDefault();
        }

    });

});

// Update method count automatically
const methodCount = document.querySelectorAll('.method-card').length;

document.getElementById('method-count').textContent =
    `${String(methodCount).padStart(2, '0')} METHODS`;

console.log('How-To? Interface Initialized.');
console.log('All systems operational.');


/* =========================================
   ADVANCED LIQUID GLASS INTERACTION
========================================= */

const liquidCards = document.querySelectorAll('.method-card');

liquidCards.forEach((card) => {

    card.addEventListener('pointermove', (event) => {

        if (event.pointerType === 'touch') return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Cursor coordinates
        const mouseX = (x / rect.width) * 100;
        const mouseY = (y / rect.height) * 100;

        // 3D tilt calculation
        const rotateX = ((centerY - y) / centerY) * 3;
        const rotateY = ((x - centerX) / centerX) * 3;

        card.style.setProperty('--mouse-x', `${mouseX}%`);
        card.style.setProperty('--mouse-y', `${mouseY}%`);

        card.style.setProperty('--tilt-x', `${rotateX}deg`);
        card.style.setProperty('--tilt-y', `${rotateY}deg`);

        card.classList.add('cursor-active');

    });

    card.addEventListener('pointerleave', () => {

        card.classList.remove('cursor-active');

        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');

    });

});

console.log('Advanced Liquid Glass System Initialized.');


/* =========================================
   UPGRADE 08 — PARTICLE DRIFT ENGINE
   Adapted from the original Particle Drift
========================================= */

(() => {

    const canvas = document.getElementById("particle-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width = 0;
    let height = 0;

    let nodes = [];
    let beams = [];

    let animationFrame = null;

    const isMobile = () => window.innerWidth < 768;

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()".split("");

    const mouse = {
        x: -1000,
        y: -1000
    };

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* Resize canvas */

    function resize() {

        const rect = canvas.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        initParticles();

        if (reducedMotion) draw();
    }


    /* Initialize particles */

    function initParticles() {

        const mobile = isMobile();

        const nodeCount = mobile ? 55 : 90;
        const beamCount = mobile ? 13 : 25;

        nodes = Array.from({ length: nodeCount }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vy: Math.random() * 0.4 + 0.1,
            char: chars[Math.floor(Math.random() * chars.length)]
        }));

        beams = Array.from({ length: beamCount }).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 100 + 50,
            speed: Math.random() * 3 + 1.5,
            opacity: Math.random() * 0.35 + 0.2
        }));
    }


    /* Mouse interaction */

    window.addEventListener("pointermove", (event) => {

        if (event.pointerType === "touch") return;

        const rect = canvas.getBoundingClientRect();

        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;

    }, { passive: true });


    window.addEventListener("pointerleave", () => {

        mouse.x = -1000;
        mouse.y = -1000;

    });


    /* Main animation */

    function draw() {

        ctx.clearRect(0, 0, width, height);


        /* 1. Vertical drifting beams */

        beams.forEach((b) => {

            b.y -= b.speed;

            if (b.y + b.length < 0) {

                b.y = height + 100;
                b.x = Math.random() * width;

            }

            const gradient = ctx.createLinearGradient(
                b.x,
                b.y,
                b.x,
                b.y + b.length
            );

            gradient.addColorStop(
                0,
                `rgba(96, 165, 250, ${b.opacity})`
            );

            gradient.addColorStop(1, "transparent");

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;

            ctx.beginPath();
            ctx.moveTo(b.x, b.y);
            ctx.lineTo(b.x, b.y + b.length);
            ctx.stroke();

        });


        /* 2. Particle connections */

        ctx.lineWidth = 0.5;

        for (let i = 0; i < nodes.length; i++) {

            const n1 = nodes[i];

            for (let j = i + 1; j < nodes.length; j++) {

                const n2 = nodes[j];

                const distance = Math.hypot(
                    n1.x - n2.x,
                    n1.y - n2.y
                );

                if (distance < 120) {

                    ctx.strokeStyle =
                        `rgba(156, 163, 175, ${0.15 * (1 - distance / 120)})`;

                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();

                }
            }
        }


        /* 3. Floating ASCII particles */

        ctx.font = "12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        nodes.forEach((n) => {

            n.y += n.vy;

            if (n.y > height + 20) {

                n.y = -20;
                n.x = Math.random() * width;

            }

            const distance = Math.hypot(
                mouse.x - n.x,
                mouse.y - n.y
            );


            /* Dynamic character replacement */

            if (distance < 180 || Math.random() > 0.98) {

                n.char = chars[
                    Math.floor(Math.random() * chars.length)
                ];

            }


            /* Mouse connection */

            if (distance < 180) {

                ctx.strokeStyle =
                    `rgba(96, 165, 250, ${0.5 * (1 - distance / 180)})`;

                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();

            }


            /* Particle character */

            ctx.fillStyle = distance < 180
                ? "#60A5FA"
                : "rgba(156, 163, 175, 0.4)";

            ctx.fillText(n.char, n.x, n.y);

        });

    }


    /* Animation control */

    function animate() {

        draw();

        animationFrame = requestAnimationFrame(animate);

    }


    function startAnimation() {

        if (reducedMotion || document.hidden || animationFrame !== null) {
            return;
        }

        animate();

    }


    function stopAnimation() {

        if (animationFrame !== null) {

            cancelAnimationFrame(animationFrame);
            animationFrame = null;

        }

    }


    /* Initialization */

    resize();

    if (reducedMotion) {
        draw();
    } else {
        startAnimation();
    }


    window.addEventListener("resize", resize, { passive: true });

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {
            stopAnimation();
        } else {
            startAnimation();
        }

    });

    console.log("Particle Drift Engine Initialized.");

})();

// =========================================
// AUTOMATIC METHOD COUNTER
// =========================================

function updateMethodCount() {
    const count = document.querySelectorAll('.method-card').length;
    const counter = document.getElementById('method-count');

    if (counter) {
        counter.textContent = String(count).padStart(2, '0');
    }
}

updateMethodCount();

// =========================================
// UPGRADE 11 — PARTICLE SEARCH SYSTEM
// =========================================

const methodSearch = document.getElementById("method-search");

if (methodSearch) {

    let searchTimer;
    let previousQuery = "";

    // Create particle transition
    function createParticles(rect, mode) {

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const particleCount = 32;

        for (let i = 0; i < particleCount; i++) {

            const particle = document.createElement("div");
            particle.className = "search-particle";

            const targetX = rect.left + Math.random() * rect.width;
            const targetY = rect.top + Math.random() * rect.height;

            let startX, startY, moveX, moveY;

            if (mode === "scatter") {

                startX = targetX;
                startY = targetY;

                moveX = (Math.random() - 0.5) * 220;
                moveY = (Math.random() - 0.5) * 180;

            } else {

                startX = targetX + (Math.random() - 0.5) * 200;
                startY = targetY + (Math.random() - 0.5) * 160;

                moveX = targetX - startX;
                moveY = targetY - startY;
            }

            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;

            document.body.appendChild(particle);

            const animation = particle.animate(
                [
                    {
                        transform: "translate(0, 0) scale(1)",
                        opacity: mode === "scatter" ? 1 : 0
                    },
                    {
                        transform: `translate(${moveX}px, ${moveY}px) scale(${mode === "scatter" ? 0.1 : 0.7})`,
                        opacity: mode === "scatter" ? 0 : 1
                    }
                ],
                {
                    duration: mode === "scatter" ? 715 : 845,
                    delay: Math.random() * 100,
                    easing: mode === "scatter"
                        ? "cubic-bezier(.2,.7,.3,1)"
                        : "cubic-bezier(.16,1,.3,1)",
                    fill: "forwards"
                }
            );

            animation.finished
                .catch(() => {})
                .then(() => particle.remove());
        }
    }

    // Smoothly move existing cards
    function animateCardMovement(oldPositions, cards, enteringCards) {

        cards.forEach(card => {

            if (enteringCards.has(card)) return;

            const oldRect = oldPositions.get(card);
            if (!oldRect) return;

            const newRect = card.getBoundingClientRect();

            const deltaX = oldRect.left - newRect.left;
            const deltaY = oldRect.top - newRect.top;

            if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

            card.animate(
                [
                    {
                        transform: `translate(${deltaX}px, ${deltaY}px)`
                    },
                    {
                        transform: "translate(0, 0)"
                    }
                ],
                {
                    duration: 715,
                    easing: "cubic-bezier(.22,1,.36,1)"
                }
            );
        });
    }

    function filterMethods() {

        const query = methodSearch.value.trim().toLowerCase();

        if (query === previousQuery) return;
        previousQuery = query;

        const cards = [...document.querySelectorAll(".method-card")];

        // Remember old positions
        const oldPositions = new Map();

        cards.forEach(card => {
            if (getComputedStyle(card).display !== "none") {
                oldPositions.set(card, card.getBoundingClientRect());
            }
        });

        const enteringCards = new Set();

        cards.forEach(card => {

            const matches = card.textContent.toLowerCase().includes(query);
            const currentlyVisible = getComputedStyle(card).display !== "none";

            // Card disappearing
            if (!matches && currentlyVisible) {

                createParticles(card.getBoundingClientRect(), "scatter");
                card.style.display = "none";
            }

            // Card appearing
            else if (matches && !currentlyVisible) {

                card.style.display = "";

                enteringCards.add(card);
            }
        });

        // Allow browser to calculate new positions
        requestAnimationFrame(() => {

            animateCardMovement(oldPositions, cards, enteringCards);

            // Particle contraction + card reveal
            enteringCards.forEach(card => {

                const rect = card.getBoundingClientRect();

                createParticles(rect, "contract");

                card.animate(
                    [
                        {
                            opacity: 0,
                            transform: "scale(0.94)"
                        },
                        {
                            opacity: 1,
                            transform: "scale(1)"
                        }
                    ],
                    {
                        duration: 650,
                        easing: "cubic-bezier(.16,1,.3,1)"
                    }
                );
            });
        });
    }

    methodSearch.addEventListener("input", () => {

        clearTimeout(searchTimer);

        searchTimer = setTimeout(filterMethods, 70);
    });
}

// =========================================
// UPGRADE 12 — AUTOMATIC SORT SYSTEM
// =========================================

const methodList = document.getElementById("method-list");
const methodSort = document.getElementById("sort-container");
const sortTrigger = document.getElementById("sort-trigger");
const sortLabel = document.getElementById("sort-label");
const sortOptions = document.getElementById("sort-options");

if (methodList && methodSort) {

    let sortTimer;
    let sortingInProgress = false;

    // Store original card positions
    const originalCards = [
        ...methodList.querySelectorAll(".method-card")
    ];

    originalCards.forEach((card, index) => {
        card.dataset.originalIndex = index;
    });

    function sortMethods(sortType) {

        clearTimeout(sortTimer);

        const cards = [...methodList.querySelectorAll(".method-card")];

        // Calculate sorted order
        let sortedCards = [...cards];

        if (sortType === "az") {

            sortedCards.sort((a, b) =>
                a.querySelector(".card-title h3").textContent.trim()
                    .localeCompare(
                        b.querySelector(".card-title h3").textContent.trim()
                    )
            );

        }

        else if (sortType === "za") {

            sortedCards.sort((a, b) =>
                b.querySelector(".card-title h3").textContent.trim()
                    .localeCompare(
                        a.querySelector(".card-title h3").textContent.trim()
                    )
            );

        }

        else if (sortType === "latest") {

            sortedCards.sort((a, b) =>
                Number(b.dataset.originalIndex) -
                Number(a.dataset.originalIndex)
            );

        }

        else {

            sortedCards.sort((a, b) =>
                Number(a.dataset.originalIndex) -
                Number(b.dataset.originalIndex)
            );

        }

        // Start blur without moving cards
        methodList.classList.add("sorting-blur");
        sortingInProgress = true;

        sortTimer = setTimeout(() => {

            // Reorder cards while blurred
            sortedCards.forEach((card, index) => {

                methodList.appendChild(card);

                const number = card.querySelector(".card-number");

                if (number) {

                    if (sortType === "latest" || sortType === "oldest") {

                        number.textContent = String(
                            Number(card.dataset.originalIndex) + 1
                        ).padStart(2, "0");

                    } else {

                        number.textContent = String(index + 1).padStart(2, "0");

                    }
                }
            });

            // Remove blur
            requestAnimationFrame(() => {

                methodList.classList.remove("sorting-blur");
                sortingInProgress = false;

            });

        }, 650);
    }

    // Custom dropdown interaction

sortTrigger.addEventListener("click", () => {
    methodSort.classList.toggle("open");
});

sortOptions.querySelectorAll("button").forEach(option => {

    option.addEventListener("click", () => {

        const value = option.dataset.sort;

        sortLabel.textContent = option.textContent;

        sortOptions.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("selected");
        });

        option.classList.add("selected");

        methodSort.classList.remove("open");

        sortMethods(value);
    });

});

// Close dropdown when clicking outside

document.addEventListener("click", event => {

    if (!methodSort.contains(event.target)) {
        methodSort.classList.remove("open");
    }

});

}