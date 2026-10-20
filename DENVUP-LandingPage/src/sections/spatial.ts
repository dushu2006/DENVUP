/**
 * The spatial lab.
 *
 * Two real-time pieces:
 *
 *  1. A raw WebGL 2 fragment shader that reacts to the pointer.
 *  2. A Three.js object you can drag, with scroll-driven material changes and
 *     annotated hotspots.
 *
 * Three.js is imported dynamically when the section approaches the viewport,
 * and the whole thing falls back to a static panel if WebGL is unavailable or
 * the context is lost.
 */

import { $, announce, el } from '../core/dom';
import { env } from '../core/env';
import { createLoop, fitDrawingBuffer, measureCanvas } from '../core/loop';
import { gsap, ScrollTrigger } from '../core/motion';
import { setCursorMode } from '../core/cursor';

const VERTEX = `#version 300 es
precision highp float;
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
void main(){
  vec2 p = (vUv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
  vec2 m = u_mouse - 0.5;
  float influence = 1.0 - smoothstep(0.0, 0.45, distance(p, m));
  float f = noise(p * 3.0 + u_time * 0.25 + influence);
  f += noise(p * 7.0 - u_time * 0.15) * 0.5;
  float bands = 0.5 + 0.5 * sin(p.x * 6.0 + u_time * 0.8 + f * 3.0);
  vec3 col = mix(vec3(0.04,0.04,0.05), vec3(0.94,0.29,0.06), clamp(f * 0.9, 0.0, 1.0));
  col = mix(col, vec3(1.0,0.71,0.15), bands * 0.28);
  col = mix(col, vec3(0.17,0.22,0.90), influence * 0.35);
  outColor = vec4(col, 1.0);
}`;

