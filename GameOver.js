
class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create(){
    this.text = this.add.text(400, 300, "you got cancelled",
      { fontSize: '32px', fill: '#000000' });
  }


  update() {

    this.F = this.input.keyboard.addKeys('F');
    if (this.F.F.isDown) {
      this.scene.start("playGame");
    }
  }
}
