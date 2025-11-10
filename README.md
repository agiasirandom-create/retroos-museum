# RetroOS Museum

A modular OS builder system showcasing historical operating systems, built with Eleventy (11ty).

## Project Structure

```
/home/ai/dev/active/ RetroOS Museum /
├── .eleventy.js              # Eleventy configuration
├── package.json              # Node dependencies and scripts
├── .gitignore               # Git ignore rules
├── src/                     # Source files
│   ├── _includes/           # Reusable templates and components
│   │   ├── layouts/         # Page layouts
│   │   │   └── base.njk     # Base HTML5 layout
│   │   ├── components/      # Reusable UI components
│   │   └── modules/         # OS modules
│   ├── os/                  # Operating system pages
│   │   └── example-os.md    # Example OS page
│   ├── _data/               # Global data files
│   │   ├── site.js          # Site metadata
│   │   └── os/              # OS-specific data
│   ├── assets/              # Static assets
│   │   ├── css/
│   │   │   └── main.css     # Main stylesheet
│   │   ├── js/
│   │   │   └── main.js      # Main JavaScript
│   │   ├── fonts/           # Web fonts
│   │   └── images/          # Image files
│   └── index.njk            # Homepage
└── _site/                   # Generated site (ignored by git)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server with live reload:

```bash
npm start
```

The site will be available at `http://localhost:8080`

### Build

Build the site for production:

```bash
npm run build
```

The generated site will be in the `_site/` directory.

### Debug

Run Eleventy with debug logging:

```bash
npm run debug
```

## Features

- **Modular Architecture**: Component-based system for building OS interfaces
- **Historical OS Showcase**: Explore operating systems from different eras
- **Static Site Generation**: Fast, secure, and easy to deploy with Eleventy
- **Responsive Design**: Mobile-first approach with modern CSS
- **Accessibility**: WCAG-compliant with semantic HTML and ARIA labels

## Collections

- **operatingSystems**: All OS pages from `/src/os/` directory

## Next Steps

1. Create OS module components in `/src/_includes/modules/`
2. Add historical OS data in `/src/_data/os/`
3. Build reusable UI components in `/src/_includes/components/`
4. Implement module loader system
5. Add interactive demonstrations
6. Create OS-specific pages with historical information

## Technology Stack

- **Static Site Generator**: Eleventy 3.1.2
- **Templating**: Nunjucks
- **Styling**: Custom CSS (CSS variables for theming)
- **JavaScript**: Vanilla ES6+

## License

ISC
