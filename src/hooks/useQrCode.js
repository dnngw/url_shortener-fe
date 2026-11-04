import { useEffect, useState } from 'react'
import { qrService } from '@/services/qrService'

/*
* Generate QR code image for an url
*
* QR endpoint needs Bearer token, so the image is fetched as Blob
* then shown with an object URL (blob:...). The object URL is revoked when
* the url changes or the component unmounts, to avoid memory leak.
*
* Return { imageUrl, error, isLoading }
* */
export function useQrCode(url) {
  const [result, setResult] = useState({ url: null, imageUrl: null, error: null })

  useEffect(() => {
    if (!url) return

    let ignore = false
    let objectUrl = null

    qrService
      .generate(url)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob)
        if (!ignore) setResult({ url, imageUrl: objectUrl, error: null })
      })
      .catch((error) => {
        if (!ignore) setResult({ url, imageUrl: null, error })
      })

    return () => {
      ignore = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [url])

  // Result of another url is not shown (ex: still loading the new one)
  const isCurrent = result.url === url

  return {
    imageUrl: isCurrent ? result.imageUrl : null,
    error: isCurrent ? result.error : null,
    isLoading: !!url && !isCurrent,
  }
}
