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

class Rhythm {
    constructor(song, bpm) {
        this.setSong(song)
        this.setBpm(bpm)
    }

    setSong(song) {
        this.song = song
    }

    setBpm(bpm) {
        this.bpm = bpm
        this.beatSeconds = 60 / bpm
    }

    currentBeat() {
        return Math.floor(this.song.currentTime() / this.beatSeconds)
    }

    quarterProgress() {
        let beat = this.currentBeat()
        const curBeatTime = this.beatSeconds * beat
        const nextBeatTime = this.beatSeconds * (beat + 1)
        return map(this.song.currentTime(), curBeatTime, nextBeatTime, 0, 1)
    }
}

function preload() {
    song = loadSound(songNames[0])
    createVar('bpm', 116.7, 'slider', 50, 150)
}

function setup() {
    createCanvas(600, 600).parent('#canvas')
    rhythm = new Rhythm(song, 116.6)
    song.play()
    positions = [createVector(0, 0), createVector(width - 100, 0)]
}

function draw() {
    background(0)
    fill(255)

    // console.log(rhythm.quarterProgress())
    // let padding = 10
    let beat = rhythm.currentBeat()
    let from, to
    if (beat % 2 === 0) {
        from = positions[0]
        to = positions[1]
    } else {
        from = positions[1]
        to = positions[0]
    }
    let prog = rhythm.quarterProgress()
    prog = Expo.easeIn(prog)
    let pos = p5.Vector.lerp(from, to, prog)
    // let x = map(prog, 0, 1, 0, width - 100)
    rect(pos.x, height / 2 - 50, 100, 100)
    // switch (beat % 4) {
    //     case 0:
    //         rect(
    //             padding,
    //             padding,
    //             width / 2 - padding * 2,
    //             height / 2 - padding * 2,
    //         )
    //         break
    //     case 1:
    //         rect(
    //             width / 2 + padding,
    //             padding,
    //             width / 2 - padding * 2,
    //             height / 2 - padding * 2,
    //         )
    //         break
    //     case 2:
    //         rect(
    //             width / 2 + padding,
    //             height / 2 + padding,
    //             width / 2 - padding * 2,
    //             height / 2 - padding * 2,
    //         )
    //         break
    //     case 3:
    //         rect(
    //             padding,
    //             height / 2 + padding,
    //             width / 2 - padding * 2,
    //             height / 2 - padding * 2,
    //         )
    //         break
    // }
}

function keyPressed(event) {
    if (event.keyCode === LEFT_ARROW) {
        song.jump(song.currentTime() - 5)
    }
    if (event.keyCode === RIGHT_ARROW) {
        song.jump(song.currentTime() + 5)
    }
}
