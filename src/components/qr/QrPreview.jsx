import { Download, QrCode } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useQrCode } from '@/hooks/useQrCode'

/*
* QR Preview
*
* Show QR image of the url + download button
* */
function QrPreview({ url, fileName = 'qrcode' }) {
  const { imageUrl, error, isLoading } = useQrCode(url)

  if (!url) {
    return (
      <div className="flex aspect-square w-full max-w-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground">
        <QrCode className="size-8" />
        Your QR code will appear here
      </div>
    )
  }

  if (isLoading) {
    return <Skeleton className="aspect-square w-full max-w-64 rounded-xl" />
  }

  if (error) {
    return (
      <div className="flex aspect-square w-full max-w-64 items-center justify-center rounded-xl border border-dashed p-4 text-center text-sm text-destructive">
        {error.message}
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-64 flex-col gap-3">
      <img
        src={imageUrl}
        alt={`QR code for ${url}`}
        className="aspect-square w-full rounded-xl border bg-white p-2"
      />
      <a href={imageUrl} download={`${fileName}.png`} className={buttonVariants({ variant: 'outline' })}>
        <Download />
        Download PNG
      </a>
    </div>
  )
}

export default QrPreview
