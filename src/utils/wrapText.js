const d3 = require('d3')
let _ = require('lodash')

let getTruncatedText = (text, maxWordLength) => _.truncate(text, {length: maxWordLength})

// One way of achieving text-wrapping capability in SVG
// Text is broken down to words, each word is added to a line and then the lines width is checked
// If the line width is less than the max we move to the next word, if more we add new line etc
// until the max number of lines is reached.
module.exports = function wrapText(
  text,
  maxLineWidth,
  maxNumberOfLines=1,
  maxWordLength=17
) {
  if (!text.length) {
    return ''
  }

  let editedClass = ''

  text[0].forEach(textNode => {
    const text = d3.select(textNode)
    const x = text.attr('x')
    const y = text.attr('y')
    const dy = parseFloat(text.attr('dy'))
    const lineHeight = 1.1
    const words = text
      .text()
      .split(/\s+/)
      .reverse()

    let lineNumber = 0
    let curLineWidth
    let word
    let line = []
    let tspan = text
      .text(null)
      .append('tspan')
      .style('text-anchor', 'middle')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', dy + 'em')

    while (lineNumber < maxNumberOfLines && words.length) {
      word = words.pop()
      line.push(word)
      tspan.text(line.join(' '))

      curLineWidth = tspan.node().getComputedTextLength()

      if (curLineWidth > maxLineWidth) {
        if (lineNumber + 1 === maxNumberOfLines) {
          tspan.text(getTruncatedText(line.join(' '), maxWordLength))
          break
        } else {
          line.pop()
          tspan.text(line.join(' '))
          line = [word]
          tspan = text
            .append('tspan')
            .style('text-anchor', 'middle')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(getTruncatedText(word, maxWordLength))
        }
        if (word.length > maxWordLength) {
          break
        }
      }
    }

    if (!editedClass) {
      editedClass = text.attr('class').replace(' unedited', '')
    }

    text.attr('class', editedClass)
  })
}
