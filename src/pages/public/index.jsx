import { Link } from 'react-router'
import { ArrowRight, Link2, Pencil, QrCode } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

const features = [
  {
    icon: Link2,
    title: 'Custom short codes',
    description: 'Pick a memorable link name, like /promo-2026.',
  },
  {
    icon: QrCode,
    title: 'Instant QR codes',
    description: 'Generate a QR code for every link and download it as PNG.',
  },
  {
    icon: Pencil,
    title: 'Change the destination anytime',
    description: 'Update the destination URL without changing a link you already shared.',
  },
]

export default function LandingPage() {
  const { isLoggedIn } = useAuth()

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Shorten links, share them easily
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Turn long URLs into clean short links, complete with QR codes.
        </p>
        <Link
          to={isLoggedIn ? '/dashboard' : '/register'}
          className={buttonVariants({ size: 'lg' })}
        >
          {isLoggedIn ? 'Open dashboard' : 'Get started'}
          <ArrowRight />
        </Link>
      </section>

      <section className="grid gap-4 pb-20 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                <feature.icon className="size-5" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  )
}
