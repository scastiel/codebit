import { useEffect, useRef } from 'react'
import { useCurrentFrame, useVideoConfig } from 'remotion'
import {
  drawGradientOnCanvas,
  gradientParamsFromSeed,
} from './gradients'

export function GradientCanvas({
  seed,
  animated,
}: {
  seed: number
  animated: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frame = useCurrentFrame()
  const { width, height, durationInFrames } = useVideoConfig()

  const effectiveFrame = animated ? frame : 1

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const params = gradientParamsFromSeed(seed, effectiveFrame, durationInFrames)
    drawGradientOnCanvas(ctx, width, height, params)
  }, [seed, effectiveFrame, durationInFrames, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
      }}
    />
  )
}
