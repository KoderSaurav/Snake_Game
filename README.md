# Modern Snake Game 🐍

A beautifully designed, fully responsive Snake game built entirely with vanilla web technologies. It features a sleek dark-mode aesthetic with glassmorphism UI elements and dynamic settings.

## 🌟 Features

- **Modern UI/UX**: Designed with a premium dark theme, glassmorphism overlays, and smooth micro-animations.
- **Responsive Canvas**: The game board dynamically sizes itself to maximize your screen area while maintaining a perfect `1:1` square aspect ratio.
- **Live Settings Panel**: Customize your gameplay experience mid-game without reloading:
  - **Speed Control**: Choose between Slow, Normal, Fast, and Insane speeds to match your play style.
  - **Dynamic Colors**: Pick custom hex colors for both the Snake and the Food using built-in interactive color pickers.
- **High Score Tracking**: Your highest score is automatically saved locally in your browser memory securely via `localStorage`.
- **Smart Input Handling**: Prevents self-reversal bugs during rapid key presses to ensure smooth, responsive controls.

## 🛠️ Tech Stack

This project is built directly without any external frameworks or libraries, keeping it fully standalone, lightweight, and fast:

- **HTML5**: Semantic structure and Native Canvas API integration for drawing the game graphics.
- **CSS3**: Advanced styling including Flexbox, CSS Variables, `aspect-ratio` responsiveness, and `backdrop-filter` for the slick glassmorphism effects.
- **Vanilla JavaScript (ES6+)**: Game engine loop management (`setInterval`), 2D Context rendering, state holding, and dynamic setting evaluations.

## 🚀 How to Play

Running the game is incredibly straightforward as it doesn't require complex Node setups or builds:

**Option 1: Direct Access (Easiest)**
1. Clone or download this project.
2. Double-click the `index.html` file to open it in your default web browser (Chrome, Edge, Firefox, Safari, etc.).
3. Play!

**Option 2: Local Server**
If you prefer running it through a local development server and have Node.js installed:
1. Open your terminal in the project directory.
2. Run `npx serve` and navigate to the provided `localhost` URL in your browser.

## 🎮 Controls

- **Arrow Keys** or **W, A, S, D**: Move the snake up, down, left, or right.
- **Enter / Spacebar**: Quick start a new game, or immediately restart when you get a game over.
