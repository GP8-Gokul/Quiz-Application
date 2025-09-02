import { motion } from "framer-motion"

export default function LeaderboardCard({ leaderboard }) {
  return (
    <div className="bg-white p-4 rounded">
      <h2 className="mb-3 font-bold">Leaderboard</h2>
      {leaderboard.length === 0 ? (
        <p className="text-gray-500">No data yet.</p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((e, i) => (
            <motion.div
              key={e.name}
              layout  
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div className="flex items-center gap-2">
                <div className="font-medium">{i + 1}.</div>
                <div>{e.name}</div>
              </div>
              <div className="font-semibold">{e.score}</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
