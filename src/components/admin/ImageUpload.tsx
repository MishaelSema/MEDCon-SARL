'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader, Image as ImageIcon } from 'lucide-react'

interface UploadComponentProps {
  value: string
  onChange: (url: string) => void
  onRemove?: () => void
  folder?: string
}

export default function ImageUpload({ value, onChange, onRemove, folder = 'medcon-sarl' }: UploadComponentProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      
      if (data.success) {
        onChange(data.url)
      } else {
        alert('Upload failed: ' + data.error)
      }
    } catch (error) {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }

  if (value) {
    return (
      <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden border-2 border-deep-space-blue-200">
        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 flex gap-2">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full h-48 border-2 border-dashed rounded-xl transition-colors cursor-pointer ${
        dragOver ? 'border-deep-space-blue-500 bg-deep-space-blue-50' : 'border-gray-300 hover:border-deep-space-blue-400'
      }`}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      
      {uploading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader className="w-8 h-8 animate-spin text-deep-space-blue-600" />
          <span className="ml-2 text-gray-600">Uploading...</span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
          {dragOver ? (
            <>
              <ImageIcon className="w-10 h-10 mb-2 text-deep-space-blue-500" />
              <p className="font-medium text-deep-space-blue-600">Drop image here</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 mb-2" />
              <p className="font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}