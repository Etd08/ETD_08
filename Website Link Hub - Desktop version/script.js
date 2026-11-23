
/* =========================================
   ETD_08 — ORBITAL ENERGY ENGINE
   VERSION 4.0
========================================= */

const body = document.body;
const root = document.documentElement;

const finePointer = window.matchMedia("(pointer: fine)").matches;

const motionAllowed = !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


// =========================================
// 01 — THEME SYSTEM
// =========================================

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {

    body.classList.toggle("light-mode", theme === "light");

    if (themeIcon) {
        themeIcon.textContent = theme === "light" ? "☀" : "☾";
    }

    localStorage.setItem("etd-theme", theme);
}

applyTheme(localStorage.getItem("etd-theme") || "dark");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {

        applyTheme(
            body.classList.contains("light-mode")
                ? "dark"
                : "light"
        );

    });
}


// =========================================
// 02 — PROJECT CARD TILT
// =========================================

const cards = document.querySelectorAll("[data-tilt]");

if (motionAllowed && finePointer) {

    cards.forEach(card => {

        card.addEventListener("mousemove", event => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateX = (rect.height / 2 - y) / 35;
            const rotateY = (x - rect.width / 2) / 35;

            card.style.transform = `
                perspective(1400px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-5px)
            `;

        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

    });
}


// =========================================
// 03 — BACKGROUND PARALLAX
// =========================================

const backgroundOrbs = document.querySelectorAll(".gradient-orb");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;

if (motionAllowed && finePointer) {

    window.addEventListener("mousemove", event => {

        mouseX = (event.clientX / window.innerWidth - .5) * 2;
        mouseY = (event.clientY / window.innerHeight - .5) * 2;

    }, { passive: true });

    function animateBackground() {

        currentX += (mouseX - currentX) * .045;
        currentY += (mouseY - currentY) * .045;

        backgroundOrbs.forEach((orb, index) => {

            const depth = (index + 1) * 14;

            orb.style.translate = `
                ${currentX * depth}px
                ${currentY * depth}px
            `;

        });

        requestAnimationFrame(animateBackground);
    }

    animateBackground();
}


// =========================================
// 04 — MAGNETIC INTERACTIONS
// =========================================

const magneticElements = document.querySelectorAll(
    ".theme-switch, .arrow-circle, .howto-arrow"
);

if (motionAllowed && finePointer) {

    magneticElements.forEach(element => {

        element.addEventListener("mousemove", event => {

            const rect = element.getBoundingClientRect();

            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;

            element.style.translate = `
                ${x * .18}px
                ${y * .18}px
            `;

        });

        element.addEventListener("mouseleave", () => {
            element.style.translate = "";
        });

    });
}


// =========================================
// 05 — ORBITAL ENERGY SYSTEM
// =========================================

const stage = document.getElementById("orbitalStage");
const core = document.getElementById("energyCore");

const planetOrbits = stage
    ? [...stage.querySelectorAll(".planet-orbit")]
    : [];

const energyColors = [

    {
        name: "Purple",
        hex: "#a855f7",
        rgb: "168, 85, 247"
    },

    {
        name: "Pink",
        hex: "#ec4899",
        rgb: "236, 72, 153"
    },

    {
        name: "Red",
        hex: "#ef4444",
        rgb: "239, 68, 68"
    },

    {
        name: "Blue",
        hex: "#3b82f6",
        rgb: "59, 130, 246"
    },

    {
        name: "Green",
        hex: "#22c55e",
        rgb: "34, 197, 94"
    },

    {
        name: "Orange",
        hex: "#f97316",
        rgb: "249, 115, 22"
    },

    {
        name: "White",
        hex: "#ffffff",
        rgb: "255, 255, 255"
    }

];

let currentColor = 0;


// =========================================
// 06 — ENERGY COLOUR CONTROL
// =========================================

function applyEnergyColor(index) {

    const color = energyColors[index];

    root.style.setProperty("--energy-color", color.hex);
    root.style.setProperty("--energy-rgb", color.rgb);

    if (core) {

        core.setAttribute(
            "aria-label",
            `Change energy colour. Current colour: ${color.name}`
        );

        core.title = `${color.name} energy — Click to change`;
    }
}

applyEnergyColor(currentColor);

if (core) {

    core.addEventListener("click", () => {

        currentColor = (currentColor + 1) % energyColors.length;

        applyEnergyColor(currentColor);

    });
}


// =========================================
// 07 — INDEPENDENT PLANET DATA
// =========================================

const planetData = [
    { speed: 23, direction: 1 },
    { speed: 18, direction: -1 },
    { speed: 15, direction: 1 },
    { speed: 12, direction: -1 },
    { speed: 10, direction: 1 },
    { speed: 8.5, direction: -1 },
    { speed: 7, direction: 1 },
    { speed: 5.5, direction: -1 }
];

const orbitStates = planetOrbits.map((orbit, index) => {

    const data = planetData[index] || {
        speed: 10,
        direction: 1
    };

    const randomVariation = .85 + Math.random() * .30;

    return {
        element: orbit,

        angle: Math.random() * 360,

        baseSpeed: data.speed * randomVariation,

        direction: data.direction,

        currentSpeed: 0
    };

});


// =========================================
// 08 — CURSOR PROXIMITY
// =========================================

let targetIntensity = 0;
let currentIntensity = 0;

let targetDim = 0;
let currentDim = 0;

let targetEdgeGlow = 0;
let currentEdgeGlow = 0;

const maximumDistance = 430;

if (stage && core && finePointer && motionAllowed) {

    window.addEventListener("pointermove", event => {

        const rect = core.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = event.clientX - centerX;
        const dy = event.clientY - centerY;

        const distance = Math.hypot(dx, dy);

        // Entire cube hit area gets maximum energy.

        const coreRadius = Math.max(rect.width, rect.height) / 2;

        let proximity;

        if (distance <= coreRadius) {

            proximity = 1;

        } else {

            proximity = 1 - (
                (distance - coreRadius) /
                (maximumDistance - coreRadius)
            );

        }

        proximity = Math.max(0, Math.min(1, proximity));

        targetIntensity = proximity;

        // Maximum website dimming = 70%.

        targetDim = proximity * .70;

        // Maximum subtle edge glow.

        targetEdgeGlow = proximity * .55;

    }, { passive: true });

    window.addEventListener("pointerleave", () => {

        targetIntensity = 0;
        targetDim = 0;
        targetEdgeGlow = 0;

    });

}


// =========================================
// 09 — ENERGY ANIMATION ENGINE
// =========================================

let previousFrameTime = 0;

function animateEnergy(timestamp = 0) {

    const deltaTime = previousFrameTime
        ? Math.min((timestamp - previousFrameTime) / 1000, .05)
        : 0;

    previousFrameTime = timestamp;

    // Smooth response independent of frame rate.

    const smoothing = 1 - Math.exp(-deltaTime * 9);

    currentIntensity +=
        (targetIntensity - currentIntensity) * smoothing;

    currentDim +=
        (targetDim - currentDim) * smoothing;

    currentEdgeGlow +=
        (targetEdgeGlow - currentEdgeGlow) * smoothing;


    // =====================================
    // ENERGY LIGHT
    // =====================================

    root.style.setProperty(
        "--energy-intensity",
        currentIntensity.toFixed(3)
    );


    // =====================================
    // WEBSITE DIMMING
    // =====================================

    root.style.setProperty(
        "--scene-dim",
        currentDim.toFixed(3)
    );


    // =====================================
    // WEBSITE EDGE GLOW
    // =====================================

    root.style.setProperty(
        "--edge-glow",
        currentEdgeGlow.toFixed(3)
    );


    // =====================================
    // PLANET ROTATION
    // =====================================

    // Proximity multiplier:
    // Far away = 1x speed
    // On cube = 5.5x speed

    const speedMultiplier = 1 + currentIntensity * 4.5;

    orbitStates.forEach(orbit => {

        orbit.currentSpeed =
            orbit.baseSpeed * speedMultiplier;

        orbit.angle +=
            orbit.currentSpeed *
            orbit.direction *
            deltaTime;

        orbit.element.style.transform = `
            translate(-50%, -50%)
            rotate(${orbit.angle}deg)
        `;

    });


    // =====================================
    // MAXIMUM ENERGY CLASS
    // =====================================

    if (stage) {

        stage.classList.toggle(
            "is-active",
            currentIntensity > .75
        );

    }

    if (motionAllowed) {
        requestAnimationFrame(animateEnergy);
    }
}


// Start the animation engine.

if (stage && motionAllowed) {

    requestAnimationFrame(animateEnergy);

}


// =========================================
// 10 — STAGGERED ENTRANCE
// =========================================

const entranceElements = document.querySelectorAll(
    ".hero-content, .orbital-stage, .section-heading, .project-card, .howto-container"
);

if (
    motionAllowed &&
    "IntersectionObserver" in window
) {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: .12
    });

    entranceElements.forEach(element => {
        observer.observe(element);
    });

}


// =========================================
// 11 — INITIALIZATION
// =========================================

console.log(
    "%cETD_08 — ORBITAL ENERGY v4.0",
    "color:#a855f7;font-size:16px;font-weight:bold;"
);

console.log(`${orbitStates.length} independent orbits initialized.`);
console.log("Dynamic energy colour system initialized.");
console.log("Cursor proximity engine initialized.");
console.log("3D energy cube initialized.");
