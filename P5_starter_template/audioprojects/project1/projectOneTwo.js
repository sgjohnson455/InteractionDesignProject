let botCount = 2;
let trashBotCount = 3;


// i represents y (rows)
// j represents x (columns)



// pixel size
const gS = 5;
// resolution scale
const screen_rows = 100; // (y)
const screen_cols = 100;
const rowPX = screen_rows * gS;
const colPX = screen_cols * gS;

// let player_direc = 'w';
// let player_x = 10;
// let player_y = 10;

let bot_coords = [];
let trashbot_coords = [];
let food_coords = [];
let dropOff = []

//sounds
let bgTracks = [];

// Sound Library
function preload() {
  spawnSound = loadSound('audioprojects/project1/audio/spawnSound.mp3');
  trashIncineration = loadSound('audioprojects/project1/audio/trashIncineration.mp3');
  trashBeat = loadSound('audioprojects/project1/audio/trashBeat.mp3');
  fireBurst = loadSound('audioprojects/project1/audio/fireBurst.mp3');
  trashDump = loadSound('audioprojects/project1/audio/trashDump.mp3');

  // BACKGROUND
  bgBeat = loadSound('audioprojects/project1/audio/bgBeat.mp3');
  // background track list
  bgTracks.push(loadSound('audioprojects/project1/audio/firstChord.mp3'));
  bgTracks.push(loadSound('audioprojects/project1/audio/secondChord.mp3'));
  bgTracks.push(loadSound('audioprojects/project1/audio/thirdChord.mp3'));
  //bgTracks.push(loadSound('audio/thirdChord.mp3'));

}


// Classes

class Screen {
  constructor(rows, cols, gS = 5) {
    this.rows = rows;
    this.cols = cols;
    this.gS = gS;
    this.screen = []

    // create main Render Array 
    for (let i = 0; i < cols; i++) {
      this.screen[i] = [];
      for (let j = 0; j < rows; j++) {
        this.screen[i][j] = new Pixel();
      }
    }
  }

  // give x y and pixel object
  px(x, y, pixel) {
    if (x < 0 || y < 0 || x >= this.cols || y >= this.rows) return; // check
    this.screen[x][y] = pixel;
  }

  // return pixel at spot
  getPx(x, y) {
    return this.screen[x][y];
  }

  // IMPORTANT: Renders every pixel in the matrix: screen 
  renderScreen() {
    noStroke();
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        fill(this.screen[i][j].getColor()); // set fill to color of pixel
        rect(i * gS, j * gS, gS, gS); // render every 10 x 10 pixel
      }
    }
  }

  setBackground() {
    this.stableBackground();
  }

  // Additional Backgrounds
  natureBackground() {

    let maxFood = 20; // adjust as needed
    let foodScale = constrain(food_coords.length / maxFood, 0, 1);

    //iterate over screen matrix and apply
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // Set the noise level and scale.
        let noiseLevel = 255;
        let noiseScale = 1;
        // background set logic (per pixel)
        //if (screen[i][j].getColor() === null) {
        //this.screen[i][j].setColor('grey');
        let nx = noiseScale * i;
        let ny = noiseScale * j * random(0, 0.20);

        let multiply = 1;
        let lighten = 0;

        //let c = color(0 * multiply + lighten, noiseLevel * noise(nx, ny) * multiply + lighten, 0 * multiply + lighten);
        let c = color(0 * 5 + lighten, foodScale * 10 * multiply + lighten, noiseLevel * noise(nx, ny) * multiply + lighten);
        //console.log(c)
        // Draw the point.
        let grass_temp = new Pixel(c, 'b');
        screen.px(i, j, grass_temp);
      }
    }
  }

  stableBackground() {
    let maxFood = 25; // max food to scale darkness
    let foodFactor = constrain(food_coords.length / maxFood, 0, 1);
    // 0 = no food, 1 = max food (fully dark)

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let noiseScale = 0.1; // controls noise pattern
        let nx = i * noiseScale;
        let ny = j * noiseScale;

        // base blue value: decrease with food count
        let baseB = 255 * (1 - foodFactor);

        // add smooth noise variation
        let c = color(0, 0, baseB * noise(nx, ny));

        screen.px(i, j, new Pixel(c, 'b'));
      }
    }
  }
}

