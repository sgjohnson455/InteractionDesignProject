function preload() {
    img = loadImage('/assets/awesomeCar.png')
    audio = loadSound('/assets/sound/carCrash.mp3')
}

function setup() {
  createCanvas(500, 500);

  // button logic
  button = createButton("Toggle Sound");
  button.position(width/ 2, height / 4);
}

function draw() {
  background("white");
  imageMode(CENTER);

  image(img, width/2, height/2, 200, 150);
  button.mouseClicked(togglesound);
}

function togglesound() {
  if (audio.isPlaying()) {
    audio.stop();
  } else {
    audio.play();
  }
}
