"use strict";

interface TextsDiff {
  startIndex: number | null;
  originalDiffSequence: string;
  modifiedDiffSequence: string;
}

/**
 * Compares two texts and detects difference at the character level.
 * 
 * @param {string} original - The first text
 * @param {string} modified - The second text
 * @returns {TextsDiff | null} - An object containing the index of the first differing character and the differing substrings from both texts, or null if texts are identical.
 */

export function getTextsDiff(
  original: string, // Original text
  modified: string // Modified text
): TextsDiff | null {
  if (original === modified) {
    return null;
  }

  // Find the index of the first modified char
  let startIndex = 0;
  while (
    startIndex < original.length &&
    startIndex < modified.length &&
    original[startIndex] === modified[startIndex]
  ) {
    startIndex++;
  }

  // Find the indexes of the last modified chars
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

interface ParagraphsDiff {
  original: string;
  modified: string;

  originalIndex: number | null;
  modifiedIndex: number | null;

  diff: TextsDiff | null;
}

/**
 * Compares two texts and detects difference at the paragraph level.
 * 
 * @param {string} original - The first text
 * @param {string} modified - The second text
 * @returns {ParagraphsDiff[]} - An array of objects containing the differing paragraphs, their offsets and paragraphs difference at the character level, or [] if no differences are found.
 */

export function getParagraphsDiff(
  original: string, // Original paragraphs
  modified: string // Modified paragraphs
): ParagraphsDiff[] {
  if (original === modified) {
    return [];
  }

  let result: ParagraphsDiff[] = [];

  const originalParagraphs = original.split("\n");
  const modifiedParagraphs = modified.split("\n");

  // Find the index of the first modified paragraph
  let startIndex = 0;
  while (
    startIndex < originalParagraphs.length &&
    startIndex < modifiedParagraphs.length &&
    originalParagraphs[startIndex] === modifiedParagraphs[startIndex]
  ) {
    startIndex++;
  }

  // Find the indexes of the last modified paragraphs
  let originalEndIndex = originalParagraphs.length - 1;
  let modifiedEndIndex = modifiedParagraphs.length - 1;
  while (
    originalEndIndex >= startIndex &&
    modifiedEndIndex >= startIndex &&
    originalParagraphs[originalEndIndex] ===
      modifiedParagraphs[modifiedEndIndex]
  ) {
    originalEndIndex--;
    modifiedEndIndex--;
  }

  // Search for differences within the sequence of modified paragraphs
  const maxEndIndex = Math.max(originalEndIndex, modifiedEndIndex);

  for (let i = startIndex; i <= maxEndIndex; i++) {
    const original = i <= originalEndIndex ? originalParagraphs[i] : "";
    const modified = i <= modifiedEndIndex ? modifiedParagraphs[i] : "";

    const originalIndex =
      i <= originalEndIndex ? getParagraphOffset(originalParagraphs, i) : null;
    const modifiedIndex =
      i <= modifiedEndIndex ? getParagraphOffset(modifiedParagraphs, i) : null;

    const diff = getTextsDiff(original, modified);

    result.push({
      original,
      modified,

      originalIndex,
      modifiedIndex,

      diff,
    });
  }

  // Search for offset differences within the sequence of unmodified paragraphs
  originalEndIndex++;
  modifiedEndIndex++;

  while (
    originalEndIndex < originalParagraphs.length &&
    modifiedEndIndex < modifiedParagraphs.length
  ) {
    const original = originalParagraphs[originalEndIndex];
    const modified = modifiedParagraphs[modifiedEndIndex];

    const originalIndex = getParagraphOffset(
      originalParagraphs,
      originalEndIndex
    );
    const modifiedIndex = getParagraphOffset(
      modifiedParagraphs,
      modifiedEndIndex
    );

    const diff = null; // Paragraphs are not modified — this was checked earlier

    if (originalIndex === modifiedIndex) {
      break;
    }

    result.push({
      original,
      modified,

      originalIndex,
      modifiedIndex,

      diff,
    });

    originalEndIndex++;
    modifiedEndIndex++;
  }

  return result;
}

/**
 * Finds the paragraph offset within the full text.
 * Assumes paragraphs are joined by a single newline character.
 * 
 * @param {string[]} paragraphs - An array of paragraphs
 * @param {number} end - The index of the paragraph to calculate offset for.
 * @returns {number} - The offset.
 */

function getParagraphOffset(paragraphs: string[], end: number): number {
  let result = 0;

  for (let i = 0; i < end; i++) {
    result += paragraphs[i].length + 1;
  }

  return result;
}