function initShaderPanel(): () => void {
  const canvas = $<HTMLCanvasElement>('[data-shader-canvas]');
  if (!canvas) return () => {};
  const note = document.querySelector<HTMLElement>('[data-shader-fallback]');

  const gl = canvas.getContext('webgl2', { antialias: false });
  if (!gl) {
    canvas.style.display = 'none';
    if (note) note.hidden = false;
    return () => {};
  }

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) {
    canvas.style.display = 'none';
    if (note) note.hidden = false;
    return () => {};
  }

  const program = gl.createProgram();
  if (!program) return () => {};
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.style.display = 'none';
    if (note) note.hidden = false;
    return () => {};
  }

  gl.useProgram(program);
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const uTime = gl.getUniformLocation(program, 'u_time');
  const uResolution = gl.getUniformLocation(program, 'u_resolution');
  const uMouse = gl.getUniformLocation(program, 'u_mouse');

  const mouse = { x: 0.5, y: 0.5 };
  const onMove = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (event.clientX - rect.left) / rect.width;
    mouse.y = 1 - (event.clientY - rect.top) / rect.height;
  };
  canvas.addEventListener('pointermove', onMove);

  const onLost = (event: Event) => {
    event.preventDefault();
    canvas.style.display = 'none';
    if (note) note.hidden = false;
  };
  canvas.addEventListener('webglcontextlost', onLost);

  const loop = createLoop({
    observe: canvas,
    draw(_dt, time) {
      const fitted = fitDrawingBuffer(canvas);
      if (!fitted) return;
      gl.viewport(0, 0, fitted.width, fitted.height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uResolution, fitted.width, fitted.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  });

  return () => {
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('webglcontextlost', onLost);
    loop.destroy();
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  };
}

interface Hotspot {
  label: string;
  detail: string;
  position: [number, number, number];
}

const HOTSPOTS: Hotspot[] = [
  {
    label: 'Silhouette',
    detail: 'The same emblem the brand chapter reconstructs from pixels.',
    position: [0, 1.1, 0],
  },
  {
    label: 'Material',
    detail: 'The material changes as you scroll: matte, metal, then glass.',
    position: [1.15, 0.1, 0],
  },
  {
    label: 'Lighting',
    detail: 'A key light and a cool fill, matched to the site palette.',
    position: [-1.1, -0.2, 0.4],
  },
];

function initThreeLab(): () => void {
  const hostElement = $<HTMLElement>('[data-three-stage]');
  if (!hostElement) return () => {};
  const host: HTMLElement = hostElement;

  const fallback = host.querySelector<HTMLElement>('[data-three-fallback]');
  const note = document.querySelector<HTMLElement>('[data-three-note]');
  const section = host.closest<HTMLElement>('.spatial');

  const cleanups: (() => void)[] = [];

  const showFallback = (message: string) => {
    if (fallback) {
      fallback.hidden = false;
      const p = fallback.querySelector('p');
      if (p) p.textContent = message;
    }
    if (note) note.textContent = 'Static poster — WebGL is unavailable.';
  };

  if (!env.webgl) {
    showFallback('3D is not available in this browser — showing the still frame.');
    return () => {};
  }

  // Load Three.js only when the section approaches the viewport.
  const loader = ScrollTrigger.create({
    trigger: section ?? host,
    start: 'top bottom-=200',
    once: true,
    onEnter: () => {
      void mountThree();
    },
  });
  cleanups.push(() => loader.kill());

  async function mountThree(): Promise<void> {
    let THREE: typeof import('three');
    try {
      THREE = await import('three');
    } catch {
      showFallback('The 3D module could not be loaded — showing the still frame.');
      return;
    }

    const canvas = el('canvas', 'three-stage__canvas');
    canvas.setAttribute('role', 'img');
    canvas.setAttribute(
      'aria-label',
      'An interactive three-dimensional object that can be dragged and rotated',
    );
    host.innerHTML = '';
    host.appendChild(canvas);

    let renderer: InstanceType<typeof THREE.WebGLRenderer>;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      showFallback('WebGL could not start — showing the still frame.');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    // threejs-webgl skill: keep the output in sRGB so the ember tone matches
    // the CSS colour field it sits on.
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 16 / 9, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    const key = new THREE.DirectionalLight(0xffd9a8, 2.6);
    key.position.set(2.6, 3.2, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x6f7bff, 1.4);
    fill.position.set(-2.8, -1.2, 1.4);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const group = new THREE.Group();
    scene.add(group);

    const small = window.innerWidth < 768;
    const geometry = new THREE.IcosahedronGeometry(1.15, small ? 1 : 3);
    const material = new THREE.MeshStandardMaterial({
      color: 0xf0490f,
      roughness: 0.42,
      metalness: 0.35,
      flatShading: !small,
    });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);

    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.42, small ? 1 : 2)),
      new THREE.LineBasicMaterial({ color: 0xffb627, transparent: true, opacity: 0.35 }),
    );
    group.add(wire);

    // Environment map for the metallic mode — skipped on small screens.
    let envTexture: InstanceType<typeof THREE.Texture> | null = null;
    if (!small) {
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x1a1a20);
      const envLight = new THREE.DirectionalLight(0xffffff, 2);
      envLight.position.set(3, 4, 2);
      envScene.add(envLight);
      envTexture = pmrem.fromScene(envScene, 0.04).texture;
      scene.environment = envTexture;
      pmrem.dispose();
    }

    // --- hotspots -------------------------------------------------------- //
    const hotspotLayer = el('div', 'three-stage__hotspots');
    host.appendChild(hotspotLayer);
    const hotspotNodes = HOTSPOTS.map((hotspot) => {
      const button = el('button', 'three-hotspot');
      button.type = 'button';
      button.innerHTML = `<span class="three-hotspot__dot" aria-hidden="true"></span><span class="three-hotspot__label">${hotspot.label}</span>`;
      const tip = el('span', 'three-hotspot__tip');
      tip.textContent = hotspot.detail;
      button.appendChild(tip);
      hotspotLayer.appendChild(button);
      return { hotspot, button, vector: new THREE.Vector3(...hotspot.position) };
    });

    /*
     * The hotspot is a button, so it has to do something when it is
     * pressed.
     *
     * It used to reveal its note on hover alone, which meant that on a
     * touch screen — where there is no hover, and where the tap leaves
     * the hover state stuck on some browsers — pressing it did nothing
     * at all. Now the press opens the note and keeps it open, and a
     * second press closes it again. Only one note is open at a time, so
     * the model never ends up with three captions on it.
     */
    hotspotNodes.forEach(({ button, hotspot }) => {
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => {
        const open = !button.classList.contains('is-open');
        hotspotNodes.forEach((node) => {
          node.button.classList.remove('is-open');
          node.button.setAttribute('aria-expanded', 'false');
        });
        if (!open) return;
        button.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        announce(`${hotspot.label}. ${hotspot.detail}`);
      });
    });

    // --- pointer + drag -------------------------------------------------- //
    const pointer = { x: 0, y: 0 };
    const drag = { active: false, lastX: 0, lastY: 0, rotationX: 0.2, rotationY: 0.4 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
      pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      if (!drag.active) return;
      drag.rotationY += (event.clientX - drag.lastX) * 0.008;
      drag.rotationX += (event.clientY - drag.lastY) * 0.006;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
    };
    const onPointerDown = (event: PointerEvent) => {
      drag.active = true;
      drag.lastX = event.clientX;
      drag.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.classList.add('is-dragging');
    };
    const onPointerUp = () => {
      drag.active = false;
      canvas.classList.remove('is-dragging');
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    cleanups.push(() => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    });

    // --- scroll drives the material --------------------------------------- //
    const applyMaterial = (mode: number) => {
      if (mode === 0) {
        material.roughness = 0.85;
        material.metalness = 0.05;
        material.color.setHex(0xf0490f);
        material.transparent = false;
        material.opacity = 1;
        material.envMapIntensity = 0.2;
      } else if (mode === 1) {
        material.roughness = 0.18;
        material.metalness = 0.95;
        material.color.setHex(0xffb627);
        material.transparent = false;
        material.opacity = 1;
        material.envMapIntensity = 1.2;
      } else {
        material.roughness = 0.08;
        material.metalness = 0.1;
        material.color.setHex(0x8fa6ff);
        material.transparent = true;
        material.opacity = 0.55;
        material.envMapIntensity = 1;
      }
      material.needsUpdate = true;
      if (note) {
        note.textContent = ['Matte', 'Metal', 'Glass'][mode] ?? '';
      }
    };
    applyMaterial(0);

    const scrollTrigger = ScrollTrigger.create({
      trigger: section ?? host,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        applyMaterial(Math.min(2, Math.floor(self.progress * 3)));
      },
    });
    cleanups.push(() => scrollTrigger.kill());

    // --- context loss ----------------------------------------------------- //
    const onLost = (event: Event) => {
      event.preventDefault();
      showFallback('The graphics context was lost — showing the still frame.');
    };
    canvas.addEventListener('webglcontextlost', onLost);
    cleanups.push(() => canvas.removeEventListener('webglcontextlost', onLost));

    // --- frame-rate readout ------------------------------------------------ //
    let frames = 0;
    let last = performance.now();
    let fps = 0;
    const readout = el('span', 'spatial__fps');
    host.appendChild(readout);

    const loop = createLoop({
      observe: canvas,
      draw() {
        const fitted = measureCanvas(canvas);
        if (!fitted) return;
        renderer.setSize(fitted.width, fitted.height, false);
        // threejs-webgl skill: the camera aspect has to follow the canvas or
        // the scene stretches after a resize.
        const aspect = fitted.width / Math.max(1, fitted.height);
        if (Math.abs(camera.aspect - aspect) > 0.0005) {
          camera.aspect = aspect;
          camera.updateProjectionMatrix();
        }

        // Scroll position also rotates the object.
        const scrollRotation = (window.scrollY % 4000) / 4000;
        group.rotation.y = drag.rotationY + scrollRotation * Math.PI * 0.6 + pointer.x * 0.4;
        group.rotation.x = drag.rotationX + pointer.y * 0.25;

        // Pointer moves the camera around the scene.
        camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.06;
        camera.position.y += (0.4 - pointer.y * 1.2 - camera.position.y) * 0.06;
        camera.lookAt(0, 0, 0);

        wire.rotation.copy(group.rotation);

        renderer.render(scene, camera);

        // Project the hotspots onto the screen.
        hotspotNodes.forEach(({ button, vector, hotspot }) => {
          const projected = vector.clone().applyMatrix4(group.matrixWorld).project(camera);
          const x = (projected.x * 0.5 + 0.5) * fitted.width;
          const y = (-projected.y * 0.5 + 0.5) * fitted.height;
          button.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
          button.style.opacity = projected.z > 1 ? '0' : '1';
          button.setAttribute('aria-label', `${hotspot.label}: ${hotspot.detail}`);
        });

        frames += 1;
        const now = performance.now();
        if (now - last >= 1000) {
          fps = Math.round((frames * 1000) / (now - last));
          frames = 0;
          last = now;
          readout.textContent = `${fps} fps`;
        }
      },
    });
    cleanups.push(() => loop.destroy());

    cleanups.push(() => {
      geometry.dispose();
      material.dispose();
      wire.geometry.dispose();
      (wire.material as InstanceType<typeof THREE.Material>).dispose();
      envTexture?.dispose();
      renderer.dispose();
    });

    if (fallback) fallback.hidden = true;
  }

  // The lab switches the cursor to a crosshair.
  if (section) {
    setCursorMode('label', 'drag');
    cleanups.push(() => setCursorMode('default'));
  }

  return () => cleanups.forEach((fn) => fn());
}

export function initSpatial(): () => void {
  const cleanups: (() => void)[] = [];
  cleanups.push(initShaderPanel());
  cleanups.push(initThreeLab());
  return () => cleanups.forEach((fn) => fn());
}

export { gsap };