class Pixel { // default is empty
  constructor(color = null, owner = 'bg') {
    this.owner = owner; // who the pixel belongs to
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  getOwner() {
    return this.owner;
  }

  setColor(color) {
    this.color = color;
  }
}

class FoodCoords {
  constructor(x, y, spawnTime) {
    this.x = x;
    this.y = y;
    this.spawnTime = spawnTime; // track
  }
  getX() { return this.x; }
  getY() { return this.y; }

  setX(x) { this.x = x; }
  setY() { this.y = this.y; }

  // when called on food number, remove said thing
  foodCollected(num) {
    food_coords.splice(indexToRemove, 1);
  }
}

class BotCoords {
  constructor(x, y, direc) {
    this.x = x;
    this.y = y;
    this.direc = direc;
    this.carrying = false; // is the robot carrying food?

    this.targetX = null;
    this.targetY = null;
    this.lastDropX = null;
    this.lastDropY = null;
  }
  getX() { return this.x; }
  getY() { return this.y; }
  getDirec() { return this.direc; }

  setX(v) { this.x = v; }
  setY(v) { this.y = v; }
  setDirec(v) { this.direc = v; }
}

class Bot {
  constructor(num) {
    this.x = bot_coords[num].getX();
    this.y = bot_coords[num].getY();
    this.direc = bot_coords[num].getDirec();
    this.screen = screen;
    this.num = num;

    // where it last dropped food
    this.lastDropX = null;
    this.lastDropY = null;
  }

  // takes in a 2x2 matrix to render onto
  show() {
    let botColor = bot_coords[this.num].carrying
      ? color('yellow')
      : color('cyan');
    // change color based on if its carrying trash
    let bot2Color = color('white');
    let showWings = true;

    // get reference to bot info here
    let bnum = bot_coords[this.num].getDirec();

    let bx = this.x;
    let by = this.y;
    let pB = new Pixel(botColor, 'b');
    let p2B = new Pixel(bot2Color, 'b');
    let pTip = new Pixel(color(225), 'b'); // wing tip color

    switch (bnum) {
      case 'w':
        screen.px(bx, by, pB);
        screen.px(bx + 1, by, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by - 1, p2B);

        // wing tips
        if (showWings) {
          screen.px(bx - 1, by + 1, pTip); // left tip
          screen.px(bx + 1, by + 1, pTip); // right tip
        }
        break;

      case 's':
        screen.px(bx, by, pB);
        screen.px(bx + 1, by, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by + 1, p2B);

        if (showWings) {
          screen.px(bx - 1, by - 1, pTip); // left tip
          screen.px(bx + 1, by - 1, pTip); // right tip
        }
        break;

      case 'a':
        screen.px(bx, by, pB);
        screen.px(bx, by + 1, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by - 1, p2B);

        if (showWings) {
          screen.px(bx + 1, by + 1, pTip); // lower tip
          screen.px(bx + 1, by - 1, pTip); // upper tip
        }
        break;

      case 'd':
        screen.px(bx, by, pB);
        screen.px(bx, by + 1, p2B);
        screen.px(bx + 1, by, p2B);
        screen.px(bx, by - 1, p2B);

        if (showWings) {
          screen.px(bx - 1, by + 1, pTip); // lower tip
          screen.px(bx - 1, by - 1, pTip); // upper tip
        }
        break;
    }

  }

  // updates direction randomly, updates x, y, direct in bot_coords
  move(direction) { // tie to framerate for variable speeds
    if (frameCount % 3 == 0) {
      // set up references
      let bnum = bot_coords[this.num] // get bnum class here

      // store direction in list
      bot_coords[this.num].setDirec(direction);

      // update x, y in coord list based on input direction
      switch (direction) {
        case 's': if (this.y < screen_rows - 2) this.y++; break;
        case 'w': if (this.y > 1) this.y--; break;
        case 'd': if (this.x < screen_cols - 2) this.x++; break;
        case 'a': if (this.x > 1) this.x--; break;
      }

      // store updated location
      bot_coords[this.num].setX(this.x);
      bot_coords[this.num].setY(this.y);
    }
  }

