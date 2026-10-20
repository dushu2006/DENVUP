/**
 * Three.js demonstrations.
 *
 * Three.js is loaded with a dynamic import the first time one of these demos
 * mounts, so the initial page weight stays small. Every scene disposes its
 * geometry, materials, textures and renderer when the demo is torn down.
 */

import { el } from '../core/dom';
import { createLoop, measureCanvas } from '../core/loop';
import { button, controls, hint, stage } from './helpers';
import type { Demo } from './types';

type ThreeModule = typeof import('three');

interface ThreeApi {
  THREE: ThreeModule;
  renderer: InstanceType<ThreeModule['WebGLRenderer']>;
  scene: InstanceType<ThreeModule['Scene']>;
  camera: InstanceType<ThreeModule['PerspectiveCamera']>;
  track: <T extends { dispose: () => void }>(item: T) => T;
  onDispose: (fn: () => void) => void;
}

interface ThreeStage {
  canvas: HTMLCanvasElement;
  /** Resolves with the scene API, or null when WebGL is unavailable. */
  ready: Promise<ThreeApi | null>;
  dispose: () => void;
}

/** Lazily import three and build a renderer + scene scaffold. */
function createThreeStage(
  root: HTMLElement,
  label: string,
  options: { alpha?: boolean; cameraZ?: number } = {},
): ThreeStage {
  const wrap = stage(root, 'demo__stage--canvas');
  const canvas = el('canvas', 'demo__canvas');
  canvas.setAttribute('aria-label', label);
  wrap.appendChild(canvas);

  let disposeScene: (() => void) | null = null;
  let disposed = false;

  const ready = (async (): Promise<ThreeApi | null> => {
    let THREE: ThreeModule;
    try {
      THREE = await import('three');
    } catch {
      const fallback = el('div', 'demo__fallback');
      fallback.textContent =
        'The 3D module could not be loaded in this environment, so a static panel is shown instead.';
      wrap.appendChild(fallback);
      canvas.style.display = 'none';
      return null;
    }
    if (disposed) return null;

    let renderer: InstanceType<ThreeModule['WebGLRenderer']>;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: options.alpha ?? false });
    } catch {
      const fallback = el('div', 'demo__fallback');
      fallback.textContent =
        'This browser did not provide a WebGL context, so a static panel is shown instead.';
      wrap.appendChild(fallback);
      canvas.style.display = 'none';
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0b0b0c, 1);
    // threejs-webgl skill: keep the output in sRGB.
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, options.cameraZ ?? 4.2);

    const key = new THREE.DirectionalLight(0xffd9a8, 2.2);
    key.position.set(2.4, 3, 2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x5a6bff, 1.1);
    fill.position.set(-2.6, -1.4, 1.2);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const disposables: { dispose: () => void }[] = [];
    const api: ThreeApi = {
      THREE,
      renderer,
      scene,
      camera,
      track: <T extends { dispose: () => void }>(item: T): T => {
        disposables.push(item);
        return item;
      },
      onDispose: (fn: () => void) => {
        disposables.push({ dispose: fn });
      },
    };

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
        renderer.render(scene, camera);
      },
    });

    disposeScene = () => {
      loop.destroy();
      disposables.forEach((item) => {
        try {
          item.dispose();
        } catch {
          /* a failed dispose must not break the teardown */
        }
      });
      renderer.dispose();
    };

    return api;
  })();

  return {
    canvas,
    ready,
    dispose: () => {
      disposed = true;
      disposeScene?.();
    },
  };
}

/** Await the three.js module and hand the API to the builder. */
function withThree(stageHandle: ThreeStage, build: (api: ThreeApi) => void): void {
  void stageHandle.ready.then((api) => {
    if (api) build(api);
  });
}

const cssFlip: Demo = {
  id: 'three-css-flip',
  title: 'CSS 3D card flip',
  category: 'spatial',
  summary:
    'A two-sided card that flips in 3D. It is pure CSS, so it works even where WebGL is unavailable.',
  trigger: 'Press the card',
  techniques: [226],
  keywords: 'css 3d flip card rotate',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--flip');
    const card = el('button', 'demo__flip-card');
    card.type = 'button';
    card.innerHTML =
      '<span class="demo__flip-face demo__flip-face--front">Front</span><span class="demo__flip-face demo__flip-face--back">Back</span>';
    card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    wrap.appendChild(card);
  },
};

