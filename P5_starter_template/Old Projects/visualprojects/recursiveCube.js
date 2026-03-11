function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

}

function drawCube(x, y, cSize, cubePadding, depthInstance, cubeColor) {
    // Base Case: depth is 0'
    let dInstance = depthInstance
    if (dInstance <= 0) {
        fill(cubeColor, 255, 255);
        rect(x, y, cSize, cSize); // draw main cube
    } else {
        // Recursive Case

        let cubeOffset = cubePadding;
        console.log(cubeOffset);

        // main 4 coords
        let xOffset = cSize/4 + cubePadding/2 - cubePadding/4; // x1 offset
        let yOffset = cSize/4 + cubePadding/2 - cubePadding/4;
        let cInstanceSize = cSize/2 - cubePadding/2;


        drawCube(x - xOffset, y - yOffset, cInstanceSize, cubePadding/2, dInstance - 1, cubeColor + 25);
       
        drawCube(x + xOffset, y - yOffset, cInstanceSize, cubePadding/2, dInstance - 1, cubeColor + 25);
       
        drawCube(x - xOffset, y + yOffset, cInstanceSize, cubePadding/2, dInstance - 1, cubeColor + 25);
       
        drawCube(x + xOffset, y + yOffset, cInstanceSize, cubePadding/2, dInstance - 1, cubeColor - 25);
    }
}

// GLOBAL Vars -----------------
let recursiveDepth = 0;
let color = 0;
let equalPaddingMode = true;

// Main
function draw() {
    background("white");

    //PRESETS
    let cubePadding = 20; // pixels
    let cubeSize = Math.min(width, height);
    let depthInstance = recursiveDepth; // set to global val

    rectMode(CENTER);
    fill("black");
    noStroke();

    //console.log(`depthInstance: ${depthInstance}`);

    // MAIN draw func
    drawCube(width/2, height/2, cubeSize - (cubePadding * 2), cubePadding, depthInstance, color);

    // Live Stats
    textStyle(BOLD);

    fill("red");
    text(recursiveDepth, cubePadding/2, cubePadding);

    text(`Total Object Count: ${(recursiveDepth) ** 4}`, cubePadding/2, height - cubePadding/4);
}

//trigers recursion depth increment
function mouseClicked() {
    recursiveDepth++;
    // if (recursiveDepth > 10) {
    //     recursiveDepth = 10;
    // }
    console.log(recursiveDepth);
}

function keyPressed() {
  if (key === 'c' && recursiveDepth >= 1) {
    recursiveDepth--;
  }

  // turn on equal padding mode
  if (key === 'v') {
    equalPaddingMode == true; // default is slice mode
  }
}