# 🧠 2048 AI Solver (Step-by-Step Assistant)

A smart web-based 2048 solver that suggests the best move from any custom board position.

Unlike traditional bots, this tool lets **you control the randomness** while the AI guides your decisions — perfect for solving real games, learning strategy, or experimenting with board states.

---

## 🚀 Features

- 🎯 Suggests best next move using AI
- 🧩 Custom board input (any position)
- ▶️ Apply move automatically
- 🔁 Step-by-step gameplay assistance
- 🎚 Adjustable AI depth (strength vs speed)
- 🌙 Clean dark UI
- ⚡ Runs entirely in browser (no backend)

---

## 🧠 How It Works

The solver uses a **lightweight Expectimax algorithm**, the same family of techniques used by strong 2048 AIs.

### Algorithm Overview
- Simulates all 4 possible moves
- Explores future board states
- Accounts for random tile spawns
- Scores positions using heuristics like:
  - Empty cells
  - Maximum tile value
  - Board stability

Returns the move with the highest expected score.

---

## 🎮 Usage

### Step-by-step workflow:

1. Enter your current board
2. Click **Suggest Move**
3. Click **Apply Move**
4. Manually add the random tile (2 or 4)
5. Repeat

This mirrors real gameplay while keeping guidance.

---

## 🖥 Tech Stack

- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- Pure client-side AI (no APIs)

---

## ⚙️ Running Locally

### 1️⃣ Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/2048-solver.git
cd 2048-solver