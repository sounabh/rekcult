/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"

// Define Upload Directory (`/public/uploads`)
const uploadDir = path.join(process.cwd(), "public/uploads")

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// API Route to Handle File Upload
export async function POST(req: NextRequest) {
  try {
    // Parse Form Data
    const formData = await req.formData()
    const file = formData.get("file") as Blob | null

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" })
    }

    // Convert Blob to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Generate Unique Filename
    const filename = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, filename)

    // Save File to `/public/uploads`
    await fs.promises.writeFile(filePath, buffer)

    // Return File URL (accessible via `/uploads/filename`)
    return NextResponse.json({ success: true, url: `/uploads/${filename}` })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "File upload failed" })
  }
}
