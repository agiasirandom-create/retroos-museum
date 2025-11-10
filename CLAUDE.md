# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RetroOS Museum is an authentic retro operating system landing page collection built with Eleventy (11ty), featuring pixel-perfect recreations of classic OS interfaces from the 1990s. The project aims to create interactive, nostalgic experiences of historical operating systems including Windows 95/98/XP, Mac OS Classic, and other vintage interfaces.

## Project Status

This is a new project in early development. Currently only contains documentation (ROSM.md) outlining the history of operating systems from 1980s to present.

## Technology Stack (Planned)

- **Static Site Generator**: Eleventy (11ty)
- **Frontend**: HTML, CSS, JavaScript (vanilla or framework TBD)
- **Styling Approach**: Pixel-perfect CSS recreations of classic OS interfaces
- **Assets**: Retro UI elements, fonts, icons matching original OS designs

## Development Commands (To Be Established)

When the project structure is set up with Eleventy, typical commands will include:

- `npm install` or `yarn install` - Install dependencies
- `npm start` or `npx @11ty/eleventy --serve` - Start development server with hot reload
- `npm run build` or `npx @11ty/eleventy` - Build static site for production
- `npm test` - Run tests (if test framework is added)

## Architecture Guidelines

### Directory Structure (Expected)

When implementing, organize by OS theme:
- Each OS recreation should be self-contained with its own HTML template, CSS, and assets
- Shared components (window frames, buttons, scroll bars) should be reusable across OS themes
- Use Eleventy's data files to manage OS metadata (release dates, version numbers, features)
- Consider using Eleventy layouts for consistent page structure while varying themes

### Retro UI Fidelity

- Prioritize authentic visual reproduction over modern web conventions
- Use exact fonts (or close web-safe alternatives): MS Sans Serif, Chicago, Geneva
- Recreate pixel-perfect UI elements: window chrome, buttons, borders, shadows
- Implement classic interaction patterns (e.g., Windows 95 start menu behavior)
- Consider using CSS filters or image techniques for authentic color palettes (256-color era)

### Performance Considerations

- Despite retro aesthetics, maintain modern performance standards
- Optimize image assets (sprites for UI elements)
- Use CSS for UI elements where possible instead of images
- Consider lazy-loading for multiple OS recreations on same page

### Historical Accuracy

- Reference ROSM.md for accurate OS timeline and feature sets
- Each recreation should reflect the OS version's actual capabilities and limitations
- Include period-appropriate content and terminology in demo applications

## Key Implementation Decisions

### Eleventy Configuration

When setting up `.eleventy.js`:
- Configure template engines (Nunjucks, Liquid, or other)
- Set up passthrough copy for assets (fonts, images, CSS)
- Consider using Eleventy's data cascade for OS-specific configurations
- Use collections to organize different OS recreations

### Responsive Design vs. Fixed Resolution

Decision needed: Should retro OS interfaces be responsive or maintain fixed resolutions (e.g., 640x480, 800x600) authentic to the era? Consider viewport scaling or container-based approach.

### Interactivity Level

Clarify scope of interactivity:
- Static screenshots with overlays?
- Functional UI elements (clickable start menus, draggable windows)?
- Working demo applications within each OS?
- Full emulation-style experience?

## References

- ROSM.md contains comprehensive OS history from 1980s-2020s
- Major OS families to potentially recreate: Windows (3.1, 95, 98, XP), Mac OS (System 7, 8, 9), Linux/Unix environments (early KDE, GNOME), BeOS, AmigaOS
