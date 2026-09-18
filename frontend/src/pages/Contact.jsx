import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Mail, Phone, MapPin } from 'lucide-react'
import Seo from '../components/ui/Seo'
import PageHero from '../components/sections/PageHero'
import Container from '../components/ui/Container'
import { TextField, TextAreaField, SelectField, FormSuccess } from '../components/forms/FormField'
import { contactSchema } from '../lib/schemas'
import { submitContactForm, getOrgInfo } from '../lib/api'
import { orgInfo as staticOrgInfo } from '../data/content'

const categories = ['General enquiry', 'Donation enquiry', 'CSR enquiry', 'Volunteer enquiry', 'Media enquiry']

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  // Live org contact details (email/phone/address) come from the backend's
  // site settings; map coordinates stay from the static file since the
  // backend's SiteSetting model doesn't store lat/lng yet.
  const [orgInfo, setOrgInfo] = useState(staticOrgInfo)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    getOrgInfo()
      .then((live) => setOrgInfo((prev) => ({ ...prev, ...live, mapCoords: prev.mapCoords })))
      .catch(() => {})
  }, [])

  async function onSubmit(data) {
    await submitContactForm(data)
    setSubmitted(true)
  }

  const mapEmbedSrc = `https://www.google.com/maps?q=${orgInfo.mapCoords.lat},${orgInfo.mapCoords.lng}&z=15&output=embed`

  return (
    <>
      <Seo title="Contact" description="Get in touch with Sahayog Foundation for general, donation, CSR, volunteer or media enquiries." path="/contact" />
      <PageHero eyebrow="Get in touch" title="Contact us" />

      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail size={19} className="mt-0.5 text-marigold-600" />
                  <div>
                    <p className="font-medium text-pine-700">Email</p>
                    <a href={`mailto:${orgInfo.email}`} className="text-moss hover:text-marigold-600">{orgInfo.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone size={19} className="mt-0.5 text-marigold-600" />
                  <div>
                    <p className="font-medium text-pine-700">Phone</p>
                    <a href={`tel:${orgInfo.phone}`} className="text-moss hover:text-marigold-600">{orgInfo.phone}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin size={19} className="mt-0.5 text-marigold-600" />
                  <div>
                    <p className="font-medium text-pine-700">Office</p>
                    <p className="text-moss">{orgInfo.address}</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 overflow-hidden rounded-sm border border-pine-100">
                <iframe
                  title="Sahayog Foundation office location"
                  src={mapEmbedSrc}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div>
              {submitted ? (
                <FormSuccess title="Message sent" description="We typically reply within 2 working days." />
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <TextField label="Name" name="name" register={register} error={errors.name} required />
                    <TextField label="Email" name="email" type="email" register={register} error={errors.email} required />
                    <TextField label="Phone (optional)" name="phone" register={register} error={errors.phone} />
                    <SelectField label="Category" name="category" register={register} error={errors.category} options={categories} required />
                  </div>
                  <TextField label="Subject" name="subject" register={register} error={errors.subject} required />
                  <TextAreaField label="Message" name="message" register={register} error={errors.message} required rows={6} />
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:opacity-60">
                    {isSubmitting ? <Loader2 size={17} className="animate-spin" /> : 'Send message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
