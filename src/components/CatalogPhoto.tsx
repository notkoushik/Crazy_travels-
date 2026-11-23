import { useState, type ImgHTMLAttributes } from 'react'
import { Icon } from './Icon'

export function CatalogPhoto({
  src,
  alt,
  className = '',
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState<string>()

  if (!src || failed === src) {
    return (
      <div
        role="img"
        aria-label={alt ? `Photo unavailable for ${alt}` : 'Photo unavailable'}
        className={`catalog-photo-placeholder ${className}`}
      >
        <Icon name="camera" size={25} />
      </div>
    )
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setFailed(src)
        onError?.(event)
      }}
    />
  )
}
