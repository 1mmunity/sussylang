// General script for the site like auto resizing textarea.

const textarea = document.getElementById("sussycode")
const wordCount = document.getElementById("charCount")
textarea.addEventListener("input", () => {
  autoResize(textarea)
  charCount(textarea)
})

function charCount(ta) {
  const count = ta.value.length
  const susses = ta.value.match(/\bsus\b/gi) || []
  wordCount.innerText = `${count} Characters - ${susses.length} Susses`
}

function autoResize(ta) {
  // ta.style.height = "auto"
  // ta.style.height = ta.scrollHeight + "px"
}

// // evaluate the sussy code in textarea
// function evaluateCode() {
//   const sussycode = document.getElementById("sussycode")
//   console.log(sussycode.value)
// }

const translateDictionary = '><+-[].,'.split('')
function translateCode() {
  const sussycode = document.getElementById("sussycode")
  const translated = sussycode.value
  .replace(/\s/g, "")
  .split("")
  .map((x, i) => "sus ".repeat(translateDictionary.findIndex(y => y === x) + 1).trim())
  .filter(x => x) // bro i dont even know
  .join("\n")
  .trim()
    
  sussycode.value = `sussy\n${translated}\nsussy`
  autoResize(textarea)
  charCount(textarea)
}

async function loadExample(file) {
  const scode = document.getElementById("sussycode")
  scode.value = await fetch('./examples/' + file).then((x) => x.text())
}

function copyCode() {
  const sussycode = document.getElementById("sussycode")
  sussycode.select()
  document.execCommand("copy") // why is it deprecated?
  window.getSelection().removeAllRanges()
}

const files = [{
  name: 'hello_world.sus',
  description: 'Outputs "Hello World!"'
},
{
  name: 'fib.sus',
  description: 'Outputs the fibonacci sequence'
}, {
  name: 'e.sus',
  description: 'Outputs the euler number'
}, {
  name: 'golden.sus',
  description: 'Outputs the golden ratio'
}, {
  name: 'squares.sus',
  description: 'Outputs the squares of the numbers from 0 to infinity'
}, {
  name: 'echo.sus',
  description: 'Outputs the input'
}]
function exLoad() {
  const examples = document.getElementById("examples")
  const formatted = files.sort((a, b) => b.name.length - a.name.length).map(x => `<button onclick="loadExample('${x.name}')">${x.name}</button> - <span>${x.description}</span>`).join('<br />')
  examples.innerHTML = formatted
}

exLoad()