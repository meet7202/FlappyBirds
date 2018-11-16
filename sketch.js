
let totalPopulation = 500;
let activeBirds = [];
let allBirds = [];
let pipes = [];
let counter = 0;

let genCounter = 0;
let genScore = 0;

let speedSlider;
let generationSpan;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

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
  
  speedSlider = select('#speedSlider');
  generationSpan = select('#gs');
  speedSpan = select('#speed');
  highScoreSpan = select('#hs');
  allTimeHighScoreSpan = select('#ahs');
  aliveBirdSpan = select('#aliveb');
  
  for (let i = 0; i < totalPopulation; i++) {
    let bird = new Bird();
    activeBirds[i] = bird;
    allBirds[i] = bird;
  }
}


function draw() {
  background(bgImg);
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= 4.8;
  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }


  let cycles = speedSlider.value();
  speedSpan.html(cycles);
  

  for (let n = 0; n < cycles; n++) {
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
      for (let i = activeBirds.length - 1; i >= 0; i--) {
        let bird = activeBirds[i];
        bird.think(pipes);
        bird.update();

        for (let j = 0; j < pipes.length; j++) {
          if (pipes[j].hits(activeBirds[i])) {
            activeBirds.splice(i, 1);
            break;
          }
        }

        if (bird.bottomTop()) {
          activeBirds.splice(i, 1);
        }

      }
    

    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
  }

  let tempHighScore = 0;
    let tempBestBird = null;
    for (let i = 0; i < activeBirds.length; i++) {
      let s = activeBirds[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = activeBirds[i];
      }
    }

    genScore = max(genScore,tempHighScore);

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }

  highScoreSpan.html(tempHighScore);
  allTimeHighScoreSpan.html(highScore);
  aliveBirdSpan.html(activeBirds.length);
  
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].show();
  }

   
    for (let i = 0; i < activeBirds.length; i++) {
      activeBirds[i].show();
    }
    if (activeBirds.length == 0) {
      genCounter++;
      generationSpan.html(genCounter);
      console.log(genCounter + "   " + genScore);
      var table = document.getElementById("myTable");
      var row = table.insertRow(i);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      i++;
      
      cell1.innerHTML = genCounter;
      cell2.innerHTML = genScore;
      
      genScore = 0;
      nextGeneration();
    }
    
}
