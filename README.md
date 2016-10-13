# babel-plugin-git-version

Expose the current commit's hash and the name of "nearest" tag as constants
in your code. Useful to quickly find out what version of your application is
deployed.

## Installation

```sh
npm install --save-dev babel-plugin-git-version
```

Also make sure that `git` is in your `$PATH`.

## Usage

Add it to your `.babelrc` configuration

```json
{
  "plugins": [
    "git-version"
  ]
}
```

After that the constants `GIT_COMMIT` and `GIT_TAG` can be used in your code.
They will be replaced by the commit hash of HEAD and the name of the "nearest"
tag (or "unknown" if those values can't be parsed).

```js
console.log(`Version: ${GIT_TAG} (${GIT_COMMIT})`);
```

To avoid [eslint](https://github.com/eslint/eslint) warnings just add this to
your config

```json
"globals": {
  "GIT_COMMIT": false,
  "GIT_TAG": false,
},
```

You may customize the plugin to your liking

```json
"plugins": [
  [
    "git-version",
    {
      "commitDefaultValue": "unknown_commit",
      "tagDefaultValue": "unknown_tag",

      "commitConstantName": "COMMIT",
      "tagConstantName": "TAG",

      "showDirty": true,
      "commitLength": 7,
      "tagCommitLength": 7
    }
  ]
]
```

The defaults are

```js
const DEFAULT_OPTIONS = {
  commitDefaultValue: "unknown",
  tagDefaultValue: "unknown",

  commitConstantName: "GIT_COMMIT",
  tagConstantName: "GIT_TAG",

  showDirty: false,
  
  commitLength: 40,
  tagCommitLength: 0,
};
```

## License

See [LICENSE](LICENSE)
