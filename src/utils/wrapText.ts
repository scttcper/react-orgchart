import { select, type Selection } from 'd3-selection';

const getTruncatedText = (text: string, maxWordLength: number): string => {
  if (text.length <= maxWordLength) {
    return text;
  }

  if (maxWordLength <= 3) {
    return '.'.repeat(maxWordLength);
  }

  return `${text.slice(0, maxWordLength - 3)}...`;
};

// One way of achieving text-wrapping capability in SVG
// Text is broken down to words, each word is added to a line and then the lines width is checked
// If the line width is less than the max we move to the next word, if more we add new line etc
// until the max number of lines is reached.
export function wrapText<Datum>(
  text: Selection<SVGTextElement, Datum, SVGGElement, unknown>,
  maxLineWidth: number,
  maxNumberOfLines = 3,
  maxWordLength = 17,
): void {
  let editedClass = '';

  text.each(function eachTextNode() {
    const textSelection = select(this);
    const x = textSelection.attr('x');
    const y = textSelection.attr('y');
    const dy = Number.parseFloat(textSelection.attr('dy') ?? '0');
    const lineHeight = 1.1;
    const words = textSelection.text().split(/\s+/).reverse();

    let lineNumber = 0;
    let curLineWidth = 0;
    let word = '';
    let line: string[] = [];
    let tspan = textSelection
      .text(null)
      .append('tspan')
      .style('text-anchor', 'middle')
      .attr('x', x)
      .attr('y', y)
      .attr('dy', `${dy}em`);

    while (lineNumber < maxNumberOfLines && words.length > 0) {
      const nextWord = words.pop();
      if (!nextWord) {
        break;
      }

      word = nextWord;
      line.push(word);
      tspan.text(line.join(' '));

      curLineWidth = tspan.node()?.getComputedTextLength() ?? 0;

      if (curLineWidth > maxLineWidth) {
        if (lineNumber + 1 === maxNumberOfLines) {
          tspan.text(getTruncatedText(line.join(' '), maxWordLength));
          break;
        } else {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = textSelection
            .append('tspan')
            .style('text-anchor', 'middle')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', `${++lineNumber * lineHeight + dy}em`)
            .text(getTruncatedText(word, maxWordLength));
        }

        if (word.length > maxWordLength) {
          break;
        }
      }
    }

    if (!editedClass) {
      editedClass = (textSelection.attr('class') ?? '').replace(' unedited', '');
    }

    textSelection.attr('class', editedClass);
  });
}
