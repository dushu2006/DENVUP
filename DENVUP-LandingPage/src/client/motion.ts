import { on, prefersReduced, clamp, throttle } from './env';

/* ------------------------------------------------------------------- loader */

export function initLoader(): void {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const status = loader.querySelector<HTMLElement>('[data-loader-status]');
  const pct = loader.querySelector<HTMLElement>('[data-loader-pct]');
  const bar = loader.querySelector<HTMLElement>('[data-loader-bar]');
  const skip = loader.querySelector<HTMLButtonElement>('[data-loader-skip]');

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    loader.classList.add('is-done');
    window.setTimeout(() => {
      loader.hidden = true;
    }, prefersReduced() ? 120 : 900);
    document.documentElement.classList.add('is-ready');
  };

  skip?.addEventListener('click', close);
  loader.hidden = false;

  if (prefersReduced()) {
    if (status) status.textContent = 'Ready';
    if (pct) pct.textContent = '100%';
    if (bar) bar.style.width = '100%';
    window.setTimeout(close, 220);
    return;
  }

  let progress = 0;
  let done = false;
  const started = performance.now();
  const tick = () => {
    const target = done ? 100 : Math.min(88, 12 + (performance.now() - started) / 26);
    progress += (target - progress) * 0.16;
    if (bar) bar.style.width = `${progress.toFixed(1)}%`;
    if (pct) pct.textContent = `${Math.round(progress)}%`;
    if (progress < 99.5) requestAnimationFrame(tick);
    else close();
  };
  requestAnimationFrame(tick);

  const finish = () => {
    done = true;
    if (status) status.textContent = 'Ready';
  };
  Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((resolve) => window.setTimeout(resolve, 1800)),
  ]).then(finish);
  window.setTimeout(finish, 2600);
}

/* --------------------------------------------------------------- word split */

function splitBeatWords(el: HTMLElement): void {
  if (el.dataset.split === 'true') return;
  const text = el.textContent ?? '';
  el.dataset.split = 'true';
  el.setAttribute('aria-label', text);
  el.textContent = '';
  const words = text.split(/\s+/).filter(Boolean);
  words.forEach((word, i) => {
    const outer = document.createElement('span');
    outer.className = 'word';
    outer.setAttribute('aria-hidden', 'true');
    const inner = document.createElement('span');
    inner.textContent = word;
    outer.append(inner);
    el.append(outer);
    if (i < words.length - 1) el.append(document.createTextNode(' '));
  });
}

/* ------------------------------------------------------------------ reveals */

function initReveals(): void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const beats = [...document.querySelectorAll<HTMLElement>('[data-beat]')];
  const principles = [...document.querySelectorAll<HTMLElement>('[data-principle]')];
  beats.forEach((beat) => {
    const line = beat.querySelector<HTMLElement>('[data-beat-line]');
    if (line) splitBeatWords(line);
  });

  if (prefersReduced()) {
    [...targets, ...beats, ...principles].forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
  );
  [...targets, ...beats, ...principles].forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------- gate */

function initGate(): void {
  const gate = document.getElementById('gate');
  const stage = gate?.querySelector<HTMLElement>('[data-gate-stage]');
  const num = gate?.querySelector<HTMLElement>('[data-gate-num]');
  if (!gate || !stage) return;

  const update = () => {
    const rect = gate.getBoundingClientRect();
    const total = Math.max(1, gate.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / total);
    gate.style.setProperty('--p', p.toFixed(4));
    if (num) num.textContent = String(Math.round(p * 100)).padStart(2, '0');
    stage.classList.toggle('is-near', rect.top < window.innerHeight && rect.bottom > 0);
  };

  on(window, 'scroll', throttle(update, 12), { passive: true });
  on(window, 'resize', throttle(update, 120));
  update();
}

/* ----------------------------------------------------------------- identity */

