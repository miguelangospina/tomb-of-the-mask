const {
  append,
  cons,
  first,
  isEmpty,
  isList,
  length,
  rest,
  map,
} = require("fl-extended");

const M = "M"; // mask
function make(data, attribute) {
  //console.log(Object.assign({}, data, attribute))
  return Object.assign({}, data, attribute);
}

/*Contrato: list, funcion -> number
Propósito: esta función aplica una función a una lista, si está vacia retorna el primero de la lista de lo contrario retorna el resto de la función permitiendo que el agua se actualice
Prototipo: apply(a,f){cuerpo de la función}*/

function apply(a, f) {
  if (!isEmpty(a)) {
    f(first(a));
    apply(rest(a), f);
  }
}

/*Contrato: moveAwa: const->agua
Propósito: esta función lleva una asignación constante que sera igual al first(awa) y retorna el elemento value al comienzo de la lista.
Prototipo: moveAwa(awa,dir){cuerpo de la función}*/

function moveAwa(awa, dir) {
  const head = first(awa);
  return cons(
    { x: head.x + dir.x, y: head.y + dir.y },
    awa.slice(0, length(awa) - 1)
  ); //actualiza el agua
}

let vida = 3;
let puntaje = 0;
const life = document.getElementById("vidas");
let progresoP = (puntaje / 72) * 100;
const progreso = document.getElementById("progress");
progreso.style.setProperty("--width", progresoP);
const audio = new buzz.sound("sounds/audio.mp3");
const audioMoneda = new buzz.sound("sounds/coin-sound.mp3");

let adver = 0;
let muro = null;
let muñ = null;
let oro = null;
let coin = null;
let final = false;
const mapa = {
  size: {
    width: 888,
    height: 600,
  },
  pared: 1,
  camino: 0,
  moneda: 2,
  mask: "M",
};
const SIZE = 30;
const framesPerSecond = 60; //el mundo se dibuja en 47 veces por segundo
const pantallaEstadoDelJuego = document.getElementById("game-status"); // muestra vidas y puntaje
play = false;

