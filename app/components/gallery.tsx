/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { ImagePlus, Trash2 } from "lucide-react"

// Photo interface
interface Photo {
  id: string
  caption: string
  dataUrl: string
  createdAt: Date
}

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [caption, setCaption] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // IndexedDB Setup
  useEffect(() => {
    const initIndexedDB = async () => {
      const indexedDB = window.indexedDB
      const request = indexedDB.open("PhotoGalleryDB", 1)

      request.onupgradeneeded = (event) => {
        const db = request.result
        if (!db.objectStoreNames.contains('photos')) {
          db.createObjectStore('photos', { keyPath: 'id' })
        }
      }

      request.onsuccess = async () => {
        const db = request.result
        await loadPhotosFromIndexedDB(db)
      }

      request.onerror = (event) => {
        console.error("IndexedDB error:", event)
        setError("Failed to initialize photo storage")
      }
    }

    initIndexedDB()
  }, [])

  // Load photos from IndexedDB
  const loadPhotosFromIndexedDB = (db: IDBDatabase) => {
    return new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(['photos'], 'readonly')
      const store = transaction.objectStore('photos')
      const request = store.getAll()

      request.onsuccess = () => {
        setPhotos(request.result)
        resolve()
      }

      request.onerror = () => {
        console.error("Error loading photos")
        reject()
      }
    })
  }

  // Save photo to IndexedDB
  const savePhotoToIndexedDB = (photo: Photo) => {
    return new Promise<void>((resolve, reject) => {
      const indexedDB = window.indexedDB
      const request = indexedDB.open("PhotoGalleryDB", 1)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['photos'], 'readwrite')
        const store = transaction.objectStore('photos')
        const addRequest = store.add(photo)

        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject()
      }

      request.onerror = () => reject()
    })
  }

  // Delete photo from IndexedDB
  const deletePhotoFromIndexedDB = (photoId: string) => {
    return new Promise<void>((resolve, reject) => {
      const indexedDB = window.indexedDB
      const request = indexedDB.open("PhotoGalleryDB", 1)

      request.onsuccess = () => {
        const db = request.result
        const transaction = db.transaction(['photos'], 'readwrite')
        const store = transaction.objectStore('photos')
        const deleteRequest = store.delete(photoId)

        deleteRequest.onsuccess = () => resolve()
        deleteRequest.onerror = () => reject()
      }

      request.onerror = () => reject()
    })
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  // Convert file to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  // Upload photo
  const handleUpload = async () => {
    // Validate inputs
    if (!selectedFile) {
      setError("Please select an image")
      return
    }
    if (!caption.trim()) {
      setError("Please add a caption")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert file to base64
      const dataUrl = await convertToBase64(selectedFile)
      
      // Create new photo object
      const newPhoto: Photo = {
        id: `photo-${Date.now()}`,
        caption,
        dataUrl,
        createdAt: new Date()
      }
      
      // Save to IndexedDB
      await savePhotoToIndexedDB(newPhoto)
      
      // Update photos list
      setPhotos(prevPhotos => [newPhoto, ...prevPhotos])
      
      // Reset form
      setSelectedFile(null)
      setCaption("")
      
      // Clear file input
      const fileInput = document.getElementById('fileInput') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error) {
      console.error("Upload error:", error)
      setError("Failed to upload photo")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete photo
  const handleDeletePhoto = async (id: string) => {
    try {
      // Delete from IndexedDB
      await deletePhotoFromIndexedDB(id)
      
      // Update local state
      setPhotos(prevPhotos => prevPhotos.filter(photo => photo.id !== id))
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete photo")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          Photo Gallery
        </h2>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="fileInput" className="block text-sm text-gray-300 mb-2">
                Upload Image
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full bg-gray-900/50 border border-gray-700/50 rounded p-2 text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-purple-500/50 file:text-gray-200"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="caption" className="block text-sm text-gray-300 mb-2">
                Caption
              </label>
              <input
                id="caption"
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter photo caption"
                className="w-full bg-gray-900/50 border border-gray-700/50 rounded p-2 text-gray-200"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-700/50 text-white rounded hover:bg-purple-600/50 transition-colors disabled:opacity-50"
              >
                <ImagePlus size={18} />
                <span>{isLoading ? "Uploading..." : "Upload"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden group"
            >
              <button 
                onClick={() => handleDeletePhoto(photo.id)}
                className="absolute top-2 right-2 z-10 bg-red-500/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <img 
                src={photo.dataUrl} 
                alt={photo.caption} 
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <p className="text-sm text-gray-300 truncate">{photo.caption}</p>
                <p className="text-xs text-gray-500">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && photos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ImagePlus className="mx-auto mb-4 w-16 h-16 text-gray-600" />
            <p>No photos yet. Upload your first photo!</p>
          </div>
        )}
      </div>
    </div>
  )
}