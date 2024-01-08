class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("spaceinvaders", "../assets/space_invaders.png");
  }
  create() {
    this.game.canvas.style.cursor = "pointer";
    this.add.sprite(400, 300, "spaceinvaders");
    this.input.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }
  shutdown() {
    this.game.canvas.style.cursor = "default";
  }
}

export default StartScene;
