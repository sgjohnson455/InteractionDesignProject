function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function preload() {
  sponge = loadModel('3D_assets/Menger_sponge_sample.stl', true);
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

// // dir 2
//   let c2 = color('green');
//   let lightDir2 = createVector('green', 0, -1, 0);
//   directionalLight(c2, lightDir2);

//   // dir 3
//   let c3 = color('blue');
//   let lightDir3 = createVector(-1, 0, 0);
//   directionalLight(c2, lightDir3);

//   // dir 4
//   let c4 = color('yellow');
//   let lightDir4 = createVector(1, 0, 0);
//   directionalLight(c2, lightDir4);

//   // dir 5
//   let c5 = color('purple');
//   let lightDir5 = createVector(0, 0,-1);
//   directionalLight(c2, lightDir5);

//   // dir 6
//   let c6 = color('orange');
//   let lightDir6 = createVector(0, 0, 1);
//   directionalLight(c2, lightDir);
 }

let showStroke = false;

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
 let angle = frameCount * 0.01;
  rotateX(angle);

  rotateY(angle);

  // Draw the shape.
  model(sponge);
}

// Interaction -----
function mousePressed() {
    showStroke = true;
}

function mouseReleased() {
    showStroke = false;
}