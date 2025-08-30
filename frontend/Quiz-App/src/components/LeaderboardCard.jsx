import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LeaderboardCard({ leaderboard }) {
  const [animatedScores, setAnimatedScores] = useState({});

  // Increment scores one by one
  useEffect(() => {
    const intervals = []; // Track intervals for cleanup

    leaderboard.forEach((entry) => {
      // Ensure entry.name exists and entry.score is a valid number
      if (!entry.name || typeof entry.score !== "number" || isNaN(entry.score)) {
        return;
      }

      const current = animatedScores[entry.name] ?? 0;
      const targetScore = entry.score;

      if (current < targetScore) {
        const difference = targetScore - current;
        const increment = Math.max(1, Math.ceil(difference / 20)); // Animate over ~20 steps
        
        const interval = setInterval(() => {
          setAnimatedScores((prev) => {
            const currentValue = prev[entry.name] ?? 0;
            const next = currentValue + increment;

            if (next >= targetScore) {
              clearInterval(interval);
              return { ...prev, [entry.name]: targetScore };
            }
            return { ...prev, [entry.name]: next };
          });
        }, 30);

        intervals.push(interval);
      } else if (current > targetScore) {
        // Direct update if score decreased
        setAnimatedScores((prev) => ({ ...prev, [entry.name]: targetScore }));
      }
    });

    // Cleanup all intervals
    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [leaderboard, animatedScores]);

  // Fix: Ensure scores are numbers and fallback to 0 if missing
  const safeScores = leaderboard
    .filter((p) => p.name && typeof p.score === "number" && !isNaN(p.score))
    .map((p) => p.score);
  const maxScore = Math.max(...safeScores, 1);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-3 font-bold">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <motion.div layout>
          {leaderboard
            .filter(
              (entry) =>
                entry.name && typeof entry.score === "number" && !isNaN(entry.score)
            )
            .sort((a, b) => b.score - a.score)
            .map((entry, idx) => (
              <motion.div
                key={entry.name}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.001 }}
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
                <div className="w-full bg-gray-200 rounded h-3">
                  <motion.div
                    className="h-3 bg-blue-500 rounded"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        maxScore > 0
                          ? ((animatedScores[entry.name] ?? entry.score) / maxScore) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ duration: 0.001 }}
                  />
                </div>
              </motion.div>
            ))}
        </motion.div>
      )}
    </div>
  );
}
