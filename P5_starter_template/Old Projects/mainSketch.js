// Sketch for audio project (Week30)
const createInstanceWeek3 = ( sketch ) => { 
    sketch.preload = function() {
        img = sketch.loadImage('/assets/awesomeCar.png');
        audio = sketch.loadSound('/assets/carCrash.mp3');
    }
     
    sketch.setup = function() {
        sketch.createCanvas(500, 500);

        // button logic
        button = sketch.createButton("Toggle Sound (on/off)");
        button.position(sketch.width/ 2, sketch.height / 4);
        console.log('Setup audio proj');
    }

    sketch.draw = function() {
        sketch.background("white");
        sketch.imageMode(sketch.CENTER);

        sketch.image(img, width/2, height/2, 200, 150);
        button.mouseClicked(togglesound);
    }

    sketch.togglesound() = function(){
        if (audio.isPlaying()) {
            audio.stop();
        } else {
            audio.loop();
        }
    }

}

// Sketch for gallery project
const createInstanceWeek2 = ( sketch ) => {  
  sketch.setup = function() {
    sketch.createCanvas(400, 400);
    console.log('Setup gallery');
  }

  sketch.draw = function() {
    sketch.background(0,0,200);
  }
}

// provide main element and maintain reference
const $app = document.getElementById("app");
let activeSketch = new p5(createInstanceWeek3, $app);

// handle switching the sketch via dropdown
const $select = document.getElementById("choose");
$select.addEventListener('change', ()=> {
  // remove canvas from previous sketch
  $app.innerHTML = '';
  switch($select.value) {
    case 'week3':       
      // if chose red => create the red instance
      activeSketch = new p5(createInstanceWeek3, $app);
      break;
    case 'week2': 
      // if chose blue => create the blue instance
      activeSketch = new p5(createInstanceWeek2, $app);
      break;
  }
});