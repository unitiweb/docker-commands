
const cleanLines = (text, prefix) => {
    const lines = text.split("\n")
    prefix = prefix && prefix.length > 0 ? prefix : ''
    const linesArray = []
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].length > 0) {
            linesArray.push(prefix + lines[i])
        }
    }
    return linesArray.join("\n")
}

module.exports = {
    cleanLines
}
