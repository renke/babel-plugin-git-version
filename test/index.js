/*global describe, it*/

import {transform} from "babel-core";
import {expect} from "chai";

import {makePlugin} from "../src";

describe("babel-plugin-git-version", () => {
  it("should replace commit and tag constants with commit and tag", () => {
    const commit = "381fff495d46272ec774708ce19903b2160a7d43";
    const tag = "v0.0.1";

    const plugin = makePlugin({
      getCommit() {
        return commit;
      },

      getTag() {
        return tag;
      },
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG)", {
      plugins: [[plugin, {}]],
    }).code;

    expect(code).to.equal(`console.log("${commit}", "${tag}");`);
  });

  it("should replace commit and tag constants with shortened commit and tag", () => {
    const commit = "381fff495d46272ec774708ce19903b2160a7d43";
    const tag = "v0.0.1";

    const plugin = makePlugin({
      getCommit() {
        return commit;
      },

      getTag() {
        return tag;
      },
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG)", {
      plugins: [[plugin, {
        commitLength: 5,
      }]],
    }).code;

    expect(code).to.equal(`console.log("381ff", "${tag}");`);
  });

  it("should replace commit and tag constants with default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG)", {
      plugins: [[plugin, {}]],
    }).code;

    expect(code).to.equal(`console.log("unknown", "unknown");`);
  });

  it("should replace commit and tag constants with custom default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },
    });

    const code = transform("console.log(GIT_COMMIT, GIT_TAG)", {
      plugins: [[plugin, {
        commitDefaultValue: "unknown_commit",
        tagDefaultValue: "unknown_tag",
      }]],
    }).code;

    expect(code).to.equal(`console.log("unknown_commit", "unknown_tag");`);
  });

  it("should replace custom commit and tag constants with custom default values", () => {
    const plugin = makePlugin({
      getCommit() {
        return null;
      },

      getTag() {
        return null;
      },
    });

    const code = transform("console.log(COMMIT, TAG)", {
      plugins: [[plugin, {
        commitDefaultValue: "unknown_commit",
        tagDefaultValue: "unknown_tag",

        commitConstantName: "COMMIT",
        tagConstantName: "TAG",
      }]],
    }).code;

    expect(code).to.equal(`console.log("unknown_commit", "unknown_tag");`);
  });
});
