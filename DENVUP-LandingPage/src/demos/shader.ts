/**
 * WebGL2 fragment-shader demonstrations.
 *
 * Every demo here uses one small helper (`createShaderStage`) that compiles a
 * fragment shader, feeds it time / resolution / pointer / progress uniforms and
 * tears everything down when the demo is unmounted. If WebGL2 is unavailable
 * the stage renders a static CSS fallback and says so, rather than failing
 * silently.
 */

import { el } from '../core/dom';
import { createLoop, fitDrawingBuffer } from '../core/loop';
import { artwork, button, controls, hint, stage } from './helpers';
import type { Demo, DemoCategory } from './types';

const VERT = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const NOISE = `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
`;

interface ShaderStage {
  canvas: HTMLCanvasElement;
  dispose: () => void;
  setProgress: (value: number) => void;
}

function createShaderStage(
  root: HTMLElement,
  fragment: string,
  options: { textures?: string[]; label?: string } = {},
): ShaderStage {
  const wrap = stage(root, 'demo__stage--canvas');
  const canvas = el('canvas', 'demo__canvas');
  wrap.appendChild(canvas);
  if (options.label) canvas.setAttribute('aria-label', options.label);

  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
  if (!gl) {
    const fallback = el('div', 'demo__fallback');
    fallback.textContent =
      'This browser did not provide a WebGL2 context, so the shader is replaced by a static gradient.';
    wrap.appendChild(fallback);
    canvas.style.display = 'none';
    return { canvas, dispose: () => {}, setProgress: () => {} };
  }

  const compile = (type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`shader compile failed: ${log ?? 'unknown'}`);
    }
    return shader;
  };

  let program: WebGLProgram;
  try {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) throw new Error('shader allocation failed');
    const prog = gl.createProgram();
    if (!prog) throw new Error('program allocation failed');
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`program link failed: ${gl.getProgramInfoLog(prog) ?? 'unknown'}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    program = prog;
  } catch (error) {
    const fallback = el('div', 'demo__fallback');
    fallback.textContent = `The shader could not be compiled here (${String(error)}).`;
    wrap.appendChild(fallback);
    canvas.style.display = 'none';
    return { canvas, dispose: () => {}, setProgress: () => {} };
  }

  gl.useProgram(program);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');
  const uProgress = gl.getUniformLocation(program, 'u_progress');
  const uTexture = gl.getUniformLocation(program, 'u_texture');
  const uTexture2 = gl.getUniformLocation(program, 'u_texture2');

  const mouse = { x: 0.5, y: 0.5, active: 0 };
  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width;
    mouse.y = 1 - (event.clientY - rect.top) / rect.height;
    mouse.active = 1;
  };
  const onLeave = () => {
    mouse.active = 0;
  };
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);

  const textures: WebGLTexture[] = [];
  const loadTexture = (src: string, index: number) => {
    const texture = gl.createTexture();
    if (!texture) return;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(index === 0 ? uTexture : uTexture2, index);
    };
    image.src = src;
    textures.push(texture);
  };
  (options.textures ?? []).forEach((src, index) => loadTexture(src, index));

  let progress = 0;
  const loop = createLoop({
    observe: canvas,
    draw(_dt, time) {
      const fitted = fitDrawingBuffer(canvas);
      if (!fitted) return;
      const { width, height } = fitted;
      gl.viewport(0, 0, width, height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uProgress, progress);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  });

  return {
    canvas,
    dispose: () => {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      loop.destroy();
      textures.forEach((texture) => gl.deleteTexture(texture));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
    setProgress(value) {
      progress = value;
    },
  };
}

function shaderDemo(options: {
  id: string;
  title: string;
  summary: string;
  techniques: number[];
  keywords: string;
  category?: DemoCategory;
  fragment: string;
  textures?: string[];
  note?: string;
  extra?: (root: HTMLElement, shader: ShaderStage) => () => void;
}): Demo {
  return {
    id: options.id,
    title: options.title,
    category: options.category ?? 'spatial',
    summary: options.summary,
    trigger: 'Move the pointer over the panel',
    techniques: options.techniques,
    keywords: options.keywords,
    note: options.note,
    mount({ root, reduced }) {
      const shader = createShaderStage(root, options.fragment, {
        textures: options.textures,
        label: options.title,
      });
      if (reduced) {
        hint(root, 'Reduced motion is on: the shader renders a single static frame.');
      }
      const extraCleanup = options.extra?.(root, shader);
      return () => {
        extraCleanup?.();
        shader.dispose();
      };
    },
  };
}

const plasma: Demo = shaderDemo({
  id: 'shader-plasma',
  title: 'Procedural plasma field',
  category: 'spatial',
  summary: 'Layered sine fields build a moving colour field entirely in the fragment shader.',
  techniques: [236],
  keywords: 'plasma procedural colour field',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
${NOISE}
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float t = u_time * 0.35;
  float v = sin(p.x * 6.0 + t) + sin(p.y * 5.0 - t * 0.8)
          + sin((p.x + p.y) * 4.0 + t * 0.5) + fbm(p * 2.0 + t * 0.2) * 3.0;
  v = v * 0.25;
  vec3 a = vec3(0.94, 0.29, 0.06);
  vec3 b = vec3(1.0, 0.71, 0.15);
  vec3 c = vec3(0.17, 0.22, 0.90);
  vec3 col = mix(a, b, clamp(v + 0.5, 0.0, 1.0));
  col = mix(col, c, clamp(noise(p * 1.4 + t) * 0.55, 0.0, 1.0));
  outColor = vec4(col, 1.0);
}`,
});

