import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import { TextField, TextAreaField } from '../components/ui/FormField'
import { getSiteSettings, updateSiteSettings } from '../lib/api'

export default function SiteSettings() {
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm()

  useEffect(() => {
    getSiteSettings().then((data) => {
      reset({
        heroTitle: data.heroTitle || '',
        heroSubtitle: data.heroSubtitle || '',
        heroMediaUrl: data.heroMediaUrl || '',
        orgName: data.orgName || '',
        orgEmail: data.orgEmail || '',
        orgPhone: data.orgPhone || '',
        orgAddress: data.orgAddress || '',
        registrationNumber: data.registrationNumber || '',
        pan: data.pan || '',
        instagram: data.socialLinks?.instagram || '',
        facebook: data.socialLinks?.facebook || '',
        linkedin: data.socialLinks?.linkedin || '',
        x: data.socialLinks?.x || '',
        youtube: data.socialLinks?.youtube || '',
      })
      setLoaded(true)
    }).catch((err) => setError(err.message))
  }, [reset])

  async function onSubmit(data) {
    setError('')
    setSaved(false)
    try {
      await updateSiteSettings({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroMediaUrl: data.heroMediaUrl,
        orgName: data.orgName,
        orgEmail: data.orgEmail,
        orgPhone: data.orgPhone,
        orgAddress: data.orgAddress,
        registrationNumber: data.registrationNumber,
        pan: data.pan,
        socialLinks: {
          instagram: data.instagram,
          facebook: data.facebook,
          linkedin: data.linkedin,
          x: data.x,
          youtube: data.youtube,
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  if (!loaded) return <Spinner full />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      {error && <p className="rounded-md bg-red-50 px-4 py-2 text-sm text-alert">{error}</p>}
      {saved && <p className="rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">Settings saved.</p>}

      <div className="card space-y-4 p-5">
        <p className="text-sm font-semibold text-ink">Homepage hero</p>
        <TextField label="Hero title" name="heroTitle" register={register} />
        <TextAreaField label="Hero subtitle" name="heroSubtitle" register={register} rows={2} />
        <TextField label="Hero media URL" name="heroMediaUrl" register={register} placeholder="https://…" />
      </div>

      <div className="card space-y-4 p-5">
        <p className="text-sm font-semibold text-ink">Organisation details</p>
        <TextField label="Organisation name" name="orgName" register={register} />
        <TextField label="Email" name="orgEmail" type="email" register={register} />
        <TextField label="Phone" name="orgPhone" register={register} />
        <TextAreaField label="Address" name="orgAddress" register={register} rows={2} />
        <TextField label="Registration number" name="registrationNumber" register={register} />
        <TextField label="PAN" name="pan" register={register} />
      </div>

      <div className="card space-y-4 p-5">
        <p className="text-sm font-semibold text-ink">Social links</p>
        <TextField label="Instagram" name="instagram" register={register} />
        <TextField label="Facebook" name="facebook" register={register} />
        <TextField label="LinkedIn" name="linkedin" register={register} />
        <TextField label="X (Twitter)" name="x" register={register} />
        <TextField label="YouTube" name="youtube" register={register} />
      </div>

      <Button type="submit" loading={isSubmitting}>
        Save settings
      </Button>
    </form>
  )
}
