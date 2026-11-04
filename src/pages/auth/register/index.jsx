import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import FormField from '@/components/FormField'
import { useAuth } from '@/hooks/useAuth'
import { registerSchema } from '@/lib/validations'

function Register() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async ({ username, password }) => {
    try {
      const { data } = await registerAccount({ username, password })
      toast.success('Account created')
      // Login page shows that the account is waiting for admin approval
      navigate('/login', { state: { registeredUsername: data.username } })
    } catch (error) {
      // 409 = username already exist, show it under the username field
      if (error.status === 409) {
        setError('username', { message: 'Username is already taken' })
        return
      }
      toast.error(error.message)
    }
  }

  return (
    <div className="flex justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>Create an account to start shortening links.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="grid gap-4">
            <FormField
              id="username"
              label="Username"
              autoComplete="username"
              description="5-50 characters, lowercase letters or numbers."
              error={errors.username}
              {...register('username')}
            />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              description="At least 8 characters."
              error={errors.password}
              {...register('password')}
            />
            <FormField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />
          </CardContent>

          <CardFooter className="mt-6 flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </Button>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Register
