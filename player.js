// player.js
import * as THREE from 'three';
import { createRigidBody } from "./physicsEngine.js";

export let playerMesh = null;
export let playerBody = null;
export let moveSpeed = 0.2;
export let jumpForce = 5;
export let keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    space: false
};

export function createPlayer(scene) {
    const radius = 1;
    const geo = new THREE.SphereGeometry(radius, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    playerMesh = new THREE.Mesh(geo, mat);
    scene.add(playerMesh);

    const sphereShape = new Ammo.btSphereShape(radius);

    // Let's start the player at some Y height
    const startPos = new THREE.Vector3(0, 10, 0);

    // Create a dynamic rigid body
    playerBody = createRigidBody(playerMesh, sphereShape, 1, startPos);

    setupControls();
}

function setupControls() {
    window.addEventListener('keydown', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
        }
    });
}

export function updatePlayer() {
    if (!playerBody || !playerMesh) return;

    const moveVector = new THREE.Vector3(0, 0, 0);

    if (keys.w) moveVector.z -= moveSpeed;
    if (keys.s) moveVector.z += moveSpeed;
    if (keys.a) moveVector.x -= moveSpeed;
    if (keys.d) moveVector.x += moveSpeed;

    // Apply movement
    const force = new Ammo.btVector3(moveVector.x, 0, moveVector.z);
    playerBody.applyCentralImpulse(force);

    // Jump
    if (keys.space) {
        const jump = new Ammo.btVector3(0, jumpForce, 0);
        playerBody.applyCentralImpulse(jump);
        keys.space = false; // Prevent continuous jumping
    }
}