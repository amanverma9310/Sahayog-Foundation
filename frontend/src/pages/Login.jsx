import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { TextField } from '../components/forms/FormField'
import { loginSchema } from '../lib/schemas'
import { login } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    setFormError('')
    try {
      const res = await login(data)
      localStorage.setItem('sahayog_token', res.token)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message || 'Invalid email or password.')
    }
  }

  return (
    <>
      <Seo title="Log in" description="Log in to your Sahayog Foundation donor account." path="/login" />
      <Container className="flex min-h-screen items-center justify-center py-32">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-pine-700">Welcome back</h1>
          <p className="mt-2 text-moss">Log in to view your donations, receipts and 80G requests.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
            <TextField label="Password" name="password" type="password" register={register} error={errors.password} required />
            {formError && <p className="text-sm text-alert">{formError}</p>}
            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-pine-700 hover:text-marigold-600">Forgot password?</Link>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-moss">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-pine-700 hover:text-marigold-600">Create one</Link>
          </p>
        </div>
      </Container>
    </>
  )
}
