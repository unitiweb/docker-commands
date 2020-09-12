const term = require('terminal-kit').terminal

const maxLineLength = 100

const headerLine = (topSpace = false, bottomSpace = false, character = '=') => {
    if (topSpace) term("\n")
    term.green(character.repeat(maxLineLength) + "\n")
    if (bottomSpace) term("\n")
}

/**
 * Create a header line
 *
 * @param text The header test
 * @param topLine Boolean to show top line
 * @param bottomLine Boolean to show bottom line
 * @param callback Callback to add addition inside lines of text
 */
const header = (text, topLine = true, bottomLine = true) => {
    // Add a top line if neccessary
    if (topLine) headerLine(true)

    // Add the header text and mike it all uppercase
    term.green(` ${text.toUpperCase()}\n`)

    // Add a bottom line if neccessary
    if (bottomLine) headerLine(false, true)
}

const commands = (list) => {
    if (Array.isArray(list)) {
        for (let i = 0; i < list.length; i++) {
            term.yellow(`   |-- ${list[i]}\n`);
        }
    }
}

const description = (text) => {
    term(`   ${text}`)
}

const spacer = () => {
    term("\n")
}

const error = (text) => {
    const line = '-'.repeat(maxLineLength)
    term.red(`\n\n${line}\n`)
    term.bold.red(` -- ${text}\n`)
    term.red(`${line}\n\n`)
    process.exit(1)
}

module.exports = {
    headerLine,
    header,
    commands,
    description,
    spacer,
    error
}
