
class Scene2 extends Phaser.Scene {
  constructor() {
    super("playGame");
  }

  create(){

    // Build objects
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0,0);

    // our hero
    this.podcaster = this.physics.add.sprite(400, 300, 'podcaster');
    this.health = 50;
    this.bank = 0;

    // table
    this.table = this.physics.add.staticGroup();
    this.table.create(650, 500, 'table');

    // hot couch
    this.couch = this.physics.add.staticGroup();
    this.couch.create(80, 300, 'couch');

    // take
    this.x = 700;
    this.y = 200;
    this.swap = true;
    this.novelty = 5;
    this.take = this.physics.add.sprite(this.x, this.y, 'take');

    // waddle engine
    this.anims.create({
      key: 'stop',
      frames: this.anims.generateFrameNumbers('podcaster',
        { start: 27, end: 27 }),
      frameRate: 20,
      repeat: -1
    });

    this.anims.create({
      key: 'walkX',
      frames: this.anims.generateFrameNumbers('podcaster',
        { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walkDown',
      frames: this.anims.generateFrameNumbers('podcaster',
        { start: 9, end: 16 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'walkUp',
      frames: this.anims.generateFrameNumbers('podcaster',
        { start: 18, end: 25 }),
      frameRate: 10,
      repeat: -1
    });

    // create take
    this.anims.create({
      key: 'hot',
      frames: this.anims.generateFrameNumbers('take',
        { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.take.anims.play('hot', true);

    // cancel
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', { start: 1, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

    // collisions
    this.podcaster.setCollideWorldBounds(true);
    this.physics.add.collider(this.podcaster, this.table);
    this.physics.add.collider(this.podcaster, this.couch);
    this.physics.add.collider(this.podcaster, this.take, this.hit_take, null, this);


    //  The score
    this.bank_text = this.add.text(16, 16, 'Bank: $0',
      { fontSize: '32px', fill: '#000' });
    this.health_text = this.add.text(16, 48, 'Health: 50%',
      { fontSize: '32px', fill: '#000' });
    this.gameOver = this.add.text(200, 300, "",
      { fontSize: '32px',
        fill: '#000000',
        shadow: {
            offsetX: 1,
            offsetY: 1,
            color: '#FFF',
            fill: true
        }
      });
    this.newPod = this.add.text(100, 332, "",
      { fontSize: '32px',
        fill: '#000000',
        shadow: {
            offsetX: 1,
            offsetY: 1,
            color: '#FFF',
            fill: true
        }
      });
    // pause
    this.pause = false;
  }

  walk (podcaster, up, down, left, right, velocity, pause) {

    let velX = velocity;
    let velY = velocity;

    if (pause) {
      podcaster.anims.play('stop', true);
      velX = velY = 0;
    } else if ((left && !right) || (!left && right)) {
      podcaster.anims.play('walkX', true);
      podcaster.flipX = left;

      if (left) {
        velX *= -1;
      }

      if ((up && !down) || (!up && down)) {
        velX /= Math.sqrt(2);
        velY /= Math.sqrt(2);
        if (up) {
          velY *= -1;
        }
      } else {
        velY = 0;
      }

    } else if ((up && !down) || (!up && down)) {
      velX = 0

      if (up) {
        podcaster.anims.play('walkUp', true);
        velY *= -1;
      } else {
        podcaster.anims.play('walkDown', true);
      }
    } else {
      podcaster.anims.play('stop', true);
      velX = velY = 0;
    }

    podcaster.setVelocityX(velX);
    podcaster.setVelocityY(velY);

  }

  hit_take () {
    // reposition take
    this.zone1 = [[170,200],[400,500]];
    this.zone2 = [[500,200],[750,350]];
    this.x_splosion = this.take.x;
    this.y_splosion = this.take.y;
    if (Phaser.Math.Between(1,15) == 1){
      this.cancelled();
    }
    if (this.swap) {
      this.take.x = Phaser.Math.Between(this.zone1[0][0], this.zone1[1][0]);
      this.take.y = Phaser.Math.Between(this.zone1[0][1], this.zone1[1][1]);
      this.swap = false;
    } else {
      this.take.x = Phaser.Math.Between(this.zone2[0][0], this.zone2[1][0]);
      this.take.y = Phaser.Math.Between(this.zone2[0][1], this.zone2[1][1]);
      this.swap = true;
    }
    this.health -= Phaser.Math.Between(6, 1);
    this.novelty -= Phaser.Math.Between(1, 3);
    this.bank += Phaser.Math.Between(this.novelty, 8);
    this.health_text.setText('Health: ' + this.health + '%');
    if (this.bank < 0) {
      this.bank_text.setText('Bank: -$' + Math.abs(this.bank));
    } else {
      this.bank_text.setText('Bank: $' + this.bank);
    }
    this.health_text.setText('Health: ' + this.health + '%');
    this.take.setVelocityX(0);
    this.take.setVelocityY(0);
  }

  cancelled () {
    this.gameOver.setText("you got cancelled");
    this.newPod.setText("press 'F' to start new podcast");
    this.explosion = this.physics.add.sprite(this.x_splosion, this.y_splosion, 'explosion');
    this.explosion.anims.play('explode');
    this.pause = true;
  }

  new_pod (pause, pressF) {
    if (pause && pressF) {
      this.pause = false;
      this.health = 50;
      this.bank = 0;
      this.x = 700;
      this.y = 200;
      this.swap = true;
      this.novelty = 5;
      this.health_text.setText('Health: ' + this.health + '%');
      this.bank_text.setText('Bank: $' + this.bank);
      this.gameOver.setText('');
      this.newPod.setText('');
    }
  }

  update() {

    this.keys = this.input.keyboard.addKeys('W,S,A,D,F');
    this.velocity = 250;

    // walk
    this.walk(
      this.podcaster,
      this.keys.W.isDown,
      this.keys.S.isDown,
      this.keys.A.isDown,
      this.keys.D.isDown,
      this.velocity,
      this.pause
    );

    this.new_pod(this.pause, this.keys.F.isDown);
  }
}
