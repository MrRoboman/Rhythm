let rhythm
let song
let songNames = ['../_sound/youtube/billiejean.mp3']

let size
let offset = 1.494

function preload() {
    song = loadSound(songNames[0])
}

function setupEventListeners() {
    document
        .getElementById('playButton')
        .addEventListener('click', onClickPlayButton)
    document
        .getElementById('backButton')
        .addEventListener('click', onBackFiveSecs)
    document
        .getElementById('forwardButton')
        .addEventListener('click', onForwardFiveSecs)
}

function setup() {
    setupEventListeners()
    createCanvas(400, 400).parent('#canvas')
    createVar('bpm', 116.5, 'slider', 50, 150)
    createVar('offset', offset, 'slider', 0, 3, 0.001)
    rhythm = new Rhythm(song, getVar('bpm'))
    size = height / rhythm.beatSeconds.length
}

function draw() {
    background(0)
    fill(255)
    rhythm.setBpm(getVar('bpm'))
    rhythm.setOffset(getVar('offset'))

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

function onClickPlayButton() {
    if (song.isPlaying()) {
        song.stop()
    } else {
        song.play()
        song.jump(offset - 0.3)
    }
}

function onBackFiveSecs() {
    const newTime = max(0, song.currentTime() - 5)
    song.jump(newTime)
}

function onForwardFiveSecs() {
    const newTime = min(song.duration(), song.currentTime() + 5)
    song.jump(newTime)
}
