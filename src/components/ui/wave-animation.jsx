"use client"

import { useEffect, useRef } from "react"

const PALETTE = [
  "#3E2723",
  "#5D4037",
  "#8B7E74",
  "#C9A84C",
  "#D4B96A",
  "#A68B3C",
  "#FAF6F0",
  "#F0EAE0",
  "#B5A99A",
]

export function WaveAnimation({ variant = "footer", className = "" }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()

    const ro = new ResizeObserver(resizeCanvas)
    ro.observe(container)

    const animate = (timeOffset) => {
      const tick = (timestamp) => {
        const time = timestamp + timeOffset

        ctx.fillStyle = "rgba(0, 0, 0, 0.03)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        let x = 0
        const barCount = 20
        const barWidth = canvas.width / barCount

        for (let i = 0; i < barCount; i++) {
          const h = 2 - (Math.sin(i + time / 200) / 2) * canvas.height
          ctx.fillStyle = PALETTE[Math.floor(i + time / 200) % PALETTE.length]
          ctx.fillRect(x, canvas.height / 2, barWidth, h)
          x += barWidth
        }

        animationId = requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    animate(0)
    animate(100)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
    }
  }, [])

  const isHeader = variant === "header"

  return (
    <div
      ref={containerRef}
      className={`${isHeader ? "absolute inset-0" : "relative"} w-full overflow-hidden ${className}`}
      style={isHeader ? undefined : { height: "400px" }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ margin: 0, padding: 0, display: "block" }}
      />
    </div>
  )
}

export default WaveAnimation
