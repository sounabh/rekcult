'use server'

import { prisma } from "../prismaConfig"
import { revalidatePath } from 'next/cache'

// Get all songs
export async function getSongs() {
  try {
    return await prisma.song.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch songs:', error)
    throw new Error('Unable to fetch songs')
  }
}

// Create a new song
export async function createSong(data: {
  name: string
  artist?: string
  audioFile: string
}) {
  try {
    const song = await prisma.song.create({
      data: {
        name: data.name,
        artist: data.artist || 'Unknown Artist',
        audioFile: data.audioFile
      }
    })
    
    // Revalidate the path to update cache
    revalidatePath('/') 
    
    return song
  } catch (error) {
    console.error('Failed to create song:', error)
    throw new Error('Unable to create song')
  }
}

// Delete a song
export async function deleteSong(id: string) {
  try {
    await prisma.song.delete({
      where: { id }
    })
    
    // Revalidate the path to update cache
    revalidatePath('/')
  } catch (error) {
    console.error('Failed to delete song:', error)
    throw new Error('Unable to delete song')
  }
}

// Update a song (optional)
export async function updateSong(id: string, data: {
  name?: string
  artist?: string
  audioFile?: string
}) {
  try {
    const updatedSong = await prisma.song.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.artist && { artist: data.artist }),
        ...(data.audioFile && { audioFile: data.audioFile })
      }
    })
    
    revalidatePath('/')
    return updatedSong
  } catch (error) {
    console.error('Failed to update song:', error)
    throw new Error('Unable to update song')
  }
}