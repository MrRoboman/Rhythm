let rhythm
let song
let songNames = [
    '../_sound/youtube/billiejean_trim.mp3',
    '../_sound/again/Again_Again_part1.wav',
    '../_sound/again/Again_Again_part2.wav',
    '../_sound/again/Again_Again_part3.wav',
    '../_sound/again/Again_Again_part4.wav',
]

let positions

function preload() {
    song = loadSound(songNames[0])
    createVar('bpm', 116.0, 'slider', 50, 150)
}

function setup() {
    createCanvas(600, 600).parent('#canvas')
    rhythm = new Rhythm(song, getVar('bpm'))
    song.play()
    positions = [createVector(0, 0), createVector(width - 100, 0)]
}

function draw() {
    background(0)
    fill(255)
    rhythm.setBpm(getVar('bpm'))

    let from, to
    let timing = Rhythm.QUARTER
    let beat = rhythm.getBeat(timing)
    if (beat % 2 === 0) {
        from = positions[0]
        to = positions[1]
    } else {
        from = positions[1]
        to = positions[0]
    }
    let prog = rhythm.getBeatProgress(timing)
    prog = Power4.easeIn(prog)
    let pos = p5.Vector.lerp(from, to, prog)
    rect(pos.x, height / 2 - 50, 100, 100)
}

function keyPressed(event) {
    if (event.keyCode === LEFT_ARROW) {
        song.jump(song.currentTime() - 5)
    }
    if (event.keyCode === RIGHT_ARROW) {
        song.jump(song.currentTime() + 5)
    }
}
