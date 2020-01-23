
class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    this.load.image("background", "assets/background.png");
    this.load.image("table", "assets/table.png");
    this.load.image("couch", "assets/hotCouch.png");

    this.load.spritesheet("podcaster", "assets/podcaster.png", {
      frameWidth: 171,
      frameHeight: 195
    });

    this.load.spritesheet("take", "assets/take.png", {
      frameWidth: 80,
      frameHeight: 80
    });

    this.load.spritesheet(
      'explosion',
      'assets/explosion.png',
      { frameWidth: 100, frameHeight: 100 }
    );
  }

  create() {
    this.add.text(20, 20, "Loading game...");
    this.scene.start("playGame");
  }
}
