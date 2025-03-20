// main.js
import * as THREE from 'three';
import { createScene, createRenderer, createCamera } from "./sceneManager.js";
import { initPhysics, updatePhysics } from "./physicsEngine.js";
import { createLights } from "./lightManager.js";
import { createRandomMap } from "./randomMap.js";
import { createPlayer, playerMesh, updatePlayer } from "./player.js";

// THREE is already loaded globally via <script src="three.js">
// Alternatively, you could import it from 'three' if you use a bundler.

let scene, camera, renderer;
let clock = new THREE.Clock();

// Wait for Ammo to load (WASM)
Ammo().then(() => {
  init();  // Once Ammo is ready, init everything
  animate();
});

function init() {
  // Create scene, camera, renderer
  scene = createScene();
  camera = createCamera();
  renderer = createRenderer();
  document.body.appendChild(renderer.domElement);

  // Initialize physics world
  initPhysics();

  // Add lights
  createLights(scene);

  // Create random map
  createRandomMap(scene);

  // Create player
  createPlayer(scene);
}

function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();
  updatePhysics(deltaTime);

  // Update player movement
  updatePlayer();

  // Simple third-person camera logic (look at the player)
  if (playerMesh) {
    const desiredPosition = new THREE.Vector3(
      playerMesh.position.x,
      playerMesh.position.y + 5,
      playerMesh.position.z + 10
    );
    camera.position.lerp(desiredPosition, 0.1);  // smooth interpolation
    camera.lookAt(playerMesh.position);
  }

  renderer.render(scene, camera);
}
