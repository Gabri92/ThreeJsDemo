// sceneManager.js
import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x88ccff);
    return scene;
  }
  
  export function createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    // Position it at some default location
    camera.position.set(0, 5, 15);
  
    // Handle window resizing
    window.addEventListener("resize", () => onWindowResize(camera));
  
    return camera;
  }
  
  export function createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Optional: enable shadows if you want them
    // renderer.shadowMap.enabled = true;
    return renderer;
  }
  
  function onWindowResize(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  