import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import Container from '../components/ui/Container'
import { TextField, FormSuccess } from '../components/forms/FormField'
import { forgotPassword } from '../lib/api'

const schema = z.object({ email: z.string().trim().email('Enter a valid email address') })

export default function ForgotPassword() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })

  async function onSubmit(data) {
    // Always shows the success state, even on failure — this is
    // intentional (see authController.forgotPassword) so the response
    // never reveals whether an email is registered.
    try {
      await forgotPassword(data)
    } finally {
      setSent(true)
    }
  }

  return (
    <>
      <Seo title="Reset password" description="Reset your Sahayog Foundation donor account password." path="/forgot-password" />
      <Container className="flex min-h-screen items-center justify-center py-32">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-pine-700">Reset your password</h1>
          <p className="mt-2 text-moss">We'll email you a link to reset it.</p>

          {sent ? (
            <div className="mt-8">
              <FormSuccess title="Check your inbox" description="If an account exists for that email, a reset link is on its way." />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Send reset link'}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-moss">
            <Link to="/login" className="font-medium text-pine-700 hover:text-marigold-600">Back to log in</Link>
          </p>
        </div>
      </Container>
    </>
  )
}
