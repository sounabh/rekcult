"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart, Music, ImageIcon, GamepadIcon, PenSquare, Menu, X } from "lucide-react"
import LoveLetters from "@/app/components/love-letters"
import Gallery from "@/app/components/gallery"
import MusicPlayer from "@/app/components/music-player"
import LoveGames from "@/app/components/love-games"
import RetroEffects from "@/app/components/retro-effects"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  // Scroll to top when section changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-pink-200 overflow-hidden relative flex flex-col">
      {/* CRT overlay effect */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-[url('/scanline.png')] opacity-10"></div>
      <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_80%)]"></div>

      {/* Floating hearts background */}
      <RetroEffects />

      {/* Header with neon effect */}
      <header className="relative z-20 border-b border-purple-900/50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 neon-text">
            Our Love Story
          </h1>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-pink-400 hover:text-pink-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavButton
              icon={<Heart size={18} />}
              label="Home"
              section="home"
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              icon={<PenSquare size={18} />}
              label="Love Letters"
              section="letters"
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              icon={<ImageIcon size={18} />}
              label="Gallery"
              section="gallery"
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              icon={<Music size={18} />}
              label="Music"
              section="music"
              active={activeSection}
              onClick={setActiveSection}
            />
            <NavButton
              icon={<GamepadIcon size={18} />}
              label="Games"
              section="games"
              active={activeSection}
              onClick={setActiveSection}
            />
          </nav>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 border-b border-purple-900/50">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <NavButton
                icon={<Heart size={18} />}
                label="Home"
                section="home"
                active={activeSection}
                onClick={(section) => {
                  setActiveSection(section)
                  setMobileMenuOpen(false)
                }}
              />
              <NavButton
                icon={<PenSquare size={18} />}
                label="Love Letters"
                section="letters"
                active={activeSection}
                onClick={(section) => {
                  setActiveSection(section)
                  setMobileMenuOpen(false)
                }}
              />
              <NavButton
                icon={<ImageIcon size={18} />}
                label="Gallery"
                section="gallery"
                active={activeSection}
                onClick={(section) => {
                  setActiveSection(section)
                  setMobileMenuOpen(false)
                }}
              />
              <NavButton
                icon={<Music size={18} />}
                label="Music"
                section="music"
                active={activeSection}
                onClick={(section) => {
                  setActiveSection(section)
                  setMobileMenuOpen(false)
                }}
              />
              <NavButton
                icon={<GamepadIcon size={18} />}
                label="Games"
                section="games"
                active={activeSection}
                onClick={(section) => {
                  setActiveSection(section)
                  setMobileMenuOpen(false)
                }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-20 scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black"
      >
        {activeSection === "home" && <HomeSection />}
        {activeSection === "letters" && <LoveLetters />}
        {activeSection === "gallery" && <Gallery />}
        {activeSection === "music" && <MusicPlayer />}
        {activeSection === "games" && <LoveGames />}
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-purple-900/50 bg-black/80 backdrop-blur-sm py-3 px-4 text-center text-xs text-pink-400">
        <p>Made with 💜 for the love of my life | © {new Date().getFullYear()}</p>
      </footer>

      {/* Global styles */}
      <style jsx global>{`
        
        body {
          margin: 0;
          padding: 0;
          background: black;
          color: #ffc0cb;
        }
        
        .neon-text {
          text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff;
        }
        
        .neon-box {
          box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
        }
        
        .pixel-border {
          box-shadow: 0 0 0 2px #ff00ff, 0 0 0 4px #000000, 0 0 0 6px #9900cc;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-thumb-purple-700::-webkit-scrollbar-thumb {
          background: #6d28d9;
          border-radius: 4px;
        }
        
        .scrollbar-track-black::-webkit-scrollbar-track {
          background: #000000;
        }
        
        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #ff00ff, -0.05em -0.025em 0 #00ffff;
            transform: translate(0.025em, 0.0125em);
          }
          15% {
            text-shadow: -0.05em -0.025em 0 #ff00ff, 0.025em 0.025em 0 #00ffff;
          }
          50% {
            text-shadow: 0.05em 0.05em 0 #ff00ff, 0.05em 0 0 #00ffff;
            transform: translate(0, 0);
          }
          100% {
            text-shadow: -0.05em 0 0 #ff00ff, -0.025em -0.05em 0 #00ffff;
            transform: translate(-0.025em, -0.0125em);
          }
        }
        
        .glitch-text {
          animation: glitch 3s infinite alternate;
        }
      `}</style>
    </div>
  )
}

// Navigation button component
function NavButton({
  icon,
  label,
  section,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  section: string
  active: string
  onClick: (section: string) => void
}) {
  const isActive = active === section

  return (
    <button
      onClick={() => onClick(section)}
      className={`flex items-center space-x-2 px-3 py-2 rounded transition-all duration-300 ${
        isActive
          ? "bg-purple-900/50 text-pink-300 neon-box"
          : "hover:bg-purple-900/30 text-pink-400 hover:text-pink-300"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

// Home section component
function HomeSection() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6 md:p-8 pixel-border">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center glitch-text">
            Welcome to Our Digital Love Space
          </h2>

          <div className="space-y-6 text-lg">
            <p className="leading-relaxed">
              Hey sweetheart! I created this retro-themed website just for us - a digital space where our love story
              lives on in all its pixelated, neon-lit glory. This is my way of showing you how much you mean to me, with
              a nostalgic twist that takes us back to the simpler times of the 90s.
            </p>

            <div className="py-4 flex justify-center">
              <div className="w-32 h-32 md:w-40 md:h-40 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                  <Heart className="w-16 h-16 md:w-20 md:h-20 text-pink-500" fill="currentColor" />
                </div>
              </div>
            </div>

            <p className="leading-relaxed">
              Explore our love letters, browse through our memories in the gallery, listen to our favorite songs, or
              play some cute games together. Every pixel of this site was crafted with love, just like every moment
              we've shared together.
            </p>

            <div className="pt-4 text-center">
              <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text">
                I love you to the moon and back! ❤️
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            title="Love Letters"
            icon={<PenSquare className="w-8 h-8 text-pink-400" />}
            description="Read and write heartfelt messages to each other in our digital love letter collection."
          />
          <FeatureCard
            title="Photo Gallery"
            icon={<ImageIcon className="w-8 h-8 text-pink-400" />}
            description="Browse through our special moments captured in retro Polaroid-style photos."
          />
          <FeatureCard
            title="Music Player"
            icon={<Music className="w-8 h-8 text-pink-400" />}
            description="Listen to our playlist of romantic songs that remind us of our journey together."
          />
          <FeatureCard
            title="Love Games"
            icon={<GamepadIcon className="w-8 h-8 text-pink-400" />}
            description="Have fun with cute mini-games designed to celebrate our relationship."
          />
        </div>
      </div>
    </div>
  )
}

// Feature card component
function FeatureCard({ title, icon, description }: { title: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-5 hover:bg-purple-900/30 transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <div className="bg-black/50 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-pink-300">{title}</h3>
          <p className="text-pink-200/80">{description}</p>
        </div>
      </div>
    </div>
  )
}

