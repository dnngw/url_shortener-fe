import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import QrPreview from '@/components/qr/QrPreview'
import { displayUrl, getShortUrl } from '@/lib/format'

function QrLinkDialog({ open, onOpenChange, link }) {
  const shortUrl = link ? getShortUrl(link.shortCode) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>QR code</DialogTitle>
          <DialogDescription className="break-all">{shortUrl && displayUrl(shortUrl)}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {/* Dialog content is unmounted when closed, so the QR is only fetched while open */}
          <QrPreview url={shortUrl} fileName={`qrcode-${link?.shortCode}`} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QrLinkDialog
