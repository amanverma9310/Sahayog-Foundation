import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Clock, MapPin } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import { TextField, TextAreaField, SelectField, FormSuccess } from '../components/forms/FormField'
import { internshipSchema } from '../lib/schemas'
import { submitInternshipApplication } from '../lib/api'

const openRoles = [
  {
    title: 'Communications Intern',
    duration: '3 months',
    mode: 'Hybrid — Delhi',
    responsibilities: 'Support story-gathering, social content, and the quarterly report.',
  },
  {
    title: 'Programme Research Intern',
    duration: '4–6 months',
    mode: 'On-site — Delhi',
    responsibilities: 'Assist with project impact assessments and data collection in the field.',
  },
  {
    title: 'Design Intern',
    duration: '3 months',
    mode: 'Remote',
    responsibilities: 'Support gallery curation, report layout, and campaign visuals.',
  },
]

export default function Internship() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(internshipSchema),
  })

  async function onSubmit(data) {
    await submitInternshipApplication(data)
    setSubmitted(true)
  }

  return (
    <>
      <Seo title="Internships" description="Structured internship roles at Sahayog Foundation for students and early-career professionals." path="/get-involved/internship" />
      <PageHero
        eyebrow="Get involved"
        title="Internships"
        description="Short, structured roles with real ownership — not fetch-coffee internships."
        image="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-16">
        <Container>
          <h2 className="font-display text-2xl text-pine-700">Open roles</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {openRoles.map((role) => (
              <div key={role.title} className="rounded-sm border border-pine-100 p-5">
                <h3 className="font-display text-lg text-pine-700">{role.title}</h3>
                <p className="mt-2 text-sm text-moss leading-relaxed">{role.responsibilities}</p>
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-moss">
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {role.duration}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> {role.mode}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-16 max-w-2xl border-t border-pine-100 pt-12">
            <h2 className="font-display text-2xl text-pine-700">Apply</h2>
            {submitted ? (
              <div className="mt-6">
                <FormSuccess title="Application submitted" description="Our team reviews applications weekly — we'll be in touch either way." />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Full name" name="name" register={register} error={errors.name} required />
                  <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                  <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
                  <TextField label="College / University" name="college" register={register} error={errors.college} required />
                  <TextField label="Course" name="course" register={register} error={errors.course} required />
                  <SelectField
                    label="Year of study"
                    name="year"
                    register={register}
                    error={errors.year}
                    options={['1st year', '2nd year', '3rd year', 'Final year', 'Graduated']}
                    required
                  />
                </div>
                <TextField label="Relevant skills (optional)" name="skills" register={register} />
                <TextAreaField
                  label="Why do you want to join?"
                  name="motivation"
                  register={register}
                  error={errors.motivation}
                  required
                  rows={5}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Portfolio URL (optional)" name="portfolio" register={register} error={errors.portfolio} />
                  <TextField label="LinkedIn URL (optional)" name="linkedin" register={register} error={errors.linkedin} />
                </div>
                <p className="text-sm text-moss">Resume upload will be available once the backend is connected.</p>
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