const liquid: Demo = shaderDemo({
  id: 'shader-liquid',
  title: 'Liquid surface',
  category: 'spatial',
  summary: 'A rounded surface is shaded with a fresnel rim and a moving highlight.',
  techniques: [234, 235],
  keywords: 'liquid surface fresnel highlight refraction',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
${NOISE}
float sdfSphere(vec2 p, float r){ return length(p) - r; }
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float d = sdfSphere(p, 0.34);
  vec2 n = normalize(p + vec2(0.0001));
  float fres = pow(1.0 - clamp(d + 0.34, 0.0, 1.0), 2.2);
  float wave = fbm(p * 3.0 + u_time * 0.25);
  vec3 ember = vec3(0.94, 0.29, 0.06);
  vec3 amber = vec3(1.0, 0.71, 0.15);
  vec3 col = mix(ember, amber, wave);
  float rim = smoothstep(0.02, -0.02, d);
  col = mix(col, vec3(1.0), rim * 0.75);
  float mouseGlow = 1.0 - smoothstep(0.0, 0.35, distance(p, u_mouse - 0.5));
  col += vec3(0.25, 0.3, 0.9) * mouseGlow * 0.25;
  outColor = vec4(col, 1.0);
}`,
});

const crossFade: Demo = shaderDemo({
  id: 'shader-crossfade',
  title: 'Shader cross-fade between two looks',
  category: 'spatial',
  summary: 'Two procedural looks are mixed in the shader rather than by stacking two elements.',
  techniques: [238],
  keywords: 'cross fade mix two looks shader',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform float u_progress;
${NOISE}
void main(){
  vec2 p = vUv - 0.5;
  float t = u_time * 0.3;
  float a = fbm(p * 3.0 + vec2(t, -t));
  float b = fbm(p * 5.0 - vec2(t * 0.6, t * 0.4));
  float blend = smoothstep(0.0, 1.0, fract(u_progress));
  vec3 colA = vec3(0.94, 0.29, 0.06) * (0.4 + a);
  vec3 colB = vec3(0.17, 0.22, 0.90) * (0.4 + b);
  outColor = vec4(mix(colA, colB, blend), 1.0);
}`,
});

