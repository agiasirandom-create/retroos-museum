# Components Directory

This directory contains reusable UI components for the RetroOS Museum.

## Component Structure

Components should be created as `.njk` files and can be included in pages using:

```njk
{% include "components/component-name.njk" %}
```

## Planned Components

- **window.njk**: Retro-style window component
- **menu.njk**: OS menu component
- **toolbar.njk**: Application toolbar
- **icon.njk**: Desktop/file icons
- **dialog.njk**: Modal dialog boxes
- **taskbar.njk**: Bottom taskbar component
- **desktop.njk**: Desktop environment wrapper

## Usage Example

```njk
{% include "components/window.njk" %}
```

Components can accept parameters through Nunjucks macros for reusability.
