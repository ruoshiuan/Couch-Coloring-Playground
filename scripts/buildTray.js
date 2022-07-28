import { textures } from './textures.js';

export function buildTextures (tray) {
  for (let [i, texture] of textures.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('texture');
    if (texture.texture) {
      swatch.style.backgroundImage = `url(${ texture.texture })`;
    } else {
      swatch.style.background = `#${ texture.color }`;
    }
    swatch.setAttribute('data-key', i);
    tray.append(swatch);
  }
};
