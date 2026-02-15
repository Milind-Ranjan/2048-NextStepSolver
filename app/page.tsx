"use client";

import { useState } from "react";

// --- 2048 Solver with Step Mode ---
const MOVES = ["UP", "DOWN", "LEFT", "RIGHT"];

const clone = (b) => b.map((r) => [...r]);

const rotate = (b, k) => {
  let res = clone(b);
  for (let t = 0; t < ((k % 4) + 4) % 4; t++) {
    const n = res.length;
    const out = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) out[j][n - 1 - i] = res[i][j];
    res = out;
  }
  return res;
};

const compress = (row) => {
  const vals = row.filter((x) => x !== 0);
  return [...vals, ...Array(row.length - vals.length).fill(0)];
};

const merge = (row) => {
  const r = [...row];
  for (let i = 0; i < r.length - 1; i++) {
    if (r[i] !== 0 && r[i] === r[i + 1]) {
      r[i] *= 2;
      r[i + 1] = 0;
    }
  }
  return r;
};

const moveLeft = (board) => {
  let moved = false;
  const out = board.map((row) => {
    const c = compress(row);
    const m = merge(c);
    const f = compress(m);
    if (JSON.stringify(f) !== JSON.stringify(row)) moved = true;
    return f;
  });
  return { board: out, moved };
};

const move = (board, dir) => {
  if (dir === 0) {
    // UP
    const b = rotate(board, -1);
    const { board: mb, moved } = moveLeft(b);
    return { board: rotate(mb, 1), moved };
  }

  if (dir === 1) {
    // DOWN
    const b = rotate(board, 1);
    const { board: mb, moved } = moveLeft(b);
    return { board: rotate(mb, -1), moved };
  }

  if (dir === 2) {
    // LEFT
    return moveLeft(board);
  }

  if (dir === 3) {
    // RIGHT
    const b = rotate(board, 2);
    const { board: mb, moved } = moveLeft(b);
    return { board: rotate(mb, 2), moved };
  }
};

// --- Heuristics ---
const emptyCells = (b) => b.flat().filter((x) => x === 0).length;
const maxTile = (b) => Math.max(...b.flat());

const evaluate = (b) =>
  emptyCells(b) * 1000 + Math.log2(maxTile(b) || 2) * 200;

// --- Lightweight expectimax for responsiveness ---
const expectimax = (board, depth, player = true) => {
  if (depth === 0) return evaluate(board);

  if (player) {
    let best = -Infinity;
    for (let d = 0; d < 4; d++) {
      const { board: nb, moved } = move(board, d);
      if (!moved) continue;
      best = Math.max(best, expectimax(nb, depth - 1, false));
    }
    return best === -Infinity ? evaluate(board) : best;
  } else {
    const empties = [];
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) if (board[i][j] === 0) empties.push([i, j]);
    if (!empties.length) return evaluate(board);

    let total = 0;
    for (const [i, j] of empties) {
      const nb = clone(board);
      nb[i][j] = 2; // assume 2 for speed
      total += expectimax(nb, depth - 1, true);
    }
    return total / empties.length;
  }
};

const bestMove = (board, depth = 4) => {
  const scores = [];
  for (let d = 0; d < 4; d++) {
    const { board: nb, moved } = move(board, d);
    if (!moved) {
      scores.push(-Infinity);
      continue;
    }
    scores.push(expectimax(nb, depth, false));
  }
  const bestIdx = scores.indexOf(Math.max(...scores));
  return { move: MOVES[bestIdx], scores, bestIdx };
};

// --- UI ---
const Tile = ({ value, onChange }) => (
  <input
    type="number"
    value={value}
    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
    className="w-16 h-16 text-center text-lg font-semibold rounded-2xl shadow-inner border border-white/20 bg-white/20 text-white"
  />
);

export default function Solver2048() {
  const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [result, setResult] = useState(null);
  const [depth, setDepth] = useState(4);

  const updateCell = (r, c, val) => {
    const b = clone(board);
    b[r][c] = val;
    setBoard(b);
  };

  const solve = () => {
    const res = bestMove(board, depth);
    setResult(res);
  };

  const applyMove = () => {
    if (!result) return;
    const { board: newBoard } = move(board, result.bestIdx);
    setBoard(newBoard);
    setResult(null);
  };

  const clear = () => {
    setBoard(Array.from({ length: 4 }, () => Array(4).fill(0)));
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white p-6 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Step-by-Step 2048 Solver</h1>

        <div className="grid grid-cols-4 gap-3 justify-items-center mb-4">
          {board.map((row, r) =>
            row.map((val, c) => (
              <Tile key={`${r}-${c}`} value={val} onChange={(v) => updateCell(r, c, v)} />
            ))
          )}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">Depth: {depth}</span>
          <input
            type="range"
            min={2}
            max={6}
            value={depth}
            onChange={(e) => setDepth(parseInt(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={solve}
            className="bg-indigo-500 hover:bg-indigo-600 py-2 rounded-xl font-semibold"
          >
            Suggest Move
          </button>
          <button
            onClick={applyMove}
            className="bg-green-500 hover:bg-green-600 py-2 rounded-xl font-semibold"
          >
            Apply Move ▶
          </button>
          <button
            onClick={clear}
            className="col-span-2 bg-white/20 hover:bg-white/30 py-2 rounded-xl font-semibold"
          >
            Reset Board
          </button>
        </div>

        {result && (
          <div className="mt-5 text-center">
            <p className="text-xl font-bold text-indigo-300">Best: {result.move}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">
          Flow: Solve → Apply Move → Manually add random tile → Solve again
        </p>
      </div>
    </div>
  );
}
