import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/FormField'
import PageHeader from '@/components/PageHeader'
import QrPreview from '@/components/qr/QrPreview'
import { qrSchema } from '@/lib/validations'

function QrGenerator() {
  // URL that is shown as QR, only changes when the form is submitted
  const [qrUrl, setQrUrl] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(qrSchema),
    defaultValues: { url: '' },
  })

  const onSubmit = ({ url }) => setQrUrl(url)

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="QR Generator"
        description="Create a QR code from any URL, not only short links."
      />

      <div className="grid gap-6 md:grid-cols-[1fr_auto]">
        <Card>
          <CardHeader>
            <CardTitle>URL</CardTitle>
            <CardDescription>Enter the full URL, starting with http:// or https://</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
              <FormField
                id="url"
                label="URL"
                type="url"
                placeholder="https://example.com"
                autoComplete="off"
                error={errors.url}
                {...register('url')}
              />
              <Button type="submit" className="justify-self-start">
                <QrCode />
                Generate QR code
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="items-center md:w-80">
          <CardContent className="flex w-full justify-center">
            <QrPreview url={qrUrl} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QrGenerator
