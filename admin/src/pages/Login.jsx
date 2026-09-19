import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { TextField } from '../components/ui/FormField'
import Button from '../components/ui/Button'

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    setFormError('')
    try {
      await login(data)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-pine-600">
            <Heart size={18} className="text-marigold-300" fill="currentColor" strokeWidth={0} />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-ink">Sahayog Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage the site</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
          <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
          <TextField label="Password" name="password" type="password" register={register} error={errors.password} required />
          {formError && <p className="text-sm text-alert">{formError}</p>}
          <Button type="submit" loading={isSubmitting} className="w-full justify-center">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
