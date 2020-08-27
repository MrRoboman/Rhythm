let rhythm
let song
let songNames = [
    '../_sound/youtube/billiejean_trim.mp3',
    '../_sound/again/Again_Again_part1.wav',
    '../_sound/again/Again_Again_part2.wav',
    '../_sound/again/Again_Again_part3.wav',
    '../_sound/again/Again_Again_part4.wav',
]

let size

function preload() {
    song = loadSound(songNames[0])
    createVar('bpm', 116.0, 'slider', 50, 150)
}

function setup() {
    createCanvas(400, 400).parent('#canvas')
    rhythm = new Rhythm(song, getVar('bpm'))
    size = height / rhythm.beatSeconds.length
    song.play()
}

function draw() {
    background(0)
    fill(255)
    rhythm.setBpm(getVar('bpm'))

    let from, to
    rhythm.beatSeconds.forEach((_, i) => {
        let beat = rhythm.getBeat(i)
        if (beat % 2 === 0) {
            from = createVector(0, size * i)
            to = createVector(width - size, size * i)
        } else {
            from = createVector(width - size, size * i)
            to = createVector(0, size * i)
        }
        let prog = rhythm.getBeatProgress(i)
        // prog = Power4.easeIn(prog)
        let pos = p5.Vector.lerp(from, to, prog)
        rect(pos.x, pos.y, size, size)
    })
}

function keyPressed(event) {
    if (event.keyCode === LEFT_ARROW) {
        song.jump(song.currentTime() - 5)
    }
    if (event.keyCode === RIGHT_ARROW) {
        song.jump(song.currentTime() + 5)
    }
}
