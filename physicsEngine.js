// physicsEngine.js

let physicsWorld;
let rigidBodies = []; // Keep track of all objects that need syncing

// Temporary transform object (avoid repeated allocs)
let tmpTrans;

export function initPhysics() {
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const overlappingPairCache = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    overlappingPairCache,
    solver,
    collisionConfiguration
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));

  tmpTrans = new Ammo.btTransform();
}

export function createRigidBody(threeMesh, shape, mass, startPosition) {
  // Set initial transform
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(startPosition.x, startPosition.y, startPosition.z));

  // Motion State
  const motionState = new Ammo.btDefaultMotionState(transform);

  // Inertia
  const localInertia = new Ammo.btVector3(0, 0, 0);
  if (mass > 0) {
    shape.calculateLocalInertia(mass, localInertia);
  }

  // Construction Info
  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    mass,
    motionState,
    shape,
    localInertia
  );
  const body = new Ammo.btRigidBody(rbInfo);

  // Add to world
  physicsWorld.addRigidBody(body);

  // Link Three.js mesh to Ammo body
  threeMesh.userData.physicsBody = body;
  rigidBodies.push(threeMesh);

  return body;
}

export function updatePhysics(deltaTime) {
  if (!physicsWorld) return;

  // Step the physics simulation
  physicsWorld.stepSimulation(deltaTime, 10);

  // Sync Three.js meshes with their Ammo bodies
  for (let i = 0; i < rigidBodies.length; i++) {
    const objThree = rigidBodies[i];
    const body = objThree.userData.physicsBody;

    if (body && body.getMotionState()) {
      body.getMotionState().getWorldTransform(tmpTrans);
      const p = tmpTrans.getOrigin();
      const q = tmpTrans.getRotation();
      objThree.position.set(p.x(), p.y(), p.z());
      objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
  }
}
