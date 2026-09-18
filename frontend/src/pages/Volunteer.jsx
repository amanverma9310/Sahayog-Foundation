import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import { TextField, TextAreaField, FormSuccess } from '../components/forms/FormField'
import { volunteerSchema } from '../lib/schemas'
import { submitVolunteerApplication } from '../lib/api'
import { categories } from '../data/content'

export default function Volunteer() {
  const [submitted, setSubmitted] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState([])
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(volunteerSchema), defaultValues: { areasOfInterest: [] } })

  function toggleInterest(cat) {
    const next = selectedInterests.includes(cat)
      ? selectedInterests.filter((c) => c !== cat)
      : [...selectedInterests, cat]
    setSelectedInterests(next)
    setValue('areasOfInterest', next, { shouldValidate: true })
  }

  async function onSubmit(data) {
    await submitVolunteerApplication(data)
    setSubmitted(true)
  }

  return (
    <>
      <Seo title="Volunteer" description="Register to volunteer with Sahayog Foundation's field programmes." path="/get-involved/volunteer" />
      <PageHero
        eyebrow="Get involved"
        title="Volunteer with us"
        description="Most roles need no prior experience — a short orientation covers what you need before your first shift."
        image="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1800&auto=format&fit=crop"
      />
      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-2xl">
            {submitted ? (
              <FormSuccess
                title="Application received"
                description="We'll reach out within 5 working days to schedule your orientation."
              />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Full name" name="name" register={register} error={errors.name} required />
                  <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                  <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
                  <TextField label="City" name="city" register={register} error={errors.city} required />
                </div>

                <div>
                  <p className="text-sm font-medium text-pine-700">Areas of interest <span className="text-marigold-600">*</span></p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => toggleInterest(cat)}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                          selectedInterests.includes(cat)
                            ? 'bg-marigold-500 text-pine-800'
                            : 'bg-paper-dim text-moss hover:bg-pine-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {errors.areasOfInterest && <p className="mt-1.5 text-sm text-alert">{errors.areasOfInterest.message}</p>}
                </div>

                <TextField
                  label="Availability"
                  name="availability"
                  register={register}
                  error={errors.availability}
                  required
                  placeholder="e.g. Weekends, evenings after 6pm"
                />
                <TextField label="Relevant skills (optional)" name="skills" register={register} />
                <TextAreaField label="Anything else you'd like us to know?" name="message" register={register} />

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                  {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Submit application'}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
