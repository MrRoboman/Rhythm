let filter, filterFreq, filterRes
let fft

let song
let songNames = [
    '../_sound/youtube/billiejean_trim.mp3',
    '../_sound/again/Again_Again_part1.wav',
    '../_sound/again/Again_Again_part2.wav',
    '../_sound/again/Again_Again_part3.wav',
    '../_sound/again/Again_Again_part4.wav',
]

// let bpm = 116 // Billie Jean
// let beatSeconds = bpm / 60
// beatSeconds /= 4
// let beatInverse = 1 / beatSeconds

function preload() {
    song = loadSound(songNames[0])

    createVar('bpm', 116.6, 'slider', 50, 150)
    // createVar('beatSeconds', 0.5172413793103449, 'slider', 0, 1, 0.001)
    createVar('beatSeconds', 60 / getVar('bpm'), 'slider', 0, 1, 0.001)
    // setVar('beatSeconds', getVar('beatSeconds') / 4)
}

function setup() {
    createCanvas(600, 600).parent('#canvas')
    song.play()
    // song.jump(50)
    // song.loop()
    filter = new p5.LowPass()
    // song.disconnect()
    // song.connect(filter)
    fft = new p5.FFT()
}

function draw() {
    background(0)
    fill(255)
    background(30)

    // Map mouseX to a the cutoff frequency from the lowest
    // frequency (10Hz) to the highest (22050Hz) that humans can hear
    // filterFreq = map(mouseX, 0, width, 10, 22050)

    // // Map mouseY to resonance (volume boost) at the cutoff frequency
    // filterRes = map(mouseY, 0, height, 15, 5)

    // // set filter parameters
    // filter.set(filterFreq, filterRes)

    // // Draw every value in the soundFile spectrum analysis where
    // // x = lowest (10Hz) to highest (22050Hz) frequencies,
    // // h = energy (amplitude / volume) at that frequency
    // let spectrum = fft.analyze()
    // noStroke()
    // for (let i = 0; i < spectrum.length; i++) {
    //     let x = map(i, 0, spectrum.length, 0, width)
    //     let h = -height + map(spectrum[i], 0, 255, height, 0)
    //     rect(x, height, width / spectrum.length, h)
    // }

    let padding = 10
    let beat = getCurrentBeat()
    switch (beat % 4) {
        case 0:
            rect(
                padding,
                padding,
                width / 2 - padding * 2,
                height / 2 - padding * 2,
            )
            break
        case 1:
            rect(
                width / 2 + padding,
                padding,
                width / 2 - padding * 2,
                height / 2 - padding * 2,
            )
            break
        case 2:
            rect(
                width / 2 + padding,
                height / 2 + padding,
                width / 2 - padding * 2,
                height / 2 - padding * 2,
            )
            break
        case 3:
            rect(
                padding,
                height / 2 + padding,
                width / 2 - padding * 2,
                height / 2 - padding * 2,
            )
            break
    }
}

function getCurrentBeat() {
    let beatSeconds = 60 / getVar('bpm')
    // beatSeconds /= 4
    // let beatInverse = 1 / beatSeconds
    // console.log(
    //     Math.floor(song.currentTime() * beatInverse) ===
    //         Math.floor(song.currentTime() / beatSeconds),
    // )
    return Math.floor(song.currentTime() / beatSeconds)
}

let taps = []
function mouseClicked() {
    // taps.push(song.currentTime())
    // if (taps.length < 2) return
    // if (taps.length > 2) {
    //     taps.splice(0, 1)
    // }
    // let beatSeconds = taps[1] - taps[0]
    // setVar('beatSeconds', beatSeconds)
    // console.log(beatSeconds)
}

function keyPressed(event) {
    if (event.keyCode === LEFT_ARROW) {
        song.jump(song.currentTime() - 5)
    }
    if (event.keyCode === RIGHT_ARROW) {
        song.jump(song.currentTime() + 5)
    }
}
