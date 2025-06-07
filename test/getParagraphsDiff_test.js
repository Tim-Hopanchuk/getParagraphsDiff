const assert = require("assert");
const { getParagraphsDiff } = require("../dist/index");

describe("getParagraphsDiff", function () {
  it("identical texts", function () {
    const original = "012345p1\n012345p2\n012345p3\n012345p4";
    const modified = "012345p1\n012345p2\n012345p3\n012345p4";

    const paragraphsDiff = getParagraphsDiff(original, modified);

    assert.deepEqual(paragraphsDiff, []);
  });

  describe("edited paragraphs", function () {
    it("one paragraph modified - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012_45p1\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "012_45p1",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 3,
            originalDiffSequence: "3",
            modifiedDiffSequence: "_",
          },
        },
      ]);
    });

    it("multiple paragraphs modified - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012_45p2\n012ab5p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p2",
          modified: "012_45p2",

          originalIndex: 9,
          modifiedIndex: 9,

          diff: {
            startIndex: 3,
            originalDiffSequence: "3",
            modifiedDiffSequence: "_",
          },
        },
        {
          original: "012345p3",
          modified: "012ab5p3",

          originalIndex: 18,
          modifiedIndex: 18,

          diff: {
            startIndex: 3,
            originalDiffSequence: "34",
            modifiedDiffSequence: "ab",
          },
        },
      ]);
    });

    it("one paragraph modified - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n012345p3\n01234_p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p4",
          modified: "01234_p4",

          originalIndex: 27,
          modifiedIndex: 27,

          diff: {
            startIndex: 5,
            originalDiffSequence: "5",
            modifiedDiffSequence: "_",
          },
        },
      ]);
    });

    it("multiple paragraphs extended - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "01234567p1\n01234567p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "01234567p1",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 6,
            originalDiffSequence: "",
            modifiedDiffSequence: "67",
          },
        },
        {
          original: "012345p2",
          modified: "01234567p2",

          originalIndex: 9,
          modifiedIndex: 11,

          diff: {
            startIndex: 6,
            originalDiffSequence: "",
            modifiedDiffSequence: "67",
          },
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 22,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 31,

          diff: null,
        },
      ]);
    });

    it("one paragraph extended - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n01234567p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p3",
          modified: "01234567p3",

          originalIndex: 18,
          modifiedIndex: 18,

          diff: {
            startIndex: 6,
            originalDiffSequence: "",
            modifiedDiffSequence: "67",
          },
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 29,

          diff: null,
        },
      ]);
    });

    it("multiple paragraphs extended - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n01234567p3\n01234567p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p3",
          modified: "01234567p3",

          originalIndex: 18,
          modifiedIndex: 18,

          diff: {
            startIndex: 6,
            originalDiffSequence: "",
            modifiedDiffSequence: "67",
          },
        },
        {
          original: "012345p4",
          modified: "01234567p4",

          originalIndex: 27,
          modifiedIndex: 29,

          diff: {
            startIndex: 6,
            originalDiffSequence: "",
            modifiedDiffSequence: "67",
          },
        },
      ]);
    });

    it("one paragraph shortened - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "12345p1\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "12345p1",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "0",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p2",
          modified: "012345p2",

          originalIndex: 9,
          modifiedIndex: 8,

          diff: null,
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 17,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 26,

          diff: null,
        },
      ]);
    });

    it("multiple paragraphs shortened - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n12345p2\n01234p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p2",
          modified: "12345p2",

          originalIndex: 9,
          modifiedIndex: 9,

          diff: {
            startIndex: 0,
            originalDiffSequence: "0",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p3",
          modified: "01234p3",

          originalIndex: 18,
          modifiedIndex: 17,

          diff: {
            startIndex: 5,
            originalDiffSequence: "5",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 25,

          diff: null,
        },
      ]);
    });

    it("one paragraph shortened - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n012345p3\n01234p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p4",
          modified: "01234p4",

          originalIndex: 27,
          modifiedIndex: 27,

          diff: {
            startIndex: 5,
            originalDiffSequence: "5",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });
  });

  describe("added paragraphs", function () {
    it("one paragraph added - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "p0\n012345p1\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "p0",

          originalIndex: null,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "p0",
          },
        },
        {
          original: "012345p1",
          modified: "012345p1",

          originalIndex: 0,
          modifiedIndex: 3,

          diff: null,
        },
        {
          original: "012345p2",
          modified: "012345p2",

          originalIndex: 9,
          modifiedIndex: 12,

          diff: null,
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 21,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 30,

          diff: null,
        },
      ]);
    });

    it("multiple paragraphs added - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\np0\np0\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "p0",

          originalIndex: null,
          modifiedIndex: 18,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "p0",
          },
        },
        {
          original: "",
          modified: "p0",

          originalIndex: null,
          modifiedIndex: 21,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "p0",
          },
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 24,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 33,

          diff: null,
        },
      ]);
    });

    it("one paragraph added - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n012345p3\n012345p4\np0";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "p0",

          originalIndex: null,
          modifiedIndex: 36,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "p0",
          },
        },
      ]);
    });
  });

  describe("deleted paragraphs", function () {
    it("multiple paragraphs deleted - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "",

          originalIndex: 0,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p1",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p2",
          modified: "",

          originalIndex: 9,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p2",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 0,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 9,

          diff: null,
        },
      ]);
    });

    it("one paragraph deleted - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p3",
          modified: "",

          originalIndex: 18,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p3",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 18,

          diff: null,
        },
      ]);
    });

    it("multiple paragraphs deleted - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p3",
          modified: "",

          originalIndex: 18,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p3",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "",

          originalIndex: 27,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p4",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });
  });

  describe("full text replacement", function () {
    it("replaced with a one-paragraph text", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "abcdef";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "abcdef",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p1",
            modifiedDiffSequence: "abcdef",
          },
        },
        {
          original: "012345p2",
          modified: "",

          originalIndex: 9,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p2",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p3",
          modified: "",

          originalIndex: 18,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p3",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "",

          originalIndex: 27,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p4",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });

    it("replaced with a multi-paragraph text", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "abcp1\ndefp2";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "abcp1",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345",
            modifiedDiffSequence: "abc",
          },
        },
        {
          original: "012345p2",
          modified: "defp2",

          originalIndex: 9,
          modifiedIndex: 6,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345",
            modifiedDiffSequence: "def",
          },
        },
        {
          original: "012345p3",
          modified: "",

          originalIndex: 18,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p3",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "",

          originalIndex: 27,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p4",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });
  });

  describe("empty texts", function () {
    it("empty texts", function () {
      const original = "";
      const modified = "";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, []);
    });

    it("original text is empty", function () {
      const original = "";
      const modified = "012345p1\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p1",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p1",
          },
        },
        {
          original: "",
          modified: "012345p2",

          originalIndex: null,
          modifiedIndex: 9,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p2",
          },
        },
        {
          original: "",
          modified: "012345p3",

          originalIndex: null,
          modifiedIndex: 18,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p3",
          },
        },
        {
          original: "",
          modified: "012345p4",

          originalIndex: null,
          modifiedIndex: 27,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p4",
          },
        },
      ]);
    });

    it("modified text is empty", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p1",
          modified: "",

          originalIndex: 0,
          modifiedIndex: 0,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p1",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p2",
          modified: "",

          originalIndex: 9,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p2",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p3",
          modified: "",

          originalIndex: 18,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p3",
            modifiedDiffSequence: "",
          },
        },
        {
          original: "012345p4",
          modified: "",

          originalIndex: 27,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p4",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });
  });

  describe("repetitions", function () {
    it("one paragraph duplicated - beginning", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p1\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p1",

          originalIndex: null,
          modifiedIndex: 9,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p1",
          },
        },
        {
          original: "012345p2",
          modified: "012345p2",

          originalIndex: 9,
          modifiedIndex: 18,

          diff: null,
        },
        {
          original: "012345p3",
          modified: "012345p3",

          originalIndex: 18,
          modifiedIndex: 27,

          diff: null,
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 36,

          diff: null,
        },
      ]);
    });

    it("multiple paragraphs duplicated - middle", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified =
        "012345p1\n012345p2\n012345p3\n012345p2\n012345p3\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p2",

          originalIndex: null,
          modifiedIndex: 27,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p2",
          },
        },
        {
          original: "",
          modified: "012345p3",

          originalIndex: null,
          modifiedIndex: 36,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p3",
          },
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 45,

          diff: null,
        },
      ]);
    });

    it("one paragraph duplicated - end", function () {
      const original = "012345p1\n012345p2\n012345p3\n012345p4";
      const modified = "012345p1\n012345p2\n012345p3\n012345p4\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p4",

          originalIndex: null,
          modifiedIndex: 36,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p4",
          },
        },
      ]);
    });

    it("full copy added - end", function () {
      const original = "012345p1\n012345p2";
      const modified = "012345p1\n012345p2\n012345p1\n012345p2";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p1",

          originalIndex: null,
          modifiedIndex: 18,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p1",
          },
        },
        {
          original: "",
          modified: "012345p2",

          originalIndex: null,
          modifiedIndex: 27,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p2",
          },
        },
      ]);
    });

    it("increased number of identical paragraphs - middle", function () {
      const original = "012345p1\n012345p2\n012345p2\n012345p4";
      const modified = "012345p1\n012345p2\n012345p2\n012345p2\n012345p4";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "",
          modified: "012345p2",

          originalIndex: null,
          modifiedIndex: 27,

          diff: {
            startIndex: 0,
            originalDiffSequence: "",
            modifiedDiffSequence: "012345p2",
          },
        },
        {
          original: "012345p4",
          modified: "012345p4",

          originalIndex: 27,
          modifiedIndex: 36,

          diff: null,
        },
      ]);
    });

    it("reduced number of duplicated paragraphs - end", function () {
      const original = "012345p1\n012345p2\n012345p2\n012345p2";
      const modified = "012345p1\n012345p2\n012345p2";

      const paragraphsDiff = getParagraphsDiff(original, modified);

      assert.deepEqual(paragraphsDiff, [
        {
          original: "012345p2",
          modified: "",

          originalIndex: 27,
          modifiedIndex: null,

          diff: {
            startIndex: 0,
            originalDiffSequence: "012345p2",
            modifiedDiffSequence: "",
          },
        },
      ]);
    });
  });
});
