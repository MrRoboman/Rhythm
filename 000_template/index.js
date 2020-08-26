let song

function preload() {
    song = loadSound('')
}

function setup() {
    createCanvas(600, 600).parent('#canvas')
    song.play()
}

function draw() {
    background(0)
}
