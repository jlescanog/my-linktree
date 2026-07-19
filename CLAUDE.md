# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A personal "linktree" style profile page for Jhair Lescano. It is a **static site with no build step, no package manager, and no dependencies to install** — plain HTML, CSS, and vanilla JavaScript. All third-party libraries (Font Awesome, Bootstrap, Google Fonts, Animate.css, share.js, clipboard.js) load from CDNs at runtime.

## Running locally

There is nothing to build. Open a file directly or serve the folder over any static server, e.g.:

```bash
python -m http.server 8000    # then visit http://localhost:8000
```

Serving (rather than `file://`) matters because the pages fetch local assets (`assets/images/Perfil2.jpg`) and cross-link between each other.

## Architecture

Two page variants that link to each other and share only `js/data.js` (the single source of truth for `PROFILE`, `LINKS`, `SHARE_OPTIONS`):

- **`index.html` + `js/terminal.js` + `assets/css/terminal.css`** — the default entry point. An interactive fake terminal inside a window frame (`.terminal-window` with a macOS-style titlebar). `terminal.js` drives everything: an ASCII banner + typed-out boot sequence (`runBootSequence`), a command registry (the `commands` object; entries with `hidden: true` are excluded from `help` and Tab-completion), Tab autocompletion (`autocomplete()`), ArrowUp/ArrowDown history, and manual input handling via a hidden `<input>` (`#hidden-input`) that mirrors keystrokes into `#input-text`. A CRT scanline/glow effect (`body.crt` in CSS) is on by default and toggled by the `crt` command (persisted in `localStorage` key `crt`).
- **`classic.html` + `js/classic_script.js` + `assets/css/classic_styles.css`** — a conventional Bootstrap-based card layout with a light/dark toggle (persisted in `localStorage` under `theme`), a share modal, and clipboard-copy. Contact buttons, the social-link list (`#links-list`), and the share URL are rendered at `DOMContentLoaded` from `js/data.js`.

The `gui` terminal command and a fixed "Ver versión GUI" button (`.gui-switch`) redirect to `classic.html`; a fixed "Modo Terminal" button in `classic.html` links back to `index.html`.

### Terminal commands

Commands live in the `commands` object in `js/terminal.js`. To add one, add a key with `{ desc, action }` (plus optional `hidden: true` for easter eggs); `help` and Tab-completion auto-list every non-hidden entry, so no separate registration is needed. `action` receives the argument list (`args.slice(1)`) and renders via the `printLine`/`printHTML`/`typeHTML` helpers. The `ls`/`cat` commands work off the `FILES` map (fake filename → command name). `typeHTML` tokenizes the HTML once and appends text nodes incrementally — don't regress it to per-char `innerHTML` reassignment.

## Editing profile data

All profile data (name, role, phone, email, links, share templates) lives in `js/data.js` and feeds both variants. The only profile text still hardcoded in markup is the `<h1>` name and `<p class="lead">` bio in `classic.html`.

## Security note

User input in the terminal is escaped with `escapeHTML()` before being echoed back into the DOM — preserve that when touching input handling, since command echo uses `innerHTML`.