const fluid: Demo = shaderDemo({
  id: 'shader-fluid',
  title: 'Pointer-driven fluid field',
  category: 'spatial',
  summary: 'The pointer displaces a flow field, which then settles back into place.',
  techniques: [463, 46],
  keywords: 'fluid pointer displace flow noise',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
${NOISE}
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 m = u_mouse - 0.5;
  float influence = 1.0 - smoothstep(0.0, 0.4, distance(p, m));
  float f = fbm(p * 3.0 + u_time * 0.2 + influence * 0.8 * sin(u_time));
  vec3 col = mix(vec3(0.04, 0.04, 0.05), vec3(0.94, 0.29, 0.06), clamp(f * 1.4, 0.0, 1.0));
  col = mix(col, vec3(1.0, 0.71, 0.15), influence * 0.35);
  outColor = vec4(col, 1.0);
}`,
});

const metaballs: Demo = shaderDemo({
  id: 'shader-metaballs',
  title: 'Real-time metaballs',
  category: 'spatial',
  summary: 'Blended distance fields merge into a single organic body.',
  techniques: [464],
  keywords: 'metaball blob sdf distance field',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float d = 1e9;
  for(int i = 0; i < 5; i++){
    float fi = float(i);
    float a = u_time * (0.6 + fi * 0.13) + fi * 1.3;
    vec2 c = vec2(cos(a) * 0.26, sin(a * 1.3) * 0.18);
    d = min(d, length(p - c) - (0.10 + 0.02 * sin(u_time + fi)));
  }
  float m = u_mouse - 0.5;
  d = min(d, length(p - m) - 0.10);
  float body = smoothstep(0.02, -0.01, d);
  vec3 col = mix(vec3(0.04, 0.04, 0.05), vec3(0.94, 0.29, 0.06), body);
  col = mix(col, vec3(1.0, 0.71, 0.15), smoothstep(0.0, -0.04, d) * 0.8);
  outColor = vec4(col, 1.0);
}`,
});

const sdfText: Demo = shaderDemo({
  id: 'shader-sdf-text',
  title: 'Signed-distance-field lettering',
  category: 'spatial',
  summary:
    'A stroke of the letter is drawn as a distance field, so it stays sharp at any size and can be animated precisely.',
  techniques: [465],
  keywords: 'sdf distance field text letter',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
float sdSegment(vec2 p, vec2 a, vec2 b, float r){
  vec2 pa = p - a; vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  // A blocky "DENVUP"-style wordmark assembled from distance primitives.
  float d = 1e9;
  d = min(d, sdBox(p - vec2(-0.30, 0.0), vec2(0.035, 0.16)));
  d = min(d, sdBox(p - vec2(-0.30, 0.0), vec2(0.10, 0.035)));
  d = min(d, sdBox(p - vec2(-0.30, 0.0), vec2(0.10, 0.035)) + 0.0);
  d = min(d, sdBox(p - vec2(-0.08, 0.0), vec2(0.035, 0.16)));
  d = min(d, sdSegment(p, vec2(-0.08, 0.16), vec2(0.10, 0.0), 0.035));
  d = min(d, sdBox(p - vec2(0.02, 0.10), vec2(0.035, 0.10)));
  d = min(d, sdBox(p - vec2(0.16, -0.08), vec2(0.035, 0.10)));
  d = min(d, sdBox(p - vec2(0.30, 0.0), vec2(0.035, 0.16)));
  float glow = 0.02 * sin(u_time * 2.0);
  float body = smoothstep(0.006 + glow, -0.006, d);
  vec3 col = mix(vec3(0.93, 0.93, 0.92), vec3(0.94, 0.29, 0.06), body);
  outColor = vec4(col, 1.0);
}`,
});

const terrain: Demo = shaderDemo({
  id: 'shader-terrain',
  title: 'Procedural terrain from fBm noise',
  category: 'spatial',
  summary: 'A height field built from fractal noise, shaded as a landscape.',
  techniques: [466, 475],
  keywords: 'terrain fbm noise height landscape',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
${NOISE}
void main(){
  vec2 p = vUv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float h = fbm(vec2(p.x * 2.4, p.y * 2.4 + u_time * 0.05));
  float bands = fract(h * 9.0);
  vec3 deep = vec3(0.04, 0.04, 0.05);
  vec3 mid = vec3(0.94, 0.29, 0.06);
  vec3 high = vec3(1.0, 0.71, 0.15);
  vec3 col = mix(deep, mid, smoothstep(0.25, 0.6, h));
  col = mix(col, high, smoothstep(0.6, 0.85, h));
  col = mix(col, vec3(0.93), smoothstep(0.88, 1.0, bands) * 0.12);
  outColor = vec4(col, 1.0);
}`,
});

