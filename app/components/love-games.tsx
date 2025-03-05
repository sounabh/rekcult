/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw } from "lucide-react"

export default function LoveGames() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 neon-text text-center mb-8">
          Love Games
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <MemoryGame />
          <LoveQuiz />
        </div>
      </div>
    </div>
  )
}

// Memory Game Component
function MemoryGame() {
  const [cards, setCards] = useState<
    Array<{
      id: number
      emoji: string
      isFlipped: boolean
      isMatched: boolean
    }>
  >([])

  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  // Check for win condition
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.isMatched)) {
      setIsWon(true)
    }
  }, [cards])

  // Check for matches when two cards are flipped
// In the useEffect that checks for matches:
useEffect(() => {
  if (flippedCards.length === 2) {
    const [firstIndex, secondIndex] = flippedCards;

    if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
      // Match found
      setCards((prevCards) =>
        prevCards.map((card, index) =>
          index === firstIndex || index === secondIndex ? { ...card, isMatched: true } : card
        )
      );
    } else {
      // No match - need to flip cards back
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === firstIndex || index === secondIndex && !card.isMatched 
              ? { ...card, isFlipped: false } 
              : card
          )
        );
      }, 1000);
    }

    // Reset flipped cards after a delay
    const timer = setTimeout(() => {
      setFlippedCards([]);
    }, 1000);

    return () => clearTimeout(timer);
  }
}, [flippedCards, cards]);
  // Initialize game with shuffled cards
  const initializeGame = () => {
    const emojis = ["❤️", "💖", "💘", "💝", "💕", "💓", "💗", "💞"]
    const cardPairs = [...emojis, ...emojis]

    // Shuffle cards
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
  }

  // Handle card click
  const handleCardClick = (index: number) => {
    // Ignore if card is already flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) {
      return
    }

    // Ignore if two cards are already flipped
    if (flippedCards.length === 2) {
      return
    }

    // Flip the card
    setCards((prevCards) => prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, index])

    // Increment moves if this is the second card
    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1)
    }
  }

  return (
    <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 pixel-border">
      <h3 className="text-xl font-bold text-pink-300 mb-4 text-center">Match the Hearts</h3>

      <div className="flex justify-between items-center mb-4">
        <p className="text-pink-400">Moves: {moves}</p>
        <button
          onClick={initializeGame}
          className="flex items-center space-x-1 px-3 py-1.5 bg-purple-800/50 text-pink-300 rounded hover:bg-purple-700/50 transition-colors"
        >
          <RefreshCw size={16} />
          <span>Restart</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 transform ${
              card.isFlipped || card.isMatched
                ? "bg-purple-800/50 rotate-0"
                : "bg-purple-900/70 hover:bg-purple-800/70 rotate-3"
            } ${card.isMatched ? "neon-box" : ""}`}
          >
            <span className="text-2xl">{card.isFlipped || card.isMatched ? card.emoji : "?"}</span>
          </div>
        ))}
      </div>

      {isWon && (
        <div className="mt-4 p-3 bg-pink-900/30 rounded-lg text-center">
          <p className="text-pink-300 font-bold">You won in {moves} moves! 🎉</p>
        </div>
      )}
    </div>
  )
}

// Love Quiz Component
function LoveQuiz() {
  const [questions, setQuestions] = useState<
    Array<{
      id: number
      question: string
      options: string[]
      correctAnswer: number
    }>
  >([
    {
      id: 1,
      question: "Where Did We first Meet Irl?",
      options: ["Amer Fort", "Hawa Mahal", "Nico Park", "DumDum"],
      correctAnswer: 1, // This should be customized
    },
    {
      id: 2,
      question: "Whats my Fav Food?",
      options: ["Coffee", "Pizza", "Biriyani", "Chinese"],
      correctAnswer: 2, // This should be customized
    },
    {
      id: 3,
      question: "What's Your favorite color?",
      options: ["Blue", "Red", "Green", "Purple"],
      correctAnswer: 3, // This should be customized
    },
    {
      id: 4,
      question: "What's our fav Memory?",
      options: ["Insta", "Jaipur Trip", "Zoom", "Games"],
      correctAnswer: 1, // This should be customized
    },
  ])

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [feedback, setFeedback] = useState("")

  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex)

    // Check if answer is correct
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setFeedback("Correct! ❤️")
      setScore((prev) => prev + 1)
    } else {
      setFeedback("Not quite! 💔")
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedOption(null)
        setFeedback("")
      } else {
        setIsFinished(true)
      }
    }, 1500)
  }

  // Restart quiz
  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setIsFinished(false)
    setFeedback("")
  }

  return (
    <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 pixel-border">
      <h3 className="text-xl font-bold text-pink-300 mb-4 text-center">Love Quiz</h3>

      {!isFinished ? (
        <div>
          <div className="mb-4">
            <p className="text-pink-400 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <div className="w-full bg-purple-900/50 h-2 rounded-full mt-1">
              <div
                className="bg-pink-500 h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-pink-300 mb-3">{questions[currentQuestion].question}</h4>

            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectedOption === null && handleOptionSelect(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedOption === index
                      ? selectedOption === questions[currentQuestion].correctAnswer
                        ? "bg-green-800/50 text-green-300"
                        : "bg-red-900/50 text-red-300"
                      : "bg-purple-900/50 hover:bg-purple-800/50 text-pink-300"
                  }`}
                  disabled={selectedOption !== null}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className="text-center p-2 animate-pulse">
              <p className="text-lg font-bold">{feedback}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="mb-4">
            <Heart className="w-16 h-16 text-pink-500 mx-auto" fill="currentColor" />
          </div>

          <h4 className="text-xl font-bold text-pink-300 mb-2">Quiz Complete!</h4>

          <p className="text-pink-400 mb-4">
            You scored {score} out of {questions.length}
          </p>

          {score === questions.length ? (
            <p className="text-green-300 mb-4">Perfect score! You know me so well! ❤️</p>
          ) : score >= questions.length / 2 ? (
            <p className="text-pink-300 mb-4">Not bad! We're definitely on the same page! 💕</p>
          ) : (
            <p className="text-pink-400 mb-4">Looks like we have more to learn about each other! 💌</p>
          )}

          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-800/50 text-pink-300 rounded hover:bg-purple-700/50 transition-colors"
          >
            <RefreshCw size={18} />
            <span>Play Again</span>
          </button>
        </div>
      )}

      <p className="text-xs text-pink-400/70 text-center mt-4">Customize these questions with your own memories!</p>
    </div>
  )
}

