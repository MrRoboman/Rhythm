let versions

let undoHistory = []
let curUndo = -1

let vars = {}
let defaultValues = {}

function createVar(name, value, type, ...rest) {
    let div
    const controls = document.getElementById('controls')

    const v = { value, type }

    switch (type) {
        case 'select':
            div = createDiv()
            div.parent(controls)

            v.label = createSpan(name)
            v.label.parent(div)

            v.select = createSelect()
            v.select.parent(div)

            v.options = []
            rest.forEach(option => {
                v.select.option(option)
                v.options.push(option)
            })

            v.select.elt.addEventListener('input', event => {
                setVar(name, event.target.selectedIndex)
                saveValues()
                updateUndo()
            })
            break
        case 'color':
            div = createDiv()
            div.parent(controls)

            v.label = createSpan(name)
            v.label.parent(div)

            v.colorInput = createInput()
            v.colorInput.parent(div)

            v.input = createInput()
            v.input.parent(div)

            const picker = new JSColor(v.colorInput.elt)
            picker.fromString(value)
            v.colorInput.elt.addEventListener('input', event => {
                setVar(name, event.target.jscolor.toHEXString())
                saveValues()
            })

            v.colorInput.elt.addEventListener('change', event => {
                updateUndo()
            })

            v.input.elt.addEventListener('change', event => {
                setVar(name, event.target.value)
                saveValues()
                updateUndo()
            })
            break
        case 'slider':
            div = createDiv()
            div.parent(controls)

            v.label = createSpan(name)
            v.label.parent(div)

            v.slider = createSlider(rest[0], rest[1], value, rest[2])
            v.slider.parent(div)

            v.input = createInput()
            v.input.parent(div)

            v.slider.elt.addEventListener('input', event => {
                setVar(name, parseFloat(event.target.value))
                saveValues()
            })

            v.slider.elt.addEventListener('change', event => {
                updateUndo()
            })

            v.input.elt.addEventListener('input', event => {
                setVar(name, event.target.value)
                saveValues()
            })

            v.input.elt.addEventListener('change', event => {
                updateUndo()
            })
            break
        case 'vector':
            break
        default:
            console.log('Invalid type for ', name)
    }

    vars[name] = v
    defaultValues[name] = v.value
    setVar(name, value)

    return v
}

function getVar(name) {
    return vars[name].value
}

function setVar(name, val) {
    const v = vars[name]
    if (!v) {
        console.log('Variable ', name, ' does not exist')
        return
    }
    v.value = val
    switch (v.type) {
        case 'select':
            v.select.elt.selectedIndex = val
            break
        case 'color':
            v.colorInput.elt.jscolor.fromString(val)
            v.input.elt.value = val
            break
        case 'slider':
            v.slider.elt.value = val
            v.input.elt.value = val
            break
        case 'vector':
            break
        default:
            console.log('Invalid type for ', name)
    }
}

function undo() {
    if (curUndo > 0) {
        curUndo--
        for (const name in undoHistory[curUndo]) {
            setVar(name, undoHistory[curUndo][name])
        }
        saveValues()
    }
}

function redo() {
    if (curUndo < undoHistory.length - 1) {
        curUndo++
        for (const name in undoHistory[curUndo]) {
            setVar(name, undoHistory[curUndo][name])
        }
        saveValues()
    }
}

function getValues() {
    const vals = {}
    for (const name in vars) {
        const variable = vars[name]
        if (variable.type === 'vector') {
            const { x, y, z } = variable.value
            vals[name] = { x, y, z, type: 'vector' }
        } else {
            vals[name] = getVar(name)
        }
    }
    return vals
}

function saveValues() {
    localStorage.setItem('values', JSON.stringify(getValues()))
}

function updateUndo() {
    undoHistory = undoHistory.slice(0, curUndo + 1)
    undoHistory.push(getValues())
    curUndo = undoHistory.length - 1
    console.log(undoHistory)
}

function loadValues() {
    if (localStorage.getItem('values')) {
        const values = JSON.parse(localStorage.getItem('values'))
        for (const name in values) {
            const val = values[name]
            if (typeof val === 'object' && val.type === 'vector') {
                const { x, y, z } = val
                setVar(name, createVector(x, y, z))
            } else {
                setVar(name, val)
            }
        }
    }
}

function getSong() {
    const songName = vars.song.options[vars.song.value]
    return songs[songName]
}

function playSong() {
    const song = getSong()
    if (!song.isPlaying()) {
        song.play()
        document.getElementById('playButton').innerHTML = 'Pause'
    }
}

function pauseSong() {
    const song = getSong()
    if (song.isPlaying()) {
        song.pause()
        document.getElementById('playButton').innerHTML = 'Play'
    }
}
function stopSong() {
    const song = getSong()
    if (song.isPlaying()) {
        song.stop()
        document.getElementById('playButton').innerHTML = 'Play'
    }
}

function restoreDefaults() {
    for (name in defaultValues) {
        setVar(name, defaultValues[name])
    }
    saveValues()
    updateUndo()
}

function saveVersion() {
    const timestamp = new Date().toISOString()
    versions[timestamp] = getValues()
    localStorage.setItem('versions', JSON.stringify(versions))
    addVersionAnchor(timestamp)
}

function loadVersions() {
    versions = localStorage.getItem('versions') || '{}'
    versions = JSON.parse(versions)
    Object.keys(versions).forEach(key => {
        addVersionAnchor(key)
    })
}

function addVersionAnchor(name) {
    const div = createDiv()
    div.parent(document.getElementById('versions'))
    const anchor = createA('#', name)
    anchor.parent(div)
    anchor.elt.addEventListener('click', clickVersion)
}

function clickVersion(event) {
    console.log(event)
    const values = { ...versions[event.target.text] }
    for (const name in values) {
        setVar(name, values[name])
    }
    saveValues()
    updateUndo()
}

function createGrid(cols, rows) {
    const grid = []
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let u = map(c, 0, cols - 1, 0, 1)
            let v = map(r, 0, rows - 1, 0, 1)

            grid.push({ u, v })
        }
    }
    return grid
}

function getGridPositions(grid, _width, _height, _margin) {
    const w = _width - _margin * 2
    const h = _height - _margin * 2
    return grid.map(({ u, v }) => ({ x: u * w + _margin, y: v * h + _margin }))
}

class Camera {
    update() {
        let pos = getVar('cameraPos')
        let dir = getVar('cameraDir')
        let vel = getVar('cameraVel')

        if (keyIsPressed) {
            // Move forward
            if (key === 'w') {
                const moveVector = p5.Vector.sub(dir, pos)
                moveVector.normalize()
                pos.add(moveVector)
                dir.add(moveVector)
            }
            // Move backward
            if (key === 's') {
                const moveVector = p5.Vector.sub(pos, dir)
                moveVector.normalize()
                pos.add(moveVector)
                dir.add(moveVector)
            }
            // Strafe left
            if (key === 'a') {
                const p = createVector(pos.x, pos.z)
                const d = createVector(dir.x, dir.z)
                const m = p5.Vector.sub(d, p)
                m.normalize()
                m.rotate(-PI / 2)

                // const moveVector = p5.Vector.sub(dir, pos)
                // moveVector.normalize()

                pos.add(m)
                dir.add(m)
            }
            saveValues()
        }

        camera(pos.x, pos.y, pos.z, dir.x, dir.y, dir.z, 0, 1, 0)
    }
}
