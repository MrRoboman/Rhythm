class Rhythm {
    static WHOLE = 0
    static HALF = 1
    static QUARTER = 2
    static EIGHTH = 3
    static SIXTEENTH = 4

    constructor(song, bpm) {
        this.beatSeconds = [0, 0, 0, 0, 0]
        this.setSong(song)
        this.setBpm(bpm)
    }

    setSong(song) {
        this.song = song
    }

    setBpm(bpm) {
        if (this.bpm !== bpm) {
            this.bpm = bpm
            this.beatSeconds[Rhythm.WHOLE] = 240 / bpm
            this.beatSeconds[Rhythm.HALF] = 120 / bpm
            this.beatSeconds[Rhythm.QUARTER] = 60 / bpm
            this.beatSeconds[Rhythm.EIGHTH] = 30 / bpm
            this.beatSeconds[Rhythm.SIXTEENTH] = 15 / bpm
        }
    }

    getBeat(timing) {
        return Math.floor(this.song.currentTime() / this.beatSeconds[timing])
    }

    getBeatProgress(timing) {
        let beat = this.getBeat(timing)
        let beatSeconds = this.beatSeconds[timing]
        const curBeatStart = beatSeconds * beat
        const nextBeatStart = beatSeconds * (beat + 1)
        return map(this.song.currentTime(), curBeatStart, nextBeatStart, 0, 1)
    }
}
