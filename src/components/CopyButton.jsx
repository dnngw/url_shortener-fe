import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/*
* Copy Button
*
* Copy text to clipboard, the icon turns into a check for a moment
* */
function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Link copied')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Button variant="ghost" size="icon-sm" onClick={handleCopy} aria-label={label} title={label}>
      {copied ? <Check /> : <Copy />}
    </Button>
  )
}

export default CopyButton
