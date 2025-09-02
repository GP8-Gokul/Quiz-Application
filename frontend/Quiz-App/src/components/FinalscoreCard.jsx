import { useEffect, useState } from "react"
import _ from "lodash"
import {useMediaQuery} from 'react-responsive'
import Confetti from 'react-dom-confetti';


const confettiLeftConfig = {
  angle: 75,         
  spread: 100,
  startVelocity: 100,
  elementCount: 60,
  dragFriction: 0.12,
  duration: 5000,
  stagger: 0,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

const confettiRightConfig = {
  angle: 135,          
  spread: 100,
  startVelocity: 100,
  elementCount: 60,
  dragFriction: 0.12,
  duration: 5000,
  stagger: 0,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};


export default function LeaderboardCard({ leaderboard, quiz, name="" }){
    const isSmallScreen = useMediaQuery({maxWidth: 635})

    const [scores, setScores] = useState({})
    const basicColor = "bg-emerald-500"

    const [isWinner, setIsWinner] = useState(false)

    const INTERVAL = 50  
    const maxScore = leaderboard[0].score ?? 1
    const STEP = Math.max(7,Math.floor((maxScore / 100) * 7))
    const [confettiActive, setConfettiActive] = useState(false)

    useEffect(() => {
      const initialScores = {}
      leaderboard.forEach(e => {
        initialScores[e.name] = 0
      })
      setScores(initialScores)

      const timer = setInterval(() => {
        setScores(prev => {
          const newScores = { ...prev }
          let allComplete = true
          
          leaderboard.forEach(e => {
            const currentScore = newScores[e.name] || 0
            if (currentScore < e.score) {
              newScores[e.name] = Math.min(currentScore + STEP, e.score)
              allComplete = false
            }
          })
          
          if (allComplete) {
            clearInterval(timer)
          }
          
          return newScores
        })
      }, INTERVAL)

      return () => clearInterval(timer)
  }, [leaderboard])

  const isAnimationComplete = leaderboard.every(e => scores[e.name] === e.score)
  useEffect(() => {
    setIsWinner(isAnimationComplete && leaderboard[0]?.name === name)
  }, [isAnimationComplete])

  useEffect(() => {
    if (!isAnimationComplete) return;

    const interval = setInterval(() => {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 200); 
    }, 400);

    return () => clearInterval(interval);
  }, [isAnimationComplete]);

  const [displayOrder, setDisplayOrder] = useState([]);

  const barSize = `${Math.floor(100 / displayOrder.length)}%`
  
  useEffect(() => {
    const top10 = leaderboard.slice(0,10)
    const shuffled = _.shuffle(top10)
    setDisplayOrder(shuffled)
  }, [])

  return (
    <div className="bg-white p-2 flex flex-col items-start sm:items-center justify-between sm:flex-none sm:p-6 rounded h-[80vh]">
      <h1 className="text-2xl text-center sm:text-start font-bold text-green-600 mb-4">Quiz Completed!</h1>

      {/* Confetti Animation */}
      {isAnimationComplete && isWinner && (
          <>
            {/* Left bottom corner */}
            <div className="fixed bottom-0 left-0 z-50 pointer-events-none">
              <Confetti active={confettiActive} config={confettiLeftConfig} />
            </div>

            {/* Right bottom corner */}
            <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
              <Confetti active={confettiActive} config={confettiRightConfig} />
            </div>
          </>
        )}

      {/* Final Podium */}
      {isAnimationComplete && !name  && (
        <h1 className="inline-block text-sm sm:text-lg bg-[#34D156AC] p-2 rounded mb-8">The Winner of {quiz} quiz is {leaderboard[0]?.name}! 🥳🥳🥳🥳🥳🥳</h1>
      )}
      {isAnimationComplete && isWinner && (
        <h1 className="inline-block text-sm sm:text-lg bg-[#34D156AC] p-2 rounded mb-8">The Winner of {quiz} quiz is You! 🥳🥳🥳🥳🥳🥳</h1>
      )}
      {isAnimationComplete && name && !isWinner && (
        <h1 className="inline-block text-sm sm:text-lg bg-[#34D156AC] p-2 rounded mb-8">Your Position in {quiz} quiz is {leaderboard.findIndex(e => e.name === name) + 1} ! 🥳🥳🥳🥳🥳🥳</h1>
      )}

      {isAnimationComplete && leaderboard.length > 0 && (

        <div className="mb-2 flex ml-[25%] sm:ml-0 justify-center items-end">

          {/* 2nd Position */}
          {leaderboard[1] && (
            <div className="text-center">
              <div className="bg-gray-300 text-white sm:w-24 w-16 h-24 flex p-1 flex-col justify-center rounded font-bold text-sm">
                <h1>2</h1>
                <p>{leaderboard[1].name}</p>
              </div>
            </div>
          )}
          
          {/* 1st Position */}
          <div className="text-center">
            <div className="bg-yellow-300 text-white sm:w-30 w-22 h-32 flex flex-col justify-start rounded font-bold text-xl">
              <h1>1</h1>
              <p>{leaderboard[0].name}</p>
            </div>
          </div>

          {/* 3rd Position */}
          {leaderboard[2] && (
            <div className="text-center">
              <div className="bg-orange-400 text-white sm:w-20 w-12 h-16 flex flex-col justify-end rounded font-bold text-base">
                <h1>3</h1>
                <p>{leaderboard[2].name}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scorebars */}
      {leaderboard.length === 0 ? 
        ( <p className="text-gray-500 text-center">No data yet.</p>) : 
        (
          <div className="flex flex-col mt-10 sm:flex-row sm:gap-6 sm:justify-center  items-start sm:items-end">
            {displayOrder.map((e, i) => (
              <div key={e.name} className="flex gap-2 flex-row-reverse sm:flex-col items-center justify-end h-auto mb-2">
                
                <div className="mb-1 font-semibold text-lg text-gray-800">
                  {scores[e.name]}
                </div>
                
                <div
                  className={`rounded ${
                    isAnimationComplete?
                      leaderboard[0]?.name === e.name ? 'bg-yellow-500' : 
                      leaderboard[1]?.name === e.name ? 'bg-gray-400' : 
                      leaderboard[2]?.name === e.name ? 'bg-orange-600': 
                      basicColor
                    :basicColor
                    }
                    sm:w-16 sm:h-auto
                    w-auto h-16  
                  `}
                  style={{
                    width: isSmallScreen ? `${(scores[e.name] / maxScore) * 250}px` : `${barSize}`,
                    height: !isSmallScreen ? `${(scores[e.name] / maxScore) * 200}px` : `${barSize}`,

                    minWidth: '40px',
                    minHeight: '40px'
                  }}
                />
                
                <div className="mt-2 w-15 text-center truncate h-5 text-sm">
                  {e.name}
                </div>
              </div>
            ))}
          </div>
      )}
    </div>
  )
}
