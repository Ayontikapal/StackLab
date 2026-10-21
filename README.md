# ⚡ StackLab — Infix to Postfix Converter & Postfix Evaluator

> A modern, interactive educational tool built to visualize stack operations, Dijkstra’s Shunting-Yard algorithm, and Reverse Polish Notation (RPN) evaluation with physics-inspired animations and real-time step traces.

![StackLab](https://img.shields.io/badge/StackLab-Interactive%20Visualizer-155DFC?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## 🌟 Key Features

### 🔄 1. Infix to Postfix Converter
- **Dijkstra’s Shunting-Yard Algorithm**: Visualizes token-by-token parsing, operator precedence (`^` > `*`, `/` > `+`, `-`), associativity (right-associative for `^`), and parentheses handling.
- **Interactive Operator Stack**: Watch tokens smoothly push, pop, and enter the postfix stream with physics-based spring animations via `motion/react`.
- **Step-by-Step Explanation**: Detailed rationale provided for every token transition, stack condition, and precedence check.
- **Comprehensive Trace Table**: Tabular history recording token, action, operator stack contents, and postfix output at each step.

### 🧮 2. Postfix Expression Evaluator
- **Reverse Polish Notation (RPN) Machine**: Demonstrates the classic operand evaluation stack.
- **Two-Operand Pop & Compute Animation**: Highlights both operands being popped from the stack, computes the result with operation badges, and pushes the evaluated value back onto the stack.
- **Supports Multiple Operators**: Addition (`+`), Subtraction (`-`), Multiplication (`*`), Division (`/`), and Exponentiation (`^`).

### 📚 3. Dedicated "How It Works" Learning Guide
- Comprehensive educational breakdowns of:
  - Infix notation vs. Postfix notation (Reverse Polish Notation)
  - Operator precedence & associativity tables
  - Step-by-step Shunting-Yard algorithm walkthroughs
  - The Stack data structure (LIFO principles)
  - Common pitfalls and real-world compiler/parser applications

### 🎨 4. Premium Developer-Tool Aesthetics
- **Smooth Playback Controls**: Step Forward, Step Backward, Auto-Play with customizable playback speed (0.5x, 1x, 1.5x, 2x), and instant Reset.
- **Auto-Navigate & Scroll**: Clicking "Convert Expression" or "Evaluate Expression" immediately triggers playback and smoothly anchors the user directly to the active visualizer stack.
- **Confetti Celebration**: Fires upon animation completion when expressions successfully evaluate!

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion for React](https://motion.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayontikapal/StackLab.git
   cd StackLab
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Run tests:**
   ```bash
   npm test
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
evaluation-converter/
├── src/
│   ├── components/
│   │   ├── AlgorithmExplanation.tsx  # Dynamic contextual explanation card
│   │   ├── EvaluationStepTable.tsx   # Detailed trace table for postfix evaluation
│   │   ├── HeroSection.tsx           # Interactive header and hero banner
│   │   ├── HowItWorks.tsx            # Dedicated educational guide component
│   │   ├── Navbar.tsx                # Navigation header with routing links & dark mode toggle
│   │   ├── OperandStackVisualizer.tsx# Visual representation of the operand stack
│   │   ├── OperatorStack.tsx         # Animated LIFO visualizer for operator stack
│   │   ├── OutputDisplay.tsx         # Postfix output stream display
│   │   ├── PlaybackControls.tsx      # Step, Play/Pause, Speed, and Reset controls
│   │   ├── PostfixInputCard.tsx      # Input form for postfix evaluation
│   │   ├── ResultCard.tsx            # Success result card revealed at completion
│   │   ├── StepByStepTable.tsx       # Trace table for conversion steps
│   │   ├── TokenSequence.tsx         # Horizontal interactive stream of tokens
│   │   └── VisualizerCard.tsx        # Infix expression input card with quick presets
│   ├── core/
│   │   ├── __tests__/                # Vitest unit test suites for Shunting-Yard & RPN
│   │   ├── infixToPostfix.ts         # Dijkstra's Shunting-Yard algorithm & step generation
│   │   ├── postfixEvaluator.ts       # RPN evaluation engine with step-by-step trace
│   │   ├── stack.ts                  # Pure generic Stack data structure implementation
│   │   ├── tokenizer.ts              # Mathematical expression lexer/tokenizer
│   │   └── types.ts                  # Shared TypeScript interfaces & types
│   ├── pages/
│   │   ├── ConverterPage.tsx         # Infix-to-Postfix route (/converter)
│   │   ├── EvaluatorPage.tsx         # Postfix Evaluator route (/evaluator)
│   │   └── HowItWorksPage.tsx        # Educational Guide route (/how-it-works)
│   ├── App.tsx                       # Root layout & route configuration
│   ├── index.css                     # Design tokens, fonts, and Tailwind styles
│   └── main.tsx                      # Entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 📖 Algorithm Insights

### Shunting-Yard Algorithm (Infix to Postfix)
1. Read token by token from left to right.
2. If the token is an **operand**, append it directly to the postfix output.
3. If the token is an **operator ($o_1$)**:
   - While there is an operator ($o_2$) at the top of the operator stack with greater precedence (or equal precedence and left-associative), pop $o_2$ to the output.
   - Push $o_1$ onto the operator stack.
4. If the token is a **left parenthesis `(`**, push it onto the operator stack.
5. If the token is a **right parenthesis `)`**:
   - Pop operators from the stack to the output until a matching `(` is encountered.
   - Discard the left parenthesis.
6. When no more tokens remain, pop any remaining operators from the stack to the output.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
