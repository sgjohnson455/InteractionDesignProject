function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function preload() {
  sponge = loadModel('3D_assets/11803_Airplane_v1_l1.obj', true);
}

//function createModel();

function add3DLighting() {
    // dir 1
    directionalLight(color('red'), 0, 1, 0);

    // dir 2
    directionalLight(color('green'), 0, -1, 0);

    // dir 3
    directionalLight(color('blue'), 0, 0, -1);

    // dir 4
    directionalLight(color('orange'), 0, 0, 1);

    // dir 5
    directionalLight(color('yellow'), 1, 0, 0);

    // dir 6
    directionalLight(color('purple'), -1, 0, 1);
 }

let showStroke = false;
let angle_bound = 180;
let frame_multiplier = 1;
let startAngle = 0;
//let angle = 90;

function draw() {
  background(200);

  // Enable orbiting with the mouse.
  orbitControl();

 // no stroke
 if (showStroke == false) {
    stroke(0,0);
    add3DLighting();
 } else {
    stroke('black');
    noLights();
 }

 // Rotate per frame
rotateX(PI / 2);

  // if (frameCount % 365 >= 183.5) {
  //   frame_multiplier = -1;
  // } else {
  //   frame_multiplier = 1;
  // }

  // if (frameCount > 365) {
  //   frameCount = 0;
  // }

  //let angle = frameCount * -0.01 * frame_multiplier;
  //rotateX(angle);
 //  startAngle += angle

  //rotateX(frame_multiplier/100);

  //rotateY(angle);

  // Draw the shape.
  scale(2);
  model(sponge);
}

// Interaction -----
function mousePressed() {
    showStroke = true;
}

function mouseReleased() {
    showStroke = false;
}