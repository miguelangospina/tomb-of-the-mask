function dibujarMapa(world, processing) {
  forEach(world.matrix, (row, i) => {
    forEach(row, (cell, j) => {
      if (cell == mapa.moneda && play) {
        let c = processing.color(294, 196, 17);
        processing.fill(c);
        processing.ellipse(
          j * SIZE + SIZE / 2,
          i * SIZE + SIZE / 2,
          SIZE / 2,
          SIZE / 2
        );
      }
      if (cell == mapa.pared && play) {
        // si se encuentra con una pared (1) dibuja algo
        //Dibuje lo que desea mostrar
        processing.image(muro, j * SIZE, i * SIZE, SIZE, SIZE);
      }
    });
  });
}
/*
 * Posiciona a mask donde haya una "M" en la matriz
 * @param {world}
 * @return {mask}
 */
function inicializarMask(world) {
  return forEachWithReturn(world.matrix, (row, i) => {
    return forEachWithReturn(row, (cell, j) => {
      if (cell == world.mask)
        return Object.assign(mapa.mask, { x: j * 37 }, { y: i * 37 });
    });
  });
}

function dibujarMaskAnimado(imagen, world, processing) {
  // dibuja el mask en el mapa
  canvas.getContext("2d").globalAlpha = 0.8;
  // processing.image(maskImage, 3, 2, 37, 37);
  if (play) {
    processing.image(maskImage, world.mask.x * 30, world.mask.y * 30, 30, 30);
  }
}
/**
 *
 * @param {lista} l
 * @param {funcion} f
 * @param {integer} index
 */

function forEach(l, f, index = 0) {
  if (!isEmpty(l)) {
    f(first(l), index);
    forEach(rest(l), f, index + 1);
  }
}

/**
 *
 * @param {lista} l
 * @param {function} f
 * @param {integer} index
 */

function forEachWithReturn(l, f, index = 0) {
  if (!isEmpty(l)) {
    let r = f(first(l), index);
    if (r) return r;
    return forEachWithReturn(rest(l), f, index + 1);
  }
}
