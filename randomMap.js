// randomMap.js
import * as THREE from 'three';
import { createRigidBody } from "./physicsEngine.js";

export function createRandomMap(scene) {
  // Create a static ground plane
  const groundSize = 200;
  const groundGeometry = new THREE.BoxGeometry(groundSize, 1, groundSize);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.position.set(0, -0.5, 0);
  scene.add(groundMesh);

  // Ammo shape (for ground)
  const groundShape = new Ammo.btBoxShape(
    new Ammo.btVector3(groundSize / 2, 0.5, groundSize / 2)
  );

  // Rigid body (mass=0 => static)
  createRigidBody(groundMesh, groundShape, 0, new THREE.Vector3(0, -0.5, 0));

  // Now scatter some random boxes
  for (let i = 0; i < 30; i++) {
    const sizeX = Math.random() * 2 + 0.5;
    const sizeY = Math.random() * 2 + 0.5;
    const sizeZ = Math.random() * 2 + 0.5;

    const boxGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

    const posX = (Math.random() - 0.5) * groundSize * 0.8;
    const posY = 0.5 + Math.random() * 5;
    const posZ = (Math.random() - 0.5) * groundSize * 0.8;
    boxMesh.position.set(posX, posY, posZ);
    scene.add(boxMesh);

    // Ammo shape
    const boxShape = new Ammo.btBoxShape(
      new Ammo.btVector3(sizeX * 0.5, sizeY * 0.5, sizeZ * 0.5)
    );

    // Mass > 0 => dynamic
    createRigidBody(boxMesh, boxShape, 1, new THREE.Vector3(posX, posY, posZ));
  }
}
