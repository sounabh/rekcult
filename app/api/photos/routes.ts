import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false,
  },
}

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS and method handling
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // GET: Fetch all photos
  if (req.method === 'GET') {
    try {
      const photos = await prisma.photo.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(photos)
    } catch (error) {
      console.error('Error fetching photos:', error)
      return res.status(500).json({ message: 'Failed to fetch photos' })
    }
  }

  // POST: Upload a photo
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
    })

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Form parse error:', err)
          return res.status(500).json({ message: 'File upload failed' })
        }

        const file = files.file as unknown as formidable.File
        const caption = fields.caption as unknown as string

        if (!file || !caption) {
          return res.status(400).json({ message: 'Missing file or caption' })
        }

        try {
          // Generate a unique filename
          const filename = `${uuidv4()}-${file.originalFilename}`
          const newPath = path.join(uploadDir, filename)
          
          // Move file to public uploads directory
          fs.renameSync(file.filepath, newPath)

          // Save to database
          const photo = await prisma.photo.create({
            data: {
              caption,
              ImageFile: `/uploads/${filename}`,
            }
          })

          res.status(200).json(photo)
          resolve(photo)
        } catch (error) {
          console.error('Upload error:', error)
          res.status(500).json({ message: 'Error processing upload' })
          reject(error)
        }
      })
    })
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}