import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Building2, Handshake, LineChart } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import SectionHeading from '../components/ui/SectionHeading'
import { TextField, TextAreaField, SelectField, FormSuccess } from '../components/forms/FormField'
import { csrSchema } from '../lib/schemas'
import { submitCsrEnquiry, getPartners, getProjects } from '../lib/api'

const partnershipTypes = [
  { icon: Building2, title: 'Programme sponsorship', description: 'Fund a full project or a specific site within one.' },
  { icon: Handshake, title: 'Employee engagement', description: 'Volunteering days, skilled-volunteering, and giving matches.' },
  { icon: LineChart, title: 'Multi-year partnership', description: 'A structured 2–3 year CSR commitment with quarterly reporting.' },
]

export default function CSRPartnership() {
  const [submitted, setSubmitted] = useState(false)
  const [partners, setPartners] = useState([])
  const [projects, setProjects] = useState([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(csrSchema),
  })

  useEffect(() => {
    getPartners().then(setPartners).catch(() => setPartners([]))
    getProjects().then((res) => setProjects(res.items)).catch(() => setProjects([]))
  }, [])

  async function onSubmit(data) {
    await submitCsrEnquiry(data)
    setSubmitted(true)
  }

  return (
    <>
      <Seo title="CSR & Corporate Partnerships" description="Partner with Sahayog Foundation on CSR programmes — sponsorship, employee engagement, and multi-year commitments." path="/get-involved/csr-partnership" />
      <PageHero
        eyebrow="Get involved"
        title="CSR & corporate partnerships"
        description="Structured, reportable partnerships — not a one-time cheque and a photo."
        image="https://images.unsplash.com/photo-1591382696684-38c427c7547a?q=80&w=1800&auto=format&fit=crop"
      />

      <section className="py-20">
        <Container>
          <SectionHeading eyebrow="How we work together" title="Three ways companies partner with us" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {partnershipTypes.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-sm border border-pine-100 p-6">
                <Icon size={24} className="text-marigold-600" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg text-pine-700">{title}</h3>
                <p className="mt-2 text-sm text-moss leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper-dim py-20">
        <Container>
          <SectionHeading eyebrow="Past & current partners" title="Companies we've worked with" />
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {partners.map((p) => (
              <div key={p.id} className="flex h-20 items-center justify-center rounded-sm border border-pine-100 bg-white px-4">
                <span className="text-center text-sm font-medium text-pine-600">{p.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-2xl text-pine-700">Start a conversation</h2>
            {submitted ? (
              <div className="mt-6">
                <FormSuccess title="Enquiry received" description="Our partnerships lead will reach out within 2 working days." />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <TextField label="Company name" name="companyName" register={register} error={errors.companyName} required />
                  <TextField label="Company website (optional)" name="website" register={register} error={errors.website} />
                  <TextField label="Contact person" name="contactPerson" register={register} error={errors.contactPerson} required />
                  <TextField label="Designation" name="designation" register={register} error={errors.designation} required />
                  <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                  <TextField label="Phone" name="phone" register={register} error={errors.phone} required placeholder="98XXXXXXXX" />
                </div>
                <TextField label="CSR interests" name="csrInterests" register={register} error={errors.csrInterests} required placeholder="e.g. Education, healthcare" />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <SelectField
                    label="Estimated budget"
                    name="estimatedBudget"
                    register={register}
                    error={errors.estimatedBudget}
                    options={['Under ₹5 lakh', '₹5–25 lakh', '₹25 lakh – ₹1 crore', 'Above ₹1 crore']}
                    required
                  />
                  <SelectField
                    label="Preferred project (optional)"
                    name="preferredProject"
                    register={register}
                    options={projects.map((p) => ({ value: p.id, label: p.title }))}
                  />
                </div>
                <TextAreaField label="Message" name="message" register={register} />
                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                  {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Submit enquiry'}
                </button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