  getNearestFood() {
    if (food_coords.length === 0) return null;

    let nearestFood = null;
    let bestDist = Infinity;

    for (let i = 0; i < food_coords.length; i++) {
      let f = food_coords[i];
      let d = dist(this.x, this.y, f.getX(), f.getY());
      if (d < bestDist) {
        bestDist = d;
        nearestFood = i;
      }
    }

    return nearestFood; // Returns [x, y] of the closest food
  }

  depositBehavior() {
    if (!bot_coords[this.num].carrying) return false;

    let depot = dropOff[0];
    let dx = depot.getX() - this.x;
    let dy = depot.getY() - this.y;

    // reached depot
    if (dx === 0 && dy === 0) {
      bot_coords[this.num].carrying = false;

      // toggle incinerator fire
      depotFire = true;

      // PLAY TRASH INCINERATION SOUND
      if (trashIncineration) {
        trashIncineration.setVolume(1.5);
        trashIncineration.play();
        fireBurst.setVolume(0.6);
        fireBurst.play();
      }

      return true;
    }

    if (abs(dx) > abs(dy)) {
      this.move(dx > 0 ? 'd' : 'a');
    } else if (dy !== 0) {
      this.move(dy > 0 ? 's' : 'w');
    }

    return false;
  }

  moveToFood() {
    let idx = this.getNearestFood();
    if (idx === null) return;

    let target = food_coords[idx];
    let dx = target.getX() - this.x;
    let dy = target.getY() - this.y;

    // reached trash
    if (dx === 0 && dy === 0) {
      food_coords.splice(idx, 1);
      this.carrying = true;
      bot_coords[this.num].carrying = true;

      // Play trash beat when bot picks up food
      if (trashBeat) {
        trashBeat.setVolume(1);
        trashBeat.play();
      }
      return;
    }

    if (random(1) > 0.5) {
      if (dx !== 0) {
        this.move(dx > 0 ? 'd' : 'a');
      } else {
        this.move(dy > 0 ? 's' : 'w');
      }
    } else {
      if (dy !== 0) {
        this.move(dy > 0 ? 's' : 'w');
      } else {
        this.move(dx > 0 ? 'd' : 'a');
      }
    }
  }
}


class TrashBot {
  constructor(num) {
    this.x = trashbot_coords[num].getX();
    this.y = trashbot_coords[num].getY();
    this.direc = trashbot_coords[num].getDirec();
    this.screen = screen;
    this.num = num;

    this.carrying = false;

    this.bot2Color = color(0, 50, 180);
  }

  show() {
    let botColor = color('yellow');

    let showWings = true;

    // get reference to bot info here
    let bnum = trashbot_coords[this.num].getDirec();

    let bx = this.x;
    let by = this.y;
    let pB = new Pixel(botColor, 'b');
    let p2B = new Pixel(this.bot2Color, 'b');

    switch (bnum) {
      case 'w':
        screen.px(bx, by, pB);
        screen.px(bx + 1, by, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by - 1, p2B);

        // extra decor
        if (showWings) {
          screen.px(bx - 1, by + 1, p2B);
          screen.px(bx + 1, by + 1, p2B);
        }
        break;
      case 's':
        screen.px(bx, by, pB);
        screen.px(bx + 1, by, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by + 1, p2B);

        // extra decor
        if (showWings) {
          screen.px(bx - 1, by - 1, p2B);
          screen.px(bx + 1, by - 1, p2B);
        }
        break;
      case 'a':
        screen.px(bx, by, pB);
        screen.px(bx, by + 1, p2B);
        screen.px(bx - 1, by, p2B);
        screen.px(bx, by - 1, p2B);
        // extra decor
        if (showWings) {
          screen.px(bx + 1, by + 1, p2B);
          screen.px(bx + 1, by - 1, p2B);
        }
        break;
      case 'd':
        screen.px(bx, by, pB);
        screen.px(bx, by + 1, p2B);
        screen.px(bx + 1, by, p2B);
        screen.px(bx, by - 1, p2B);
        // extra decor
        if (showWings) {
          screen.px(bx - 1, by + 1, p2B);
          screen.px(bx - 1, by - 1, p2B);
        }
        break;
    }

  }

