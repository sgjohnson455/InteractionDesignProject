function setup() {
  createCanvas(windowWidth, windowHeight);
}

function preload() {
  img1 = loadImage('assets/strawberry.png');
  img2 = loadImage('assets/banana.png');
  img4 = loadImage('assets/orange.png');
  img3 = loadImage('assets/art.png');
}

// Visual Assets
function default_button(x, y, b_width, b_height, label, identity) {
  // Style
  textSize(16);
  b_shadow_offset = 3;

  // Vars
  let bClicked = false;

  // Detect if mouse on target (button is cented at x,y)
  xDist = dist(mouseX, 0, x, 0);
  yDist = dist(0, mouseY, 0, y);

  // Button Logic
  if (mouseIsPressed && (xDist <  b_width/2 &&  yDist < b_height/2)) {
    // Button is Pressed
    rectMode(CENTER);
    fill("orange");
    noStroke();
    rect(x + b_shadow_offset, y + b_shadow_offset, b_width, b_height);
    fill("white");
    text(label, x + b_shadow_offset, y + b_shadow_offset);
    
    // if button is a nav button
    if (identity == "next") {
      updateImage = 1;
    } else if (identity == "back") {
      updateImage = -1;
    }

    if (identity == "scene") {
      updateScene = 1;
    } 



  } else {
    // Button is Not Pressed
    rectMode(CENTER);
    fill(100);
    rect(x + b_shadow_offset, y + b_shadow_offset, b_width, b_height);
    
    rectMode(CENTER);
    fill("orange");
    noStroke();
    rect(x, y, b_width, b_height);
    
    fill("white");
    text(label, x, y);
  }
}

// image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])
function loadedImage(x, y, imgSize, frameThickness, imageNum) {
  
  // presets
  let dSize = imgSize - frameThickness;

  // const
  let mainImg = img1;
  
  // change image logic
  switch(imageNum) {
  case 2:
    mainImg = img2;
    break;
  case 3:
    mainImg = img3;
    break;
  default:
    // nothing
    mainImg = img1;
  }
// draw image

  // image(mainImg, x, y, dSize, dSize, 0, 0, mainImg.width, mainImg.height, FILL);
  image(mainImg, x, y);
  
  // resize
  if (Math.max(mainImg.width, mainImg.height) == mainImg.height) {
    mainImg.resize(0, dSize);
  } else {
    mainImg.resize(dSize, 0);
  }
  
}

function framedImg(x, y, imgSize, frameThickness, imageNum) {
  //draw frame (rectange)
    fill("orange");
    rect(x, y, imgSize, imgSize);

    // make default background white
    fill("white");
    rect(x, y, imgSize - frameThickness, imgSize - frameThickness);

    // draw image on top
    loadedImage(x, y, imgSize, frameThickness, imageNum);
}

// MAIN SCENE 1: Three Images (Side-by-Side)
function threeImagesScene() {

  // caution: will overlap images with buttons on very wide screens
  // could be solved by adding upper bound to height here

  // PRESETS
  let button_x = width /2;
  let button_y = height - (height * 1/8);
  let picturePadding = 20; // pixels

  let title_x = width/2;
  let title_y = height * 1/8;

  let frame_x = width/2;
  let frame_y = title_y + (button_y - title_y)/2;

  let pictureWidth = (width - picturePadding * 5)/3;

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
  noStroke();

  // code
  
  textSize(64);
  fill("orange");
  text('Fruit Gallery', title_x, title_y);

  framedImg(frame_x - pictureWidth - picturePadding, frame_y, pictureWidth, 20, 1);
  framedImg(frame_x, frame_y, pictureWidth, 20, 2);
  framedImg(frame_x + pictureWidth + picturePadding, frame_y, pictureWidth, 20, 3);

  default_button(button_x, button_y, 160, 30, "View Paintings >", "scene");
}

// MAIN SCENE 2: Gallery View (Scrollable)
function galleryScene() {
// PRESETS
  let button_x = width /2;
  let button_y = height - (height * 1/8);
  let picturePadding = height / 1/12; // pixels (vertical)
  let buttonPadding = 20;

  let title_x = width/2;
  let title_y = height * 1/8;

  let frame_x = width/2;
  let frame_y = title_y + (button_y - title_y)/2;

  let pictureHeight = (button_y - title_y - (picturePadding * 2) - picturePadding);
  let navButtonOffset = frame_y + pictureHeight/2 + buttonPadding;

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  imageMode(CENTER);
  
  // UI ---------------------
  textSize(64);
  fill("orange");
  text('Fruit Gallery', title_x, title_y);
  framedImg(frame_x, frame_y, pictureHeight, 20, currImage);

  default_button(button_x - pictureHeight/2 + 30, navButtonOffset, 60, 30, "<", "back");
  default_button(button_x + pictureHeight/2 - 30, navButtonOffset, 60, 30, ">", "next");

  rectMode(CENTER);
  // toggle scene
  default_button(button_x, button_y, 160, 30, "View Full Gallery >", "scene");
}


//GLOBAL VARS ----------------
let updateImage = 0;
let currImage = 1;

let updateScene = false;
let sceneNum = 0; // default is three image

function draw() {
  background("white");

  if (sceneNum == 0) {
    threeImagesScene();
  } else {
    galleryScene();
  }
}

function mouseReleased() {
  // Next
  if (updateImage == 1) { 
    if (currImage < 3) {
    updateImage = 0;
    
    if (currImage < 3) { 
      currImage++;
    }

  } else {
      updateImage = 0;
      
      currImage = 1;
    }
  }

  // Back
  if (updateImage == -1) {
    if (currImage > 1) {
      updateImage = 0;
      
      if (currImage > 1) { 
        currImage--;
      }
    } else {
      updateImage = 0;
      
      currImage = 3;
    }
  }

  // scene change logic
  if (updateScene == true) {
    updateScene = false; // reset val
    
    // toggle scene
    if (sceneNum == 0) {
      sceneNum = 1;
    } else {
      sceneNum = 0;
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}