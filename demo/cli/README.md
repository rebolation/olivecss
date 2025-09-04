# Olive CSS CLI Examples

This directory contains examples demonstrating how to use Olive CSS CLI tool with different frameworks and static site generators.

## Basic Example

The `basic/` directory shows a simple HTML example using Olive CSS CLI.

### Features:
- Simple HTML structure with Olive CSS comments
- Auto-detection of source directory (`src_olive`)
- Live reload web server
- Tailwind CSS integration

### Usage:
1. Navigate to the `basic/` directory
2. Run `olive` command
3. Open `http://localhost:3000` in your browser
4. Edit files in `src_olive/` directory and see changes in real-time

### Directory Structure:
```
basic/
└── src_olive/          # Source directory (watched by Olive CSS)
    ├── index.html      # Main HTML file with Olive CSS comments
    ├── index.css       # CSS file
    ├── main.js         # JavaScript file
    └── page/           # Additional pages
        └── about.html
```

## Jekyll Example

The `jekyll/` directory demonstrates how to integrate Olive CSS with Jekyll static site generator.

### Features:
- Jekyll site with Olive CSS integration
- Custom layouts and includes
- SASS, Tailwind support
- Blog post support

### Usage:
1. Navigate to the `jekyll/` directory
2. Run `olive jekyll` to watch Olive CSS files (ruby, bundle, jekyll, minima needed)
3. Open `http://localhost:3000` in your browser
4. Edit files in `olive__layouts/`, `olive__includes/`, `olive__posts/`, `olive__sass/` directories and see changes in real-time

### Directory Structure:
```
jekyll/
├── _config.yml         # Jekyll configuration
├── index.markdown      # Homepage
├── about.markdown      # About page
├── olive__layouts/     # Custom layouts from minima (watched by Olive CSS)
│   ├── default.html
│   ├── home.html
│   ├── page.html
│   └── post.html
├── olive__includes/    # Custom includes from minima (watched by Olive CSS)
│   ├── header.html
│   ├── footer.html
│   └── ...
├── olive__posts/       # Blog posts (watched by Olive CSS)
│   └── 2025-09-04-welcome-to-jekyll.markdown
├── olive__sass/        # SASS files from minima (watched by Olive CSS)
│   ├── minima.scss
│   └── minima/
└── _site/              # Generated Jekyll site
```

### How it works:
- Olive CSS watches files in `olive__*` directories
- Jekyll processes the Olive CSS output and generates the final site
- Both tools work together to provide live reload and static site generation
