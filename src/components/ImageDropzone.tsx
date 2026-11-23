import { useId, useRef, useState, type DragEvent } from 'react'
import { getAdminAuthHeaders } from '../services/dataStore'
import { CatalogPhoto } from './CatalogPhoto'
import { Icon } from './Icon'

interface ImageDropzoneProps {
  value: string
  onChange: (url: string) => void
  onUploadingChange?: (uploading: boolean) => void
  label?: string
  placeholder?: string
  aspectRatio?: string
  helperText?: string
}

const maxUploadBytes = 4 * 1024 * 1024
const acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
export const catalogPhotoAccept = acceptedTypes.join(',')

async function loadPhoto(url: string) {
  const image = new Image()
  let timeout: number | undefined
  const deadline = new Promise<never>((_, reject) => {
    timeout = window.setTimeout(() => reject(new Error('The photo took too long to load.')), 12_000)
  })
  image.src = url
  try {
    await Promise.race([image.decode(), deadline])
    return image
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function validateCoverPhoto(value: string, previous?: string) {
  const url = value.trim()
  if (!url) throw new Error('Add a cover photo before saving.')
  if (url === previous?.trim()) return url
  return validatePhotoLink(url, 'The cover photo could not be opened. Choose a different photo or update its link.')
}

export async function validatePhotoLink(value: string, loadError = 'The photo could not be opened. Check its link and try again.') {
  const url = value.trim()
  if (!/^(https?:\/\/|\/(?!\/))/i.test(url))
    throw new Error('Enter a photo URL or upload an image from your device.')
  try {
    await loadPhoto(url)
    return url
  } catch {
    throw new Error(loadError)
  }
}

export async function uploadCatalogPhoto(file: File) {
  const photo = await prepareUpload(file)
  const form = new FormData()
  form.append('file', photo, photo === file ? file.name : 'catalog-photo.webp')
  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: getAdminAuthHeaders(),
    body: form,
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 || response.status === 403)
      throw new Error('Sign in to the admin console again before uploading.')
    throw new Error(result?.error || 'The upload did not finish. Try again.')
  }
  if (typeof result?.url !== 'string' || !result.url)
    throw new Error('The server did not return a photo link.')
  try {
    await loadPhoto(result.url)
  } catch {
    throw new Error('The uploaded photo could not be opened. Try uploading it again.')
  }
  return result.url as string
}

async function prepareUpload(file: File) {
  if (!acceptedTypes.includes(file.type)) throw new Error('Choose a JPEG, PNG, WebP, AVIF, or GIF photo.')
  if (file.size <= maxUploadBytes) return file
  if (file.type === 'image/gif') throw new Error('Choose a GIF that is 4 MB or smaller.')
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose a photo smaller than 15 MB.')

  const url = URL.createObjectURL(file)
  try {
    const photo = await loadPhoto(url)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('This browser couldn’t resize the photo.')
    for (const edge of [2048, 1536, 1080]) {
      const scale = Math.min(edge / Math.max(photo.naturalWidth, photo.naturalHeight), 1)
      canvas.width = Math.max(1, Math.round(photo.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(photo.naturalHeight * scale))
      context.drawImage(photo, 0, 0, canvas.width, canvas.height)
      const resized = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
      if (resized && resized.size <= maxUploadBytes) return resized
    }
    throw new Error('This photo is too large to upload. Choose a smaller copy.')
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function ImageDropzone({
  value,
  onChange,
  onUploadingChange,
  label = 'Cover photo',
  placeholder = 'https://example.com/photo.jpg',
  aspectRatio = 'aspect-16/10',
  helperText = 'Choose a photo or drop it here. Large photos are resized before upload.',
}: ImageDropzoneProps) {
  const fieldId = useId()
  const fileInput = useRef<HTMLInputElement>(null)
  const pending = useRef(false)
  const [mode, setMode] = useState<'device' | 'url'>('device')
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loadedUrl, setLoadedUrl] = useState<string>()
  const [failedUrl, setFailedUrl] = useState<string>()

  const uploadFile = async (file: File) => {
    if (pending.current) return
    pending.current = true
    setUploading(true)
    onUploadingChange?.(true)
    setError('')
    try {
      const url = await uploadCatalogPhoto(file)
      setLoadedUrl(url)
      setFailedUrl(undefined)
      onChange(url)
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'The photo could not be uploaded.')
    } finally {
      pending.current = false
      setUploading(false)
      onUploadingChange?.(false)
    }
  }

  const dropPhoto = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) void uploadFile(file)
  }

  return (
    <div className="space-y-2 font-inter">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor={mode === 'url' ? fieldId : `${fieldId}-file`}
          className="text-sm font-medium text-slate-800"
        >
          {label}
        </label>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs">
          <button
            type="button"
            aria-pressed={mode === 'device'}
            disabled={uploading}
            onClick={() => setMode('device')}
            className={`rounded-md px-2 py-1 ${mode === 'device' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
          >
            Device upload
          </button>
          <button
            type="button"
            aria-pressed={mode === 'url'}
            disabled={uploading}
            onClick={() => setMode('url')}
            className={`rounded-md px-2 py-1 ${mode === 'url' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'}`}
          >
            Image URL
          </button>
        </div>
      </div>

      <input
        id={`${fieldId}-file`}
        ref={fileInput}
        type="file"
        accept={catalogPhotoAccept}
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          event.currentTarget.value = ''
          if (file) void uploadFile(file)
        }}
      />

      {mode === 'url' && (
        <input
          id={fieldId}
          type="text"
          inputMode="url"
          value={value}
          onChange={(event) => {
            setError('')
            onChange(event.target.value)
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/15"
        />
      )}

      {(mode === 'device' || value) && (
        <div
          onDragOver={
            mode === 'device'
              ? (event) => {
                  event.preventDefault()
                  setDragging(true)
                }
              : undefined
          }
          onDragLeave={() => setDragging(false)}
          onDrop={mode === 'device' ? dropPhoto : undefined}
          className={`flex flex-wrap items-center gap-3 rounded-xl border border-dashed p-3 ${dragging ? 'border-emerald-700 bg-emerald-50' : 'border-slate-300 bg-slate-50'}`}
        >
          {value && (
            <CatalogPhoto
              src={value}
              alt="Cover photo preview"
              className={`w-24 shrink-0 rounded-lg object-cover ${aspectRatio}`}
              onLoad={() => {
                setLoadedUrl(value)
                setFailedUrl(undefined)
              }}
              onError={() => setFailedUrl(value)}
            />
          )}
          <div className="min-w-0 flex-1 text-sm">
            {uploading ? (
              <p role="status" className="font-medium text-slate-800">
                Uploading photo…
              </p>
            ) : value && failedUrl === value ? (
              <p role="status" className="font-medium text-amber-800">
                Photo unavailable. Choose a replacement or update the link.
              </p>
            ) : value && loadedUrl === value ? (
              <p role="status" className="font-medium text-emerald-800">
                Photo ready
              </p>
            ) : value ? (
              <p className="text-slate-600">Checking photo preview…</p>
            ) : (
              <p className="text-sm text-slate-600">{helperText}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {mode === 'device' && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInput.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 disabled:opacity-60"
                >
                  <Icon name="camera" size={14} /> {value ? 'Change photo' : 'Choose photo'}
                </button>
              )}
              {value && (
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => {
                    setError('')
                    onChange('')
                  }}
                  className="rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-xs font-medium text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
