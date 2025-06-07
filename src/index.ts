"use strict";

interface TextsDiff {
  startIndex: number | null;
  originalDiffSequence: string;
  modifiedDiffSequence: string;
}

export function getTextsDiff(
  original: string, // Original text
  modified: string // Modified text
): TextsDiff | null {
  if (original === modified) {
    return null;
  }

  // Find the index of the first modified character
  let startIndex = 0;
  while (
    startIndex < original.length &&
    startIndex < modified.length &&
    original[startIndex] === modified[startIndex]
  ) {
    startIndex++;
  }

  // Find the indexes of the last modified characters
  let originalEndIndex = original.length - 1;
  let modifiedEndIndex = modified.length - 1;
  while (
    originalEndIndex >= startIndex &&
    modifiedEndIndex >= startIndex &&
    original[originalEndIndex] === modified[modifiedEndIndex]
  ) {
    originalEndIndex--;
    modifiedEndIndex--;
  }

  return {
    startIndex,
    originalDiffSequence: original.slice(startIndex, originalEndIndex + 1),
    modifiedDiffSequence: modified.slice(startIndex, modifiedEndIndex + 1),
  };
}
