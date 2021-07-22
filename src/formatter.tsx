import {
  DisplayNameProps,
  MenuTextProps,
  TechnicalNameProps,
} from 'articy-js';
import React from 'react';

type FormatResult = string | JSX.Element | (string | JSX.Element)[];
export type FormatProcessor = (fragment: string) => FormatResult;

/** Regex used to find formatting tags */
const FormattingRegex = /<(\w)>(.*?)<\/\1>/g;

function applyFormatting(snippet: string, processor: FormatProcessor) {
  // Collect all regex matches
  const matches: RegExpExecArray[] = [];
  while (true) {
    const match = FormattingRegex.exec(snippet);
    if (match === null) {
      break;
    }
    matches.push(match);
  }

  // Iterate through matches and process
  let index = 0;
  const elements: FormatResult[] = [];
  for (const match of matches) {
    // Add prelude
    const startIndex = match.index;
    if (index !== startIndex) {
      elements.push(processor(snippet.substr(index, startIndex - index)));
    }

    // Get match info
    const formattingType = match[1];
    const contents = applyFormatting(match[2], processor);

    // Apply style element
    switch (formattingType) {
      case 'i':
        elements.push(<i key={`i${index}`}>{contents}</i>);
        break;
      case 'b':
        elements.push(<strong key={`b${index}`}>{contents}</strong>);
        break;
    }

    // Move index
    index = match.index + match[0].length;
  }

  // Push end
  if (index !== snippet.length) {
    elements.push(processor(snippet.substr(index)));
  }

  return elements;
}

function formatParagraph(
  paragraph: string,
  processor: FormatProcessor
): (FormatResult | FormatResult[])[] {
  const result = [];
  let index = 0;
  let next = -1;
  while ((next = paragraph.indexOf('\n', index)) !== -1) {
    result.push(
      applyFormatting(paragraph.substr(index, next - index), processor)
    );
    result.push(<br key={index} />);
    index = next + 1;
  }

  result.push(applyFormatting(paragraph.substr(index), processor));
  return result;
}

/**
 * Formats text from articy into paragraphs and the appropriate styles
 * @param text Text to format
 * @param processor Optional extra processor to run on snippets of text before emitting
 */
export function formatDisplayText(
  key: string | undefined,
  text: string,
  processor: FormatProcessor = f => f
): JSX.Element {
  // Split into paragraphs based on double newlines
  const paragraphs = text
    .replace(/\r/g, '')
    .split('\n\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);
  let index = 0;
  return (
    <React.Fragment key={key}>
      {paragraphs.map(t => (
        <p key={`p${index++}`}>{formatParagraph(t, processor)}</p>
      ))}
    </React.Fragment>
  );
}

/**
 * Gets the appropriate display text for a node. Useful for debugging.
 * @param textProps Properties block that contains some kind of title
 */
export function GetDisplayText(
  textProps: TechnicalNameProps | MenuTextProps | DisplayNameProps
): string {
  if ('DisplayName' in textProps) {
    return textProps.DisplayName;
  } else if ('MenuText' in textProps) {
    return textProps.MenuText;
  } else {
    return textProps.TechnicalName;
  }
}
