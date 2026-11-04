import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router'
import { Clock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/FormField'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema } from '@/lib/validations'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Set by the register page after a successful registration
  const registeredUsername = location.state?.registeredUsername

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: registeredUsername ?? '', password: '' },
  })

  const onSubmit = async (values) => {
    try {
      await login(values)
      toast.success('Login successful')

      // Back to the page that was opened before redirected to login
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>Sign in to manage your short links.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid gap-4">
            {registeredUsername && (
              <div role="status" className="flex gap-3 rounded-lg border bg-muted/50 p-3 text-sm">
                <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <p>
                  Your account <span className="font-medium">{registeredUsername}</span> is waiting for
                  admin approval. You can log in once it has been approved.
                </p>
              </div>
            )}
            <FormField
              id="username"
              label="Username"
              autoComplete="username"
              error={errors.username}
              {...register('username')}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
              {...register('password')}
            />
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login
