/* eslint-disable max-len */
const scoreColors = [
  'stroke-red-600',
  'stroke-orange-600',
  'stroke-yellow-600',
  'stroke-lime-600',
  'stroke-green-600',
]
function getColor(score: number) {
  if (score === 100) return scoreColors[4]
  const index = Math.floor(score / 25)
  return scoreColors[index]
}
export function ScoreProgress({ score, children }: { score: number; children?: React.ReactNode }) {
  const strokeColor = getColor(score)
  return (
    <div className={'flex h-full items-center justify-center'}>
      <div className="relative h-[30px] w-[30px]">
        <svg
          className="absolute left-0 top-0 h-full w-full -rotate-90 transform"
          viewBox="0 0 100 100"
        >
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2b2b2b" strokeWidth="18" />
          <circle
            className={`transition-all duration-500 ease-in-out ${strokeColor}`}
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeWidth="5"
            strokeDasharray="255"
            strokeDashoffset={255 * (1 - score / 100)}
          />
        </svg>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[0.6rem] text-gray-900 dark:text-gray-50">
          {children}
        </div>
      </div>
    </div>
  )
}
