
const sites = [ 

{
    name: "Life Achievements",
    description: "There is no finish line. Just things worth experiencing.",
    url: "https://etd08.github.io/ETD_08/Life-Achievements/",
    icon: "🏆",
    status: "LIVE"
},

{
    name: "Flappy Modi",
    description: "My live browser game",
    url: "https://etd08.github.io/ETD_08/flappy-modi/",
    icon: "🎮",
    status: "LIVE"
}
];

// Generate website entries
const siteList = document.getElementById("siteList");
const siteCount = document.getElementById("siteCount");

function renderSites() {
  siteList.replaceChildren();

  const validSites = sites.filter(site =>
    site.url &&
    !site.url.includes("PASTE_") &&
    /^https?:\/\//i.test(site.url)
  );

  siteCount.textContent =
    `${String(validSites.length).padStart(2, "0")} PROJECT${validSites.length === 1 ? "" : "S"}`;

  validSites.forEach(site => {
    const card = document.createElement("article");
    card.className = "site-card";

    const info = document.createElement("div");
    info.className = "site-info";

    const logoWrap = document.createElement("div");
    logoWrap.className = "site-logo-wrap";

    const icon = document.createElement("span");
    icon.className = "site-icon";
    icon.textContent = site.icon || "🌐";

    logoWrap.append(icon);

    const details = document.createElement("div");
    details.className = "site-details";

    const title = document.createElement("h3");
    title.textContent = site.name;

    const description = document.createElement("p");
    description.textContent = site.description || "Web project";

    const status = document.createElement("span");
    status.className = "site-status";
    status.textContent = site.status || "AVAILABLE";

    details.append(title, description, status);
    info.append(logoWrap, details);

    const link = document.createElement("a");
    link.className = "web-button";
    link.href = site.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.innerHTML = 'Web View <span aria-hidden="true">↗</span>';

    card.append(info, link);
    siteList.append(card);
  });
}

renderSites();

// Dark / light theme
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function applyTheme(theme) {
  document.body.classList.toggle("light", theme === "light");
  themeIcon.textContent = theme === "light" ? "☾" : "☼";

  document.documentElement.style.colorScheme = theme;

  try {
    localStorage.setItem("etd08-theme", theme);
  } catch (error) {
    // Theme still works if storage is unavailable.
  }
}

let savedTheme = null;

try {
  savedTheme = localStorage.getItem("etd08-theme");
} catch (error) {
  // Use the default theme.
}

const initialTheme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");

applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light")
    ? "dark"
    : "light";

  applyTheme(nextTheme);
});


/* ==============================
   ETD_08 BOOT SEQUENCE
================================ */

const bootScreen = document.getElementById("bootScreen");
const bootStatus = document.getElementById("bootStatus");
const bootPercent = document.getElementById("bootPercent");
const bootMessage = document.getElementById("bootMessage");

const bootSteps = [
  {
    time: 0,
    status: "INITIALIZING SYSTEM",
    message: "Establishing secure connection..."
  },
  {
    time: 1000,
    status: "LOADING INTERFACE",
    message: "Loading digital modules..."
  },
  {
    time: 2000,
    status: "SYNCHRONIZING",
    message: "Synchronizing project database..."
  },
  {
    time: 3000,
    status: "CALIBRATING DISPLAY",
    message: "Calibrating visual interface..."
  },
  {
    time: 4000,
    status: "SYSTEM READY",
    message: "Welcome to ETD_08."
  }
];

const bootStart = Date.now();

function updateBootScreen() {
  const elapsed = Date.now() - bootStart;
  const progress = Math.min(Math.floor((elapsed / 5000) * 100), 100);

  bootPercent.textContent = `${String(progress).padStart(2, "0")}%`;

  const currentStep = [...bootSteps]
    .reverse()
    .find(step => elapsed >= step.time);

  if (currentStep) {
    bootStatus.textContent = currentStep.status;
    bootMessage.textContent = currentStep.message;
  }

  if (elapsed >= 5000) {
    clearInterval(bootInterval);

    bootPercent.textContent = "100%";
    bootStatus.textContent = "SYSTEM ONLINE";

    document.body.classList.remove("is-loading");
    bootScreen.classList.add("loader-hidden");

    setTimeout(() => {
      bootScreen.remove();
    }, 750);
  }
}

updateBootScreen();
const bootInterval = setInterval(updateBootScreen, 50);
