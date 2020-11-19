import {
  cleanup,
  createRepositoryWithDiff,
  createRepositoryWithoutDiff,
  getDirectory,
} from "../../test-utils";
import { diff } from "./git";

describe("api", () => {
  describe("git", () => {
    describe("diff", () => {
      afterEach(() => cleanup());

      test("returns a map when no files have been modified", async () => {
        await createRepositoryWithoutDiff();
        const statuses = await diff({
          cwd: getDirectory(),
        });
        expect(statuses).toEqual({});
      });

      test("returns a map when files have been modified", async () => {
        await createRepositoryWithDiff();
        const statuses = await diff({
          cwd: getDirectory(),
          ref: "HEAD~1",
        });
        expect(statuses).toEqual({
          "README.md": "A",
          "src/index.js": "M",
          "src/index.test.js": "D",
          "package.json": "M",
        });
      });

      test("returns a map when files have been modified and filtered by path", async () => {
        await createRepositoryWithDiff();
        const statuses = await diff({
          cwd: getDirectory(),
          ref: "HEAD~1",
          paths: ["*.test.js"],
        });
        expect(statuses).toEqual({
          "src/index.test.js": "D",
        });
      });

      test("returns a map when files have been modified and filtered by status", async () => {
        await createRepositoryWithDiff();
        const statuses = await diff({
          cwd: getDirectory(),
          ref: "HEAD~1",
          statuses: ["d"],
        });
        expect(statuses).toEqual({
          "README.md": "A",
          "src/index.js": "M",
          "package.json": "M",
        });
      });

      test("works when statuses is an empty array", async () => {
        await createRepositoryWithDiff();
        const statuses = await diff({
          cwd: getDirectory(),
          ref: "HEAD~1",
          paths: []
        });
        expect(statuses).toEqual({
          "README.md": "A",
          "src/index.js": "M",
          "src/index.test.js": "D",
          "package.json": "M",
        });
      });

      test("works when statuses is an empty array", async () => {
        await createRepositoryWithDiff();
        const statuses = await diff({
          cwd: getDirectory(),
          ref: "HEAD~1",
          statuses: []
        });
        expect(statuses).toEqual({
          "README.md": "A",
          "src/index.js": "M",
          "src/index.test.js": "D",
          "package.json": "M",
        });
      });

    });
  });
});
