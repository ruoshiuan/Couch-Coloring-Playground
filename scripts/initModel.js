import * as THREE from 'three';
const partsInStorage = JSON.parse(localStorage.getItem('parts'));
let parts;
if (partsInStorage) {
  parts = partsInStorage.partsCurrentStatus;
  parts.forEach(part => {
    if (part.texture) {
      let texture = new THREE.TextureLoader().load(part.texture.texture);
      texture.repeat.set(part.texture.size[0], part.texture.size[1]);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      part.mtl = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: texture.shininess || 10
      });
    } else {
      part.mtl = new THREE.MeshPhongMaterial({
        color: part.mtl.color,
        shininess: 10
      });
    }
  })
}
const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0xf1f1f1, map: null, shininess: 10});
export const INITIAL_MAP = [
  {childID: "back_arm", mtl: partsInStorage ? parts[0].mtl : INITIAL_MTL},
  {childID: "back-cushion", mtl: partsInStorage ? parts[1].mtl : INITIAL_MTL},
  {childID: "sides", mtl: partsInStorage ? parts[2].mtl : INITIAL_MTL},
  {childID: "seats", mtl: partsInStorage ? parts[3].mtl : INITIAL_MTL},
  {childID: "base", mtl: partsInStorage ? parts[4].mtl : INITIAL_MTL},
  {childID: "support", mtl: partsInStorage ? parts[5].mtl : INITIAL_MTL},
  {childID: "legs", mtl: partsInStorage ? parts[6].mtl : INITIAL_MTL},
  {childID: "blanket_", mtl: partsInStorage ? parts[7].mtl : INITIAL_MTL},
  {childID: "small_cushion_001", mtl: partsInStorage ? parts[8].mtl : INITIAL_MTL},
  {childID: "small_cushion_002", mtl: partsInStorage ? parts[9].mtl : INITIAL_MTL},
];

export function initColor (theModel, type, mtl) {
  theModel.traverse((obj) => {
    if (obj.isMesh) {
      if (obj.name.includes(type)) {
        obj.material = mtl;
        obj.nameID = type;
      }
    }
  })
}

