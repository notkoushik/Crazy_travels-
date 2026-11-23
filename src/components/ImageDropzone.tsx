import React, { useState, useRef } from 'react'
import { Icon } from './Icon'

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  aspectRatio?: string
  helperText?: string
}

export function ImageDropzone({
  value,
  onChange,
  label = 'Cover Photo Image',
  placeholder = 'https://images.unsplash.com/...',
  aspectRatio = 'aspect-16/10',
  helperText = 'Drop high-res JPG, PNG, or WebP photo directly from your device (Max 15MB).',
}: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadFile = async (file: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WebP).')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`)
      }

      const data = await res.json()
      if (data.url) {
        onChange(data.url)
      } else {
        throw new Error('Server did not return a valid file URL')
      }
    } catch (err: any) {
      console.error('File upload failed:', err)
      setUploadError(err.message || 'Failed to upload photo from device')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="space-y-2 font-inter">
      <div className="flex items-center justify-between">
        <label className="block text-slate-700 font-semibold text-xs font-inter-tight">
          {label}
        </label>
        <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-0.5 rounded-md">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              inputMode === 'upload'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Device Upload
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              inputMode === 'url'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
        <div className="space-y-2">
          {/* Dropzone Container */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer p-4 flex flex-col items-center justify-center text-center overflow-hidden ${
              isDragging
                ? 'border-slate-900 bg-slate-100/80 scale-[0.99]'
                : value
                ? 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                : 'border-slate-300 bg-slate-50/80 hover:bg-slate-100/60 hover:border-slate-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUploadFile(e.target.files[0])
                }
              }}
            />

            {value ? (
              <div className="w-full flex items-center gap-4 text-left">
                <div
                  className={`w-28 ${aspectRatio} rounded-lg overflow-hidden border border-slate-200/80 shadow-2xs flex-none bg-slate-100 relative`}
                >
                  <img
                    src={value}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if local image or URL breaks
                      ;(e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80'
                    }}
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-2xs flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 truncate">
                      {value.startsWith('/uploads/') ? value.replace('/uploads/', '') : 'Custom Image'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Uploaded
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{value}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-[11px] transition-colors shadow-2xs"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onChange('')
                      }}
                      className="px-2 py-1 rounded-md text-slate-400 hover:text-rose-600 font-medium text-[11px] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 mx-auto">
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon name="camera" size={18} />
                  )}
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-800">
                    {isUploading ? 'Uploading file from device...' : 'Click to upload or drag & drop'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
              <Icon name="x" size={12} /> {uploadError}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-mono"
          />
          <p className="text-[11px] text-slate-400">Paste external CDN or Unsplash photo link directly.</p>
        </div>
      )}
    </div>
  )
}
