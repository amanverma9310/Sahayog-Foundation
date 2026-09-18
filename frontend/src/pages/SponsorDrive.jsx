import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, UtensilsCrossed, BookOpen, Stethoscope, Snowflake, Users, Sparkles } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import { TextField, TextAreaField, SelectField, FormSuccess } from '../components/forms/FormField'
import { sponsorSchema } from '../lib/schemas'
import { submitSponsorRequest } from '../lib/api'

const driveTypes = [
  { icon: UtensilsCrossed, label: 'Food distribution' },
  { icon: BookOpen, label: 'School supplies' },
  { icon: Stethoscope, label: 'Healthcare camp' },
  { icon: Snowflake, label: 'Winter relief' },
  { icon: Users, label: 'Community programme' },
  { icon: Sparkles, label: 'Custom campaign' },
]

export default function SponsorDrive() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(sponsorSchema),
  })

  async function onSubmit(data) {
    await submitSponsorRequest(data)
    setSubmitted(true)
  }

  return (
    <>
      <Seo title="Sponsor a Drive" description="Fund a specific relief drive — food distribution, healthcare camps, winter relief and more." path="/get-involved/sponsor-a-drive" />
      <PageHero
        eyebrow="Get involved"
        title="Sponsor a drive"
        description="Fund a specific, dated activity rather than a general fund — and get a report back on exactly what it achieved."
        image="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {driveTypes.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-sm border border-pine-100 p-5 text-center">
                <Icon size={22} className="text-marigold-600" strokeWidth={1.75} />
                <p className="text-sm font-medium text-pine-700">{label}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-14 max-w-2xl border-t border-pine-100 pt-12">
            {submitted ? (
              <FormSuccess title="Request received" description="Our partnerships team will follow up with a proposal within 3 working days." />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Your name" name="name" register={register} error={errors.name} required />
                  <TextField label="Organization (optional)" name="organization" register={register} />
                  <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                  <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
                </div>
                <SelectField
                  label="Preferred drive type"
                  name="preferredDrive"
                  register={register}
                  error={errors.preferredDrive}
                  options={driveTypes.map((d) => d.label)}
                  required
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Budget range"
                    name="budgetRange"
                    register={register}
                    error={errors.budgetRange}
                    options={['Under ₹50,000', '₹50,000 – ₹2,00,000', '₹2,00,000 – ₹5,00,000', 'Above ₹5,00,000']}
                    required
                  />
                  <TextField label="Preferred location (optional)" name="preferredLocation" register={register} />
                </div>
                <TextField label="Expected date (optional)" name="expectedDate" type="date" register={register} />
                <TextAreaField label="Anything else we should know?" name="message" register={register} />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                  {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Send request'}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
