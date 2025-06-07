# getParagraphsDiff

**getParagraphsDiff** is a lightweight TypeScript utility to detect and extract differences between two texts at the paragraph level. 
A paragraph is defined as a block of text separated by a newline.
Ideal for editors, document comparison tools, or any application that needs to visualize inline changes between two versions of a text.

## Features
- Detects modified paragraphs in two versions of a text
- Identifies character-level differences within changed paragraphs
- Provides paragraph-level offset differences
- Ignores identical content to focus only on modified parts

## Technologies Used
- JavaScript
- TypeScript
- Git
- Mocha
- Webpack

## Example
```ts
const originalText = `Introduction paragraph
Details about topic A
Details about topic B
Conclusion`;

const modifiedText = `Introduction paragraph
Details about topic A and more
Conclusion
Additional notes`;

const result = getParagraphsDiff(originalText, modifiedText);

console.log(result);

/*
[
  {
    original: 'Details about topic A',
    modified: 'Details about topic A and more',
    originalIndex: 23,
    modifiedIndex: 23,
    diff: {
      startIndex: 21,
      originalDiffSequence: '',
      modifiedDiffSequence: ' and more'
    }
  },
  {
    original: 'Details about topic B',
    modified: 'Conclusion',
    originalIndex: 45,
    modifiedIndex: 54,
    diff: {
      startIndex: 0,
      originalDiffSequence: 'Details about topic B',
      modifiedDiffSequence: 'Conclusion'
    }
  },
  {
    original: 'Conclusion',
    modified: 'Additional notes',
    originalIndex: 67,
    modifiedIndex: 65,
    diff: {
      startIndex: 0,
      originalDiffSequence: 'Conclusion',
      modifiedDiffSequence: 'Additional notes'
    }
  }
]
*/
```
