# Hugo Code Block Panel Module

A simple code block panel for Hugo, [preview it online](https://projects.razonyang.com/hugo-mod-code-block-panel/).

## Features

- Expand toggle.
- Copy code.
- Line number toggle.
- Wrap toggle.

## Installation

### 1.Import the Module

```toml
[[module.imports]]
path = "github.com/hugomods/code-block-panel"
```

### 2. Tweak Configuration

The module requires the following configuration to be set as corresponding values.

```toml
[markup.highlight]
lineNos = true
lineNumbersInTable = false
```

### 3. Import CSS

You'll need import two SCSS files first.

```scss
// assets/main.scss
@import "snackbar/scss/index"; // used to show the result of copying code.
@import "code-block-panel/scss/index";
```

> The import paths is relative to the `assets` folder.

And then transform it to CSS in partial.

```go
{{ $css := resources.Get "main.scss" }}
{{ $css = $css | toCSS }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}" />
```

### 4. Import JS

Import JS by using Hugo Pipe.

```go
{{ $js := resources.Get "main.ts" | js.Build }}
{{ $codeJS := partialCached "code-block-panel/assets/js-resource" . }}
{{ $js = slice $js $searchJS | resources.Concat "js/main.js" }}
<script src="{{ $js.RelPermalink }}" defer></script>
```

Or import JS via partial.

```go
{{ partialCached "code-block-panel/assets/js" . }}
```

## Parameters

```toml
[params.code_block_panel]
max_lines = 10
# ...
```

| Name | Type | Default | Description
|---|---|---|---
| `line_nos` | Boolean | `true` | Show/Hide the line numbers by default.
| `max_lines` | Number | `10` | The max visible lines.
| `wrap` | Boolean | `false` | When `true`, wrap the code by default.
