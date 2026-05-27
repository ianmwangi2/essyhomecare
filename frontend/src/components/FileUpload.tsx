import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import apiClient from '@/lib/api'

interface FileUploadProps {
  onUploadSuccess?: (result: UploadResult) => void
  onUploadError?: (error: string) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
}

interface UploadResult {
  success: boolean
  path: string
  publicUrl: string
  filename: string
  size: number
  type: string
}

export default function FileUpload({
  onUploadSuccess,
  onUploadError,
  accept = '.pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt',
  maxSize = 10 * 1024 * 1024,
  multiple = false,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = async (file: File) => {
    setError('')
    setLoading(true)
    setProgress(0)

    try {
      if (file.size > maxSize) {
        throw new Error(`File size exceeds ${(maxSize / (1024 * 1024)).toFixed(1)}MB limit`)
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ]

      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type not allowed: ${file.type}`)
      }

      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post('/api/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            setProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total))
          }
        },
      })

      if (response.data.success) {
        onUploadSuccess?.(response.data)
      } else {
        throw new Error(response.data.error || 'Upload failed')
      }
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Upload failed'
      setError(message)
      onUploadError?.(message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const filesToUpload = multiple ? Array.from(files) : [files[0]]
    for (const file of filesToUpload) {
      await uploadFile(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const files = event.dataTransfer.files
    if (!files || files.length === 0) return

    const filesToUpload = multiple ? Array.from(files) : [files[0]]
    for (const file of filesToUpload) {
      await uploadFile(file)
    }
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault()
          event.stopPropagation()
        }}
        className="border-2 border-dashed border-light-gray rounded-lg p-8 text-center bg-white hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />

        <label htmlFor="file-upload" className="cursor-pointer block">
          <div className="text-4xl mb-2">📁</div>
          <p className="text-primary font-semibold mb-1">Drop file here or click to upload</p>
          <p className="text-text-muted text-sm">
            Supported: PDF, Images, Word Docs, Text files
            <br />
            Max size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
          </p>
        </label>
      </div>

      {loading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full"></div>
          Uploading {progress}%...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
