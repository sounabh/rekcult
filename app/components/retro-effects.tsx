"use client"

import { useEffect, useState } from "react"

export default function RetroEffects() {
  const [hearts, setHearts] = useState<
    Array<{
      id: number
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      rotation: number
    }>
  >([])

  // Generate initial hearts
  useEffect(() => {
    const newHearts = []
    for (let i = 0; i < 20; i++) {
      newHearts.push(createHeart(i))
    }
    setHearts(newHearts)

    // Animation loop for floating hearts
    const interval = setInterval(() => {
      setHearts((prevHearts) =>
        prevHearts.map((heart) => {
          // Move heart upward
          const y = heart.y - heart.speed

          // Reset heart if it goes off screen
          if (y < -100) {
            return createHeart(heart.id)
          }

          return {
            ...heart,
            y,
            rotation: heart.rotation + heart.speed / 10,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Create a new heart with random properties
  function createHeart(id: number) {
    return {
      id,
      x: Math.random() * 100, // percentage across screen
      y: 100 + Math.random() * 100, // start below screen
      size: 10 + Math.random() * 20,
      speed: 0.1 + Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.5,
      rotation: Math.random() * 360,
    }
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute text-pink-500"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotation}deg)`,
            textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
          }}
        >
          ❤️
        </div>
      ))}

      {/* Neon grid background */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(157, 23, 77, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(157, 23, 77, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center center",
        }}
      ></div>

      {/* Vignette effect */}
      <div
        className="absolute inset-0 z-[-1]"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      ></div>
    </div>
  )
}

