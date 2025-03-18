import * as THREE from 'three';
import * as Ammo from 'ammo.js';

export class Furniture {
    constructor(scene, physicsManager) {
        this.scene = scene;
        this.physicsManager = physicsManager;
        this.setupDesk();
        this.setupBall();
    }

    setupDesk() {
        // Desk top
        const deskGeometry = new THREE.BoxGeometry(3, 0.1, 2);
        const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.set(5, 1, 0);
        this.scene.add(desk);

        // Create physics body for desk top
        const deskShape = new Ammo.btBoxShape(new Ammo.btVector3(1.5, 0.05, 1));
        this.physicsManager.createRigidBody(desk, 0, deskShape); // mass 0 for static desk

        // Desk legs
        const legGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
        const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const x = i < 2 ? 4 : 6;
            const z = i % 2 === 0 ? -0.9 : 0.9;
            leg.position.set(x, 0.5, z);
            this.scene.add(leg);

            // Create physics body for each leg
            const legShape = new Ammo.btBoxShape(new Ammo.btVector3(0.05, 0.5, 0.05));
            this.physicsManager.createRigidBody(leg, 0, legShape); // mass 0 for static legs
        }
    }

    setupBall() {
        const ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const ball = new THREE.Mesh(ballGeometry, ballMaterial);
        ball.position.set(-5, 0.5, 0);
        this.scene.add(ball);

        // Create physics body for ball
        const ballShape = new Ammo.btSphereShape(0.5);
        this.physicsManager.createRigidBody(ball, 1, ballShape); // mass 1 for dynamic ball
    }
} 