import { useEffect, useState } from 'react'

/* eslint-disable max-len */
interface Props {
  className?: string
  showPercent?: boolean
  startTimer: boolean | null
  onResetTimer: () => void
}
export default function CircularProgress({
  className,
  showPercent = false,
  startTimer,
  onResetTimer,
}: Props) {
  const [timer, setTimer] = useState<number | null>(null)

  useEffect(() => {
    let idInterval: number | null = null
    const initTimer = () => {
      if (startTimer && timer === null) {
        setTimer(30)
      }
    }
    const timerAndReset = () => {
      const isInTimeToRecord = timer !== null && timer > 0 && timer <= 30 && startTimer
      if (isInTimeToRecord) {
        idInterval = window.setInterval(() => {
          idInterval !== null && setTimer((time) => time! - 1)
        }, 1000)
      } else {
        // reset timer
        if ((timer !== null && timer <= 0) || startTimer === false) {
          setTimer(null)
          onResetTimer()
          if (startTimer !== null) clearInterval(Number(idInterval))
        }
      }
    }
    initTimer()
    timerAndReset()
    return () => {
      if (startTimer !== null) clearInterval(Number(idInterval))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, startTimer])
  const progressOffset = timer ?? 30
  return (
    <div className={`flex h-full items-center justify-center ${className}`}>
      <div className="relative h-[200px] w-[200px]">
        <svg
          className="absolute left-0 top-0 h-full w-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2b2b2b" strokeWidth="4" />
          <circle
            className="transition-all duration-500 ease-in-out"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#ddc715"
            strokeWidth="4"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 * (1 - progressOffset / 30)}
          />
        </svg>
        {showPercent && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-4xl font-bold text-gray-900 dark:text-gray-50">
            75%
          </div>
        )}
      </div>
    </div>
  )
}
