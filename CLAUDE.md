# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Nodebox Framework, a Node.js/Express-based framework inspired by Coldbox. It provides a structured approach to building web applications with a clear separation of concerns.

## Key Architecture Components

### Core Framework Files
- `index.js`: Main export file that provides `Nodebox` and `NodeboxHandler` classes
- `cli.js`: Command-line interface with `init` command for project setup
- `src/middleware/index.js`: Request middleware that handles routing and dynamic handler loading
- `src/render/index.js`: Template rendering engine using Lodash templates

### Project Structure
```
nodebox/
├── package.json          # Main package configuration
├── index.js              # Main export file
├── cli.js                # Command-line interface
├── src/
│   ├── middleware/
│   │   └── index.js      # Request middleware
│   └── render/
│       └── index.js      # Template rendering engine
└── testsite/             # Example project demonstrating usage
    ├── index.js          # Main application
    ├── handlers/
    │   └── main.js       # Example handler
    ├── views/
    │   └── home.html     # Example view template
    ├── layouts/
    │   └── layout.main.html # Example layout template
    └── public/
        └── css/
            └── main.css  # Static CSS file
```

## How It Works

### Path-based Routing
The framework uses a path-based routing system where:
- URLs are split by `/`
- The last segment is treated as the function to call
- The rest of the path determines the handler file location
- Default handler is `main.home` for root paths
- Handlers are dynamically loaded based on URL path structure

### Handler Pattern
- Handlers are organized by path segments
- Each handler class extends `NodeboxHandler`
- Handlers have `preEvent()`, `postEvent()`, and action methods (like `home()`, `json()`)
- The framework dynamically loads handlers based on the URL path

### Template System
- Uses Lodash templates for view and layout rendering
- Supports layouts and views with variable passing
- Handles both HTML and JSON rendering
- Manages template variables and layout selection

## Development Commands

### Setup
```bash
# Initialize a new Nodebox project
nodebox init

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running Tests
```bash
# Run all tests with coverage
npm test

# Run tests with text coverage report
npm run test:coverage
```

### Building
```bash
# No explicit build step required - framework is runtime-only
```

## Key Features

1. **Path-based Routing**: URLs are automatically mapped to handler files based on their path structure
2. **Template System**: Uses Lodash templates for view and layout rendering
3. **Handler Lifecycle**: Supports preEvent and postEvent hooks for middleware-like functionality
4. **Static Asset Serving**: Automatically serves static files from the `public` directory
5. **CLI Tooling**: Provides easy project initialization with `nodebox init` command