// Game Canvas is 40 x 40
// i represents y (rows)
// j represents x (columns)

// global

// pixel size
const gS = 5; //game scale
// resolution scale
const screen_rows = 100; // (y)
const screen_cols = 100;
const rowPX = screen_rows * gS;
const colPX = screen_cols * gS;


let player_direc = 'w';
let player_x = 10;
let player_y = 10;

let bot_coords = [];
let trashbot_coords = [];
let food_coords = [];
let dropOff = []



// Classes

class Screen {
    constructor(rows, cols, gS = 5) {
        this.rows = rows;
        this.cols = cols;
        this.gS = gS;

        this.screen = []
    

        // create main Render Array (edit things inside here)
        for (let i = 0; i < cols; i++) {
        this.screen[i] = []; // Create an empty inner array for each row
            for (let j = 0; j < rows; j++) {
            this.screen[i][j] = new Pixel(); // Initialize each element with a value (here, 0)
            }
        }
    }

    // give x y and pixel object
    px(x, y, pixel) {
        this.screen[x][y] = pixel;
    }

    // return pixel at spot
    getPx(x, y) {
        return this.screen[x][y];
    }

    // IMPORTANT: Renders every pixel in the matrix: screen 
    renderScreen() {
        noStroke();
        //color('grey');
        
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                fill(this.screen[i][j].getColor()); // set fill to color of pixel
                rect(i * gS, j * gS, gS, gS); // render every 10 x 10 pixel
            }
        }
    }

    setBackground() {
        this.natureBackground();
    }

    // Additional Backgrounds
    natureBackground() {
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
            let ny = noiseScale * j * random(0, 0.25);

            let multiply = 1;
            let lighten = 0;
            
            //let c = color(0 * multiply + lighten, noiseLevel * noise(nx, ny) * multiply + lighten, 0 * multiply + lighten);
            let c = color(0 + lighten, 0 * multiply + lighten, noiseLevel * noise(nx, ny) * multiply + lighten);
            
            // Draw the point.
            let grass_temp = new Pixel(c, 'b');
            screen.px(i, j, grass_temp);
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
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setX(x) {
        this.x = x;
    }

    setY() {
        this.y = this.y;
    }

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
  }
  
  getX() {
    return this.x;
  }
  
  getY() {
    return this.y;
  }
  
  getDirec() {
    return this.direc;
  }
  
  setX(new_x) {
    this.x = new_x;
  }
  
  setY(new_y) {
    this.y = new_y;
  }
  
  setDirec(new_direc) {
    this.direc = new_direc;
  }
}

class Player {
  constructor(x, y, direc, screen) {
    this.x = x; // stored via matrix coords
    this.y = y; // stored via matrix coords
    this.direc = direc;
    this.screen = screen;
  }
  
  // takes in a 2x2 matrix to render onto
  natureMode() {
    let playerColor = color('black');
    let playerSecondColor = color('blue');
    
    switch(player_direc) {
      case 'w':
        screen[this.x][this.y] = new Pixel('p', playerColor);
        screen[this.x + 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x - 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x][this.y - 1] = new Pixel('p', playerSecondColor);
        break;
        case 's':
        screen[this.x][this.y] = new Pixel('p', playerColor);
        screen[this.x + 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x - 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x][this.y + 1] = new Pixel('p', playerSecondColor);
        break;
      case 'a':
        screen[this.x][this.y] = new Pixel('p', playerColor);
        screen[this.x][this.y + 1] = new Pixel('p', playerSecondColor);
        screen[this.x - 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x][this.y - 1] = new Pixel('p', playerSecondColor);
        break;
      case 'd':
        screen[this.x][this.y] = new Pixel('p', playerColor);
        screen[this.x][this.y + 1] = new Pixel('p', playerSecondColor);
        screen[this.x + 1][this.y] = new Pixel('p', playerSecondColor);
        screen[this.x][this.y - 1] = new Pixel('p', playerSecondColor);
        break;
        
    }
    
  }
  
  // store colors in coords
  show(type) {
    switch(type) {
      case "nature": // on nature mode call natureMode
        this.natureMode();
    }
  }
  
  // move the player
  move() { // tie to framerate for variable speeds
    if (frameCount % 4 == 0) {
    switch(key) {
      case 's':
        if (this.y < rows - 2) {
        player_y += 1;
    }
        break;
      case 'w':
        if (this.y > 1) {
        player_y -= 1;
        }
        break;
      case 'd':
        if (this.x < cols - 2) {
        player_x++;
        }
        break;
      case 'a':
        if (this.x > 1) {
        player_x -= 1;
        }
        break;
      }
  }
    }
}

