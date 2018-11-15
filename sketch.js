// Daniel Shiffman
// Nature of Code: Intelligence and Learning
// https://github.com/shiffman/NOC-S18

// This flappy bird implementation is adapted from:
// https://youtu.be/cXgA1d_E-jY&

// How big is the population
let totalPopulation = 500;
// All active birds (not yet collided with pipe)
let activeBirds = [];
// All birds for any given population
let allBirds = [];
// Pipes
let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;

let genCounter = 0;
let genScore = 0;

// Interface elements
let speedSlider;
let generationSpan;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

//----------------------
var birdSprite;
var bgImg;
var bgX;
let i=0;
function preload() {
  birdSprite = loadImage('https://raw.githubusercontent.com/maharshikahodariyadaiict/FlappyBird/master/graphics/flappy.png');
  bgImg = loadImage('https://raw.githubusercontent.com/maharshikahodariyadaiict/FlappyBird/master/graphics/background.png');
}


function setup() {
  let canvas = createCanvas(600, 400);
  canvas.position(10, 60);
  
  bgX = 0;
  canvas.parent('canvascontainer');
  
  // Access the interface elements
  speedSlider = select('#speedSlider');
  generationSpan = select('#gs');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  aliveBirdSpan = select('#aliveb');
  
  // Create a population
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}


function draw() {
  background(bgImg);
  // Draw our background image, then move it at the same speed as the pipes
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= 4.8;

  // this handles the "infinite loop" by checking if the right
  // edge of the image would be on the screen, if it is draw a
  // second copy of the image right next to it
  // once the second image gets to the 0 point, we can reset bgX to
  // 0 and go back to drawing just one image.
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }


  // Should we speed up cycles per frame
  let cycles = speedSlider.value();
  speedSpan.html(cycles);
  

  // How many times to advance the game
  for (let n = 0; n < cycles; n++) {
    // Show all the pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    // Are we just running the best bird
      for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        // Bird uses its brain!
        bird.think(pipes);
        bird.update();

        // Check all the pipes
        for (let j = 0; j < pipes.length; j++) {
          // It's hit a pipe
          if (pipes[j].hits(activeBirds[i])) {
            // Remove this bird
            activeBirds.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
        }

      }
    

    // Add a new pipe every so often
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  // What is highest score of the current population
  let tempHighScore = 0;
  // If we're training
    // Which is the best bird?
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) {
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    genScore = max(genScore,tempHighScore);

    // Is it the all time high scorer?
    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }

//  console.log(tempHighScore);

  // Update DOM Elements
  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
  aliveBirdSpan.html(activeBirds.length);
  
  // Draw everything!
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

   
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    // If we're out of birds go to the next generation
    if (activeBirds.length == 0) {
      genCounter++;
      generationSpan.html(genCounter);
      console.log(genCounter + "   " + genScore);
      var table = document.getElementById("myTable");
      var row = table.insertRow(i+1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      i++;
      
      cell1.innerHTML = genCounter;
      cell2.innerHTML = genScore;
      
      genScore = 0;
      nextGeneration();
    }
    
}