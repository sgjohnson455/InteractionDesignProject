
// function preload()
// {
  
// }


// function setup() {
//  // put setup code here
//  createCanvas(displayWidth,displayHeight);
// }

// function draw() {
//   // put drawing code here


// }
// Recursive Cube Code
function setup() {
  createCanvas(windowWidth, windowHeight); // set to window size
  // Window Sizing
}

function default_button(x, y, label, state) {
  // Style
  b_shadow_offset = 3;
  
  // depending on state, change style
  if (state == false) {
    // Button not pressed
    rectMode(CENTER);
    fill(100);
    rect(x + b_shadow_offset, y + b_shadow_offset, 80, 30);
    
    rectMode(CENTER);
    fill("white");
    noStroke();
    rect(x, y, 80, 30);
    
    fill("black");
    text(label, x, y);
  } else {
    // Button pressed
    rectMode(CENTER);
    fill("white");
    noStroke();
    rect(x + b_shadow_offset, y + b_shadow_offset, 80, 30);
    fill("black");
    text(label, x + b_shadow_offset, y + b_shadow_offset);
  }
}

// Test art function - recursive cube
function drawCube() {
  // Location Variables (cube top-left)
  let rect_x = width/2; // manual
  let rect_y = height - (height * 5/8); // manual
  cubeCenter = [rect_x, rect_y]
  cube_width = 300; // Sets initial size
  // Bounds (of total shape)
  x_min = rect_x - cube_width/2;
  x_max = rect_x + cube_width/2;
  y_min = rect_y - cube_width/2;
  y_max = rect_y + cube_width/2;
  
  // array of cube coords
  cubeCount = 0;
  cubeList = [];
  internal_recursive_depth = recursive_depth;
  
  console.log(internal_recursive_depth);
  
  // Settings
  rectMode(CENTER);
  fill("white");
  strokeWeight(2);
  stroke(0, 0, 0); // make outline black
  
  // Base Case 1: first instance of press)
    // Draw normal square (rect(x, y, width, height))
  if (internal_recursive_depth == 1) {
    rect(rect_x, rect_y, cube_width / 2, cube_width / 2);
    
    // add cube (coords) to array
    cubeCount++;
    cubeList.push([rect_x, rect_y]);

    // update depth
    internal_recursive_depth--;
  }
  
  
  if (internal_recursive_depth > 1) {
    // Testing Round (drawing 4 smaller)
    drawSmallerCube(cubeCenter, cube_width, 4, internal_recursive_depth);
  }
}

// helper (draw single cube; non-recursive)
function drawSmallerCube(cubeCenter, cube_width, spacing, sub_depth) {
  // erase board
  // spacing: -> spacing between cubes (yay)
  // subdepth: -> used for tracking cube depth
  
  // Variables
  instance_depth = sub_depth; // for this recursive instance
  
  // Base Case: cube is the size of single pixel (dang) ???
  
 // Base Case: if depth = 0 (stop drawing cubes bruh)
  if (instance_depth <= 1) {
    return; // end
  } else {
  // Recursive Case: Draw 4 cubes and add to array
    // Get Cube Coords
  cube1Coords = [cubeCenter.at(0) - cube_width/8 - spacing/2, cubeCenter.at(1) - cube_width/8 - spacing/2];
  cube2Coords = [cubeCenter.at(0) + cube_width/8 + spacing/2, cubeCenter.at(1) - cube_width/8 - spacing/2];
  cube3Coords = [cubeCenter.at(0) - cube_width/8 - spacing/2, cubeCenter.at(1) + cube_width/8 + spacing/2];
  cube4Coords = [cubeCenter.at(0) + cube_width/8 + spacing/2, cubeCenter.at(1) + cube_width/8 + spacing/2];
  // Add Coords to Array
  cubeList.push(cube1Coords);
  cubeList.push(cube2Coords);
  cubeList.push(cube3Coords);
  cubeList.push(cube4Coords);
  
  // Draw Cubes (if at correct depth)
  rect(cube1Coords.at(0), cube1Coords.at(1),  cube_width / 4, cube_width / 4);
  rect(cube2Coords.at(0), cube2Coords.at(1),  cube_width / 4, cube_width / 4);
  rect(cube3Coords.at(0), cube3Coords.at(1),  cube_width / 4, cube_width / 4);
  rect(cube4Coords.at(0), cube4Coords.at(1),  cube_width / 4, cube_width / 4);
    
    // have drawn at this depth, update
    instance_depth--;
    
    // Update depth and call again
    drawSmallerCube(cube1Coords, cube_width/2, spacing, instance_depth);
    drawSmallerCube(cube2Coords, cube_width/2, spacing, instance_depth);
    drawSmallerCube(cube3Coords, cube_width/2, spacing, instance_depth);
    drawSmallerCube(cube4Coords, cube_width/2, spacing, instance_depth);
    
   
    
  }
}


// Main -----------------------------------

// Start Variables
let on = false;
let showCube = false;
let recursive_depth = 0;

function draw() {
  
  // VARIABLES
  button_x = width/2;
  button_y = height - (height * 1/4);
  
  b1_text = "Draw Cube!"
  
  // PRESETS
  textAlign(CENTER, CENTER);
  
  // COLORS
  background_color = 'orange';
  
  // Start UI -----
  
  // background
  background(background_color);
  
  noStroke();
  
  // button
    default_button(button_x, button_y, b1_text, on);
  
  if (showCube == true) {
    drawCube();
  }

}
  
// Mouse Inputs --------------------
function mousePressed() {
  program_start = true;
  on = true;
  showCube = true;
  
  // update cubeDepth (cube count)
  recursive_depth++;
  
  // need check to see if in bounds
  clear();
}

function mouseReleased() {
  on = false;
}
