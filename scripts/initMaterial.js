import * as THREE from 'three';
import { textures } from './textures.js';

export let partsCurrentStatus = [
  {childID: "back_arm", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "back-cushion", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "sides", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "seats", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "base", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "support", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "legs", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "blanket_", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "small_cushion_001", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
  {childID: "small_cushion_002", mtl: { color: 0xf1f1f1, map: null, shininess: 10 }},
];

const partsInStorage = JSON.parse(localStorage.getItem('parts'));
if (partsInStorage) {
  partsCurrentStatus = partsInStorage.partsCurrentStatus;
}

export function selectedTexture (swatchKey, theModel, activeOption, selectedColor) {
  const updatedPart = partsCurrentStatus.findIndex(part => part.childID === activeOption);
  let new_MTL;
  let currentTexture;
  if (swatchKey) {
    currentTexture = textures[parseInt(swatchKey)];
  }
  if (currentTexture) {
    let texture = new THREE.TextureLoader().load(currentTexture.texture);
    texture.repeat.set(currentTexture.size[0], currentTexture.size[1]);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    new_MTL = new THREE.MeshPhongMaterial({
      map: texture,
      shininess: texture.shininess || 10
    });
    partsCurrentStatus[updatedPart].mtl.map = currentTexture.texture;
    partsCurrentStatus[updatedPart].mtl.shininess = currentTexture.shininess || 10;
    partsCurrentStatus[updatedPart].texture = currentTexture;
  } else {
    new_MTL = new THREE.MeshPhongMaterial({
      color: parseInt(`0x${ selectedColor }`),
      shininess: 10
    })
    partsCurrentStatus[updatedPart].mtl.color = parseInt(`0x${ selectedColor }`);
    partsCurrentStatus[updatedPart].mtl.shininess = 10;
    delete partsCurrentStatus[updatedPart].texture;
  };
  setMaterial(theModel, activeOption, new_MTL);
};

function setMaterial (parent, type, mtl) {
  parent.traverse(obj => {
    if (obj.isMesh && obj.nameID !== null) {
      if (obj.nameID === type) {
        obj.material = mtl;
      }
    }
  })
};
