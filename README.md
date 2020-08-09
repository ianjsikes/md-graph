# `md-graph`

Adds command `Show Graph` that displays a graph of local links between Markdown files in the current working directory.

Gives better insights into structure of your files if you are writing a wiki, a [Foam](https://foambubble.github.io/foam/) notebook or documentation.

![Demo GIF](demo.gif)

## Workflow

Recommended workflow is either keeping the graph open and using it as an alternative to the explorer sidebar or checking the it from time to time.

The graph refreshes automatically every time you:

- Update a Markdown title of the file.
- Change links to other files.
- Create a new file and add give it a title.
- Remove a file.

When active file in the editor changes and it matches one of the files in the graph – it will be highlighted.

## Concepts

- Title is always the first Markdown heading of depth 1, i.e. `# Title`.
- Files which do not have a title do not appear in the graph.
- Files can link to other files using [local Markdown links](docs/local-links.md) or [Wiki Links](docs/wiki-links.md).
- The graph is not directed. It doesn't show which file has the link and which one is linked.
- Directory structure is not relevant for the graph. All that matters is the mutual links between files.

## Example

```md
# Title

Link can be present in [text](first.md) or on a special list.

## Linked

- [Second](./2.md)
- [[third]] - Links to `third.md`

Named reference can also be used, like this: [reference].

[reference]: ref.md
```

## Settings

This extension contributes the following settings:

### `md-graph.showColumn`

Controls in which column should the graph appear. Refer to [Column values](####column-values). Defaults to `beside`.

### `md-graph.openColumn`

Controls in which column should clicked files open. Refer to [Column values](####column-values). Defaults to `one`.

#### Column values

- `active` – in the currently focused column.
- `beside` – other than the current.
- `one` (**default**), `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine` – respective editor columns.

### `md-graph.autoStart`

If true, opens the graph when you open VS Code. Defaults to `false`.

### `md-graph.fileTypes`

An array of file extensions that will be parsed to generate the graph. Defaults to `["md"]`.

### `md-graph.graph.defaultMode`

Controls the default graph viewing mode.

- `"ALL"` shows the full graph of every file in the workspace.
- `"FOCUS"` only shows the currently open file and its neighbors.

Defaults to `"ALL"`

### `md-graph.graph.focusNeighborDepth`

Controls how many levels of neighbors should be shown in focus mode. Defaults to `1`

### `md-graph.graph.fadeDepth`

Controls how far away a file should be from the current file before its node is faded. Set to `0` to not fade any nodes. Defaults to `1`

## Roadmap

Refer to the GitHub project board. (TODO: Add a link)

## Changelog

Refer to the [CHANGELOG.md](CHANGELOG.md) file.

## Contributing

You are very welcome to open an issue or a pull request with changes.

If it is your first time with vscode extension, make sure to checkout [Official Guides](https://code.visualstudio.com/api/get-started/your-first-extension).
