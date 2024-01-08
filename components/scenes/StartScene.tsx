class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    this.load.image("bouncebacklogo", "../assets/bouncebackreloadedlogo.svg");
    this.load.image("background", "../assets/bg.svg");
  }

  create() {
    const bg = this.add.image(0, 0, "background").setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    this.game.canvas.style.cursor = "pointer";

    const canvasHeight = this.sys.canvas.height;
    const canvasWidth = this.sys.canvas.width;

    const centerX = canvasWidth / 2;

    const logoY = canvasHeight / 4;
    const logo = this.add
      .sprite(centerX, logoY, "bouncebacklogo")
      .setOrigin(0.5);
    logo.setScale(1.1); // Set scale to half

    const textY = (canvasHeight * 3) / 4;

    // Add the directions text in the middle
    const directionsY = canvasHeight / 2;
    const leftAlignX = centerX - 145; // Adjust this value to fit your layout

    this.add
      .text(leftAlignX, directionsY, "DIRECTIONS:", {
        // Slightly move it up to not overlap with the next line
        fontSize: 18,
        fontStyle: "bold",
        fontFamily: "Montserrat",

        color: "#ffffff",
        align: "left",
      })
      .setOrigin(0, 0.5);

    this.add
      .text(
        leftAlignX,
        directionsY + 40,
        "Click to jump & bounce back off non-red \nwall spots to score & earn points",
        {
          fontSize: 14,
          color: "#ffffff",
          align: "left",
          fontFamily: "Montserrat",
          lineSpacing: 5,
        }
      )
      .setOrigin(0, 0.5);

    this.add
      .text(centerX, textY + 25, "CLICK TO PLAY", {
        fontSize: 18,
        color: "#ffffff",
        fontStyle: "bold",
        align: "center",
        fontFamily: "Montserrat",
      })
      .setOrigin(0.5);

    this.input.on("pointerdown", () => {
      this.scene.start("MainScene");
    });
  }

  shutdown() {
    this.game.canvas.style.cursor = "default";
  }
}

export default StartScene;
