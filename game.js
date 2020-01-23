var config = {
  width: 800,
  height: 600,
  backgroundColor: 0xFFFFFF,
  scene: [Scene1, Scene2],
  physics: {
    default: "arcade",
    arcade:{
        debug: false
    }
  }
};

var game = new Phaser.Game(config);
