// 1) Based on this week's lecture introducing the interactive podcast/soundscape features , submit a weblink, that timecodes the provided ambient.mp3 soundscape.

// The soundscape itself is 45 seconds long, so you may divided into multiple durations of your choice.

// 2) Display 2 images and 2 videos, each corresponding to a certain duration in the sound scape.

// 3) The images could be anything of your choice, your artwork, a photograph you've taken or an image from the internet (as long as it is has a Creative Commons license and is not Copyrighted). The video has to be a video generated using any 3D model from the Smithsonian Collection, generated using the Babylon Sandbox. (See Canvas and video lecture).


// Code//

let gui;
let b;
let button_label = "Play"
let timeSincePress = 0;
let timeTracking = false;

// assets
let ambient, planeVid, img1, img2, video2;

function preload() {
    ambient = loadSound("/ambientFiles/assets/ambient.mp3");
    planeVid = createVideo("/ambientFiles/assets/plane.webm");
    video2 = createVideo("/ambientFiles/assets/apollo.webm"); 
    img1 = loadImage("/ambientFiles/assets/bear.jpeg");
    img2 = loadImage("/ambientFiles/assets/nylon.png");
}

function setup() {
  createCanvas(400, 400);

  gui = createGui();
  b = createButton(button_label, 20, 340);

  // setup
  planeVid.hide(); 
  video2.hide();
}

function draw() {
  background(220);
  drawGui();

  // code begins
  
  // Button Toggling
  if(b.isPressed) {
    print(b.label + " is pressed.");
    ambient.play();
    if (b.label == "Play") {
      b.label = "Pause";
      ambient.play();

      planeVid.loop();
      video2.loop();


      timeTracking = true;
    } else {
      b.label = "Play";

      ambient.stop();

      timeTracking = false;
      timeSincePress = 0;
      curTime = 0;
    }
  }

  //console.log(timeSincePress)
  if (timeTracking) {
  timeSincePress++;
  }
  let seconds = timeSincePress / 20; // Gets current time of the soundscape


  if (seconds > 0 && seconds < 11) {
    image(img1, 0, 0, width, 320); // 0-11s: Image 1
  } 
  else if (seconds >= 11 && seconds < 22) {
    image(planeVid, 0, 0, width, 320); // 11-22s: Video 1
  }
  else if (seconds >= 22 && seconds < 33) {
    image(img2, 0, 0, width, 320); // 22-33s: Image 2
  }
  else if (seconds >= 33 && seconds <= 45) {
    image(video2, 0, 0, width, 320); // 33-45s: Video 2
  }

  fill(255); // White text
textSize(20);

text("Time: " + nf(seconds, 1, 2) + "s", 10, 30);

}

