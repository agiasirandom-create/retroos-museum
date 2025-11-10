# Modules Directory

This directory contains OS-specific modules that can be mixed and matched to build different operating system interfaces.

## Module Categories

### Core Modules
- **bootloader**: System boot sequence
- **kernel**: Core OS functionality
- **shell**: Command-line interface

### UI Modules
- **window-manager**: Window management system
- **desktop-environment**: Complete desktop UI
- **file-manager**: File browsing interface

### Application Modules
- **text-editor**: Basic text editing
- **calculator**: Calculator application
- **terminal**: Terminal emulator

### System Modules
- **control-panel**: System settings
- **task-manager**: Process viewer
- **system-info**: System information display

## Module Structure

Each module should be a `.njk` file with:
- Configurable parameters
- Self-contained styling
- Documented API

## Usage Example

```njk
{% include "modules/window-manager.njk" %}
```

Modules can be combined to create complete OS experiences.