  // updates direction randomly, updates x, y, direct in bot_coords
  move(direction) { // tie to framerate for variable speeds
    if (frameCount % 2 == 0) {
      // set up references
      let bnum = trashbot_coords[this.num] // get bnum class here

      // store direction in list
      trashbot_coords[this.num].setDirec(direction);

      // update x, y in coord list based on input direction
      switch (direction) {
        case 's': if (this.y < screen_rows - 2) this.y++; break;
        case 'w': if (this.y > 1) this.y--; break;
        case 'd': if (this.x < screen_cols - 2) this.x++; break;
        case 'a': if (this.x > 1) this.x--; break;
      }

      // store updated direction
      trashbot_coords[this.num].setX(this.x);
      trashbot_coords[this.num].setY(this.y);
    }

    this.carrying = false;
  }

  moveTowardTarget() {
    let coord = trashbot_coords[this.num];

    if (coord.targetX === null) return;

    let dx = coord.targetX - this.x;
    let dy = coord.targetY - this.y;

    let dir;

    if (abs(dx) > abs(dy)) {
      dir = dx > 0 ? 'd' : 'a';
    } else {
      dir = dy > 0 ? 's' : 'w';
    }

    this.move(dir);
  }

  updateBehavior() {
    let coord = trashbot_coords[this.num];
    let minDist = 10;

    // pick new target if none exist
    if (coord.targetX === null || coord.targetY === null) {
      let t = getValidTrashTarget(
        this.x,
        this.y,
        coord.lastDropX,
        coord.lastDropY,
        minDist
      );

      if (t) {
        coord.targetX = t.x;
        coord.targetY = t.y;
      }
    }

    // move to target
    this.moveTowardTarget();

    // check arrival
    if (
      coord.targetX !== null &&
      this.x === coord.targetX &&
      this.y === coord.targetY
    ) {
      // drop trash
      food_coords.push(new FoodCoords(this.x, this.y, millis()));

      // play trash dump sound
      if (trashDump) {
        trashDump.setVolume(1.2); // louder than default if you like
        trashDump.play();
      }

      // remember drop
      coord.lastDropX = this.x;
      coord.lastDropY = this.y;

      // clear target so a new one is chosen
      coord.targetX = null;
      coord.targetY = null;
    }
  }

  getTargetLocation() {
    this
  }

}


class Food {
  constructor(num) {
    this.x = food_coords[num].getX();
    this.y = food_coords[num].getY();

  }

  show() {
    screen.px(this.x, this.y, new Pixel(color('yellow'), 'f'));
  }

}

// Sound
class CrossfadeLooper {
  constructor(tracks, fadeDuration = 1800, maxVolume = 1.5) {
    this.tracks = tracks;              // array of p5.SoundFile objects
    this.fadeDuration = fadeDuration;  // in milliseconds
    this.maxVolume = maxVolume;

    this.currentIndex = 0;
    this.nextIndex = this.getRandomNextIndex();

    this.isCrossfading = false;
    this.crossfadeStartTime = null;

    // start first track
    if (this.tracks.length > 0) {
      this.tracks[this.currentIndex].setVolume(this.maxVolume);
      this.tracks[this.currentIndex].loop(); // loop the first track
    }
  }

  // helper to pick a random track index not equal to current
  getRandomNextIndex() {
    if (this.tracks.length <= 1) return 0;
    let idx;
    do {
      idx = floor(random(0, this.tracks.length));
    } while (idx === this.currentIndex);
    return idx;
  }

