import { SceneManager } from './src/modules/scene.js';
import { Room } from './src/modules/room.js';
import { Character } from './src/modules/character.js';
import { Furniture } from './src/modules/furniture.js';
import { PhysicsManager } from './src/modules/physics.js';

async function init() {
    // Initialize scene manager
    const sceneManager = new SceneManager();

    // Initialize physics manager
    const physicsManager = new PhysicsManager();
    await physicsManager.init(); // Wait for physics to initialize

    // Initialize room
    const room = new Room(sceneManager.getScene(), physicsManager);

    // Initialize character
    const character = new Character(sceneManager.getScene(), sceneManager.getCamera(), physicsManager);

    // Initialize furniture
    const furniture = new Furniture(sceneManager.getScene(), physicsManager);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        physicsManager.update();
        character.update();
        sceneManager.render();
    }

    animate();
}

init().catch(console.error); 