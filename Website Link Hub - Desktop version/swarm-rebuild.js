(() => {
  "use strict";
  const script = document.currentScript;
  const config = script ? script.dataset : {};
  const reduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduced) {
    window.SwarmRebuild = {
      replay() {},
      skip() {},
      setSpeed() {},
      tour() {},
      layers: []
    };
    return;
  }
  // --------------------------------------------------
  // CONFIG
  // --------------------------------------------------
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const num = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const requestedAgents = Math.max(
    1,
    Math.floor(num(config.agents, 14))
  );
  let speed = [1, 2, 4].includes(num(config.speed, 1))
    ? num(config.speed, 1)
    : 1;
  const line = clamp(num(config.line, 0.88), 0, 1);
  const bg = config.bg || "#000000";
  const accent = config.accent || "#3D8BFF";
  const colors = [
    "#FF5C8A", "#FFC233", "#A970FF", "#2DD4BF",
    "#4ADE80", "#FF8A3D", "#38BDF8", "#F43F5E",
    "#C084FC", "#FACC15", "#34D399", "#60A5FA",
    "#FB7185", "#F97316", "#22D3EE", "#A3E635"
  ];
  const names = [
    "Ada", "Bo", "Cyd", "Dex", "Eli", "Fen",
    "Gus", "Hal", "Ivy", "Jun", "Kai", "Lux",
    "Mo", "Nia", "Oz", "Pip"
  ];
  let agentCount = window.innerWidth < 640
    ? Math.min(requestedAgents, 8)
    : requestedAgents;
  const originalScrollRestoration =
    history.scrollRestoration;
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------
  let layers = [];
  let agents = [];
  let phase = "collecting";
  let startedAt = 0;
  let scanStartedAt = 0;
  let lastTime = 0;
  let elapsedTotal = 0;
  let raf = 0;
  let scanReady = false;
  let loadReady = document.readyState === "complete";
  let fontsReady = !document.fonts;
  let fontsWaitStarted = 0;
  let lastTriggerCheck = 0;
  let triggerDirty = true;
  let tourActive = false;
  let tourBlocked = false;
  let destroyed = false;
  let guideOpacity = 0;
  let guideTarget = 0;
  let lastAgentWorking = 0;
  const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    present: false,
    lastMove: 0,
    dirX: 1,
    dirY: 0,
    lastScroll: 0
  };
  let exitState = null;
  const revealCleanup = new Set();
  let completedCount = 0;
  let triggeredCount = 0;
  const stats = {
    total: 0,
    texts: 0,
    frames: 0,
    agents: agentCount
  };
  // --------------------------------------------------
  // DOM LAYERS
  // --------------------------------------------------
  const root = document.createElement("div");
  root.id = "sr-root";
  const canvas = document.createElement("canvas");
  canvas.id = "sr-canvas";
  root.appendChild(canvas);
  const agentsLayer = document.createElement("div");
  agentsLayer.id = "sr-agents";
  const scan = document.createElement("div");
  scan.id = "sr-scan";
  const core = document.createElement("div");
  core.id = "sr-core";
  const logoSlot = document.createElement("div");
  logoSlot.id = "sr-logo-slot";
  core.appendChild(logoSlot);
  scan.appendChild(core);
  const hud = document.createElement("div");
  hud.id = "sr-hud";
  hud.innerHTML = `
    <div class="sr-avatars"></div>
    <span class="sr-status">Preparing scan…</span>
    <div class="sr-progress">
      <div class="sr-progress-fill"></div>
    </div>
    <button class="sr-tour" type="button">Tour</button>
    <button class="sr-speed" type="button">${speed}×</button>
    <button class="sr-close" type="button" aria-label="Skip">×</button>
  `;
  const style = document.createElement("style");
  style.textContent = `
    html.sr-lock {
      overflow: hidden !important;
      overscroll-behavior: none !important;
    }
    #sr-root,
    #sr-agents,
    #sr-scan,
    #sr-hud {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      pointer-events: none !important;
    }
    #sr-root {
      z-index: 2147483000 !important;
      overflow: hidden !important;
      transition: opacity .55s ease !important;
    }
    #sr-canvas {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
    }
    #sr-scan {
      z-index: 2147483001 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background: ${bg} !important;
      opacity: 0;
      visibility: hidden;
      transition: opacity .55s ease, visibility .55s ease !important;
    }
    #sr-scan.sr-active {
      opacity: 1;
      visibility: visible;
    }
    #sr-scan.sr-fade {
      opacity: 0;
      visibility: hidden;
    }
    #sr-core {
      width: 64px !important;
      height: 64px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(255,255,255,.24) !important;
      border-radius: 19px !important;
      background: rgba(255,255,255,.09) !important;
      box-shadow:
        0 0 25px ${accent}55,
        0 0 80px ${accent}22,
        inset 0 1px 1px rgba(255,255,255,.2) !important;
      backdrop-filter: blur(18px) !important;
      animation: sr-pulse 1.5s ease-in-out infinite !important;
    }
    #sr-logo-slot {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      max-width: 48px !important;
      max-height: 48px !important;
      overflow: hidden !important;
      color: white !important;
    }
    #sr-logo-slot .sr-logo-clone {
      display: block !important;
      max-width: 42px !important;
      max-height: 42px !important;
      width: auto !important;
      height: auto !important;
      object-fit: contain !important;
    }
    #sr-agents {
      z-index: 2147483002 !important;
      overflow: visible !important;
    }
    #sr-agents .sr-agent {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 20px !important;
      height: 22px !important;
      transform-origin: 0 0 !important;
      will-change: transform !important;
    }
    #sr-agents .sr-arrow {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 20px !important;
      height: 22px !important;
      overflow: visible !important;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,.55)) !important;
    }
    #sr-agents .sr-ibeam {
      display: none !important;
      position: absolute !important;
      left: 4px !important;
      top: 3px !important;
      width: 12px !important;
      height: 17px !important;
    }
    #sr-agents .sr-caret {
      position: absolute !important;
      left: 15px !important;
      top: 0 !important;
      width: 2px !important;
      height: 17px !important;
      background: var(--sr-agent-color) !important;
      box-shadow: 0 0 6px var(--sr-agent-color) !important;
      display: none !important;
    }
    #sr-agents .sr-name {
      display: none !important;
      position: absolute !important;
      left: 14px !important;
      top: 17px !important;
      padding: 3px 7px !important;
      border-radius: 5px !important;
      background: var(--sr-agent-color) !important;
      color: #101018 !important;
      font: 600 10.5px/1.2 Arial, sans-serif !important;
      white-space: nowrap !important;
    }
    #sr-agents .sr-agent.sr-working .sr-name {
      display: block !important;
    }
    #sr-agents .sr-agent.sr-typing .sr-arrow {
      display: none !important;
    }
    #sr-agents .sr-agent.sr-typing .sr-ibeam,
    #sr-agents .sr-agent.sr-typing .sr-caret {
      display: block !important;
    }
    .sr-hide-paint {
      background: transparent !important;
      background-image: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
    .sr-hide-media {
      opacity: 0 !important;
    }
    .sr-reveal {
      transition:
        background-color .45s ease,
        border-color .45s ease,
        box-shadow .6s ease,
        opacity .45s ease !important;
    }
    .sr-w {
      display: inline !important;
      white-space: inherit !important;
    }
    .sr-typed {
      display: inline !important;
      color: inherit !important;
      -webkit-text-fill-color: currentColor !important;
    }
    .sr-rest {
      display: inline !important;
      visibility: hidden !important;
      color: transparent !important;
      -webkit-text-fill-color: transparent !important;
      text-shadow: none !important;
      user-select: none !important;
    }
    #sr-replay-control {
      position: fixed !important;
      right: 18px !important;
      bottom: calc(18px + env(safe-area-inset-bottom, 0px)) !important;
      z-index: 2147483004 !important;
      display: none;
      padding: 9px 12px !important;
      border: 1px solid rgba(255,255,255,.18) !important;
      border-radius: 9px !important;
      background: rgba(22,23,27,.92) !important;
      color: #fff !important;
      font: 600 10px/1 Arial,sans-serif !important;
      letter-spacing: .08em !important;
      cursor: pointer !important;
      backdrop-filter: blur(14px) !important;
    }
    #sr-replay-control.sr-visible { display: block !important; }
    .sr-tn {
      display: inline !important;
    }
    .sr-frame {
      position: fixed !important;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      box-sizing: border-box !important;
      border: 1px solid ${accent} !important;
      pointer-events: none !important;
      z-index: 2147483001 !important;
      will-change: transform, width, height, opacity !important;
    }
    .sr-frame.sr-text-frame {
      border-color: ${accent} !important;
    }
    .sr-handle {
      position: absolute !important;
      width: 7px !important;
      height: 7px !important;
      background: white !important;
      border: 1px solid ${accent} !important;
      box-sizing: border-box !important;
    }
    .sr-handle.sr-tl { left: -4px; top: -4px; }
    .sr-handle.sr-tr { right: -4px; top: -4px; }
    .sr-handle.sr-bl { left: -4px; bottom: -4px; }
    .sr-handle.sr-br { right: -4px; bottom: -4px; }
    .sr-size-label {
      position: absolute !important;
      left: 50% !important;
      top: calc(100% + 5px) !important;
      transform: translateX(-50%) !important;
      padding: 3px 6px !important;
      border-radius: 4px !important;
      background: ${accent} !important;
      color: #fff !important;
      font: 10px/1.2 monospace !important;
      white-space: nowrap !important;
    }
    #sr-hud {
      z-index: 2147483003 !important;
      inset: auto auto calc(18px + env(safe-area-inset-bottom, 0px)) 50% !important;
      transform: translateX(-50%) !important;
      width: max-content !important;
      max-width: calc(100vw - 24px) !important;
      height: 46px !important;
      padding: 0 12px !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      border: 1px solid rgba(255,255,255,.12) !important;
      border-radius: 13px !important;
      background: rgba(22,23,27,.9) !important;
      color: #f4f6fa !important;
      box-shadow: 0 8px 32px rgba(0,0,0,.3) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      font: 11px/1.2 Arial, sans-serif !important;
      white-space: nowrap !important;
      pointer-events: auto !important;
    }
    #sr-hud * { box-sizing: border-box !important; }
    #sr-hud .sr-avatars {
      display: flex !important;
      align-items: center !important;
      padding-left: 2px !important;
    }
    #sr-hud .sr-avatar {
      width: 21px !important;
      height: 21px !important;
      margin-left: -5px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      border: 1px solid rgba(255,255,255,.55) !important;
      border-radius: 50% !important;
      color: #101018 !important;
      font: 700 8px/1 Arial, sans-serif !important;
    }
    #sr-hud .sr-status {
      color: #e7e9ee !important;
      font-size: 10px !important;
    }
    #sr-hud .sr-progress {
      width: 64px !important;
      height: 4px !important;
      overflow: hidden !important;
      border-radius: 10px !important;
      background: rgba(255,255,255,.14) !important;
    }
    #sr-hud .sr-progress-fill {
      width: 0;
      height: 100% !important;
      border-radius: inherit !important;
      background: ${accent} !important;
      box-shadow: 0 0 8px ${accent} !important;
    }
    #sr-hud button {
      padding: 5px 7px !important;
      border: 1px solid rgba(255,255,255,.13) !important;
      border-radius: 6px !important;
      background: rgba(255,255,255,.07) !important;
      color: #fff !important;
      font: 600 10px/1 Arial, sans-serif !important;
      cursor: pointer !important;
    }
    #sr-hud button:hover {
      background: rgba(255,255,255,.16) !important;
    }
    #sr-hud .sr-close {
      font-size: 17px !important;
      line-height: 12px !important;
      padding: 5px 7px !important;
    }
    #sr-hud.sr-done .sr-progress {
      display: none !important;
    }
    #sr-hud.sr-done .sr-avatars {
      display: none !important;
    }
    @media (max-width: 559px) {
      #sr-hud .sr-avatars,
      #sr-hud .sr-progress,
      #sr-hud .sr-agent-count {
        display: none !important;
      }
      #sr-hud {
        gap: 7px !important;
        padding: 0 9px !important;
      }
    }
    @media (max-width: 699px) {
      #sr-root .sr-rulers {
        display: none !important;
      }
    }
    @keyframes sr-pulse {
      0%, 100% { transform: scale(.94); }
      50% { transform: scale(1.08); }
    }
  `;
  document.documentElement.appendChild(style);
  document.documentElement.appendChild(root);
  document.documentElement.appendChild(scan);
  document.documentElement.appendChild(agentsLayer);
  document.documentElement.appendChild(hud);
  // Cover the page immediately; the timed scan begins only after collection is ready.
  document.documentElement.classList.add("sr-lock");
  history.scrollRestoration = "manual";
  scan.classList.add("sr-active");
  const replayControl = document.createElement("button");
  replayControl.id = "sr-replay-control";
  replayControl.type = "button";
  replayControl.textContent = "REPLAY SWARM";
  replayControl.setAttribute("data-sr-replay", "");
  document.documentElement.appendChild(replayControl);
  const statusNode = hud.querySelector(".sr-status");
  const progressFill = hud.querySelector(".sr-progress-fill");
  const avatars = hud.querySelector(".sr-avatars");
  const tourButton = hud.querySelector(".sr-tour");
  const speedButton = hud.querySelector(".sr-speed");
  const closeButton = hud.querySelector(".sr-close");
  // --------------------------------------------------
  // LOGO
  // --------------------------------------------------
  function installLogo() {
    const logo = document.querySelector("[data-sr-logo]");
    if (!logo) {
      logoSlot.innerHTML = `
        <svg viewBox="0 0 40 40" width="36" height="36">
          <path d="M20 1 L25 15 L39 20 L25 25 L20 39 L15 25 L1 20 L15 15Z"
                fill="white"/>
        </svg>
      `;
      return;
    }
    const clone = logo.cloneNode(true);
    const clean = (node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      node.removeAttribute("id");
      Array.from(node.children).forEach(clean);
    };
    clean(clone);
    clone.classList.add("sr-logo-clone");
    logoSlot.replaceChildren(clone);
  }
  // Put the fallback mark in place immediately; collectPage replaces it with
  // the page's [data-sr-logo] clone once the body has been parsed.
  installLogo();
  // --------------------------------------------------
  // AGENTS
  // --------------------------------------------------
  function createAgent(index) {
    const element = document.createElement("div");
    element.className = "sr-agent";
    const color = colors[index % colors.length];
    const name = names[index % names.length];
    element.style.setProperty("--sr-agent-color", color);
    element.innerHTML = `
      <svg class="sr-arrow" viewBox="0 0 20 22">
        <path d="M0 0V16.5L4.6 12.4L7.6 19L10.4 17.8L7.5 11.3H13.4Z"
              fill="${color}" stroke="#fff" stroke-width="1.5"
              stroke-linejoin="round"/>
      </svg>
      <svg class="sr-ibeam" viewBox="0 0 12 17">
        <path d="M2 1H10M6 1V16M2 16H10"
              fill="none" stroke="${color}" stroke-width="2"/>
      </svg>
      <span class="sr-caret"></span>
      <span class="sr-name">${name}</span>
    `;
    agentsLayer.appendChild(element);
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.88;
    const agent = {
      index,
      name,
      color,
      element,
      x,
      y,
      targetX: x,
      targetY: y,
      angle: 0,
      task: null,
      wanderAt: 0,
      nextWander: 0,
      frame: null
    };
    avatars.insertAdjacentHTML(
      "beforeend",
      `<span class="sr-avatar" style="background:${color}">${name[0]}</span>`
    );
    return agent;
  }
  for (let i = 0; i < agentCount; i++) {
    agents.push(createAgent(i));
  }
  function syncAgentCount() {
    const desired = innerWidth < 640
      ? Math.min(requestedAgents, 8)
      : requestedAgents;
    while (agents.length > desired) {
      const agent = agents.pop();
      if (agent.task) {
        const layer = agent.task.layer;
        if (layer.frame) layer.frame.remove();
        restoreLayer(layer);
      }
      agent.element.remove();
      avatars.lastElementChild?.remove();
    }
    while (agents.length < desired) {
      agents.push(createAgent(agents.length));
    }
    agentCount = desired;
    stats.agents = agents.length;
    updateStats();
  }
  // --------------------------------------------------
  // LAYER COLLECTION
  // --------------------------------------------------
  const mediaTags = new Set([
    "IMG", "SVG", "CANVAS", "VIDEO", "AUDIO", "PICTURE",
    "INPUT", "TEXTAREA", "SELECT", "IFRAME", "HR",
    "PROGRESS", "METER", "OBJECT", "EMBED"
  ]);
  const skipTags = new Set([
    "SCRIPT", "STYLE", "TEMPLATE", "META", "BR"
  ]);
  function alphaOf(value) {
    if (!value || value.trim().toLowerCase() === "transparent") return 0;
    const match = value.match(/^rgba?\((.*)\)$/i);
    if (!match) return 1;
    const body = match[1];
    let alphaToken = null;
    if (body.includes("/")) {
      alphaToken = body.split("/").pop().trim();
    } else {
      const parts = body.split(",").map(part => part.trim());
      if (/^rgba/i.test(value) && parts.length >= 4) {
        alphaToken = parts[3];
      }
    }
    if (alphaToken === null) return 1;
    const alpha = parseFloat(alphaToken);
    if (!Number.isFinite(alpha)) return 1;
    return alphaToken.includes("%") ? alpha / 100 : alpha;
  }
  function hasBorder(styleObject) {
    const widths = [
      styleObject.borderTopWidth,
      styleObject.borderRightWidth,
      styleObject.borderBottomWidth,
      styleObject.borderLeftWidth
    ].reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    return widths > 0 && alphaOf(styleObject.borderColor) > 0;
  }
  function hasBoxStyle(styleObject) {
    return (
      alphaOf(styleObject.backgroundColor) > 0 ||
      (styleObject.backgroundImage &&
        styleObject.backgroundImage !== "none") ||
      (styleObject.boxShadow &&
        styleObject.boxShadow !== "none") ||
      hasBorder(styleObject)
    );
  }
  function directTextNodes(element) {
    return Array.from(element.childNodes).filter((node) =>
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue.trim().length > 0
    );
  }
  function addLayer(element, kind, parent, textValue = "") {
    const layer = {
      id: layers.length,
      element,
      kind,
      parent,
      text: textValue,
      hasText: Boolean(textValue),
      started: false,
      finished: false,
      triggered: false,
      assigned: false,
      frame: null,
      typedNode: null,
      restNode: null,
      originalText: textValue,
      originalNodes: null,
      agent: null,
      rect: null
    };
    layers.push(layer);
    element.setAttribute("data-sr-layer", String(layer.id));
    if (kind === "box") {
      element.classList.add("sr-hide-paint");
      stats.frames++;
    } else if (kind === "media") {
      element.classList.add("sr-hide-media");
      stats.frames++;
    }
    if (textValue) {
      stats.texts++;
      layer.originalNodes = Array.from(element.childNodes).map(
        node => node.cloneNode(true)
      );
      const wrapper = document.createElement("span");
      wrapper.className = "sr-w";
      const typed = document.createElement("span");
      typed.className = "sr-typed";
      const rest = document.createElement("span");
      rest.className = "sr-rest";
      rest.textContent = textValue;
      wrapper.append(typed, rest);
      element.replaceChildren(wrapper);
      layer.typedNode = typed;
      layer.restNode = rest;
    }
    return layer;
  }
  function collectElement(element, parentLayer = null) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    if (element.hasAttribute("data-sr-skip")) return;
    if (element.id?.startsWith("sr-")) return;
    if (element.classList.contains("sr-tn")) return;
    if (skipTags.has(element.tagName)) return;
    const computed = getComputedStyle(element);
    if (computed.display === "none") return;
    if (mediaTags.has(element.tagName)) {
      addLayer(element, "media", parentLayer);
      return;
    }
    const hasChildren = element.children.length > 0;
    const textValue = !hasChildren && element.textContent.trim()
      ? element.textContent
      : "";
    const isBox = hasBoxStyle(computed);
    let currentParent = parentLayer;
    if (isBox) {
      currentParent = addLayer(element, "box", parentLayer, textValue);
    } else if (!hasChildren && textValue) {
      currentParent = addLayer(element, "text", parentLayer, textValue);
    }
    if (!hasChildren) return;
    // Walk childNodes, not just children, so mixed text and element layers
    // are collected in their actual DOM order.
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const value = node.nodeValue;
        if (!value || !value.trim()) return;
        const span = document.createElement("span");
        span.className = "sr-tn";
        node.parentNode.replaceChild(span, node);
        span.appendChild(document.createTextNode(value));
        addLayer(span, "text", currentParent, value);
        return;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        collectElement(node, currentParent);
      }
    });
  }
  function restoreText(layer) {
    if (!layer.hasText) return;
    layer.element.textContent = layer.originalText;
    layer.typedNode = null;
    layer.restNode = null;
  }
  function restoreLayer(layer) {
    if (layer.finished) return;
    layer.element.classList.remove(
      "sr-hide-paint",
      "sr-hide-media"
    );
    if (!layer.revealRemoveAt) {
      layer.element.classList.remove("sr-reveal");
    }
    restoreText(layer);
    layer.element.removeAttribute("data-sr-layer");
    layer.finished = true;
    layer.assigned = false;
    layer.started = true;
    completedCount++;
  }
  function collectPage() {
    if (!document.body || destroyed) return;
    layers.length = 0;
    stats.total = 0;
    stats.texts = 0;
    stats.frames = 0;
    // Clone the logo before collection hides or wraps any of its source nodes.
    installLogo();
    collectElement(document.body, null);
    stats.total = layers.length;
    stats.agents = agents.length;
    updateStats();
    scanReady = true;
    startScan();
  }
  // --------------------------------------------------
  // SCAN + CANVAS
  // --------------------------------------------------
  function updateScanAgents(now) {
    const elapsed = Math.max(0, (now - scanStartedAt) / 1000);
    const rx = Math.min(innerWidth * 0.32, 230);
    const ry = Math.min(innerHeight * 0.28, 170);
    const cx = innerWidth / 2;
    const cy = innerHeight / 2;
    const flockSize = Math.ceil(agents.length / 3);
    agents.forEach(agent => {
      const flock = Math.min(2, Math.floor(agent.index / flockSize));
      const start = flock * flockSize;
      const members = Math.max(1, Math.min(flockSize, agents.length - start));
      const slot = agent.index - start;
      const direction = flock === 1 ? -1 : 1;
      const base = (Math.PI * 2 * slot / members) + flock * 0.72;
      const angle = base + elapsed * 1.35 * direction;
      const wobbleX = Math.sin(elapsed * 3.7 + agent.index * 1.31) * 10;
      const wobbleY = Math.cos(elapsed * 3.2 + agent.index * 1.17) * 10;
      const x = cx + Math.cos(angle) * rx + wobbleX;
      const y = cy + Math.sin(angle) * ry + wobbleY;
      const vx = x - agent.x;
      const vy = y - agent.y;
      agent.x = x;
      agent.y = y;
      if (Math.hypot(vx, vy) > 0.01) {
        agent.angle = Math.atan2(vy, vx) * 180 / Math.PI + 112.7;
      }
      agent.element.style.transform =
        `translate3d(${x}px,${y}px,0) rotate(${agent.angle}deg)`;
    });
  }
  const context = canvas.getContext("2d");
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    triggerDirty = true;
  }
  function startScan() {
    if (phase !== "collecting") return;
    phase = "scan";
    scanStartedAt = performance.now();
    statusNode.textContent = "Scanning page… 0 layers";
  }
  function updateStats() {
    const values = {
      total: stats.total.toLocaleString(),
      texts: stats.texts.toLocaleString(),
      frames: stats.frames.toLocaleString(),
      agents: agents.length.toLocaleString()
    };
    document.querySelectorAll("[data-sr-stat]").forEach(node => {
      const key = node.getAttribute("data-sr-stat");
      if (!(key in values)) return;
      const layer = layers.find(item =>
        item.hasText && (item.element === node || node.contains(item.element))
      );
      if (layer && layer.restNode) {
        layer.originalText = values[key];
        layer.text = values[key];
        layer.restNode.textContent = values[key];
        layer.typedNode.textContent = "";
      } else {
        node.textContent = values[key];
      }
    });
  }
  // --------------------------------------------------
  // SELECTION FRAMES
  // --------------------------------------------------
  function createFrame(layer) {
    const frame = document.createElement("div");
    frame.className = "sr-frame";
    if (layer.kind === "text") {
      frame.classList.add("sr-text-frame");
    } else {
      frame.innerHTML = `
        <i class="sr-handle sr-tl"></i>
        <i class="sr-handle sr-tr"></i>
        <i class="sr-handle sr-bl"></i>
        <i class="sr-handle sr-br"></i>
      `;
    }
    const label = document.createElement("span");
    label.className = "sr-size-label";
    label.textContent = "0 × 0";
    frame.appendChild(label);
    root.appendChild(frame);
    layer.frame = frame;
    layer.label = label;
    return frame;
  }
  function getTextCaretRect(layer) {
    if (!layer.typedNode || !layer.restNode) {
      return {
        rect: layer.element.getBoundingClientRect(),
        atEnd: false
      };
    }
    const typedRects = layer.typedNode.getClientRects();
    if (typedRects.length) {
      return { rect: typedRects[typedRects.length - 1], atEnd: true };
    }
    const restRects = layer.restNode.getClientRects();
    if (restRects.length) {
      return { rect: restRects[0], atEnd: false };
    }
    return { rect: layer.element.getBoundingClientRect(), atEnd: false };
  }
  function getLayerRect(layer) {
    if (layer.kind === "text") {
      const caret = getTextCaretRect(layer);
      return caret.rect;
    }
    return layer.element.getBoundingClientRect();
  }
  function positionFrame(layer, rect, width, height, opacity = 1) {
    if (!layer.frame) return;
    layer.frame.style.transform =
      `translate3d(${rect.left}px,${rect.top}px,0)`;
    layer.frame.style.width = `${Math.max(0, width)}px`;
    layer.frame.style.height = `${Math.max(0, height)}px`;
    layer.frame.style.opacity = opacity;
    layer.label.textContent =
      `${Math.round(width).toLocaleString()} × ${Math.round(height).toLocaleString()}`;
  }
  // --------------------------------------------------
  // TRIGGER CHECKING
  // --------------------------------------------------
  function checkTriggers(now) {
    if (now - lastTriggerCheck < 350 && !triggerDirty) return;
    lastTriggerCheck = now;
    triggerDirty = false;
    const H = innerHeight;
    const W = innerWidth;
    const threshold = H * line;
    triggeredCount = 0;
    layers.forEach(layer => {
      if (layer.finished || layer.assigned) return;
      const rect = layer.element.getBoundingClientRect();
      layer.rect = rect;
      if (rect.bottom < -60) {
        restoreLayer(layer);
        return;
      }
      const zeroSize = rect.width <= 0 || rect.height <= 0;
      const offSide = rect.right <= 0 || rect.left >= W;
      if (rect.top < threshold && (zeroSize || offSide)) {
        restoreLayer(layer);
        return;
      }
      if (rect.top < threshold) {
        layer.triggered = true;
        triggeredCount++;
      }
    });
  }
  // --------------------------------------------------
  // TASK ASSIGNMENT
  // --------------------------------------------------
  function distance(ax, ay, rect) {
    const x = rect.left;
    const y = rect.top;
    return Math.hypot(x - ax, y - ay);
  }
  function eligible(layer) {
    return (
      layer.triggered &&
      !layer.finished &&
      !layer.assigned &&
      (!layer.parent || layer.parent.started)
    );
  }
  function pickLayer(agent) {
    let best = null;
    let bestScore = Infinity;
    layers.forEach(layer => {
      if (!eligible(layer)) return;
      const rect = layer.rect || layer.element.getBoundingClientRect();
      const score = rect.top + 0.3 * distance(agent.x, agent.y, rect);
      if (score < bestScore) {
        bestScore = score;
        best = layer;
      }
    });
    return best;
  }
  function assignTask(agent, layer, now) {
    layer.assigned = true;
    layer.started = true;
    layer.agent = agent;
    const frame = createFrame(layer);
    agent.task = {
      layer,
      phase: "travel",
      phaseTime: 0,
      totalTime: 0,
      frame,
      startX: agent.x,
      startY: agent.y,
      targetX: agent.x,
      targetY: agent.y,
      drawDuration: 0,
      drawWidth: 0,
      drawHeight: 0,
      typeDuration: 0,
      typedCount: 0,
      wiggleStart: 0,
      startTime: now
    };
    agent.element.classList.add("sr-working");
  }
  // --------------------------------------------------
  // TASK PHASES
  // --------------------------------------------------
  function setAgentPosition(agent, x, y, angle = null) {
    agent.x = x;
    agent.y = y;
    if (angle !== null) {
      agent.angle = angle;
    }
    agent.element.style.transform =
      `translate3d(${x}px,${y}px,0) rotate(${agent.angle}deg)`;
  }
  function beginDraw(task, rect) {
    task.phase = "draw";
    task.phaseTime = 0;
    task.drawWidth = rect.width;
    task.drawHeight = rect.height;
    task.drawDuration = (
      0.22 + Math.min(0.34, Math.sqrt(
        Math.max(1, rect.width * rect.height)
      ) / 1600)
    ) / speed;
  }
  function beginFill(task, now) {
    const layer = task.layer;
    layer.element.classList.add("sr-reveal");
    layer.element.classList.remove(
      "sr-hide-paint",
      "sr-hide-media"
    );
    task.phase = "fill";
    task.phaseTime = 0;
    task.wiggleStart = now;
    layer.revealRemoveAt = now + 800 / speed;
    revealCleanup.add(layer);
  }
  function beginType(task) {
    const layer = task.layer;
    const length = layer.originalText.length;
    task.phase = "type";
    task.phaseTime = 0;
    task.typeDuration = clamp(length * 0.018, 0.25, 1.3) / speed;
    task.typedCount = 0;
  }
  function beginHold(task) {
    task.phase = "hold";
    task.phaseTime = 0;
  }
  function freeAgent(agent) {
    const task = agent.task;
    if (!task) return;
    const layer = task.layer;
    if (layer.frame) {
      layer.frame.style.transition = "opacity .25s ease";
      layer.frame.style.opacity = "0";
      task.removeFrameAt = performance.now() + 250 / speed;
    }
    restoreText(layer);
    if (task.removeFrameAt) {
      task.phase = "removing";
      task.phaseTime = 0;
      return;
    }
    restoreLayer(layer);
    agent.task = null;
    agent.element.classList.remove("sr-working", "sr-typing");
  }
  function finishTask(agent) {
    const task = agent.task;
    if (!task) return;
    const layer = task.layer;
    restoreText(layer);
    if (layer.frame) layer.frame.remove();
    restoreLayer(layer);
    agent.task = null;
    agent.element.classList.remove("sr-working", "sr-typing");
  }
  function typeText(task, agent, dt) {
    const layer = task.layer;
    const fullText = layer.originalText;
    const characters = Array.from(fullText);
    if (!layer.typedNode || !layer.restNode) {
      beginHold(task);
      return;
    }
    task.phaseTime += dt;
    const progress = clamp(task.phaseTime / task.typeDuration, 0, 1);
    const nextCount = Math.floor(characters.length * progress);
    if (nextCount !== task.typedCount) {
      task.typedCount = nextCount;
      layer.typedNode.textContent = characters.slice(0, nextCount).join("");
      layer.restNode.textContent = characters.slice(nextCount).join("");
    }
    agent.element.classList.add("sr-typing");
    // The first frame of sr-rest marks the insertion point before typing;
    // afterwards the last typed fragment marks the insertion point at its end.
    const caretInfo = getTextCaretRect(layer);
    const rect = caretInfo.rect;
    if (rect) {
      const x = caretInfo.atEnd ? rect.right : rect.left;
      const y = rect.top + rect.height / 2;
      agent.targetX = x - 10;
      agent.targetY = y - 8;
      setAgentPosition(agent, agent.targetX, agent.targetY);
      const caret = agent.element.querySelector(".sr-caret");
      caret.style.left = "10px";
      caret.style.top = "8px";
    }
    if (progress >= 1) {
      layer.typedNode.textContent = fullText;
      layer.restNode.textContent = "";
      beginHold(task);
    }
  }
  function updateTask(agent, dt, now) {
    const task = agent.task;
    if (!task) return;
    const layer = task.layer;
    smoothAngle(agent, 0, dt, 5);
    // Read live geometry every frame, so frames follow scrolling.
    const rect = layer.kind === "text"
      ? layer.element.getBoundingClientRect()
      : layer.element.getBoundingClientRect();
    const textCaret = layer.kind === "text"
      ? getTextCaretRect(layer).rect
      : rect;
    if (!rect) return;
    task.liveRect = rect;
    const targetX = layer.kind === "text" ? textCaret.left : rect.left;
    const targetY = layer.kind === "text" ? textCaret.top : rect.top;
    if (task.phase === "travel") {
      const k = 6 + 3 * speed;
      const easing = 1 - Math.exp(-k * dt);
      const dx = targetX - agent.x;
      const dy = targetY - agent.y;
      setAgentPosition(
        agent,
        agent.x + dx * easing,
        agent.y + dy * easing
      );
      task.phaseTime += dt;
      const arrived = Math.hypot(dx, dy) < 5;
      const timedOut = task.phaseTime >= 1.2 / speed;
      if (arrived || timedOut) {
        setAgentPosition(agent, targetX, targetY);
        if (layer.kind === "box" || layer.kind === "media") {
          positionFrame(layer, rect, 0, 0, 1);
          beginDraw(task, rect);
        } else {
          positionFrame(layer, rect, rect.width, rect.height, 1);
          beginType(task);
        }
      }
    }
    else if (task.phase === "draw") {
      task.phaseTime += dt;
      const p = clamp(task.phaseTime / task.drawDuration, 0, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const w = task.drawWidth * ease;
      const h = task.drawHeight * ease;
      positionFrame(
        layer,
        rect,
        w,
        h,
        1
      );
      const x = rect.left + w;
      const y = rect.top + h;
      setAgentPosition(agent, x, y);
      if (p >= 1) {
        beginFill(task, now);
      }
    }
    else if (task.phase === "fill") {
      task.phaseTime += dt;
      const wiggle = Math.sin(task.phaseTime * 45) * 3;
      setAgentPosition(
        agent,
        rect.right + wiggle,
        rect.bottom + Math.cos(task.phaseTime * 40) * 3
      );
      if (task.phaseTime >= 0.32 / speed) {
        if (layer.hasText) {
          beginType(task);
        } else {
          beginHold(task);
        }
      }
    }
    else if (task.phase === "type") {
      const textBounds = layer.element.getBoundingClientRect();
      positionFrame(layer, textBounds, textBounds.width, textBounds.height, 1);
      typeText(task, agent, dt);
    }
    else if (task.phase === "hold") {
      task.phaseTime += dt;
      if (task.phaseTime >= 0.16 / speed) {
        freeAgent(agent);
      }
    }
    else if (task.phase === "removing") {
      if (now >= task.removeFrameAt) {
        if (layer.frame) layer.frame.remove();
        restoreLayer(layer);
        agent.task = null;
        agent.element.classList.remove(
          "sr-working",
          "sr-typing"
        );
      }
    }
  }
  // --------------------------------------------------
  // FREE AGENTS: MOUSE TAIL / ORBIT / WANDER
  // --------------------------------------------------
  function smoothAngle(agent, targetAngle, dt, k) {
    let delta = ((targetAngle - agent.angle + 540) % 360) - 180;
    agent.angle += delta * (1 - Math.exp(-k * dt));
  }
  function followMouse(agent, dt, now) {
    const moving = now - mouse.lastMove < 350;
    let tx;
    let ty;
    let easingK;
    if (moving) {
      const i = agent.index;
      const lag = 34 + (i % 5) * 11;
      const spread = (((i * 37) % 60) - 30) * 0.9;
      const px = -mouse.dirY;
      const py = mouse.dirX;
      tx = mouse.x - mouse.dirX * lag + px * spread;
      ty = mouse.y - mouse.dirY * lag + py * spread;
      easingK = 3.2 + (i % 4) * 0.9;
    } else {
      const radius = Math.max(46, agents.length * 4.4);
      const angle = (Math.PI * 2 * agent.index / agents.length) +
        now * 0.00035;
      tx = mouse.x + Math.cos(angle) * radius;
      ty = mouse.y + Math.sin(angle) * radius;
      easingK = 5;
    }
    const oldX = agent.x;
    const oldY = agent.y;
    const easing = 1 - Math.exp(-easingK * dt);
    agent.x += (tx - agent.x) * easing;
    agent.y += (ty - agent.y) * easing;
    if (moving) {
      const vx = agent.x - oldX;
      const vy = agent.y - oldY;
      if (Math.hypot(vx, vy) > 0.15) {
        smoothAngle(agent, Math.atan2(vy, vx) * 180 / Math.PI + 112.7, dt, 10);
      }
    } else {
      const towardX = mouse.x - agent.x;
      const towardY = mouse.y - agent.y;
      smoothAngle(
        agent,
        Math.atan2(towardY, towardX) * 180 / Math.PI + 112.7,
        dt,
        10
      );
    }
    agent.element.style.transform =
      `translate3d(${agent.x}px,${agent.y}px,0) rotate(${agent.angle}deg)`;
  }
  function wander(agent, dt, now) {
    if (agent.task) return;
    const allIdle = agents.every(item => !item.task);
    const pending = layers.some(layer =>
      layer.triggered && !layer.finished && !layer.assigned
    );
    const scrollSettled = now - mouse.lastScroll >= 500;
    const free = mouse.present && scrollSettled && allIdle && !pending;
    if (free) {
      followMouse(agent, dt, now);
      return;
    }
    if (!agent.nextWander || now >= agent.nextWander) {
      agent.targetX = Math.random() * innerWidth;
      agent.targetY = Math.random() * innerHeight * 0.88;
      agent.nextWander = now + 1200 + Math.random() * 2000;
    }
    const oldX = agent.x;
    const oldY = agent.y;
    const easing = 1 - Math.exp(-1.4 * dt);
    agent.x += (agent.targetX - agent.x) * easing;
    agent.y += (agent.targetY - agent.y) * easing;
    const vx = agent.x - oldX;
    const vy = agent.y - oldY;
    if (Math.hypot(vx, vy) > 0.15) {
      smoothAngle(agent, Math.atan2(vy, vx) * 180 / Math.PI + 112.7, dt, 5);
    }
    agent.element.style.transform =
      `translate3d(${agent.x}px,${agent.y}px,0) rotate(${agent.angle}deg)`;
  }
  // --------------------------------------------------
  // GUIDE DRAWING
  // --------------------------------------------------
  function drawGuides(now) {
    const width = innerWidth;
    const height = innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    context.clearRect(0, 0, width, height);
    if (guideOpacity <= 0.005) return;
    context.save();
    context.globalAlpha = guideOpacity;
    // Build line
    const buildY = height * line;
    context.strokeStyle = "#FF453A";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(0, buildY);
    context.lineTo(width, buildY);
    context.stroke();
    context.fillStyle = "#FF453A";
    context.font = "9px monospace";
    context.textAlign = "right";
    context.fillText("BUILD LINE", width - 12, buildY - 6);
    // Rulers on larger screens
    if (width >= 700) {
      const ruler = 20;
      context.fillStyle = "rgba(17,18,22,.96)";
      context.fillRect(0, 0, width, ruler);
      context.fillRect(0, 0, ruler, height);
      context.strokeStyle = "rgba(255,255,255,.35)";
      context.lineWidth = 1;
      const startX = Math.floor(scrollX / 10) * 10;
      const endX = scrollX + width;
      for (let x = startX; x <= endX; x += 10) {
        const sx = x - scrollX;
        const mod = x % 100;
        const tick = mod === 0 ? 20 : mod === 50 ? 7 : 4;
        context.beginPath();
        context.moveTo(sx, ruler);
        context.lineTo(sx, ruler - tick);
        context.stroke();
        if (mod === 0) {
          context.fillStyle = "rgba(255,255,255,.7)";
          context.font = "9px monospace";
          context.textAlign = "center";
          context.fillText(String(x), sx, 11);
        }
      }
      const startY = Math.floor(scrollY / 10) * 10;
      const endY = scrollY + height;
      for (let y = startY; y <= endY; y += 10) {
        const sy = y - scrollY;
        const mod = y % 100;
        const tick = mod === 0 ? 20 : mod === 50 ? 7 : 4;
        context.beginPath();
        context.moveTo(ruler, sy);
        context.lineTo(ruler - tick, sy);
        context.stroke();
        if (mod === 0) {
          context.save();
          context.translate(10, sy);
          context.rotate(-Math.PI / 2);
          context.fillStyle = "rgba(255,255,255,.7)";
          context.font = "9px monospace";
          context.textAlign = "center";
          context.fillText(String(y), 0, 0);
          context.restore();
        }
      }
    }
    // Active frame ruler guides
    context.setLineDash([2, 3]);
    context.lineWidth = 1;
    context.strokeStyle = accent;
    context.globalAlpha = guideOpacity * 0.55;
    agents.forEach(agent => {
      const task = agent.task;
      if (!task || !task.liveRect) return;
      const rect = task.liveRect;
      context.beginPath();
      context.moveTo(rect.left, rect.top);
      context.lineTo(0, rect.top);
      context.moveTo(rect.left, rect.top);
      context.lineTo(rect.left, 0);
      context.stroke();
      if (width >= 700) {
        context.fillStyle = accent;
        context.globalAlpha = guideOpacity * 0.3;
        context.fillRect(rect.left, 0, rect.width, 20);
        context.fillRect(0, rect.top, 20, rect.height);
        context.globalAlpha = guideOpacity * 0.55;
      }
    });
    context.setLineDash([]);
    context.restore();
  }
  // --------------------------------------------------
  // HUD
  // --------------------------------------------------
  function updateHud() {
    const total = layers.length;
    const done = completedCount;
    if (phase === "scan") {
      const progress = clamp(
        (performance.now() - scanStartedAt) / (1900 / speed),
        0,
        1
      );
      const count = Math.floor(total * progress);
      statusNode.textContent =
        `Scanning page… ${count.toLocaleString()} layers`;
      return;
    }
    if (phase === "build") {
      statusNode.innerHTML =
        `<span class="sr-agent-count">${agents.length} agents</span> &nbsp; ${done.toLocaleString()} / ${total.toLocaleString()} layers`;
      progressFill.style.width =
        `${total ? done / total * 100 : 100}%`;
      return;
    }
    if (phase === "done") {
      const seconds = ((performance.now() - startedAt) / 1000)
        .toFixed(1);
      statusNode.textContent =
        `Rebuilt ${total.toLocaleString()} layers in ${seconds}s`;
      tourButton.textContent = "Replay";
      hud.classList.add("sr-done");
    }
  }
  function startBuild() {
    if (phase !== "scan") return;
    scan.classList.add("sr-fade");
    phase = "build";
    startedAt = performance.now();
    document.documentElement.classList.remove("sr-lock");
    history.scrollRestoration = originalScrollRestoration;
    updateHud();
    triggerDirty = true;
  }
  function finishBuild() {
    if (phase === "done") return;
    agents.forEach(agent => {
      if (agent.task?.frame) agent.task.frame.remove();
      agent.task = null;
      agent.element.classList.remove("sr-working", "sr-typing");
    });
    layers.forEach(layer => {
      if (!layer.finished) restoreLayer(layer);
      if (layer.frame) {
        layer.frame.remove();
        layer.frame = null;
      }
    });
    completedCount = layers.length;
    phase = "done";
    tourActive = false;
    exitState = null;
    agents.forEach(agent => {
      agent.element.style.opacity = "1";
      agent.nextWander = 0;
    });
    hud.classList.add("sr-done");
    hud.classList.remove("sr-exiting");
    replayControl.classList.remove("sr-visible");
    tourButton.textContent = "Replay";
    closeButton.setAttribute("aria-label", "Send swarm away");
    progressFill.style.width = "100%";
    updateHud();
  }
  function exitSwarm() {
    if (phase !== "done" || exitState) return;
    const centerX = agents.reduce((sum, a) => sum + a.x, 0) / Math.max(1, agents.length);
    const centerY = agents.reduce((sum, a) => sum + a.y, 0) / Math.max(1, agents.length);
    const distances = [
      { side: "left", distance: centerX },
      { side: "right", distance: innerWidth - centerX },
      { side: "top", distance: centerY },
      { side: "bottom", distance: innerHeight - centerY }
    ].sort((a, b) => a.distance - b.distance);
    const side = distances[0].side;
    exitState = {
      started: performance.now(),
      duration: 1800,
      side,
      agents: agents.map(agent => ({
        agent,
        x: agent.x,
        y: agent.y,
        targetX: side === "left" ? -50 :
          side === "right" ? innerWidth + 50 : agent.x + (agent.index - agents.length / 2) * 7,
        targetY: side === "top" ? -50 :
          side === "bottom" ? innerHeight + 50 : agent.y + (agent.index - agents.length / 2) * 7
      }))
    };
    hud.classList.add("sr-exiting");
    replayControl.classList.remove("sr-visible");
  }
  function updateExit(now) {
    if (!exitState) return;
    const p = clamp((now - exitState.started) / exitState.duration, 0, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    exitState.agents.forEach(item => {
      const { agent } = item;
      const x = item.x + (item.targetX - item.x) * eased;
      const y = item.y + (item.targetY - item.y) * eased;
      agent.element.style.transform =
        `translate3d(${x}px,${y}px,0) rotate(${agent.angle}deg)`;
      agent.element.style.opacity = String(1 - p);
    });
    if (p >= 1) {
      agents.forEach(agent => {
        agent.element.style.display = "none";
      });
      hud.style.display = "none";
      exitState = null;
      replayControl.classList.add("sr-visible");
    }
  }
  // --------------------------------------------------
  // TOUR
  // --------------------------------------------------
  function stopTour() {
    tourActive = false;
    tourButton.textContent = phase === "done" ? "Replay" : "Tour";
  }
  function startTour() {
    if (phase === "done") {
      replay();
      return;
    }
    if (phase !== "build") return;
    tourActive = true;
    tourButton.textContent = "Pause";
    tourBlocked = false;
  }
  function updateTour(dt) {
    if (!tourActive || phase !== "build") return;
    const pending = layers.filter(layer =>
      layer.triggered && !layer.finished && !layer.assigned
    ).length;
    const threshold = Math.max(1, agents.length * 0.6);
    if (pending >= threshold) return;
    const maxScroll =
      document.documentElement.scrollHeight - innerHeight;
    if (window.scrollY >= maxScroll - 2) {
      stopTour();
      return;
    }
    window.scrollBy({
      top: 240 * speed * dt,
      left: 0,
      behavior: "instant"
    });
    triggerDirty = true;
  }
  function interruptTour() {
    if (tourActive) stopTour();
  }
  // --------------------------------------------------
  // REPLAY / SPEED / SKIP
  // --------------------------------------------------
  function setSpeed(value) {
    const next = Number(value);
    if ([1, 2, 4].includes(next)) {
      speed = next;
    } else {
      speed = speed === 1 ? 2 : speed === 2 ? 4 : 1;
    }
    speedButton.textContent = `${speed}×`;
  }
  function replay() {
    if (destroyed) return;
    stopTour();
    clearRevealCleanup();
    exitState = null;
    hud.style.display = "";
    hud.classList.remove("sr-exiting");
    replayControl.classList.remove("sr-visible");
    agents.forEach(agent => {
      agent.element.style.display = "";
      agent.element.style.opacity = "1";
    });
    layers.forEach(layer => {
      if (layer.frame) layer.frame.remove();
      layer.frame = null;
      layer.label = null;
      layer.finished = false;
      layer.started = false;
      layer.triggered = false;
      layer.assigned = false;
      layer.agent = null;
      layer.revealRemoveAt = 0;
      layer.element.classList.remove(
        "sr-reveal",
        "sr-hide-paint",
        "sr-hide-media"
      );
      if (layer.hasText) {
        layer.element.textContent = layer.originalText;
      }
    });
    completedCount = 0;
    // Re-hide all layers.
    layers.forEach(layer => {
      if (layer.kind === "box") {
        layer.element.classList.add("sr-hide-paint");
      } else if (layer.kind === "media") {
        layer.element.classList.add("sr-hide-media");
      }
      if (layer.hasText) {
        const wrapper = document.createElement("span");
        wrapper.className = "sr-w";
        const typed = document.createElement("span");
        typed.className = "sr-typed";
        const rest = document.createElement("span");
        rest.className = "sr-rest";
        rest.textContent = layer.originalText;
        wrapper.append(typed, rest);
        layer.element.replaceChildren(wrapper);
        layer.typedNode = typed;
        layer.restNode = rest;
      }
    });
    agents.forEach(agent => {
      if (agent.task?.frame) agent.task.frame.remove();
      agent.task = null;
      agent.x = Math.random() * innerWidth;
      agent.y = Math.random() * innerHeight * 0.88;
      agent.targetX = agent.x;
      agent.targetY = agent.y;
      agent.angle = 0;
      agent.nextWander = 0;
      agent.element.classList.remove("sr-working", "sr-typing");
    });
    mouse.lastScroll = performance.now();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
    phase = "scan";
    scanStartedAt = performance.now();
    document.documentElement.classList.add("sr-lock");
    history.scrollRestoration = "manual";
    scan.classList.remove("sr-fade");
    scan.classList.add("sr-active");
    hud.classList.remove("sr-done");
    tourButton.textContent = "Tour";
    progressFill.style.width = "0%";
    triggerDirty = true;
    completedCount = 0;
  }
  function skip() {
    clearRevealCleanup();
    if (phase === "collecting" && document.body) {
      collectPage();
    }
    scan.classList.add("sr-fade");
    document.documentElement.classList.remove("sr-lock");
    history.scrollRestoration = originalScrollRestoration;
    finishBuild();
  }
  // --------------------------------------------------
  // EVENTS
  // --------------------------------------------------
  hud.querySelector(".sr-tour").addEventListener("click", () => {
    if (phase === "done") {
      replay();
    } else if (tourActive) {
      stopTour();
    } else {
      startTour();
    }
  });
  speedButton.addEventListener("click", () => setSpeed());
  closeButton.addEventListener("click", () => {
    if (phase === "done") exitSwarm();
    else skip();
  });
  document.addEventListener("click", event => {
    if (event.target.closest("[data-sr-replay]")) {
      replay();
    }
  });
  window.addEventListener("scroll", () => {
    mouse.lastScroll = performance.now();
    triggerDirty = true;
  }, { passive: true });
  window.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse") return;
    const dx = event.clientX - mouse.x;
    const dy = event.clientY - mouse.y;
    const distance = Math.hypot(dx, dy);
    mouse.present = true;
    if (distance <= 2) return;
    const nx = dx / distance;
    const ny = dy / distance;
    const blend = Math.min(1, distance / 40);
    mouse.dirX += (nx - mouse.dirX) * blend;
    mouse.dirY += (ny - mouse.dirY) * blend;
    const length = Math.hypot(mouse.dirX, mouse.dirY) || 1;
    mouse.dirX /= length;
    mouse.dirY /= length;
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.lastMove = performance.now();
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    mouse.present = false;
  });
  window.addEventListener("blur", () => {
    mouse.present = false;
  });
  window.addEventListener("resize", () => {
    syncAgentCount();
    resizeCanvas();
    triggerDirty = true;
  }, { passive: true });
  window.addEventListener("wheel", interruptTour, { passive: true });
  window.addEventListener("touchstart", interruptTour, { passive: true });
  window.addEventListener("keydown", event => {
    if (
      event.key === "Escape" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowUp" ||
      event.key === "PageDown" ||
      event.key === "PageUp"
    ) {
      if (event.key === "Escape") {
        if (phase === "done") exitSwarm();
        else skip();
      } else {
        interruptTour();
      }
    }
  });
  // --------------------------------------------------
  // READY CHECK
  // --------------------------------------------------
  window.addEventListener("load", () => {
    loadReady = true;
  }, { once: true });
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      fontsReady = true;
    }).catch(() => {
      fontsReady = true;
    });
  }
  // --------------------------------------------------
  // MAIN ANIMATION LOOP
  // --------------------------------------------------
  function updateRevealCleanup(now) {
    for (const layer of revealCleanup) {
      if (now < layer.revealRemoveAt) continue;
      layer.element.classList.remove("sr-reveal");
      layer.revealRemoveAt = 0;
      revealCleanup.delete(layer);
    }
  }
  function clearRevealCleanup() {
    revealCleanup.forEach(layer => {
      layer.element.classList.remove("sr-reveal");
      layer.revealRemoveAt = 0;
    });
    revealCleanup.clear();
  }
  function tick(now) {
    if (destroyed) return;
    const dt = lastTime
      ? Math.min((now - lastTime) / 1000, 0.05)
      : 0.016;
    lastTime = now;
    updateRevealCleanup(now);
    // Wait for page load and fonts, with a 1.2s font cap.
    if (phase === "collecting") {
      if (!fontsWaitStarted) fontsWaitStarted = now;
      if (
        loadReady &&
        (fontsReady || now - fontsWaitStarted >= 1200)
      ) {
        collectPage();
      }
    }
    else if (phase === "scan") {
      const elapsed = now - scanStartedAt;
      const scanDuration = 1900 / speed;
      updateScanAgents(now);
      updateHud();
      if (elapsed >= scanDuration) {
        startBuild();
      }
    }
    else if (phase === "build") {
      checkTriggers(now);
      let working = 0;
      // READ: update all active task rects before style writes.
      agents.forEach(agent => {
        if (agent.task) {
          agent.task.liveRect = getLayerRect(agent.task.layer);
        }
      });
      // Assign available layers.
      agents.forEach(agent => {
        if (agent.task) return;
        const layer = pickLayer(agent);
        if (layer) {
          assignTask(agent, layer, now);
        }
      });
      // WRITE: task animations and wandering.
      agents.forEach(agent => {
        if (agent.task) {
          working++;
          updateTask(agent, dt, now);
        } else {
          wander(agent, dt, now);
        }
      });
      guideTarget = working > 0 ? 1 : 0;
      if (working > 0) {
        lastAgentWorking = now;
      } else if (now - lastAgentWorking < 1200) {
        guideTarget = 1;
      }
      guideOpacity += (
        guideTarget - guideOpacity
      ) * (1 - Math.exp(-5 * dt));
      drawGuides(now);
      updateTour(dt);
      updateHud();
      if (completedCount >= layers.length) {
        finishBuild();
      }
    }
    else if (phase === "done") {
      if (exitState) {
        updateExit(now);
      } else {
        agents.forEach(agent => {
          if (!agent.task && agent.element.style.display !== "none") {
            wander(agent, dt, now);
          }
        });
      }
      guideTarget = 0;
      guideOpacity += (
        guideTarget - guideOpacity
      ) * (1 - Math.exp(-4 * dt));
      drawGuides(now);
    }
    raf = requestAnimationFrame(tick);
  }
  // --------------------------------------------------
  // INITIALIZE
  // --------------------------------------------------
  resizeCanvas();
  if (loadReady) {
    // load has already fired
  }
  raf = requestAnimationFrame(tick);
  // --------------------------------------------------
  // PUBLIC API
  // --------------------------------------------------
  window.SwarmRebuild = {
    replay,
    skip,
    setSpeed,
    tour: startTour,
    layers
  };
})();

