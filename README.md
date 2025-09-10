# 3D Calculator

A futuristic 3D Calculator web application with glassmorphism design, 3D animations, and multiple calculator modes built with React, TypeScript, Three.js, and Framer Motion.

## Features

### Calculator Modes
- **Basic Calculator**: Standard arithmetic operations (+, -, ×, ÷) with parentheses support
- **Scientific Calculator**: Advanced mathematical functions including:
  - Trigonometric functions (sin, cos, tan)
  - Logarithmic functions (log, ln)
  - Square root, factorial, power operations
  - Mathematical constants (π, e)
  - Inverse and negation operations
- **Currency Converter**: Real-time currency conversion using live exchange rates from exchangerate.host API

### Design & Animations
- **3D Animated Background**: Rotating glowing orbs and particle field using Three.js
- **Glassmorphism UI**: Transparent frosted glass panels with backdrop blur effects
- **Neon Theme**: Glowing buttons with hover and tap animations using Framer Motion
- **3D Transitions**: Smooth flip/slide animations when switching between calculator tabs
- **Theme Toggle**: Dark/light theme support with smooth transitions

### User Experience
- **Calculation History**: Shows last 5 calculations with click-to-reuse functionality
- **Responsive Design**: Optimized for both mobile and desktop devices
- **Error Handling**: Comprehensive error messages for invalid operations
- **Live Data**: Real currency exchange rates with no mock data

### Technical Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS with custom CSS variables
- **Animations**: Framer Motion for UI animations
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **API Calls**: Axios for HTTP requests
- **Backend**: Express.js with TypeScript
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd 3d-calculator
