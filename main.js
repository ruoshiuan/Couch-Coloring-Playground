import "./style.scss";
import * as THREE from 'three';
import MODEL_PATH from './assets/couch.glb';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { INITIAL_MAP, initColor } from './scripts/initModel.js';
import { selectedTexture, partsCurrentStatus } from './scripts/initMaterial.js';
import { buildTextures } from './scripts/buildTray.js';
const canvas = document.querySelector('#canvas');
const sceneBgColor = 0xf4f4f4;
const currentColor = document.querySelector('#js-couch-color');
const tray = document.querySelector('#js-textures-tray');
const options = document.querySelectorAll('.option');
const optional = document.querySelector('#js-optional');
const optionalGroup = document.querySelector('#js-optional-group');
const optionsBox = document.querySelector('#js-options-container');
const saveBtn = document.querySelector('#js-save-btn');
const resetBtn = document.querySelector('#js-reset-btn');
const infoIcon = document.querySelector('#js-info');
const infoBox = document.querySelector('#js-note-box');
const infoBoxBtn = document.querySelector('#js-note-box-btn');
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const modelScale = isMobile ? 0.8 : 1.5;
let scene, camera, renderer;
let loader, theModel;
let hemiLight, dirLight;
let activeOption = 'back_arm';

//////* ↓↓↓↓↓　Editor's UI ↓↓↓↓↓　*//////
// Add rextures Tray UI
buildTextures(tray);

// Texture Changed
let swatches = document.querySelectorAll('.texture');
swatches.forEach(swatch => swatch.addEventListener('click', e => {
  const swatchKey = e.target.dataset.key;
  selectedTexture(swatchKey, theModel, activeOption);
}));

// Switch Selected Parts
options.forEach(option => option.addEventListener('click', e => {
  const targetOption = e.target;
  activeOption = e.target.dataset.option;
  options.forEach(otherOption => {
    otherOption.classList.remove('active');
  })
  targetOption.classList.add('active');
}));

// Select Color Texture
currentColor.addEventListener('change', e => {
  const selectedColor = e.target.value.replace('#', '')
  selectedTexture(null, theModel, activeOption, selectedColor);
});

// Display the Accessories option or not
optional.addEventListener('change', () => {
  const blanket = theModel.children.filter(part => part).find(part => part.nameID === 'blanket_');
  const smallCushion_001 = theModel.children.filter(part => part).find(part => part.name === 'small_cushion_001');
  const smallCushion_002 = theModel.children.filter(part => part).find(part => part.name === 'small_cushion_002');
  if (optional.checked) {
    optionalGroup.style.display = 'flex';
    activeOption = 'blanket_';
    options.forEach(otherOption => {
      otherOption.classList.remove('active');
    })
    options[options.length - 3].classList.add('active');
    optionalGroup.scrollIntoView();
    blanket.visible = true;
    smallCushion_001.visible = true;
    smallCushion_002.visible = true;
  } else {
    optionalGroup.style.display = 'none';
    options.forEach(otherOption => {
      otherOption.classList.remove('active');
    })
    options[0].classList.add('active');
    optionsBox.scrollLeft = 0;
    blanket.visible = false;
    smallCushion_001.visible = false;
    smallCushion_002.visible = false;
  }
});

// Save current style into LocalStorage and reload the window
saveBtn.addEventListener('click', () => {
  localStorage.setItem(`parts`, JSON.stringify({ partsCurrentStatus }));
  alert('Saving...')
  setTimeout(() => {
    window.location.reload();
  }, 1000);
});

// Remove current style data in LocalStorage and reload the window
resetBtn.addEventListener('click', () => {
  const partsInStorage = JSON.parse(localStorage.getItem('parts'));
  if (partsInStorage) {
    localStorage.removeItem('parts');
    alert('Resetting...')
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } else {
    alert('Model has been reset.')
  };
});

// Display Info Box
infoIcon.addEventListener('click', () => {
  infoBox.style.display = 'block';
})
infoBoxBtn.addEventListener('click', () => {
  infoBox.style.display = 'none';
})
//////* 　↑↑↑↑↑　Editor's UI ↑↑↑↑↑　*//////

// Scene
scene = new THREE.Scene();
scene.background = new THREE.Color(sceneBgColor);
scene.fog = new THREE.Fog(sceneBgColor, 20, 100);

// Loader
loader = new GLTFLoader();
loader.load(MODEL_PATH, (gltf) => {
  theModel = gltf.scene;
  // loop theModel's shadow
  theModel.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  })
  theModel.scale.set(modelScale, modelScale, modelScale);
  theModel.position.y = -0.5;
  // set initial textures
  INITIAL_MAP.forEach(part => initColor(theModel, part.childID, part.mtl));
  scene.add(theModel);
})

// Light
hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set( -8, 12, 8 );
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

// Floor
const floorGeometry = new THREE.PlaneGeometry(500, 500);
const floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xD1D1D1,
  shininess: 0
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);


// Camera
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.z = 5;

// Renderer
renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);
renderer.shadowMap.enabled = true;

// Update
function animate () {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

// Orbit Controls
new OrbitControls(camera, renderer.domElement);

// Window Resize
function onWindowResize () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

document.body.append(renderer.domElement);
window.addEventListener('resize', onWindowResize);
animate();
