import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { TextField } from '../components/forms/FormField'
import { registerSchema } from '../lib/schemas'
import { register as registerUser } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data) {
    setFormError('')
    try {
      const res = await registerUser(data)
      localStorage.setItem('sahayog_token', res.token)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <Seo title="Create account" description="Create a donor account with Sahayog Foundation." path="/register" />
      <Container className="flex min-h-screen items-center justify-center py-32">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-pine-700">Create your account</h1>
          <p className="mt-2 text-moss">Track your donations and receipts in one place.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <TextField label="Full name" name="name" register={register} error={errors.name} required />
            <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
            <TextField label="Password" name="password" type="password" register={register} error={errors.password} required />
            <TextField label="Confirm password" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} required />
            {formError && <p className="text-sm text-alert">{formError}</p>}
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
              {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-moss">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-pine-700 hover:text-marigold-600">Log in</Link>
          </p>
        </div>
      </Container>
    </>
  )
}
