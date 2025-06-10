import * as THREE from "https://unpkg.com/three@0.158.0/build/three.module.js";

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2, 500);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Group to hold the entire solar system
const solarSystem = new THREE.Group();

// Sun
const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
solarSystem.add(sun);

// Planet data
const planetsData = [
  { name: "Mercury", color: 0xaaaaaa, distance: 6, size: 0.5, speed: 0.04 },
  { name: "Venus", color: 0xffcc99, distance: 8, size: 0.6, speed: 0.015 },
  { name: "Earth", color: 0x3399ff, distance: 10, size: 0.7, speed: 0.01 },
  { name: "Mars", color: 0xff3300, distance: 12, size: 0.6, speed: 0.008 },
  { name: "Jupiter", color: 0xff9966, distance: 15, size: 1.5, speed: 0.004 },
  { name: "Saturn", color: 0xffcc66, distance: 18, size: 1.2, speed: 0.003 },
  { name: "Uranus", color: 0x66ffff, distance: 21, size: 1.0, speed: 0.002 },
  { name: "Neptune", color: 0x3366ff, distance: 24, size: 1.0, speed: 0.001 },
];

const planets = [];
const controlsDiv = document.getElementById("controls");

// Create planets, orbit rings, and UI
planetsData.forEach((planetData) => {
  // Create planet mesh
  const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: planetData.color,
    shininess: 10,
  });
  const mesh = new THREE.Mesh(geometry, material);
  solarSystem.add(mesh);

  planetData.angle = Math.random() * Math.PI * 2;
  planets.push({ mesh, data: planetData });

  // Create speed control UI
  if (controlsDiv) {
    const label = document.createElement("label");
    label.innerHTML = `${planetData.name} Speed: `;
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "0.1";
    input.step = "0.001";
    input.value = planetData.speed;
    input.addEventListener("input", (e) => {
      planetData.speed = parseFloat(e.target.value);
    });
    label.appendChild(input);
    controlsDiv.appendChild(label);
  }

  // Create orbit ring
  const ringGeometry = new THREE.RingGeometry(
    planetData.distance - 0.01,
    planetData.distance + 0.01,
    64
  );
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = Math.PI / 2;
  solarSystem.add(ring);
});

// Scale the entire solar system group
solarSystem.scale.set(2, 2, 2); 

// Add the solar system group to the scene
scene.add(solarSystem);

// Camera position
camera.position.set(0, 30, 70);
camera.lookAt(0, 0, 0);

// Animate planets
function animate() {
  requestAnimationFrame(animate);

  planets.forEach((planet) => {
    planet.data.angle += planet.data.speed;
    planet.mesh.position.x = Math.cos(planet.data.angle) * planet.data.distance;
    planet.mesh.position.z = Math.sin(planet.data.angle) * planet.data.distance;
  });

  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Fix canvas layering behind controls
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "0";

// Create stars as small white points randomly scattered
function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 1000;
  const positions = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    positions.push(x, y, z);
  }

  starGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

createStars();

planetsData.forEach((planetData) => {
  const geometry = new THREE.SphereGeometry(planetData.size, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: planetData.color,
    shininess: 10,
  });
  const mesh = new THREE.Mesh(geometry, material);
  solarSystem.add(mesh);

  planetData.angle = Math.random() * Math.PI * 2;
  planets.push({ mesh, data: planetData });

  // Add Saturn ring (only for Saturn)
  if (planetData.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(
      planetData.size * 1.2,
      planetData.size * 2,
      64
    );
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc66,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2.7; 
    ringMesh.position.set(0, 0, 0);
    mesh.add(ringMesh); 
  }

  // Create orbit ring 
  const orbitGeometry = new THREE.RingGeometry(
    planetData.distance - 0.01,
    planetData.distance + 0.01,
    64
  );
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitRing.rotation.x = Math.PI / 2;
  solarSystem.add(orbitRing);
});

// Inject all CSS styles using JavaScript
const style = document.createElement("style");
style.textContent = `
  body {
    margin: 0;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }

  #controls {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.6);
    padding: 10px;
    border-radius: 10px;
    color: white;
    z-index: 1;
  }

  label {
    display: block;
    margin: 5px 0;
    font-size: 14px;
  }

  input[type="range"] {
    width: 150px;
  }

  .tooltip {
    position: absolute;
    background: #000;
    color: #fff;
    padding: 5px 8px;
    border-radius: 5px;
    font-size: 12px;
    pointer-events: none;
    z-index: 2;
  }
`;
document.head.appendChild(style);
