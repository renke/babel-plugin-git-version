import {execSync} from "child_process";

const DEFAULT_OPTIONS = {
  commitDefaultValue: "unknown",
  tagDefaultValue: "unknown",

  commitConstantName: "GIT_COMMIT",
  tagConstantName: "GIT_TAG",

  showDirty: false,

  commitLength: 40,
  tagCommitLength: 0,
};

export default makePlugin({getCommit, getTag});

export function makePlugin({getCommit, getTag}) {
  let commit;
  let tag;
  let pluginOptions;

  return ({types: t}) => {
    return {
      visitor: {
        Program(path, {opts: options}) {
          pluginOptions = {...DEFAULT_OPTIONS, ...options};

          commit = getCommit(pluginOptions)
          if (!commit) {
            commit = pluginOptions.commitDefaultValue;
          } else {
            commit = commit.substring(0, pluginOptions.commitLength);
          }

          tag = getTag(pluginOptions)
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

function getCommit(opts) {
  try {
    return execSync("git rev-parse HEAD", {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}

function getTag(opts) {
  try {
    let cmd = ["git describe", `--abbrev=${opts.tagCommitLength}`, opts.showDirty ? "--dirty" : ""];
    return execSync(cmd.join(" "), {stdio: ["ignore", "pipe", "ignore"]}).toString().trim();
  } catch (e) {
    return null;
  }
}
