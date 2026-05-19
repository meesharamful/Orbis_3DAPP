// ORBIS — main.js
// Three.js scene + UI for the planet viewer.

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';

// ---------- the catalogue of planets ----------
// each one has a colour for the placeholder sphere and some info to display.
// when I export real models from Blender, I uncomment the `glb` line.

const planets = [
  {
    id: 'earth',
    name: 'Earth',
    meta: 'Specimen 001 / Terrestrial',
    color: 0x2a5a8a,
    data: {
      'Diameter': '12,742 km',
      'Mass': '5.97 × 10²⁴ kg',
      'Moons': '1',
      'Distance': '1.00 AU',
      'Day length': '24.0 h',
    },
    glb: 'models/earth.glb',
  },
  {
    id: 'mars',
    name: 'Mars',
    meta: 'Specimen 002 / Terrestrial',
    color: 0xb45a32,
    data: {
      'Diameter': '6,779 km',
      'Mass': '6.39 × 10²³ kg',
      'Moons': '2',
      'Distance': '1.52 AU',
      'Day length': '24.6 h',
    },
     glb: 'models/mars.glb',
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    meta: 'Specimen 003 / Gas Giant',
    color: 0xc9a374,
    data: {
      'Diameter': '139,820 km',
      'Mass': '1.90 × 10²⁷ kg',
      'Moons': '95',
      'Distance': '5.20 AU',
      'Day length': '9.93 h',
    },
    glb: 'models/jupiter.glb',
  },
  {
    id: 'moon',
    name: 'Luna',
    meta: 'Specimen 004 / Satellite',
    color: 0xa8a49d,
    data: {
      'Diameter': '3,474 km',
      'Mass': '7.35 × 10²² kg',
      'Moons': '0',
      'Distance': '0.0026 AU',
      'Day length': '708.7 h',
    },
    glb: 'models/moon.glb',
  },
];

// ---------- Three.js setup ----------

const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// two lights — sun (directional) and ambient fill
const sunLight = new THREE.DirectionalLight(0xffeacc, 1.2);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

const ambientLight = new THREE.AmbientLight(0x404858, 0.25);
scene.add(ambientLight);

// orbit controls — drag to rotate the camera, scroll to zoom
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;

// ---------- model loading ----------

let currentModel = null;
const loader = new GLTFLoader();

// makes a plain coloured sphere as a stand-in for the real Blender model
function makePlaceholder(planet) {
  const geometry = new THREE.SphereGeometry(1.5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: planet.color,
    roughness: 0.85,
  });
  return new THREE.Mesh(geometry, material);
}

// load a planet — uses the GLB file if there is one, otherwise the placeholder
function loadPlanet(planet) {
  return new Promise((resolve) => {
    if (!planet.glb) {
      resolve(makePlaceholder(planet));
      return;
    }
    loader.load(
      planet.glb,
      (gltf) => {
        // centre and scale the loaded model so it fits the stage
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const centre = box.getCenter(new THREE.Vector3());
        model.position.sub(centre);
        model.scale.setScalar(3 / size);
        resolve(model);
      },
      undefined,
      () => resolve(makePlaceholder(planet))  // if loading fails, fall back
    );
  });
}

// swap to a different planet
async function selectPlanet(planet) {
  // remove the old one and free its memory
  if (currentModel) {
    scene.remove(currentModel);
    currentModel.traverse((c) => {
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    });
  }

  currentModel = await loadPlanet(planet);
  scene.add(currentModel);

  // make sure wireframe state carries over
  applyWireframe(wireframeOn);

  // update the text in the UI
  document.getElementById('object-name').textContent = planet.name;
  document.getElementById('object-meta').textContent = planet.meta;
  renderDataTable(planet.data);

  // highlight the active item in the gallery
  document.querySelectorAll('.gallery-item').forEach((el) => {
    el.classList.toggle('active', el.dataset.id === planet.id);
  });
}

// ---------- build the gallery (left panel) ----------

function buildGallery() {
  const el = document.getElementById('gallery');
  el.innerHTML = '';
  planets.forEach((planet, i) => {
    const item = document.createElement('button');
    item.className = 'gallery-item' + (i === 0 ? ' active' : '');
    item.dataset.id = planet.id;
    item.innerHTML = `
      <div class="gallery-thumb ${planet.id}"></div>
      <div class="gallery-label">
        <span class="name">${planet.name}</span>
        <span class="id">${planet.meta}</span>
      </div>
    `;
    item.addEventListener('click', () => selectPlanet(planet));
    el.appendChild(item);
  });
}

// ---------- telemetry table (right panel) ----------

function renderDataTable(data) {
  const el = document.getElementById('data-table');
  el.innerHTML = Object.entries(data).map(([k, v]) => `
    <div class="data-row">
      <span class="key">${k}</span>
      <span class="val">${v}</span>
    </div>
  `).join('');
}

// ---------- UI buttons and sliders ----------

let wireframeOn = false;

function applyWireframe(on) {
  if (!currentModel) return;
  currentModel.traverse((c) => {
    if (c.isMesh) c.material.wireframe = on;
  });
}

document.getElementById('btn-wireframe').addEventListener('click', (e) => {
  wireframeOn = !wireframeOn;
  e.currentTarget.classList.toggle('active', wireframeOn);
  applyWireframe(wireframeOn);
});

document.getElementById('btn-rotate').addEventListener('click', (e) => {
  controls.autoRotate = !controls.autoRotate;
  e.currentTarget.classList.toggle('active', controls.autoRotate);
});

document.getElementById('sun-intensity').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  sunLight.intensity = v;
  document.getElementById('sun-value').textContent = v.toFixed(2);
});

document.getElementById('amb-intensity').addEventListener('input', (e) => {
  const v = parseFloat(e.target.value);
  ambientLight.intensity = v;
  document.getElementById('amb-value').textContent = v.toFixed(2);
});

// ---------- click on the model to spin it faster briefly ----------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let spinBoost = 0;

renderer.domElement.addEventListener('click', (e) => {
  if (!currentModel) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(currentModel, true);
  if (hits.length > 0) spinBoost = 0.15;   // triggers the burst in animate()
});

// ---------- animation loop ----------

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  if (currentModel) {
    // base slow self-rotation, plus any click-boost that's decaying
    currentModel.rotation.y += 0.003 + spinBoost;
    spinBoost *= 0.92;   // ease back to zero
  }

  renderer.render(scene, camera);
}

// ---------- handle window resize ----------

window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// ---------- start ----------

buildGallery();
selectPlanet(planets[0]);
animate();