function initIdentity(): void {
  const section = document.getElementById('identity');
  if (!section) return;
  const wipe = section.querySelector<HTMLElement>('[data-identity-wipe]');
  const black = section.querySelector<HTMLElement>('.identity__mark--black');
  const white = section.querySelector<HTMLElement>('.identity__mark--white');
  const colour = section.querySelector<HTMLElement>('.identity__mark--colour');
  if (!wipe || !black || !white || !colour) return;

  if (prefersReduced()) {
    wipe.style.transform = 'translateX(-101%)';
    black.style.opacity = '0';
    white.style.opacity = '0';
    colour.style.opacity = '1';
    return;
  }

  const update = () => {
    const rect = section.getBoundingClientRect();
    const p = clamp((window.innerHeight * 0.8 - rect.top) / (window.innerHeight * 0.9));
    wipe.style.transform = `translateX(${(-101 + p * 202).toFixed(1)}%)`;
    const showBlack = p > 0.22 && p <= 0.58 ? 1 : 0;
    const showWhite = p > 0.58 ? 1 : 0;
    black.style.opacity = String(showBlack);
    white.style.opacity = String(showWhite);
    colour.style.opacity = String(showBlack || showWhite ? 0 : 1);
  };

  on(window, 'scroll', throttle(update, 12), { passive: true });
  update();
}

/* -------------------------------------------------------- horizontal stories */

interface Horizontal {
  section: HTMLElement;
  pin: HTMLElement;
  rail: HTMLElement;
  min: number;
  distance: number;
}

function initHorizontal(): void {
  const pins = [...document.querySelectorAll<HTMLElement>('[data-horizontal]')];
  const items: Horizontal[] = [];

  const measure = () => {
    items.forEach((item) => {
      if (!item.section.classList.contains('is-horizontal')) return;
      const rail = item.rail;
      item.distance = Math.max(0, rail.scrollWidth - item.pin.clientWidth + 48);
      item.section.style.setProperty('--h-height', `${Math.round(window.innerHeight + item.distance)}px`);
    });
  };

  const update = () => {
    items.forEach((item) => {
      if (!item.section.classList.contains('is-horizontal')) return;
      const rect = item.section.getBoundingClientRect();
      const total = Math.max(1, item.section.offsetHeight - window.innerHeight);
      const p = clamp(-rect.top / total);
      item.rail.style.setProperty('--rail-x', `${Math.round(-item.distance * p)}px`);
      const meter = item.section.querySelector<HTMLElement>('[data-rail-meter]');
      if (meter) meter.style.transform = `scaleX(${p.toFixed(3)})`;
    });
  };

  const layout = () => {
    pins.forEach((pin) => {
      const section = pin.parentElement;
      if (!section) return;
      const min = Number(pin.dataset.horizontalMin ?? 900);
      const enabled = window.innerWidth >= min && !prefersReduced();
      section.classList.toggle('is-horizontal', enabled);
      if (!enabled) section.style.removeProperty('--h-height');
    });
    measure();
    update();
  };

  pins.forEach((pin) => {
    const section = pin.parentElement;
    const rail = pin.querySelector<HTMLElement>('[data-rail]') ?? pin.querySelector<HTMLElement>('.process__track');
    if (!section || !rail) return;
    items.push({ section, pin, rail, min: Number(pin.dataset.horizontalMin ?? 900), distance: 0 });
  });

  layout();
  const relayout = throttle(layout, 160);
  on(window, 'resize', relayout);
  on(window, 'scroll', throttle(update, 12), { passive: true });
  if (document.fonts?.ready) void document.fonts.ready.then(() => relayout());
}

/* ------------------------------------------------------------------ process */

function initStages(): void {
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-stage-button]')];
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls') ?? '');
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (panel) panel.hidden = open;
      btn.closest('.stage')?.classList.toggle('is-active', !open);
    });
  });
}

function initProcessLine(): void {
  const line = document.querySelector<SVGPathElement>('[data-process-line]');
  const section = document.getElementById('process');
  if (!line || !section) return;
  const update = () => {
    const rect = section.getBoundingClientRect();
    const p = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight * 0.2));
    line.style.strokeDashoffset = String(1 - p);
  };
  on(window, 'scroll', throttle(update, 16), { passive: true });
  update();
}

/* --------------------------------------------------------------------- hero */

