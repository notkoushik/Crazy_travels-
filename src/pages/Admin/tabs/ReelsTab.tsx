import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Icon } from '../../../components/Icon'
import { CatalogPhoto } from '../../../components/CatalogPhoto'
import { ImageDropzone, validateCoverPhoto } from '../../../components/ImageDropzone'
import { getAdminAuthHeaders } from '../../../services/dataStore'
import type { InstagramReelItem } from '../../../types/travel'
import {
  Field,
  NumberField,
  TextArea,
  requiredNumber,
  requiredText,
  textValue,
} from '../components/InventoryEditor'

interface ReelsTabProps {
  reels: InstagramReelItem[]
  onSaveReel: (reel: InstagramReelItem) => Promise<void>
  onDeleteReel: (id: string) => Promise<void>
  onToast: (message: string) => void
}

const deleteUpload = (url: string) =>
  fetch(url, { method: 'DELETE', headers: getAdminAuthHeaders() }).catch(() => undefined)

async function reelResponse(response: Response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'The reel upload did not finish. Try again.')
  return data
}

async function videoDuration(file: File) {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'metadata'
  try {
    const duration = await new Promise<number>((resolve, reject) => {
      const fail = () => reject(new Error('Choose a video that plays in your browser.'))
      const timer = window.setTimeout(fail, 10000)
      video.onloadedmetadata = () => {
        window.clearTimeout(timer)
        resolve(video.duration)
      }
      video.onerror = () => {
        window.clearTimeout(timer)
        fail()
      }
      video.src = url
    })
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('Could not read the video duration.')
    const seconds = Math.ceil(duration)
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
  } finally {
    video.removeAttribute('src')
    URL.revokeObjectURL(url)
  }
}

