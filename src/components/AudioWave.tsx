import WavesurferPlayer, { WavesurferProps } from '@wavesurfer/react'
import { useRef, useState } from 'react'
import { Button } from './ui/button'
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
} from '@tabler/icons-react'
import { Slider } from './ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Skeleton } from './ui/skeleton'

interface Props {
  url: string
  dark: boolean
  autoPlay: boolean
}
export default function AudioWave(Props: Props) {
  const { url, dark, autoPlay } = Props
  const waveColor = dark ? '#1e2020' : '#FAFAF9'
  const progressColor = dark ? '#385362' : '#716B69'
  const [wavesurfer, setWavesurfer] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState<number>(0.7)

  const onPlayPause = () => wavesurfer && wavesurfer.playPause()
  const onReady = (ws: any) => setWavesurfer(ws)
  const onSetVolume = (value: number) => {
    setVolume(value)
    return wavesurfer && wavesurfer.setVolume(value)
  }
  const handleVolumne = () => {
    if (volume === 0) {
      wavesurfer && wavesurfer.setVolume(1)
      return onSetVolume(1)
    }
    wavesurfer && wavesurfer.setVolume(0)
    return onSetVolume(0)
  }
  const getIconVolume = () => {
    if (volume === 0) return <IconVolume3 size={30} />
    if (volume <= 0.5) return <IconVolume2 size={30} />
    return <IconVolume size={30} />
  }
  const hasUrlFile = url!.length > 0 && (url.startsWith('blob:') || url.startsWith('http'))
  if (!hasUrlFile) return <AudioWaveSkeleton />
  return (
    <div className="flex w-full flex-nowrap items-center gap-2">
      <Button
        onClick={onPlayPause}
        variant="ghost"
        className="aspect-square w-1/12 rounded-full p-0"
      >
        {isPlaying ? <IconPlayerPause size={30} /> : <IconPlayerPlay size={30} />}
      </Button>
      <div className="w-10/12">
        <WavesurferPlayer
          barGap={2.5}
          barWidth={3.5}
          barHeight={1.5}
          barRadius={10}
          cursorWidth={2}
          height={50}
          waveColor={waveColor}
          progressColor={progressColor}
          url={url}
          onReady={onReady}
          autoplay={autoPlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
      <div className="w-1/12">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="aspect-square rounded-full p-0"
                onClick={handleVolumne}
              >
                {getIconVolume()}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="w-[7rem] p-2" asChild align="end">
              <section className="flex w-[7rem] flex-col">
                <Slider
                  defaultValue={[volume]}
                  max={1}
                  step={0.1}
                  className="w-[6rem]"
                  value={[volume]}
                  onValueChange={(val) => onSetVolume(val[0])}
                />
              </section>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

function AudioWaveSkeleton() {
  const wave = Array.from({ length: 25 }, () => ({
    height: `${Math.random() * 95 + 5}%`,
    width: '3px',
  }))
  return (
    <div className="flex h-[50px] w-full flex-nowrap items-center gap-2">
      <div className="w-1/12">
        <Skeleton className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300/70">
          <IconPlayerPlayFilled className="mix-blend-difference" />
        </Skeleton>
      </div>
      <div className="flex h-[50px] w-full flex-nowrap items-center justify-center gap-1.5">
        {wave.map((bar, index) => (
          <Skeleton
            key={index}
            className={`h-[${bar.height}] w-[${bar.width}] rounded bg-gray-300`}
            style={{ height: bar.height, width: bar.width }}
          />
        ))}
      </div>
      <div className="w-1/12">
        <Skeleton className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-300/70">
          <IconVolumeOff className="mix-blend-difference" />
        </Skeleton>
      </div>
    </div>
  )
}
