const assert = require("assert");
const { getTextsDiff } = require("../dist/index");

describe("getTextsDiff", function () {
  it("identical paragraphs", function () {
    const original = "0123456789";
    const modified = "0123456789";

    const textsDiff = getTextsDiff(original, modified);

    assert.deepEqual(textsDiff, null);
  });

  describe("replaced chars", function () {
    it("one char replaced - beginning", function () {
      const original = "0123456789";
      const modified = "a123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0",
        modifiedDiffSequence: "a",
      });
    });

    it("multiple chars replaced - middle", function () {
      const original = "0123456789";
      const modified = "0123abc789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 4,
        originalDiffSequence: "456",
        modifiedDiffSequence: "abc",
      });
    });

    it("one char replaced - end", function () {
      const original = "0123456789";
      const modified = "012345678d";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 9,
        originalDiffSequence: "9",
        modifiedDiffSequence: "d",
      });
    });
  });

  describe("added chars", function () {
    it("multiple chars added - beginning", function () {
      const original = "0123456789";
      const modified = "abc0123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "",
        modifiedDiffSequence: "abc",
      });
    });

    it("one char added - middle", function () {
      const original = "0123456789";
      const modified = "01234_56789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 5,
        originalDiffSequence: "",
        modifiedDiffSequence: "_",
      });
    });

    it("multiple chars added - end", function () {
      const original = "0123456789";
      const modified = "0123456789def";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 10,
        originalDiffSequence: "",
        modifiedDiffSequence: "def",
      });
    });
  });

  describe("deleted chars", function () {
    it("one char deleted - beginning", function () {
      const original = "0123456789";
      const modified = "123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0",
        modifiedDiffSequence: "",
      });
    });

    it("multiple chars deleted - middle", function () {
      const original = "0123456789";
      const modified = "01234789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 5,
        originalDiffSequence: "56",
        modifiedDiffSequence: "",
      });
    });

    it("one char deleted - end", function () {
      const original = "0123456789";
      const modified = "012345678";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 9,
        originalDiffSequence: "9",
        modifiedDiffSequence: "",
      });
    });
  });

  describe("full paragraph replacement", function () {
    it("replaced with a one-char paragraph", function () {
      const original = "0123456789";
      const modified = "a";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0123456789",
        modifiedDiffSequence: "a",
      });
    });

    it("replaced with a same-length paragraph", function () {
      const original = "0123456789";
      const modified = "abcdefghij";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0123456789",
        modifiedDiffSequence: "abcdefghij",
      });
    });

    it("replaced with a shorter paragraph", function () {
      const original = "0123456789";
      const modified = "klmn";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0123456789",
        modifiedDiffSequence: "klmn",
      });
    });

    it("replaced with a longer paragraph", function () {
      const original = "0123456789";
      const modified = "klmnoprstuvwxyz";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0123456789",
        modifiedDiffSequence: "klmnoprstuvwxyz",
      });
    });
  });

  describe("empty paragraphs", function () {
    it("both paragraphs are empty", function () {
      const original = "";
      const modified = "";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, null);
    });

    it("original paragraph is empty", function () {
      const original = "";
      const modified = "0123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "",
        modifiedDiffSequence: "0123456789",
      });
    });

    it("modified paragraph is empty", function () {
      const original = "0123456789";
      const modified = "";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 0,
        originalDiffSequence: "0123456789",
        modifiedDiffSequence: "",
      });
    });
  });

  describe("repetitions", function () {
    it("full copy added - end", function () {
      const original = "0123456789";
      const modified = "01234567890123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 10,
        originalDiffSequence: "",
        modifiedDiffSequence: "0123456789",
      });
    });

    it("full copy added - middle", function () {
      const original = "0123456789";
      const modified = "01234012345678956789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 5,
        originalDiffSequence: "",
        modifiedDiffSequence: "0123456789",
      });
    });

    it("one char duplicated - beginning", function () {
      const original = "0123456789";
      const modified = "00123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 1,
        originalDiffSequence: "",
        modifiedDiffSequence: "0",
      });
    });

    it("multiple chars duplicated - middle", function () {
      const original = "0123456789";
      const modified = "0123444456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 5,
        originalDiffSequence: "",
        modifiedDiffSequence: "444",
      });
    });

    it("one char duplicated - end", function () {
      const original = "0123456789";
      const modified = "01234567899";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 10,
        originalDiffSequence: "",
        modifiedDiffSequence: "9",
      });
    });

    it("increase repeated chars - beginning", function () {
      const original = "00123456789";
      const modified = "0000123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 2,
        originalDiffSequence: "",
        modifiedDiffSequence: "00",
      });
    });

    it("increase repeated chars - middle", function () {
      const original = "01234456789";
      const modified = "0123444456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 6,
        originalDiffSequence: "",
        modifiedDiffSequence: "44",
      });
    });

    it("increase repeated chars - end", function () {
      const original = "01234567899";
      const modified = "0123456789999";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 11,
        originalDiffSequence: "",
        modifiedDiffSequence: "99",
      });
    });

    it("decreased repeated chars - beginning", function () {
      const original = "0000123456789";
      const modified = "00123456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 2,
        originalDiffSequence: "00",
        modifiedDiffSequence: "",
      });
    });

    it("decreased repeated chars - middle", function () {
      const original = "0123444456789";
      const modified = "01234456789";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 6,
        originalDiffSequence: "44",
        modifiedDiffSequence: "",
      });
    });

    it("decreased repeated chars - end", function () {
      const original = "0123456789999";
      const modified = "01234567899";

      const textsDiff = getTextsDiff(original, modified);

      assert.deepEqual(textsDiff, {
        startIndex: 11,
        originalDiffSequence: "99",
        modifiedDiffSequence: "",
      });
    });
  });
});