export function ReelsTab({ reels, onSaveReel, onDeleteReel, onToast }: ReelsTabProps) {
  const [editor, setEditor] = useState<{ id: string; record?: InstagramReelItem }>()
  const [cover, setCover] = useState('')
  const [video, setVideo] = useState('')
  const [duration, setDuration] = useState('')
  const [uploading, setUploading] = useState<number>()
  const [uploadingCover, setUploadingCover] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const draftUpload = useRef<string | undefined>(undefined)
  const mounted = useRef(true)
  const busy = saving || uploading !== undefined || uploadingCover

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (draftUpload.current) void deleteUpload(draftUpload.current)
    }
  }, [])

  const discardUpload = () => {
    if (draftUpload.current) void deleteUpload(draftUpload.current)
    draftUpload.current = undefined
  }

  const openEditor = (record?: InstagramReelItem) => {
    discardUpload()
    setError('')
    setEditor({ id: record?.id ?? `reel-${crypto.randomUUID()}`, record })
    setCover(record?.posterUrl || '')
    setVideo(record?.videoUrl || '')
    setDuration(record?.duration || '')
  }

  const uploadVideo = async (file: File) => {
    setError('')
    if (!['video/mp4', 'video/webm'].includes(file.type) || !file.size || file.size > 60 * 1024 * 1024) {
      setError('Choose an MP4 or WebM video up to 60 MB.')
      return
    }
    setUploading(0)
    let url: string | undefined
    try {
      const length = await videoDuration(file)
      const session = await reelResponse(
        await fetch('/api/reel-videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAdminAuthHeaders() },
          body: JSON.stringify({ type: file.type, size: file.size }),
        })
      )
      if (typeof session.id !== 'string' || !Number.isInteger(session.chunkSize) || session.chunkSize <= 0) {
        throw new Error('The server did not return a valid upload session.')
      }
      url = `/api/reel-videos/${session.id}`
      for (let offset = 0; offset < file.size; offset += session.chunkSize) {
        const next = Math.min(offset + session.chunkSize, file.size)
        if (!mounted.current) throw new Error('Upload closed.')
        const response = await fetch(`${url}/${offset / session.chunkSize}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/octet-stream', ...getAdminAuthHeaders() },
          body: file.slice(offset, next),
        })
        if (!response.ok) await reelResponse(response)
        setUploading(Math.round((next / file.size) * 100))
      }
      await reelResponse(await fetch(`${url}/complete`, { method: 'POST', headers: getAdminAuthHeaders() }))
      if (!mounted.current) throw new Error('Upload closed.')
      discardUpload()
      draftUpload.current = url
      setVideo(url)
      setDuration(length)
    } catch (failure) {
      if (url) void deleteUpload(url)
      if (mounted.current)
        setError(failure instanceof Error ? failure.message : 'Could not upload the video.')
    } finally {
      if (mounted.current) setUploading(undefined)
    }
  }

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy || !editor) return
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setError('')
    try {
      const videoUrl = video.trim()
      if (!/^(?:https?:\/\/|\/(?!\/))\S+$/i.test(videoUrl))
        throw new Error('Upload a video or provide a direct video URL.')
      const durationValue = duration.trim()
      if (!/^\d{1,3}:[0-5]\d$/.test(durationValue)) throw new Error('Enter a duration such as 1:20.')
      await onSaveReel({
        id: editor.id,
        title: requiredText(form, 'title', 'Title'),
        place: requiredText(form, 'place', 'Destination'),
        customerName: requiredText(form, 'customerName', 'Customer name'),
        reviewQuote: requiredText(form, 'quote', 'Review quote'),
        rating: requiredNumber(form, 'rating', 'Rating', 1, 5),
        displayOrder: requiredNumber(form, 'displayOrder', 'Display order', 0),
        videoUrl,
        duration: durationValue,
        instagramUrl: textValue(form, 'instagramUrl'),
        posterUrl: await validateCoverPhoto(cover, editor.record?.posterUrl),
      })
      if (draftUpload.current === videoUrl) draftUpload.current = undefined
      discardUpload()
      setEditor(undefined)
      onToast('Reel saved.')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Could not save the reel.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (reel: InstagramReelItem) => {
    if (!window.confirm(`Remove “${reel.title}” from the customer site?`)) return
    setSaving(true)
    try {
      await onDeleteReel(reel.id)
      if (editor?.record?.id === reel.id) {
        discardUpload()
        setEditor(undefined)
      }
      onToast('Reel deleted.')
    } catch (failure) {
      onToast(failure instanceof Error ? failure.message : 'Could not delete the reel.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Customer reels</h1>
          <p className="mt-1 text-sm text-slate-600">Manage videos and reviews shown on the homepage.</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => openEditor()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#10493f] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Icon name="plus" size={16} /> Add reel
        </button>
      </header>
      {editor && (
        <form
          key={editor.id}
          onSubmit={save}
          className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
        >
          <h2 className="mb-4 text-lg font-bold text-slate-950">
            {editor.record ? 'Edit reel' : 'Add reel'}
          </h2>
          <fieldset disabled={busy} className="min-w-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Title"
                name="title"
                defaultValue={editor.record?.title}
                maxLength={255}
                required
              />
              <Field
                label="Destination"
                name="place"
                defaultValue={editor.record?.place}
                maxLength={120}
                required
              />
              <Field
                label="Customer name"
                name="customerName"
                defaultValue={editor.record?.customerName}
                maxLength={120}
                required
              />
              <NumberField
                label="Rating out of 5"
                name="rating"
                decimal
                pattern="[0-9]+([.,][0-9])?"
                defaultValue={editor.record?.rating}
                required
              />
              <NumberField
                label="Display order"
                name="displayOrder"
                defaultValue={
                  editor.record?.displayOrder ?? Math.max(-1, ...reels.map((reel) => reel.displayOrder)) + 1
                }
                required
              />
              <Field
                label="Duration"
                name="duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="0:45"
                required
              />
            </div>
            <TextArea
              label="Customer review quote"
              name="quote"
              defaultValue={editor.record?.reviewQuote}
              required
            />
            <Field
              label="Instagram URL"
              name="instagramUrl"
              type="url"
              defaultValue={editor.record?.instagramUrl}
            />
            <div className="grid gap-3 rounded-xl border border-slate-200 p-3">
              <label className="grid gap-1.5 text-sm font-medium text-slate-800">
                Upload reel video
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  className="max-w-full text-sm text-slate-600"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0]
                    event.currentTarget.value = ''
                    if (file) void uploadVideo(file)
                  }}
                />
              </label>
              <Field
                label="Direct video URL"
                name="videoUrl"
                value={video}
                onChange={(event) => setVideo(event.target.value)}
                placeholder="Upload from your device or enter a video URL"
                required
              />
              {video && (
                <video
                  key={video}
                  src={video}
                  preload="metadata"
                  controls
                  playsInline
                  className="max-h-56 w-full rounded-lg bg-black"
                />
              )}
            </div>
            <ImageDropzone
              label="Reel cover photo *"
              value={cover}
              onChange={setCover}
              onUploadingChange={setUploadingCover}
            />
          </fieldset>
          {uploading !== undefined && (
            <p role="status" className="mt-3 text-sm text-emerald-900">
              Uploading video… {uploading}%
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                discardUpload()
                setEditor(undefined)
              }}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-[#10493f] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save reel'}
            </button>
          </div>
        </form>
      )}
      {!reels.length && (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No reels are published.
        </p>
      )}
      <div className="grid gap-3 lg:grid-cols-2">
        {reels.map((reel) => (
          <article
            key={reel.id}
            className="flex min-w-0 gap-4 rounded-xl border border-slate-200 bg-white p-3"
          >
            <CatalogPhoto
              src={reel.posterUrl}
              alt={reel.title}
              className="h-24 w-16 shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-slate-900">{reel.title}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {reel.customerName} · {reel.place} · {reel.duration}
              </p>
              <div className="mt-2 flex gap-3 text-sm">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openEditor(reel)}
                  className="font-semibold text-emerald-900"
                >
                  Edit / replace
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(reel)}
                  className="font-semibold text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
