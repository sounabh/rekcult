/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React, { useState, useEffect, useRef, ChangeEvent } from "react"
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Plus, Trash, 
  X
} from "lucide-react"
import { Song } from "@prisma/client"
import { getSongs, createSong, deleteSong } from "@/lib/db/action"

export default function MusicPlayer() {
  // Audio Player State
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  // Song Addition States
  const [isAddingSong, setIsAddingSong] = useState(false)
  const [newSongName, setNewSongName] = useState("")
  const [newSongArtist, setNewSongArtist] = useState("")
  
  // File Upload States
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null)
  
  // Error and Loading States
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Fetch Songs on Component Mount
  useEffect(() => {
    const fetchSongs = async () => {
      setIsLoading(true)
      try {
        const fetchedSongs = await getSongs()
        setSongs(fetchedSongs)
      } catch (error) {
        console.error("Error fetching songs:", error)
        setErrorMessage("Failed to load songs")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSongs()
  }, [])

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setProgress(audio.currentTime)
    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleEnded = () => handleNext()
    const handleError = () => {
      setErrorMessage("Error playing song. Check file or URL.")
      setIsPlaying(false)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [])

  // Playback Control Effect
  useEffect(() => {
    if (audioRef.current && songs.length > 0) {
      try {
        if (isPlaying) {
          audioRef.current.play().catch((error) => {
            console.error("Playback error:", error)
            setIsPlaying(false)
            setErrorMessage("Cannot play song. Invalid file.")
          })
        } else {
          audioRef.current.pause()
        }
      } catch (error) {
        console.error("Playback error:", error)
      }
    }
  }, [isPlaying, currentSongIndex, songs])

  // Volume Control Effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // File Input Change Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validAudioTypes = [
      'audio/mpeg', 
      'audio/mp3', 
      'audio/wav', 
      'audio/ogg', 
      'audio/webm', 
      'audio/x-wav'
    ]

    if (!validAudioTypes.includes(file.type)) {
      setErrorMessage("Please select a valid audio file (MP3, WAV, OGG)")
      return
    }

    // Validate file size (optional, example limit of 10MB)
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxFileSize) {
      setErrorMessage("File is too large. Max 10MB allowed.")
      return
    }

    // Set file and create preview URL
    setSelectedFile(file)
    setFilePreviewUrl(URL.createObjectURL(file))

    // Auto-set song name from filename
    const titleWithoutExtension = file.name.split('.').slice(0, -1).join('.')
    setNewSongName(titleWithoutExtension)
    
    // Clear previous errors
    setErrorMessage("")
  }

  // Add Song Handler
  const handleAddSong = async () => {
    // Validation
    if (!selectedFile && !newSongName.trim()) {
      setErrorMessage("Please select an audio file and enter a song name")
      return
    }

    setIsLoading(true)
    try {
      // Prepare file for upload (in a real app, you'd upload to cloud storage)
      const audioFileUrl = filePreviewUrl || URL.createObjectURL(selectedFile!)

      // Create song
      const newSong = await createSong({
        name: newSongName.trim(),
        artist: newSongArtist.trim() || "Unknown Artist",
        audioFile: audioFileUrl
      })
      
      // Update songs list
      setSongs(prev => [...prev, newSong])
      
      // Reset form
      resetAddSongForm()
    } catch (error) {
      console.error("Error adding song:", error)
      setErrorMessage("Failed to add song. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset Add Song Form
  const resetAddSongForm = () => {
    setNewSongName("")
    setNewSongArtist("")
    setSelectedFile(null)
    setFilePreviewUrl(null)
    setIsAddingSong(false)
    setErrorMessage("")
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Playback Control Methods
  const handlePlayPause = () => setIsPlaying(prev => !prev)
  
  const handlePrevious = () => {
    setCurrentSongIndex(prev => (prev === 0 ? songs.length - 1 : prev - 1))
    setIsPlaying(true)
  }
  
  const handleNext = () => {
    setCurrentSongIndex(prev => (prev === songs.length - 1 ? 0 : prev + 1))
    setIsPlaying(true)
  }

  // Utility Methods
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setProgress(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(prev => !prev)
  }

  // Delete Song Handler
  const handleDeleteSong = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this song?")) return

    try {
      await deleteSong(id)
      
      const newSongs = songs.filter((song) => song.id !== id)
      setSongs(newSongs)

      // Adjust current index if needed
      if (songs[currentSongIndex]?.id === id) {
        setIsPlaying(false)
        setCurrentSongIndex(prev => prev >= newSongs.length ? 0 : prev)
      }
    } catch (error) {
      console.error("Error deleting song:", error)
      setErrorMessage("Failed to delete song")
    }
  }

  // Current Song
  const currentSong = songs.length > 0 ? songs[currentSongIndex] : null


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text">
            Our Playlist
          </h2>
          <button
            onClick={() => setIsAddingSong(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-900/50 text-pink-300 rounded hover:bg-purple-800/50 transition-colors neon-box"
          >
            <Plus size={18} />
            <span>Add Song</span>
          </button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Song list */}
          <div className="md:col-span-1 bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black">
            <h3 className="text-xl font-bold mb-4 text-pink-300">Songs</h3>
  
            {songs.length === 0 ? (
              <p className="text-pink-300/70 text-center py-8">No songs yet. Add your first song!</p>
            ) : (
              <div className="space-y-3">
                {songs.map((song, index:any) => (
                  <div
                    key={song.id}
                    onClick={() => handleDeleteSong(index)}
                    className={`cursor-pointer p-3 rounded transition-all ${
                      currentSongIndex === index
                        ? "bg-purple-800/50 neon-box"
                        : "bg-purple-900/40 hover:bg-purple-800/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-pink-300 mb-1">{song.name}</h4>
                        <p className="text-sm text-pink-400">{song.artist}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSong(song.id)
                        }}
                        className="text-pink-400 hover:text-pink-300 p-1"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
  
          {/* Player */}
          <div className="md:col-span-2 bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6 flex flex-col">
            {songs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <p className="text-pink-300/70 mb-4">Add songs to create your playlist</p>
                <button
                  onClick={() => setIsAddingSong(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-900/50 text-pink-300 rounded hover:bg-purple-800/50 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Song</span>
                </button>
              </div>
            ) : (
              <>
                {/* Now playing */}
                <div className="text-center mb-8">
                  <p className="text-sm text-pink-400 mb-1">Now Playing</p>
                  <h3 className="text-2xl font-bold text-pink-300 mb-1">{currentSong?.name || "No song selected"}</h3>
                  <p className="text-pink-400">{currentSong?.artist || ""}</p>
                </div>
  
                {/* Error message */}
                {errorMessage && (
                  <div className="bg-red-900/30 text-red-300 p-3 rounded-lg mb-4 text-center">
                    {errorMessage}
                  </div>
                )}
  
                {/* Visualizer */}
                <div className="h-32 mb-6 flex items-end justify-center space-x-1">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const height = isPlaying ? 20 + Math.random() * 80 : 20
  
                    return (
                      <div
                        key={i}
                        className="w-2 bg-gradient-to-t from-pink-600 to-purple-500 rounded-t"
                        style={{
                          height: `${height}%`,
                          transition: "height 0.2s ease",
                        }}
                      ></div>
                    )
                  })}
                </div>
  
                {/* Progress bar */}
                <div className="mb-4">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ec4899 ${(progress / (duration || 100)) * 100}%, #581c87 ${(progress / (duration || 100)) * 100}%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-pink-400 mt-1">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
  
                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <button onClick={handlePrevious} className="text-pink-400 hover:text-pink-300 p-2">
                    <SkipBack size={24} />
                  </button>
  
                  <button
                    onClick={handlePlayPause}
                    className="bg-pink-600 hover:bg-pink-500 text-white rounded-full p-4 transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
  
                  <button onClick={handleNext} className="text-pink-400 hover:text-pink-300 p-2">
                    <SkipForward size={24} />
                  </button>
                </div>
  
                {/* Volume control */}
                <div className="flex items-center space-x-2 mt-6">
                  <button onClick={handleMuteToggle} className="text-pink-400 hover:text-pink-300">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                    className="w-24 h-2 bg-purple-900 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ec4899 ${volume * 100}%, #581c87 ${volume * 100}%)`,
                    }}
                  />
                </div>
  
                {/* Hidden audio element */}
                <audio 
                  ref={audioRef} 
                  src={currentSong?.audioFile} 
                  preload="metadata" 
                  className="hidden" 
                />
              </>
            )}
          </div>
        </div>
      </div>
  
      {/* Add Song Modal */}
      {isAddingSong && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="relative bg-purple-900/30 backdrop-blur-md border border-purple-700/50 rounded-lg max-w-md w-full p-6 pixel-border">
            <button
              onClick={() => setIsAddingSong(false)}
              className="absolute top-4 right-4 text-pink-400 hover:text-pink-300 p-1"
            >
              <X size={24} />
            </button>
  
            <h3 className="text-xl font-bold text-pink-300 mb-4">Add New Song</h3>
  
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-900/30 text-red-300 rounded-lg text-sm">
                {errorMessage}
              </div>
            )}
  
            <div className="space-y-4">
              <div>
                <label htmlFor="songFile" className="block text-sm text-pink-400 mb-1">
                  Choose Audio File
                </label>
                <input
                  ref={fileInputRef}
                  id="songFile"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="w-full bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500 file:bg-purple-900 file:text-pink-300 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3 file:hover:bg-purple-800"
                />
                {selectedFile && (
                  <p className="text-xs text-pink-400 mt-1">Selected: {selectedFile.name}</p>
                )}
              </div>
  
              <div>
                <label htmlFor="songName" className="block text-sm text-pink-400 mb-1">
                  Song Name
                </label>
                <input
                  id="songName"
                  type="text"
                  value={newSongName}
                  onChange={(e) => setNewSongName(e.target.value)}
                  className="w-full bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Enter song name..."
                />
              </div>
  
              <div>
                <label htmlFor="songArtist" className="block text-sm text-pink-400 mb-1">
                  Artist
                </label>
                <input
                  id="songArtist"
                  type="text"
                  value={newSongArtist}
                  onChange={(e) => setNewSongArtist(e.target.value)}
                  className="w-full bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Enter artist name..."
                />
              </div>
  
              <button
                onClick={handleAddSong}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-800/50 text-pink-300 rounded hover:bg-purple-700/50 transition-colors mt-2"
              >
                <Plus size={18} />
                <span>Add Song</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}