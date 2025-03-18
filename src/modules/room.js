import * as THREE from 'three';
import * as Ammo from 'ammo.js';

export class Room {
    constructor(scene, physicsManager) {
        this.scene = scene;
        this.physicsManager = physicsManager;
        this.setupGround();
        this.setupWalls();
    }

    setupGround() {
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        this.scene.add(ground);

        // Create physics body for ground
        const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(25, 0.1, 25));
        this.physicsManager.createRigidBody(ground, 0, groundShape); // mass 0 for static ground
    }

    setupWalls() {
        const wallHeight = 5;
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });

        // North wall
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, wallHeight, 1),
            wallMaterial
        );
        northWall.position.set(0, wallHeight / 2, -25);
        this.scene.add(northWall);

        // Create physics body for north wall
        const northWallShape = new Ammo.btBoxShape(new Ammo.btVector3(25, wallHeight / 2, 0.5));
        this.physicsManager.createRigidBody(northWall, 0, northWallShape);

        // South wall
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(50, wallHeight, 1),
            wallMaterial
        );
        southWall.position.set(0, wallHeight / 2, 25);
        this.scene.add(southWall);

        // Create physics body for south wall
        const southWallShape = new Ammo.btBoxShape(new Ammo.btVector3(25, wallHeight / 2, 0.5));
        this.physicsManager.createRigidBody(southWall, 0, southWallShape);

        // East wall
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(1, wallHeight, 50),
            wallMaterial
        );
        eastWall.position.set(25, wallHeight / 2, 0);
        this.scene.add(eastWall);

        // Create physics body for east wall
        const eastWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, wallHeight / 2, 25));
        this.physicsManager.createRigidBody(eastWall, 0, eastWallShape);

        // West wall
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(1, wallHeight, 50),
            wallMaterial
        );
        westWall.position.set(-25, wallHeight / 2, 0);
        this.scene.add(westWall);

        // Create physics body for west wall
        const westWallShape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, wallHeight / 2, 25));
        this.physicsManager.createRigidBody(westWall, 0, westWallShape);
    }
} 