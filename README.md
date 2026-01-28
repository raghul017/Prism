# Prism

Prism is a modern, beautiful tool for creating stunning code snippets. Transform your code into sharable, exportable images with a sleek, customizable interface.

[**Live Demo**](https://prism12.vercel.app/)

![Prism Screenshot](/screenshot.png)

## Features

*   **Beautiful Aesthetics**: Glassmorphism UI, "Aurora" background effects, and theme-aware glows.
*   **Customizable Layout**: Choose between **Right Sidebar**, Left Sidebar, or Bottom Controls.
*   **Rich Themes**: Selection of gradient-based themes with dynamic editor shadows.
*   **Frame Styles**: macOS, Windows, Minimal, or no frame options.
*   **Export Options**: Copy or save as PNG/SVG.
*   **Smart Features**: Auto-detect language, line numbers toggle, and responsive canvas.

## Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Styling**: Tailwind CSS + generic glassmorphism utilities
*   **State Management**: Zustand (persisted to localStorage)
*   **Icons**: Lucide React
*   **Editor**: react-simple-code-editor + highlight.js

## Getting Started

1.  Clone the repository:
    ```bash
    git clone https://github.com/raghul017/Prism.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