const layeredHero: Demo = {
  id: 'three-layered-hero',
  title: 'Layered hero composition',
  category: 'spatial',
  summary: 'Three planes sit at different depths in a CSS 3D scene and drift independently.',
  trigger: 'Move the pointer over the panel',
  techniques: [227],
  keywords: 'layered composition planes depth css 3d',
  mount({ root }) {
    const wrap = stage(root, 'demo__stage--perspective');
    const scene = el('div', 'demo__css3d-scene');
    ['Back', 'Middle', 'Front'].forEach((label, i) => {
      const plane = el('div', `demo__css3d-plane demo__css3d-plane--${i + 1}`);
      plane.textContent = label;
      plane.dataset.depth = String(0.4 + i * 0.5);
      scene.appendChild(plane);
    });
    wrap.appendChild(scene);
    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.transform = `rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${x * 12}deg)`;
    };
    wrap.addEventListener('pointermove', onMove);
    return () => wrap.removeEventListener('pointermove', onMove);
  },
};

const geometryMorph: Demo = {
  id: 'three-morph',
  title: 'Geometry morphs between two forms',
  category: 'spatial',
  summary: 'The vertices of a solid move towards a second shape and back again.',
  trigger: 'Press Morph',
  techniques: [230],
  keywords: 'three morph geometry vertices shape',
  mount({ root }) {
    const handle = createThreeStage(root, 'A solid morphing between two forms');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const geometry = track(new THREE.IcosahedronGeometry(1, 3));
      const material = track(
        new THREE.MeshStandardMaterial({ color: 0xf0490f, roughness: 0.35, metalness: 0.15 }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.z = 3.4;

      const target = new Float32Array(geometry.attributes.position.array.length);
      const origin = new Float32Array(geometry.attributes.position.array.length);
      const array = geometry.attributes.position.array as Float32Array;
      origin.set(array);
      for (let i = 0; i < target.length; i += 3) {
        const x = array[i];
        const y = array[i + 1];
        const z = array[i + 2];
        const len = Math.hypot(x, y, z) || 1;
        target[i] = (x / len) * 1.25;
        target[i + 1] = (y / len) * 0.45;
        target[i + 2] = (z / len) * 1.25;
      }

      let phase = 0;
      let direction = 1;

      const bar = controls(root);
      const toggle = button('Morph', () => {
        direction *= -1;
      });
      bar.appendChild(toggle);

      const tick = () => {
        phase += 0.008 * direction;
        if (phase > 1) {
          phase = 1;
          direction = -1;
        }
        if (phase < 0) {
          phase = 0;
          direction = 1;
        }
        const current = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < current.length; i += 1) {
          current[i] = origin[i] + (target[i] - origin[i]) * phase;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
        mesh.rotation.y += 0.006;
      };
      const timer = window.setInterval(tick, 32);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const waveDisplace: Demo = {
  id: 'three-wave',
  title: 'Vertices displaced by a wave function',
  category: 'spatial',
  summary: 'A plane ripples as a travelling wave passes through it.',
  trigger: 'Automatic',
  techniques: [237],
  keywords: 'wave displacement vertices plane ripple',
  mount({ root }) {
    const handle = createThreeStage(root, 'A plane displaced by a travelling wave');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const geometry = track(new THREE.PlaneGeometry(4, 2.4, 48, 32));
      const material = track(
        new THREE.MeshStandardMaterial({
          color: 0x2b39e6,
          roughness: 0.25,
          metalness: 0.4,
          side: THREE.DoubleSide,
        }),
      );
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      camera.position.set(0, 0, 2.6);
      camera.position.z = 2.8;

      const position = geometry.attributes.position.array as Float32Array;
      const base = new Float32Array(position.length);
      base.set(position);
      const timer = window.setInterval(() => {
        const t = performance.now() / 1000;
        for (let i = 0; i < position.length; i += 3) {
          const x = base[i];
          const y = base[i + 1];
          position[i + 2] = Math.sin(x * 3 + t * 2) * 0.22 + Math.cos(y * 4 - t * 1.4) * 0.12;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const orbiting: Demo = {
  id: 'three-orbit',
  title: 'Orbiting objects',
  category: 'spatial',
  summary: 'Three bodies orbit a centre body along tilted paths.',
  trigger: 'Automatic',
  techniques: [240],
  keywords: 'orbit three objects planets tilt',
  mount({ root }) {
    const handle = createThreeStage(root, 'Three objects orbiting a centre');
    void withThree(handle, ({ THREE, scene, track, onDispose }) => {
      const group = new THREE.Group();
      scene.add(group);
      const core = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.6, 48, 48)),
        track(new THREE.MeshStandardMaterial({ color: 0xffb627, roughness: 0.3, metalness: 0.5 })),
      );
      group.add(core);

      const colors = [0xf0490f, 0x2b39e6, 0xedeeea];
      const orbiters = colors.map((color, i) => {
        const mesh = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.2 + i * 0.06, 32, 32)),
          track(new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.3 })),
        );
        group.add(mesh);
        return mesh;
      });

      const tilt = new THREE.Group();
      tilt.rotation.z = 0.4;
      scene.add(tilt);

      const timer = window.setInterval(() => {
        const t = performance.now() / 1000;
        orbiters.forEach((mesh, i) => {
          const a = t * (0.6 + i * 0.3) + i * 2.1;
          const r = 1.2 + i * 0.7;
          mesh.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.45, Math.sin(a) * 0.6);
        });
        core.rotation.y += 0.01;
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const instancedField: Demo = {
  id: 'three-instanced',
  title: 'Instanced field',
  category: 'spatial',
  summary: 'Hundreds of instances are drawn in a single call and animated on the GPU.',
  trigger: 'Automatic',
  techniques: [243, 469],
  keywords: 'instanced mesh field gpu many',
  mount({ root, budget }) {
    const handle = createThreeStage(root, 'A field of instanced cubes');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const count = budget === 'low' ? 220 : budget === 'mid' ? 700 : 1600;
      const geometry = track(new THREE.BoxGeometry(0.1, 0.1, 0.1));
      const material = track(
        new THREE.MeshStandardMaterial({ color: 0xf0490f, roughness: 0.4, metalness: 0.2 }),
      );
      const mesh = new THREE.InstancedMesh(geometry, material, count);
      const dummy = new THREE.Object3D();
      const grid = Math.ceil(Math.sqrt(count));
      for (let i = 0; i < count; i += 1) {
        const x = (i % grid) / grid - 0.5;
        const z = Math.floor(i / grid) / grid - 0.5;
        dummy.position.set(x * 4, 0, z * 4);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      scene.add(mesh);
      camera.position.set(0, 2.4, 3.2);
      camera.lookAt(0, 0, 0);

      const timer = window.setInterval(() => {
        const t = performance.now() / 1000;
        for (let i = 0; i < count; i += 1) {
          const x = (i % grid) / grid - 0.5;
          const z = Math.floor(i / grid) / grid - 0.5;
          const h = Math.sin(x * 6 + t) * 0.25 + Math.cos(z * 6 - t * 0.8) * 0.25;
          dummy.position.set(x * 4, h, z * 4);
          dummy.rotation.set(0, t * 0.4 + i * 0.01, 0);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const typeOnPlane: Demo = {
  id: 'three-type-plane',
  title: 'Type rendered to a texture on a 3D plane',
  category: 'spatial',
  summary: 'A wordmark is drawn to a canvas, used as a texture, and floated in 3D.',
  trigger: 'Automatic',
  techniques: [244],
  keywords: 'text texture canvas plane three',
  mount({ root }) {
    const handle = createThreeStage(root, 'A wordmark floating on a 3D plane');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const textCanvas = document.createElement('canvas');
      textCanvas.width = 1024;
      textCanvas.height = 256;
      const ctx = textCanvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, 1024, 256);
      ctx.fillStyle = '#edeeea';
      ctx.font = '700 150px Archivo, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('DENVUP', 512, 128);
      const texture = track(new THREE.CanvasTexture(textCanvas));
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = track(
        new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide }),
      );
      const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(4.2, 1.05)), material);
      scene.add(mesh);
      camera.position.z = 3.4;
      const timer = window.setInterval(() => {
        mesh.rotation.y = Math.sin(performance.now() / 1400) * 0.55;
        mesh.rotation.x = Math.sin(performance.now() / 2200) * 0.12;
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const hotspots: Demo = {
  id: 'three-hotspots',
  title: 'Camera path with hotspot markers',
  category: 'spatial',
  summary: 'The camera travels through a corridor past annotated points.',
  trigger: 'Automatic',
  techniques: [245, 309],
  keywords: 'camera path corridor hotspot markers three',
  mount({ root }) {
    const handle = createThreeStage(root, 'A camera travelling past hotspot markers');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const floor = new THREE.Mesh(
        track(new THREE.PlaneGeometry(6, 26)),
        track(new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.9 })),
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.z = -6;
      scene.add(floor);

      for (let i = 0; i < 6; i += 1) {
        const pillar = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.3, 2.4, 0.3)),
          track(new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf0490f : 0x2b39e6, roughness: 0.5 })),
        );
        pillar.position.set(i % 2 ? 1.6 : -1.6, 1.2, -i * 3.2);
        scene.add(pillar);
        const marker = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.12, 20, 20)),
          track(new THREE.MeshBasicMaterial({ color: 0xffb627 })),
        );
        marker.position.set(0, 1.8, -i * 3.2);
        scene.add(marker);
      }

      const timer = window.setInterval(() => {
        const t = (performance.now() / 1000) % 14;
        camera.position.set(Math.sin(t * 0.4) * 0.5, 1.5, 2 - t * 0.9);
        camera.lookAt(0, 1.3, camera.position.z - 4);
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const archGrid: Demo = {
  id: 'three-grid',
  title: 'Abstract architectural grid',
  category: 'spatial',
  summary: 'A navigable grid of blocks that the camera glides over.',
  trigger: 'Move the pointer to steer the camera',
  techniques: [246],
  keywords: 'grid architecture blocks navigate three',
  mount({ root }) {
    const handle = createThreeStage(root, 'An abstract architectural grid');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const group = new THREE.Group();
      scene.add(group);
      const geometry = track(new THREE.BoxGeometry(0.6, 0.6, 0.6));
      for (let x = 0; x < 9; x += 1) {
        for (let z = 0; z < 9; z += 1) {
          const h = 0.4 + ((x * 7 + z * 13) % 11) * 0.28;
          const material = track(
            new THREE.MeshStandardMaterial({
              color: (x + z) % 3 === 0 ? 0xf0490f : (x + z) % 3 === 1 ? 0x2b39e6 : 0xedeeea,
              roughness: 0.55,
              metalness: 0.1,
            }),
          );
          const block = new THREE.Mesh(geometry, material);
          block.position.set((x - 4) * 0.9, h / 2, (z - 4) * 0.9);
          block.scale.y = h;
          group.add(block);
        }
      }
      const pointer = { x: 0, y: 0 };
      const onMove = (event: PointerEvent) => {
        const rect = handle.canvas.getBoundingClientRect();
        pointer.x = (event.clientX - rect.left) / rect.width - 0.5;
        pointer.y = (event.clientY - rect.top) / rect.height - 0.5;
      };
      handle.canvas.addEventListener('pointermove', onMove);
      onDispose(() => handle.canvas.removeEventListener('pointermove', onMove));

      const timer = window.setInterval(() => {
        const t = performance.now() / 1000;
        camera.position.set(pointer.x * 2.4, 3.4 + pointer.y * 1.2, Math.cos(t * 0.18) * 5.4);
        camera.lookAt(0, 0.4, 0);
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const explodedView: Demo = {
  id: 'three-explode',
  title: 'Exploded view',
  category: 'spatial',
  summary: 'An assembly separates into its parts, and pressing a part isolates it.',
  trigger: 'Press a part in the list',
  techniques: [248, 310],
  keywords: 'exploded view assembly parts isolate',
  mount({ root }) {
    const handle = createThreeStage(root, 'An exploded assembly view');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const parts: InstanceType<ThreeModule['Mesh']>[] = [];
      const colors = [0xf0490f, 0xffb627, 0x2b39e6, 0xedeeea, 0x8d8f88];
      for (let i = 0; i < 5; i += 1) {
        const mesh = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.8, 0.8, 0.8)),
          track(new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.4, metalness: 0.2 })),
        );
        mesh.position.set(0, 0, 0);
        mesh.userData.base = new THREE.Vector3((i - 2) * 0.9, 0, 0);
        mesh.userData.explode = new THREE.Vector3((i - 2) * 1.4, (i % 2 ? 1 : -1) * 0.8, 0);
        scene.add(mesh);
        parts.push(mesh);
      }
      camera.position.z = 6;

      const bar = controls(root);
      let exploded = false;
      const toggle = button('Explode', () => {
        exploded = !exploded;
        toggle.textContent = exploded ? 'Assemble' : 'Explode';
        parts.forEach((part, i) => {
          const target = exploded ? part.userData.explode : part.userData.base;
          window.setTimeout(() => {
            part.position.x += (target.x - part.position.x) * 0.25;
            part.position.y += (target.y - part.position.y) * 0.25;
            part.position.z += (target.z - part.position.z) * 0.25;
          }, i * 40);
        });
      });
      bar.appendChild(toggle);

      const timer = window.setInterval(() => {
        parts.forEach((part, i) => {
          part.rotation.x += 0.004 * (i % 2 ? 1 : -1);
          part.rotation.y += 0.006;
        });
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const stagedAssembly: Demo = {
  id: 'three-staged',
  title: 'Geometry added in stages',
  category: 'spatial',
  summary: 'The scene builds itself step by step, each piece arriving with its own motion.',
  trigger: 'Automatic',
  techniques: [249],
  keywords: 'staged assembly progressive load geometry',
  mount({ root }) {
    const handle = createThreeStage(root, 'A scene that assembles in stages');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      const geometry = track(new THREE.BoxGeometry(0.5, 0.5, 0.5));
      const meshes: InstanceType<ThreeModule['Mesh']>[] = [];
      for (let i = 0; i < 24; i += 1) {
        const material = track(
          new THREE.MeshStandardMaterial({
            color: i % 4 === 0 ? 0xf0490f : i % 4 === 1 ? 0x2b39e6 : 0xedeeea,
            roughness: 0.45,
          }),
        );
        const mesh = new THREE.Mesh(geometry, material);
        const angle = (i / 24) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * 1.7, -1.4, Math.sin(angle) * 1.7);
        mesh.scale.setScalar(0.001);
        scene.add(mesh);
        meshes.push(mesh);
      }
      camera.position.z = 4.6;

      let revealed = 0;
      const timer = window.setInterval(() => {
        if (revealed < meshes.length) {
          const mesh = meshes[revealed];
          mesh.scale.setScalar(0.001);
          const start = performance.now();
          const animate = () => {
            const t = Math.min(1, (performance.now() - start) / 480);
            const eased = 1 - Math.pow(1 - t, 3);
            mesh.scale.setScalar(eased);
            mesh.position.y = -1.4 + eased * 1.4;
            if (t < 1) requestAnimationFrame(animate);
          };
          animate();
          revealed += 1;
        }
        meshes.forEach((mesh, i) => {
          mesh.rotation.y += 0.002 * (i % 3 ? 1 : -1);
        });
      }, 160);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

const generativeSculpture: Demo = {
  id: 'three-sculpture',
  title: 'Generative sculpture',
  category: 'spatial',
  summary: 'Stacked, seeded forms that never repeat but always rebuild identically.',
  trigger: 'Automatic',
  techniques: [467, 475],
  keywords: 'generative sculpture stacked seeded forms',
  mount({ root }) {
    const handle = createThreeStage(root, 'A generative stack of forms');
    void withThree(handle, ({ THREE, scene, camera, track, onDispose }) => {
      let seed = 1337;
      const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
      const group = new THREE.Group();
      scene.add(group);
      for (let i = 0; i < 16; i += 1) {
        const size = 0.28 + random() * 0.5;
        const mesh = new THREE.Mesh(
          track(new THREE.BoxGeometry(size, size * 0.5, size)),
          track(
            new THREE.MeshStandardMaterial({
              color: i % 3 === 0 ? 0xf0490f : i % 3 === 1 ? 0xffb627 : 0x2b39e6,
              roughness: 0.5,
              metalness: 0.15,
            }),
          ),
        );
        mesh.position.set((random() - 0.5) * 1.2, i * 0.34, (random() - 0.5) * 1.2);
        mesh.rotation.set(random() * 0.5, random() * Math.PI, random() * 0.3);
        group.add(mesh);
      }
      camera.position.set(2.4, 2.2, 3.6);
      camera.lookAt(0, 2.2, 0);
      const timer = window.setInterval(() => {
        group.rotation.y += 0.005;
      }, 33);
      onDispose(() => window.clearInterval(timer));
    });
    return () => handle.dispose();
  },
};

export const threeDemos: Demo[] = [
  cssFlip,
  layeredHero,
  geometryMorph,
  waveDisplace,
  orbiting,
  instancedField,
  typeOnPlane,
  hotspots,
  archGrid,
  explodedView,
  stagedAssembly,
  generativeSculpture,
];

export { hint };
