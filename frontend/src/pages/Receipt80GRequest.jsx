import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import { TextField, TextAreaField, FormSuccess } from '../components/forms/FormField'
import { receiptRequestSchema } from '../lib/schemas'
import { submit80GRequest } from '../lib/api'

export default function Receipt80GRequest() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(receiptRequestSchema),
  })

  async function onSubmit(data) {
    await submit80GRequest({ ...data, donationAmount: Number(data.donationAmount) })
    setSubmitted(true)
  }

  return (
    <>
      <Seo title="Request an 80G Certificate" description="Request an 80G tax deduction certificate for your donation to Sahayog Foundation." path="/request-80g" />
      <PageHero eyebrow="Tax receipts" title="Request an 80G certificate" description="Have your donation ID or transaction reference ready." />

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            {submitted ? (
              <FormSuccess
                title="Request submitted"
                description="Our finance team verifies each request before issuing a certificate — this typically takes 5–7 working days. You can track status from your dashboard."
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Full name (as per PAN)" name="fullName" register={register} error={errors.fullName} required />
                  <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                  <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
                  <TextField label="PAN" name="pan" register={register} error={errors.pan} required placeholder="AAAAA1234A" />
                </div>
                <TextAreaField label="Address" name="address" register={register} error={errors.address} required rows={3} />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Donation ID / transaction reference" name="donationId" register={register} error={errors.donationId} required />
                  <TextField label="Donation amount (₹)" name="donationAmount" type="number" register={register} error={errors.donationAmount} required />
                </div>
                <TextAreaField label="Message (optional)" name="message" register={register} />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                  {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Submit request'}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