function initHero(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  const orbit = document.querySelector<HTMLElement>('[data-hero-orbit]');
  if (!canvas || !orbit) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let raf = 0;
  const dots = Array.from({ length: 26 }, (_, i) => ({
    angle: (i / 26) * Math.PI * 2,
    radius: 0.28 + (i % 5) * 0.06,
    speed: 0.00006 + (i % 3) * 0.00003,
    size: 1 + (i % 3),
  }));

  const resize = () => {
    const rect = orbit.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const base = Math.min(w, h);
    ctx.strokeStyle = 'rgba(11,10,9,0.22)';
    ctx.lineWidth = 1;
    for (let ring = 0; ring < 3; ring++) {
      ctx.beginPath();
      ctx.arc(cx, cy, base * (0.16 + ring * 0.08), time * 0.00008 + ring, time * 0.00008 + ring + Math.PI * 1.5);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(11,10,9,0.6)';
    for (const dot of dots) {
      const a = dot.angle + time * dot.speed;
      const r = base * dot.radius;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.92, dot.size, 0, Math.PI * 2);
      ctx.fill();
    }
    const sat = document.querySelector<HTMLElement>('[data-hero-satellite]');
    if (sat && !prefersReduced()) {
      const a = time * 0.0004;
      sat.style.left = `${50 + Math.cos(a) * 44}%`;
      sat.style.top = `${50 + Math.sin(a) * 44}%`;
      sat.style.translate = '-50% -50%';
    }
  };

  const loop = (time: number) => {
    if (!prefersReduced()) {
      draw(time);
      raf = requestAnimationFrame(loop);
    }
  };

  resize();
  draw(0);
  if (!prefersReduced()) raf = requestAnimationFrame(loop);

  on(window, 'resize', throttle(() => {
    resize();
    draw(performance.now());
  }, 140));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (!prefersReduced()) raf = requestAnimationFrame(loop);
  });
}

/* --------------------------------------------------------------- capabilities */

function initCapabilityRail(): void {
  const rail = document.querySelector<HTMLElement>('.capabilities__rail');
  const prev = document.querySelector<HTMLButtonElement>('[data-cap-prev]');
  const next = document.querySelector<HTMLButtonElement>('[data-cap-next]');
  const count = document.querySelector<HTMLElement>('[data-cap-count]');
  if (!rail) return;

  const step = () => {
    const card = rail.querySelector<HTMLElement>('.cap');
    if (!card) return 320;
    const gap = Number.parseFloat(getComputedStyle(rail).columnGap || '16') || 16;
    return card.getBoundingClientRect().width + gap;
  };

  prev?.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

  const update = throttle(() => {
    if (count) {
      const index = Math.round(rail.scrollLeft / step()) + 1;
      count.textContent = String(Math.min(9, Math.max(1, index))).padStart(2, '0');
    }
  }, 80);
  on(rail, 'scroll', update, { passive: true });
}

/* -------------------------------------------------------------------- atlas */

function initAtlas(): void {
  const nodes = [...document.querySelectorAll<HTMLButtonElement>('[data-tech-node]')];
  const name = document.querySelector<HTMLElement>('[data-tech-name]');
  const role = document.querySelector<HTMLElement>('[data-tech-role]');
  const note = document.querySelector<HTMLElement>('[data-tech-note]');
  if (!nodes.length || !name || !role || !note) return;

  const data = nodes.map((node) => ({
    name: node.getAttribute('aria-label')?.split(' — ')[0] ?? '',
  }));

  const select = (index: number) => {
    const node = nodes[index];
    if (!node) return;
    const label = node.getAttribute('aria-label') ?? '';
    const [tech, techRole] = label.split(' — ');
    name.textContent = tech ?? data[index]?.name ?? '';
    role.textContent = techRole ?? '';
    const listItem = node.querySelector('.tech-list__role');
    note.textContent = listItem ? listItem.textContent : 'Used in this build.';
    nodes.forEach((n, i) => {
      n.classList.toggle('is-active', i === index);
      if (n.classList.contains('tech-node')) n.setAttribute('aria-pressed', String(i === index));
    });
  };

  nodes.forEach((node, index) => {
    node.addEventListener('click', () => select(index));
    node.addEventListener('focus', () => select(index));
  });
  select(0);
}

export function initMotion(): void {
  initLoader();
  initReveals();
  initGate();
  initIdentity();
  initHorizontal();
  initStages();
  initProcessLine();
  initHero();
  initCapabilityRail();
  initAtlas();
}
