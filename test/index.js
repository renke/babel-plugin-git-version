/*global describe, it*/
import {expect} from "chai";

import babelPluginGitVersion from "../src";

describe("babelPluginGitVersion", () => {
  it("should return foo", () => {
    expect(babelPluginGitVersion()).to.equal("foo");
  });
});