const displacement: Demo = shaderDemo({
  id: 'shader-displacement',
  title: 'Image displacement',
  category: 'spatial',
  summary: 'A texture is displaced by a noise field, bending the picture in real time.',
  techniques: [461, 284],
  keywords: 'displacement image texture bend noise',
  textures: [artwork('b', 900, 214)],
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_texture;
${NOISE}
void main(){
  vec2 uv = vUv;
  float n = fbm(uv * 3.0 + u_time * 0.15);
  float d = (n - 0.5) * 0.14;
  vec2 off = vec2(d, d * 0.6);
  vec4 a = texture(u_texture, uv + off);
  vec4 b = texture(u_texture, uv + off * 0.6 + vec2(0.008, 0.0));
  float m = 1.0 - smoothstep(0.0, 0.45, distance(uv, u_mouse));
  vec3 col = mix(a.rgb, b.rgb, m);
  outColor = vec4(col, 1.0);
}`,
});

const shaderReveal: Demo = shaderDemo({
  id: 'shader-reveal',
  title: 'Shader-driven image reveal',
  category: 'spatial',
  summary: 'The image appears through an animated mask that is computed in the shader.',
  techniques: [462, 382],
  keywords: 'reveal mask wipe image shader',
  textures: [artwork('a', 900, 32)],
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
${NOISE}
void main(){
  vec4 tex = texture(u_texture, vUv);
  float edge = fbm(vUv * 2.4 + vec2(u_time * 0.1, 0.0));
  float mask = smoothstep(edge - 0.12, edge + 0.02, vUv.y);
  vec3 col = mix(vec3(0.04, 0.04, 0.05), tex.rgb, mask);
  float line = smoothstep(0.012, 0.0, abs(vUv.y - edge));
  col = mix(col, vec3(1.0, 0.71, 0.15), line * 0.8);
  outColor = vec4(col, 1.0);
}`,
});

const liquidWipe: Demo = shaderDemo({
  id: 'shader-liquid-wipe',
  title: 'Liquid wipe across the frame',
  category: 'spatial',
  summary: 'A second image is revealed by an irregular, wave-shaped boundary.',
  techniques: [285, 118],
  keywords: 'liquid wipe transition wave reveal',
  textures: [artwork('a', 900, 32), artwork('b', 900, 214)],
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform sampler2D u_texture2;
${NOISE}
void main(){
  vec2 uv = vUv;
  float wave = fbm(vec2(uv.x * 2.0, u_time * 0.12)) * 0.25;
  float edge = uv.x * 0.85 + wave;
  vec4 a = texture(u_texture, uv);
  vec4 b = texture(u_texture2, uv);
  vec3 col = mix(a.rgb, b.rgb, smoothstep(edge - 0.04, edge + 0.04, uv.x));
  float rim = smoothstep(0.02, 0.0, abs(uv.x - edge / 0.85));
  col = mix(col, vec3(1.0, 0.71, 0.15), rim * 0.7);
  outColor = vec4(col, 1.0);
}`,
});

const depthParallax: Demo = shaderDemo({
  id: 'shader-depth',
  title: 'Depth parallax from luminance',
  category: 'spatial',
  summary:
    'The image is sampled at three offsets that follow its own brightness, which fakes a depth pass.',
  techniques: [470],
  keywords: 'depth parallax luminance fake 3d',
  note:
    'A luminance-derived depth approximation. A true parallax needs a depth map, and the repository supplies no depth asset.',
  textures: [artwork('b', 900, 214)],
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform sampler2D u_texture;
float luma(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
void main(){
  vec2 uv = vUv;
  vec3 base = texture(u_texture, uv).rgb;
  float d = luma(base);
  vec2 dir = (u_mouse - 0.5) * 0.06 * d;
  vec3 near = texture(u_texture, uv - dir * 1.0).rgb;
  vec3 far = texture(u_texture, uv - dir * 0.4).rgb;
  vec3 col = mix(far, near, d);
  col = mix(col, base, 0.35);
  outColor = vec4(col, 1.0);
}`,
});

