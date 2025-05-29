export function initialSetInventory(scene) {
    scene.slot1 = document.getElementById('slot-1');
    scene.slot2 = document.getElementById('slot-2');
    scene.slot3 = document.getElementById('slot-3');
    scene.slot4 = document.getElementById('slot-4');
    scene.slot5 = document.getElementById('slot-5');

    scene.slot1.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
    scene.slot2.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
    scene.slot3.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
    scene.slot4.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
    scene.slot5.style.backgroundImage = 'url(/src/assets/images/qMark.png)';
}

export function showInventory() {
    const inventoryBox = document.getElementById('inventory-box');
    if (inventoryBox) {
        inventoryBox.style.display = 'flex'; 
    }
}

export function hideInventory() {
    const inventoryBox = document.getElementById('inventory-box');
    if (inventoryBox) {
        inventoryBox.style.display = 'none';
    }
}

export function setInventory(scene) {
    scene.slot1 = document.getElementById('slot-1');
    scene.slot2 = document.getElementById('slot-2');
    scene.slot3 = document.getElementById('slot-3');
    scene.slot4 = document.getElementById('slot-4');
    scene.slot5 = document.getElementById('slot-5');
}