const estadoInicial = {
  //estado inicial del juego
  time: 0,
  mask: {
    x: 13,
    y: 18,
  },
  matrix: [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 1, 2, 1, 0, 1, 0, 2, 1, 0, 1, 2, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 2, 1, 2, 1, 0, 0, 2, 1, 2, 0, 2, 1, 2, 0, 1, 2, 2, 0, 2, 1, 2, 0, 1],
    [1, 2, 1, 2, 1, 0, 0, 1, 2, 2, 0, 2, 2, 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 1],
    [1, 2, 1, 2, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 1, 1, 2, 0, 0, 0, 0, 2, 1, 2, 1, 0, 2, 1, 2, 0, 1],
    [1, 2, 2, 2, 0, 0, 0, 1, 2, 0, 0, 1, 1, 1, 1, 1, 2, 1, 0, 1, 2, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1],
    [1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 1, 1],
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
    [1, 2, 0, 1, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0, 0, 0, 1, 2, 0, 0, 1, 1, 0, 1],
    [1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 2, 0, 1],
    [1, 2, 2, 0, 0, 1, 2, 0, 0, 0, 0, 0, 0, 2, 1, 0, 1, 2, 0, 0, 1, 2, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 2, 0, 1],
    [1, 2, 2, 2, 0, 1, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 0, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
    [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, M, 1, 0, 0, 0, 0, 0, 0, 2, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
  monedas: 0,
  vidas: 3,
  awa: [{ x: -1, y: 20 }],
  dir: { x: 0, y: -1 / 225 },
};

function sketchProc(processing) {
  // esto se llama antes de iniciar el juego
  processing.setup = function () {
    //se ejecuta una vez cuando se inicia el juego
    processing.frameRate(framesPerSecond); //se actualiza 48 veces por segundo
    processing.size(mapa.size.width, mapa.size.height); //tamaño del mapa
    muro = processing.loadImage("images/muro4.JPG");
    muñ = processing.loadImage("images/tomb.png");
    oro = processing.loadImage("images/mony.png");
    coin = processing.loadImage("images/moneda.png");
    maskImage = processing.loadImage("images/tomb.png");

    const copiaEstadoInicial = Object.assign(estadoInicial);
    processing.state = copiaEstadoInicial;

    // enfocar el canvas al inicio
    document.getElementById("canvas").focus();
  };

  // se ejecuta 48 veces por segundo.
  processing.draw = function () {
    life.innerHTML = "Vidas: " + vida;
    pantallaEstadoDelJuego.innerHTML = "Puntaje: " + puntaje;
    progresoP = (puntaje / 72) * 100;
    progreso.style.setProperty("--width", progresoP);
    processing.drawGame(processing.state);
    processing.state = processing.onTic(processing.state);
  };

  // dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
  processing.drawGame = function (world) {
    processing.background(20, 35, 80); //pinta el color del fondo del tablero
    if (play) {
      //comprueba si el juego comienza
      audio.play().loop();
      apply(world.awa, (sn) => {
        processing.fill(25, 184, 243); //color del agua
        processing.rect(sn.x + 1 * SIZE, sn.y * SIZE, SIZE + 633, SIZE + 600); //dibuja el agua al mundo
      });
    } else audio.stop();
    dibujarMaskAnimado(maskImage, world, processing);
    dibujarMapa(world, processing);
  };

  // actualiza el mundo en cada tic del reloj. Retorna el nuevo estado del mundo

  processing.onTic = function (world) {
    let posy = world.mask.y;
    let agua = first(world.awa);
    let money = world.monedas;
    if (agua.y.toFixed(1) <= posy + 0.3 && !reinicio && vida > 0) {
      vida = vida - 1;
      reinicio = true;
      return make(world, { vidas: vida });
    }
    if (reinicio) {
      //verifica si oprimes el boton de reinicio (reinicio==true)
      reinicio = false; //define reinicio en false de nuevo
      return make(world, estadoInicial); //devuelve el mundo al estado inicial
    }
    if (money == 72 && vida > 0 && !final) {
      //verifica si el jugador obtuvo todas las monedas y no perdio todas las vidas
      final = true;
      document.getElementById("finalT").style.display = "flex";
    }
    if (adver == 2 && !reinicio && vida > 0) {
      //verifica si el estado de la advertencia es 2, si reinicio==false y no ha perdido todas las vidas (si el usuario choco con un muro)
      adver = 0; //define advertencia devuelta al estado 0
      iniciarJ(4);
      vida = vida - 1; //quita una vida al jugador
      reinicio = true; //define reinicio en true (reinicia el juego)
      return make(world, { vidas: vida }); //devuelve la catidad de vidas al marcador
    }
    if (play && vida > 0 && Math.trunc(agua.y) > 0 && !final) {
      //verifica si el jugador dio play, no ha perdido todas las vida y el agua no ha alcanzado al jugador.
      return make(world, { awa: moveAwa(world.awa, world.dir) }); //ejecuta la funcion que hace que el agua suba
    } else if (vida > 0) {
      return make(world, {});
    } else if (vida == 0) {
      //verifica si el jugador perdio todas las vidas
      play = false;
      final = true; //termina el juego
      document.getElementById("advertencia").style.display = "none";
      document.getElementById("loser").style.display = "flex";
      document.getElementById("cargaJ").style.display = "flex";
    }
  };
  processing.onMouseEvent = function (world, event) {
    return make(world, {});
  };
  // actualiza el mundo cada vez que se oprime una tecla. Retorna el nuevo estado del mundo
  processing.onKeyEvent = function (world, keyCode, n = 0) {
    let posx = world.mask.x;
    let posy = world.mask.y;
    const mapa = world.matrix;
    let agua = first(world.awa);

    if (keyCode == processing.LEFT && play && !final) {
      if (mapa[posy][posx - 1] != 1) {
        if (mapa[posy][posx - 1] == 2) {
          mapa[posy][posx - 1] = 0;
          puntaje = puntaje + 1;
          audioMoneda.stop();
          audioMoneda.play();
          iniciarJ(5);
          return make(world, {
            mask: { x: posx - 1, y: posy },
            matrix: mapa,
            monedas: puntaje,
          });
        } else {
          iniciarJ(5);
          return make(world, { mask: { x: posx - 1, y: posy } });
        }
      } else {
        if (adver < 2) {
          adver = adver + 1;
          iniciarJ(4);
        }
        return make(world, {});
      }
    } else if (keyCode == processing.RIGHT && play && !final) {
      if (mapa[posy][posx + 1] != 1) {
        if (mapa[posy][posx + 1] == 2) {
          mapa[posy][posx + 1] = 0;
          puntaje = puntaje + 1;
          audioMoneda.stop();
          audioMoneda.play();
          iniciarJ(5);
          return make(world, {
            mask: { x: posx + 1, y: posy },
            matrix: mapa,
            monedas: puntaje,
          });
        } else {
          iniciarJ(5);
          return make(world, { mask: { x: posx + 1, y: posy } });
        }
      } else {
        if (adver < 2) {
          adver = adver + 1;
          iniciarJ(4);
        }
        return make(world, {});
      }
    } else if (keyCode == processing.UP && play && !final) {
      if (mapa[posy - 1][posx] != 1) {
        if (mapa[posy - 1][posx] == 2) {
          mapa[posy - 1][posx] = 0;
          puntaje = puntaje + 1;
          audioMoneda.stop();
          audioMoneda.play();
          iniciarJ(5);
          return make(world, {
            mask: { x: posx, y: posy - 1 },
            matrix: mapa,
            monedas: puntaje,
          });
        } else {
          iniciarJ(5);
          return make(world, { mask: { x: posx, y: posy - 1 } });
        }
      } else {
        if (adver < 2) {
          adver = adver + 1;
          iniciarJ(4);
        }
        return make(world, {});
      }
    } else if (keyCode == processing.DOWN && play && !final) {
      if (mapa[posy + 1][posx] != 1) {
        if (mapa[posy + 1][posx] == 2) {
          mapa[posy + 1][posx] = 0;
          puntaje = puntaje + 1;
          audioMoneda.stop();
          audioMoneda.play();
          iniciarJ(5);
          return make(world, {
            mask: { x: posx, y: posy + 1 },
            matrix: mapa,
            monedas: puntaje,
          });
        } else {
          iniciarJ(5);
          return make(world, { mask: { x: posx, y: posy + 1 } });
        }
      } else {
        if (adver < 2) {
          adver = adver + 1;
          iniciarJ(4);
        }
        return make(world, {});
      }
    } else if (!play && keyCode) {
      iniciarJ(3);
      iniciarJ(5);
      return make(world, {});
    } else {
      return make(world, {});
    }
  };

  // esta función se ejecuta cada vez que presionamos una tecla.
  processing.keyPressed = function () {
    processing.state = processing.onKeyEvent(
      processing.state,
      processing.keyCode
    );
  };
  processing.mouseMoved = function () {
    processing.state = processing.onMouseEvent(processing.state, {
      action: "move",
      mouseX: processing.mouseX,
      mouseY: processing.mouseY,
    });
  };
  processing.mouseClicked = function () {
    processing.state = processing.onMouseEvent(processing.state, {
      action: "click",
      mouseX: processing.mouseX,
      mouseY: processing.mouseY,
      mouseButton: processing.mouseButton,
    });
  };
  processing.mouseReleased = function () {
    processing.state = processing.onMouseEvent(processing.state, {
      action: "release",
      mouseX: processing.mouseX,
      mouseY: processing.mouseY,
      mouseButton: processing.mouseButton,
    });
  };
}

var canvas = document.getElementById("canvas");
var processingInstance = new Processing(canvas, sketchProc);
