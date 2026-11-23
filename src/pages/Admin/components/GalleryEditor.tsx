import { useRef, useState } from 'react'
import { CatalogPhoto } from '../../../components/CatalogPhoto'
import { Icon } from '../../../components/Icon'
import { catalogPhotoAccept, uploadCatalogPhoto, validatePhotoLink } from '../../../components/ImageDropzone'
import { catalogPhotoUrls } from '../../../data/catalogPhotos'

export function GalleryEditor({
  cover,
  value,
  onChange,
  onBusyChange,
}: {
  cover: string
  value: string[]
  onChange: (photos: string[]) => void
  onBusyChange: (busy: boolean) => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const pending = useRef(false)
  const [url, setUrl] = useState('')
  const [progress, setProgress] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const busy = !!progress

  const addPhotos = async (files?: File[]) => {
    if (pending.current) return
    pending.current = true
    onBusyChange(true)
    setErrors([])
    const added: string[] = []
    const failures: string[] = []
    try {
      if (files?.length) {
        for (const [index, file] of files.entries()) {
          setProgress(`Uploading photo ${index + 1} of ${files.length}…`)
          try {
            added.push(await uploadCatalogPhoto(file))
          } catch (error) {
            failures.push(`${file.name}: ${error instanceof Error ? error.message : 'Upload failed.'}`)
          }
        }
      } else {
        setProgress('Checking photo link…')
        added.push(await validatePhotoLink(url))
        setUrl('')
      }
      const existing = catalogPhotoUrls(cover, value)
      const next = catalogPhotoUrls(cover, [...value, ...added])
      const additions = next.filter((photo) => !existing.includes(photo))
      if (additions.length) onChange([...value, ...additions])
      if (added.length > additions.length) failures.push('Some of these photos are already in the gallery or set as the cover.')
    } catch (error) {
      failures.push(error instanceof Error ? error.message : 'The photo could not be added.')
    } finally {
      pending.current = false
      setProgress('')
      setErrors(failures)
      onBusyChange(false)
    }
  }

  const movePhoto = (index: number, offset: number) => {
    const next = [...value]
    const target = index + offset
    next[index] = value[target]
    next[target] = value[index]
    onChange(next)
  }

  return (
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-medium text-slate-800">Gallery photos</legend>
      <p className="text-xs text-slate-600">Photos appear in this order after the cover on the customer page.</p>
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={catalogPhotoAccept}
          aria-label="Choose gallery files"
          hidden
          onChange={(event) => {
            const files = Array.from(event.currentTarget.files ?? [])
            event.currentTarget.value = ''
            if (files.length) void addPhotos(files)
          }}
        />
        <button type="button" disabled={busy} onClick={() => fileInput.current?.click()} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
          Upload photos
        </button>
        <input
          type="text"
          inputMode="url"
          aria-label="Gallery photo URL"
          placeholder="https://example.com/photo.jpg"
          value={url}
          disabled={busy}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter') return
            event.preventDefault()
            if (url.trim()) void addPhotos()
          }}
          className="min-w-0 flex-[1_1_160px] rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-2 focus:outline-emerald-800"
        />
        <button type="button" disabled={busy || !url.trim()} onClick={() => void addPhotos()} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-800 disabled:opacity-50">
          Add URL
        </button>
      </div>
      {progress && <p role="status" className="text-xs text-slate-700">{progress}</p>}
      {!!errors.length && (
        <ul role="alert" className="space-y-1 text-xs text-rose-700">
          {errors.map((error, index) => <li key={index}>{error}</li>)}
        </ul>
      )}
      {!!value.length && (
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {value.map((photo, index) => (
            <li key={`${photo}-${index}`} className="overflow-hidden rounded-xl border border-slate-200">
              <CatalogPhoto src={photo} alt={`Gallery photo ${index + 1}`} loading="lazy" className="aspect-16/10 w-full object-cover" />
              <div className="flex items-center justify-between gap-1 px-2 py-1.5">
                <span className="text-xs font-semibold text-slate-700">Photo {index + 1}</span>
                <div className="flex gap-1 [&>button]:grid [&>button]:size-8 [&>button]:place-items-center [&>button]:rounded-md [&>button]:hover:bg-slate-100 [&>button]:disabled:opacity-40">
                  <button type="button" aria-label={`Move photo ${index + 1} earlier`} disabled={busy || index === 0} onClick={() => movePhoto(index, -1)}>
                    <Icon name="chevron" size={16} className="rotate-180" />
                  </button>
                  <button type="button" aria-label={`Move photo ${index + 1} later`} disabled={busy || index === value.length - 1} onClick={() => movePhoto(index, 1)}>
                    <Icon name="chevron" size={16} />
                  </button>
                  <button type="button" aria-label={`Remove photo ${index + 1}`} disabled={busy} onClick={() => onChange(value.filter((_, i) => i !== index))}>
                    <Icon name="x" size={17} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </fieldset>
  )
}
