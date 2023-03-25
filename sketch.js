let seed = 1337;
let frequency = 0.02;
let scaleValue = 1;
let amplitude = 1;
let octaves = 1;
let persistence = 0.16;
let lacunarity = 10;

let cachedSeed = 0;
let cachedFrequency = 0;
let cachedScaleValue = 0;
let cachedAmplitude = 0;
let cachedOctaves = 0;
let cachedPersistence = 0;
let cachedLacunarity = 0;

const WATER_COLOR = [15, 94, 156, 255];
const SAND_COLOR = [194, 178, 128, 255];
const GRASS_COLOR = [86, 125, 70, 255];
const STONE_COLOR = [129, 139, 153, 255];
  
const WIDTH = 800;
const HEIGHT = 800;

const MAX_COLOR = 255;

function setup() {
  frameRate(15);
  pixelDensity(1);
  noiseSeed(seed);
  createCanvas(WIDTH, HEIGHT);
}

function mouseWheel(event) {
  let scrollStep = event.delta / -100;
  scaleValue = constrain(scaleValue + scrollStep, 1, 100);
}

function getTerrainTile(noiseValue) {
  // Close to 0 : water
  // The closer to 1, the higher it will be
  if (noiseValue <= 0.5) {
    return WATER_COLOR;
  }
  if (noiseValue <= 0.55) {
    return SAND_COLOR;
  }
  if (noiseValue <= 0.75) {
    return GRASS_COLOR;
  }
  return STONE_COLOR;
  
}

function paintTerrain(noiseValue, index) {
  result = getTerrainTile(noiseValue);
  let red = result[0];
  let green = result[1];
  let blue = result[2];
  let alpha = result[3];

  pixels[index + 0] = red;
  pixels[index + 1] = green;
  pixels[index + 2] = blue;
  pixels[index + 3] = alpha;
  return pixels;
}

function generateTerrain() {
  cachedSeed = seed;
  cachedFrequency = frequency;
  cachedScaleValue = scaleValue;
  cachedAmplitude = amplitude;
  cachedOctaves = octaves;
  cachedPersistence = persistence;
  cachedLacunairty = lacunarity;
  loadPixels();
  for (let y = 0; y < HEIGHT; ++y) {
    for (let x = 0; x < WIDTH; ++x) {
      let total = 0;
      let octaveFrequency = frequency;
      let octaveAmplitude = amplitude;
      for (let octave = 0; octave < octaves; ++octave) {
        let noiseValue = noise((x / scaleValue) * octaveFrequency, (y / scaleValue) * octaveFrequency) * octaveAmplitude;
        
        total += noiseValue;
        octaveFrequency *= lacunarity;
        octaveAmplitude *= persistence;
      
      }
      let index = (x + y * WIDTH) * 4;
      pixels = paintTerrain(total, index);
      
    }
  }
  updatePixels();
}

function draw() {
  if (cachedSeed != seed || cachedFrequency != frequency ||
     cachedScaleValue != scaleValue || cachedAmplitude != amplitude ||
     cachedOctaves != octaves || cachedPersistence != persistence ||
     cachedLacunarity != lacunarity) {
    generateTerrain();
  }
  
}