import type { Lab } from './types';
import { trackPointer } from './helpers';

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

function shaderScene(ctx: Parameters<NonNullable<import('./types').LabMode['init']>>[0], host: HTMLElement, frag: string): (() => void) | null {
  const canvas = host.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return null;
  const gl = (canvas.getContext('webgl', { antialias: false, alpha: false }) ??
    canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
  if (!gl) {
    host.classList.add('is-fallback');
    return null;
  }
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type);
    if (!sh) return null;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('[threed] shader', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) {
    host.classList.add('is-fallback');
    return null;
  }
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    host.classList.add('is-fallback');
    return null;
  }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uTime = gl.getUniformLocation(program, 'uTime');
  const uRes = gl.getUniformLocation(program, 'uRes');
  const uPointer = gl.getUniformLocation(program, 'uPointer');
  const ptr = trackPointer(ctx, host);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uRes, canvas.width, canvas.height);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const started = performance.now();
  ctx.raf((t) => {
    gl.uniform1f(uTime, ctx.reduced ? 0.35 : (t - started) / 1000);
    gl.uniform2f(uPointer, ptr.x, 1 - ptr.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
  return () => {
    ro.disconnect();
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
  };
}

const FRAG = `precision mediump float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float d = distance(uv, uPointer);
  float ring = smoothstep(0.42, 0.40, abs(d - 0.22));
  float wave = sin(uv.x * 8.0 + uTime * 0.8) * 0.5 + 0.5;
  vec3 ink = vec3(0.043, 0.039, 0.035);
  vec3 orange = vec3(1.0, 0.29, 0.0);
  vec3 col = mix(ink, orange, ring * (0.55 + wave * 0.45));
  gl_FragColor = vec4(col, 1.0);
}`;

export const threedLab: Lab = {
  slug: 'threed',
  title: '3D & WebGL',
  blurb:
    'Depth is a narrative tool, not a decoration. Everything here falls back to a designed flat state, and nothing essential depends on a GPU.',
  modes: [
    {
      ids: [236, 238],
      name: 'A shader with a fallback',
      summary: 'A full-screen fragment shader reacts to the pointer. If WebGL is missing, the same panel becomes a flat orange field with the explanatory caption.',
      html: `<div class="d-shader" data-shader><canvas aria-hidden="true"></canvas><div class="d-shader__copy"><p class="d-cap">Fragment shader · two uniforms, one time value</p><p class="d-shader__fallback">This browser could not start WebGL. The panel is showing its designed flat state.</p></div></div>`,
      init: (ctx) => {
        const host = ctx.stage.querySelector<HTMLElement>('[data-shader]')!;
        return shaderScene(ctx, host, FRAG) ?? undefined;
      },
      notes: { motion: 'Reduced motion freezes the shader at one frame.', touch: 'The field centres when there is no pointer; the copy explains everything.' },
    },
    {
      ids: [226],
      name: 'A card with thickness',
      summary: 'Two faces and four edges are positioned in CSS 3D. The card can be dragged or tilted with the arrow keys; it always returns to a readable angle.',
      html: `<div class="d-cube"><div class="d-cube__scene" data-cube tabindex="0" role="img" aria-label="A three-dimensional card, rotated with the arrow keys"><div class="d-cube__body" data-cube-body><span class="d-cube__face d-cube__face--a">DENVUP</span><span class="d-cube__face d-cube__face--b">concept</span></div></div><p class="d-cap">Arrow keys rotate; drag also works</p></div>`,
      init: ({ stage, reduced, raf }) => {
        const body = stage.querySelector<HTMLElement>('[data-cube-body]')!;
        const holder = stage.querySelector<HTMLElement>('[data-cube]')!;
        let rx = -12;
        let ry = 24;
        let down = false;
        let sx = 0;
        let sy = 0;
        holder.addEventListener('pointerdown', (e) => {
          down = true;
          sx = e.clientX;
          sy = e.clientY;
        });
        window.addEventListener('pointerup', () => {
          down = false;
        });
        holder.addEventListener('pointermove', (e) => {
          if (!down) return;
          ry += (e.clientX - sx) * 0.5;
          rx -= (e.clientY - sy) * 0.5;
          sx = e.clientX;
          sy = e.clientY;
        });
        holder.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft') ry -= 10;
          if (e.key === 'ArrowRight') ry += 10;
          if (e.key === 'ArrowUp') rx -= 10;
          if (e.key === 'ArrowDown') rx += 10;
          if (e.key === 'Home') {
            rx = -12;
            ry = 24;
          }
          e.preventDefault();
        });
        if (reduced) {
          body.style.transform = 'rotateX(-8deg) rotateY(18deg)';
          return;
        }
        raf(() => {
          body.style.transform = `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`;
        });
      },
      notes: { keyboard: 'Arrow keys rotate, Home resets.', motion: 'One fixed angle with no loop.' },
    },
    {
      ids: [227],
      name: 'Depth scene',
      summary: 'Four layers at different depths follow the pointer; the type layer moves least so it stays readable. Drag on touch moves the same layers.',
      html: `<div class="d-depthscene" data-depthscene><span class="d-depthscene__back" aria-hidden="true"></span><span class="d-depthscene__mid" aria-hidden="true"><img src="/assets/brand/logo-white-360.webp" alt="" width="220" height="220" loading="lazy"></span><span class="d-depthscene__front" aria-hidden="true"></span><p>Move, or drag</p></div>`,
      init: (ctx) => {
        const el = ctx.stage.querySelector<HTMLElement>('[data-depthscene]')!;
        const p = trackPointer(ctx);
        ctx.raf(() => {
          const x = (p.x - 0.5) * 2;
          const y = (p.y - 0.5) * 2;
          el.style.setProperty('--dx', String(ctx.reduced ? 0 : x));
          el.style.setProperty('--dy', String(ctx.reduced ? 0 : y));
        });
      },
      notes: { touch: 'Drag to move the layers; the text does not move.', motion: 'Layers align and the type stays still.' },
    },
    {
      ids: [242, 243],
      name: 'A globe of points',
      summary: 'Points on a sphere are projected to 2D by hand, so this is honest about being a projection rather than a 3D engine. It can be paused and rotated with buttons.',
      html: `<div class="d-globe"><canvas data-globe aria-hidden="true"></canvas><div class="d-row"><button type="button" class="d-chip" data-globe-toggle aria-pressed="false">Pause</button><span class="d-cap" data-globe-note>120 points, 2D projection</span></div></div>`,
      init: (ctx) => {
        const canvas = ctx.stage.querySelector<HTMLCanvasElement>('[data-globe]')!;
        const c = canvas.getContext('2d');
        const btn = ctx.stage.querySelector<HTMLButtonElement>('[data-globe-toggle]')!;
        const note = ctx.stage.querySelector<HTMLElement>('[data-globe-note]')!;
        if (!c) return;
        const resize = () => {
          const r = canvas.getBoundingClientRect();
          const dpr = Math.min(devicePixelRatio || 1, 2);
          canvas.width = Math.floor(r.width * dpr);
          canvas.height = Math.floor(r.height * dpr);
          c.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        const pts = Array.from({ length: 120 }, (_, i) => {
          const y = 1 - (i / 119) * 2;
          const r = Math.sqrt(1 - y * y);
          const theta = i * 2.399963229728653;
          return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
        });
        let paused = false;
        let rot = 0;
        btn.addEventListener('click', () => {
          paused = !paused;
          btn.setAttribute('aria-pressed', String(paused));
          btn.textContent = paused ? 'Play' : 'Pause';
          note.textContent = paused ? 'Paused by the button' : '120 points, 2D projection';
        });
        ctx.raf((time) => {
          if (!paused && !ctx.reduced) rot = time / 3400;
          const r = canvas.getBoundingClientRect();
          const w = r.width || 300;
          const h = r.height || 200;
          c.clearRect(0, 0, w, h);
          const cx = w / 2;
          const cy = h / 2;
          const scale = Math.min(w, h) * 0.38;
          pts.forEach((p) => {
            const x = p.x * Math.cos(rot) - p.z * Math.sin(rot);
            const z = p.x * Math.sin(rot) + p.z * Math.cos(rot);
            c.fillStyle = z > 0 ? '#ff4a00' : 'rgba(255,255,255,.28)';
            c.beginPath();
            c.arc(cx + x * scale, cy + p.y * scale, z > 0 ? 1.8 : 1.2, 0, Math.PI * 2);
            c.fill();
          });
          c.strokeStyle = 'rgba(255,255,255,.18)';
          c.beginPath();
          c.arc(cx, cy, scale, 0, Math.PI * 2);
          c.stroke();
        });
        return () => ro.disconnect();
      },
      notes: { keyboard: 'Pause is a button; the caption states it is a 2D projection.', motion: 'The globe holds still.' },
    },
    {
      ids: [244],
      name: 'A tunnel of type',
      summary: 'Repeated words scale and fade to imply a tunnel. The loop is short, pausable and replaced by a static stack under reduced motion.',
      html: `<div class="d-tunnel" data-tunnel>${Array.from({ length: 8 }, (_, i) => `<span style="--i:${i}">DENVUP</span>`).join('')}<button type="button" class="d-chip" data-tunnel-toggle aria-pressed="false">Pause</button></div>`,
      init: ({ stage }) => {
        const tunnel = stage.querySelector<HTMLElement>('[data-tunnel]')!;
        const btn = stage.querySelector<HTMLButtonElement>('[data-tunnel-toggle]')!;
        btn.addEventListener('click', () => {
          const paused = btn.getAttribute('aria-pressed') === 'true';
          btn.setAttribute('aria-pressed', String(!paused));
          btn.textContent = paused ? 'Pause' : 'Play';
          tunnel.classList.toggle('is-paused', !paused);
        });
      },
      notes: { motion: 'Static single word under reduced motion.', keyboard: 'The animation can be paused by button.' },
    },
    {
      ids: [250],
      name: 'Depth from scale',
      summary: 'Three type sizes and three blur amounts imply distance without a camera. The foreground text is the actual sentence; the rest is aria-hidden.',
      html: `<div class="d-depths"><span aria-hidden="true">far</span><span aria-hidden="true">nearer</span><p>Depth can be a hierarchy of size, not a scene.</p><p class="d-cap">The readable sentence is the front layer</p></div>`,
      notes: { motion: 'No animation; the hierarchy is static.' },
    },
  ],
};
