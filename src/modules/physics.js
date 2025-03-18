import * as THREE from 'three';

export class PhysicsManager {
    constructor() {
        this.world = null;
        this.bodies = new Map();
        this.initialized = false;
    }

    async init() {
        try {
            console.log("Ammo.js loaded successfully");
            // Wait for Ammo.js to load
            const AmmoLib = await Ammo();
            window.Ammo = AmmoLib;
            
            console.log("Ammo.js loaded successfully");
            
            // Create physics world
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const overlappingPairCache = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();
            
            this.world = new Ammo.btDiscreteDynamicsWorld(
                dispatcher,
                overlappingPairCache,
                solver,
                collisionConfiguration
            );
            
            this.world.setGravity(new Ammo.btVector3(0, -9.8, 0));
            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize physics:', error);
            throw error;
        }
    }

    createRigidBody(mesh, mass, shape) {
        if (!this.initialized) {
            console.error('Physics not initialized');
            return;
        }

        const position = mesh.position;
        const quaternion = mesh.quaternion;

        // Create physics shape
        const physicsShape = shape;
        
        // Calculate local inertia
        const localInertia = new Ammo.btVector3(0, 0, 0);
        if (mass > 0) {
            physicsShape.calculateLocalInertia(mass, localInertia);
        }

        // Create transform
        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));
        transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

        // Create motion state
        const motionState = new Ammo.btDefaultMotionState(transform);

        // Create rigid body
        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, physicsShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        // Add to world
        this.world.addRigidBody(body);

        // Store reference
        this.bodies.set(mesh, body);

        // Cleanup
        Ammo.destroy(rbInfo);
    }

    update() {
        if (!this.initialized || !this.world) return;

        // Step physics world
        this.world.stepSimulation(1 / 60, 10);

        // Update meshes
        this.bodies.forEach((body, mesh) => {
            const motionState = body.getMotionState();
            if (motionState) {
                const transform = new Ammo.btTransform();
                motionState.getWorldTransform(transform);

                const position = transform.getOrigin();
                const quaternion = transform.getRotation();

                mesh.position.set(position.x(), position.y(), position.z());
                mesh.quaternion.set(quaternion.x(), quaternion.y(), quaternion.z(), quaternion.w());

                Ammo.destroy(transform);
            }
        });
    }

    getWorld() {
        return this.world;
    }

    getBody(mesh) {
        return this.bodies.get(mesh);
    }
} 