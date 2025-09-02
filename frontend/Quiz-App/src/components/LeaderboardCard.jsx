import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LeaderboardCard({ leaderboard }) {
  const [scores, setScores] = useState({});
  const maxScore = Math.max(...leaderboard.map(e => e.score), 1);
  const colors = ["bg-yellow-500", "bg-gray-400", "bg-orange-600", "bg-blue-500"];

  const STEP = 10;       // points per tick
  const INTERVAL = 30;   // ms per tick

  useEffect(() => {
    const timers = [];
    leaderboard.forEach(e => {
      const current = scores[e.name] ?? 0;
      if (current !== e.score) {
        const t = setInterval(() => {
          setScores(prev => {
            const value = prev[e.name] ?? 0;
            let next = value;
            if (value < e.score) next = Math.min(value + STEP, e.score);
            if (value > e.score) next = Math.max(value - STEP, e.score);
            if (next === e.score) clearInterval(t);
            return { ...prev, [e.name]: next };
          });
        }, INTERVAL);
        timers.push(t);
      }
    });
    return () => timers.forEach(clearInterval);
  }, [leaderboard]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-3 font-bold">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((e, i) => (
            <motion.div
              key={e.name}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-gray-50 p-3 rounded"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 flex items-center justify-center text-xs text-white rounded ${colors[i] || colors[3]}`}>
                    {i + 1}
                  </div>
                  <span className="font-medium">{e.name}</span>
                </div>
                <span className="font-semibold text-lg">
                  {scores[e.name] ?? e.score}
                </span>
              </div>
              <motion.div
                className={`h-2 rounded ${colors[i] || colors[3]}`}
                initial={{ width: "0%" }}
                animate={{ width: `${((scores[e.name] ?? e.score) / maxScore) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
