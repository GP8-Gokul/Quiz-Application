import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LeaderboardCard({ leaderboard }) {
  const [animatedScores, setAnimatedScores] = useState({});

  // Increment scores one by one
  useEffect(() => {
    leaderboard.forEach(entry => {
      const current = animatedScores[entry.name] ?? 0;
      if (current < entry.score) {
        const interval = setInterval(() => {
          setAnimatedScores(prev => {
            const next = prev[entry.name] + 1;
            if (next >= entry.score) {
              clearInterval(interval);
              return { ...prev, [entry.name]: entry.score };
            }
            return { ...prev, [entry.name]: next };
          });
        }, 50); // increment speed (ms)
      } else if (current > entry.score) {
        // Optional: decrement if needed
        setAnimatedScores(prev => ({ ...prev, [entry.name]: entry.score }));
      }
    });
  }, [leaderboard]);

  const maxScore = Math.max(...leaderboard.map(p => p.score), 1);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-3 font-bold">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <motion.div layout>
          {leaderboard
            .sort((a, b) => b.score - a.score)
            .map((entry, idx) => (
              <motion.div
                key={entry.name}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-2"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded text-center text-xs">
                      {idx + 1}
                    </div>
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-semibold">
                    {animatedScores[entry.name] ?? entry.score}
                  </span>
                </div>

                {/* Progress Bar */}
                <motion.div
                  className="h-3 bg-blue-500 rounded"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((animatedScores[entry.name] ?? entry.score) / maxScore) *
                      100
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
