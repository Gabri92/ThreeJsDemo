import * as THREE from 'three';
import * as Ammo from 'ammo.js';

export class Character {
    constructor(scene, camera, physicsManager) {
        this.scene = scene;
        this.camera = camera;
        this.physicsManager = physicsManager;
        this.moveSpeed = 0.2;
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            ArrowUp: false,
            ArrowLeft: false,
            ArrowDown: false,
            ArrowRight: false
        };

        this.setupCharacter();
        this.setupControls();
    }

    setupCharacter() {
        const characterGeometry = new THREE.BoxGeometry(1, 2, 1);
        const characterMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(characterGeometry, characterMaterial);
        this.mesh.position.y = 1;
        this.scene.add(this.mesh);

        // Create physics body for character
        const shape = new Ammo.btBoxShape(new Ammo.btVector3(0.5, 1, 0.5));
        this.physicsManager.createRigidBody(this.mesh, 0, shape); // mass 0 for static character

        // Initial camera setup
        this.camera.position.set(0, 10, 10);
        this.camera.lookAt(this.mesh.position);
    }

    setupControls() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    update() {
        const moveVector = new THREE.Vector3(0, 0, 0);

        if (this.keys.w || this.keys.ArrowUp) moveVector.z -= this.moveSpeed;
        if (this.keys.s || this.keys.ArrowDown) moveVector.z += this.moveSpeed;
        if (this.keys.a || this.keys.ArrowLeft) moveVector.x -= this.moveSpeed;
        if (this.keys.d || this.keys.ArrowRight) moveVector.x += this.moveSpeed;

        // Apply movement with boundary checks
        const nextPosition = this.mesh.position.clone().add(moveVector);
        const boundaryLimit = 24; // Slightly less than wall position to prevent clipping

        if (nextPosition.x > -boundaryLimit && nextPosition.x < boundaryLimit) {
            this.mesh.position.x = nextPosition.x;
        }
        if (nextPosition.z > -boundaryLimit && nextPosition.z < boundaryLimit) {
            this.mesh.position.z = nextPosition.z;
        }

        // Update physics body position
        const body = this.physicsManager.getBody(this.mesh);
        if (body) {
            const transform = body.getWorldTransform();
            transform.setOrigin(new Ammo.btVector3(
                this.mesh.position.x,
                this.mesh.position.y,
                this.mesh.position.z
            ));
            body.setWorldTransform(transform);
        }

        // Update camera position to follow character
        this.camera.position.x = this.mesh.position.x;
        this.camera.position.z = this.mesh.position.z + 10;
        this.camera.lookAt(this.mesh.position);
    }
} 