import { diff } from ".";
import { cleanup, createRepositoryWithDiff, getDirectory } from "../test-utils";

describe("api", () => {
  describe("diff", () => {
    afterEach(async () => await cleanup());

    test("returns the default ref when since was not provided", async () => {
      await createRepositoryWithDiff();
      const { ref } = await diff({ cwd: getDirectory() });
      expect(ref).toEqual("foobar");
    });

    test("returns the ref when since was provided", async () => {
      await createRepositoryWithDiff();
      const { ref } = await diff({ cwd: getDirectory(), since: "foobar" });
      expect(ref).toEqual("foobar");
    });

    test("returns a map when files have changed", async () => {
      await createRepositoryWithDiff();
      const { files } = await diff({ cwd: getDirectory() });
      expect(files).toEqual({
        "README.md": "A",
        "package.json": "M",
        "src/index.js": "M",
        "src/index.test.js": "D",
      });
    });

    test("returns a map of files when files have changed and a status filter is provided", async () => {
      await createRepositoryWithDiff();
      const { files } = await diff({
        cwd: getDirectory(),
        statuses: ["A", "m"],
      });
      expect(files).toEqual({
        "README.md": "A",
        "src/index.test.js": "D",
      });
    });

    test("returns a map of files when files have changed and a path filter is provided", async () => {
      await createRepositoryWithDiff();
      const { files } = await diff({
        cwd: getDirectory(),
        paths: ["*.js"],
      });
      expect(files).toEqual({
        "src/index.js": "M",
        "src/index.test.js": "D",
      });
    });
  });
});
