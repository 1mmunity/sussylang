let cells = new Array(10).fill(0)
let pointer = 0
sussy = null

const tableCells = document.getElementById('tableCells')

const modes = {
  EVAL: 'eval',
  CODE: 'code'
}

function displayCellsToTable() {
  const view = cells.map((x, i) => {
    return `<tr${i === pointer && ' class="current-cell"'}>
    <td>${i+1}</td>
    <td>${x}</td>
    </tr>`
  })

  tableCells.innerHTML = `<tr>
  <th>Cell</th>
  <th>Value</th>
  </tr>
  ${view.join('\n')}`
}

function switchMode(mode) {
  const evalMode = document.getElementById("evalMode")
  const codeMode = document.getElementById("codeMode")

  if (mode == 'eval') {
    evalMode.style.display = 'block'
    codeMode.style.display = 'none'
  } else if (mode == 'code') {
    resetAll()
    evalMode.style.display = 'none'
    codeMode.style.display = 'block'
  }
}

function resetAll() {
  sussy = null
  cells = new Array(10).fill(0)
  pointer = 0
  updateOperations(0)
  displayCellsToTable()
  updateCurrentLine(0)
  updateCurrentOutput('')
}

function updateCurrentLine(current) {
  const currentLine = document.getElementById("currentLine")
  currentLine.innerText = current
}

// on eval button click
function evaluateCode() {
  resetAll()

  const sussycode = document.getElementById("sussycode")
  const input = document.getElementById("input")
  const inputText = document.getElementById("inputText")
  const lines = document.getElementById("lines")

  const cleaned = cleanCode(sussycode.value)
  inputText.innerText = input.value
  lines.innerText = cleaned.split('\n').length
  
  switchMode(modes.EVAL)
  displayCellsToTable()
}

function updateOperations(ops) {
  const operations = document.getElementById("operations")
  operations.innerText = `${ops}`
}

function updateCellsUtilized() {
  const cellsUtilized = document.getElementById("cellsUtilized")
  // const bytesUtilized = document.getElementById("bytesUtilized")

  // bytesUtilized.innerText = `${cells}`
  cellsUtilized.innerText = `${cells.length}`
}

function runCode(delay) {
  resetAll()
  sussy = null
  const sussycode = document.getElementById("sussycode")
  const input = document.getElementById("input")

  const cleaned = cleanCode(sussycode.value)

  const splitted = cleaned.split('\n')
  const codeArray = splitted.map(x => x.trim().split(' ').length-1)

  if (!input.value && codeArray.includes(7)) {
    const outs = document.getElementById("output")
    outs.innerHTML = `<span style="color:red;">(Err: Must have an input when using the input operator!)</span>`
    return
  }

  try {
    sussy = new SussyLang(codeArray, input.value, delay)
    sussy.execute()
  } catch (e) {
    const outs = document.getElementById("output")
    outs.innerHTML += ` <span style="color:red;">(Err: ${e})</span>`
  }
}

function updateCurrentOutput(output) {
  const currentOutput = document.getElementById("output")
  currentOutput.innerText = output
}

function killSussy() {
  window.location.reload()
}

// translate it back to brainf* lol
// const translateDictionary = '><+-[].,'.split('')

// only read between the 2 sussies
function cleanCode(code) {
  const splitted = code
  .trim()
  .split('\n')

  const firstSussyindex = splitted.findIndex(x => x.trim() === 'sussy')

  if (firstSussyindex === -1) return code
  else {
    splitted.splice(0, firstSussyindex+1)
    const secondSussyIndex = splitted.findIndex(x => x.trim() === 'sussy')
    if (secondSussyIndex === -1) return code
    else {
      splitted.splice(secondSussyIndex, splitted.length)
      return splitted.join('\n')
    }
  } // i dont even know anymore
}

class SussyLang {
  constructor(codeArray, inp, delay) {
    // codeArray: [0, 2, 1, 3] >+<-
    this.in = inp
    this.output = null
    this.c = null
    this.codeArray = codeArray
    this.ops = 0
  
    this.blockOpeners = {}
    this.blockClosers = {}
    this.bfSource = this.translateBack()
    this.msDelay = delay
    this.getBlocks(this.bfSource)

    this.operators = {
      '>': () => {
        pointer += 1
        if (pointer === cells.length) cells[pointer] = 0
        this.c += 1
      },
      '<': () => {
        pointer -= 1
        if (pointer < 0) pointer = 0
        this.c += 1
      },
      '+': () => {
        if (cells[pointer]+1 === 256) cells[pointer] = 0
        else cells[pointer] += 1

        // cells[pointer] += 1
        this.c++
      },
      '-': () => {
        if (cells[pointer]-1 === -1) cells[pointer] = 255
        else cells[pointer] -= 1

        // cells[pointer] -= 1
        this.c++
      },
      '[': () => {
        if (!cells[pointer]) this.c = this.blockOpeners[this.c] + 1
        else this.c++
      },
      ']': () => {
        if (cells[pointer]) this.c = this.blockClosers[this.c] + 1
        else this.c++
      },
      '.': () => {
        const m = String.fromCharCode(cells[pointer])
        this.output += m
        this.c++

        if (this.msDelay) {
          const ots = document.getElementById("output")
          ots.innerText = this.output
        }
      },
      ',': () => {
        if (!this.in.length) return false
        cells[pointer] = this.in.charCodeAt(0)
        this.in = this.in.substring(1)
        this.c++
      }
    }

  }

  translateBack() {
    return this.codeArray.map(x => translateDictionary[x]).join('')
  }

  getBlocks(code) {
    let i = 0
    let match, open
    const brackets = /\[|\]/g
    const stack = []
    while (i < code.length) {
      match = code.substring(i).search(brackets)
      if (match < 0) break
      
      match += i
      
      if (code[match] === '[') {
        stack.push(match)
      } else {
        open = stack.pop()
        this.blockOpeners[open] = match
        this.blockClosers[match] = open
      }

      i = match + 1
    }
    if (stack.length) throw 'Loops must be closed!'
  }

  async execute() {
    resetAll()
    this.c = 0
    this.output = ''
    this.input = input
    const source = this.bfSource
    var l = source.length
    while (this.c < l) {
      this.ops++
      if (this.operators[source[this.c]]() === false) break

      if (this.msDelay) {
        displayCellsToTable()
        updateCurrentLine(this.c)
        updateOperations(this.ops)
        updateCellsUtilized()
        await new Promise((resolve) => setTimeout(resolve, this.msDelay))
      } else if (this.ops % 1000 === 0 || this.ops < 1000) {
        displayCellsToTable()
        updateCurrentLine(this.c)
        updateCurrentOutput(this.output)
        updateOperations(this.ops)
        updateCellsUtilized()
        await new Promise((resolve) => setTimeout(resolve, 1)) // will lag if it's too fast
      }
    }
    return this.output
  }
}
