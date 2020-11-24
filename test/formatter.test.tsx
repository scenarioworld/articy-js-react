import { formatDisplayText, FormatProcessor } from '../src/formatter';
import renderer from 'react-test-renderer';
import React from 'react';

const testKey = 'test-format';

function render(text: string, processor?: FormatProcessor) {
  return renderer.create(formatDisplayText(testKey, text, processor)).toJSON();
}

test('No paragraphs', () => {
  expect(render('This is some text.')).toMatchSnapshot();
});

test('Basic paragraphs', () => {
  expect(render('One paragraph.\n\nTwo paragraph')).toMatchSnapshot();
});

test('No paragraphs for single newlines', () => {
  expect(render('This is all\nOne paragraph.')).toMatchSnapshot();
});

test('Bold and italics', () => {
  expect(
    render('Some text in <b>bold</b> vs <i>italics</i>.')
  ).toMatchSnapshot();
});

test('Three newlines should break a paragraph then trim', () => {
  expect(
    render('One paragraph.\n\n\nStart of new trimmed paragraph.')
  ).toMatchSnapshot();
});

test('Bold across paragraph break', () => {
  expect(
    render('What happens if we <b>bold across\n\nparagraphs</b>.')
  ).toMatchSnapshot();
});

const replaceNo: FormatProcessor = function(fragment) {
  const processed = fragment
    .split('no')
    .flatMap((v, i) => [v, <input key={i.toString()} />]);
  processed.pop();
  return processed;
};

test("Processor to replace 'no' with <input>", () => {
  expect(
    render(
      'You should see no no in here.\n\nAnd no no in here.\n\nno',
      replaceNo
    )
  ).toMatchSnapshot();
});
