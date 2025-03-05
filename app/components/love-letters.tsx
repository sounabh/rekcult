"use client"

import { useState, useEffect } from "react"
import { PenSquare, Save, Trash, Plus } from "lucide-react"

// Sample letters for demonstration
const SAMPLE_LETTERS = [
  {
    id: "1",
    title: "When We First Met",
    content:
      "I still remember the first time I saw you. Time seemed to slow down, and in that moment, I knew you were someone special. Your smile lit up the room, and I couldn't take my eyes off you...",
    date: "2023-02-14",
  },
  {
    id: "2",
    title: "Our First Anniversary",
    content:
      "One year together, and what a beautiful journey it has been. Through all the ups and downs, your love has been my constant. I cherish every moment we've shared, every laugh, every tear...",
    date: "2023-06-20",
  },
]

export default function LoveLetters() {
  // Load letters from localStorage or use samples
  const [letters, setLetters] = useState<
    Array<{
      id: string
      title: string
      content: string
      date: string
    }>
  >([])

  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editDate, setEditDate] = useState("")

  // Load letters from localStorage on component mount
  useEffect(() => {
    const savedLetters = localStorage.getItem("loveLetters")
    if (savedLetters) {
      setLetters(JSON.parse(savedLetters))
    } else {
      // Use sample letters for first-time users
      setLetters(SAMPLE_LETTERS)
      localStorage.setItem("loveLetters", JSON.stringify(SAMPLE_LETTERS))
    }
  }, [])

  // Save letters to localStorage when they change
  useEffect(() => {
    if (letters.length > 0) {
      localStorage.setItem("loveLetters", JSON.stringify(letters))
    }
  }, [letters])

  // Start editing a letter
  const handleEdit = (id: string) => {
    const letter = letters.find((l) => l.id === id)
    if (letter) {
      setEditTitle(letter.title)
      setEditContent(letter.content)
      setEditDate(letter.date)
      setIsEditing(true)
      setSelectedLetter(id)
    }
  }

  // Create a new letter
  const handleNew = () => {
    const newId = Date.now().toString()
    setEditTitle("")
    setEditContent("")
    setEditDate(new Date().toISOString().split("T")[0])
    setIsEditing(true)
    setSelectedLetter(newId)
  }

  // Save the current letter
  const handleSave = () => {
    if (selectedLetter) {
      const existingIndex = letters.findIndex((l) => l.id === selectedLetter)
      const updatedLetter = {
        id: selectedLetter,
        title: editTitle,
        content: editContent,
        date: editDate,
      }

      if (existingIndex >= 0) {
        // Update existing letter
        const updatedLetters = [...letters]
        updatedLetters[existingIndex] = updatedLetter
        setLetters(updatedLetters)
      } else {
        // Add new letter
        setLetters([...letters, updatedLetter])
      }

      setIsEditing(false)
      setSelectedLetter(null)
    }
  }

  // Delete a letter
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this letter?")) {
      setLetters(letters.filter((l) => l.id !== id))
      if (selectedLetter === id) {
        setSelectedLetter(null)
        setIsEditing(false)
      }
    }
  }

  // View a letter
  const handleView = (id: string) => {
    setSelectedLetter(id)
    setIsEditing(false)
  }

  // Get the currently selected letter
  const currentLetter = selectedLetter ? letters.find((l) => l.id === selectedLetter) : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text">
            Love Letters
          </h2>
          <button
            onClick={handleNew}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-900/50 text-pink-300 rounded hover:bg-purple-800/50 transition-colors neon-box"
          >
            <Plus size={18} />
            <span>New Letter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Letters list */}
          <div className="md:col-span-1 bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black">
            <h3 className="text-xl font-bold mb-4 text-pink-300">Your Letters</h3>

            {letters.length === 0 ? (
              <p className="text-pink-300/70 text-center py-8">No letters yet. Create your first love letter!</p>
            ) : (
              <div className="space-y-3">
                {letters.map((letter) => (
                  <div
                    key={letter.id}
                    onClick={() => handleView(letter.id)}
                    className={`cursor-pointer p-3 rounded transition-all ${
                      selectedLetter === letter.id
                        ? "bg-purple-800/50 neon-box"
                        : "bg-purple-900/40 hover:bg-purple-800/30"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-pink-300 mb-1">{letter.title}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(letter.id)
                        }}
                        className="text-pink-400 hover:text-pink-300 p-1"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-pink-400">{letter.date}</p>
                    <p className="text-sm text-pink-300/70 mt-1 line-clamp-2">{letter.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Letter content */}
          <div className="md:col-span-2 bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 h-[500px] flex flex-col">
            {!selectedLetter && !isEditing ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <PenSquare className="w-16 h-16 text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold text-pink-300 mb-2">Your Digital Love Letters</h3>
                <p className="text-pink-300/70 max-w-md">
                  Write heartfelt messages to express your feelings. Select a letter from the list or create a new one.
                </p>
              </div>
            ) : isEditing ? (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-pink-300">
                    {selectedLetter && letters.some((l) => l.id === selectedLetter) ? "Edit Letter" : "New Letter"}
                  </h3>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-purple-800/50 text-pink-300 rounded hover:bg-purple-700/50 transition-colors"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </button>
                </div>

                <div className="space-y-4 flex-1 flex flex-col">
                  <div>
                    <label htmlFor="title" className="block text-sm text-pink-400 mb-1">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                      placeholder="Letter title..."
                    />
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm text-pink-400 mb-1">
                      Date
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="content" className="block text-sm text-pink-400 mb-1">
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-[280px] bg-black/50 border border-purple-700/50 rounded p-2 text-pink-200 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                      placeholder="Write your love letter here..."
                    />
                  </div>
                </div>
              </div>
            ) : currentLetter ? (
              <div className="flex-1 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-pink-300">{currentLetter.title}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(currentLetter.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-purple-800/50 text-pink-300 rounded hover:bg-purple-700/50 transition-colors"
                    >
                      <PenSquare size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(currentLetter.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-900/50 text-pink-300 rounded hover:bg-red-800/50 transition-colors"
                    >
                      <Trash size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="mb-2 text-sm text-pink-400">{currentLetter.date}</div>

                <div className="flex-1 overflow-y-auto p-4 bg-black/30 rounded scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black">
                  <p className="whitespace-pre-line text-pink-200 leading-relaxed">{currentLetter.content}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