class Bot {
  constructor(num) {
    this.x = bot_coords[num].getX(); // stored via matrix coords
    this.y = bot_coords[num].getY(); // stored via matrix coords
    this.direc = bot_coords[num].getDirec();
    this.screen = screen;
    this.num = num;
  }
  
  // takes in a 2x2 matrix to render onto
  show() {
    let botColor = color('white');
    let bot2Color = color('red');

    let showWings = true;

    // get reference to bot info here
    let bnum = bot_coords[this.num].getDirec();

    let bx = this.x;
    let by = this.y;
    let pB = new Pixel(botColor, 'b');
    let p2B = new Pixel(bot2Color, 'b');

    switch(bnum) {
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
//   // store colors in coords
//   show(direction) {
//     this.natureMode(direction);
//   }
  
  // updates direction randomly, updates x, y, direct in bot_coords
  move(direction) { // tie to framerate for variable speeds
    if (frameCount % 4 == 0) {
      // set up references
      let bnum = bot_coords[this.num] // get bnum class here

      // store direction in list
      bot_coords[this.num].setDirec(direction);
      
      
      // update x, y in coord list based on input direction
    switch(direction) {
      case 's':
        if (this.y < screen_rows - 2) {
          bnum.setY(this.y + 1);
        }
        break;
      case 'w':
        if (this.y > 1) {
          bnum.setY(this.y - 1);
        }
        break;
      case 'd':
        if (this.x < screen_cols - 2) {
          bnum.setX(this.x + 1);
        }
        break;
      case 'a':
        if (this.x > 1) {
          bnum.setX(this.x - 1);
        }
        break;
      }
  }
}

    getNearestFood() {
    if (food_coords.length === 0) return null;

    let nearestFood = null;
    let minDistance = Infinity;

    let count = 0
    for (const food of food_coords) {
        let fx = food.getX();
        let fy = food.getY();
        
        // Calculate Euclidean distance
        let dist = sqrt(sq(this.x - fx) + sq(this.y - fy));

        if (dist < minDistance) {
            minDistance = dist;
            nearestFood = [fx, fy, count];
        }
        count++;
    }

    return nearestFood; // Returns [x, y] of the closest food
}

    moveToFood() {
    let target = this.getNearestFood();
    if (!target) return false; 
    
    let targetX = target[0];
    let targetY = target[1];
    let foodIndex = target[2];

    let dx = targetX - this.x;
    let dy = targetY - this.y;

    if (dx === 0 && dy === 0) {
        food_coords.splice(foodIndex, 1); // Remove the specific food we just ate
        return true;
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
    this.x = trashbot_coords[num].getX(); // stored via matrix coords
    this.y = trashbot_coords[num].getY(); // stored via matrix coords
    this.direc = trashbot_coords[num].getDirec();
    this.screen = screen;
    this.num = num;
  }
  
  // takes in a 2x2 matrix to render onto
  show() {
    let botColor = color('red');
    let bot2Color = color('black');

    let showWings = true;

    // get reference to bot info here
    let bnum = trashbot_coords[this.num].getDirec();

    let bx = this.x;
    let by = this.y;
    let pB = new Pixel(botColor, 'b');
    let p2B = new Pixel(bot2Color, 'b');

    switch(bnum) {
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
    if (frameCount % 4 == 0) {
      // set up references
      let bnum = trashbot_coords[this.num] // get bnum class here

      // store direction in list
      trashbot_coords[this.num].setDirec(direction);
      
      
      // update x, y in coord list based on input direction
    switch(direction) {
      case 's':
        if (this.y < screen_rows - 2) {
          bnum.setY(this.y + 1);
        }
        break;
      case 'w':
        if (this.y > 1) {
          bnum.setY(this.y - 1);
        }
        break;
      case 'd':
        if (this.x < screen_cols - 2) {
          bnum.setX(this.x + 1);
        }
        break;
      case 'a':
        if (this.x > 1) {
          bnum.setX(this.x - 1);
        }
        break;
      }
  }
}

    // moveToTarget() {

    // let dx = round(random(-2, 2));
    // let dy = round(random(-2, 2));

    // if (frameCount % 120 == 0) {
    //     // add food to the matrix
    //     let temp_food = new FoodCoords(this.x, this.y)
    //     food_coords.push(temp_food); // add food to foodlist
    //     return true;
    // }

    // if (random(1) > 0.5) {
    //     if (dx !== 0) {
    //         this.move(dx > 0 ? 'd' : 'a');
    //     } else {
    //         this.move(dy > 0 ? 's' : 'w'); 
    //     }
    // } else {
    //     if (dy !== 0) {
    //         this.move(dy > 0 ? 's' : 'w');
    //     } else {
    //         this.move(dx > 0 ? 'd' : 'a');
    //     }
    // }
    move(direction) {
    if (frameCount % 4 == 0) {
        let bnum = trashbot_coords[this.num];
        
        // 1. IMPROVED: Stick to the current direction 80% of the time 
        // This prevents the "twitchy" back-and-forth vibrating look.
        let moveDir = direction;
        if (random(1) < 0.8) {
            moveDir = this.direc; // Keep going the way we were already going
        }

        // 2. SYNC: Update both local and global coordinates
        switch(moveDir) {
            case 's': if (this.y < screen_rows - 2) this.y++; break;
            case 'w': if (this.y > 1) this.y--; break;
            case 'd': if (this.x < screen_cols - 2) this.x++; break;
            case 'a': if (this.x > 1) this.x--; break;
        }

        // Update the global state so other functions/renderers see the change
        bnum.setX(this.x);
        bnum.setY(this.y);
        bnum.setDirec(moveDir);
        this.direc = moveDir; // Update local direction for next frame
    }
}
}



}

class Food {
    constructor(num) {
        this.x = food_coords[num].getX();
        this.y = food_coords[num].getY();
        this.num = num;
    }

    show() {
        let foodColor = color('yellow');
        let pF = new Pixel(foodColor, 'f');

        // set xy to foodColor
        screen.px(this.x, this.y, pF);
    }
    
}

// setup screen
let screen = new Screen(screen_rows, screen_cols);

function setup() {
  createCanvas(colPX, rowPX);
  background(220)
  
  
  // set up bot
  let bot0 = new BotCoords(20, 20, 'w');
  // set up trashbot
  let trashbot0 = new BotCoords(80, 40, 'w');
  
  // add to array
  bot_coords.push(bot0);
  trashbot_coords.push(trashbot0);
  trashbot_coords.push(trashbot0);

  // creates 5 random pairs of food coordinates
  for (i = 0; i < 25; i++) {
    let temp_food = new FoodCoords(round(random( 10, screen_cols - 10)), round(random( 10, screen_rows - 10)))
    food_coords.push(temp_food); // add food to foodlist
  }
}


function draw() {
  // SetBackground Color
  screen.setBackground();

  // Spawn in Bot
  let bot0 = new Bot(0);

  //trashbots 
  let trashbot0 = new TrashBot(0);
  let trashbot1 = new TrashBot(1);
  let fList = [];

  // Add Food (from coord list)
  for (i = 0; i < food_coords.length; i++) {
    let tFood = new Food(i);
    fList.push(tFood);
  }
// move trashbot

  trashbot0.moveToTarget();
  // moves the bot according to a food-based algorithm
  let foodCollected = bot0.moveToFood();

  // Draw bot within matrix
    bot0.show();

    trashbot0.show();
    trashbot1.show();
    

    //console.log(food_coords)

 // Draw food particle
  for (i = 0; i < fList.length; i++) {
    fList[i].show();
    }

  // add grass window effect
  //grassWindow(5);
  
  // IMPORTANT: Do not edit
  screen.renderScreen();
}

// Behavior Functions
function moveBot(bot) {
 // Select random direction and call move function on dirction
  bot.moveToFood();
  //bot1.move(m_direc);


}


// Converted Functions
function static() {
  let staticEffectTime = (frameCount % 2);
 
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

// make console decorations /////////////////////////////////

function decorateConsole() {
  actionButton();
}

function actionButton() {
  if (mouseIsPressed) {
    
  } else {
    rect(30, 20, 55, 50, 20);
  }
}

// function mouseClicked() {
//     // adjusted mouse coords
//     let mY = round(mouseY / gS) * gS;
//     let mX = round(mouseX / gS) * gS;

//     let temp_food = new FoodCoords(mX, mY);
//     food_coords.push(temp_food); // add food to array



// }