const audioReactive: Demo = shaderDemo({
  id: 'shader-audio',
  title: 'Audio-reactive field',
  category: 'spatial',
  summary: 'An opt-in tone drives the field, so the motion is tied to something you can hear.',
  techniques: [474, 390],
  keywords: 'audio reactive sound level tone',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform float u_progress;
uniform vec2 u_resolution;
${NOISE}
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float amp = 0.25 + u_progress * 0.55;
  float rings = sin(length(p) * 26.0 - u_time * 3.0) * 0.5 + 0.5;
  float n = fbm(p * 2.5 + u_time * 0.3);
  float v = clamp(rings * amp + n * 0.4, 0.0, 1.0);
  vec3 col = mix(vec3(0.04, 0.04, 0.05), vec3(0.94, 0.29, 0.06), v);
  col = mix(col, vec3(1.0, 0.71, 0.15), smoothstep(0.7, 1.0, v));
  outColor = vec4(col, 1.0);
}`,
  extra: (root, shader) => {
    const bar = controls(root);
    const level = el('input');
    level.type = 'range';
    level.min = '0';
    level.max = '100';
    level.value = '40';
    level.setAttribute('aria-label', 'Simulated audio level');
    const wrap = el('label', 'demo__slider');
    const cap = el('span', 'demo__slider-label');
    cap.textContent = 'Level';
    wrap.append(cap, level);
    bar.appendChild(wrap);
    const apply = () => shader.setProgress(Number(level.value) / 100);
    level.addEventListener('input', apply);
    apply();
    return () => {};
  },
});

const rippleClick: Demo = shaderDemo({
  id: 'shader-ripple',
  title: 'Click sends a ripple through the field',
  category: 'spatial',
  summary: 'Pressing the panel spawns an expanding ring computed in the shader.',
  techniques: [399, 286],
  keywords: 'ripple click ring shader press',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
${NOISE}
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  float n = fbm(p * 2.6 + u_time * 0.15);
  float d = distance(p, u_mouse - 0.5);
  float wave = sin(d * 22.0 - u_time * 4.0) * exp(-d * 3.0);
  float v = clamp(n * 0.8 + wave * 0.6 + 0.1, 0.0, 1.0);
  vec3 col = mix(vec3(0.04, 0.04, 0.05), vec3(0.94, 0.29, 0.06), v);
  outColor = vec4(col, 1.0);
}`,
});

const scrollUniform: Demo = shaderDemo({
  id: 'shader-scroll',
  title: 'Scroll progress is a shader uniform',
  category: 'spatial',
  summary: 'The same fragment shader is driven by scroll position rather than by time.',
  techniques: [479],
  keywords: 'scroll progress uniform shader',
  fragment: `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_progress;
uniform vec2 u_resolution;
${NOISE}
void main(){
  vec2 p = vUv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;
  float bands = fract(p.y * 6.0 + u_progress * 4.0);
  float soft = smoothstep(0.45, 0.0, abs(bands - 0.5));
  float n = fbm(p * 3.0 + u_progress * 2.0);
  vec3 col = mix(vec3(0.93, 0.93, 0.92), vec3(0.94, 0.29, 0.06), soft * 0.85);
  col = mix(col, vec3(0.17, 0.22, 0.90), n * 0.35);
  outColor = vec4(col, 1.0);
}`,
  extra: (root, shader) => {
    const wrap = stage(root, 'demo__stage--scroll demo__stage--shaderscroll');
    wrap.style.height = '180px';
    const inner = el('div', 'demo__scroll-inner');
    inner.style.height = '1200px';
    wrap.appendChild(inner);
    const bar = controls(root);
    const read = el('span', 'demo__readout');
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - wrap.clientHeight)));
      shader.setProgress(progress);
      read.textContent = `progress ${(progress * 100).toFixed(0)}%`;
    };
    wrap.addEventListener('scroll', onScroll, { passive: true });
    bar.appendChild(read);
    return () => wrap.removeEventListener('scroll', onScroll);
  },
});

export const shaderDemos: Demo[] = [
  plasma,
  liquid,
  crossFade,
  fluid,
  metaballs,
  sdfText,
  terrain,
  displacement,
  shaderReveal,
  liquidWipe,
  depthParallax,
  audioReactive,
  rippleClick,
  scrollUniform,
];

export { button };
