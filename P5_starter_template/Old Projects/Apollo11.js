let audio
let img1
let img2
let timestamp
let video1
let analyzer
let fft
let button

function preload() {
    audio = loadSound('./assets/podcast_assets/ambient.mp3')
    img1 = loadImage('./assets/podcast_assets/starry.jpg')
    img2 = loadImage('./assets/podcast_assets/nylon.png')
    video1 = createVideo('./assets/podcast_assets/morse.webm')
    button = createImg('/assets/podcast_assets/play.jpg', "Test alt text")
}
function setup() {
    createCanvas(displayWidth, displayHeight);
    

    button.size(60, 40);
    button.position(100, 100);
    button.mousePressed(playaudio);

    colorMode(HSB);
    analyzer = new p5.Amplitude();
    analyzer.setInput(audio)
    fft = new p5.FFT()
}


function draw() {
    background(0, 127, 0)
    timestamp = audio.currentTime()
    console.log(timestamp)
    if (timestamp > 0 && timestamp < 5) {
        vangogh()
    }
    if (timestamp > 5 && timestamp < 10) {
        stocking()
        waveform() //if you disable this statment only the image will be displayed
    }
    if (timestamp > 10 && timestamp < 20) {
        playvideo1()
        waveform()
    }
}


function playaudio() {
    video1.loop()
    video1.hide()
    if (audio.isPlaying()) {
        audio.pause()
    }
    else {
        audio.loop()
    }
}

function vangogh() {
    image(img1, 0, 0, img1.width * 1.5, img1.height * 1.5)
}
function stocking() {
    image(img2, 800, 0, img2.width, img2.height)
}

function playvideo1() {
    video1.size(displayWidth, displayHeight)
    let vidbuffer = video1.get()
    image(vidbuffer, 0, 0)
}

function waveform() {
    level = analyzer.getLevel();
    spectrum = fft.analyze();
    noStroke();
    for (i = 0; i < spectrum.length; i = i + 1) {
        x = map(i, 0, spectrum.length, 0, width);
        y = map(spectrum[i], 0, 255, height, 0) - height;
        fill(i, 255, 255)
        rect(x, height, width / spectrum.length, y);
    }
}
