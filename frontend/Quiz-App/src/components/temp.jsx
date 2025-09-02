import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LeaderboardCard({ leaderboard }) {
  const [animatedScores, setAnimatedScores] = useState({});
  const [sortedLeaderboard, setSortedLeaderboard] = useState([]);

  useEffect(() => {
    const sortedByAnimated = leaderboard.sort((a, b) => {
      const aAnimated = animatedScores[a.name] ?? a.score;
      const bAnimated = animatedScores[b.name] ?? b.score;
      return bAnimated - aAnimated;
    });
    
    setSortedLeaderboard(sortedByAnimated);
  }, [leaderboard, animatedScores]);

  useEffect(() => {
    const intervals = [];
    const incrementRate = 2;
    const incrementInterval = 30;

    leaderboard.forEach((entry) => {
      const current = animatedScores[entry.name] ?? 0;
      const targetScore = entry.score;

      if (current < targetScore) {
        const interval = setInterval(() => {
          setAnimatedScores((prev) => {
            const currentValue = prev[entry.name] ?? 0;
            const next = currentValue + incrementRate;

            if (next >= targetScore) {
              clearInterval(interval);
              return { ...prev, [entry.name]: targetScore };
            }
            return { ...prev, [entry.name]: next };
          });
        }, incrementInterval);

        intervals.push(interval);
      } else if (current > targetScore) {
        setAnimatedScores((prev) => ({ ...prev, [entry.name]: targetScore }));
      }
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [leaderboard, animatedScores]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="mb-3 font-bold">Leaderboard</h2>
      {sortedLeaderboard.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <motion.div className="space-y-2">
          {sortedLeaderboard.map((entry, idx) => {
            const currentMaxAnimatedScore = Math.max(
              ...sortedLeaderboard.map(e => animatedScores[e.name] ?? 0), 
              1
            );
            
            return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: "easeOut",
                  delay: idx * 0.1
                }
              }}
              layout
              transition={{
                layout: { duration: 1.8, ease: "easeInOut" },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
              }}
              className="mb-2 cursor-grab active:cursor-grabbing"
              drag="xy"
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragElastic={0.2}
              whileDrag={{ 
                scale: 1.05, 
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                zIndex: 1000,
                rotate: 2
              }}
            >
              <motion.div 
                className="bg-gray-50 p-3 rounded"
                whileHover={{ scale: 1.02}}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className={`w-6 h-6 text-white text-center text-xs flex items-center justify-center ${
                        idx === 0 ? 'bg-yellow-500' : 
                        idx === 1 ? 'bg-gray-400' : 
                        idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                      }`}
                      animate={{ 
                        scale: idx < 3 ? [1, 1.2, 1] : 1,
                        rotate: idx === 0 ? [0, 5, -5, 0] : 0
                      }}
                      transition={{ 
                        duration: 0.6,
                        delay: 0.3
                      }}
                    >
                      {idx + 1}
                    </motion.div>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <motion.span 
                    className="font-semibold text-lg"
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {animatedScores[entry.name] ?? entry.score}
                  </motion.span>
                </div>

                <div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
                  <motion.div
                    className={`h-3 rounded ${
                      idx === 0 ? 'bg-yellow-500' : 
                      idx === 1 ? 'bg-gray-400' : 
                      idx === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}
                    animate={{
                      width: `${
                        currentMaxAnimatedScore > 0
                          ? ((animatedScores[entry.name] ?? 0) / currentMaxAnimatedScore) * 100
                          : 0
                      }%`,
                    }}
                    transition={{ 
                      duration: 0.1,
                      ease: "easeOut"
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