  update() {
    if (this.tracks.length < 2) return;

    let currentTrack = this.tracks[this.currentIndex];
    let nextTrack = this.tracks[this.nextIndex];

    // If current track is near the end and not already crossfading, start next track
    if (!this.isCrossfading && currentTrack.isPlaying()) {
      let remaining = currentTrack.duration() * 1000 - currentTrack.currentTime() * 1000;
      if (remaining <= this.fadeDuration) {
        this.isCrossfading = true;
        this.crossfadeStartTime = millis();
        nextTrack.loop();        // start the next track
        nextTrack.setVolume(0);  // start silent
      }
    }

    // handle crossfade
    if (this.isCrossfading) {
      let t = constrain((millis() - this.crossfadeStartTime) / this.fadeDuration, 0, 1);
      currentTrack.setVolume(this.maxVolume * (1 - t));
      nextTrack.setVolume(this.maxVolume * t);

      if (t >= 1) {
        this.isCrossfading = false;
        currentTrack.stop(); // stop old track
        this.currentIndex = this.nextIndex;
        this.nextIndex = this.getRandomNextIndex(); // pick a new random next
      }
    }
  }

  setMaxVolume(vol) {
    this.maxVolume = vol;
    if (this.tracks[this.currentIndex].isPlaying()) {
      this.tracks[this.currentIndex].setVolume(vol);
    }
  }
}

// Helpers
function isValidTrashDrop(x, y, lastX, lastY, minDist) {
  // inside bounds
  if (x < 0 || x >= screen_cols) return false;
  if (y < 0 || y >= screen_rows) return false;

  // if no previous drop, allow
  if (lastX === null || lastY === null) return true;

  // distance check
  let d = dist(x, y, lastX, lastY);
  return d >= minDist;
}

function getValidTrashTarget(botX, botY, lastX, lastY, minDist) {
  let attempts = 50;

  for (let i = 0; i < attempts; i++) {
    let tx = round(random(2, screen_cols - 3));
    let ty = round(random(2, screen_rows - 3));

    // far enough from last drop
    if (lastX !== null && dist(tx, ty, lastX, lastY) < minDist) continue;

    // far enough from current position (prevents tiny moves)
    if (dist(tx, ty, botX, botY) < minDist) continue;

    return { x: tx, y: ty };
  }

  return null;
}

// player input
function keyPressed() {
  if (key === 'c' || key === 'C') {
    // Add a cleaner bot at a random location
    let newX = floor(random(1, screen_cols - 2));
    let newY = floor(random(1, screen_rows - 2));
    bot_coords.push(new BotCoords(newX, newY, 'w'));
    spawnSound.play()
  }

  if (key === 'v' || key === 'V') {
    // Add a trash bot at a random location
    let newX = floor(random(1, screen_cols - 2));
    let newY = floor(random(1, screen_rows - 2));
    trashbot_coords.push(new BotCoords(newX, newY, 'w'));
    spawnSound.play()
  }

  if (key === 'x' || key === 'X') {
    // Remove the last cleaner bot (if any)
    if (bot_coords.length > 0) {
      bot_coords.pop();
    }
  }

  if (key === 'z' || key === 'Z') {
    // Remove the last trash bot (if any)
    if (trashbot_coords.length > 0) {
      trashbot_coords.pop();
    }
  }

  // resets game
  if (key === 'r' || key === 'R') {
    resetSimulation();
  }
}

// clicking adds food
function mousePressed() {
  // Convert mouse coordinates to grid coordinates
  let gridX = floor(mouseX / gS);
  let gridY = floor(mouseY / gS);

  // Make sure coordinates are inside the grid
  if (gridX < 0 || gridX >= screen_cols || gridY < 0 || gridY >= screen_rows) return;

  // Check if food already exists at this location
  let index = food_coords.findIndex(f => f.getX() === gridX && f.getY() === gridY);

  if (index !== -1) {

    food_coords.splice(index, 1);
  } else {

    food_coords.push(new FoodCoords(gridX, gridY, millis()));
  }

  // PLAY TRASH BEAT WHEN FOOD IS INTERACTED
  if (trashBeat) {
    trashBeat.setVolume(2);   // adjust volume as desired
    trashBeat.play();
  }
}

// SETUP //////////////////////////////
let screen = new Screen(screen_rows, screen_cols);

function setup() {
  createCanvas(colPX, rowPX);
  background('pink') // if you see this that's bad
  // 
  // Start the background beat loop softly
  bgBeat.setVolume(1); // Adjust volume (0.0 - 1.0)
  bgBeat.loop(); // Loops automatically

  bgLooper = new CrossfadeLooper(bgTracks, 2000, 1.5); // 2 sec crossfade, 1.5 max volume

  // cleaner bots
  bot_coords.push(new BotCoords(20, 20, 'w'));
  bot_coords.push(new BotCoords(70, 30, 'a'));

  // trash bots
  trashbot_coords.push(new BotCoords(80, 40, 'w'));

  // drop-off depot
  dropOff.push(new FoodCoords(50, 50));

  // initial trash
  for (let i = 0; i < 5; i++) {
    food_coords.push(
      new FoodCoords(
        round(random(10, screen_cols - 10)),
        round(random(10, screen_rows - 10)),
        millis()
      )
    );
  }
}

let maxFood = 25;
let depotFire = false;
function draw() {
  screen.setBackground();

  // Sound 
  if (bgBeat && bgBeat.isPlaying()) {
    // Map food count to volume: 0 food = 0.05, maxFood = 0.75 (1.5x default max)
    let volume = map(food_coords.length, 0, maxFood, 0.05, 0.75);
    volume = constrain(volume, 0.05, 0.75); // ensure safe range
    bgBeat.setVolume(volume);
  }

  // incinerator fire
  if (depotFire) {
    // draw some fire effect on depot
    let depot = dropOff[0];
    screen.px(depot.getX(), depot.getY(), new Pixel(color('orange'), 'd'));

    // reset after a few frames (e.g., 15 frames ~ 0.25s at 60fps)
    if (frameCount % 15 === 0) {
      depotFire = false;
    }
  }

  // update crossfade
  // Update background crossfade volume based on food amount
  if (bgLooper) {
    // Map current food count to a volume multiplier (0 = no food, maxFood = full volume)
    let volumeFactor = map(food_coords.length, 5, maxFood, 0.2, 1.5);
    volumeFactor = constrain(volumeFactor, 0.2, 1.5);

    bgLooper.setMaxVolume(volumeFactor);
    bgLooper.update();
  }

  // Cleaners
  let cleaners = [];
  for (let i = 0; i < bot_coords.length; i++) {
    cleaners.push(new Bot(i));
  }

  for (let b of cleaners) {
    if (bot_coords[b.num].carrying) {
      b.depositBehavior();
    } else {
      b.moveToFood();
    }
    b.show();
  }

  //trashbots 
  let trashers = [];
  for (let i = 0; i < trashbot_coords.length; i++) {
    trashers.push(new TrashBot(i));
  }

  for (let t of trashers) {
    t.updateBehavior();
    t.show();
  }

  // draw trash
  for (let i = 0; i < food_coords.length; i++) {
    new Food(i).show();
  }

  // draw depot
  let depot = dropOff[0];
  let depotColor = random() > 0.01 ? color('cyan') : color('yellow');
  screen.px(depot.getX(), depot.getY(), new Pixel(depotColor, 'd'));

  // draw depot outline
  let depotOutline = color('black');

  if (depotFire) {
    depotOutline = color(100, 50, 50);
  } else {
    depotOutline = color(25, 25, 175);
  }
  screen.px(depot.getX() + 1, depot.getY() + 1, new Pixel(depotOutline, 'd'));
  screen.px(depot.getX() - 1, depot.getY() + 1, new Pixel(depotOutline, 'd'));
  screen.px(depot.getX() + 1, depot.getY() - 1, new Pixel(depotOutline, 'd'));
  screen.px(depot.getX() - 1, depot.getY() - 1, new Pixel(depotOutline, 'd'));

  let depotFireColor = color(200, 50, 0);
  let depotFireColor2 = color('orange');

  if (depotFire) {
    screen.px(depot.getX(), depot.getY() + 1, new Pixel(depotFireColor, 'd'));
    screen.px(depot.getX() - 1, depot.getY(), new Pixel(depotFireColor, 'd'));
    screen.px(depot.getX() + 1, depot.getY(), new Pixel(depotFireColor, 'd'));
    screen.px(depot.getX(), depot.getY() - 1, new Pixel(depotFireColor, 'd'));

    screen.px(depot.getX(), depot.getY() + 2, new Pixel(depotFireColor2, 'd'));
    screen.px(depot.getX() - 2, depot.getY(), new Pixel(depotFireColor2, 'd'));
    screen.px(depot.getX() + 2, depot.getY(), new Pixel(depotFireColor2, 'd'));
    screen.px(depot.getX(), depot.getY() - 2, new Pixel(depotFireColor2, 'd'));
  }

  let trashToBotAge = 20000; // 7 seconds

  for (let i = food_coords.length - 1; i >= 0; i--) {
    let trash = food_coords[i];
    if (millis() - trash.spawnTime > trashToBotAge) {

      // avoid stacking on other bots
      if (!trashbot_coords.some(b => b.getX() === trash.getX() && b.getY() === trash.getY())) {
        trashbot_coords.push(new BotCoords(trash.getX(), trash.getY(), 'w'));

        if (spawnSound) {
          spawnSound.setVolume(1.2);
          spawnSound.play();
        }
      }

      food_coords.splice(i, 1);
    }
  }

  // IMPORTANT: Do not edit
  screen.renderScreen();
}


// Converted Functions
function static() {
  let staticEffectTime = (frameCount % 3);

  for (let i = 0; i < screenRows; i++) {
    for (let j = 0; j < screenCols; j++) {

      if (staticEffectTime) {
        if (random() > 0.5) {
          screen[i + 3][j + 5] = color('black');
        } else {
          screen[i + 3][j + 5] = color('white');
        }
      }

    }
  }
}

function grassWindow(squareWidth) {

  // Set the noise level and scale.
  let noiseLevel = 255;
  let noiseScale = 0.009;

  // adjusted mouse coords
  let mY = round(mouseY / gS) * gS
  let mX = round(mouseX / gS) * gS

  // update every pixel
  for (let i = mY - squareWidth * gS; i < mY + squareWidth * gS; i++) {

    for (let j = mX - squareWidth * gS; j < mX + squareWidth * gS; j++) {
      // Scale the input coordinates.
      let nx = noiseScale * i;
      let ny = noiseScale * j;

      let multiply = 1.5;
      let lighten = 10;

      let c = color(0 * multiply + lighten, noiseLevel * noise(nx, ny) * multiply + lighten, 0 * multiply + lighten);


      // Draw the point.
      let grass_temp = new Pixel(c, 'b');

      //screen.px(i, j, grass_temp);
    }
  }
}


function resetSimulation() {
  // clear arrays
  bot_coords = [];
  trashbot_coords = [];
  food_coords = [];
  dropOff = [];

  // reset depot fire
  depotFire = false;

  // optionally reset background
  screen = new Screen(screen_rows, screen_cols);

  // re-add default objects
  bot_coords.push(new BotCoords(20, 20, 'w'));
  bot_coords.push(new BotCoords(70, 30, 'a'));
  trashbot_coords.push(new BotCoords(80, 40, 'w'));
  dropOff.push(new FoodCoords(50, 50));

  // add initial food again
  for (let i = 0; i < 5; i++) {
    food_coords.push(
      new FoodCoords(
        round(random(10, screen_cols - 10)),
        round(random(10, screen_rows - 10)),
        millis() // if using spawnTime for trash-to-bot
      )
    );
  }
}