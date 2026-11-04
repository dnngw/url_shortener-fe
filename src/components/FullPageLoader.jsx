import { LoaderCircle } from 'lucide-react'

function FullPageLoader() {
  return (
    <div className="flex min-h-[50svh] items-center justify-center text-muted-foreground">
      <LoaderCircle className="size-6 animate-spin" />
    </div>
  )
}

export default FullPageLoader
