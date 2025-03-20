// lightManager.js
import * as THREE from 'three';

export function createLights(scene) {
    // Ambient
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
  
    // Directional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    // If you want shadows:
    // directionalLight.castShadow = true;
    scene.add(directionalLight);
  }
  