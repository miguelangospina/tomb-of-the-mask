/*
  DOCUMENTACIÓN
  https://photonstorm.github.io/phaser3-docs/index.html
  https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html
*/

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

let platforms = null;
let player = null;
let cursors = null;
let score = 0;
let scoreText = null;
let gameOver = false;

// Esto se llama antes de iniciar (espacio de trabajo)
function preload() {
  this.load.image("background", "assets/img/background-2000.png");
  this.load.image("ground", "assets/img/platform.png");

  this.load.spritesheet("player", "assets/img/player.png", {
    frameWidth: 32,
    frameHeight: 48,
  });

  this.load.spritesheet("coin", "assets/img/coin.png", {
    frameWidth: 32,
    frameHeight: 32,
  });

  this.load.audio("coin-sound", "assets/sound/coin-sound.mp3");
  this.load.audio("soundtrack", "assets/sound/intro.mp3");
  this.load.audio("jump", "assets/sound/jump.mp3");
}

// Dibuja algo en el canvas. Aqui se pone todo lo que quieras pintar
function create() {
  this.add.image(400, 300, "background").setScale(1.5, 1.8);
  // configuramos los limites del escenario
  this.physics.world.setBounds(0, 0, 1400, 800, 64, true, true, true, true);

  // Reproducimos en loop el soundtrack
  this.sound.play("soundtrack", { loop: true });

  // configuracion de la camara
  this.cameras.main.setSize(2000, 900);
  this.cameras.main.setPosition(-900, -28);
  this.cameras.main.setDeadzone(400, 400);

  // Creamos un grupo para añadir las plataformas
  platforms = this.physics.add.staticGroup();

  // Suelo donde camnina el personaje (plataforma invisible)
  platforms
    .create(1200, 470, "ground")
    .setScale(6, 0.5)
    .refreshBody()
    .setVisible(false);

  cursors = this.input.keyboard.createCursorKeys(); // eventos de teclado
  player = this.physics.add.sprite(100, 430, "player");

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Animaciones del personaje
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "player", frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // Animacion moneda
  this.anims.create({
    key: "turn-coin",
    frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  scoreText = this.add.text(player.x, 16, "Score: 0", {
    fontSize: "32px",
    fill: "#fff",
    fontWeight: "bold",
    fontFamiy: "'VT323', monospace, sans-serif",
    display: "fixed",
  });

  this.cameras.main.startFollow(player);

  // colision del personaje con las plataformas
  this.physics.add.collider(player, platforms);

  // Añadiendo monedas
  iterate(6, (i) => {
    const coin = this.physics.add.sprite(300 + i * 95, 430, "coin");
    this.physics.add.collider(coin, platforms);
    coin.anims.play("turn-coin", true);

    this.physics.add.overlap(player, coin, collectCoin, null, this);
  });
}

// Actualiza el mundo despues de cada frame
function update() {
  if (gameOver) {
    this.add.text(scoreText.x + 200, 250, "GAME OVER!", {
      fontSize: "50px",
      fill: "#fff",
      fontWeight: "bold",
      fontFamiy: "'VT323', monospace, sans-serif",
    });

    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
    scoreText.setPosition(player.x, scoreText.y);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
    scoreText.setPosition(player.x, scoreText.y);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
    this.sound.play("jump");
  }
}

// Iterador recursivo
function iterate(end, func, start = 0) {
  if (start === end) return;
  else {
    func(start);
    iterate(end, func, start + 1);
  }
}

// Funciones para el manejo de colisiones
function collectCoin(player, coin) {
  coin.disableBody(true, true);
  this.sound.play("coin-sound");

  score += 10;
  scoreText.setText("Score: " + score);
}

// Adjuntamos nuestra configuración a la libreria phaser
const game = new Phaser.Game(config);
