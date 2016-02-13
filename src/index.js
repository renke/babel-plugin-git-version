import {execSync} from "child_process";

const DEFAULT_OPTIONS = {
  commitDefaultValue: "unknown",
  tagDefaultValue: "unknown",

  commitConstantName: "GIT_COMMIT",
  tagConstantName: "GIT_TAG",

  commitLength: 40,
};

export default makePlugin({getCommit, getTag});

export function makePlugin({getCommit, getTag}) {
  let commit = getCommit();
  let tag = getTag();

  let pluginOptions;

  return ({types: t}) => {
    return {
      visitor: {
        Program(path, {opts: options}) {
          pluginOptions = {...DEFAULT_OPTIONS, ...options};

          if (!commit) {
            commit = pluginOptions.commitDefaultValue;
          } else {
            commit = commit.substring(0, pluginOptions.commitLength);
          }

          if (!tag) {
            tag = pluginOptions.tagDefaultValue;
          }
        },

        ReferencedIdentifier(path) {
          if (path.node.name === pluginOptions.commitConstantName) {
            path.replaceWith(t.stringLiteral(commit));
            return;
          }

          if (path.node.name === pluginOptions.tagConstantName) {
            path.replaceWith(t.stringLiteral(tag));
            return;
          }
        },
      },
    };
  };
}

function getCommit() {
  try {
    return execSync("git rev-parse HEAD", {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}

function getTag() {
  try {
    return execSync("git describe --abbrev=0", {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}
